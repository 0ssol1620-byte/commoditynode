---
layout: commodity
unit: "$/gal"
image: "/assets/images/og-ethanol.png"
title: "Ethanol Price Impact: Corn Demand, Biofuel & Refiners"
description: "Fuel ethanol as a corn-derived biofuel blended into the US gasoline supply under federal renewable fuel mandates."
commodity_slug: "ethanol"
symbol: "REX"
data_type: "proxy"
sector: "Energy/Agriculture"
etfs: ["DBA", "XLE"]
companies: ["ADM"]
substitutes: ["Gasoline", "Methanol", "Biodiesel"]
themes: ["Carbon Transition", "Food Inflation"]
tags: [ethanol, biofuel, corn, RFS, renewable fuel, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "ethanol", "label": "Fuel Ethanol"},
  "levels": [
    {"nodes": [
      {"id":"adm_eth","label":"ADM (ADM)","type":"producer","impact":7,"correlation":0.62,"sector":"Ethanol Production"},
      {"id":"gpre","label":"Green Plains (GPRE)","type":"producer","impact":8,"correlation":0.72,"sector":"Ethanol Production"},
      {"id":"peix","label":"Alto Ingredients (PEIX)","type":"producer","impact":9,"correlation":0.85,"sector":"Ethanol Production"},
      {"id":"rex","label":"Rex Energy (REX)","type":"producer","impact":7,"correlation":0.65,"sector":"Ethanol Production"},
      {"id":"corn_input","label":"Corn Futures (ZC=F)","type":"commodity","impact":-8,"correlation":-0.75,"sector":"Agriculture"},
      {"id":"gasoline","label":"RBOB Gasoline (RB=F)","type":"commodity","impact":7,"correlation":0.68,"sector":"Energy"},
      {"id":"vlo_eth","label":"Valero (VLO)","type":"consumer","impact":4,"correlation":0.35,"sector":"Refining"},
      {"id":"mpc_eth","label":"Marathon Petroleum (MPC)","type":"consumer","impact":3,"correlation":0.30,"sector":"Refining"},
      {"id":"dba_eth","label":"DBA Agriculture ETF","type":"etf","impact":4,"correlation":0.38,"sector":"Agriculture"},
      {"id":"xle_eth","label":"XLE Energy ETF","type":"etf","impact":3,"correlation":0.25,"sector":"Energy"},
      {"id":"rfs_policy","label":"RFS / EPA Mandates","type":"policy","impact":8,"correlation":0.60,"sector":"Regulation"},
      {"id":"crude_oil","label":"Crude Oil (CL=F)","type":"commodity","impact":6,"correlation":0.55,"sector":"Energy"},
      {"id":"brazil_eth","label":"Brazil Sugarcane Ethanol","type":"regional","impact":-4,"correlation":-0.30,"sector":"International Supply"}
    ]},
    {"nodes": [
      {"id":"ddgs","label":"DDGS Co-Product","type":"commodity","impact":5,"correlation":0.45,"sector":"Animal Feed","parentId":"adm_eth"},
      {"id":"corn_belt","label":"Corn Belt Basis","type":"regional","impact":-6,"correlation":-0.55,"sector":"Agriculture","parentId":"corn_input"},
      {"id":"e15_blend","label":"E15 Blending Expansion","type":"policy","impact":6,"correlation":0.50,"sector":"Regulation","parentId":"rfs_policy"},
      {"id":"rin_credits","label":"RIN Credit Market","type":"index","impact":7,"correlation":0.58,"sector":"Compliance","parentId":"rfs_policy"},
      {"id":"flex_fuel","label":"Flex-Fuel Vehicles","type":"consumer","impact":3,"correlation":0.22,"sector":"Automotive","parentId":"gasoline"},
      {"id":"cellulosic","label":"Cellulosic Ethanol","type":"producer","impact":2,"correlation":0.15,"sector":"Advanced Biofuels","parentId":"rfs_policy"},
      {"id":"ethanol_exports","label":"US Ethanol Exports","type":"macro","impact":5,"correlation":0.42,"sector":"Trade","parentId":"peix"},
      {"id":"sugar_cane","label":"Sugarcane (SB=F)","type":"commodity","impact":4,"correlation":0.35,"sector":"Agriculture","parentId":"brazil_eth"},
      {"id":"pbf_eth","label":"PBF Energy (PBF)","type":"consumer","impact":3,"correlation":0.25,"sector":"Refining","parentId":"vlo_eth"},
      {"id":"dkl_eth","label":"Delek Logistics (DKL)","type":"supplier","impact":3,"correlation":0.22,"sector":"Midstream","parentId":"mpc_eth"},
      {"id":"natural_gas_eth","label":"Natural Gas Input (NG=F)","type":"commodity","impact":-4,"correlation":-0.35,"sector":"Energy","parentId":"gpre"},
      {"id":"brent_spread","label":"Brent-WTI Spread","type":"index","impact":3,"correlation":0.28,"sector":"Energy","parentId":"crude_oil"}
    ]},
    {"nodes": [
      {"id":"livestock_feed","label":"Livestock Feed Demand","type":"consumer","impact":4,"correlation":0.32,"sector":"Animal Feed","parentId":"ddgs"},
      {"id":"tsn_eth","label":"Tyson Foods (TSN)","type":"consumer","impact":3,"correlation":0.25,"sector":"Meat Processing","parentId":"ddgs"},
      {"id":"de_eth","label":"Deere & Company (DE)","type":"supplier","impact":4,"correlation":0.35,"sector":"Farm Equipment","parentId":"corn_belt"},
      {"id":"epa_waivers","label":"EPA SRE Waivers","type":"policy","impact":-5,"correlation":-0.40,"sector":"Regulation","parentId":"e15_blend"},
      {"id":"carbon_credits","label":"LCFS Carbon Credits","type":"index","impact":4,"correlation":0.30,"sector":"Carbon Markets","parentId":"rin_credits"},
      {"id":"brl_eth","label":"Brazilian Real (BRL)","type":"fx","impact":4,"correlation":0.32,"sector":"Forex","parentId":"brazil_eth"},
      {"id":"ethanol_logistics","label":"Rail & Pipeline Transport","type":"freight","impact":3,"correlation":0.20,"sector":"Logistics","parentId":"ethanol_exports"},
      {"id":"summer_driving","label":"Summer Driving Season","type":"macro","impact":5,"correlation":0.40,"sector":"Seasonal Demand","parentId":"gasoline"},
      {"id":"methanol_sub","label":"Methanol (Substitute)","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Alternative Fuels","parentId":"gasoline"},
      {"id":"biodiesel_sub","label":"Biodiesel (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Alternative Fuels","parentId":"rfs_policy"},
      {"id":"corn_yield","label":"USDA Corn Yield Forecast","type":"macro","impact":-6,"correlation":-0.50,"sector":"Agriculture","parentId":"corn_belt"}
    ]},
    {"nodes": [
      {"id":"ev_adoption","label":"EV Adoption Trend","type":"macro","impact":-4,"correlation":-0.28,"sector":"Transportation","parentId":"flex_fuel"},
      {"id":"drought_risk","label":"Midwest Drought Risk","type":"macro","impact":6,"correlation":0.45,"sector":"Weather","parentId":"corn_yield"},
      {"id":"farm_bill","label":"US Farm Bill Policy","type":"policy","impact":4,"correlation":0.30,"sector":"Legislation","parentId":"epa_waivers"},
      {"id":"saf_demand","label":"Sustainable Aviation Fuel","type":"macro","impact":3,"correlation":0.20,"sector":"Advanced Biofuels","parentId":"cellulosic"},
      {"id":"usd_eth","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.25,"sector":"Forex","parentId":"ethanol_exports"},
      {"id":"india_ethanol","label":"India Ethanol Program","type":"regional","impact":3,"correlation":0.18,"sector":"International Demand","parentId":"ethanol_exports"},
      {"id":"petrobras_eth","label":"Petrobras (PBR)","type":"producer","impact":3,"correlation":0.22,"sector":"Brazilian Energy","parentId":"brl_eth"},
      {"id":"crop_insurance","label":"Crop Insurance Payouts","type":"macro","impact":3,"correlation":0.20,"sector":"Agriculture","parentId":"drought_risk"},
      {"id":"cbot_corn","label":"CBOT Corn Spec Positioning","type":"index","impact":4,"correlation":0.32,"sector":"Futures","parentId":"corn_input"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Fuel ethanol is the single largest value-added use of US corn, consuming roughly 40% of the domestic crop to produce over 15 billion gallons annually. The Renewable Fuel Standard (RFS) mandates blending of 10-15% ethanol into the gasoline supply, creating a policy-driven floor under demand that ties agricultural markets directly to energy prices. The US is the world's largest ethanol producer, followed by Brazil, where sugarcane-based ethanol serves as a direct fuel substitute. Ethanol margins are primarily a function of the corn-to-ethanol crush spread -- the difference between ethanol selling prices and corn input costs -- making producers like Green Plains, Alto Ingredients, and ADM highly sensitive to movements in both commodity markets simultaneously.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Pure-play ethanol producers (GPRE, PEIX, REX) carry the most concentrated exposure, with margins collapsing when corn prices spike without corresponding ethanol price increases. ADM operates a diversified agricultural platform but remains the largest US ethanol producer by capacity. Refiners like Valero and Marathon Petroleum are major ethanol blenders and purchasers of RIN credits, making their compliance costs directly tied to ethanol market dynamics.

**Secondary -- Supply Chain and Processing:** The DDGS (dried distillers grains with solubles) co-product market is a critical revenue stream that offsets corn input costs. DDGS compete with soybean meal in livestock rations, linking ethanol economics to animal feed markets. Natural gas is the second-largest input cost for dry-mill ethanol plants, creating a dual energy-agriculture cost structure. The RIN credit market functions as a de facto subsidy mechanism, with Renewable Identification Number prices fluctuating based on EPA mandate volumes and small refinery exemptions.

**Tertiary -- Macro and Second-Order Effects:** Rising EV adoption poses a long-term structural threat to gasoline blending demand. California's LCFS carbon credit program provides incremental revenue for low-carbon ethanol producers. US ethanol exports to Canada, Brazil, and India create trade flow dynamics influenced by dollar strength and foreign biofuel mandates. Emerging sustainable aviation fuel (SAF) pathways could open a new demand channel for ethanol-to-jet conversion.

## Which Companies and ETFs Benefit When the Price Rises?

Ethanol producers benefit from widening crush spreads when corn prices decline relative to gasoline-linked ethanol prices. DDGS buyers in the livestock sector gain access to cheaper protein feed during periods of high ethanol production. Farm equipment manufacturers like Deere see increased corn acreage driven by ethanol demand pull. RIN credit holders profit when EPA maintains or increases blending mandates.

## Which Companies and Sectors Are Hurt by a Price Increase?

Ethanol producers face severe margin compression when corn prices surge due to drought or export demand while gasoline prices remain flat. Refiners without blending capacity must purchase RIN credits at elevated prices to meet compliance obligations, increasing operating costs. Livestock producers face higher feed costs when ethanol demand competes for corn supply. Long-term, the sector faces existential risk from declining gasoline consumption as electric vehicle penetration accelerates.

## What Should Traders Watch When Analyzing This Market?

The corn-ethanol crush spread is the primary profitability indicator for pure-play producers. Monitor weekly EIA ethanol production and inventory reports for supply signals, and USDA crop progress reports for corn yield expectations that drive input cost forecasts. RIN credit prices serve as a leading indicator of regulatory sentiment -- watch for EPA proposed rulemaking on annual blending volumes and small refinery exemption decisions. Seasonal patterns are pronounced, with production typically peaking ahead of summer driving season gasoline demand. Brazilian sugarcane harvest timing (April-November) creates periodic competition in export markets.
