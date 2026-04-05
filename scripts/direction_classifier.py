"""
CommodityNode — GradBoost Direction Classifier
30일 가격 방향성(UP=1 / DOWN=0) 분류기.
commodity별 alpha 피처 수집 + sklearn GradBoostingClassifier.
"""
import os
import warnings
from typing import Optional

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore")

import sys
sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import add_technical_features
from alpha_signals import fetch_alpha_signals

HORIZON = 30  # 방향성 예측 기간 (영업일)


def _resample_weekly(closes: pd.Series, macro_df: pd.DataFrame) -> tuple:
    """일봉 → 주봉 리샘플링 (Friday close 기준)."""
    w_closes = closes.resample("W-FRI").last().dropna()
    if not macro_df.empty:
        w_macro = macro_df.resample("W-FRI").last().reindex(w_closes.index).ffill().fillna(0)
    else:
        w_macro = macro_df
    return w_closes, w_macro


def build_feature_matrix(
    key: str,
    closes: pd.Series,
    macro_df: pd.DataFrame,
    period: str = "3y",
) -> pd.DataFrame:
    """
    commodity별 맞춤 피처 행렬.
    = macro (DXY/VIX/US10Y) + technical + commodity-specific alpha signals.
    반환: DataFrame (index=날짜, columns=피처들). NaN은 0으로 채움.
    """
    tech = add_technical_features(closes)

    feat = pd.DataFrame(index=closes.index)

    # Macro covariates
    if not macro_df.empty:
        feat = feat.join(macro_df[["dxy", "vix", "us10y"]], how="left")
        feat[["dxy", "vix", "us10y"]] = feat[["dxy", "vix", "us10y"]].ffill().fillna(0)
    else:
        feat["dxy"] = feat["vix"] = feat["us10y"] = 0.0

    # Technical indicators
    feat = feat.join(tech, how="left")

    # Commodity-specific alpha signals (replaces old COMMODITY_EXTRA_TICKERS)
    alpha_df = fetch_alpha_signals(key, closes, period=period)
    if not alpha_df.empty:
        feat = feat.join(alpha_df, how="left")
        for col in alpha_df.columns:
            feat[col] = feat[col].ffill().fillna(0)

    return feat.fillna(0)


def make_labels(closes: pd.Series, horizon: int = HORIZON) -> pd.Series:
    """
    30일 후 가격이 오르면 1, 내리면 0.
    마지막 horizon 행은 미래 데이터 없으므로 NaN.
    """
    future = closes.shift(-horizon)
    return (future > closes).astype(float).where(future.notna())


def build_clf() -> Pipeline:
    """GradientBoostingClassifier 파이프라인 (StandardScaler 포함)."""
    return Pipeline([
        ("scaler", StandardScaler()),
        ("clf", GradientBoostingClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.8,
            min_samples_leaf=10,
            random_state=42,
        )),
    ])


def train_and_predict(
    key: str,
    closes: pd.Series,
    macro_df: pd.DataFrame,
    train_end_idx: int,
    horizon: int = HORIZON,
    period: str = "3y",
    use_weekly: bool = True,
) -> Optional[float]:
    """
    closes[:train_end_idx]로 학습 → closes[train_end_idx]에서 P(up) 반환.
    학습 데이터 부족(< 120행) 시 None 반환.
    """
    if use_weekly:
        w_closes, w_macro = _resample_weekly(closes, macro_df)
        # Convert train_end_idx (daily) to weekly equivalent
        train_end_date = closes.index[min(train_end_idx - 1, len(closes) - 1)]
        w_train_end = int(np.searchsorted(w_closes.index, train_end_date, side='right'))
        horizon_label = 4  # 4 weeks ≈ 30 days
        min_samples = 60
        min_class = 5
        closes = w_closes
        macro_df = w_macro
        train_end_idx = w_train_end
    else:
        horizon_label = horizon
        min_samples = 120
        min_class = 10

    features = build_feature_matrix(key, closes, macro_df, period=period)
    labels   = make_labels(closes, horizon=horizon_label)

    train_feat = features.iloc[:train_end_idx - horizon_label]
    train_lab  = labels.iloc[:train_end_idx - horizon_label]

    valid_mask = train_lab.notna()
    train_feat = train_feat[valid_mask]
    train_lab  = train_lab[valid_mask]

    if len(train_feat) < min_samples:
        return None

    class_counts = train_lab.value_counts()
    if len(class_counts) < 2 or class_counts.min() < min_class:
        return None

    clf = build_clf()
    clf.fit(train_feat.values, train_lab.values.astype(int))

    pred_idx  = min(train_end_idx, len(features) - 1)
    pred_feat = features.iloc[pred_idx:pred_idx + 1]
    if pred_feat.empty:
        return None

    prob    = clf.predict_proba(pred_feat.values)[0]
    classes = list(clf.named_steps["clf"].classes_)
    p_up    = float(prob[classes.index(1)]) if 1 in classes else 0.5
    return p_up
