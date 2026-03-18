#!/usr/bin/env python3
"""
Daily commodity price updater for CommodityNode.
Fetches prices via yfinance and updates _data/prices.json
"""
import json
import yfinance as yf
from datetime import datetime, timedelta
import os

COMMODITIES = {
    "crude_oil": {"symbol": "CL=F", "name": "Crude Oil", "unit": "$/barrel"},
    "gold": {"symbol": "GC=F", "name": "Gold", "unit": "$/oz"},
    "copper": {"symbol": "HG=F", "name": "Copper", "unit": "$/lb"},
    "natural_gas": {"symbol": "NG=F", "name": "Natural Gas", "unit": "$/MMBtu"},
    "wheat": {"symbol": "ZW=F", "name": "Wheat", "unit": "cents/bushel"},
    "lithium": {"symbol": "LTHM", "name": "Lithium (proxy)", "unit": "$/share"},
    "silver": {"symbol": "SI=F", "name": "Silver", "unit": "$/oz"},
    "corn": {"symbol": "ZC=F", "name": "Corn", "unit": "cents/bushel"},
    "uranium": {"symbol": "CCJ", "name": "Uranium (proxy)", "unit": "$/share"},
    "aluminum": {"symbol": "AA", "name": "Aluminum (proxy)", "unit": "$/share"},
    "coffee": {"symbol": "KC=F", "name": "Coffee", "unit": "cents/lb"},
    "lumber": {"symbol": "LBS=F", "name": "Lumber", "unit": "$/1000 board ft"},
    "palladium": {"symbol": "PA=F", "name": "Palladium", "unit": "$/oz"},
}

def fetch_price(symbol):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5d")
        if len(hist) < 2:
            return None
        
        current = hist['Close'].iloc[-1]
        prev = hist['Close'].iloc[-2]
        change_pct = ((current - prev) / prev) * 100
        
        # 52-week range
        hist_1y = ticker.history(period="1y")
        high_52w = hist_1y['High'].max() if len(hist_1y) > 0 else current
        low_52w = hist_1y['Low'].min() if len(hist_1y) > 0 else current
        
        return {
            "price": round(current, 2),
            "change_pct": round(change_pct, 2),
            "high_52w": round(high_52w, 2),
            "low_52w": round(low_52w, 2),
            "updated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

def main():
    os.makedirs("_data", exist_ok=True)
    
    prices = {}
    for key, info in COMMODITIES.items():
        print(f"Fetching {info['name']}...")
        price_data = fetch_price(info["symbol"])
        if price_data:
            prices[key] = {**info, **price_data}
            print(f"  {info['name']}: ${price_data['price']} ({'+' if price_data['change_pct'] > 0 else ''}{price_data['change_pct']}%)")
    
    with open("_data/prices.json", "w") as f:
        json.dump(prices, f, indent=2)
    
    print(f"\nUpdated {len(prices)} commodities")

if __name__ == "__main__":
    main()
