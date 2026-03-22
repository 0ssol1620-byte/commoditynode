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
      {"id":"jju","label":"JJU Aluminum ETN","type":"etf","impact":8,"correlation":0.82,"sector":"Industrial Metals"},
      {"id":"aa","label":"Alcoa (AA)","type":"producer","impact":10,"correlation":0.85,"sector":"Aluminum"},
      {"id":"cenx","label":"Century Aluminum (CENX)","type":"producer","impact":12,"correlation":0.90,"sector":"Aluminum"},
      {"id":"arnc","label":"Arconic (ARNC)","type":"processor","impact":7,"correlation":0.65,"sector":"Aluminum Products"},
      {"id":"rio_al","label":"Rio Tinto (RIO)","type":"producer","impact":6,"correlation":0.55,"sector":"Diversified Mining"},
      {"id":"kalu","label":"Kaiser Aluminum (KALU)","type":"producer","impact":9,"correlation":0.78,"sector":"Aluminum"},
      {"id":"xme_al","label":"XME Metals Mining ETF","type":"etf","impact":5,"correlation":0.50,"sector":"Mining"},
      {"id":"al_index","label":"Aluminum Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"ba_al","label":"Boeing (BA)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Aerospace"},
      {"id":"f_al","label":"Ford Motor (F)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Automotive"},
      {"id":"tsla_al","label":"Tesla (TSLA)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"EV"},
      {"id":"bll_al","label":"Ball Corp (BLL)","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Packaging"}
    ]},
    {"nodes": [
      {"id":"rtx_al","label":"RTX Corp (RTX)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Aerospace","parentId":"ba_al"},
      {"id":"eadsy_al","label":"Airbus (EADSY)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Aerospace","parentId":"ba_al"},
      {"id":"gm_al","label":"General Motors (GM)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Automotive","parentId":"f_al"},
      {"id":"can_mfg","label":"Can Manufacturing","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Packaging","parentId":"bll_al"},
      {"id":"cck_al","label":"Crown Holdings (CCK)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Packaging","parentId":"bll_al"},
      {"id":"hwm_al","label":"Howmet Aerospace (HWM)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Aerospace","parentId":"arnc"},
      {"id":"bhp_al","label":"BHP Group (BHP)","type":"producer","impact":4,"correlation":0.38,"sector":"Diversified Mining","parentId":"rio_al"},
      {"id":"hindalco","label":"Hindalco (HIN.NS)","type":"producer","impact":8,"correlation":0.70,"sector":"Aluminum","parentId":"aa"},
      {"id":"energy_cost","label":"Energy Cost Impact","type":"macro","impact":-7,"correlation":-0.55,"sector":"Power","parentId":"cenx"},
      {"id":"ev_al","label":"EV Aluminum Demand","type":"consumer","impact":5,"correlation":0.38,"sector":"EV Lightweighting","parentId":"tsla_al"},
      {"id":"copper_sub","label":"Copper (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Base Metals","parentId":"al_index"},
      {"id":"norsk","label":"Norsk Hydro (NHYDY)","type":"producer","impact":8,"correlation":0.72,"sector":"Aluminum","parentId":"aa"}
    ]},
    {"nodes": [
      {"id":"construction_al","label":"Construction Sector","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Construction","parentId":"arnc"},
      {"id":"dhi_al","label":"DR Horton (DHI)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Homebuilding","parentId":"construction_al"},
      {"id":"cat_al","label":"Caterpillar (CAT)","type":"consumer","impact":-2,"correlation":-0.14,"sector":"Equipment","parentId":"construction_al"},
      {"id":"dxy_al","label":"US Dollar (DXY)","type":"fx","impact":-5,"correlation":-0.45,"sector":"Forex","parentId":"al_index"},
      {"id":"cny_al","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"al_index"},
      {"id":"china_smelting","label":"China Smelter Output","type":"macro","impact":-5,"correlation":-0.42,"sector":"Supply","parentId":"cny_al"},
      {"id":"lme_al_stocks","label":"LME Aluminum Stocks","type":"macro","impact":-6,"correlation":-0.55,"sector":"Supply Data","parentId":"al_index"},
      {"id":"alumina_price","label":"Alumina Price","type":"commodity","impact":7,"correlation":0.75,"sector":"Input Cost","parentId":"aa"},
      {"id":"bauxite","label":"Bauxite Supply","type":"commodity","impact":5,"correlation":0.50,"sector":"Raw Material","parentId":"alumina_price"},
      {"id":"recycled_al","label":"Recycled Aluminum","type":"processor","impact":-3,"correlation":-0.25,"sector":"Recycling","parentId":"aa"},
      {"id":"steel_sub_al","label":"Steel (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Industrial Metals","parentId":"al_index"},
      {"id":"plastic_sub_al","label":"Plastics (Substitute)","type":"substitute","impact":-2,"correlation":-0.18,"sector":"Materials","parentId":"can_mfg"}
    ]},
    {"nodes": [
      {"id":"china_capacity","label":"China Capacity Cap","type":"policy","impact":6,"correlation":0.48,"sector":"Supply Policy","parentId":"china_smelting"},
      {"id":"power_crisis_al","label":"Power Cost Crisis","type":"macro","impact":7,"correlation":0.50,"sector":"Energy","parentId":"energy_cost"},
      {"id":"eu_cbam","label":"EU Carbon Border Tax","type":"policy","impact":5,"correlation":0.35,"sector":"Trade Policy","parentId":"dxy_al"},
      {"id":"section232","label":"Section 232 Tariffs","type":"policy","impact":5,"correlation":0.40,"sector":"Trade Policy","parentId":"al_index"},
      {"id":"aerospace_cycle","label":"Aerospace Build Cycle","type":"macro","impact":4,"correlation":0.30,"sector":"Aerospace","parentId":"ba_al"},
      {"id":"ev_lightweighting","label":"EV Lightweighting Trend","type":"macro","impact":4,"correlation":0.28,"sector":"Auto","parentId":"ev_al"},
      {"id":"guinea_bauxite","label":"Guinea Bauxite Supply","type":"regional","impact":5,"correlation":0.38,"sector":"Mining","parentId":"bauxite"},
      {"id":"russia_al","label":"Russia Aluminum (Rusal)","type":"regional","impact":5,"correlation":0.40,"sector":"Supply","parentId":"norsk"},
      {"id":"aud_al","label":"Australian Dollar (AUD)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"rio_al"}
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
