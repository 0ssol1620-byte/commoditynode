"""
CommodityNode — Alternative Signal Comparison Experiment
=========================================================
Compares 8 approaches to 30-day commodity direction prediction:

1. CHRONOS2   — production Chronos-2 median direction (~62.5% FDA)
2. SMA_CROSS  — 10d MA crosses 30d MA
3. MOM_1M     — 21-day return sign
4. MOM_3M     — 63-day return sign
5. RSI_CONTRA — oversold/overbought contrarian
6. SEASONAL   — commodity-specific calendar biases
7. MACRO_REGIME — DXY + VIX rule-based
8. ENSEMBLE   — majority vote (SMA_CROSS + MOM_3M + RSI_CONTRA + SEASONAL, >=3 agree)

Walk-forward: 8 windows, 30-day horizon, step=30d, 5 commodities.
Goal: find if any rule-based or classical ML signal beats Chronos-2's 62.5% FDA.
"""
import os, sys, warnings
import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import (
    CHRONOS2_AVAILABLE,
    forecast_fallback,
    COVARIATE_COLS,
    add_technical_features,
    fetch_covariates,
)

# ── Constants ─────────────────────────────────────────────────────────────────
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

SIGNAL_NAMES = [
    "CHRONOS2",
    "SMA_CROSS",
    "MOM_1M",
    "MOM_3M",
    "RSI_CONTRA",
    "SEASONAL",
    "MACRO_REGIME",
    "ENSEMBLE",
]

# ── Seasonal biases per commodity (month -> label or None for NEUTRAL) ────────
# None = NEUTRAL (no strong seasonal tendency that month)
SEASONAL_BIASES = {
    "natural_gas": {
        10: "BULLISH", 11: "BULLISH", 12: "BULLISH",
         1: "BULLISH",  2: "BULLISH",  3: "BULLISH",
         4: "BEARISH",  5: "BEARISH",  6: "BEARISH",
         7: "BEARISH",  8: "BEARISH",  9: "BEARISH",
    },
    "wheat": {
        12: "BULLISH",  1: "BULLISH",  2: "BULLISH",
         3: "BULLISH",  4: "BULLISH",
         7: "BEARISH",  8: "BEARISH",  9: "BEARISH",
    },
    "crude_oil": {
        1: "BULLISH",  2: "BULLISH",  3: "BULLISH",  4: "BULLISH",
        8: "BEARISH",  9: "BEARISH", 10: "BEARISH",
    },
    "gold": {
         8: "BULLISH",  9: "BULLISH", 10: "BULLISH", 11: "BULLISH",
        12: "BULLISH",  1: "BULLISH",
    },
    "copper": {
        1: "BULLISH",  2: "BULLISH",  3: "BULLISH",
        4: "BULLISH",  5: "BULLISH",
        9: "BEARISH", 10: "BEARISH", 11: "BEARISH", 12: "BEARISH",
    },
}


# ── Data helpers ──────────────────────────────────────────────────────────────

def fetch_history(symbol, period=PERIOD):
    try:
        df = yf.Ticker(symbol).history(period=period)
        s = df["Close"].dropna()
        idx = pd.DatetimeIndex([
            pd.Timestamp(ts).tz_localize(None).normalize() for ts in s.index
        ])
        s.index = idx
        bday = pd.bdate_range(start=idx[0], end=idx[-1])
        return s.reindex(bday).ffill().dropna()
    except Exception as e:
        print(f"  {symbol} fetch failed: {e}")
        return None


def load_pipeline():
    if not CHRONOS2_AVAILABLE:
        return None
    try:
        import torch
        from chronos import Chronos2Pipeline
        try:
            return Chronos2Pipeline.from_pretrained(
                "amazon/chronos-2-small", device_map="cpu", dtype=torch.float32
            )
        except Exception:
            return Chronos2Pipeline.from_pretrained(
                "amazon/chronos-2", device_map="cpu", dtype=torch.float32
            )
    except Exception as e:
        print(f"  Model load failed: {e}")
        return None


# ── Chronos-2 prediction (reuse experiment_improvements pattern) ──────────────

