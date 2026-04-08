#!/usr/bin/env python3
"""
Daily commodity price + chart data updater for CommodityNode.
Generates _data/prices.json and assets/data/chart-data.json
"""
import json, os, time, urllib.request
from datetime import datetime, timezone

COMMODITIES = {
    # Direct futures
    "crude_oil":     {"symbol": "CL=F",  "name": "Crude Oil",             "unit": "$/barrel",     "proxy_type": "futures"},
    "gold":          {"symbol": "GC=F",  "name": "Gold",                  "unit": "$/oz",         "proxy_type": "futures"},
    "copper":        {"symbol": "HG=F",  "name": "Copper",                "unit": "$/lb",         "proxy_type": "futures"},
    "natural_gas":   {"symbol": "NG=F",  "name": "Natural Gas",           "unit": "$/MMBtu",      "proxy_type": "futures"},
    "wheat":         {"symbol": "ZW=F",  "name": "Wheat",                 "unit": "cents/bushel",  "proxy_type": "futures"},
    "silver":        {"symbol": "SI=F",  "name": "Silver",                "unit": "$/oz",         "proxy_type": "futures"},
    "corn":          {"symbol": "ZC=F",  "name": "Corn",                  "unit": "cents/bushel",  "proxy_type": "futures"},
    "aluminum":      {"symbol": "ALI=F", "name": "Aluminum",              "unit": "$/tonne",      "proxy_type": "futures"},
    "coffee":        {"symbol": "KC=F",  "name": "Coffee",                "unit": "cents/lb",     "proxy_type": "futures"},
    "lumber":        {"symbol": "LBS=F", "name": "Lumber",                "unit": "$/1000bf",     "proxy_type": "futures"},
    "palladium":     {"symbol": "PA=F",  "name": "Palladium",             "unit": "$/oz",         "proxy_type": "futures"},
    "zinc":          {"symbol": "ZNC=F", "name": "Zinc",                  "unit": "$/tonne",      "proxy_type": "futures"},
    "sugar":         {"symbol": "SB=F",  "name": "Sugar",                 "unit": "cents/lb",     "proxy_type": "futures"},
    "soybeans":      {"symbol": "ZS=F",  "name": "Soybeans",              "unit": "cents/bushel",  "proxy_type": "futures"},
    "platinum":      {"symbol": "PL=F",  "name": "Platinum",              "unit": "$/oz",         "proxy_type": "futures"},
    "cotton":        {"symbol": "CT=F",  "name": "Cotton",                "unit": "cents/lb",     "proxy_type": "futures"},
    "cocoa":         {"symbol": "CC=F",  "name": "Cocoa",                 "unit": "$/tonne",      "proxy_type": "futures"},
    "rice":          {"symbol": "ZR=F",  "name": "Rice",                  "unit": "cents/cwt",    "proxy_type": "futures"},
    "oats":          {"symbol": "ZO=F",  "name": "Oats",                  "unit": "cents/bushel",  "proxy_type": "futures"},
    "orange_juice":  {"symbol": "OJ=F",  "name": "Orange Juice",          "unit": "cents/lb",     "proxy_type": "futures"},
    "soybean_oil":   {"symbol": "ZL=F",  "name": "Soybean Oil",           "unit": "cents/lb",     "proxy_type": "futures"},
    "soybean_meal":  {"symbol": "ZM=F",  "name": "Soybean Meal",         "unit": "$/short ton",   "proxy_type": "futures"},
    "live_cattle":   {"symbol": "LE=F",  "name": "Live Cattle",           "unit": "cents/lb",     "proxy_type": "futures"},
    "feeder_cattle": {"symbol": "GF=F",  "name": "Feeder Cattle",         "unit": "cents/lb",     "proxy_type": "futures"},
    "lean_hogs":     {"symbol": "HE=F",  "name": "Lean Hogs",             "unit": "cents/lb",     "proxy_type": "futures"},
    "jet_fuel":      {"symbol": "HO=F",  "name": "Jet Fuel (HO proxy)",  "unit": "$/gallon",     "proxy_type": "futures"},
    "diesel":        {"symbol": "HO=F",  "name": "Diesel (Heating Oil)",  "unit": "$/gallon",     "proxy_type": "futures"},
    # ETF proxy
    "uranium":       {"symbol": "URA",   "name": "Uranium (URA ETF)",     "unit": "$/share",      "proxy_type": "etf_proxy"},
    "steel":         {"symbol": "SLX",   "name": "Steel (SLX ETF)",       "unit": "$/share",      "proxy_type": "etf_proxy"},
    "nickel":        {"symbol": "JJN",   "name": "Nickel (JJN ETN)",      "unit": "$/share",      "proxy_type": "etf_proxy"},
    # Equity proxy
    "lithium":       {"symbol": "ALB",   "name": "Lithium (ALB)",         "unit": "$/share",      "proxy_type": "equity_proxy"},
    "tin":           {"symbol": "JJN",   "name": "Tin (JJN proxy)",       "unit": "$/share",      "proxy_type": "etf_proxy"},
    "iron_ore":      {"symbol": "VALE",  "name": "Iron Ore (VALE)",       "unit": "$/share",      "proxy_type": "equity_proxy"},
    "cobalt":        {"symbol": "GLNCY", "name": "Cobalt (Glencore)",     "unit": "$/share",      "proxy_type": "equity_proxy"},
    "coal":          {"symbol": "BTU",   "name": "Coal (BTU)",            "unit": "$/share",      "proxy_type": "equity_proxy"},
    "lng":           {"symbol": "LNG",   "name": "LNG (Cheniere)",        "unit": "$/share",      "proxy_type": "equity_proxy"},
    "potash":        {"symbol": "NTR",   "name": "Potash (NTR)",          "unit": "$/share",      "proxy_type": "equity_proxy"},
    "ammonia":       {"symbol": "CF",    "name": "Ammonia (CF proxy)",    "unit": "$/share",      "proxy_type": "equity_proxy"},
    "manganese":     {"symbol": "VALE",  "name": "Manganese (VALE proxy)","unit": "$/share",      "proxy_type": "equity_proxy"},
    "vanadium":      {"symbol": "RIO",   "name": "Vanadium (RIO proxy)",  "unit": "$/share",      "proxy_type": "equity_proxy"},
    "graphite":      {"symbol": "MP",    "name": "Graphite (MP proxy)",   "unit": "$/share",      "proxy_type": "equity_proxy"},
    "rare_earth":    {"symbol": "MP",    "name": "Rare Earth (MP proxy)", "unit": "$/share",      "proxy_type": "equity_proxy"},
    "rhodium":       {"symbol": "SBSW",  "name": "Rhodium (SBSW proxy)", "unit": "$/share",      "proxy_type": "equity_proxy"},
    "hydrogen":      {"symbol": "PLUG",  "name": "Hydrogen (PLUG proxy)","unit": "$/share",       "proxy_type": "equity_proxy"},
    "rubber":        {"symbol": "GT",    "name": "Rubber (GT proxy)",     "unit": "$/share",      "proxy_type": "equity_proxy"},
    "ethanol":       {"symbol": "REX",   "name": "Ethanol (REX proxy)",  "unit": "$/share",       "proxy_type": "equity_proxy"},
}

