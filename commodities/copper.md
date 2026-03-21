---
layout: commodity
title: "Copper Price Impact: EVs, Mining & Construction"
description: "How copper price movements signal economic cycles and impact EV makers, miners, and homebuilders."
commodity_slug: "copper"
symbol: "HG=F"
sector: "Industrial Metals"
etfs: ["COPX", "CPER"]
companies: ["FCX", "SCCO", "TECK"]
substitutes: ["Aluminum", "Fiber Optics"]
themes: ["EV Transition", "Infrastructure Boom", "Clean Energy"]
tags: [copper, commodity analysis, supply chain]
permalink: /commodities/copper/
---

<div class="cn-price-chart" data-symbol="HG=F" data-name="Copper"></div>

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "copper", "label": "Copper (HG)"},
  "levels": [
    {"nodes": [
      {"id":"copx","label":"COPX ETF","type":"etf","impact":9,"correlation":0.84,"sector":"Mining"},
      {"id":"fcx","label":"Freeport-McMoRan","type":"producer","impact":12,"correlation":0.90,"sector":"Mining"},
      {"id":"ev","label":"EV Sector (TSLA)","type":"positive","impact":7,"correlation":0.72,"sector":"EV"},
      {"id":"infrastructure","label":"Infrastructure","type":"positive","impact":6,"correlation":0.68,"sector":"Construction"},
      {"id":"xhb","label":"Homebuilders (XHB)","type":"positive","impact":5,"correlation":0.62,"sector":"Housing"}
    ]},
    {"nodes": [
      {"id":"wires","label":"Wire & Cable Mfg","type":"positive","impact":8,"correlation":0.76,"sector":"Manufacturing","parentId":"infrastructure"},
      {"id":"battery","label":"Battery Makers","type":"positive","impact":7,"correlation":0.70,"sector":"EV","parentId":"ev"},
      {"id":"plumbing","label":"Plumbing/HVAC","type":"positive","impact":4,"correlation":0.55,"sector":"Building","parentId":"xhb"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Copper is called "Dr. Copper" for its Ph.D. in economics — its price leads global industrial production by 3–6 months. A sustained **+10% copper move** signals accelerating global growth and triggers a cascade through mining, EVs, and infrastructure stocks.

## Key Impact Channels

**Mining:** Freeport-McMoRan (FCX) has ~85% revenue exposure to copper prices. A 10% copper move translates to ~12–15% FCX earnings impact after accounting for operating leverage. COPX ETF offers diversified mining exposure.

**Electric Vehicles:** The average EV uses 3–4x more copper than ICE vehicles (wiring, motors, charging infrastructure). Tesla, Rivian, and charging network operators see input cost pressure during sustained copper rallies.

**Construction:** New home wiring, commercial HVAC, and plumbing represent 43% of U.S. copper demand. Homebuilder margins (XHB, DHI, LEN) compress when copper exceeds $4.50/lb.

## Trading Note

The copper/gold ratio is a powerful risk-on/risk-off indicator. A rising ratio signals risk appetite; falling ratio signals defensive positioning. Track the HG/GC spread daily during macro regime shifts.
