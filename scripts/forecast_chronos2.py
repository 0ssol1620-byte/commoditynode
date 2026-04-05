"""
CommodityNode — Chronos-2 Forecast Pipeline (최적화 버전)
=========================================================
모델: amazon/chronos-2 (2025-10-20 출시, SOTA)
- Univariate + Multivariate + Covariate 지원
- 최대 컨텍스트: 8,192 steps (이전 512에서 16배 확장)
- 최대 예측: 1,024 steps
- 기존 Chronos-Bolt 대비 승률 90%+

매일 실행: 19개 원자재 90일 예측 → assets/data/forecast.json
"""
import json, os, warnings
from datetime import datetime, timezone
import numpy as np
import pandas as pd
import yfinance as yf
import ta as ta_lib

warnings.filterwarnings('ignore')

MACRO_TICKERS = {
    "dxy":   "DX-Y.NYB",
    "vix":   "^VIX",
    "us10y": "^TNX",
}

# Chronos-2 임포트
try:
    import torch
    from chronos import Chronos2Pipeline
    CHRONOS2_AVAILABLE = True
    print("✓ Chronos-2 로드 성공")
except ImportError as e:
    CHRONOS2_AVAILABLE = False
    print(f"✗ Chronos-2 unavailable: {e} → fallback 사용")

def fetch_covariates(period: str = "5y") -> pd.DataFrame:
    """
    DXY, VIX, US10Y를 수집하여 영업일 인덱스로 정렬한 DataFrame 반환.
    결측값은 forward-fill (휴일 등).
    """
    frames = {}
    for name, sym in MACRO_TICKERS.items():
        try:
            ticker = yf.Ticker(sym)
            df = ticker.history(period=period)
            if df.empty:
                continue
            s = df["Close"].dropna()
            idx = pd.DatetimeIndex([
                pd.Timestamp(ts).tz_localize(None).normalize()
                for ts in s.index
            ])
            s.index = idx
            frames[name] = s
        except Exception as e:
            print(f"  Macro fetch {sym}: {e}")

    if not frames:
        return pd.DataFrame()

    macro_df = pd.DataFrame(frames)
    start = min(s.index[0] for s in frames.values())
    end   = max(s.index[-1] for s in frames.values())
    bday  = pd.bdate_range(start=start, end=end)
    macro_df = macro_df.reindex(bday).ffill().fillna(0)
    return macro_df


def add_technical_features(closes: pd.Series) -> pd.DataFrame:
    """
    단일 원자재 가격 시리즈에서 기술 지표 계산.
    반환 컬럼: ret_1d, ret_5d, vol_20d, rsi_14
    Note: rolling window 때문에 초기 행은 NaN → 0으로 채움.
    """
    df = pd.DataFrame({"close": closes})
    df["ret_1d"]  = df["close"].pct_change(1)
    df["ret_5d"]  = df["close"].pct_change(5)
    df["vol_20d"] = df["close"].pct_change().rolling(20).std()
    try:
        df["rsi_14"] = ta_lib.momentum.RSIIndicator(
            close=df["close"], window=14
        ).rsi()
    except Exception as e:
        print(f"  RSI calculation failed: {e}")
        df["rsi_14"] = np.nan
    return df[["ret_1d", "ret_5d", "vol_20d", "rsi_14"]].fillna(0)


