---
layout: commodity
name: "Ethylene"
title: "Ethylene Price Impact: Industries, Stocks & ETFs"
description: "Ethylene is the world's most-produced organic chemical, the building block for polyethylene plastics, PVC, and thousands of downstream products."
commodity_slug: "ethylene"
symbol: "DOW"
sector: "Chemicals/Energy"
etfs: ["XLB", "IYM"]
companies: ["DOW"]
substitutes: ["Propylene", "Bio-based Ethylene", "Recycled Plastics"]
industries: ["chemicals", "packaging"]
themes: ["Carbon Transition"]
tags: [ethylene, petrochemicals, polyethylene, plastics, cracker margins, natural gas, naphtha, supply chain]
image: /assets/images/og-natural-gas.png
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "ethylene", "label": "Ethylene"},
  "levels": [
    {"nodes": [
      {"id":"xlb_etf","label":"XLB Materials SPDR","type":"etf","impact":5,"correlation":0.55,"sector":"Materials"},
      {"id":"iym_etf","label":"IYM Materials ETF","type":"etf","impact":4,"correlation":0.50,"sector":"Materials"}
    ]},
    {"nodes": [
      {"id":"dow","label":"Dow Inc. (DOW)","type":"stock","impact":9,"correlation":0.80,"sector":"Chemicals"},
      {"id":"lyb","label":"LyondellBasell (LYB)","type":"stock","impact":8,"correlation":0.75,"sector":"Chemicals"},
      {"id":"wlk","label":"Westlake (WLK)","type":"stock","impact":7,"correlation":0.70,"sector":"Chemicals"}
    ]},
    {"nodes": [
      {"id":"packaging","label":"Packaging Industry","type":"industry","impact":5,"correlation":0.45,"sector":"Industrials"},
      {"id":"construction","label":"Construction (PVC)","type":"industry","impact":4,"correlation":0.35,"sector":"Construction"}
    ]},
    {"nodes": [
      {"id":"natgas_feed","label":"Natural Gas (Feedstock)","type":"macro","impact":7,"correlation":0.65,"sector":"Energy"},
      {"id":"china_demand","label":"China Chemical Demand","type":"macro","impact":5,"correlation":0.40,"sector":"Macro"}
    ]}
  ]
};
</script>

{% include commodity-hub.html %}

## About Ethylene

Ethylene is the **world's most-produced organic chemical** (~200 million tonnes/year), serving as the fundamental building block of the petrochemical industry. It's produced by steam cracking ethane (from natural gas) or naphtha (from crude oil).

### Key Drivers
- **Ethane-naphtha spread** — US crackers use cheap shale ethane; European/Asian crackers use naphtha. The feedstock spread determines regional competitiveness.
- **Cracker utilization rates** — Global operating rates above 90% signal tight supply and higher margins
- **New capacity additions** — China's massive capacity build-out is the dominant supply-side risk
- **Natural gas prices** — A $1/MMBtu move in US natural gas translates to ~$300-400M annual impact for major producers like Dow

### Who Gets Hit
- **Chemical producers** (Dow, LyondellBasell, Westlake) — Ethylene-polyethylene chain drives their core margins
- **Packaging companies** — Polyethylene is the most common plastic for packaging
- **Construction** — PVC pipes and building materials derived from ethylene
