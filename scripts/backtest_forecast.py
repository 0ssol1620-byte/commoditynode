"""
CommodityNode — Chronos-2 Backtest: 4-Model Walk-Forward Comparison
====================================================================
Model A: Chronos-2 baseline (price history only)
Model B: Chronos-2 + generic macro (DXY/VIX/US10Y + technical)
Model C: Chronos-2 + proper covariates (futures spread + calendar events)
Model D: AutoGluon Chronos-2 fine-tuned (if autogluon installed)
+ GradBoost direction overlay (separate FDA metric)

Walk-forward, no look-ahead bias, 30-day horizon.
Key advantage of Model C: future_df calendar flags use REAL scheduled dates.
"""
import json
import os
import sys
import warnings
from datetime import datetime, timezone

import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import (
    COVARIATE_COLS,
    PROPER_LAST_KNOWN_COLS,
    PROPER_CALENDAR_COLS,
    PROPER_COVARIATE_COLS,
    CHRONOS2_AVAILABLE,
    fetch_covariates,
    add_technical_features,
    add_futures_spread,
    build_calendar_flags,
    forecast_fallback,
)
from direction_classifier import train_and_predict as clf_predict

# AutoGluon optional
try:
    from autogluon.timeseries import TimeSeriesDataFrame, TimeSeriesPredictor
    AG_AVAILABLE = True
    print("✓ AutoGluon TimeSeries 로드 성공")
except ImportError:
    AG_AVAILABLE = False
    print("  AutoGluon 없음 — Model D 건너뜀")

# ── 설정 ─────────────────────────────────────────────────────────────────
BACKTEST_COMMODITIES = {
    "crude_oil":   "CL=F",
    "gold":        "GC=F",
    "copper":      "HG=F",
    "natural_gas": "NG=F",
    "wheat":       "ZW=F",
}
HORIZON      = 30
STEP         = 30
TEST_WINDOWS = 8
PERIOD       = "3y"
AG_TIME_LIMIT = 600   # seconds per commodity for AutoGluon fit


def load_pipeline():
    """Chronos-2 small 로드 (backtest 속도 최적화)."""
    if not CHRONOS2_AVAILABLE:
        return None
    try:
        import torch
        from chronos import Chronos2Pipeline
        print("  Chronos-2-small 로드 중...")
        return Chronos2Pipeline.from_pretrained(
            "amazon/chronos-2-small",
            device_map="cpu",
            torch_dtype=torch.float32,
        )
    except Exception:
        try:
            import torch
            from chronos import Chronos2Pipeline
            print("  Chronos-2 (full) 로드 중...")
            return Chronos2Pipeline.from_pretrained(
                "amazon/chronos-2",
                device_map="cpu",
                torch_dtype=torch.float32,
            )
        except Exception as e:
            print(f"  모델 로드 실패: {e}")
            return None


def fetch_commodity_history(symbol, period="3y"):
    """단일 원자재 가격 시리즈 수집 (영업일 인덱스)."""
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        s = df["Close"].dropna()
        idx = pd.DatetimeIndex([
            pd.Timestamp(ts).tz_localize(None).normalize() for ts in s.index
        ])
        s.index = idx
        bday = pd.bdate_range(start=idx[0], end=idx[-1])
        return s.reindex(bday).ffill().dropna()
    except Exception as e:
        print(f"  {symbol} 수집 실패: {e}")
        return None


# ── Model A/B: baseline / generic macro ──────────────────────────────────────