# ── 원자재 목록 ──────────────────────────────────────────────────────────────
COMMODITIES = {
    "crude_oil":    {"symbol": "CL=F",  "name": "Crude Oil",      "unit": "$/barrel"},
    "gold":         {"symbol": "GC=F",  "name": "Gold",            "unit": "$/oz"},
    "copper":       {"symbol": "HG=F",  "name": "Copper",          "unit": "$/lb"},
    "natural_gas":  {"symbol": "NG=F",  "name": "Natural Gas",     "unit": "$/MMBtu"},
    "silver":       {"symbol": "SI=F",  "name": "Silver",          "unit": "$/oz"},
    "wheat":        {"symbol": "ZW=F",  "name": "Wheat",           "unit": "¢/bushel"},
    "corn":         {"symbol": "ZC=F",  "name": "Corn",            "unit": "¢/bushel"},
    "soybeans":     {"symbol": "ZS=F",  "name": "Soybeans",        "unit": "¢/bushel"},
    "coffee":       {"symbol": "KC=F",  "name": "Coffee",          "unit": "¢/lb"},
    "sugar":        {"symbol": "SB=F",  "name": "Sugar",           "unit": "¢/lb"},
    "cocoa":        {"symbol": "CC=F",  "name": "Cocoa",           "unit": "$/tonne"},
    "cotton":       {"symbol": "CT=F",  "name": "Cotton",          "unit": "¢/lb"},
    "orange_juice": {"symbol": "OJ=F",  "name": "Orange Juice",    "unit": "¢/lb"},
    "lumber":       {"symbol": "LBS=F", "name": "Lumber",          "unit": "$/1000 board ft"},
    "platinum":     {"symbol": "PL=F",  "name": "Platinum",        "unit": "$/oz"},
    "palladium":    {"symbol": "PA=F",  "name": "Palladium",       "unit": "$/oz"},
    "aluminum":     {"symbol": "ALI=F", "name": "Aluminum",        "unit": "¢/lb"},
    "uranium":      {"symbol": "URA",   "name": "Uranium ETF",     "unit": "$/share"},
    "lithium":      {"symbol": "ALB",   "name": "Lithium (ALB)",   "unit": "$/share"},
}

def fetch_history(symbol, period="5y"):
    """
    5년치 데이터 수집 (Chronos-2 최대 컨텍스트 8192 steps 최대 활용).
    5년 = ~1260 영업일 → 충분한 계절성/사이클 패턴 학습 가능.
    영업일(Business Day) 기준으로 리샘플링 → Chronos-2 freq 자동 감지.
    """
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        if df.empty:
            df = ticker.history(period="2y")
        if df.empty:
            return None
        closes = df['Close'].dropna()

        # timezone 제거 + 날짜만 (tz-naive DatetimeIndex)
        idx = pd.DatetimeIndex([
            pd.Timestamp(ts).tz_localize(None).normalize()
            for ts in closes.index
        ])
        closes.index = idx

        # 영업일 기준 리샘플 (휴일 gap → ffill로 채움)
        # Chronos-2 predict_df가 freq 자동 감지 → 'B'가 되어야 에러 없음
        bday_range = pd.bdate_range(start=idx[0], end=idx[-1])
        closes = closes.reindex(bday_range).ffill().dropna()

        return closes
    except Exception as e:
        print(f"  Error fetching {symbol}: {e}")
        return None

COVARIATE_COLS = ["dxy", "vix", "us10y", "ret_1d", "ret_5d", "vol_20d", "rsi_14"]

