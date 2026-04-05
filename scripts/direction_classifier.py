"""
CommodityNode — GradBoost Direction Classifier
30일 가격 방향성(UP=1 / DOWN=0) 분류기.
commodity별 맞춤 피처 수집 + sklearn GradBoostingClassifier.
"""
import os
import warnings
from typing import Optional

import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore")

import sys
sys.path.insert(0, os.path.dirname(__file__))
from forecast_chronos2 import add_technical_features

# ── commodity별 추가 ticker 설정 ──────────────────────────────────────────
COMMODITY_EXTRA_TICKERS = {
    "gold":        {"tyx": "^TYX"},           # 30Y yield → term_premium
    "natural_gas": {},                          # 계절성만 사용
    "crude_oil":   {"sp500": "^GSPC"},         # S&P500
    "copper":      {"sp500": "^GSPC"},
    "wheat":       {},                          # 계절성만 사용
}
SEASONAL_COMMODITIES = {"natural_gas", "wheat"}

HORIZON = 30  # 방향성 예측 기간 (영업일)


def _fetch_extra(tickers: dict, period: str) -> pd.DataFrame:
    """추가 ticker 수집 → 영업일 인덱스 DataFrame."""
    frames = {}
    for name, sym in tickers.items():
        try:
            df = yf.Ticker(sym).history(period=period)
            if df.empty:
                continue
            s = df["Close"].dropna()
            s.index = pd.DatetimeIndex([
                pd.Timestamp(ts).tz_localize(None).normalize() for ts in s.index
            ])
            bday = pd.bdate_range(start=s.index[0], end=s.index[-1])
            frames[name] = s.reindex(bday).ffill().fillna(0)
        except Exception as e:
            print(f"  Extra ticker {sym}: {e}")
    if not frames:
        return pd.DataFrame()
    return pd.DataFrame(frames)


def _seasonal_features(index: pd.DatetimeIndex) -> pd.DataFrame:
    """월/분기 사인-코사인 계절성 피처."""
    return pd.DataFrame({
        "month_sin":   np.sin(2 * np.pi * index.month / 12),
        "month_cos":   np.cos(2 * np.pi * index.month / 12),
        "quarter_sin": np.sin(2 * np.pi * index.quarter / 4),
        "quarter_cos": np.cos(2 * np.pi * index.quarter / 4),
    }, index=index)


def build_feature_matrix(
    key: str,
    closes: pd.Series,
    macro_df: pd.DataFrame,
    period: str = "3y",
) -> pd.DataFrame:
    """
    commodity별 맞춤 피처 행렬 구성.
    반환: DataFrame (index=날짜, columns=피처들). NaN은 0으로 채움.
    """
    tech = add_technical_features(closes)

    feat = pd.DataFrame(index=closes.index)
    if not macro_df.empty:
        feat = feat.join(macro_df[["dxy", "vix", "us10y"]], how="left")
        feat[["dxy", "vix", "us10y"]] = feat[["dxy", "vix", "us10y"]].ffill().fillna(0)
    else:
        feat["dxy"] = feat["vix"] = feat["us10y"] = 0.0

    feat = feat.join(tech, how="left")

    extra_tickers = COMMODITY_EXTRA_TICKERS.get(key, {})
    if extra_tickers:
        extra_df = _fetch_extra(extra_tickers, period=period)
        if not extra_df.empty:
            feat = feat.join(extra_df, how="left")
            feat[list(extra_df.columns)] = feat[list(extra_df.columns)].ffill().fillna(0)
        if key == "gold" and "tyx" in feat.columns and "us10y" in feat.columns:
            feat["term_premium"] = feat["tyx"] - feat["us10y"]

    if key in SEASONAL_COMMODITIES:
        seasonal = _seasonal_features(feat.index)
        feat = feat.join(seasonal, how="left")

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
) -> Optional[float]:
    """
    closes[:train_end_idx]로 학습 → closes[train_end_idx]에서 P(up) 반환.
    학습 데이터 부족(< 120행) 시 None 반환.
    No look-ahead: train_end_idx 이후 데이터 일절 사용 안 함.
    """
    features = build_feature_matrix(key, closes, macro_df, period=period)
    labels   = make_labels(closes, horizon=horizon)

    train_feat = features.iloc[:train_end_idx - horizon]
    train_lab  = labels.iloc[:train_end_idx - horizon]

    valid_mask = train_lab.notna()
    train_feat = train_feat[valid_mask]
    train_lab  = train_lab[valid_mask]

    if len(train_feat) < 120:
        return None

    class_counts = train_lab.value_counts()
    if len(class_counts) < 2 or class_counts.min() < 10:
        return None

    clf = build_clf()
    clf.fit(train_feat.values, train_lab.values.astype(int))

    # train_end_idx == len(features)인 경우 마지막 알려진 행 사용
    pred_idx  = min(train_end_idx, len(features) - 1)
    pred_feat = features.iloc[pred_idx:pred_idx + 1]
    if pred_feat.empty:
        return None

    prob    = clf.predict_proba(pred_feat.values)[0]
    classes = list(clf.named_steps["clf"].classes_)
    p_up    = float(prob[classes.index(1)]) if 1 in classes else 0.5
    return p_up
