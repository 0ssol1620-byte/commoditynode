---
layout: commodity
title: "Aluminum"
description: "Aluminum's role in aerospace, EV lightweighting, and energy-intensive smelting economics."
commodity_slug: "aluminum"
symbol: "ALI=F"
sector: "Industrial Metals"
etfs: ["JJU"]
companies: ["AA", "CENX", "ARNC"]
substitutes: ["Steel", "Carbon Fiber", "Plastics"]
themes: ["EV Transition", "Clean Energy"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "aluminum", "label": "Aluminum (ALI)"},
  "levels": [
    {"nodes": [
      {"id":"jju","label":"JJU Aluminum ETN","type":"etf","impact":9,"correlation":0.88,"sector":"Metals"},
      {"id":"aa","label":"Alcoa (AA)","type":"producer","impact":14,"correlation":0.90,"sector":"Mining"},
      {"id":"cenx","label":"Century Aluminum (CENX)","type":"producer","impact":15,"correlation":0.88,"sector":"Smelting"},
      {"id":"arnc","label":"Arconic (ARNC)","type":"processor","impact":8,"correlation":0.72,"sector":"Rolling"},
      {"id":"rio_al","label":"Rio Tinto (RIO)","type":"producer","impact":7,"correlation":0.68,"sector":"Mining"}
    ]},
    {"nodes": [
      {"id":"ba_al","label":"Boeing (BA)","type":"consumer","impact":-4,"correlation":-0.45,"sector":"Aerospace","parentId":"arnc"},
      {"id":"can_mfg","label":"Beverage Can Mfg","type":"consumer","impact":-3,"correlation":-0.40,"sector":"Packaging","parentId":"aa"},
      {"id":"ev_al","label":"EV Lightweighting","type":"consumer","impact":5,"correlation":0.50,"sector":"Automotive","parentId":"jju"},
      {"id":"energy_cost","label":"Energy Costs (Input)","type":"macro","impact":-8,"correlation":-0.65,"sector":"Power","parentId":"cenx"},
      {"id":"copper_sub","label":"Copper (Substitute)","type":"substitute","impact":-4,"correlation":-0.35,"sector":"Industrial Metals","parentId":"jju"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Aluminum is the world's most widely used non-ferrous metal, prized for its lightweight strength, corrosion resistance, and infinite recyclability. Production is extremely energy-intensive, with electricity representing 30-40% of smelting costs, making aluminum prices highly sensitive to global energy markets. China dominates production with over 55% of global output, while Western smelters increasingly face competitiveness challenges from high energy costs. Global demand exceeds 70 million tonnes annually and continues to grow at 3-4% per year, driven by transportation lightweighting and renewable energy infrastructure buildout.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** The aerospace industry relies on aluminum alloys for airframes and structural components, while beverage cans represent the single largest end-use category in North America. Alcoa and Century Aluminum are the leading U.S. producers, with earnings directly leveraged to LME aluminum prices. Can sheet demand provides a stable baseline that supports prices even during industrial downturns. Aerospace-grade alloys command significant premiums over commodity-grade metal, insulating specialty producers from broader market weakness.

**Secondary -- Supply Chain and Processing:** Electric vehicle manufacturers are rapidly increasing aluminum content per vehicle to offset battery weight and extend range. The average EV uses 30-50% more aluminum than a comparable ICE vehicle. Tesla's use of aluminum mega-castings for vehicle structures has accelerated adoption across the industry, creating a structural demand growth channel. Downstream rolling mills and extruders add substantial value between primary metal and finished products, with conversion margins providing earnings stability independent of LME price direction.

**Tertiary -- Macro and Second-Order Effects:** Aluminum window frames, curtain walls, and electrical transmission cables represent significant demand segments. The metal competes with copper in power cable applications where weight is a concern, particularly in overhead transmission lines. Green aluminum (produced with renewable energy) commands a 5-15% premium in ESG-conscious markets. Rising carbon border adjustment mechanisms in the EU will increasingly penalize high-carbon aluminum imports, reshaping global trade flows toward low-emission producers.

## Winners

Rising aluminum prices benefit primary smelters like Alcoa (AA), Century Aluminum (CENX), and Rio Tinto's Pacific operations, which see direct earnings leverage of 1.5-2x on price moves due to operating leverage against relatively fixed energy and labor costs. Recyclers and secondary smelters also benefit, as the scrap-to-primary price ratio makes recycling more profitable. Bauxite-rich nations including Australia, Guinea, and Jamaica collect higher royalties during price rallies.

## Losers

Automakers, construction firms, and packaging companies face margin compression when aluminum prices surge. Boeing and Airbus absorb billions in incremental material costs during sustained rallies. Beverage companies using aluminum cans experience packaging cost inflation. Energy-intensive smelters in regions with volatile electricity pricing (Europe, particularly) can paradoxically suffer during rallies if power costs rise simultaneously, squeezing margins from both sides.

## Trading Note

Track LME aluminum inventories and the contango/backwardation structure of the futures curve for supply tightness signals. Chinese smelter production cuts (often driven by power rationing or environmental policy) trigger rapid price responses. The aluminum/copper price ratio indicates substitution dynamics in electrical applications. Energy costs at marginal smelters set the effective price floor. Midwest premium (the physical delivery premium over LME for North American buyers) reflects regional supply-demand conditions and logistics constraints that can diverge from global LME trends.
