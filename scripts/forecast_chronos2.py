"""
CommodityNode — Chronos-2 Forecast Pipeline
매일 실행: 60개 원자재 90일 예측 → assets/data/forecast.json
"""
import json, os, warnings
from datetime import datetime, timezone
import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings('ignore')

# Chronos-2 임포트 (설치 필요: pip install chronos-forecasting)
try:
    import torch
    from chronos import ChronosPipeline
    CHRONOS_AVAILABLE = True
except ImportError:
    CHRONOS_AVAILABLE = False
    print("Chronos not available, using fallback")

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
    "steel":        {"symbol": "SLX",   "name": "Steel ETF",       "unit": "$/share"},
}

def fetch_history(symbol, period="2y"):
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        if df.empty:
            return None
        closes = df['Close'].dropna()
        return closes
    except Exception as e:
        print(f"  Error fetching {symbol}: {e}")
        return None

def forecast_with_chronos(closes, prediction_length=90):
    """Chronos-2로 예측"""
    if not CHRONOS_AVAILABLE:
        return forecast_fallback(closes, prediction_length)
    
    try:
        pipeline = ChronosPipeline.from_pretrained(
            "amazon/chronos-t5-small",  # 빠른 소형 모델
            device_map="cpu",
            torch_dtype=torch.float32,
        )
        context = torch.tensor(closes.values[-200:], dtype=torch.float32).unsqueeze(0)
        forecast = pipeline.predict(
            inputs=context,
            prediction_length=prediction_length,
            num_samples=20,
        )
        # forecast shape: (1, num_samples, prediction_length)
        samples = forecast[0].numpy()  # (20, 90)
        median = np.median(samples, axis=0)
        p10 = np.percentile(samples, 10, axis=0)
        p90 = np.percentile(samples, 90, axis=0)
        return median, p10, p90
    except Exception as e:
        print(f"  Chronos error: {e}, using fallback")
        return forecast_fallback(closes, prediction_length)

def forecast_fallback(closes, prediction_length=90):
    """Chronos 없을 때 간단한 트렌드 예측"""
    prices = closes.values[-60:]
    x = np.arange(len(prices))
    z = np.polyfit(x, prices, 1)
    slope = z[0]
    last = prices[-1]
    std = np.std(np.diff(prices))
    
    future_x = np.arange(len(prices), len(prices) + prediction_length)
    median = last + slope * np.arange(1, prediction_length + 1)
    noise = std * np.sqrt(np.arange(1, prediction_length + 1) / 10)
    p10 = median - 1.28 * noise
    p90 = median + 1.28 * noise
    return median, p10, p90

def run():
    output = {}
    now = datetime.now(timezone.utc).isoformat()
    
    print(f"CommodityNode Forecast — {now}")
    print("="*50)
    
    for key, meta in COMMODITIES.items():
        symbol = meta['symbol']
        print(f"  {symbol}...")
        
        closes = fetch_history(symbol)
        if closes is None or len(closes) < 30:
            print(f"    No data")
            continue
        
        # 예측 실행
        median, p10, p90 = forecast_with_chronos(closes, prediction_length=90)
        
        # 날짜 생성 (영업일 기준)
        last_date = closes.index[-1]
        future_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1), periods=90)
        
        current_price = float(closes.iloc[-1])
        forecast_30d = float(median[29])
        forecast_90d = float(median[89])
        
        output[key] = {
            "name": meta['name'],
            "unit": meta['unit'],
            "symbol": symbol,
            "current_price": round(current_price, 4),
            "forecast_30d": round(forecast_30d, 4),
            "forecast_90d": round(forecast_90d, 4),
            "change_30d_pct": round((forecast_30d - current_price) / current_price * 100, 2),
            "change_90d_pct": round((forecast_90d - current_price) / current_price * 100, 2),
            "forecast": {
                "dates": [d.strftime('%Y-%m-%d') for d in future_dates],
                "median": [round(float(v), 4) for v in median],
                "p10":    [round(float(v), 4) for v in p10],
                "p90":    [round(float(v), 4) for v in p90],
            },
            "history": {
                "dates":  [d.strftime('%Y-%m-%d') for d in closes.index[-180:]],
                "prices": [round(float(v), 4) for v in closes.values[-180:]],
            },
            "updated_at": now,
        }
        
        sign = '+' if output[key]['change_90d_pct'] >= 0 else ''
        print(f"    ${current_price:.2f} → 90d: ${forecast_90d:.2f} ({sign}{output[key]['change_90d_pct']}%)")
    
    # 저장
    out_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'data', 'forecast.json')
    with open(out_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\nSaved {len(output)} forecasts → assets/data/forecast.json")

if __name__ == '__main__':
    run()