def predict_window(pipeline, closes, macro_df, use_covariates, horizon):
    """
    Model A (use_covariates=False): price only.
    Model B (use_covariates=True):  price + DXY/VIX/US10Y + technical.
    future_df: last-known constant forward-fill (no real future info).
    """
    if pipeline is None:
        median, _, _ = forecast_fallback(closes, horizon)
        return median

    try:
        import torch
        ctx = pd.DataFrame({"target": closes})

        if use_covariates:
            if not macro_df.empty:
                ctx = ctx.join(macro_df[["dxy", "vix", "us10y"]], how="left")
                ctx[["dxy", "vix", "us10y"]] = ctx[["dxy", "vix", "us10y"]].ffill().fillna(0)
            else:
                ctx["dxy"] = ctx["vix"] = ctx["us10y"] = 0.0
            tech = add_technical_features(closes)
            ctx = ctx.join(tech, how="left")
            ctx[COVARIATE_COLS[3:]] = ctx[COVARIATE_COLS[3:]].ffill().fillna(0)

        ctx = ctx.dropna(subset=["target"])
        ctx["id"] = "item"
        ctx["timestamp"] = ctx.index
        ctx = ctx.reset_index(drop=True)

        if use_covariates:
            last_date    = closes.index[-1]
            future_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1), periods=horizon)
            last_known   = ctx[COVARIATE_COLS].iloc[-1].fillna(0)
            fut = pd.DataFrame({col: [last_known[col]] * horizon for col in COVARIATE_COLS})
            fut["id"] = "item"
            fut["timestamp"] = future_dates
            pred_df = pipeline.predict_df(
                ctx, future_df=fut,
                prediction_length=horizon, quantile_levels=[0.5],
                id_column="id", timestamp_column="timestamp", target="target",
            )
        else:
            pred_df = pipeline.predict_df(
                ctx,
                prediction_length=horizon, quantile_levels=[0.5],
                id_column="id", timestamp_column="timestamp", target="target",
            )

        item = pred_df[pred_df["id"] == "item"].sort_values("timestamp")
        return item["predictions"].values

    except Exception as e:
        print(f"    A/B 예측 실패: {e} → fallback")
        median, _, _ = forecast_fallback(closes, horizon)
        return median


# ── Model C: proper covariates ────────────────────────────────────────────────

def predict_window_proper(pipeline, closes, macro_df, horizon):
    """
    Model C: Chronos-2 + futures spread + TRUE calendar event flags.

    Key difference from Model B:
    - futures_spread: log(close / 63d MA) — momentum/mean-reversion signal
    - Calendar covariates (OPEC/FOMC/WASDE): computed from real scheduled dates
      for FUTURE dates too, giving Chronos-2 actual predictive information
      about upcoming market-moving events within the 30-day horizon.
    """
    if pipeline is None:
        median, _, _ = forecast_fallback(closes, horizon)
        return median

    try:
        import torch
        ctx = pd.DataFrame({"target": closes})

        # Macro
        if not macro_df.empty:
            ctx = ctx.join(macro_df[["dxy", "vix", "us10y"]], how="left")
            ctx[["dxy", "vix", "us10y"]] = ctx[["dxy", "vix", "us10y"]].ffill().fillna(0)
        else:
            ctx["dxy"] = ctx["vix"] = ctx["us10y"] = 0.0

        # Technical
        tech = add_technical_features(closes)
        ctx  = ctx.join(tech, how="left")
        ctx[["ret_1d", "ret_5d", "vol_20d", "rsi_14"]] = (
            ctx[["ret_1d", "ret_5d", "vol_20d", "rsi_14"]].ffill().fillna(0)
        )

        # Futures spread (synthetic contango proxy)
        ctx["futures_spread"] = add_futures_spread(closes).values

        # Calendar flags (historical dates)
        cal = build_calendar_flags(closes.index)
        ctx = ctx.join(cal, how="left")
        ctx[PROPER_CALENDAR_COLS] = ctx[PROPER_CALENDAR_COLS].fillna(0)

        ctx = ctx.dropna(subset=["target"])
        ctx["id"] = "item"
        ctx["timestamp"] = ctx.index
        ctx = ctx.reset_index(drop=True)

        # Build future_df
        last_date    = closes.index[-1]
        future_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1), periods=horizon)

        # last-known constant for macro/technical/spread
        last_known = ctx[PROPER_LAST_KNOWN_COLS].iloc[-1].fillna(0)
        fut = pd.DataFrame({col: [last_known[col]] * horizon for col in PROPER_LAST_KNOWN_COLS})

        # TRUE future calendar flags (scheduled dates — real known-future info)
        cal_fut = build_calendar_flags(future_dates)
        for col in PROPER_CALENDAR_COLS:
            fut[col] = cal_fut[col].values

        fut["id"] = "item"
        fut["timestamp"] = future_dates

        pred_df = pipeline.predict_df(
            ctx, future_df=fut,
            prediction_length=horizon, quantile_levels=[0.5],
            id_column="id", timestamp_column="timestamp", target="target",
        )
        item = pred_df[pred_df["id"] == "item"].sort_values("timestamp")
        return item["predictions"].values

    except Exception as e:
        print(f"    C 예측 실패: {e} → fallback")
        median, _, _ = forecast_fallback(closes, horizon)
        return median


