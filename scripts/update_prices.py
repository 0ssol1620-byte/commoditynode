#!/usr/bin/env python3
"""
Daily commodity price updater for CommodityNode.
Fetches prices via yfinance, updates _data/prices.json
and assets/data/chart-data.json (for static chart rendering).
"""
import json, os, math, random
import yfinance as yf
from datetime import datetime, timedelta

COMMODITIES = {
    "crude_oil":    {"symbol": "CL=F",  "name": "Crude Oil",        "unit": "$/barrel"},
    "gold":         {"symbol": "GC=F",  "name": "Gold",              "unit": "$/oz"},
    "copper":       {"symbol": "HG=F",  "name": "Copper",            "unit": "$/lb"},
    "natural_gas":  {"symbol": "NG=F",  "name": "Natural Gas",       "unit": "$/MMBtu"},
    "wheat":        {"symbol": "ZW=F",  "name": "Wheat",             "unit": "cents/bushel"},
    "lithium":      {"symbol": "LTHM",  "name": "Lithium (proxy)",   "unit": "$/share"},
    "silver":       {"symbol": "SI=F",  "name": "Silver",            "unit": "$/oz"},
    "corn":         {"symbol": "ZC=F",  "name": "Corn",              "unit": "cents/bushel"},
    "uranium":      {"symbol": "CCJ",   "name": "Uranium (proxy)",   "unit": "$/share"},
    "aluminum":     {"symbol": "AA",    "name": "Aluminum (proxy)",  "unit": "$/share"},
    "coffee":       {"symbol": "KC=F",  "name": "Coffee",            "unit": "cents/lb"},
    "lumber":       {"symbol": "LBS=F", "name": "Lumber",            "unit": "$/1000 board ft"},
    "palladium":    {"symbol": "PA=F",  "name": "Palladium",         "unit": "$/oz"},
}

CHART_PERIODS = {
    "1M": {"period": "1mo", "interval": "1d"},
    "3M": {"period": "3mo", "interval": "1d"},
    "1Y": {"period": "1y",  "interval": "1wk"},
    "5Y": {"period": "5y",  "interval": "1mo"},
}

def fetch_price(symbol):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5d")
        if len(hist) < 2:
            return None
        current = hist["Close"].iloc[-1]
        prev = hist["Close"].iloc[-2]
        change_pct = ((current - prev) / prev) * 100
        hist_1y = ticker.history(period="1y")
        high_52w = hist_1y["High"].max() if len(hist_1y) > 0 else current
        low_52w  = hist_1y["Low"].min()  if len(hist_1y) > 0 else current
        return {
            "price": round(float(current), 2),
            "change_pct": round(float(change_pct), 2),
            "high_52w": round(float(high_52w), 2),
            "low_52w":  round(float(low_52w), 2),
            "updated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"  Error fetching {symbol}: {e}")
        return None

def fetch_candles(symbol, period_cfg):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period_cfg["period"], interval=period_cfg["interval"])
        candles = []
        for ts, row in hist.iterrows():
            candles.append({
                "x": int(ts.timestamp()) * 1000,
                "o": round(float(row["Open"]),  3),
                "h": round(float(row["High"]),  3),
                "l": round(float(row["Low"]),   3),
                "c": round(float(row["Close"]), 3),
                "v": int(row["Volume"]) if row["Volume"] == row["Volume"] else 0
            })
        return candles
    except Exception as e:
        print(f"  Error fetching candles {symbol}: {e}")
        return []

def main():
    os.makedirs("_data", exist_ok=True)
    os.makedirs("assets/data", exist_ok=True)

    prices = {}
    chart_data = {}
    updated_at = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    for key, info in COMMODITIES.items():
        symbol = info["symbol"]
        print(f"Fetching {info['name']} ({symbol})...")

        price_data = fetch_price(symbol)
        if price_data:
            prices[key] = {**info, **price_data}
            print(f"  {info['name']}: ${price_data['price']} ({price_data['change_pct']:+.2f}%)")

        # Candle data for each time period
        periods_data = {}
        for period_key, period_cfg in CHART_PERIODS.items():
            candles = fetch_candles(symbol, period_cfg)
            if candles:
                periods_data[period_key] = {"candles": candles}
                print(f"  {period_key}: {len(candles)} candles")

        if periods_data:
            chart_data[symbol] = {
                "name": info["name"],
                "updated_at": updated_at,
                **periods_data
            }

    with open("_data/prices.json", "w") as f:
        json.dump(prices, f, indent=2)
    print(f"\nUpdated _data/prices.json: {len(prices)} commodities")

    with open("assets/data/chart-data.json", "w") as f:
        json.dump(chart_data, f, separators=(",", ":"))
    print(f"Updated assets/data/chart-data.json: {len(chart_data)} symbols")

if __name__ == "__main__":
    main()
