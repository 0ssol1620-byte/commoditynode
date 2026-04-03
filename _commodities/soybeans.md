---
layout: commodity
unit: "cents/bushel"
image: "/assets/images/og-soybeans.png"
title: "Soybeans"
description: "Soybean crush economics and the US-Brazil-China trade triangle that drives global pricing."
commodity_slug: "soybeans"
symbol: "ZS=F"
sector: "Agriculture"
etfs: ["SOYB"]
companies: ["ADM", "BG", "CTVA", "MOS"]
substitutes: ["Canola", "Sunflower", "Palm Oil"]
themes: ["Food Inflation"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "soybeans", "label": "Soybeans (CBOT)"},
  "levels": [
    {"nodes": [
      {"id":"soyb","label":"SOYB Soybean Fund","type":"etf","impact":9,"correlation":0.90,"sector":"Agriculture"},
      {"id":"adm_sy","label":"Archer Daniels (ADM)","type":"processor","impact":6,"correlation":0.55,"sector":"Ag Processing"},
      {"id":"bg_sy","label":"Bunge (BG)","type":"processor","impact":7,"correlation":0.60,"sector":"Ag Processing"},
      {"id":"ctva_sy","label":"Corteva (CTVA)","type":"supplier","impact":5,"correlation":0.45,"sector":"Ag Inputs"},
      {"id":"mos_sy","label":"Mosaic (MOS)","type":"supplier","impact":5,"correlation":0.42,"sector":"Fertilizers"},
      {"id":"soy_index","label":"Soybean Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"tsn_sy","label":"Tyson Foods (TSN)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Meat/Poultry"},
      {"id":"ppc_sy","label":"Pilgrim's Pride (PPC)","type":"consumer","impact":-4,"correlation":-0.40,"sector":"Poultry"},
      {"id":"de_sy","label":"Deere & Co (DE)","type":"supplier","impact":5,"correlation":0.45,"sector":"Farm Equipment"},
      {"id":"agco_sy","label":"AGCO Corp (AGCO)","type":"supplier","impact":4,"correlation":0.38,"sector":"Farm Equipment"},
      {"id":"dba","label":"DBA Agriculture ETF","type":"etf","impact":6,"correlation":0.60,"sector":"Agriculture"},
      {"id":"cf_sy","label":"CF Industries (CF)","type":"supplier","impact":4,"correlation":0.35,"sector":"Fertilizers"}
    ]},
    {"nodes": [
      {"id":"hrl_sy","label":"Hormel Foods (HRL)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Meat","parentId":"tsn_sy"},
      {"id":"cal_maine","label":"Cal-Maine Foods (CALM)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Eggs","parentId":"ppc_sy"},
      {"id":"soy_oil","label":"Soybean Oil Market","type":"commodity","impact":8,"correlation":0.85,"sector":"Vegetable Oil","parentId":"soy_index"},
      {"id":"soy_meal","label":"Soybean Meal Market","type":"commodity","impact":9,"correlation":0.90,"sector":"Animal Feed","parentId":"soy_index"},
      {"id":"ntr_sy","label":"Nutrien (NTR)","type":"supplier","impact":4,"correlation":0.35,"sector":"Fertilizers","parentId":"mos_sy"},
      {"id":"fmc_sy","label":"FMC Corp (FMC)","type":"supplier","impact":3,"correlation":0.28,"sector":"Crop Protection","parentId":"ctva_sy"},
      {"id":"cnhi","label":"CNH Industrial (CNHI)","type":"supplier","impact":4,"correlation":0.32,"sector":"Farm Equipment","parentId":"de_sy"},
      {"id":"biodiesel_sy","label":"Biodiesel Demand","type":"consumer","impact":4,"correlation":0.35,"sector":"Biofuels","parentId":"soy_oil"},
      {"id":"cargill","label":"Cargill (Private)","type":"processor","impact":5,"correlation":0.45,"sector":"Ag Processing","parentId":"adm_sy"},
      {"id":"ingr","label":"Ingredion (INGR)","type":"processor","impact":3,"correlation":0.25,"sector":"Food Ingredients","parentId":"bg_sy"},
      {"id":"corn_related","label":"Corn (Related)","type":"commodity","impact":6,"correlation":0.70,"sector":"Grains","parentId":"soy_index"},
      {"id":"wheat_related","label":"Wheat (Related)","type":"commodity","impact":4,"correlation":0.45,"sector":"Grains","parentId":"soy_index"}
    ]},
    {"nodes": [
      {"id":"china_import_sy","label":"China Soybean Imports","type":"macro","impact":8,"correlation":0.60,"sector":"Demand","parentId":"soy_index"},
      {"id":"brl_sy","label":"Brazilian Real (BRL)","type":"fx","impact":5,"correlation":0.45,"sector":"Forex","parentId":"bg_sy"},
      {"id":"dxy_sy","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.40,"sector":"Forex","parentId":"soy_index"},
      {"id":"ars_sy","label":"Argentine Peso (ARS)","type":"fx","impact":4,"correlation":0.30,"sector":"Forex","parentId":"soy_index"},
      {"id":"la_nina_sy","label":"La Niña Weather","type":"macro","impact":6,"correlation":0.45,"sector":"Weather","parentId":"soy_index"},
      {"id":"us_planting","label":"US Planting Intentions","type":"macro","impact":7,"correlation":0.55,"sector":"Supply","parentId":"soy_index"},
      {"id":"trade_war","label":"US-China Trade Tension","type":"policy","impact":-6,"correlation":-0.48,"sector":"Trade Policy","parentId":"china_import_sy"},
      {"id":"rfs_mandate","label":"Renewable Fuel Standard","type":"policy","impact":4,"correlation":0.32,"sector":"Biofuel Policy","parentId":"biodiesel_sy"},
      {"id":"palm_oil_sub","label":"Palm Oil (Substitute)","type":"substitute","impact":-4,"correlation":-0.35,"sector":"Vegetable Oil","parentId":"soy_oil"},
      {"id":"canola_sub","label":"Canola (Substitute)","type":"substitute","impact":-3,"correlation":-0.28,"sector":"Vegetable Oil","parentId":"soy_oil"},
      {"id":"livestock_cycle","label":"Livestock Cycle","type":"macro","impact":5,"correlation":0.40,"sector":"Animal Feed","parentId":"soy_meal"}
    ]},
    {"nodes": [
      {"id":"usda_report","label":"USDA WASDE Report","type":"macro","impact":7,"correlation":0.55,"sector":"Data Release","parentId":"us_planting"},
      {"id":"brazil_harvest_sy","label":"Brazil Safrinha Harvest","type":"regional","impact":6,"correlation":0.48,"sector":"Supply","parentId":"brl_sy"},
      {"id":"argentina_export","label":"Argentina Export Tax","type":"policy","impact":5,"correlation":0.40,"sector":"Trade Policy","parentId":"ars_sy"},
      {"id":"crush_margin","label":"Soy Crush Margin","type":"macro","impact":6,"correlation":0.50,"sector":"Processing","parentId":"adm_sy"},
      {"id":"hog_cycle","label":"Chinese Hog Cycle","type":"macro","impact":5,"correlation":0.40,"sector":"Demand","parentId":"china_import_sy"},
      {"id":"deforestation","label":"Deforestation Policy","type":"policy","impact":4,"correlation":0.30,"sector":"ESG","parentId":"brazil_harvest_sy"},
      {"id":"protein_transition","label":"Plant Protein Demand","type":"macro","impact":3,"correlation":0.22,"sector":"Food Trends","parentId":"ingr"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Soybeans are the world's most important oilseed, processed into two high-value products: soybean meal (livestock feed, 65-70% of crush value) and soybean oil (cooking oil, biodiesel feedstock, 30-35% of crush value). The U.S. and Brazil are the two largest producers, and their alternating growing seasons create a year-round global supply cycle. China imports 60%+ of globally traded soybeans, making Chinese crush demand and trade policy the dominant price driver. Global production exceeds 380 million tonnes annually, with Brazil having surpassed the U.S. as the world's top producer.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** ADM, Bunge, and Cargill operate massive soybean crushing facilities where gross processing margins (the "crush spread") determine profitability. When crush margins exceed $2/bushel, processing capacity utilization reaches 95%+ and soybean demand accelerates. Soybean meal flows into poultry, hog, and cattle feed rations, linking soy prices directly to global protein consumption growth. Brazilian crushers (Amaggi, Cosan) are expanding capacity to capture domestic processing value.

**Secondary -- Supply Chain and Processing:** Soybean oil has become a premium feedstock for renewable diesel production, creating a structural demand shift that has elevated soy oil prices relative to historical norms. The Renewable Fuel Standard (RFS) blending mandates and state-level clean fuel programs (California LCFS) provide policy support for soy-based biofuel demand. Corteva Agriscience develops high-oleic soybean varieties optimized for biodiesel conversion. River barge logistics on the Mississippi and Parana (Brazil) waterways are critical transportation links where drought or flooding disrupts export flows.

**Tertiary -- Macro and Second-Order Effects:** Soybean yields depend heavily on phosphate and potash fertilizer applications. Mosaic and Nutrien supply these inputs, creating a cost linkage between fertilizer prices and soybean production economics. Soybeans fix atmospheric nitrogen through root nodules, requiring less nitrogen fertilizer than corn -- this biological advantage influences crop rotation decisions when nitrogen fertilizer prices spike. U.S.-China trade relations remain a persistent risk factor, as tariff escalation can redirect global soybean trade flows within months.

## Which Companies and ETFs Benefit When the Price Rises?

U.S. and Brazilian soybean farmers capture direct price upside from rallies. Grain traders and processors (ADM, Bunge) benefit from elevated volumes and widening crush margins. Equipment manufacturers (Deere, AGCO) see increased capital spending by profitable farmers. Farmland values appreciate as crop revenues support higher rental rates and purchase prices. Argentine soybean exporters benefit from higher export tax revenues during price rallies.

## Which Companies and Sectors Are Hurt by a Price Increase?

Livestock producers face rising feed costs, with soybean meal representing the primary protein source in animal rations. Poultry integrators (Tyson, Pilgrim's Pride) and hog producers absorb feed cost inflation. Food manufacturers using soybean oil face cooking oil cost increases. Chinese crush operations face margin pressure when import costs rise. Consumers pay higher prices for meat, cooking oil, and processed foods containing soy-derived ingredients.

## What Should Traders Watch When Analyzing This Market?

The USDA WASDE (World Agricultural Supply and Demand Estimates) report, released monthly, is the single most important fundamental catalyst for soybean prices. The corn/soybean ratio drives U.S. planting decisions: when soybeans are relatively expensive (ratio below 2.3), farmers shift acreage from corn to soybeans. Monitor Brazil's safrinha (second-crop) planting progress, Chinese crush margins, and the CBOT November/March calendar spread for forward supply expectations. La Nina conditions typically benefit U.S. soybean yields while stressing South American production. Weekly export inspections data confirms whether international demand is meeting USDA projections.
