#!/usr/bin/env python3
"""Generate weekly commodity market summary post."""
import json
import yfinance as yf
from datetime import datetime, timedelta
import os

COMMODITIES = {
    "crude_oil": ("CL=F", "Crude Oil", "NYMEX:CL1!"),
    "gold": ("GC=F", "Gold", "COMEX:GC1!"),
    "copper": ("HG=F", "Copper", "COMEX:HG1!"),
    "natural_gas": ("NG=F", "Natural Gas", "NYMEX:NG1!"),
    "silver": ("SI=F", "Silver", "COMEX:SI1!"),
    "corn": ("ZC=F", "Corn", "CBOT:ZC1!"),
    "coffee": ("KC=F", "Coffee", "ICEUS:KC1!"),
    "palladium": ("PA=F", "Palladium", "COMEX:PA1!"),
}

def get_weekly_data(symbol):
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="10d")
    if len(hist) < 5:
        return None
    current = hist['Close'].iloc[-1]
    week_ago = hist['Close'].iloc[-5]
    return {
        "current": round(current, 2),
        "week_change": round(((current - week_ago) / week_ago) * 100, 2)
    }

def generate_post():
    date = datetime.now().strftime("%Y-%m-%d")
    week_num = datetime.now().isocalendar()[1]
    
    data = {}
    winners = []
    losers = []
    
    for key, (symbol, name, tv_symbol) in COMMODITIES.items():
        d = get_weekly_data(symbol)
        if d:
            data[key] = {"name": name, "tv_symbol": tv_symbol, **d}
            if d["week_change"] > 0:
                winners.append((name, d["week_change"], tv_symbol))
            else:
                losers.append((name, d["week_change"], tv_symbol))
    
    winners.sort(key=lambda x: -x[1])
    losers.sort(key=lambda x: x[1])
    
    # Build post
    winners_md = "\n".join([f"| {n} | +{c:.1f}% | 🟢 |" for n, c, _ in winners[:5]])
    losers_md = "\n".join([f"| {n} | {c:.1f}% | 🔴 |" for n, c, _ in losers[:5]])
    
    post = f"""---
layout: post
title: "Weekly Commodity Market Pulse: Week {week_num}, {datetime.now().year}"
date: {date}
categories: [Weekly, Market Summary]
tags: [weekly, market-summary, commodity-prices]
description: "This week's top commodity movers, key trends, and what it means for your portfolio."
reading_time: 5
---

The commodity markets never sleep. Here's what moved this week and why it matters.

## 🏆 Top Performers This Week

| Commodity | Change | Signal |
|-----------|--------|--------|
{winners_md}

## 📉 Biggest Declines

| Commodity | Change | Signal |
|-----------|--------|--------|
{losers_md}

## What This Week Tells Us

{"Oil prices rose" if data.get("crude_oil", {}).get("week_change", 0) > 0 else "Oil prices fell"} this week, {"signaling continued supply tightness" if data.get("crude_oil", {}).get("week_change", 0) > 0 else "raising concerns about demand slowdown"}.

Gold {"held strong as a safe haven" if data.get("gold", {}).get("week_change", 0) > 0 else "sold off as risk appetite returned"}, reflecting {"global uncertainty" if data.get("gold", {}).get("week_change", 0) > 0 else "improving market sentiment"}.

## Key Themes to Watch

1. **Energy markets**: Oil and natural gas divergence signals shifting demand patterns
2. **Precious metals**: Gold/Silver ratio as indicator of risk sentiment
3. **Industrial metals**: Copper's movement as economic barometer

## Full Analysis

Dive deeper into any commodity's impact map using our interactive visualizations:

- [Crude Oil Impact Map](/oil-prices-surge-industry-impact/)
- [Gold Market Analysis](/gold-price-impact-stocks/)
- [Copper Economic Signal](/copper-economic-indicator/)

---

*Data as of market close. This is educational content, not financial advice.*
"""
    
    filename = f"_posts/{date}-weekly-market-pulse-week-{week_num}.md"
    os.makedirs("_posts", exist_ok=True)
    with open(filename, "w") as f:
        f.write(post)
    print(f"Generated: {filename}")

if __name__ == "__main__":
    generate_post()