def predict_chronos2(pipeline, closes, macro_df):
    """Run Chronos-2 for a single context window. Returns (median, q_lo, q_hi, q_ext_lo, q_ext_hi)."""
    quantile_levels = [0.1, 0.25, 0.5, 0.75, 0.9]

    if pipeline is None:
        median, p10, p90 = forecast_fallback(closes, HORIZON)
        mid = (p10 + p90) / 2
        return median, mid, mid, p10, p90

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
        future_dates = pd.bdate_range(
            start=last_date + pd.Timedelta(days=1), periods=HORIZON
        )
        last_known = ctx[COVARIATE_COLS].iloc[-1].fillna(0)
        fut = pd.DataFrame(
            {col: [last_known[col]] * HORIZON for col in COVARIATE_COLS}
        )
        fut["id"] = "item"
        fut["timestamp"] = future_dates

        pred_df = pipeline.predict_df(
            ctx,
            future_df=fut,
            prediction_length=HORIZON,
            quantile_levels=quantile_levels,
            id_column="id",
            timestamp_column="timestamp",
            target="target",
        )
        item = pred_df[pred_df["id"] == "item"].sort_values("timestamp")
        median    = item["predictions"].values
        q_lo      = item["0.25"].values
        q_hi      = item["0.75"].values
        q_ext_lo  = item["0.1"].values
        q_ext_hi  = item["0.9"].values
        return median, q_lo, q_hi, q_ext_lo, q_ext_hi

    except Exception:
        median, p10, p90 = forecast_fallback(closes, HORIZON)
        mid = (p10 + p90) / 2
        return median, mid, mid, p10, p90


def chronos2_label(current, median, q_lo, q_hi, q_ext_lo, q_ext_hi):
    """Derive BULLISH/BEARISH/NEUTRAL from Chronos-2 quantile band."""
    med_end = float(np.mean(median[-5:]))
    if med_end > current:
        label = "BULLISH"
        if q_ext_lo[-1] > current:    conf = 0.88
        elif q_lo[-1] > current:      conf = 0.72
        elif q_hi[-1] > current:      conf = 0.58
        else:                         label, conf = "NEUTRAL", 0.50
    elif med_end < current:
        label = "BEARISH"
        if q_ext_hi[-1] < current:   conf = 0.88
        elif q_hi[-1] < current:     conf = 0.72
        elif q_lo[-1] < current:     conf = 0.58
        else:                        label, conf = "NEUTRAL", 0.50
    else:
        label, conf = "NEUTRAL", 0.50
    return label


# ── Rule-based signals ────────────────────────────────────────────────────────

def signal_sma_cross(closes):
    """10d MA crosses 30d MA at most recent bar."""
    if len(closes) < 30:
        return "NEUTRAL"
    ma10 = closes.iloc[-10:].mean()
    ma30 = closes.iloc[-30:].mean()
    if ma10 > ma30:
        return "BULLISH"
    elif ma10 < ma30:
        return "BEARISH"
    return "NEUTRAL"


def signal_mom_1m(closes):
    """21-day return sign."""
    if len(closes) < 22:
        return "NEUTRAL"
    ret = closes.iloc[-1] / closes.iloc[-22] - 1
    if ret > 0:
        return "BULLISH"
    elif ret < 0:
        return "BEARISH"
    return "NEUTRAL"


def signal_mom_3m(closes):
    """63-day return sign."""
    if len(closes) < 64:
        return "NEUTRAL"
    ret = closes.iloc[-1] / closes.iloc[-64] - 1
    if ret > 0:
        return "BULLISH"
    elif ret < 0:
        return "BEARISH"
    return "NEUTRAL"


