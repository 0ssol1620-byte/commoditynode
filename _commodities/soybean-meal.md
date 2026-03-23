---
layout: commodity
image: "/assets/images/og-default.png"
title: "Soybean Meal"
description: "Soybean meal as the dominant global protein source in animal feed, driving the soy crush spread and livestock economics."
commodity_slug: "soybean-meal"
symbol: "ZM=F"
sector: "Agriculture"
etfs: ["SOYB", "DBA"]
companies: ["ADM", "BG", "CTVA"]
substitutes: ["Canola Meal", "Fish Meal", "DDGS"]
themes: ["Animal Feed", "Crush Spread"]
tags: [soybean meal, animal feed, crush spread, protein meal, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "soybean_meal", "label": "Soybean Meal"},
  "levels": [
    {"nodes": [
      {"id":"zm_futures","label":"Soybean Meal Futures (ZM=F)","type":"index","impact":10,"correlation":0.99,"sector":"Agriculture"},
      {"id":"adm_sm","label":"ADM (ADM)","type":"processor","impact":7,"correlation":0.58,"sector":"Oilseed Crushing"},
      {"id":"bg_sm","label":"Bunge (BG)","type":"processor","impact":7,"correlation":0.55,"sector":"Oilseed Crushing"},
      {"id":"soybean_input","label":"Soybeans (ZS=F)","type":"commodity","impact":9,"correlation":0.92,"sector":"Agriculture"},
      {"id":"soy_oil","label":"Soybean Oil (ZL=F)","type":"commodity","impact":5,"correlation":0.48,"sector":"Vegetable Oils"},
      {"id":"tsn_sm","label":"Tyson Foods (TSN)","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Meat Processing"},
      {"id":"ppc_sm","label":"Pilgrim's Pride (PPC)","type":"consumer","impact":-6,"correlation":-0.52,"sector":"Poultry"},
      {"id":"sfd_sm","label":"Sanderson Farms (SAFM)","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Poultry"},
      {"id":"soyb_etf","label":"SOYB Soybean ETF","type":"etf","impact":7,"correlation":0.65,"sector":"Agriculture"},
      {"id":"dba_sm","label":"DBA Agriculture ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Agriculture"},
      {"id":"ctva_sm","label":"Corteva (CTVA)","type":"supplier","impact":4,"correlation":0.32,"sector":"Seeds & Crop Science"},
      {"id":"china_demand","label":"China Soy Import Demand","type":"macro","impact":8,"correlation":0.70,"sector":"International Trade"},
      {"id":"argentina_prod","label":"Argentine Production","type":"regional","impact":-6,"correlation":-0.50,"sector":"South American Supply"}
    ]},
    {"nodes": [
      {"id":"crush_spread","label":"Soy Crush Spread","type":"index","impact":8,"correlation":0.72,"sector":"Processing Margins","parentId":"adm_sm"},
      {"id":"brazil_soy","label":"Brazil Soybean Crop","type":"regional","impact":-7,"correlation":-0.60,"sector":"South American Supply","parentId":"soybean_input"},
      {"id":"poultry_feed","label":"Poultry Feed Rations","type":"consumer","impact":-7,"correlation":-0.58,"sector":"Animal Nutrition","parentId":"ppc_sm"},
      {"id":"hog_feed","label":"Hog Feed Demand","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Animal Nutrition","parentId":"tsn_sm"},
      {"id":"aquaculture","label":"Aquaculture Feed","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Fish Farming","parentId":"zm_futures"},
      {"id":"pet_food","label":"Pet Food (CHWY proxy)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Pet Care","parentId":"zm_futures"},
      {"id":"canola_sub","label":"Canola Meal (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Protein Meal","parentId":"zm_futures"},
      {"id":"fishmeal_sub","label":"Fish Meal (Substitute)","type":"substitute","impact":-2,"correlation":-0.18,"sector":"Protein Meal","parentId":"aquaculture"},
      {"id":"ddgs_sub","label":"DDGS (Substitute)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Animal Feed","parentId":"zm_futures"},
      {"id":"feed_additives","label":"Feed Additives & Amino Acids","type":"supplier","impact":3,"correlation":0.22,"sector":"Animal Nutrition","parentId":"poultry_feed"},
      {"id":"mos_sm","label":"Mosaic (MOS)","type":"supplier","impact":3,"correlation":0.25,"sector":"Fertilizers","parentId":"soybean_input"},
      {"id":"ntr_sm","label":"Nutrien (NTR)","type":"supplier","impact":3,"correlation":0.22,"sector":"Fertilizers","parentId":"soybean_input"}
    ]},
    {"nodes": [
      {"id":"china_hog_herd","label":"China Hog Herd Rebuild","type":"macro","impact":6,"correlation":0.52,"sector":"Livestock","parentId":"china_demand"},
      {"id":"asf_outbreak","label":"African Swine Fever Risk","type":"macro","impact":-5,"correlation":-0.40,"sector":"Disease","parentId":"china_hog_herd"},
      {"id":"usda_wasde","label":"USDA WASDE Report","type":"macro","impact":6,"correlation":0.48,"sector":"Data Release","parentId":"soybean_input"},
      {"id":"brl_sm","label":"Brazilian Real (BRL)","type":"fx","impact":5,"correlation":0.42,"sector":"Forex","parentId":"brazil_soy"},
      {"id":"ars_sm","label":"Argentine Peso (ARS)","type":"fx","impact":4,"correlation":0.30,"sector":"Forex","parentId":"argentina_prod"},
      {"id":"arg_export_tax","label":"Argentina Export Tax","type":"policy","impact":-5,"correlation":-0.38,"sector":"Trade Policy","parentId":"argentina_prod"},
      {"id":"biodiesel_oil","label":"Biodiesel Soy Oil Demand","type":"consumer","impact":4,"correlation":0.32,"sector":"Biofuels","parentId":"soy_oil"},
      {"id":"usd_sm","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.35,"sector":"Forex","parentId":"zm_futures"},
      {"id":"logistics_sm","label":"Mississippi River Barge","type":"freight","impact":4,"correlation":0.28,"sector":"Logistics","parentId":"adm_sm"},
      {"id":"safrinha_corn","label":"Brazil Safrinha Corn","type":"commodity","impact":-3,"correlation":-0.22,"sector":"Agriculture","parentId":"brazil_soy"},
      {"id":"de_sm","label":"Deere & Company (DE)","type":"supplier","impact":3,"correlation":0.25,"sector":"Farm Equipment","parentId":"soybean_input"}
    ]},
    {"nodes": [
      {"id":"us_china_trade","label":"US-China Trade Relations","type":"policy","impact":7,"correlation":0.55,"sector":"Geopolitics","parentId":"china_demand"},
      {"id":"la_nina_sm","label":"La Niña Drought Risk","type":"macro","impact":6,"correlation":0.48,"sector":"Weather","parentId":"brazil_soy"},
      {"id":"parana_drought","label":"Paraná River Levels","type":"macro","impact":4,"correlation":0.32,"sector":"Logistics","parentId":"logistics_sm"},
      {"id":"protein_premium","label":"Protein Meal Premium","type":"index","impact":5,"correlation":0.40,"sector":"Feed Quality","parentId":"crush_spread"},
      {"id":"cot_sm","label":"CFTC Spec Positioning","type":"index","impact":4,"correlation":0.35,"sector":"Futures","parentId":"zm_futures"},
      {"id":"palm_oil_comp","label":"Palm Oil Competition","type":"commodity","impact":-3,"correlation":-0.22,"sector":"Vegetable Oils","parentId":"soy_oil"},
      {"id":"gmo_regulation","label":"GMO Crop Regulation","type":"policy","impact":3,"correlation":0.20,"sector":"Regulation","parentId":"ctva_sm"},
      {"id":"rbd_oil","label":"Renewable Diesel Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Biofuels","parentId":"biodiesel_oil"},
      {"id":"india_meal_import","label":"India Meal Imports","type":"regional","impact":3,"correlation":0.22,"sector":"International Trade","parentId":"china_demand"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Soybean meal is the world's dominant protein source in animal feed, accounting for over 65% of global protein meal consumption. Produced as a co-product of soybean crushing alongside soybean oil, meal typically represents 75-80% of the value in the crush process. The soy crush spread -- buying soybeans and selling the resulting meal and oil -- is one of the most actively traded agricultural processing margins. Global production is concentrated in the US, Brazil, and Argentina, with China as the overwhelmingly dominant importer, purchasing roughly 60% of all internationally traded soybeans to process domestically. Annual global soybean meal production exceeds 260 million metric tons, feeding the poultry, swine, aquaculture, and dairy industries worldwide.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** ADM and Bunge are the largest publicly traded soybean crushers, with margins directly tied to crush spread economics. Poultry integrators like Pilgrim's Pride and Sanderson Farms face soybean meal as their largest variable input cost, with feed representing 60-70% of total production costs. Tyson Foods carries exposure across chicken, pork, and beef segments. Corteva provides the seed genetics and crop protection inputs that drive soybean yields, benefiting from expanded acreage.

**Secondary -- Supply Chain and Processing:** The crush spread is the central economic signal -- when meal demand outpaces soybean supply, positive crush margins incentivize processors to increase throughput, creating a self-regulating feedback loop. Argentine export tax policy (currently 33% on soybeans vs. lower rates on meal and oil) artificially incentivizes domestic crushing over raw bean exports, making Argentina the world's largest meal exporter. Aquaculture feed demand is the fastest-growing end market, while pet food represents a sticky, price-inelastic demand segment. DDGS and canola meal serve as partial substitutes but cannot match soybean meal's amino acid profile for poultry.

**Tertiary -- Macro and Second-Order Effects:** US-China trade relations remain the single largest geopolitical risk factor, as demonstrated by the 2018-2019 tariff disruptions that redirected global soy trade flows. China's hog herd rebuilding after African Swine Fever drives incremental meal demand of 5-10 million tons annually. Brazilian Real depreciation makes Brazilian soybeans cheaper on global markets, pressuring US export competitiveness. The expansion of renewable diesel and biodiesel demand for soybean oil is altering the crush economics, with oil values rising and potentially subsidizing meal production.

## Winners

Soybean crushers benefit from widening crush spreads, particularly when meal demand is robust and bean supplies are ample. Fertilizer suppliers Mosaic and Nutrien gain from expanded soybean acreage. Brazilian farmers benefit from currency weakness that enhances their competitive position. Renewable diesel producers capture value from rising soy oil demand, indirectly supporting crush volumes and meal availability.

## Losers

Poultry and hog producers face direct margin compression when meal prices spike, as feed represents the majority of variable costs. Aquaculture operations in Asia face rising feed costs that cannot easily be passed through to fish prices. US soybean exporters lose market share when the dollar strengthens or trade tensions redirect Chinese buying to Brazil. Argentine crushers face policy risk from export tax adjustments that can abruptly alter processing economics.

## Trading Note

The USDA WASDE and quarterly Grain Stocks reports are the primary fundamental catalysts for soybean meal positioning. Monitor the board crush spread (November soybeans vs. December meal and oil) as a forward indicator of processor margins and likely throughput decisions. Brazilian planting progress (September-November) and Argentine growing season weather (December-March) set the tone for Southern Hemisphere supply expectations. CFTC Commitment of Traders data reveals speculative positioning extremes in ZM futures. The protein premium -- the price ratio of meal to oil in the crush -- reflects whether the market is being driven by feed demand (bullish meal) or biofuel demand (bullish oil), each requiring different trading strategies.
