"""
Commodity-specific alpha signal fetchers.
Uses free yfinance data only — no API keys required.
Each _xxx_signals() returns a NaN-free DataFrame aligned to closes.index.
"""
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import yfinance as yf


def fetch_alpha_signals(key: str, closes: pd.Series, period: str = "3y") -> pd.DataFrame:
    """Return commodity-specific alpha feature DataFrame aligned to closes.index."""
    dispatch = {
        "gold":        _gold_signals,
        "crude_oil":   _crude_oil_signals,
        "copper":      _copper_signals,
        "natural_gas": _natural_gas_signals,
        "wheat":       _wheat_signals,
        "silver":      _silver_signals,
    }
    fn = dispatch.get(key)
    if fn is None:
        return pd.DataFrame(index=closes.index)
    try:
        return fn(closes, period)
    except Exception as e:
        print(f"  alpha_signals [{key}] error: {e}")
        return pd.DataFrame(index=closes.index)


# ── helpers ───────────────────────────────────────────────────────────────────

def _fetch_series(sym: str, period: str, ref_index: pd.DatetimeIndex) -> pd.Series:
    """Fetch yfinance Close, realign to ref_index business days, ffill."""
    try:
        df = yf.Ticker(sym).history(period=period)
        if df.empty:
            return pd.Series(0.0, index=ref_index)
        s = df["Close"].dropna()
        idx = pd.DatetimeIndex([
            pd.Timestamp(ts).tz_localize(None).normalize() for ts in s.index
        ])
        s.index = idx
        return s.reindex(ref_index).ffill().fillna(0)
    except Exception as e:
        print(f"  _fetch_series {sym}: {e}")
        return pd.Series(0.0, index=ref_index)


def _zscore(s: pd.Series, window: int = 60) -> pd.Series:
    mu  = s.rolling(window, min_periods=20).mean()
    sig = s.rolling(window, min_periods=20).std().replace(0, np.nan)
    return ((s - mu) / sig).fillna(0)


def _momentum(s: pd.Series, days: int = 20) -> pd.Series:
    return s.pct_change(days).fillna(0)


# ── commodity-specific signal builders ───────────────────────────────────────

def _gold_signals(closes: pd.Series, period: str) -> pd.DataFrame:
    idx  = closes.index
    tip  = _fetch_series("TIP",  period, idx)
    uup  = _fetch_series("UUP",  period, idx)
    gld  = _fetch_series("GLD",  period, idx)
    slv  = _fetch_series("SLV",  period, idx)

    gld_safe = gld.copy()
    gld_safe[gld_safe <= 0] = np.nan
    slv_safe = slv.copy()
    slv_safe[slv_safe <= 0] = np.nan
    ratio = np.log((gld_safe / slv_safe).ffill().fillna(1))

    return pd.DataFrame({
        "tip_momentum_20d":  _momentum(tip, 20),
        "uup_momentum_20d":  _momentum(uup, 20),
        "gold_silver_zscore": _zscore(ratio, 60),
    }, index=idx)


def _crude_oil_signals(closes: pd.Series, period: str) -> pd.DataFrame:
    idx = closes.index
    xle = _fetch_series("XLE", period, idx)
    xop = _fetch_series("XOP", period, idx)
    bno = _fetch_series("BNO", period, idx)
    uso = _fetch_series("USO", period, idx)

    bno_safe = bno.copy(); bno_safe[bno_safe <= 0] = np.nan
    uso_safe = uso.copy(); uso_safe[uso_safe <= 0] = np.nan
    basis = np.log((bno_safe / uso_safe).ffill().fillna(1))

    return pd.DataFrame({
        "xle_momentum_20d": _momentum(xle, 20),
        "xop_momentum_20d": _momentum(xop, 20),
        "bno_uso_zscore":   _zscore(basis, 60),
    }, index=idx)


def _copper_signals(closes: pd.Series, period: str) -> pd.DataFrame:
    idx  = closes.index
    mchi = _fetch_series("MCHI", period, idx)
    fcx  = _fetch_series("FCX",  period, idx)
    lit  = _fetch_series("LIT",  period, idx)

    return pd.DataFrame({
        "mchi_momentum_20d": _momentum(mchi, 20),
        "fcx_momentum_20d":  _momentum(fcx,  20),
        "lit_momentum_20d":  _momentum(lit,  20),
    }, index=idx)


def _natural_gas_signals(closes: pd.Series, period: str) -> pd.DataFrame:
    idx = closes.index
    xlu = _fetch_series("XLU", period, idx)
    ung = _fetch_series("UNG", period, idx)

    ung_base = ung.rolling(252, min_periods=63).mean()
    ung_base[ung_base <= 0] = np.nan
    ung_dev  = ((ung - ung_base) / ung_base).fillna(0)

    return pd.DataFrame({
        "xlu_momentum_20d": _momentum(xlu, 20),
        "ung_vs_seasonal":  ung_dev,
        "winter_factor":    idx.month.isin([10, 11, 12, 1, 2, 3]).astype(float),
    }, index=idx)


def _wheat_signals(closes: pd.Series, period: str) -> pd.DataFrame:
    idx  = closes.index
    weat = _fetch_series("WEAT", period, idx)
    dba  = _fetch_series("DBA",  period, idx)

    return pd.DataFrame({
        "weat_momentum_20d": _momentum(weat, 20),
        "dba_momentum_20d":  _momentum(dba,  20),
        "harvest_season":    idx.month.isin([7, 8, 9]).astype(float),
        "planting_season":   idx.month.isin([3, 4, 5]).astype(float),
    }, index=idx)


def _silver_signals(closes: pd.Series, period: str) -> pd.DataFrame:
    idx = closes.index
    tip = _fetch_series("TIP", period, idx)
    gld = _fetch_series("GLD", period, idx)
    slv = _fetch_series("SLV", period, idx)

    slv_safe = slv.copy(); slv_safe[slv_safe <= 0] = np.nan
    gld_safe = gld.copy(); gld_safe[gld_safe <= 0] = np.nan
    ratio = np.log((slv_safe / gld_safe).ffill().fillna(1))

    return pd.DataFrame({
        "tip_momentum_20d":    _momentum(tip, 20),
        "gld_momentum_20d":    _momentum(gld, 20),
        "slv_vs_gold_zscore":  _zscore(ratio, 60),
    }, index=idx)
