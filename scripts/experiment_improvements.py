"""
CommodityNode — Improvements Experiment
========================================
Tests 3 community-sourced improvements to Chronos-2 direction signal:
1. Pre-normalization (rolling 252d std)
2. Native quantile levels [0.1, 0.2, 0.5, 0.8, 0.9]
3. Quantile asymmetry signal (skewness-based confidence)

Walk-forward, 8 windows, 30-day horizon, 5 commodities.
"""
import os, sys, warnings
import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import CHRONOS2_AVAILABLE, forecast_fallback, COVARIATE_COLS, add_technical_features, fetch_covariates

COMMODITIES = {
    "crude_oil":   "CL=F",
    "gold":        "GC=F",
    "copper":      "HG=F",
    "natural_gas": "NG=F",
    "wheat":       "ZW=F",
}
HORIZON      = 30
STEP         = 30
TEST_WINDOWS = 8
PERIOD       = "5y"


def fetch_history(symbol, period=PERIOD):
    try:
        df = yf.Ticker(symbol).history(period=period)
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
        try:
            return Chronos2Pipeline.from_pretrained("amazon/chronos-2-small", device_map="cpu", dtype=torch.float32)
        except Exception:
            return Chronos2Pipeline.from_pretrained("amazon/chronos-2", device_map="cpu", dtype=torch.float32)
    except Exception as e:
        print(f"  모델 로드 실패: {e}")
        return None


def predict_window(pipeline, closes, macro_df, quantile_levels, normalize=False):
    """Single-commodity prediction with configurable quantiles and normalization."""
    if pipeline is None:
        median, p10, p90 = forecast_fallback(closes, HORIZON)
        mid = (p10 + p90) / 2
        return median, mid, mid, p10, p90

    scale = 1.0
    if normalize:
        scale = closes.rolling(252, min_periods=30).std().iloc[-1]
        if pd.isna(scale) or scale < 1e-8:
            scale = closes.std()
        if pd.isna(scale) or scale < 1e-8:
            scale = 1.0
        closes = closes / scale

    try:
        import torch
        tech = add_technical_features(closes)
        ctx = pd.DataFrame({"target": closes})
        if not macro_df.empty:
            ctx = ctx.join(macro_df[["dxy", "vix", "us10y"]], how="left")
            ctx[["dxy", "vix", "us10y"]] = ctx[["dxy", "vix", "us10y"]].ffill().fillna(0)
        else:
            ctx["dxy"] = ctx["vix"] = ctx["us10y"] = 0.0
        ctx = ctx.join(tech, how="left")
        ctx[COVARIATE_COLS[3:]] = ctx[COVARIATE_COLS[3:]].ffill().fillna(0)
        ctx = ctx.dropna(subset=["target"])
        ctx["id"] = "item"
        ctx["timestamp"] = ctx.index
        ctx = ctx.reset_index(drop=True)

        last_date = closes.index[-1]
        future_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1), periods=HORIZON)
        last_known = ctx[COVARIATE_COLS].iloc[-1].fillna(0)
        fut = pd.DataFrame({col: [last_known[col]] * HORIZON for col in COVARIATE_COLS})
        fut["id"] = "item"
        fut["timestamp"] = future_dates

        pred_df = pipeline.predict_df(
            ctx, future_df=fut,
            prediction_length=HORIZON, quantile_levels=quantile_levels,
            id_column="id", timestamp_column="timestamp", target="target",
        )
        item = pred_df[pred_df["id"] == "item"].sort_values("timestamp")
        median = item["predictions"].values * scale

        ql = [str(round(q, 2)) for q in quantile_levels]
        # Middle two quantiles (for band)
        q_lo = item[ql[1]].values * scale  # 0.25 or 0.2
        q_hi = item[ql[3]].values * scale  # 0.75 or 0.8
        q_ext_lo = item[ql[0]].values * scale  # 0.1
        q_ext_hi = item[ql[4]].values * scale  # 0.9
        return median, q_lo, q_hi, q_ext_lo, q_ext_hi

    except Exception:
        median, p10, p90 = forecast_fallback(closes, HORIZON)
        mid = (p10 + p90) / 2
        return median * scale, mid * scale, mid * scale, p10 * scale, p90 * scale


