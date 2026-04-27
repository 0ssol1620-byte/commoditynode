---
layout: commodity
unit: "$/mt"
title: "Phosphate Price Impact: Fertilizers & Food Security"
description: "How phosphate rock prices cascade through fertilizer production, agricultural costs, and food security with Morocco controlling 70%+ of global reserves."
commodity_slug: "phosphate"
symbol: "MOS"
data_type: "proxy"
sector: "Agriculture/Fertilizer"
etfs: ["MOO", "DBA"]
companies: ["MOS", "NTR"]
substitutes: ["Organic Fertilizers", "Precision Agriculture"]
themes: ["Food Security", "Geopolitical Risk"]
tags: ["phosphate", "fertilizer", "NPK", "food security", "morocco", "OCP", "phosphoric acid", "agriculture"]
image: /assets/images/og-phosphate.png
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "phosphate", "label": "Phosphate Rock"},
  "levels": [
    {"nodes": [
      {"id":"phos_price","label":"Phosphate Rock Price","type":"index","impact":10,"correlation":0.99,"sector":"Fertilizer Minerals"},
      {"id":"dap_price","label":"DAP Fertilizer Price","type":"index","impact":9,"correlation":0.88,"sector":"Fertilizers"},
      {"id":"moo_phos","label":"MOO Agribusiness ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Agriculture"},
      {"id":"dba_phos","label":"DBA Agriculture ETF","type":"etf","impact":3,"correlation":0.25,"sector":"Agricultural Commodities"},
      {"id":"ocp_phos","label":"OCP Group (Morocco)","type":"producer","impact":10,"correlation":0.85,"sector":"Phosphate Mining"},
      {"id":"mos_phos","label":"Mosaic Company (MOS)","type":"producer","impact":8,"correlation":0.72,"sector":"Phosphate/Potash"},
      {"id":"ntr_phos","label":"Nutrien (NTR)","type":"producer","impact":7,"correlation":0.60,"sector":"Fertilizers"},
      {"id":"icl_phos","label":"ICL Group (ICL)","type":"producer","impact":7,"correlation":0.58,"sector":"Specialty Fertilizers"},
      {"id":"phosagro","label":"PhosAgro (Russia)","type":"producer","impact":7,"correlation":0.55,"sector":"Phosphate Fertilizer"},
      {"id":"cf_phos","label":"CF Industries (CF)","type":"consumer","impact":3,"correlation":0.25,"sector":"Nitrogen Fertilizer"}
    ]},
    {"nodes": [
      {"id":"dap_mfg","label":"DAP/MAP Manufacturing","type":"processor","impact":-6,"correlation":-0.50,"sector":"Fertilizer Production","parentId":"mos_phos"},
      {"id":"phosphoric_acid","label":"Phosphoric Acid Market","type":"processor","impact":8,"correlation":0.68,"sector":"Chemical Intermediate","parentId":"ocp_phos"},
      {"id":"india_fert","label":"India Fertilizer Demand","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Agriculture","parentId":"dap_price"},
      {"id":"brazil_fert","label":"Brazil Fertilizer Import","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Agriculture","parentId":"dap_price"},
      {"id":"china_phos","label":"China Phosphate (Yunnan/Guizhou)","type":"producer","impact":7,"correlation":0.58,"sector":"Phosphate Mining","parentId":"phos_price"},
      {"id":"jordan_phos","label":"Jordan Phosphate Mines (JPMC)","type":"producer","impact":5,"correlation":0.42,"sector":"Phosphate Mining","parentId":"phos_price"},
      {"id":"saudi_maaden","label":"Ma'aden (Saudi Arabia)","type":"producer","impact":6,"correlation":0.48,"sector":"Phosphate/Aluminum","parentId":"phos_price"},
      {"id":"jbs_phos","label":"JBS / Cargill (Ag Users)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Food Production","parentId":"moo_phos"},
      {"id":"deere_phos","label":"Deere & Co (DE)","type":"consumer","impact":2,"correlation":0.15,"sector":"Farm Equipment","parentId":"moo_phos"},
      {"id":"battery_lfp","label":"LFP Battery Demand","type":"consumer","impact":3,"correlation":0.22,"sector":"Energy Storage","parentId":"phosphoric_acid"}
    ]},
    {"nodes": [
      {"id":"food_inflation","label":"Global Food Inflation","type":"macro","impact":6,"correlation":0.50,"sector":"Economics","parentId":"dap_price"},
      {"id":"organic_sub","label":"Organic Fertilizer (Sub)","type":"substitute","impact":-2,"correlation":-0.10,"sector":"Sustainable Ag","parentId":"dap_mfg"},
      {"id":"precision_ag","label":"Precision Ag / Variable Rate","type":"substitute","impact":-3,"correlation":-0.18,"sector":"AgTech","parentId":"dap_mfg"},
      {"id":"china_export_tax","label":"China Phosphate Export Tax","type":"policy","impact":7,"correlation":0.55,"sector":"Trade Policy","parentId":"china_phos"},
      {"id":"india_subsidy","label":"India Fertilizer Subsidy","type":"policy","impact":5,"correlation":0.38,"sector":"Fiscal Policy","parentId":"india_fert"},
      {"id":"dxy_phos","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.28,"sector":"Forex","parentId":"phos_price"},
      {"id":"mad_phos","label":"Moroccan Dirham (MAD)","type":"fx","impact":3,"correlation":0.22,"sector":"Forex","parentId":"ocp_phos"},
      {"id":"peak_phos","label":"Peak Phosphorus Debate","type":"macro","impact":3,"correlation":0.20,"sector":"Resource Depletion","parentId":"ocp_phos"},
      {"id":"sulfur_link","label":"Sulfur Price (Input)","type":"commodity","impact":-5,"correlation":-0.40,"sector":"Chemical Input","parentId":"phosphoric_acid"},
      {"id":"potash_rel","label":"Potash Price (Related)","type":"commodity","impact":6,"correlation":0.55,"sector":"Fertilizers","parentId":"ntr_phos"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Phosphate rock is one of the three essential plant macronutrients (N-P-K) with no substitute in agriculture — without phosphorus, crops simply cannot grow. Morocco's OCP Group controls roughly 70% of global economically recoverable phosphate reserves, creating the most extreme single-country resource concentration of any major commodity. Annual global phosphate rock production is approximately 220 million tonnes. Phosphate rock is processed into phosphoric acid, which is then used to manufacture DAP (diammonium phosphate) and MAP (monoammonium phosphate) fertilizers. Unlike nitrogen fertilizers (derived from natural gas) or potash (mined as KCl), phosphate supply is geologically constrained with no synthetic production pathway. The "peak phosphorus" debate — whether economically recoverable reserves will be depleted within 100-300 years — adds a long-term scarcity premium. China, the world's second-largest producer, periodically imposes export restrictions to prioritize domestic food security.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary — Global Fertilizer Supply Chain:** Phosphate rock → phosphoric acid → DAP/MAP represents a concentrated processing chain. OCP (Morocco), Mosaic (U.S.), Nutrien (Canada), ICL (Israel), and PhosAgro (Russia) control the majority of global phosphate fertilizer trade. India and Brazil are the world's largest importers, making their agricultural sectors directly exposed to phosphate price volatility.

**Secondary — Food Security and Agricultural Economics:** Fertilizer represents 15-30% of crop input costs depending on region and crop type. Phosphate price spikes directly inflate food production costs, which cascade through grain prices, livestock feed costs, and ultimately consumer food inflation. The 2021-2022 fertilizer crisis (driven by energy prices, Russia sanctions, and China export curbs) demonstrated how phosphate disruption translates to food insecurity in developing nations.

**Tertiary — Emerging Demand and Resource Scarcity:** LFP (lithium iron phosphate) battery chemistry is creating new demand for phosphoric acid outside traditional fertilizer markets. Precision agriculture and variable-rate application technology can reduce phosphate fertilizer use per hectare by 15-25%, acting as a demand-side efficiency substitute. The finite nature of phosphate reserves drives long-term strategic positioning by Morocco and resource-importing nations.

## Which Companies and ETFs Benefit When the Price Rises?

OCP Group benefits from monopolistic reserve control and is investing $13B+ in capacity expansion to capture growing African and Asian demand. Mosaic (MOS) leverages integrated phosphate mining and fertilizer production in Florida and Brazil. Nutrien benefits from phosphate diversification alongside potash and nitrogen. Ma'aden (Saudi Arabia) captures Middle Eastern demand growth through its Wa'ad Al Shamaal phosphate complex. LFP battery growth creates incremental phosphoric acid demand outside the fertilizer cycle.

## Which Companies and Sectors Are Hurt by a Price Increase?

Fertilizer importing nations (India, Brazil, Southeast Asia, Sub-Saharan Africa) bear direct cost inflation with limited domestic alternatives. Smallholder farmers in developing countries face affordability crises during price spikes, reducing application rates and crop yields. Food companies and livestock producers absorb higher feed costs. Countries dependent on Chinese phosphate imports face supply uncertainty during export restriction periods.

## What Should Traders Watch When Analyzing This Market?

Phosphate rock is traded via CRU and Argus price assessments, with DAP/MAP futures available on CME. Mosaic (MOS) is the most liquid equity proxy for phosphate exposure. Monitor China's MOFCOM phosphate export tariff and quota announcements — any restriction immediately tightens seaborne supply. Track India's fertilizer subsidy budget allocations as a demand-side price support indicator. OCP's production and export data (published quarterly) provides supply-side visibility. The DAP-phosphate rock spread indicates processing margin health. Watch global grain prices (corn, soybeans, wheat) as a leading indicator for farmer fertilizer purchasing power and application rates. Sulfur price movements matter — sulfuric acid is the key input for phosphoric acid production, so sulfur spikes compress phosphate processor margins.