# ── Model D: AutoGluon Chronos-2 fine-tuned ──────────────────────────────────

_ag_predictors = {}  # cache per commodity key


def predict_window_autogluon(key, closes, horizon):
    """
    Model D: AutoGluon TimeSeriesPredictor with Chronos-2 + LoRA fine-tuning.
    Calendar event flags used as known_covariates_names (true future info).
    Trains once per commodity key, then predicts.
    Returns median forecast array or None on failure.
    """
    if not AG_AVAILABLE:
        return None

    try:
        # Build TimeSeriesDataFrame
        cal = build_calendar_flags(closes.index)
        df  = pd.DataFrame({
            "item_id":   key,
            "timestamp": closes.index,
            "target":    closes.values,
        })
        for col in PROPER_CALENDAR_COLS:
            df[col] = cal[col].values

        ts_df = TimeSeriesDataFrame.from_data_frame(
            df, id_column="item_id", timestamp_column="timestamp",
        )

        if key not in _ag_predictors:
            print(f"    AutoGluon fine-tune [{key}]...")
            predictor = TimeSeriesPredictor(
                prediction_length=horizon,
                target="target",
                known_covariates_names=PROPER_CALENDAR_COLS,
                freq="B",
            )
            predictor.fit(
                ts_df,
                hyperparameters={
                    "Chronos": {
                        "model_path": "amazon/chronos-2",
                        "fine_tune":  True,
                    }
                },
                time_limit=AG_TIME_LIMIT,
                verbosity=0,
            )
            _ag_predictors[key] = predictor

        predictor = _ag_predictors[key]

        # Build future covariate frame
        last_date    = closes.index[-1]
        future_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1), periods=horizon)
        cal_fut      = build_calendar_flags(future_dates)
        fut_df = pd.DataFrame({"item_id": key, "timestamp": future_dates})
        for col in PROPER_CALENDAR_COLS:
            fut_df[col] = cal_fut[col].values
        known_cov_df = TimeSeriesDataFrame.from_data_frame(
            fut_df, id_column="item_id", timestamp_column="timestamp",
        )

        preds   = predictor.predict(ts_df, known_covariates=known_cov_df)
        item_df = preds.loc[key] if key in preds.index.get_level_values(0) else preds
        return item_df["mean"].values[:horizon]

    except Exception as e:
        print(f"    D AutoGluon 실패 [{key}]: {e}")
        return None


# ── Metrics ───────────────────────────────────────────────────────────────────

def compute_metrics(actual, predicted):
    actual    = np.array(actual, dtype=float)
    predicted = np.array(predicted[:len(actual)], dtype=float)
    mae  = float(np.mean(np.abs(actual - predicted)))
    rmse = float(np.sqrt(np.mean((actual - predicted) ** 2)))
    mape = float(np.mean(np.abs((actual - predicted) / np.where(actual == 0, 1e-8, actual))) * 100)
    if len(actual) > 1:
        dir_acc = float(np.mean(
            np.sign(actual[1:] - actual[0]) == np.sign(predicted[1:] - predicted[0])
        ) * 100)
    else:
        dir_acc = 0.0
    return {"mae": round(mae, 4), "rmse": round(rmse, 4),
            "mape": round(mape, 4), "dir_acc": round(dir_acc, 2)}


def compute_final_dir_acc(actual, predicted_median):
    """30일 최종 방향성 정확도 (binary: 0 or 1)."""
    if len(actual) < 2 or len(predicted_median) < 2:
        return 0.0
    pred_dir   = int(predicted_median[-1] > predicted_median[0])
    actual_dir = int(actual[-1] > actual[0])
    return float(pred_dir == actual_dir)