def direction_signal(current, median, q_lo, q_hi, q_ext_lo, q_ext_hi, use_asymmetry=False):
    """
    Returns (label, confidence) for 30-day direction.
    label: 'BULLISH', 'BEARISH', 'NEUTRAL'
    For FDA: NEUTRAL = 0.5, correct = 1.0, wrong = 0.0
    """
    med_end = float(np.mean(median[-5:]))

    if not use_asymmetry:
        # CURRENT: simple median direction, confidence from band
        if med_end > current:
            label = "BULLISH"
            if q_ext_lo[-1] > current:   conf = 0.88
            elif q_lo[-1] > current:     conf = 0.72
            elif q_hi[-1] > current:     conf = 0.58
            else:                        label, conf = "NEUTRAL", 0.50
        elif med_end < current:
            label = "BEARISH"
            if q_ext_hi[-1] < current:   conf = 0.88
            elif q_hi[-1] < current:     conf = 0.72
            elif q_lo[-1] < current:     conf = 0.58
            else:                        label, conf = "NEUTRAL", 0.50
        else:
            label, conf = "NEUTRAL", 0.50
        return label, conf

    # ASYMMETRY: factor in skewness at day 30
    q50 = median[29]
    q20 = q_lo[29]
    q80 = q_hi[29]
    denom = abs(q50 - q20)
    skew = (q80 - q50) / max(denom, abs(current) * 0.001, 1e-8)

    if med_end > current:
        label = "BULLISH"
        if q_ext_lo[-1] > current:   conf = 0.88
        elif q_lo[-1] > current:     conf = 0.72
        elif q_hi[-1] > current:     conf = 0.58
        else:                        label, conf = "NEUTRAL", 0.50
        if label == "BULLISH":
            if skew > 1.3:   conf = min(0.93, conf + 0.05)   # upside skew boost
            elif skew < 0.7: conf = max(0.50, conf - 0.08)   # downside skew penalty -> NEUTRAL
            if conf <= 0.50: label = "NEUTRAL"
    elif med_end < current:
        label = "BEARISH"
        if q_ext_hi[-1] < current:   conf = 0.88
        elif q_hi[-1] < current:     conf = 0.72
        elif q_lo[-1] < current:     conf = 0.58
        else:                        label, conf = "NEUTRAL", 0.50
        if label == "BEARISH":
            if skew < 0.7:   conf = min(0.93, conf + 0.05)   # downside skew boost
            elif skew > 1.3: conf = max(0.50, conf - 0.08)   # upside skew penalty
            if conf <= 0.50: label = "NEUTRAL"
    else:
        label, conf = "NEUTRAL", 0.50
    return label, conf


def fda(label, actual_start, actual_end):
    """FDA: 1=correct, 0=wrong, 0.5=NEUTRAL."""
    if label == "NEUTRAL":
        return 0.5
    actual_up = actual_end > actual_start
    predicted_up = label == "BULLISH"
    return 1.0 if actual_up == predicted_up else 0.0


CONFIGS = {
    "CURRENT": dict(normalize=False, quantiles=[0.1, 0.25, 0.5, 0.75, 0.9], asymmetry=False),
    "NORM":    dict(normalize=True,  quantiles=[0.1, 0.25, 0.5, 0.75, 0.9], asymmetry=False),
    "QNATIVE": dict(normalize=False, quantiles=[0.1, 0.2,  0.5, 0.8,  0.9], asymmetry=False),
    "ASYM":    dict(normalize=False, quantiles=[0.1, 0.25, 0.5, 0.75, 0.9], asymmetry=True),
    "ALL":     dict(normalize=True,  quantiles=[0.1, 0.2,  0.5, 0.8,  0.9], asymmetry=True),
}


