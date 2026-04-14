#!/usr/bin/env python3
"""
CommodityNode — TimesFM 2.5 Production Forecast
===============================================
Adds `timesfm_forecast` blocks to assets/data/forecast.json for the existing
commodity universe, using the PyTorch TimesFM 2.5 200M model.

Implementation notes:
- Uses local/manual loading because the current installed timesfm package has a
  `from_pretrained()` argument-passing bug in this environment.
- Reuses CommodityNode's existing commodity universe and history fetch logic.
- Produces median / p10 / p90 arrays with 90 business-day horizon.
"""

import json
import os
import sys
import warnings
from datetime import datetime, timezone

import numpy as np
from huggingface_hub import hf_hub_download

warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.dirname(__file__))

try:
    from timesfm import ForecastConfig, TimesFM_2p5_200M_torch
    TIMESFM_AVAILABLE = True
    TIMESFM_IMPORT_ERROR = None
except ImportError as e:
    TIMESFM_AVAILABLE = False
    TIMESFM_IMPORT_ERROR = str(e)


def load_shared_inputs():
    try:
        from forecast_chronos2 import COMMODITIES, fetch_history
        return COMMODITIES, fetch_history, None
    except Exception as e:
        return None, None, str(e)


PREDICTION_LENGTH = 90
MODEL_ID = "google/timesfm-2.5-200m-pytorch"
WEIGHTS_FILE = "model.safetensors"
QUANTILE_INDEX = {
    "p10": 1,
    "p20": 2,
    "p30": 3,
    "p40": 4,
    "median": 5,
    "p60": 6,
    "p70": 7,
    "p80": 8,
    "p90": 9,
}


def load_timesfm_model(max_context: int = 1280, max_horizon: int = 128) -> "TimesFM_2p5_200M_torch":
    weights_path = hf_hub_download(repo_id=MODEL_ID, filename=WEIGHTS_FILE)

    model = TimesFM_2p5_200M_torch(
        config={"model_id": MODEL_ID},
        torch_compile=False,
    )
    model.model.load_checkpoint(weights_path, torch_compile=False)
    model.compile(
        ForecastConfig(
            max_context=max_context,
            max_horizon=max_horizon,
            normalize_inputs=True,
            per_core_batch_size=1,
        )
    )
    return model


def _safe_round_list(values):
    return [round(float(v), 4) for v in values]


def run():
    if not TIMESFM_AVAILABLE:
        print(f"TimesFM unavailable: {TIMESFM_IMPORT_ERROR}")
        return 1

    COMMODITIES, fetch_history, shared_import_error = load_shared_inputs()
    if shared_import_error:
        print(f"Shared forecast helpers unavailable: {shared_import_error}")
        return 1

    out_path = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "forecast.json")
    with open(out_path) as f:
        forecast = json.load(f)

    now = datetime.now(timezone.utc).isoformat()
    print("\nTimesFM 2.5 Production Forecast")
    print(f"Model: {MODEL_ID}")
    print(f"Commodities: {len(COMMODITIES)} | prediction_length={PREDICTION_LENGTH}d")
    print("=" * 60)

    model = load_timesfm_model()
    completed = 0

    for key, meta in COMMODITIES.items():
        print(f"\n  [{key}] {meta['symbol']}...")
        closes = fetch_history(meta["symbol"], period="5y")
        if closes is None or len(closes) < 200:
            print("    ✗ insufficient data")
            continue

        try:
            series = closes.values.astype(float)
            mean, full = model.forecast(horizon=PREDICTION_LENGTH, inputs=[series])

            median_arr = mean[0][:PREDICTION_LENGTH]
            p10_arr = full[0][:PREDICTION_LENGTH, QUANTILE_INDEX["p10"]]
            p90_arr = full[0][:PREDICTION_LENGTH, QUANTILE_INDEX["p90"]]

            future_dates = closes.index[-PREDICTION_LENGTH:].copy()
            if len(future_dates) != PREDICTION_LENGTH:
                future_dates = None
            future_dates = __import__('pandas').bdate_range(
                start=closes.index[-1] + __import__('pandas').Timedelta(days=1),
                periods=PREDICTION_LENGTH,
            )

            if key not in forecast:
                forecast[key] = {}

            forecast[key]["timesfm_forecast"] = {
                "dates": [d.strftime("%Y-%m-%d") for d in future_dates],
                "median": _safe_round_list(median_arr),
                "p10": _safe_round_list(p10_arr),
                "p90": _safe_round_list(p90_arr),
                "model": MODEL_ID,
                "runtime": "pytorch-manual-load",
                "updated_at": now,
            }

            cp = float(closes.iloc[-1])
            fc_30 = float(median_arr[29]) if len(median_arr) > 29 else float(median_arr[-1])
            fc_90 = float(median_arr[89]) if len(median_arr) > 89 else float(median_arr[-1])
            print(f"    ✓ 30d: {cp:.2f} → {fc_30:.2f} ({(fc_30 - cp) / cp * 100:+.1f}%) | 90d: {fc_90:.2f}")
            completed += 1
        except Exception as e:
            print(f"    ✗ {e}")
            continue

    tmp_path = out_path + ".tmp"
    with open(tmp_path, "w") as f:
        json.dump(forecast, f, indent=2)
    os.replace(tmp_path, out_path)

    print(f"\n✅ 완료: {completed}개 commodity에 timesfm_forecast 추가 → assets/data/forecast.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(run())
