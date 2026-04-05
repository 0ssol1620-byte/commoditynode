import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))

import pytest
import pandas as pd
import numpy as np


def _make_data(n=400, seed=7):
    rng = np.random.default_rng(seed)
    prices = 100 + np.cumsum(rng.normal(0, 1, n))
    closes = pd.Series(prices, index=pd.bdate_range("2022-01-01", periods=n))
    macro_df = pd.DataFrame({
        "dxy": 100 + np.cumsum(rng.normal(0, 0.1, n)),
        "vix": 20 + rng.normal(0, 2, n),
        "us10y": 3 + rng.normal(0, 0.1, n),
    }, index=closes.index)
    return closes, macro_df


def test_alpha_signals_included_in_features():
    from direction_classifier import build_feature_matrix
    closes, macro_df = _make_data()
    feat = build_feature_matrix("gold", closes, macro_df, period="3y")
    assert "tip_momentum_20d" in feat.columns, "Gold features missing tip_momentum_20d"


def test_copper_alpha_features():
    from direction_classifier import build_feature_matrix
    closes, macro_df = _make_data()
    feat = build_feature_matrix("copper", closes, macro_df, period="3y")
    assert "mchi_momentum_20d" in feat.columns


def test_no_nan_after_build():
    from direction_classifier import build_feature_matrix
    closes, macro_df = _make_data()
    for key in ["gold", "crude_oil", "copper", "natural_gas", "wheat"]:
        feat = build_feature_matrix(key, closes, macro_df, period="3y")
        assert feat.isnull().sum().sum() == 0, f"{key} feature matrix has NaN"


def test_old_extra_tickers_removed():
    import direction_classifier as dc
    assert not hasattr(dc, "COMMODITY_EXTRA_TICKERS"), \
        "COMMODITY_EXTRA_TICKERS still present — remove it"
