#!/usr/bin/env python3
"""
Daily commodity price + chart data updater for CommodityNode.
Generates _data/prices.json and assets/data/chart-data.json
"""
import json, os, time, urllib.request
from datetime import datetime, timezone

COMMODITIES = {
    "crude_oil":     {"symbol": "CL=F",  "name": "Crude Oil",             "unit": "$/barrel"},
    "gold":          {"symbol": "GC=F",  "name": "Gold",                  "unit": "$/oz"},
    "copper":        {"symbol": "HG=F",  "name": "Copper",                "unit": "$/lb"},
    "natural_gas":   {"symbol": "NG=F",  "name": "Natural Gas",           "unit": "$/MMBtu"},
    "wheat":         {"symbol": "ZW=F",  "name": "Wheat",                 "unit": "cents/bushel"},
    "lithium":       {"symbol": "ALB",   "name": "Lithium (ALB)",         "unit": "$/share"},
    "silver":        {"symbol": "SI=F",  "name": "Silver",                "unit": "$/oz"},
    "corn":          {"symbol": "ZC=F",  "name": "Corn",                  "unit": "cents/bushel"},
    "uranium":       {"symbol": "URA",   "name": "Uranium (URA ETF)",     "unit": "$/share"},
    "aluminum":      {"symbol": "ALI=F", "name": "Aluminum",              "unit": "$/tonne"},
    "coffee":        {"symbol": "KC=F",  "name": "Coffee",                "unit": "cents/lb"},
    "lumber":        {"symbol": "LBS=F", "name": "Lumber",                "unit": "$/share"},
    "palladium":     {"symbol": "PA=F",  "name": "Palladium",             "unit": "$/oz"},
    "steel":         {"symbol": "SLX",   "name": "Steel (SLX ETF)",       "unit": "$/share"},
    "zinc":          {"symbol": "ZNC=F", "name": "Zinc",                  "unit": "$/share"},
    "tin":           {"symbol": "ZNC=F", "name": "Tin (ZNC proxy)",       "unit": "$/share"},
    "sugar":         {"symbol": "SB=F",  "name": "Sugar",                 "unit": "cents/lb"},
    "soybeans":      {"symbol": "ZS=F",  "name": "Soybeans",              "unit": "cents/bushel"},
    "platinum":      {"symbol": "PL=F",  "name": "Platinum",              "unit": "$/oz"},
    "nickel":        {"symbol": "JJN",   "name": "Nickel (JJN ETN)",      "unit": "$/share"},
    "lng":           {"symbol": "LNG",   "name": "LNG (Cheniere)",        "unit": "$/share"},
    "jet_fuel":      {"symbol": "HO=F",  "name": "Jet Fuel (HO proxy)",  "unit": "$/gallon"},
    "iron_ore":      {"symbol": "VALE",  "name": "Iron Ore (VALE)",       "unit": "$/share"},
    "diesel":        {"symbol": "HO=F",  "name": "Diesel (Heating Oil)",  "unit": "$/gallon"},
    "cotton":        {"symbol": "CT=F",  "name": "Cotton",                "unit": "cents/lb"},
    "cocoa":         {"symbol": "CC=F",  "name": "Cocoa",                 "unit": "$/tonne"},
    "cobalt":        {"symbol": "GLNCY", "name": "Cobalt (Glencore)",     "unit": "$/share"},
    "coal":          {"symbol": "BTU",   "name": "Coal (BTU)",            "unit": "$/share"},
    "rice":          {"symbol": "ZR=F",  "name": "Rice",                  "unit": "cents/cwt"},
    "oats":          {"symbol": "ZO=F",  "name": "Oats",                  "unit": "cents/bushel"},
    "orange_juice":  {"symbol": "OJ=F",  "name": "Orange Juice",          "unit": "cents/lb"},
    "soybean_oil":   {"symbol": "ZL=F",  "name": "Soybean Oil",           "unit": "cents/lb"},
    "soybean_meal":  {"symbol": "ZM=F",  "name": "Soybean Meal",         "unit": "$/short ton"},
    "live_cattle":   {"symbol": "LE=F",  "name": "Live Cattle",           "unit": "cents/lb"},
    "feeder_cattle": {"symbol": "GF=F",  "name": "Feeder Cattle",         "unit": "cents/lb"},
    "lean_hogs":     {"symbol": "HE=F",  "name": "Lean Hogs",             "unit": "cents/lb"},
    "potash":        {"symbol": "NTR",   "name": "Potash (NTR)",          "unit": "$/share"},
    "ammonia":       {"symbol": "CF",    "name": "Ammonia (CF proxy)",    "unit": "$/share"},
    "manganese":     {"symbol": "VALE",  "name": "Manganese (VALE proxy)","unit": "$/share"},
    "vanadium":      {"symbol": "RIO",   "name": "Vanadium (RIO proxy)",  "unit": "$/share"},
    "graphite":      {"symbol": "MP",    "name": "Graphite (MP proxy)",   "unit": "$/share"},
    "rare_earth":    {"symbol": "MP",    "name": "Rare Earth (MP proxy)", "unit": "$/share"},
    "rhodium":       {"symbol": "SBSW",  "name": "Rhodium (SBSW proxy)", "unit": "$/share"},
    "hydrogen":      {"symbol": "PLUG",  "name": "Hydrogen (PLUG proxy)","unit": "$/share"},
    "rubber":        {"symbol": "GT",    "name": "Rubber (GT proxy)",     "unit": "$/share"},
    "ethanol":       {"symbol": "REX",   "name": "Ethanol (REX proxy)",  "unit": "$/share"},
}