def _calc_rsi(closes, period=14):
    """Classic EMA-based RSI."""
    delta = closes.diff()
    gain = delta.clip(lower=0)
    loss = (-delta).clip(lower=0)
    # Wilder EMA (equivalent to EWM with alpha=1/period, adjust=False)
    avg_gain = gain.ewm(alpha=1.0 / period, adjust=False, min_periods=period).mean()
    avg_loss = loss.ewm(alpha=1.0 / period, adjust=False, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi


def signal_rsi_contra(closes, period=14, oversold=35, overbought=65):
    """RSI contrarian: oversold → BULLISH, overbought → BEARISH."""
    if len(closes) < period + 1:
        return "NEUTRAL"
    rsi_series = _calc_rsi(closes, period)
    rsi_val = rsi_series.iloc[-1]
    if pd.isna(rsi_val):
        return "NEUTRAL"
    if rsi_val < oversold:
        return "BULLISH"
    elif rsi_val > overbought:
        return "BEARISH"
    return "NEUTRAL"


def signal_seasonal(commodity_key, pred_date):
    """Hardcoded monthly seasonal biases per commodity."""
    month = pred_date.month
    biases = SEASONAL_BIASES.get(commodity_key, {})
    return biases.get(month, "NEUTRAL")


def signal_macro_regime(macro_df, pred_date):
    """
    Rule-based from DXY + VIX:
    - VIX > 25 AND DXY rising (10d return > 0) → BEARISH (risk-off)
    - VIX < 16 AND DXY falling (10d return < 0) → BULLISH (risk-on for metals/oil)
    - else → NEUTRAL
    """
    if macro_df.empty or "vix" not in macro_df.columns or "dxy" not in macro_df.columns:
        return "NEUTRAL"

    available = macro_df[macro_df.index <= pred_date]
    if len(available) < 11:
        return "NEUTRAL"

    vix_val = float(available["vix"].iloc[-1])
    dxy_now = float(available["dxy"].iloc[-1])
    dxy_10d_ago = float(available["dxy"].iloc[-11])
    dxy_rising = (dxy_now / dxy_10d_ago - 1) > 0 if dxy_10d_ago != 0 else False

    if vix_val > 25 and dxy_rising:
        return "BEARISH"
    elif vix_val < 16 and not dxy_rising:
        return "BULLISH"
    return "NEUTRAL"


def signal_ensemble(sma_label, mom3m_label, rsi_label, seasonal_label):
    """
    Majority vote of 4 signals: SMA_CROSS, MOM_3M, RSI_CONTRA, SEASONAL.
    Need >= 3 agreeing on the same non-NEUTRAL direction for a signal.
    """
    votes = [sma_label, mom3m_label, rsi_label, seasonal_label]
    bull_count = sum(1 for v in votes if v == "BULLISH")
    bear_count = sum(1 for v in votes if v == "BEARISH")
    if bull_count >= 3:
        return "BULLISH"
    elif bear_count >= 3:
        return "BEARISH"
    return "NEUTRAL"


# ── FDA scoring ───────────────────────────────────────────────────────────────

def fda(label, actual_start, actual_end):
    """FDA: 1.0=correct, 0.0=wrong, 0.5=NEUTRAL."""
    if label == "NEUTRAL":
        return 0.5
    actual_up = actual_end > actual_start
    predicted_up = label == "BULLISH"
    return 1.0 if actual_up == predicted_up else 0.0


# ── Walk-forward runner ───────────────────────────────────────────────────────

def run():
    print("\nCommodityNode — Alternative Signal Comparison")
    print(f"Signals: {SIGNAL_NAMES}")
    print(f"Horizon: {HORIZON}d | Windows: {TEST_WINDOWS} | Step: {STEP}d")
    print("=" * 90)

    # [1/3] Price data
    print("\n[1/3] Fetching price data...")
    all_closes = {}
    for key, sym in COMMODITIES.items():
        s = fetch_history(sym)
        if s is not None and len(s) >= 300:
            all_closes[key] = s
            print(f"  {sym:8} {len(s)} days")
        else:
            print(f"  {sym:8} insufficient data — skipped")

    if not all_closes:
        print("ERROR: no commodity data")
        return

    # [2/3] Macro data (DXY + VIX for MACRO_REGIME)
    print("\n[2/3] Fetching macro data (DXY, VIX, US10Y)...")
    macro_df = fetch_covariates(period=PERIOD)
    print(f"  {macro_df.shape if not macro_df.empty else 'empty'}")

    # [3/3] Chronos-2 pipeline
    print("\n[3/3] Loading Chronos-2 pipeline...")
    pipeline = load_pipeline()
    print(f"  {'Chronos-2 loaded' if pipeline else 'using linear fallback'}")

    # results[commodity][signal] = list of fda scores
    results = {key: {sig: [] for sig in SIGNAL_NAMES} for key in all_closes}

    print()
    for key, closes in all_closes.items():
        n = len(closes)
        print(f"  [{key}] ({n} days)")

        for w in range(TEST_WINDOWS):
            pred_start = n - (TEST_WINDOWS - w) * STEP
            pred_end   = pred_start + HORIZON
            if pred_start < 252 or pred_end > n:
                continue

            context = closes.iloc[:pred_start]
            actual  = closes.iloc[pred_start:pred_end].values
            pred_date = context.index[-1]
            current_price = float(context.iloc[-1])
            actual_start = float(actual[0])
            actual_end   = float(actual[-1])

            ctx_macro = (
                macro_df[macro_df.index <= pred_date]
                if not macro_df.empty else macro_df
            )

            # -- CHRONOS2
            med, q_lo, q_hi, q_ext_lo, q_ext_hi = predict_chronos2(
                pipeline, context, ctx_macro
            )
            c2_label = chronos2_label(current_price, med, q_lo, q_hi, q_ext_lo, q_ext_hi)

            # -- Rule-based signals
            sma_label      = signal_sma_cross(context)
            mom1m_label    = signal_mom_1m(context)
            mom3m_label    = signal_mom_3m(context)
            rsi_label      = signal_rsi_contra(context)
            seasonal_label = signal_seasonal(key, pred_date)
            macro_label    = signal_macro_regime(macro_df, pred_date)
            ens_label      = signal_ensemble(sma_label, mom3m_label, rsi_label, seasonal_label)

            labels = {
                "CHRONOS2":    c2_label,
                "SMA_CROSS":   sma_label,
                "MOM_1M":      mom1m_label,
                "MOM_3M":      mom3m_label,
                "RSI_CONTRA":  rsi_label,
                "SEASONAL":    seasonal_label,
                "MACRO_REGIME": macro_label,
                "ENSEMBLE":    ens_label,
            }

            row_parts = []
            for sig in SIGNAL_NAMES:
                score = fda(labels[sig], actual_start, actual_end)
                results[key][sig].append(score)
                row_parts.append(f"{sig}={score:.1f}({labels[sig][0]})")

            print(f"    W{w+1:02d} [{pred_date.date()}]: {' | '.join(row_parts)}")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 90)
    print("RESULTS — FDA % (30-day directional accuracy)")
    print("=" * 90)

    col_w = 12
    header = f"{'Commodity':15}" + "".join(f"{s:>{col_w}}" for s in SIGNAL_NAMES) + f"{'Best':>{col_w}}"
    print(header)
    print("-" * 90)

    avg_by_sig = {sig: [] for sig in SIGNAL_NAMES}
    for key, sig_results in results.items():
        row = f"{key:15}"
        best_sig, best_val = None, -1.0
        for sig in SIGNAL_NAMES:
            vals = sig_results[sig]
            avg = np.mean(vals) * 100 if vals else float("nan")
            row += f"{avg:>{col_w}.1f}"
            avg_by_sig[sig].append(avg)
            if not np.isnan(avg) and avg > best_val:
                best_val, best_sig = avg, sig
        row += f"{best_sig:>{col_w}}"
        print(row)

    print("-" * 90)
    avg_row = f"{'AVERAGE':15}"
    best_overall_sig, best_overall_val = None, -1.0
    for sig in SIGNAL_NAMES:
        vals = [v for v in avg_by_sig[sig] if not np.isnan(v)]
        avg = np.mean(vals) if vals else float("nan")
        avg_row += f"{avg:>{col_w}.1f}"
        if not np.isnan(avg) and avg > best_overall_val:
            best_overall_val, best_overall_sig = avg, sig
    avg_row += f"{best_overall_sig:>{col_w}}"
    print(avg_row)

    print(f"\nRANDOM BASELINE: 50.0%")
    print(f"CHRONOS2 BASELINE: ~62.5%")
    print(f"(NEUTRAL scores 0.5)")
    print()

    # Beat-Chronos2 summary
    chronos2_avg = np.mean(
        [v for v in avg_by_sig["CHRONOS2"] if not np.isnan(v)]
    ) if avg_by_sig["CHRONOS2"] else float("nan")

    print("Signals that beat Chronos-2 ({:.1f}%):".format(chronos2_avg))
    found_any = False
    for sig in SIGNAL_NAMES:
        if sig == "CHRONOS2":
            continue
        vals = [v for v in avg_by_sig[sig] if not np.isnan(v)]
        sig_avg = np.mean(vals) if vals else float("nan")
        if not np.isnan(sig_avg) and not np.isnan(chronos2_avg) and sig_avg > chronos2_avg:
            print(f"  {sig}: {sig_avg:.1f}% (+{sig_avg - chronos2_avg:.1f}pp)")
            found_any = True
    if not found_any:
        print("  None — Chronos-2 remains the best signal.")


if __name__ == "__main__":
    run()