def forecast_with_chronos2(closes_dict, macro_df, prediction_length=90):
    """
    Chronos-2 predict_df with covariates.
    - context_df: target + covariate 컬럼 (과거)
    - future_df: covariate 컬럼만 (예측 기간, last-known forward-fill, no look-ahead bias)
    """
    if not CHRONOS2_AVAILABLE:
        return {k: forecast_fallback(v, prediction_length) for k, v in closes_dict.items()}

    try:
        print("  Chronos-2 로드 중...")
        from chronos import Chronos2Pipeline
        pipeline = Chronos2Pipeline.from_pretrained(
            "amazon/chronos-2",
            device_map="cpu",
            torch_dtype=torch.float32,
        )

        context_rows = []
        future_rows  = []

        for key, closes in closes_dict.items():
            tech = add_technical_features(closes)

            ctx = pd.DataFrame({"target": closes})
            if not macro_df.empty:
                ctx = ctx.join(macro_df[["dxy", "vix", "us10y"]], how="left")
                ctx[["dxy", "vix", "us10y"]] = ctx[["dxy", "vix", "us10y"]].ffill().bfill()
            else:
                ctx["dxy"] = ctx["vix"] = ctx["us10y"] = 0.0

            ctx = ctx.join(tech, how="left")
            ctx[COVARIATE_COLS[3:]] = ctx[COVARIATE_COLS[3:]].ffill().fillna(0)
            ctx = ctx.dropna(subset=["target"])
            ctx["id"] = key
            ctx["timestamp"] = ctx.index
            ctx = ctx.reset_index(drop=True)
            context_rows.append(ctx)

            last_date = closes.index[-1]
            future_dates = pd.bdate_range(
                start=last_date + pd.Timedelta(days=1),
                periods=prediction_length,
            )
            last_known = ctx[COVARIATE_COLS].iloc[-1].fillna(0)
            fut = pd.DataFrame(
                {col: [last_known[col]] * prediction_length for col in COVARIATE_COLS}
            )
            fut["id"] = key
            fut["timestamp"] = future_dates
            future_rows.append(fut)

        context_df = pd.concat(context_rows, ignore_index=True)
        future_df  = pd.concat(future_rows,  ignore_index=True)

        print(f"  배치 예측 시작: {len(closes_dict)}개 원자재, prediction_length={prediction_length}")

        pred_df = pipeline.predict_df(
            context_df,
            future_df=future_df,
            prediction_length=prediction_length,
            quantile_levels=[0.1, 0.25, 0.5, 0.75, 0.9],
            id_column="id",
            timestamp_column="timestamp",
            target="target",
        )

        results = {}
        for key in closes_dict.keys():
            item_pred = pred_df[pred_df["id"] == key].sort_values("timestamp")
            if item_pred.empty:
                results[key] = forecast_fallback(closes_dict[key], prediction_length)
                continue

            median      = item_pred["predictions"].values
            p10         = item_pred["0.25"].values
            p90         = item_pred["0.75"].values
            p10_extreme = item_pred["0.1"].values
            p90_extreme = item_pred["0.9"].values
            results[key] = (median, p10, p90, p10_extreme, p90_extreme)

        return results

    except Exception as e:
        print(f"  Chronos-2 covariate error: {e}")
        print("  → fallback 선형 트렌드로 전환")
        return {k: forecast_fallback(v, prediction_length) for k, v in closes_dict.items()}


def forecast_fallback(closes, prediction_length=90):
    """Chronos-2 실패 시 fallback: 선형 회귀 + 표준편차 기반 밴드"""
    prices = closes.values[-120:]
    x = np.arange(len(prices))
    z = np.polyfit(x, prices, 1)
    slope = z[0]
    last = prices[-1]
    std = np.std(np.diff(prices))

    median = last + slope * np.arange(1, prediction_length + 1)
    # 시간에 따라 불확실성 증가 (sqrt 스케일)
    noise = std * np.sqrt(np.arange(1, prediction_length + 1) / 10)
    p10 = median - 1.28 * noise
    p90 = median + 1.28 * noise
    return (median, p10, p90)


