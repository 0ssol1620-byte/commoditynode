---
layout: commodity
unit: "cents/lb"
image: "/assets/images/og-default.png"
title: "Soybean Oil"
description: "Soybean oil as a dual-use commodity bridging food markets and renewable diesel feedstock demand."
commodity_slug: "soybean-oil"
symbol: "ZL=F"
sector: "Agriculture"
etfs: ["SOYB", "DBA"]
companies: ["ADM", "BG", "GPRE"]
substitutes: ["Palm Oil", "Canola Oil", "Sunflower Oil"]
themes: ["Renewable Diesel", "Food Inflation"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "soybean_oil", "label": "Soybean Oil"},
  "levels": [
    {"nodes": [
      {"id":"soyb","label":"SOYB Soybean ETF","type":"etf","impact":8,"correlation":0.82,"sector":"Agriculture"},
      {"id":"dba_so","label":"DBA Agriculture ETF","type":"etf","impact":5,"correlation":0.45,"sector":"Agriculture"},
      {"id":"zl_index","label":"Soybean Oil Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"adm_so","label":"Archer-Daniels-Midland (ADM)","type":"processor","impact":7,"correlation":0.60,"sector":"Oilseed Processing"},
      {"id":"bg_so","label":"Bunge (BG)","type":"processor","impact":7,"correlation":0.58,"sector":"Oilseed Processing"},
      {"id":"gpre","label":"Green Plains (GPRE)","type":"producer","impact":6,"correlation":0.48,"sector":"Renewable Fuels"},
      {"id":"dino","label":"HF Sinclair (DINO)","type":"consumer","impact":5,"correlation":0.40,"sector":"Renewable Diesel"},
      {"id":"palm_sub","label":"Palm Oil (Substitute)","type":"substitute","impact":-6,"correlation":-0.55,"sector":"Vegetable Oils"},
      {"id":"canola_sub","label":"Canola Oil (Substitute)","type":"substitute","impact":-4,"correlation":-0.38,"sector":"Vegetable Oils"},
      {"id":"zs_link","label":"Soybean Futures (ZS=F)","type":"commodity","impact":8,"correlation":0.85,"sector":"Agriculture"},
      {"id":"rfs_policy","label":"RFS Biofuel Mandates","type":"policy","impact":7,"correlation":0.52,"sector":"Energy Policy"},
      {"id":"crush_spread","label":"Soybean Crush Spread","type":"index","impact":8,"correlation":0.75,"sector":"Processing Margins"}
    ]},
    {"nodes": [
      {"id":"ag_coop","label":"Ag Processing (AGP)","type":"processor","impact":6,"correlation":0.50,"sector":"Oilseed Processing","parentId":"adm_so"},
      {"id":"cag_so","label":"Conagra Brands (CAG)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Packaged Food","parentId":"adm_so"},
      {"id":"gis_so","label":"General Mills (GIS)","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Packaged Food","parentId":"bg_so"},
      {"id":"khc_so","label":"Kraft Heinz (KHC)","type":"consumer","impact":-3,"correlation":-0.18,"sector":"Packaged Food","parentId":"bg_so"},
      {"id":"mcd_so","label":"McDonald's (MCD)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"QSR","parentId":"adm_so"},
      {"id":"sm_meal","label":"Soybean Meal (ZM=F)","type":"commodity","impact":6,"correlation":0.70,"sector":"Animal Feed","parentId":"crush_spread"},
      {"id":"indo_palm","label":"Indonesian Palm Oil","type":"regional","impact":-5,"correlation":-0.48,"sector":"Supply","parentId":"palm_sub"},
      {"id":"malaysia_palm","label":"Malaysian Palm Oil","type":"regional","impact":-4,"correlation":-0.42,"sector":"Supply","parentId":"palm_sub"},
      {"id":"sunflower_sub","label":"Sunflower Oil (Substitute)","type":"substitute","impact":-3,"correlation":-0.30,"sector":"Vegetable Oils","parentId":"canola_sub"},
      {"id":"arg_soy","label":"Argentina Soy Production","type":"regional","impact":6,"correlation":0.48,"sector":"Supply","parentId":"zs_link"},
      {"id":"brl_so","label":"Brazilian Real (BRL)","type":"fx","impact":5,"correlation":0.42,"sector":"Forex","parentId":"zs_link"},
      {"id":"renvp_credit","label":"RIN Credit Market","type":"policy","impact":6,"correlation":0.45,"sector":"Renewable Credits","parentId":"rfs_policy"}
    ]},
    {"nodes": [
      {"id":"brazil_soy","label":"Brazil Soy Harvest","type":"regional","impact":7,"correlation":0.55,"sector":"Supply","parentId":"brl_so"},
      {"id":"la_nina_so","label":"La Niña Drought Risk","type":"macro","impact":6,"correlation":0.45,"sector":"Weather","parentId":"arg_soy"},
      {"id":"deforestation","label":"Amazon Deforestation Policy","type":"policy","impact":4,"correlation":0.28,"sector":"ESG","parentId":"brazil_soy"},
      {"id":"indo_export_ban","label":"Indonesia Export Restrictions","type":"policy","impact":-5,"correlation":-0.40,"sector":"Trade Policy","parentId":"indo_palm"},
      {"id":"china_crush","label":"China Crush Demand","type":"consumer","impact":7,"correlation":0.52,"sector":"Import Demand","parentId":"zl_index"},
      {"id":"epa_rvo","label":"EPA RVO Targets","type":"policy","impact":6,"correlation":0.42,"sector":"Regulation","parentId":"renvp_credit"},
      {"id":"used_cooking_oil","label":"Used Cooking Oil (UCO)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Feedstock","parentId":"dino"},
      {"id":"tallow_sub","label":"Animal Tallow Feedstock","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Feedstock","parentId":"gpre"},
      {"id":"fry_oil_demand","label":"Frying Oil Demand","type":"consumer","impact":4,"correlation":0.30,"sector":"Food Service","parentId":"mcd_so"},
      {"id":"dxy_so","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.38,"sector":"Forex","parentId":"brl_so"},
      {"id":"pork_feed","label":"Pork/Poultry Feed Demand","type":"consumer","impact":5,"correlation":0.38,"sector":"Animal Feed","parentId":"sm_meal"}
    ]},
    {"nodes": [
      {"id":"wasde_so","label":"USDA WASDE Report","type":"macro","impact":6,"correlation":0.45,"sector":"Data Release","parentId":"zl_index"},
      {"id":"il45q","label":"IRA Clean Fuel Credits","type":"policy","impact":5,"correlation":0.38,"sector":"Tax Policy","parentId":"epa_rvo"},
      {"id":"freight_so","label":"River Barge Freight","type":"freight","impact":3,"correlation":0.22,"sector":"Logistics","parentId":"brazil_soy"},
      {"id":"food_inflation_so","label":"Food CPI Inflation","type":"macro","impact":4,"correlation":0.30,"sector":"Consumer Prices","parentId":"fry_oil_demand"},
      {"id":"biod_eu","label":"EU Biodiesel Demand","type":"consumer","impact":4,"correlation":0.32,"sector":"Renewable Fuels","parentId":"epa_rvo"},
      {"id":"china_asf","label":"China ASF Herd Impact","type":"macro","impact":4,"correlation":0.28,"sector":"Demand Shock","parentId":"china_crush"},
      {"id":"crop_insurance","label":"US Crop Insurance","type":"policy","impact":3,"correlation":0.18,"sector":"Agriculture Policy","parentId":"wasde_so"},
      {"id":"nopa_crush","label":"NOPA Monthly Crush Data","type":"macro","impact":5,"correlation":0.40,"sector":"Data Release","parentId":"crush_spread"},
      {"id":"india_import","label":"India Edible Oil Imports","type":"regional","impact":4,"correlation":0.30,"sector":"Import Demand","parentId":"zl_index"},
      {"id":"saf_aviation","label":"Sustainable Aviation Fuel","type":"consumer","impact":4,"correlation":0.32,"sector":"Aviation Fuel","parentId":"il45q"},
      {"id":"glycerin","label":"Glycerin Byproduct","type":"commodity","impact":2,"correlation":0.15,"sector":"Byproducts","parentId":"dino"},
      {"id":"carinata","label":"Carinata (Alt Feedstock)","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Oilseed","parentId":"tallow_sub"},
      {"id":"pnnt_oil","label":"Peanut Oil (Substitute)","type":"substitute","impact":-2,"correlation":-0.12,"sector":"Vegetable Oils","parentId":"sunflower_sub"},
      {"id":"lcfs_ca","label":"CA LCFS Credits","type":"policy","impact":4,"correlation":0.30,"sector":"State Policy","parentId":"il45q"},
      {"id":"mississippi_barge","label":"Mississippi River Levels","type":"freight","impact":4,"correlation":0.28,"sector":"Logistics","parentId":"freight_so"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Soybean oil is the most consumed edible oil in the United States and the most consequential dual-use agricultural commodity in global markets. Produced as a co-product of the soybean crush alongside soybean meal, its pricing is shaped by both food demand and the rapidly expanding renewable diesel industry. The crush spread -- the margin between soybean prices and the combined value of oil and meal -- drives processor profitability for ADM, Bunge, and regional cooperatives. Since 2020, renewable diesel capacity buildouts have fundamentally shifted soybean oil demand, with biofuel consumption now rivaling food use in the United States. The Renewable Fuel Standard (RFS) and Inflation Reduction Act clean fuel credits create policy-driven demand that amplifies price volatility beyond traditional agricultural supply-demand fundamentals.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Oilseed Crushers and Renewable Diesel:** Archer-Daniels-Midland and Bunge operate the largest crushing networks and benefit directly from high crush margins. When soybean oil prices rise, crush margins typically expand, incentivizing greater soybean processing. Renewable diesel producers like HF Sinclair and Green Plains compete for soybean oil feedstock, creating a price floor that did not exist a decade ago. RIN credit values and EPA Renewable Volume Obligations directly influence the economics of soybean oil-to-diesel conversion.

**Secondary -- Substitute Oils and Food Industry:** Palm oil from Indonesia and Malaysia is the primary global substitute, and trade restrictions like Indonesia's periodic export bans create sharp soybean oil rallies. Canola and sunflower oil compete in food applications but lack the scale to fully offset soybean oil shortages. Food manufacturers including Conagra, General Mills, and Kraft Heinz face input cost pressure that flows through to consumer prices with a 3-6 month lag. QSR chains like McDonald's are major frying oil consumers with limited substitution flexibility.

**Tertiary -- Currency, Weather, and Policy:** The Brazilian real and Argentine peso significantly influence export competitiveness of South American soybeans. La Nina drought cycles in Argentina routinely disrupt global soybean oil supply, as the country is the top exporter of soy products. China's massive crush industry imports raw soybeans and processes them domestically, making Chinese demand a critical swing factor. IRA clean fuel tax credits and EPA regulatory decisions create binary policy risk events for the entire soybean oil complex.

## Which Companies and ETFs Benefit When the Price Rises?

Oilseed processors with integrated crush capacity -- ADM, Bunge, and AG Processing -- capture the most direct upside from soybean oil rallies through expanding crush margins. Renewable diesel producers benefit when policy support keeps biofuel blending mandates high. Brazilian and Argentine soybean farmers see windfall revenues during global supply tightness. Palm oil producers in Southeast Asia gain market share when soybean oil prices make palm a more competitive substitute in food applications.

## Which Companies and Sectors Are Hurt by a Price Increase?

Food manufacturers and restaurant chains absorb margin compression when soybean oil prices spike, as consumer resistance limits pass-through. Smaller independent frying oil distributors lack hedging sophistication and face acute margin pressure. Renewable diesel facilities face feedstock cost squeezes when soybean oil prices rise faster than RIN credit values or diesel prices. Livestock producers see higher feed costs through soybean meal price increases that accompany aggressive crush operations.

## What Should Traders Watch When Analyzing This Market?

The USDA WASDE report is the primary monthly catalyst for soybean oil positioning. Monitor the board crush margin (ZS vs. ZL + ZM) as the key indicator of processor economics and crushing incentives. The oil share -- soybean oil's percentage of total crush product value -- has risen dramatically with renewable diesel demand and serves as a structural indicator. RIN credit prices and EPA regulatory announcements create event-driven volatility. Indonesian palm oil export policy is the most impactful external supply shock to watch, and the CFTC commitment of traders report reveals speculative positioning extremes in ZL futures.
