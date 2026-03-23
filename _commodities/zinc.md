---
layout: commodity
unit: "$/mt"
image: "/assets/images/og-zinc.png"
title: "Zinc"
description: "Zinc as a construction cycle indicator through its dominant galvanizing steel applications."
commodity_slug: "zinc"
symbol: "ZINC"
sector: "Industrial Metals"
etfs: ["JJM"]
companies: ["BHP", "GLNCY", "TECK"]
substitutes: ["Aluminum", "Plastics"]
themes: ["Infrastructure Boom"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "zinc", "label": "Zinc (LME)"},
  "levels": [
    {"nodes": [
      {"id":"jjm","label":"JJM Industrial Metals ETF","type":"etf","impact":7,"correlation":0.70,"sector":"Industrial Metals"},
      {"id":"bhp_zn","label":"BHP Group (BHP)","type":"producer","impact":4,"correlation":0.45,"sector":"Diversified Mining"},
      {"id":"glncy_zn","label":"Glencore (GLNCY)","type":"producer","impact":6,"correlation":0.60,"sector":"Diversified Mining"},
      {"id":"teck_zn","label":"Teck Resources (TECK)","type":"producer","impact":7,"correlation":0.65,"sector":"Base Metals"},
      {"id":"vedl","label":"Vedanta Ltd (VEDL)","type":"producer","impact":8,"correlation":0.68,"sector":"Base Metals"},
      {"id":"xme_zn","label":"XME Metals Mining ETF","type":"etf","impact":5,"correlation":0.55,"sector":"Mining"},
      {"id":"zinc_index","label":"Zinc Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"nue_zn","label":"Nucor (NUE)","type":"consumer","impact":-3,"correlation":-0.30,"sector":"Steel"},
      {"id":"stld_zn","label":"Steel Dynamics (STLD)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Steel"},
      {"id":"gm_zn","label":"General Motors (GM)","type":"consumer","impact":-2,"correlation":-0.20,"sector":"Automotive"},
      {"id":"f_zn","label":"Ford Motor (F)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Automotive"},
      {"id":"vmc_zn","label":"Vulcan Materials (VMC)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Construction"}
    ]},
    {"nodes": [
      {"id":"boliden","label":"Boliden (BDNNY)","type":"producer","impact":9,"correlation":0.72,"sector":"Base Metals","parentId":"teck_zn"},
      {"id":"ivn","label":"Ivanhoe Mines (IVN)","type":"producer","impact":7,"correlation":0.60,"sector":"Base Metals","parentId":"glncy_zn"},
      {"id":"hwm","label":"Howmet Aerospace (HWM)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Aerospace","parentId":"nue_zn"},
      {"id":"x_zn","label":"US Steel (X)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Steel","parentId":"nue_zn"},
      {"id":"pave_zn","label":"PAVE Infrastructure ETF","type":"etf","impact":3,"correlation":0.25,"sector":"Infrastructure","parentId":"vmc_zn"},
      {"id":"cat_zn","label":"Caterpillar (CAT)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Heavy Equipment","parentId":"vmc_zn"},
      {"id":"galvanizing","label":"Galvanizing Sector","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Steel Processing","parentId":"nue_zn"},
      {"id":"batt_zn","label":"Zinc Battery Tech","type":"consumer","impact":3,"correlation":0.20,"sector":"Energy Storage","parentId":"zinc_index"},
      {"id":"mlm_zn","label":"Martin Marietta (MLM)","type":"consumer","impact":-2,"correlation":-0.14,"sector":"Construction","parentId":"vmc_zn"},
      {"id":"tm_zn","label":"Toyota Motor (TM)","type":"consumer","impact":-1,"correlation":-0.12,"sector":"Automotive","parentId":"gm_zn"},
      {"id":"fcx_zn","label":"Freeport-McMoRan (FCX)","type":"producer","impact":4,"correlation":0.40,"sector":"Diversified Mining","parentId":"bhp_zn"},
      {"id":"aa_zn","label":"Alcoa (AA)","type":"producer","impact":3,"correlation":0.30,"sector":"Metals","parentId":"bhp_zn"}
    ]},
    {"nodes": [
      {"id":"dhi_zn","label":"DR Horton (DHI)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Homebuilding","parentId":"galvanizing"},
      {"id":"len_zn","label":"Lennar Corp (LEN)","type":"consumer","impact":-2,"correlation":-0.14,"sector":"Homebuilding","parentId":"galvanizing"},
      {"id":"hd_zn","label":"Home Depot (HD)","type":"consumer","impact":-1,"correlation":-0.10,"sector":"Home Improvement","parentId":"galvanizing"},
      {"id":"de_zn","label":"Deere & Co (DE)","type":"consumer","impact":-1,"correlation":-0.10,"sector":"Agriculture Equipment","parentId":"cat_zn"},
      {"id":"dxy_zn","label":"US Dollar (DXY)","type":"fx","impact":-5,"correlation":-0.45,"sector":"Forex","parentId":"zinc_index"},
      {"id":"cny_zn","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"glncy_zn"},
      {"id":"china_stimulus","label":"China Infrastructure Policy","type":"policy","impact":8,"correlation":0.50,"sector":"Policy","parentId":"cny_zn"},
      {"id":"lme_stocks","label":"LME Warehouse Stocks","type":"macro","impact":-6,"correlation":-0.55,"sector":"Supply Data","parentId":"zinc_index"},
      {"id":"copper_sub","label":"Copper (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Base Metals","parentId":"fcx_zn"},
      {"id":"al_sub_zn","label":"Aluminum (Substitute)","type":"substitute","impact":-3,"correlation":-0.20,"sector":"Light Metals","parentId":"aa_zn"},
      {"id":"lead_related","label":"Lead (Related)","type":"commodity","impact":5,"correlation":0.60,"sector":"Base Metals","parentId":"zinc_index"},
      {"id":"recycling_zn","label":"Zinc Recycling","type":"processor","impact":-3,"correlation":-0.20,"sector":"Recycling","parentId":"galvanizing"}
    ]},
    {"nodes": [
      {"id":"china_pmi_zn","label":"China PMI Data","type":"macro","impact":6,"correlation":0.45,"sector":"Economic Data","parentId":"china_stimulus"},
      {"id":"global_construction","label":"Global Construction Cycle","type":"macro","impact":5,"correlation":0.40,"sector":"Macro","parentId":"pave_zn"},
      {"id":"ev_demand_zn","label":"EV Zinc Demand","type":"consumer","impact":3,"correlation":0.25,"sector":"Clean Energy","parentId":"batt_zn"},
      {"id":"mining_capex","label":"Mining CapEx Cycle","type":"macro","impact":5,"correlation":0.35,"sector":"Investment","parentId":"bhp_zn"},
      {"id":"tariffs_zn","label":"Trade Tariffs","type":"policy","impact":-4,"correlation":-0.30,"sector":"Trade Policy","parentId":"china_stimulus"},
      {"id":"aud_zn","label":"Australian Dollar (AUD)","type":"fx","impact":4,"correlation":0.38,"sector":"Forex","parentId":"bhp_zn"},
      {"id":"environmental_zn","label":"Environmental Regs","type":"policy","impact":4,"correlation":0.25,"sector":"Regulation","parentId":"mining_capex"},
      {"id":"india_infra","label":"India Infrastructure","type":"macro","impact":4,"correlation":0.30,"sector":"Emerging Markets","parentId":"vedl"},
      {"id":"zinc_premium","label":"Physical Zinc Premium","type":"commodity","impact":7,"correlation":0.80,"sector":"Commodities","parentId":"lme_stocks"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Zinc is the fourth-most consumed metal globally, with roughly 60% of production used to galvanize (corrosion-proof) steel for construction, infrastructure, and automotive applications. This concentrated end-use profile makes zinc one of the most reliable construction cycle indicators among base metals. Global mine supply is geographically diverse but faces persistent challenges from aging deposits and environmental permitting delays, creating recurring supply deficits during demand upswings. Annual production is approximately 13 million tonnes, with China, Australia, and Peru as the largest mine producers.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Hot-dip galvanizing of structural steel, guardrails, transmission towers, and bridge components is the dominant demand application. Infrastructure spending programs (U.S. Infrastructure Investment and Jobs Act, European Green Deal) directly increase zinc consumption. Glencore and Teck Resources are major zinc mine operators, while BHP produces zinc as a by-product at several operations. Galvanized steel demand closely tracks construction PMI readings in major economies. Boliden and Nyrstar operate major zinc smelting operations in Europe.

**Secondary -- Supply Chain and Processing:** Zinc alloys are widely used in die-cast automotive components, hardware, and decorative fittings. The automotive sector's shift toward lighter materials has modestly reduced zinc die-casting demand per vehicle, but growing global vehicle production partially offsets this trend. Zinc-aluminum alloy coatings for advanced high-strength steel in vehicle bodies represent an emerging application that supports per-unit zinc consumption. Zinc concentrate treatment charges (TCs) paid by miners to smelters fluctuate with mine supply availability, creating a secondary indicator of market balance.

**Tertiary -- Macro and Second-Order Effects:** Zinc oxide is used in rubber vulcanization (tire manufacturing), cosmetics, pharmaceuticals, and animal feed supplements. This chemical demand segment provides a stable baseline that is less cyclically sensitive than construction-related galvanizing. Zinc-air and zinc-bromine battery technologies are being developed for grid storage applications, though commercialization remains limited compared to lithium-ion alternatives. Zinc's correlation with global construction activity makes it a useful macro indicator for infrastructure spending momentum and emerging market urbanization trends.

## Winners

Zinc miners with low-cost operations benefit directly from price rallies. Glencore, Teck Resources, and Boliden see earnings leverage on their zinc mining segments. Infrastructure contractors benefit from project pipelines that drive galvanized steel demand. Galvanizing companies capture wider processing margins when end-user demand is strong. Zinc-producing nations (Peru, Australia, India) collect higher royalties and export revenues during price rallies.

## Losers

Steel galvanizers face higher raw material costs that squeeze processing margins when they cannot pass through price increases. Construction firms absorb higher costs on galvanized structural steel, guardrails, and fencing. Automotive manufacturers see incremental cost increases on zinc die-cast components and galvanized body panels. Tire manufacturers face rising costs from zinc oxide used in vulcanization. Infrastructure project budgets inflate, potentially delaying or downsizing planned spending programs.

## Trading Note

LME zinc inventories and the futures curve structure (contango vs backwardation) are the primary trading indicators. When LME stocks fall below 100,000 tonnes, physical tightness typically drives backwardation and price rallies. Monitor Chinese smelter treatment charges (TCs) for mine-to-smelter supply dynamics -- falling TCs indicate tight concentrate supply and potential smelter production cuts. The zinc/lead price ratio reflects relative supply tightness between these often co-mined metals. Shanghai Futures Exchange zinc prices provide a window into Chinese domestic market conditions that often lead LME price direction.