CHART_SYMBOLS = {
    "CL=F": "Crude Oil (WTI)",
    "GC=F": "Gold",
    "HG=F": "Copper",
    "NG=F": "Natural Gas",
    "SI=F": "Silver",
    "ZW=F": "Wheat",
    "ZC=F": "Corn",
    "KC=F": "Coffee",
    "PA=F": "Palladium",
    "ALB":  "Lithium (ALB)",
    "SLX":  "Steel (SLX)",
    "URA":  "Uranium (URA)",
    "VALE": "Iron Ore (VALE)",
    "BTU":  "Coal (BTU)",
    "GLD":  "Gold ETF",
    "USO":  "Oil ETF",
}

PERIODS = {
    "1M": {"period": "1mo",  "interval": "1d"},
    "3M": {"period": "3mo",  "interval": "1d"},
    "1Y": {"period": "1y",   "interval": "1wk"},
    "5Y": {"period": "5y",   "interval": "1mo"},
}

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

def yahoo_fetch(symbol, range_="2d", interval="1d"):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval={interval}&range={range_}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.load(r)

def fetch_price(symbol):
    try:
        data = yahoo_fetch(symbol, "5d", "1d")
        result = data["chart"]["result"]
        if not result:
            return None
        meta = result[0]["meta"]
        price = meta.get("regularMarketPrice")
        prev = meta.get("chartPreviousClose") or meta.get("previousClose")
        closes = result[0].get("indicators", {}).get("quote", [{}])[0].get("close", [])
        valid = [c for c in closes if c is not None]
        if len(valid) >= 2 and not prev:
            prev = valid[-2]
        if price and prev and prev != 0:
            chg = round((price - prev) / prev * 100, 2)
            # 롤오버 감지: ±15% 초과 시 closes 배열로 재계산
            if abs(chg) > 15:
                valid_closes = [c for c in closes if c is not None and c > 0]
                nearby = [c for c in valid_closes if abs(c - price) / price < 0.15]
                if len(nearby) >= 2:
                    chg = round((price - nearby[-2]) / nearby[-2] * 100, 2)
                else:
                    chg = 0.0  # 롤오버로 판단, 0으로 처리
        else:
            chg = 0.0
        high_52w = meta.get("fiftyTwoWeekHigh") or round(price * 1.2, 2)
        low_52w  = meta.get("fiftyTwoWeekLow")  or round(price * 0.8, 2)
        return {
            "price":      round(float(price), 4),
            "change_pct": chg,
            "high_52w":   round(float(high_52w), 2),
            "low_52w":    round(float(low_52w),  2),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        print(f"  ❌ {symbol}: {e}")
        return None

def fetch_candles(symbol, period, interval):
    try:
        data = yahoo_fetch(symbol, period, interval)
        result = data["chart"]["result"]
        if not result:
            return []
        timestamps = result[0].get("timestamp", [])
        q = result[0].get("indicators", {}).get("quote", [{}])[0]
        opens = q.get("open", []); highs = q.get("high", [])
        lows  = q.get("low",  []); closes= q.get("close",[])
        vols  = q.get("volume", [])
        candles = []
        for i, ts in enumerate(timestamps):
            o = opens[i] if i < len(opens) else None
            h = highs[i] if i < len(highs) else None
            l = lows[i]  if i < len(lows)  else None
            c = closes[i]if i < len(closes) else None
            v = vols[i]  if i < len(vols)  else 0
            if o and h and l and c:
                candles.append({"x": ts*1000, "o": round(o,4), "h": round(h,4),
                                 "l": round(l,4), "c": round(c,4), "v": int(v or 0)})
        return candles
    except Exception as e:
        print(f"  ❌ chart {symbol}: {e}")
        return []

def main():
    os.makedirs("_data", exist_ok=True)
    os.makedirs("assets/data", exist_ok=True)

    # --- prices.json ---
    prices = {}
    for key, info in COMMODITIES.items():
        print(f"📊 {info['name']} ({info['symbol']})...")
        data = fetch_price(info["symbol"])
        if data:
            prices[key] = {**info, **data}
            sign = "+" if data["change_pct"] >= 0 else ""
            print(f"   ${data['price']} ({sign}{data['change_pct']}%)")
        time.sleep(0.25)

    with open("_data/prices.json", "w") as f:
        json.dump(prices, f, indent=2)
    with open("assets/data/prices.json", "w") as f:
        json.dump(prices, f, indent=2)
    print(f"\n✅ {len(prices)}/45 prices updated")

    # --- chart-data.json ---
    chart_data = {}
    period_map = {"1M": ("1mo","1d"), "3M": ("3mo","1d"), "1Y": ("1y","1wk"), "5Y": ("5y","1mo")}
    for symbol, name in CHART_SYMBOLS.items():
        print(f"\n📈 Chart: {name} ({symbol})")
        chart_data[symbol] = {"name": name}
        for pk, (period, interval) in period_map.items():
            candles = fetch_candles(symbol, period, interval)
            chart_data[symbol][pk] = {"candles": candles}
            print(f"   {pk}: {len(candles)} candles")
        time.sleep(0.3)

    with open("assets/data/chart-data.json", "w") as f:
        json.dump(chart_data, f)
    print("\n✅ Chart data updated")

if __name__ == "__main__":
    main()
