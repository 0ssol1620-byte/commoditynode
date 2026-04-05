# scripts/forecast_autogluon_prod.py
"""
CommodityNode — AutoGluon Chronos-Bolt-Small Production Forecast
================================================================
LoRA fine-tuning + known calendar covariates for all 19 commodities.
Merges ag_median/ag_p10/ag_p90 into existing forecast.json.
"""
import json
import os
import sys
import warnings
from datetime import datetime, timezone

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import COMMODITIES, build_calendar_flags, PROPER_CALENDAR_COLS

try:
    from autogluon.timeseries import TimeSeriesDataFrame, TimeSeriesPredictor
    AG_AVAILABLE = True
except ImportError:
    AG_AVAILABLE = False
    print("AutoGluon not available — skipping")

import yfinance as yf

PREDICTION_LENGTH = 90    # days
AG_TIME_LIMIT     = 300   # seconds per commodity fine-tuning
PERIOD            = "5y"


def _fetch_closes(symbol: str) -> pd.Series | None:
    try:
        df = yf.Ticker(symbol).history(period=PERIOD)
        if df.empty:
            return None
        s = df["Close"].dropna()
        idx = pd.DatetimeIndex([pd.Timestamp(ts).tz_localize(None).normalize() for ts in s.index])
        s.index = idx
        bday = pd.bdate_range(start=idx[0], end=idx[-1])
        return s.reindex(bday).ffill().dropna()
    except Exception as e:
        print(f"  {symbol}: {e}")
        return None


def _build_ts_df(key: str, closes: pd.Series) -> "TimeSeriesDataFrame":
    cal   = build_calendar_flags(closes.index)
    frame = pd.DataFrame({"item_id": key, "timestamp": closes.index, "target": closes.values})
    for col in PROPER_CALENDAR_COLS:
        frame[col] = cal[col].values
    return TimeSeriesDataFrame.from_data_frame(frame, id_column="item_id", timestamp_column="timestamp")


def _build_future_cov(key: str, last_date: pd.Timestamp) -> "TimeSeriesDataFrame":
    future_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1), periods=PREDICTION_LENGTH)
    cal_fut      = build_calendar_flags(future_dates)
    fut = pd.DataFrame({"item_id": key, "timestamp": future_dates})
    for col in PROPER_CALENDAR_COLS:
        fut[col] = cal_fut[col].values
    return TimeSeriesDataFrame.from_data_frame(fut, id_column="item_id", timestamp_column="timestamp")


def run():
    if not AG_AVAILABLE:
        print("AutoGluon unavailable — skipping")
        return

    out_path = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "forecast.json")
    with open(out_path) as f:
        forecast = json.load(f)

    now = datetime.now(timezone.utc).isoformat()
    print(f"\nAutoGluon Chronos-Bolt-Small Production Forecast")
    print(f"Commodities: {len(COMMODITIES)} | prediction_length={PREDICTION_LENGTH}d")
    print("=" * 60)

    for key, meta in COMMODITIES.items():
        sym = meta["symbol"]
        print(f"\n  [{key}] {sym}...")

        closes = _fetch_closes(sym)
        if closes is None or len(closes) < 200:
            print(f"    ✗ insufficient data")
            continue

        try:
            ts_df = _build_ts_df(key, closes)

            predictor = TimeSeriesPredictor(
                prediction_length=PREDICTION_LENGTH,
                target="target",
                known_covariates_names=PROPER_CALENDAR_COLS,
                freq="B",
            )
            print(f"    Fine-tuning ({AG_TIME_LIMIT}s)...")
            predictor.fit(
                ts_df,
                hyperparameters={
                    "Chronos": {
                        "model_path": "amazon/chronos-bolt-small",
                        "fine_tune":  True,
                    }
                },
                time_limit=AG_TIME_LIMIT,
                verbosity=0,
            )

            kc_df  = _build_future_cov(key, closes.index[-1])
            preds  = predictor.predict(ts_df, known_covariates=kc_df)

            item_preds = preds.loc[key] if key in preds.index.get_level_values(0) else preds
            median_arr = item_preds["mean"].values[:PREDICTION_LENGTH]

            p10_col = "0.1"  if "0.1"  in item_preds.columns else "mean"
            p90_col = "0.9"  if "0.9"  in item_preds.columns else "mean"
            p10_arr = item_preds[p10_col].values[:PREDICTION_LENGTH]
            p90_arr = item_preds[p90_col].values[:PREDICTION_LENGTH]

            future_dates = pd.bdate_range(
                start=closes.index[-1] + pd.Timedelta(days=1),
                periods=PREDICTION_LENGTH,
            )

            if key not in forecast:
                forecast[key] = {}
            forecast[key]["ag_forecast"] = {
                "dates":   [d.strftime("%Y-%m-%d") for d in future_dates],
                "median":  [round(float(v), 4) for v in median_arr],
                "p10":     [round(float(v), 4) for v in p10_arr],
                "p90":     [round(float(v), 4) for v in p90_arr],
                "model":   "chronos-bolt-small/lora",
                "updated_at": now,
            }

            ag_30d = float(median_arr[29]) if len(median_arr) > 29 else float(median_arr[-1])
            cp     = float(closes.iloc[-1])
            print(f"    ✓ 30d: {cp:.2f} → {ag_30d:.2f} ({(ag_30d-cp)/cp*100:+.1f}%)")

        except Exception as e:
            print(f"    ✗ {e}")
            continue

    with open(out_path, "w") as f:
        json.dump(forecast, f, indent=2)
    print(f"\n✅ 완료: {len([k for k in forecast if 'ag_forecast' in forecast.get(k,{})])}개 → forecast.json")


if __name__ == "__main__":
    run()
