---
layout: commodity
title: "Lithium"
description: "Lithium as the backbone of EV batteries and its boom-bust supply cycle dynamics."
commodity_slug: "lithium"
symbol: "LTHM"
sector: "Battery Metals"
etfs: ["LIT", "BATT"]
companies: ["ALB", "SQM", "LTHM", "PLL"]
substitutes: ["Sodium-ion", "Solid-state", "Hydrogen Fuel Cells"]
themes: ["EV Transition", "Clean Energy"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "lithium", "label": "Lithium"},
  "levels": [
    {"nodes": [
      {"id":"lit","label":"LIT ETF","type":"etf","impact":10,"correlation":0.88,"sector":"Battery Metals"},
      {"id":"alb","label":"Albemarle (ALB)","type":"producer","impact":14,"correlation":0.90,"sector":"Mining"},
      {"id":"sqm","label":"SQM (SQM)","type":"producer","impact":13,"correlation":0.88,"sector":"Mining"},
      {"id":"pll","label":"Piedmont Lithium (PLL)","type":"producer","impact":12,"correlation":0.82,"sector":"Mining"},
      {"id":"lthm","label":"Livent (LTHM)","type":"producer","impact":13,"correlation":0.86,"sector":"Mining"}
    ]},
    {"nodes": [
      {"id":"tsla_li","label":"Tesla (TSLA)","type":"consumer","impact":6,"correlation":0.60,"sector":"EV","parentId":"lit"},
      {"id":"catl_li","label":"CATL","type":"consumer","impact":7,"correlation":0.65,"sector":"Batteries","parentId":"alb"},
      {"id":"lges","label":"LG Energy Solution","type":"consumer","impact":6,"correlation":0.58,"sector":"Batteries","parentId":"sqm"},
      {"id":"panasonic_li","label":"Panasonic","type":"consumer","impact":5,"correlation":0.52,"sector":"Batteries","parentId":"alb"},
      {"id":"grid_storage","label":"Grid Storage","type":"consumer","impact":5,"correlation":0.48,"sector":"Utilities","parentId":"lit"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Lithium is the lightest metal on the periodic table and the irreplaceable element in virtually all modern rechargeable batteries. EV adoption has transformed lithium from a niche industrial chemical into one of the most strategically important commodities in the world. The "lithium triangle" of Chile, Argentina, and Bolivia holds over 50% of global reserves, while Australia leads in hard-rock spodumene mining production. Global demand has grown from under 300,000 tonnes of lithium carbonate equivalent (LCE) in 2020 to over 900,000 tonnes, with projections exceeding 2 million tonnes by 2030.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Battery-grade lithium carbonate and lithium hydroxide are essential inputs for both LFP (lithium iron phosphate) and NMC (nickel manganese cobalt) battery chemistries. Albemarle and SQM are the largest publicly traded producers, with earnings highly leveraged to spot lithium prices. The shift toward LFP batteries in standard-range vehicles has increased lithium intensity per kWh while reducing nickel and cobalt requirements. Pilbara Minerals and IGO Limited provide Australian spodumene exposure.

**Secondary -- Supply Chain and Processing:** Grid-scale battery storage installations are growing at 40%+ annually, creating a second major demand channel beyond EVs. Utility-scale projects typically use LFP chemistry, which requires more lithium per kWh than NMC. This demand segment is less cyclical than auto production and provides structural support for long-term lithium consumption growth. Chinese converters (Ganfeng Lithium, Tianqi Lithium) dominate the processing midstream, controlling 60%+ of global refining capacity and creating a bottleneck between mine supply and battery-grade material.

**Tertiary -- Macro and Second-Order Effects:** Smartphones, laptops, and power tools represent the legacy demand base for lithium-ion batteries. Emerging applications in electric aviation, marine electrification, and portable power stations are expanding the addressable market. Lithium's use in pharmaceutical applications (mood stabilizers) and glass/ceramics provides a small but stable demand floor. Government policies including the U.S. Inflation Reduction Act and EU Critical Raw Materials Act are reshaping supply chain geography, incentivizing domestic lithium production and processing in Western nations.

## Winners

Lithium miners with low-cost brine operations in Chile and Argentina capture outsized margins during price rallies. Albemarle (ALB), SQM, and Pilbara Minerals see direct earnings leverage. Battery recyclers (Li-Cycle, Redwood Materials) benefit as higher virgin lithium prices improve the economics of recovering lithium from spent cells. Lithium-rich nations gain geopolitical leverage and fiscal revenues through royalties and export taxes.

## Losers

EV manufacturers absorb higher battery pack costs, compressing vehicle margins or forcing retail price increases that risk demand destruction. Battery cell manufacturers (CATL, LG Energy Solution, Panasonic) face raw material cost inflation that may not be fully passable to automakers. Consumer electronics companies see incremental cost pressure. Sodium-ion battery developers gain relative competitiveness during lithium price spikes, potentially accelerating substitution away from lithium chemistries in cost-sensitive applications.

## Trading Note

Lithium lacks a liquid futures market outside China, making spot price indices (Fastmarkets, Benchmark Minerals) the primary reference. The spread between spot and long-term contract prices signals market tightness. Monitor Chinese lithium carbonate prices on the Guangzhou Futures Exchange for real-time demand signals. Oversupply cycles (2023-2024) have shown that lithium prices can decline 70-80% from peak to trough, creating high-conviction entry points when marginal producers begin curtailing output. Spodumene auction prices from Pilbara Minerals provide a transparent leading indicator of market direction.
