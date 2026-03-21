---
layout: commodity
title: "Crude Oil Price Impact: Industries, Stocks & ETFs"
description: "How WTI crude oil price movements ripple through airlines, energy stocks, and consumer spending."
commodity_slug: "crude-oil"
symbol: "CL=F"
sector: "Energy"
etfs: ["XLE", "USO", "OIH"]
companies: ["XOM", "CVX", "HAL", "SLB"]
substitutes: ["Natural Gas", "Renewables", "Nuclear"]
themes: ["Supply Chain Disruption", "Clean Energy"]
tags: [crude oil, commodity analysis, supply chain]
permalink: /commodities/crude-oil/
---

<div class="cn-price-chart" data-symbol="CL=F" data-name="Crude Oil (WTI)"></div>

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "crude_oil", "label": "Crude Oil (WTI)"},
  "levels": [
    {"nodes": [
      {"id":"xle","label":"XLE ETF","type":"etf","impact":8,"correlation":0.85,"sector":"Energy"},
      {"id":"xom","label":"ExxonMobil (XOM)","type":"producer","impact":7,"correlation":0.82,"sector":"Energy"},
      {"id":"cvx","label":"Chevron (CVX)","type":"producer","impact":7,"correlation":0.80,"sector":"Energy"},
      {"id":"jets","label":"JETS ETF (Airlines)","type":"etf","impact":-7,"correlation":-0.75,"sector":"Transport"},
      {"id":"aal","label":"American Airlines","type":"negative","impact":-9,"correlation":-0.78,"sector":"Airlines"},
      {"id":"hal","label":"Halliburton (HAL)","type":"producer","impact":12,"correlation":0.88,"sector":"OFS"}
    ]},
    {"nodes": [
      {"id":"dal","label":"Delta Air Lines","type":"negative","impact":-8,"correlation":-0.72,"sector":"Airlines","parentId":"jets"},
      {"id":"slb","label":"SLB (oilfield)","type":"producer","impact":11,"correlation":0.86,"sector":"OFS","parentId":"hal"},
      {"id":"refiner","label":"Refiners (VLO)","type":"processor","impact":5,"correlation":0.60,"sector":"Refining","parentId":"xom"},
      {"id":"transport","label":"Transport (UPS)","type":"negative","impact":-4,"correlation":-0.50,"sector":"Transport","parentId":"jets"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Crude oil is the world's most traded commodity — a price swing in WTI reverberates through airlines, chemicals, shipping, and consumer spending simultaneously. A **+10% move in crude** generates an average **+8.2% response in XLE** and a **-7.1% drop in the JETS ETF**.

## Key Impact Channels

**Energy Sector (Direct):** Integrated majors like ExxonMobil and Chevron see direct revenue expansion. Oilfield services (Halliburton, SLB) amplify the move — with leverage factors of 1.3–1.5x crude's percentage change.

**Airlines (Inverse):** Jet fuel represents 20–30% of airline operating costs. AAL, which hedges less than Delta, shows the highest beta to crude. The XLE/JETS pair trade has delivered consistent risk-adjusted returns during sustained oil trends.

**Downstream Chemicals:** Refiners (Valero, Marathon) benefit from crack-spread expansion in the initial phase but face margin compression if crude stays elevated. Plastics and synthetic material costs escalate with a 4–8 week lag.

## Trading Note

The 10-day correlation between crude and XLE is historically 0.82–0.88. During geopolitical shocks (Russia-Ukraine, Middle East escalation), the correlation briefly spikes to 0.95+ before reverting. Consider 2:1 weighting (XLE long / JETS short) during uptrend phases.