def run():
    output = {}
    now = datetime.now(timezone.utc).isoformat()

    print(f"\nCommodityNode Forecast — Chronos-2 (amazon/chronos-2)")
    print(f"실행 시각: {now}")
    print("=" * 60)

    # ── 0단계: 매크로 데이터 수집 ────────────────────────────────────────
    print("\n[0/3] 매크로 covariate 수집 (DXY, VIX, US10Y)...")
    macro_df = fetch_covariates(period="5y")
    if macro_df.empty:
        print("  ⚠ 매크로 데이터 없음 — covariate 없이 진행")
    else:
        print(f"  ✓ {macro_df.shape[1]}개 팩터, {len(macro_df)}일")

    # ── 1단계: 전체 원자재 히스토리 수집 ────────────────────────────────
    print("\n[1/3] 히스토리 데이터 수집 (5년치)...")
    closes_dict = {}
    for key, meta in COMMODITIES.items():
        symbol = meta['symbol']
        print(f"  {symbol}...", end=" ")
        closes = fetch_history(symbol, period="5y")
        if closes is None or len(closes) < 30:
            print("❌ no data")
            continue
        closes_dict[key] = closes
        print(f"✓ {len(closes)}일")

    if not closes_dict:
        print("ERROR: 데이터 없음")
        return

    # ── 2단계: Chronos-2 배치 예측 ───────────────────────────────────────
    print(f"\n[2/3] Chronos-2 배치 예측 ({len(closes_dict)}개 원자재, 90일)...")
    forecast_results = forecast_with_chronos2(closes_dict, macro_df, prediction_length=90)

    # ── 3단계: 결과 포맷팅 및 저장 ───────────────────────────────────────
    print("\n[3/3] 결과 저장...")
    for key, meta in COMMODITIES.items():
        if key not in closes_dict:
            continue

        closes = closes_dict[key]
        fc_result = forecast_results.get(key)
        if fc_result is None:
            continue

        if len(fc_result) == 5:
            median, p10, p90, p10_extreme, p90_extreme = fc_result
        else:
            median, p10, p90 = fc_result
            p10_extreme, p90_extreme = p10, p90

        # 영업일 기준 예측 날짜
        last_date = closes.index[-1]
        future_dates = pd.bdate_range(
            start=last_date + pd.Timedelta(days=1),
            periods=90
        )

        current_price = float(closes.iloc[-1])
        forecast_30d  = float(median[29]) if len(median) > 29 else current_price
        forecast_90d  = float(median[89]) if len(median) > 89 else current_price

        output[key] = {
            "name":           meta['name'],
            "unit":           meta['unit'],
            "symbol":         meta['symbol'],
            "current_price":  round(current_price, 4),
            "forecast_30d":   round(forecast_30d, 4),
            "forecast_90d":   round(forecast_90d, 4),
            "change_30d_pct": round((forecast_30d - current_price) / current_price * 100, 2),
            "change_90d_pct": round((forecast_90d - current_price) / current_price * 100, 2),
            "model":          "amazon/chronos-2" if CHRONOS2_AVAILABLE else "linear-fallback",
            "forecast": {
                "dates":   [d.strftime('%Y-%m-%d') for d in future_dates],
                "median":  [round(float(v), 4) for v in median],
                # 차트용 밴드: P25~P75 (시각화에 적합한 좁은 범위)
                "p10":     [round(float(v), 4) for v in p10],
                "p90":     [round(float(v), 4) for v in p90],
                # 극단 범위: P10/P90 (메트릭 패널 upside/downside용)
                "p10_extreme": [round(float(v), 4) for v in p10_extreme],
                "p90_extreme": [round(float(v), 4) for v in p90_extreme],
            },
            # 히스토리: 최근 180일 (차트 표시용)
            "history": {
                "dates":  [d.strftime('%Y-%m-%d') for d in closes.index[-180:]],
                "prices": [round(float(v), 4) for v in closes.values[-180:]],
            },
            "context_length": len(closes),  # 실제 사용한 컨텍스트 길이
            "updated_at": now,
        }

        sign = '+' if output[key]['change_90d_pct'] >= 0 else ''
        print(f"  {meta['symbol']:8} ${current_price:.2f} → 90d: ${forecast_90d:.2f} ({sign}{output[key]['change_90d_pct']}%)")

    # 저장
    out_path = os.path.join(
        os.path.dirname(__file__), '..', 'assets', 'data', 'forecast.json'
    )
    with open(out_path, 'w') as f:
        json.dump(output, f, indent=2)

    model_used = "amazon/chronos-2 ✓" if CHRONOS2_AVAILABLE else "linear-fallback ⚠"
    print(f"\n✅ 완료: {len(output)}개 → assets/data/forecast.json")
    print(f"   모델: {model_used}")
    print(f"   컨텍스트: 최대 5년치 사용")


if __name__ == '__main__':
    run()