def _avg_metric(lst, k):
    vals = [m[k] for m in lst if k in m]
    return round(float(np.mean(vals)), 4) if vals else 0.0


# ── Main ──────────────────────────────────────────────────────────────────────

def run():
    models = ["A(Base)", "B(GenMacro)", "C(ProperCov)"]
    if AG_AVAILABLE:
        models.append("D(AutoGluon)")

    print(f"\nCommodityNode — Walk-Forward Backtest: {' vs '.join(models)}")
    print(f"Horizon: {HORIZON}d | Windows: {TEST_WINDOWS} | Step: {STEP}d")
    print("=" * 75)

    print("\n[1/4] 원자재 가격 수집...")
    all_closes = {}
    for key, sym in BACKTEST_COMMODITIES.items():
        s = fetch_commodity_history(sym, period=PERIOD)
        if s is not None and len(s) >= 200:
            all_closes[key] = s
            print(f"  {sym:8} ✓ {len(s)}일")
        else:
            print(f"  {sym:8} ✗ 데이터 부족")

    print("\n[2/4] 매크로 covariate 수집...")
    macro_df = fetch_covariates(period=PERIOD)
    print(f"  ✓ {macro_df.shape}")

    print("\n[3/4] 모델 로드...")
    pipeline   = load_pipeline()
    model_name = "Chronos-2" if pipeline else "linear-fallback"
    print(f"  Chronos-2: {model_name}")
    if AG_AVAILABLE:
        print("  AutoGluon: ✓ 활성화")

    print("\n[4/4] Walk-Forward Backtest 실행...")
    results = {}

    for key, closes in all_closes.items():
        print(f"\n  [{key}] ({len(closes)}일)")
        n = len(closes)
        a_list, b_list, c_list, d_list, gbst_list = [], [], [], [], []

        for w in range(TEST_WINDOWS):
            pred_start = n - (TEST_WINDOWS - w) * STEP
            pred_end   = pred_start + HORIZON
            if pred_start < 200 or pred_end > n:
                continue

            context   = closes.iloc[:pred_start]
            actual    = closes.iloc[pred_start:pred_end].values
            ctx_macro = macro_df[macro_df.index <= context.index[-1]] if not macro_df.empty else macro_df

            # Model A: baseline
            a_pred = predict_window(pipeline, context, ctx_macro, use_covariates=False, horizon=HORIZON)
            # Model B: generic macro
            b_pred = predict_window(pipeline, context, ctx_macro, use_covariates=True,  horizon=HORIZON)
            # Model C: proper covariates + true calendar future
            c_pred = predict_window_proper(pipeline, context, ctx_macro, horizon=HORIZON)

            a_fda = compute_final_dir_acc(actual, a_pred)
            b_fda = compute_final_dir_acc(actual, b_pred)
            c_fda = compute_final_dir_acc(actual, c_pred)

            am = compute_metrics(actual, a_pred); am["fda"] = a_fda
            bm = compute_metrics(actual, b_pred); bm["fda"] = b_fda
            cm = compute_metrics(actual, c_pred); cm["fda"] = c_fda

            a_list.append(am); b_list.append(bm); c_list.append(cm)

            # Model D: AutoGluon
            d_fda = 0.5
            if AG_AVAILABLE:
                d_pred = predict_window_autogluon(key, context, horizon=HORIZON)
                if d_pred is not None:
                    d_fda = compute_final_dir_acc(actual, d_pred)
                    dm    = compute_metrics(actual, d_pred); dm["fda"] = d_fda
                    d_list.append(dm)

            # GradBoost direction overlay
            p_up = clf_predict(key, context, ctx_macro,
                               train_end_idx=len(context), horizon=HORIZON, period=PERIOD)
            if p_up is not None and 0.0 <= p_up <= 1.0:
                gbst_fda = float(int(p_up >= 0.5) == int(actual[-1] > actual[0]))
            else:
                p_up     = 0.5
                gbst_fda = 0.5
            gbst_list.append({"fda": gbst_fda, "p_up": p_up})

            d_str = f" D_FDA={d_fda:.0f}" if AG_AVAILABLE else ""
            print(f"    W{w+1:02d}: A={a_fda:.0f} B={b_fda:.0f} C={c_fda:.0f}{d_str} "
                  f"GBst={gbst_fda:.0f} | MAPE A={am['mape']:.1f}% C={cm['mape']:.1f}%")

        if not a_list:
            continue

        results[key] = {
            "A_baseline": {k: _avg_metric(a_list, k) for k in ["mae", "rmse", "mape", "fda"]},
            "B_gen_macro": {k: _avg_metric(b_list, k) for k in ["mae", "rmse", "mape", "fda"]},
            "C_proper":   {k: _avg_metric(c_list, k)  for k in ["mae", "rmse", "mape", "fda"]},
            "D_autogluon": ({k: _avg_metric(d_list, k) for k in ["mae", "rmse", "mape", "fda"]}
                            if d_list else None),
            "gradboost": {
                "fda":       _avg_metric(gbst_list, "fda"),
                "p_up_mean": _avg_metric(gbst_list, "p_up"),
            },
            "windows": len(a_list),
        }

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 85)
    print("BACKTEST 결과 — Final Direction Accuracy % (30일)")
    print("=" * 85)
    header = f"{'Commodity':15} {'A(Base)':>10} {'B(Macro)':>10} {'C(Proper)':>11} "
    if AG_AVAILABLE:
        header += f"{'D(AG)':>8} "
    header += f"{'GBst':>8} {'Best':>8}"
    print(header)
    print("-" * 85)

    for key, r in results.items():
        a_fda = r["A_baseline"]["fda"] * 100
        b_fda = r["B_gen_macro"]["fda"] * 100
        c_fda = r["C_proper"]["fda"] * 100
        g_fda = r["gradboost"]["fda"] * 100
        candidates = [("A", a_fda), ("B", b_fda), ("C", c_fda), ("GBst", g_fda)]

        row = f"{key:15} {a_fda:>10.1f} {b_fda:>10.1f} {c_fda:>11.1f} "
        if AG_AVAILABLE:
            d_fda = (r["D_autogluon"]["fda"] * 100) if r["D_autogluon"] else 0.0
            candidates.append(("D", d_fda))
            row += f"{d_fda:>8.1f} "
        row += f"{g_fda:>8.1f} "
        best = max(candidates, key=lambda x: x[1])
        row += f"{'Mdl '+best[0]:>8}"
        print(row)

    print("-" * 85)
    avg_a = np.mean([r["A_baseline"]["fda"] for r in results.values()]) * 100
    avg_b = np.mean([r["B_gen_macro"]["fda"] for r in results.values()]) * 100
    avg_c = np.mean([r["C_proper"]["fda"]    for r in results.values()]) * 100
    avg_g = np.mean([r["gradboost"]["fda"]   for r in results.values()]) * 100

    avg_row = f"{'AVERAGE':15} {avg_a:>10.1f} {avg_b:>10.1f} {avg_c:>11.1f} "
    if AG_AVAILABLE:
        avg_d = np.mean([(r["D_autogluon"]["fda"] if r["D_autogluon"] else 0.5)
                         for r in results.values()]) * 100
        avg_row += f"{avg_d:>8.1f} "
    avg_row += f"{avg_g:>8.1f}"
    print(avg_row)

    print(f"\nRANDOM BASELINE: 50.0%")
    print(f"vs Random:  A={avg_a-50:+.1f}%p  B={avg_b-50:+.1f}%p  C={avg_c-50:+.1f}%p  GBst={avg_g-50:+.1f}%p")

    # JSON 저장
    out_path = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "backtest_results.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    out = {
        "model":         model_name,
        "horizon_days":  HORIZON,
        "windows":       TEST_WINDOWS,
        "step_days":     STEP,
        "commodities":   list(BACKTEST_COMMODITIES.keys()),
        "models":        models,
        "covariates": {
            "B_gen_macro": COVARIATE_COLS,
            "C_proper":    PROPER_COVARIATE_COLS,
        },
        "results":  results,
        "run_at":   datetime.now(timezone.utc).isoformat(),
    }
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\n✅ 저장: assets/data/backtest_results.json")
    return results


if __name__ == "__main__":
    run()
