"""
CommodityNode — Context Length Experiment
=========================================
Rolling walk-forward: compare FDA for different Chronos-2 input context lengths.

Context lengths tested: 252d (1y), 504d (2y), 756d (3y), 1260d (5y)

KEY: Rolling evaluation — context is FIXED SIZE for each window.
     Unlike expanding walk-forward, each window sees the same amount of history.
"""
import os, sys, warnings
import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import CHRONOS2_AVAILABLE, forecast_fallback

COMMODITIES = {
    "crude_oil":   "CL=F",
    "gold":        "GC=F",
    "copper":      "HG=F",
    "natural_gas": "NG=F",
    "wheat":       "ZW=F",
}
CONTEXT_LENGTHS = {
    "1y":  252,
    "2y":  504,
    "3y":  756,
    "5y": 1260,
}
HORIZON      = 30
STEP         = 30
TEST_WINDOWS = 8
FETCH_PERIOD = "7y"  # fetch more than needed


def fetch_history(symbol):
    try:
        df = yf.Ticker(symbol).history(period=FETCH_PERIOD)
        s = df["Close"].dropna()
        idx = pd.DatetimeIndex([pd.Timestamp(ts).tz_localize(None).normalize() for ts in s.index])
        s.index = idx
        bday = pd.bdate_range(start=idx[0], end=idx[-1])
        return s.reindex(bday).ffill().dropna()
    except Exception as e:
        print(f"  {symbol} 실패: {e}")
        return None


def load_pipeline():
    if not CHRONOS2_AVAILABLE:
        return None
    try:
        import torch
        from chronos import Chronos2Pipeline
        return Chronos2Pipeline.from_pretrained(
            "amazon/chronos-2-small", device_map="cpu", dtype=torch.float32,
        )
    except Exception:
        try:
            import torch
            from chronos import Chronos2Pipeline
            return Chronos2Pipeline.from_pretrained(
                "amazon/chronos-2", device_map="cpu", dtype=torch.float32,
            )
        except Exception as e:
            print(f"  모델 로드 실패: {e}")
            return None


def predict_chronos(pipeline, context_closes, horizon):
    """Price-only Chronos-2 prediction."""
    if pipeline is None:
        median, _, _ = forecast_fallback(context_closes, horizon)
        return median
    try:
        import torch
        ctx = pd.DataFrame({
            "target":    context_closes.values,
            "id":        "item",
            "timestamp": context_closes.index,
        }).reset_index(drop=True)
        pred_df = pipeline.predict_df(
            ctx, prediction_length=horizon, quantile_levels=[0.5],
            id_column="id", timestamp_column="timestamp", target="target",
        )
        item = pred_df[pred_df["id"] == "item"].sort_values("timestamp")
        return item["predictions"].values
    except Exception:
        median, _, _ = forecast_fallback(context_closes, horizon)
        return median


def final_dir_acc(actual, predicted):
    if len(actual) < 2 or len(predicted) < 2:
        return 0.5
    return float(int(predicted[-1] > predicted[0]) == int(actual[-1] > actual[0]))


def run():
    print("\nCommodityNode — Context Length Experiment (Rolling Walk-Forward)")
    print(f"Horizon: {HORIZON}d | Windows: {TEST_WINDOWS} | Step: {STEP}d")
    print(f"Context lengths: {list(CONTEXT_LENGTHS.keys())}")
    print("=" * 65)

    print("\n[1/3] 데이터 수집 (7y)...")
    all_closes = {}
    for key, sym in COMMODITIES.items():
        s = fetch_history(sym)
        if s is not None and len(s) >= 1260 + TEST_WINDOWS * STEP + HORIZON:
            all_closes[key] = s
            print(f"  {sym:8} ✓ {len(s)}일")
        elif s is not None and len(s) >= 504 + TEST_WINDOWS * STEP + HORIZON:
            all_closes[key] = s
            print(f"  {sym:8} ✓ {len(s)}일 (5y 컨텍스트 일부 윈도우 제한될 수 있음)")
        else:
            print(f"  {sym:8} ✗ 데이터 부족 ({len(s) if s is not None else 0}일)")

    print("\n[2/3] 모델 로드...")
    pipeline = load_pipeline()
    print(f"  모델: {'Chronos-2' if pipeline else 'linear-fallback'}")

    print("\n[3/3] Rolling Backtest 실행...")
    # results[key][ctx_label] = list of FDA
    results = {key: {lbl: [] for lbl in CONTEXT_LENGTHS} for key in all_closes}

    for key, closes in all_closes.items():
        n = len(closes)
        print(f"\n  [{key}] ({n}일)")
        for w in range(TEST_WINDOWS):
            pred_start = n - (TEST_WINDOWS - w) * STEP
            pred_end   = pred_start + HORIZON
            if pred_end > n:
                continue

            actual = closes.iloc[pred_start:pred_end].values
            row_parts = []

            for lbl, ctx_days in CONTEXT_LENGTHS.items():
                ctx_start = pred_start - ctx_days
                if ctx_start < 0:
                    row_parts.append(f"{lbl}=—")
                    continue
                context = closes.iloc[ctx_start:pred_start]
                pred    = predict_chronos(pipeline, context, HORIZON)
                fda     = final_dir_acc(actual, pred)
                results[key][lbl].append(fda)
                row_parts.append(f"{lbl}={fda:.0f}")

            print(f"    W{w+1:02d}: {' | '.join(row_parts)}")

    # Summary
    print("\n" + "=" * 65)
    print("결과 — FDA % by Context Length (30일 방향성 정확도)")
    print("=" * 65)
    header = f"{'Commodity':15}" + "".join(f"{lbl:>10}" for lbl in CONTEXT_LENGTHS) + f"{'Best':>10}"
    print(header)
    print("-" * 65)

    avg_by_ctx = {lbl: [] for lbl in CONTEXT_LENGTHS}
    for key, ctx_results in results.items():
        row = f"{key:15}"
        best_lbl, best_val = None, -1
        for lbl in CONTEXT_LENGTHS:
            vals = ctx_results[lbl]
            avg  = np.mean(vals) * 100 if vals else float("nan")
            row += f"{avg:>10.1f}"
            avg_by_ctx[lbl].append(avg)
            if not np.isnan(avg) and avg > best_val:
                best_val, best_lbl = avg, lbl
        row += f"{best_lbl:>10}"
        print(row)

    print("-" * 65)
    avg_row = f"{'AVERAGE':15}"
    for lbl in CONTEXT_LENGTHS:
        vals = [v for v in avg_by_ctx[lbl] if not np.isnan(v)]
        avg_row += f"{np.mean(vals):>10.1f}" if vals else f"{'—':>10}"
    print(avg_row)
    print(f"\nRANDOM BASELINE: 50.0%")


if __name__ == "__main__":
    run()