def run():
    print("\nCommodityNode — Improvements Experiment")
    print(f"Configs: {list(CONFIGS.keys())}")
    print(f"Horizon: {HORIZON}d | Windows: {TEST_WINDOWS} | Step: {STEP}d")
    print("=" * 75)

    print("\n[1/3] 데이터 수집...")
    all_closes = {}
    for key, sym in COMMODITIES.items():
        s = fetch_history(sym)
        if s is not None and len(s) >= 300:
            all_closes[key] = s
            print(f"  {sym:8} {len(s)}일")

    print("\n[2/3] 매크로 수집...")
    macro_df = fetch_covariates(period=PERIOD)
    print(f"  {macro_df.shape}")

    print("\n[3/3] 모델 로드...")
    pipeline = load_pipeline()
    print(f"  {'Chronos-2' if pipeline else 'fallback'}")

    # results[key][config_name] = list of fda values
    results = {key: {cfg: [] for cfg in CONFIGS} for key in all_closes}

    for key, closes in all_closes.items():
        n = len(closes)
        print(f"\n  [{key}] ({n}일)")
        for w in range(TEST_WINDOWS):
            pred_start = n - (TEST_WINDOWS - w) * STEP
            pred_end   = pred_start + HORIZON
            if pred_start < 252 or pred_end > n:
                continue
            context = closes.iloc[:pred_start]
            actual  = closes.iloc[pred_start:pred_end].values
            ctx_macro = macro_df[macro_df.index <= context.index[-1]] if not macro_df.empty else macro_df
            current_price = float(context.iloc[-1])

            row_parts = []
            for cfg_name, cfg in CONFIGS.items():
                med, q_lo, q_hi, q_ext_lo, q_ext_hi = predict_window(
                    pipeline, context, ctx_macro,
                    quantile_levels=cfg["quantiles"],
                    normalize=cfg["normalize"],
                )
                label, conf = direction_signal(
                    current_price, med, q_lo, q_hi, q_ext_lo, q_ext_hi,
                    use_asymmetry=cfg["asymmetry"],
                )
                score = fda(label, actual[0], actual[-1])
                results[key][cfg_name].append(score)
                row_parts.append(f"{cfg_name}={score:.1f}({label[0]})")
            print(f"    W{w+1:02d}: {' | '.join(row_parts)}")

    # Summary
    print("\n" + "=" * 75)
    print("결과 — FDA % (30일 방향성 정확도)")
    print("=" * 75)
    header = f"{'Commodity':15}" + "".join(f"{c:>10}" for c in CONFIGS) + f"{'Best':>10}"
    print(header)
    print("-" * 75)

    avg_by_cfg = {cfg: [] for cfg in CONFIGS}
    for key, cfg_results in results.items():
        row = f"{key:15}"
        best_cfg, best_val = None, -1
        for cfg_name in CONFIGS:
            vals = cfg_results[cfg_name]
            avg = np.mean(vals) * 100 if vals else float("nan")
            row += f"{avg:>10.1f}"
            avg_by_cfg[cfg_name].append(avg)
            if not np.isnan(avg) and avg > best_val:
                best_val, best_cfg = avg, cfg_name
        row += f"{best_cfg:>10}"
        print(row)

    print("-" * 75)
    avg_row = f"{'AVERAGE':15}"
    for cfg_name in CONFIGS:
        vals = [v for v in avg_by_cfg[cfg_name] if not np.isnan(v)]
        avg_row += f"{np.mean(vals):>10.1f}" if vals else f"{'—':>10}"
    print(avg_row)
    print(f"\nRANDOM BASELINE: 50.0%")
    print(f"(NEUTRAL 처리: 0.5점으로 계산)")


if __name__ == "__main__":
    run()
