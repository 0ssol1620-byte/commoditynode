# tests/test_alpha_signals.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))

import pytest
import pandas as pd
import numpy as np


def _make_closes(n=300, seed=42):
    rng = np.random.default_rng(seed)
    prices = 100 + np.cumsum(rng.normal(0, 1, n))
    return pd.Series(prices, index=pd.bdate_range("2023-01-01", periods=n))


def test_fetch_alpha_returns_dataframe():
    from alpha_signals import fetch_alpha_signals
    closes = _make_closes()
    result = fetch_alpha_signals("gold", closes, period="3y")
    assert isinstance(result, pd.DataFrame)
    assert len(result) == len(closes)


def test_gold_columns_present():
    from alpha_signals import fetch_alpha_signals
    closes = _make_closes()
    result = fetch_alpha_signals("gold", closes, period="3y")
    for col in ["tip_momentum_20d", "uup_momentum_20d", "gold_silver_zscore"]:
        assert col in result.columns, f"Missing column: {col}"


def test_copper_columns_present():
    from alpha_signals import fetch_alpha_signals
    closes = _make_closes()
    result = fetch_alpha_signals("copper", closes, period="3y")
    for col in ["mchi_momentum_20d", "fcx_momentum_20d", "lit_momentum_20d"]:
        assert col in result.columns, f"Missing column: {col}"


def test_no_nans_in_output():
    from alpha_signals import fetch_alpha_signals
    closes = _make_closes()
    for key in ["gold", "crude_oil", "copper", "natural_gas", "wheat", "silver"]:
        result = fetch_alpha_signals(key, closes, period="3y")
        assert result.isnull().sum().sum() == 0, f"{key} has NaN values"


def test_unknown_key_returns_empty():
    from alpha_signals import fetch_alpha_signals
    closes = _make_closes()
    result = fetch_alpha_signals("unobtanium", closes, period="3y")
    assert result.empty or len(result.columns) == 0