CHART_SYMBOLS = {info["symbol"]: info["name"] for info in COMMODITIES.values()}

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
        data = yahoo_fetch(symbol, "2d", "1d")
        result = data["chart"]["result"]
        if not result:
            return None
        meta = result[0]["meta"]
        quote = result[0].get("indicators", {}).get("quote", [{}])[0]
        closes = quote.get("close") or []
        valid_closes = [c for c in closes if c is not None and c > 0]

        price = meta.get("regularMarketPrice")
        if price is None and valid_closes:
            price = valid_closes[-1]
        if price is None:
            return None

        # 일간 변동률: previousClose 우선, 없으면 직전 유효 종가, 마지막으로 chartPreviousClose 허용
        prev = meta.get("previousClose") or meta.get("regularMarketPreviousClose")
        if not prev and len(valid_closes) >= 2:
            prev = valid_closes[-2]
        if not prev:
            cp = meta.get("chartPreviousClose")
            if cp and cp != price:
                prev = cp

        chg = None
        if prev and prev != 0:
            raw_chg = round((price - prev) / prev * 100, 2)
            is_futures = symbol.endswith('=F')
            max_abs = 9.99 if is_futures else 20.0
            chg = raw_chg if abs(raw_chg) <= max_abs else None

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
            entry = {**info, **data}
            if "proxy_type" in info:
                entry["proxy_type"] = info["proxy_type"]
            prices[key] = entry
            pct = data.get("change_pct")
            if isinstance(pct, (int, float)):
                sign = "+" if pct >= 0 else ""
                print(f"   ${data['price']} ({sign}{pct}%)")
            else:
                print(f"   ${data['price']} (daily change unavailable)")
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
