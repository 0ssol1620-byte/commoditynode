---
layout: commodity
image: "/assets/images/og-default.png"
title: "Lean Hogs"
description: "Lean hogs as a globally significant protein commodity dominated by Chinese demand and disease risk."
commodity_slug: "lean-hogs"
symbol: "HE=F"
sector: "Agriculture/Livestock"
etfs: ["COW", "DBA"]
companies: ["TSN", "SFD", "HRL"]
substitutes: ["Chicken", "Beef", "Plant-Based Meat"]
themes: ["Chinese Demand", "ASF Disease Risk"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "lean_hogs", "label": "Lean Hogs"},
  "levels": [
    {"nodes": [
      {"id":"cow_hog","label":"COW Livestock ETN","type":"etf","impact":8,"correlation":0.80,"sector":"Livestock"},
      {"id":"dba_hog","label":"DBA Agriculture ETF","type":"etf","impact":4,"correlation":0.32,"sector":"Agriculture"},
      {"id":"he_index","label":"Lean Hog Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"tsn_hog","label":"Tyson Foods (TSN)","type":"processor","impact":-4,"correlation":-0.38,"sector":"Meatpacking"},
      {"id":"sfd","label":"Smithfield Foods (WH Group)","type":"processor","impact":-5,"correlation":-0.45,"sector":"Pork Processing"},
      {"id":"hrl","label":"Hormel Foods (HRL)","type":"processor","impact":-4,"correlation":-0.35,"sector":"Packaged Meat"},
      {"id":"pork_cutout","label":"Wholesale Pork Cutout","type":"index","impact":9,"correlation":0.88,"sector":"Pork Pricing"},
      {"id":"corn_hog","label":"Feed Corn (ZC=F)","type":"commodity","impact":-6,"correlation":-0.48,"sector":"Feed Grains"},
      {"id":"sm_hog","label":"Soybean Meal (ZM=F)","type":"commodity","impact":-5,"correlation":-0.42,"sector":"Feed Protein"},
      {"id":"chicken_hog","label":"Chicken (Substitute)","type":"substitute","impact":-3,"correlation":-0.28,"sector":"Poultry"},
      {"id":"beef_hog","label":"Beef (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Beef"},
      {"id":"china_demand","label":"China Pork Import Demand","type":"consumer","impact":8,"correlation":0.62,"sector":"Import Demand"}
    ]},
    {"nodes": [
      {"id":"bacon_market","label":"Bacon & Pork Belly Market","type":"commodity","impact":7,"correlation":0.72,"sector":"Processed Pork","parentId":"pork_cutout"},
      {"id":"ham_market","label":"Ham & Processed Meat","type":"commodity","impact":5,"correlation":0.48,"sector":"Processed Pork","parentId":"hrl"},
      {"id":"mcd_hog","label":"McDonald's (MCD)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"QSR","parentId":"pork_cutout"},
      {"id":"yum_hog","label":"Yum Brands (YUM)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"QSR","parentId":"pork_cutout"},
      {"id":"kr_hog","label":"Kroger (KR)","type":"consumer","impact":-2,"correlation":-0.14,"sector":"Grocery Retail","parentId":"tsn_hog"},
      {"id":"wmt_hog","label":"Walmart (WMT)","type":"consumer","impact":-2,"correlation":-0.10,"sector":"Grocery Retail","parentId":"tsn_hog"},
      {"id":"asf_risk","label":"African Swine Fever (ASF)","type":"macro","impact":9,"correlation":0.70,"sector":"Disease Risk","parentId":"china_demand"},
      {"id":"hog_corn_ratio","label":"Hog-Corn Price Ratio","type":"index","impact":7,"correlation":0.55,"sector":"Feed Economics","parentId":"corn_hog"},
      {"id":"bynd_hog","label":"Beyond Meat (BYND)","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Plant-Based","parentId":"chicken_hog"},
      {"id":"eu_pork","label":"EU Pork Production","type":"regional","impact":-4,"correlation":-0.32,"sector":"Competition","parentId":"he_index"},
      {"id":"brazil_pork","label":"Brazil Pork Exports","type":"regional","impact":-3,"correlation":-0.25,"sector":"Competition","parentId":"he_index"},
      {"id":"cold_storage_hog","label":"Pork Cold Storage","type":"macro","impact":5,"correlation":0.38,"sector":"Inventory","parentId":"pork_cutout"}
    ]},
    {"nodes": [
      {"id":"china_herd","label":"China Hog Herd Recovery","type":"regional","impact":7,"correlation":0.55,"sector":"Supply","parentId":"asf_risk"},
      {"id":"cny_hog","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.30,"sector":"Forex","parentId":"china_demand"},
      {"id":"iowa_prod","label":"Iowa/Midwest Production","type":"regional","impact":6,"correlation":0.48,"sector":"Supply","parentId":"he_index"},
      {"id":"nc_prod","label":"North Carolina Production","type":"regional","impact":5,"correlation":0.42,"sector":"Supply","parentId":"sfd"},
      {"id":"usda_hogs_pigs","label":"USDA Hogs & Pigs Report","type":"macro","impact":7,"correlation":0.55,"sector":"Data Release","parentId":"he_index"},
      {"id":"belly_primal","label":"Pork Belly Primal Values","type":"index","impact":6,"correlation":0.60,"sector":"Seasonal Pricing","parentId":"bacon_market"},
      {"id":"deli_meat","label":"Deli Meat & Sausage","type":"consumer","impact":4,"correlation":0.32,"sector":"Processed Meat","parentId":"ham_market"},
      {"id":"food_cpi_hog","label":"Pork CPI Inflation","type":"macro","impact":3,"correlation":0.25,"sector":"Consumer Prices","parentId":"mcd_hog"},
      {"id":"mexico_export","label":"Mexico Pork Exports","type":"regional","impact":3,"correlation":0.25,"sector":"Export Demand","parentId":"pork_cutout"},
      {"id":"japan_hog","label":"Japan Pork Imports","type":"regional","impact":3,"correlation":0.22,"sector":"Export Demand","parentId":"pork_cutout"},
      {"id":"dxy_hog","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.25,"sector":"Forex","parentId":"cny_hog"}
    ]},
    {"nodes": [
      {"id":"ractopamine","label":"Ractopamine Trade Barriers","type":"policy","impact":-3,"correlation":-0.22,"sector":"Trade Policy","parentId":"china_demand"},
      {"id":"prop12","label":"California Prop 12","type":"policy","impact":-4,"correlation":-0.28,"sector":"Animal Welfare","parentId":"iowa_prod"},
      {"id":"asf_vaccine","label":"ASF Vaccine Development","type":"macro","impact":5,"correlation":0.35,"sector":"Veterinary","parentId":"china_herd"},
      {"id":"summer_grilling","label":"Summer Grilling Demand","type":"macro","impact":4,"correlation":0.32,"sector":"Seasonal Demand","parentId":"belly_primal"},
      {"id":"freight_hog","label":"Refrigerated Trucking","type":"freight","impact":3,"correlation":0.20,"sector":"Logistics","parentId":"cold_storage_hog"},
      {"id":"packing_capacity","label":"Packing Plant Capacity","type":"macro","impact":5,"correlation":0.38,"sector":"Processing","parentId":"tsn_hog"},
      {"id":"sow_productivity","label":"Sow Productivity Gains","type":"macro","impact":-4,"correlation":-0.30,"sector":"Supply Growth","parentId":"usda_hogs_pigs"},
      {"id":"korea_hog","label":"South Korea Pork Imports","type":"regional","impact":3,"correlation":0.20,"sector":"Export Demand","parentId":"japan_hog"},
      {"id":"spain_pork","label":"Spain Pork Production","type":"regional","impact":-3,"correlation":-0.22,"sector":"Competition","parentId":"eu_pork"},
      {"id":"cme_cutout","label":"CME Pork Cutout Index","type":"index","impact":7,"correlation":0.72,"sector":"Market Structure","parentId":"pork_cutout"},
      {"id":"pepperoni","label":"Pepperoni/Pizza Demand","type":"consumer","impact":3,"correlation":0.22,"sector":"Processed Meat","parentId":"deli_meat"},
      {"id":"strategic_reserve","label":"China Strategic Pork Reserve","type":"policy","impact":5,"correlation":0.35,"sector":"Government","parentId":"china_herd"},
      {"id":"mn_prod","label":"Minnesota Production","type":"regional","impact":4,"correlation":0.35,"sector":"Supply","parentId":"iowa_prod"},
      {"id":"labor_packing","label":"Packing Plant Labor","type":"macro","impact":3,"correlation":0.22,"sector":"Labor Market","parentId":"packing_capacity"},
      {"id":"cny_devaluation","label":"CNY Devaluation Risk","type":"fx","impact":-3,"correlation":-0.20,"sector":"Forex","parentId":"cny_hog"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Lean hog futures represent the benchmark pricing mechanism for the US pork industry, the world's third-largest pork producer behind China and the European Union. Pork is the most consumed meat globally, with China alone accounting for approximately half of worldwide consumption. The 2018-2019 African Swine Fever outbreak devastated China's hog herd by an estimated 40-50%, triggering a global pork price shock and massive import demand surge that reshaped international trade flows. While China has partially rebuilt its herd through industrialization of its hog farming sector, ASF remains an endemic threat across Asia and has spread to Europe, creating persistent supply risk. US lean hog futures reflect domestic supply-demand fundamentals but are increasingly influenced by Chinese import patterns, making the HE contract a proxy for global protein market dynamics.

## Key Impact Channels

**Primary -- Pork Processors and Cutout Values:** Smithfield Foods (owned by WH Group, China's largest pork company), Tyson Foods, and Hormel operate on the buy side of live hogs and face margin compression when hog prices rise faster than wholesale pork cutout values. The pork cutout -- decomposed into primal cuts including loin, butt, rib, ham, and belly -- drives processor revenue. Pork bellies, the raw material for bacon, are the most volatile primal and exhibit strong seasonal patterns with summer grilling demand. Hormel's branded products (SPAM, Applegate) provide some insulation through pricing power, while commodity-focused processors absorb full input cost volatility.

**Secondary -- Feed Costs, Exports, and Competition:** The hog-corn price ratio is the fundamental indicator of producer profitability. When corn prices spike relative to hog values, producers curtail breeding and reduce herd size, tightening future supply. Soybean meal provides the protein component of hog rations, linking pork production costs to the oilseed complex. US pork exports to Mexico, Japan, and South Korea provide incremental demand above domestic consumption. EU and Brazilian pork exports compete with US product in Asian markets, with trade barriers around ractopamine (a feed additive banned in many countries) limiting US access to certain markets.

**Tertiary -- Chinese Demand, Disease Risk, and Policy:** China's import demand is the single largest external variable in the lean hog market. ASF outbreaks or policy shifts in Chinese hog production can move US futures by 10-15% within weeks. The ongoing development of ASF vaccines represents a potential game-changer for global pork supply stability. Domestically, California's Proposition 12 animal welfare standards have created a two-tier market for pork, raising compliance costs for producers selling into the state. USDA packing plant processing capacity constraints create bottlenecks during peak slaughter periods.

## Winners

US hog producers in Iowa and the Midwest capture direct upside from price rallies, particularly during periods of tight supply or Chinese import surges. Smithfield's parent company WH Group benefits from its unique position straddling both US production and Chinese distribution. Chicken producers including Pilgrim's Pride and Sanderson Farms gain market share when pork prices rise and consumers substitute. Brazilian pork exporters (BRF, JBS) benefit from increased Asian demand that exceeds US export capacity.

## Losers

Pork processors face margin compression when live hog prices outpace wholesale cutout values and slaughter capacity utilization falls. Fast-food chains and grocery retailers absorb cost increases on pork products, particularly during summer bacon price spikes. Producers in regions affected by Proposition 12 face higher compliance costs and reduced market access. Chinese consumers bear the ultimate burden of pork price inflation, which carries significant political sensitivity in China and has historically prompted government intervention through strategic pork reserves.

## Trading Note

The quarterly USDA Hogs and Pigs report is the most important fundamental catalyst, with breeding herd and pig crop data setting supply expectations for the following 6-9 months. Weekly slaughter data and pork cutout values provide real-time demand signals. Monitor pork belly primal values for seasonal trading opportunities, as the belly-to-cutout ratio exhibits reliable patterns around summer grilling season. Cold storage inventory levels from the USDA indicate demand absorption rates. China's monthly pork import data and any ASF outbreak reports are critical external catalysts. The commitment of traders report reveals managed money positioning that tends to reach extremes at seasonal price peaks and troughs.
