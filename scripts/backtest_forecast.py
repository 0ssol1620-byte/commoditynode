"""
CommodityNode — Chronos-2 Backtest: Baseline vs Enhanced
Walk-forward, no look-ahead bias, 30-day horizon.

Baseline:  Chronos-2 price history only
Enhanced:  Chronos-2 + macro covariates (DXY, VIX, US10Y) + technical indicators
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
    CHRONOS2_AVAILABLE,
    fetch_covariates,
    add_technical_features,
    forecast_fallback,
)

# ── 설정 ─────────────────────────────────────────────────────────────────
BACKTEST_COMMODITIES = {
    "crude_oil":   "CL=F",
    "gold":        "GC=F",
    "copper":      "HG=F",
    "natural_gas": "NG=F",
    "wheat":       "ZW=F",
}
HORIZON      = 30    # 예측 일수
STEP         = 30    # walk-forward 간격 (영업일)
TEST_WINDOWS = 8     # 최근 8개 윈도우 (약 8개월)
PERIOD       = "3y"  # 데이터 수집 기간


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


def predict_window(pipeline, closes, macro_df, use_covariates, horizon):
    """
    단일 윈도우 예측.
    use_covariates=False → baseline (가격만)
    use_covariates=True  → enhanced (가격 + 매크로 + 기술지표)
    no look-ahead: future_df는 last-known 상수값으로 채움.
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
            last_date = closes.index[-1]
            future_dates = pd.bdate_range(
                start=last_date + pd.Timedelta(days=1), periods=horizon
            )
            last_known = ctx[COVARIATE_COLS].iloc[-1].fillna(0)
            fut = pd.DataFrame(
                {col: [last_known[col]] * horizon for col in COVARIATE_COLS}
            )
            fut["id"] = "item"
            fut["timestamp"] = future_dates

            pred_df = pipeline.predict_df(
                ctx, future_df=fut,
                prediction_length=horizon,
                quantile_levels=[0.5],
                id_column="id", timestamp_column="timestamp", target="target",
            )
        else:
            pred_df = pipeline.predict_df(
                ctx,
                prediction_length=horizon,
                quantile_levels=[0.5],
                id_column="id", timestamp_column="timestamp", target="target",
            )

        item = pred_df[pred_df["id"] == "item"].sort_values("timestamp")
        return item["predictions"].values

    except Exception as e:
        print(f"    예측 실패: {e} → fallback")
        median, _, _ = forecast_fallback(closes, horizon)
        return median


def compute_metrics(actual, predicted):
    """MAE, RMSE, MAPE, 방향성 정확도(Directional Accuracy) 계산."""
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
    return {
        "mae":     round(mae, 4),
        "rmse":    round(rmse, 4),
        "mape":    round(mape, 4),
        "dir_acc": round(dir_acc, 2),
    }


def run():
    print("\nCommodityNode — Walk-Forward Backtest: Baseline vs Enhanced")
    print(f"Horizon: {HORIZON}d | Windows: {TEST_WINDOWS} | Step: {STEP}d")
    print("=" * 65)

    # 1. 데이터 수집
    print("\n[1/4] 원자재 가격 수집...")
    all_closes = {}
    for key, sym in BACKTEST_COMMODITIES.items():
        s = fetch_commodity_history(sym, period=PERIOD)
        if s is not None and len(s) >= 200:
            all_closes[key] = s
            print(f"  {sym:8} ✓ {len(s)}일")
        else:
            print(f"  {sym:8} ✗ 데이터 부족")

    # 2. 매크로 수집
    print("\n[2/4] 매크로 covariate 수집...")
    macro_df = fetch_covariates(period=PERIOD)
    print(f"  ✓ {macro_df.shape}")

    # 3. 모델 로드
    print("\n[3/4] 모델 로드...")
    pipeline = load_pipeline()
    model_name = "Chronos-2" if pipeline else "linear-fallback"
    print(f"  모델: {model_name}")

    # 4. Walk-Forward Backtest
    print("\n[4/4] Walk-Forward Backtest 실행...")
    results = {}

    for key, closes in all_closes.items():
        print(f"\n  [{key}] ({len(closes)}일)")
        n = len(closes)
        baseline_list = []
        enhanced_list = []

        for w in range(TEST_WINDOWS):
            pred_start = n - (TEST_WINDOWS - w) * STEP
            pred_end   = pred_start + HORIZON
            if pred_start < 200 or pred_end > n:
                continue

            context = closes.iloc[:pred_start]
            actual  = closes.iloc[pred_start:pred_end].values
            ctx_macro = macro_df[macro_df.index <= context.index[-1]] if not macro_df.empty else macro_df

            base_pred = predict_window(pipeline, context, ctx_macro, use_covariates=False, horizon=HORIZON)
            enh_pred  = predict_window(pipeline, context, ctx_macro, use_covariates=True,  horizon=HORIZON)

            bm = compute_metrics(actual, base_pred)
            em = compute_metrics(actual, enh_pred)
            baseline_list.append(bm)
            enhanced_list.append(em)

            print(f"    W{w+1:02d}: Base MAPE={bm['mape']:6.2f}% DirAcc={bm['dir_acc']:5.1f}% | "
                  f"Enh MAPE={em['mape']:6.2f}% DirAcc={em['dir_acc']:5.1f}%")

        if not baseline_list:
            continue

        def avg(lst, k):
            return round(float(np.mean([m[k] for m in lst])), 4)

        results[key] = {
            "baseline": {k: avg(baseline_list, k) for k in ["mae", "rmse", "mape", "dir_acc"]},
            "enhanced": {k: avg(enhanced_list, k)  for k in ["mae", "rmse", "mape", "dir_acc"]},
            "windows":  len(baseline_list),
        }

    # 결과 출력
    print("\n" + "=" * 65)
    print("BACKTEST 결과 요약 (평균)")
    print("=" * 65)
    print(f"{'Commodity':15} {'Metric':10} {'Baseline':>10} {'Enhanced':>10} {'Δ':>8} {'판정':>8}")
    print("-" * 65)

    for key, r in results.items():
        b, e = r["baseline"], r["enhanced"]
        for metric, higher_is_better in [("mape", False), ("dir_acc", True)]:
            delta = e[metric] - b[metric]
            if higher_is_better:
                verdict = "✅ 개선" if delta > 0.5 else ("❌ 악화" if delta < -0.5 else "≈ 동일")
            else:
                verdict = "✅ 개선" if delta < -0.5 else ("❌ 악화" if delta > 0.5 else "≈ 동일")
            print(f"{key:15} {metric:10} {b[metric]:>10.2f} {e[metric]:>10.2f} {delta:>+8.2f} {verdict:>8}")

    # JSON 저장
    out_path = os.path.join(
        os.path.dirname(__file__), "..", "assets", "data", "backtest_results.json"
    )
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    out = {
        "model":      model_name,
        "horizon_days": HORIZON,
        "windows":    TEST_WINDOWS,
        "step_days":  STEP,
        "commodities": list(BACKTEST_COMMODITIES.keys()),
        "covariates": COVARIATE_COLS,
        "results":    results,
        "run_at":     datetime.now(timezone.utc).isoformat(),
    }
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\n✅ 저장: assets/data/backtest_results.json")
    return results


if __name__ == "__main__":
    run()
