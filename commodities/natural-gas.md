---
layout: commodity
title: "Natural Gas Price Impact: Utilities, Fertilizers & LNG"
description: "How Henry Hub natural gas prices affect utilities, fertilizer makers, and LNG exporters."
commodity_slug: "natural-gas"
symbol: "NG=F"
sector: "Energy"
etfs: ["UNG", "BOIL", "FCG"]
companies: ["EQT", "CHK", "AR", "SWN"]
substitutes: ["Solar", "Wind", "Nuclear", "Oil"]
themes: ["Clean Energy", "Food Inflation"]
tags: [natural gas, commodity analysis, supply chain]
permalink: /commodities/natural-gas/
---

<div class="cn-price-chart" data-symbol="NG=F" data-name="Natural Gas"></div>

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "natural_gas", "label": "Natural Gas"},
  "levels": [
    {"nodes": [
      {"id":"fcg","label":"FCG ETF","type":"etf","impact":9,"correlation":0.82,"sector":"Energy"},
      {"id":"eqt","label":"EQT Corp","type":"producer","impact":11,"correlation":0.87,"sector":"E&P"},
      {"id":"neo","label":"Utilities (NEE)","type":"positive","impact":5,"correlation":0.58,"sector":"Utilities"},
      {"id":"cf","label":"CF Industries","type":"positive","impact":7,"correlation":0.70,"sector":"Fertilizers"},
      {"id":"dow","label":"Dow Inc (chemicals)","type":"negative","impact":-5,"correlation":-0.62,"sector":"Chemicals"}
    ]},
    {"nodes": [
      {"id":"lng","label":"LNG Exporters","type":"positive","impact":8,"correlation":0.78,"sector":"LNG","parentId":"eqt"},
      {"id":"fertilizer","label":"Mosaic (MOS)","type":"positive","impact":6,"correlation":0.65,"sector":"Fertilizers","parentId":"cf"},
      {"id":"plastic","label":"Plastics/Resins","type":"negative","impact":-4,"correlation":-0.55,"sector":"Materials","parentId":"dow"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Natural gas pricing sits at the intersection of weather, LNG exports, and industrial demand. A **+15% seasonal spike** in Henry Hub prices creates immediate winners in E&P stocks while pressuring chemical manufacturers and utility margins.

## Key Impact Channels

**Exploration & Production:** EQT, Range Resources, and Coterra see near-linear earnings leverage to Henry Hub. FCG ETF typically moves 0.75–0.90x the percentage change in nat gas.

**Fertilizers:** Natural gas is the primary feedstock for ammonia synthesis. CF Industries and Mosaic see input cost surges that compress margins 6–10% per $1/MMBtu increase in gas.

**LNG Exporters:** Sabine Pass and Corpus Christi liquefaction plants benefit when global LNG prices (JKM, TTF) diverge from Henry Hub — creating arbitrage opportunities.

## Trading Note

Natural gas exhibits the highest seasonal volatility of all major commodities. Winter storage draws (Oct–Mar) and summer cooling demand create predictable trading windows. Monitor the EIA weekly storage report every Thursday at 10:30 AM ET.
