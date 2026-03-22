#!/usr/bin/env python3
"""
Daily commodity price + chart data updater for CommodityNode.
Generates _data/prices.json and assets/data/chart-data.json
"""
import json
import os
from datetime import datetime

try:
    import yfinance as yf
    HAS_YF = True
except ImportError:
    HAS_YF = False
    print("yfinance not available")

COMMODITIES = {
    "crude_oil":   {"symbol": "CL=F",  "name": "Crude Oil",        "unit": "$/barrel"},
    "gold":        {"symbol": "GC=F",  "name": "Gold",             "unit": "$/oz"},
    "copper":      {"symbol": "HG=F",  "name": "Copper",           "unit": "$/lb"},
    "natural_gas": {"symbol": "NG=F",  "name": "Natural Gas",      "unit": "$/MMBtu"},
    "wheat":       {"symbol": "ZW=F",  "name": "Wheat",            "unit": "cents/bushel"},
    "lithium":     {"symbol": "LIT",   "name": "Lithium ETF",      "unit": "$/share"},
    "silver":      {"symbol": "SI=F",  "name": "Silver",           "unit": "$/oz"},
    "corn":        {"symbol": "ZC=F",  "name": "Corn",             "unit": "cents/bushel"},
    "uranium":     {"symbol": "CCJ",   "name": "Uranium (proxy)",  "unit": "$/share"},
    "aluminum":    {"symbol": "AA",    "name": "Aluminum (proxy)", "unit": "$/share"},
    "coffee":      {"symbol": "KC=F",  "name": "Coffee",           "unit": "cents/lb"},
    "lumber":      {"symbol": "WY",    "name": "Lumber (proxy)",   "unit": "$/share"},
    "palladium":   {"symbol": "PA=F",  "name": "Palladium",        "unit": "$/oz"},
    "steel":       {"symbol": "NUE",   "name": "Steel (proxy)",    "unit": "$/share"},
    "zinc":        {"symbol": "TECK",  "name": "Zinc (TECK proxy)",    "unit": "$/share"},
    "tin":         {"symbol": "MP",    "name": "Tin (MP proxy)",       "unit": "$/share"},
    "sugar":       {"symbol": "SB=F",  "name": "Sugar",                "unit": "cents/lb"},
    "soybeans":    {"symbol": "ZS=F",  "name": "Soybeans",             "unit": "cents/bushel"},
    "platinum":    {"symbol": "PL=F",  "name": "Platinum",             "unit": "$/oz"},
    "nickel":      {"symbol": "VALE",  "name": "Nickel (VALE proxy)",  "unit": "$/share"},
    "lng":         {"symbol": "LNG",   "name": "LNG (Cheniere proxy)", "unit": "$/share"},
    "jet_fuel":    {"symbol": "ALK",   "name": "Jet Fuel (ALK proxy)", "unit": "$/share"},
    "iron_ore":    {"symbol": "RIO",   "name": "Iron Ore (RIO proxy)", "unit": "$/share"},
    "diesel":      {"symbol": "HO=F",  "name": "Diesel (Heating Oil)", "unit": "$/gallon"},
    "cotton":      {"symbol": "CT=F",  "name": "Cotton",               "unit": "cents/lb"},
    "cocoa":       {"symbol": "CC=F",  "name": "Cocoa",                "unit": "$/tonne"},
    "cobalt":      {"symbol": "SQM",   "name": "Cobalt (SQM proxy)",   "unit": "$/share"},
    "coal":        {"symbol": "BTU",   "name": "Coal (BTU proxy)",     "unit": "$/share"},
}

CHART_SYMBOLS = {
    "CL=F":  "Crude Oil (WTI)",
    "GC=F":  "Gold",
    "HG=F":  "Copper",
    "NG=F":  "Natural Gas",
    "SI=F":  "Silver",
    "ZW=F":  "Wheat",
    "ZC=F":  "Corn",
    "KC=F":  "Coffee",
    "PA=F":  "Palladium",
    "GLD":   "Gold ETF",
    "USO":   "Oil ETF",
}

PERIODS = {
    "1M": {"period": "1mo",  "interval": "1d"},
    "3M": {"period": "3mo",  "interval": "1d"},
    "1Y": {"period": "1y",   "interval": "1wk"},
    "5Y": {"period": "5y",   "interval": "1mo"},
}

def fetch_price(symbol):
    if not HAS_YF: return None
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5d")
        if len(hist) < 2: return None
        current = hist["Close"].iloc[-1]
        prev    = hist["Close"].iloc[-2]
        change_pct = (current - prev) / prev * 100
        hist_1y = ticker.history(period="1y")
        high_52w = hist_1y["High"].max() if len(hist_1y) > 0 else current
        low_52w  = hist_1y["Low"].min()  if len(hist_1y) > 0 else current
        return {
            "price":      round(float(current), 2),
            "change_pct": round(float(change_pct), 2),
            "high_52w":   round(float(high_52w), 2),
            "low_52w":    round(float(low_52w),  2),
            "updated_at": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

def fetch_candles(symbol, period_cfg):
    if not HAS_YF: return []
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period_cfg["period"], interval=period_cfg["interval"])
        candles = []
        for ts, row in hist.iterrows():
            unix_ms = int(ts.timestamp() * 1000)
            o = row.get("Open");  h = row.get("High")
            l = row.get("Low");   c = row.get("Close"); v = row.get("Volume")
            if o and h and l and c:
                candles.append({"x": unix_ms, "o": round(float(o),4), "h": round(float(h),4),
                                 "l": round(float(l),4), "c": round(float(c),4),
                                 "v": int(v) if v else 0})
        return candles
    except Exception as e:
        print(f"Chart fetch failed {symbol}: {e}")
        return []

def main():
    os.makedirs("_data", exist_ok=True)
    os.makedirs("assets/data", exist_ok=True)

    # prices.json
    prices = {}
    for key, info in COMMODITIES.items():
        print(f"Fetching {info['name']}...")
        price_data = fetch_price(info["symbol"])
        if price_data:
            prices[key] = {**info, **price_data}
            sign = "+" if price_data["change_pct"] > 0 else ""
            print(f"  {info['name']}: ${price_data['price']} ({sign}{price_data['change_pct']}%)")
    with open("_data/prices.json", "w") as f:
        json.dump(prices, f, indent=2)
    with open("assets/data/prices.json", "w") as f:
        json.dump(prices, f, indent=2)
    print(f"Updated {len(prices)} commodity prices")

    # chart-data.json
    chart_data = {}
    for symbol, name in CHART_SYMBOLS.items():
        print(f"Building chart data for {name} ({symbol})...")
        chart_data[symbol] = {"name": name}
        for period_key, period_cfg in PERIODS.items():
            candles = fetch_candles(symbol, period_cfg)
            chart_data[symbol][period_key] = {"candles": candles}
            print(f"  {period_key}: {len(candles)} candles")
    with open("assets/data/chart-data.json", "w") as f:
        json.dump(chart_data, f)
    print("Chart data written to assets/data/chart-data.json")

if __name__ == "__main__":
    main()
