---
layout: commodity
name: "Palm Oil"
title: "Palm Oil Price Impact: Food Industry, Biodiesel & Oilseed Markets"
description: "Palm oil is the world's most consumed vegetable oil, produced primarily in Indonesia and Malaysia. It's used in food processing, cosmetics, and biodiesel."
commodity_slug: "palm-oil"
symbol: "ZL=F"
data_type: "proxy"
proxy_type: "futures"
unit: "cents/lb"
sector: "Agriculture"
etfs: ["SOYB", "DBA"]
companies: ["PG", "UNILEVER", "ADM"]
substitutes: ["Soybean Oil", "Canola Oil", "Sunflower Oil"]
industries: ["consumer-goods", "food-processing"]
themes: ["Food Inflation"]
tags: ["palm-oil", "oilseeds", "biodiesel", "food-industry", "soybeans"]
image: "/assets/images/og-palm-oil.png"
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "palm_oil", "label": "Palm Oil"},
  "levels": [
    {"nodes": [
      {"id":"dba_etf","label":"DBA Agriculture ETF","type":"etf","impact":6,"correlation":0.65,"sector":"Agriculture"},
      {"id":"soyb_etf","label":"SOYB Soybeans ETF","type":"etf","impact":5,"correlation":0.70,"sector":"Agriculture"}
    ]},
    {"nodes": [
      {"id":"pg","label":"Procter & Gamble (PG)","type":"stock","impact":4,"correlation":0.30,"sector":"Consumer Goods"},
      {"id":"ul","label":"Unilever (UL)","type":"stock","impact":5,"correlation":0.35,"sector":"Consumer Goods"},
      {"id":"adm","label":"ADM","type":"stock","impact":6,"correlation":0.45,"sector":"Agribusiness"}
    ]},
    {"nodes": [
      {"id":"food_processing","label":"Food Processing","type":"industry","impact":5,"correlation":0.40,"sector":"Consumer Staples"},
      {"id":"cosmetics","label":"Cosmetics & Personal Care","type":"industry","impact":3,"correlation":0.25,"sector":"Consumer Goods"}
    ]},
    {"nodes": [
      {"id":"biodiesel","label":"Biodiesel Demand","type":"macro","impact":4,"correlation":0.35,"sector":"Energy"},
      {"id":"deforestation","label":"Deforestation Regulation","type":"macro","impact":3,"correlation":0.20,"sector":"ESG"}
    ]}
  ]
};
</script>


## About Palm Oil

Palm oil accounts for approximately **35% of global vegetable oil consumption**, making it the world's most widely used vegetable oil. Indonesia and Malaysia together produce roughly 85% of global supply.

### Key Drivers
- **Indonesian export policies** — Export levies and biodiesel mandates directly impact global supply
- **Soybean oil substitution** — Palm oil and soybean oil prices are closely correlated as substitutes
- **Biodiesel demand** — Indonesia's B35 biodiesel mandate absorbs ~40% of domestic production
- **ESG & deforestation regulations** — EU deforestation-free supply chain rules create compliance costs

### Who Gets Hit
- **Consumer goods giants** (P&G, Unilever) — Palm oil is a key input for soaps, detergents, and food products
- **Food processors** — Used in baked goods, margarine, instant noodles, and confectionery
- **Biodiesel producers** — Competing with food use for palm oil supply

## Coverage Status

CommodityNode is expanding coverage of palm oil markets. Current analysis focuses on oilseed supply chains, biodiesel demand, and food industry exposure. Additional Research Reports covering palm oil-specific price drivers will be published as our dataset grows.

For related analysis, explore our [Soybeans](/commodities/soybeans/) and [Corn](/commodities/corn/) hubs, which cover substitute oilseed dynamics that directly affect palm oil pricing.
