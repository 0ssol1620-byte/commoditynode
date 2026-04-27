---
layout: commodity
unit: "$/mt"
image: "/assets/images/og-potash.png"
title: "Potash Price Impact: Crop Yields, Fertilizer Stocks & Agriculture"
description: "How potash (KCl) price movements ripple through fertilizer producers, agribusiness, and global food security."
commodity_slug: "potash"
symbol: "NTR"
data_type: "proxy"
sector: "Agriculture/Chemicals"
etfs: ["MOS", "MOO"]
companies: ["NTR", "MOS"]
substitutes: ["Organic Fertilizers", "Compost", "Nitrogen Fixation"]
themes: ["Food Security"]
tags: [potash, commodity analysis, fertilizer, food security]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "potash", "label": "Potash (KCl)"},
  "levels": [
    {"nodes": [
      {"id":"ntr","label":"Nutrien (NTR)","type":"producer","impact":9,"correlation":0.90,"sector":"Fertilizer"},
      {"id":"mos","label":"Mosaic Co (MOS)","type":"producer","impact":9,"correlation":0.88,"sector":"Fertilizer"},
      {"id":"ipi","label":"Intrepid Potash (IPI)","type":"producer","impact":11,"correlation":0.92,"sector":"Fertilizer"},
      {"id":"moo","label":"MOO Agribusiness ETF","type":"etf","impact":6,"correlation":0.65,"sector":"Agriculture"},
      {"id":"icl","label":"ICL Group (ICL)","type":"producer","impact":8,"correlation":0.82,"sector":"Fertilizer"},
      {"id":"ks","label":"K+S AG (SDF.DE)","type":"producer","impact":8,"correlation":0.80,"sector":"Fertilizer"},
      {"id":"de","label":"Deere & Co (DE)","type":"consumer","impact":5,"correlation":0.55,"sector":"Farm Equipment"},
      {"id":"agco","label":"AGCO Corp (AGCO)","type":"consumer","impact":5,"correlation":0.52,"sector":"Farm Equipment"},
      {"id":"cf","label":"CF Industries (CF)","type":"producer","impact":4,"correlation":0.45,"sector":"Nitrogen Fertilizer"},
      {"id":"dba","label":"DBA Agriculture ETF","type":"etf","impact":5,"correlation":0.50,"sector":"Commodities"},
      {"id":"sask_prod","label":"Saskatchewan Production","type":"regional","impact":10,"correlation":0.88,"sector":"Canadian Supply"},
      {"id":"phos_market","label":"Phosphate Market (DAP)","type":"commodity","impact":7,"correlation":0.72,"sector":"Fertilizer"},
      {"id":"corn_futures","label":"Corn Futures (ZC)","type":"commodity","impact":6,"correlation":0.58,"sector":"Grains"}
    ]},
    {"nodes": [
      {"id":"ura_potash","label":"Uralkali (Russia)","type":"regional","impact":9,"correlation":0.70,"sector":"Russian Supply","parentId":"sask_prod"},
      {"id":"bela_potash","label":"Belaruskali (Belarus)","type":"regional","impact":9,"correlation":0.68,"sector":"Belarus Supply","parentId":"sask_prod"},
      {"id":"adm","label":"Archer-Daniels (ADM)","type":"consumer","impact":4,"correlation":0.42,"sector":"Agribusiness","parentId":"moo"},
      {"id":"bunge","label":"Bunge Global (BG)","type":"consumer","impact":4,"correlation":0.40,"sector":"Agribusiness","parentId":"moo"},
      {"id":"fmc","label":"FMC Corp (FMC)","type":"supplier","impact":4,"correlation":0.38,"sector":"Crop Chemicals","parentId":"moo"},
      {"id":"cnhi","label":"CNH Industrial (CNHI)","type":"consumer","impact":4,"correlation":0.48,"sector":"Farm Equipment","parentId":"de"},
      {"id":"ctva","label":"Corteva (CTVA)","type":"supplier","impact":5,"correlation":0.45,"sector":"Crop Inputs","parentId":"cf"},
      {"id":"wheat_futures","label":"Wheat Futures (ZW)","type":"commodity","impact":5,"correlation":0.52,"sector":"Grains","parentId":"corn_futures"},
      {"id":"soy_futures","label":"Soybean Futures (ZS)","type":"commodity","impact":5,"correlation":0.50,"sector":"Grains","parentId":"corn_futures"},
      {"id":"phosphate_rock","label":"Phosphate Rock","type":"commodity","impact":6,"correlation":0.68,"sector":"Mining","parentId":"phos_market"},
      {"id":"mos_phos","label":"Mosaic Phosphate Ops","type":"producer","impact":7,"correlation":0.75,"sector":"Phosphate","parentId":"phos_market"},
      {"id":"natgas_feed","label":"Natural Gas Feedstock","type":"commodity","impact":4,"correlation":0.35,"sector":"Energy","parentId":"cf"}
    ]},
    {"nodes": [
      {"id":"sanctions","label":"Russia/Belarus Sanctions","type":"policy","impact":10,"correlation":0.60,"sector":"Geopolitics","parentId":"ura_potash"},
      {"id":"rail_transport","label":"CN Rail / CP Kansas (CP)","type":"freight","impact":5,"correlation":0.40,"sector":"Rail Transport","parentId":"sask_prod"},
      {"id":"food_inflation","label":"Food CPI Index","type":"macro","impact":-6,"correlation":-0.50,"sector":"Macro","parentId":"wheat_futures"},
      {"id":"brazil_demand","label":"Brazil Ag Demand","type":"regional","impact":7,"correlation":0.62,"sector":"LatAm","parentId":"bunge"},
      {"id":"india_subsidy","label":"India Fertilizer Subsidy","type":"policy","impact":6,"correlation":0.45,"sector":"Gov Policy","parentId":"icl"},
      {"id":"africa_food","label":"Africa Food Security","type":"macro","impact":-5,"correlation":-0.35,"sector":"Developing Nations","parentId":"food_inflation"},
      {"id":"farm_income","label":"US Farm Income Index","type":"macro","impact":5,"correlation":0.48,"sector":"Agriculture","parentId":"adm"},
      {"id":"cad_potash","label":"Canadian Dollar (CAD)","type":"fx","impact":4,"correlation":0.42,"sector":"Forex","parentId":"sask_prod"},
      {"id":"brl_fx","label":"Brazilian Real (BRL)","type":"fx","impact":4,"correlation":0.38,"sector":"Forex","parentId":"brazil_demand"},
      {"id":"port_vancouver","label":"Port of Vancouver","type":"freight","impact":5,"correlation":0.35,"sector":"Shipping","parentId":"rail_transport"},
      {"id":"organic_fert","label":"Organic Fertilizers","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Alternatives","parentId":"ctva"}
    ]},
    {"nodes": [
      {"id":"china_import","label":"China Potash Imports","type":"regional","impact":7,"correlation":0.55,"sector":"Asian Demand","parentId":"sanctions"},
      {"id":"global_crop_yield","label":"Global Crop Yields","type":"macro","impact":-7,"correlation":-0.45,"sector":"Food Production","parentId":"food_inflation"},
      {"id":"fao_index","label":"FAO Food Price Index","type":"index","impact":6,"correlation":0.50,"sector":"Global Food","parentId":"food_inflation"},
      {"id":"compost_sub","label":"Compost (Substitute)","type":"substitute","impact":-2,"correlation":-0.10,"sector":"Alternatives","parentId":"organic_fert"},
      {"id":"nitrogen_fix","label":"Nitrogen Fixation","type":"substitute","impact":-2,"correlation":-0.12,"sector":"Biotech","parentId":"organic_fert"},
      {"id":"wto_trade","label":"WTO Ag Trade Rules","type":"policy","impact":3,"correlation":0.25,"sector":"Trade Policy","parentId":"china_import"},
      {"id":"usd_potash","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.40,"sector":"Forex","parentId":"cad_potash"},
      {"id":"ocean_freight","label":"Dry Bulk Freight (BDI)","type":"freight","impact":4,"correlation":0.32,"sector":"Shipping","parentId":"port_vancouver"},
      {"id":"crop_insurance","label":"US Crop Insurance","type":"policy","impact":3,"correlation":0.28,"sector":"Gov Policy","parentId":"farm_income"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Potash (potassium chloride, KCl) is one of three essential macronutrients for crop production -- there is no substitute for the potassium it delivers to plant biology. Global production is concentrated in Saskatchewan, Canada (Nutrien, Mosaic) and the former Soviet bloc (Uralkali in Russia, Belaruskali in Belarus), making supply acutely sensitive to geopolitical disruption. A **+10% move in potash prices** drives an average **+8.5% response in IPI** and **+7% in NTR and MOS**. Annual global potash demand exceeds 70 million tonnes, with Brazil, China, India, and the United States as the largest importers. The 2022 Russia-Belarus sanctions removed roughly 40% of global export capacity from freely tradable markets, triggering a price spike that tripled benchmark potash from $230/tonne to over $700/tonne before normalizing.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Nutrien operates the world's largest potash mines in Saskatchewan and controls roughly 20% of global capacity. Mosaic and Intrepid Potash provide additional North American supply. ICL and K+S serve European and specialty markets. These producers have significant operating leverage -- marginal costs sit near $120-150/tonne, so price moves above that threshold flow almost entirely to earnings. Farm equipment makers like Deere and AGCO see indirect benefit: higher crop prices driven by fertilizer scarcity incentivize acreage expansion and equipment investment.

**Secondary -- Supply Chain and Processing:** Phosphate markets move in sympathy with potash because farmers purchase blended NPK fertilizers -- a spike in one component often pulls up the others. Crop input distributors (Corteva, FMC) reprice their product bundles accordingly. Rail transport is critical: Canadian Pacific Kansas City and CN Rail haul potash from Saskatchewan mines to Pacific coast terminals for export, making rail capacity a bottleneck during demand surges. Brazil imports over 95% of its potash needs, creating outsized exposure for agribusiness firms like Bunge and ADM that depend on Brazilian crop economics.

**Tertiary -- Macro and Second-Order Effects:** Potash price spikes feed directly into food inflation with an 8-12 month lag as higher fertilizer costs translate to reduced application rates, lower crop yields, and eventually higher grain prices. The FAO Food Price Index has shown 0.50 correlation to potash prices over rolling 12-month periods. Developing nations in Africa and South Asia face acute food security risk when potash becomes unaffordable. India's fertilizer subsidy program, which costs the government $20+ billion annually, balloons during potash rallies, straining fiscal balances.

## Which Companies and ETFs Benefit When the Price Rises?

Potash producers with low-cost Saskatchewan or Dead Sea operations benefit most from price rallies, particularly Nutrien and ICL with their vertically integrated retail distribution. Canadian rail operators see volume growth and pricing power. Nations with domestic potash reserves (Canada, Israel, Jordan) gain strategic trade leverage. Organic fertilizer companies attract investment as conventional fertilizer costs spike.

## Which Companies and Sectors Are Hurt by a Price Increase?

Farmers in import-dependent nations face margin compression when potash prices rise, particularly in Brazil, India, and Sub-Saharan Africa. Food consumers globally bear the downstream cost through higher grain and protein prices. Crop input distributors face demand destruction as farmers reduce application rates. Countries reliant on Russian and Belarusian potash (much of Southeast Asia and Latin America) face acute supply disruption during sanctions regimes.

## What Should Traders Watch When Analyzing This Market?

The NTR-to-corn ratio provides a mean-reverting signal: when NTR outperforms corn futures by more than 1.5 standard deviations, fertilizer producers are overpriced relative to crop economics and tend to revert. The MOS/NTR pair trade offers exposure to phosphate-vs-potash dynamics. Quarterly USDA planted acreage reports and Brazilian Conab crop surveys are the primary demand catalysts. Watch Canpotex (the Canadian export cartel) contract negotiations with China and India -- these benchmark deals set global potash pricing for six-month periods and often move the entire fertilizer complex.
