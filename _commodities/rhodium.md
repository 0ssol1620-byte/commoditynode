---
layout: commodity
unit: "$/oz"
image: "/assets/images/og-rhodium.png"
title: "Rhodium Price Impact: Catalytic Converters & PGM Supply"
description: "Rhodium's extreme scarcity, catalytic converter dominance, and South African supply concentration."
commodity_slug: "rhodium"
symbol: "SBSW"
data_type: "proxy"
sector: "Metals/Auto"
etfs: ["PPLT", "SPPP"]
companies: ["SBSW", "IMPUY", "ANGPY"]
substitutes: ["Palladium", "Platinum", "Catalytic Alternatives"]
themes: ["Carbon Transition", "Supply Chain Disruption"]
tags: [rhodium, pgm, catalytic converters, south africa, emissions, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "rhodium", "label": "Rhodium"},
  "levels": [
    {"nodes": [
      {"id":"sbsw_rh","label":"Sibanye-Stillwater (SBSW)","type":"producer","impact":9,"correlation":0.82,"sector":"PGM Mining"},
      {"id":"impuy_rh","label":"Impala Platinum (IMPUY)","type":"producer","impact":8,"correlation":0.75,"sector":"PGM Mining"},
      {"id":"angpy_rh","label":"Anglo American Platinum (ANGPY)","type":"producer","impact":8,"correlation":0.73,"sector":"PGM Mining"},
      {"id":"pplt_rh","label":"PPLT Platinum ETF","type":"etf","impact":5,"correlation":0.55,"sector":"Precious Metals"},
      {"id":"sppp_rh","label":"SPPP PGM ETF","type":"etf","impact":6,"correlation":0.60,"sector":"Precious Metals"},
      {"id":"rh_index","label":"Rhodium Spot Price","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"gm_rh","label":"General Motors (GM)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Automotive"},
      {"id":"f_rh","label":"Ford Motor (F)","type":"consumer","impact":-4,"correlation":-0.28,"sector":"Automotive"},
      {"id":"tm_rh","label":"Toyota Motor (TM)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Automotive"},
      {"id":"stla_rh","label":"Stellantis (STLA)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Automotive"},
      {"id":"palladium_rh","label":"Palladium (Related)","type":"commodity","impact":7,"correlation":0.68,"sector":"PGM"},
      {"id":"platinum_rh","label":"Platinum (Related)","type":"commodity","impact":6,"correlation":0.58,"sector":"PGM"},
      {"id":"zar_rh","label":"South African Rand (ZAR)","type":"fx","impact":-5,"correlation":-0.45,"sector":"Forex"}
    ]},
    {"nodes": [
      {"id":"cat_conv","label":"Catalytic Converter Mfg","type":"processor","impact":-5,"correlation":-0.35,"sector":"Auto Parts","parentId":"gm_rh"},
      {"id":"bwxt_rh","label":"BWX Technologies (BWXT)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Industrial","parentId":"rh_index"},
      {"id":"aptv_rh","label":"Aptiv (APTV)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Auto Parts","parentId":"f_rh"},
      {"id":"eskom_rh","label":"Eskom Power Risk","type":"macro","impact":6,"correlation":0.42,"sector":"South Africa","parentId":"sbsw_rh"},
      {"id":"sa_labor","label":"SA Mining Labor Risk","type":"policy","impact":5,"correlation":0.38,"sector":"Labor","parentId":"impuy_rh"},
      {"id":"recyclers_rh","label":"PGM Recyclers","type":"processor","impact":-4,"correlation":-0.30,"sector":"Recycling","parentId":"rh_index"},
      {"id":"dxy_rh","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.40,"sector":"Forex","parentId":"zar_rh"},
      {"id":"ev_threat","label":"EV Substitution Threat","type":"substitute","impact":-6,"correlation":-0.42,"sector":"EV","parentId":"gm_rh"},
      {"id":"nornickel_rh","label":"Nornickel (NILSY)","type":"producer","impact":4,"correlation":0.30,"sector":"PGM Mining","parentId":"palladium_rh"},
      {"id":"pd_sub","label":"Palladium Substitution","type":"substitute","impact":-5,"correlation":-0.38,"sector":"PGM","parentId":"palladium_rh"},
      {"id":"pt_sub","label":"Platinum Substitution","type":"substitute","impact":-4,"correlation":-0.32,"sector":"PGM","parentId":"platinum_rh"},
      {"id":"glass_rh","label":"Glass Industry Demand","type":"consumer","impact":3,"correlation":0.22,"sector":"Industrial","parentId":"rh_index"}
    ]},
    {"nodes": [
      {"id":"euro7","label":"Euro 7 Emissions Standards","type":"policy","impact":5,"correlation":0.35,"sector":"Regulation","parentId":"cat_conv"},
      {"id":"china_vi","label":"China VI-b Standards","type":"policy","impact":5,"correlation":0.33,"sector":"Regulation","parentId":"cat_conv"},
      {"id":"cat_theft","label":"Catalytic Converter Theft","type":"macro","impact":3,"correlation":0.20,"sector":"Crime/Recycling","parentId":"recyclers_rh"},
      {"id":"bushveld","label":"Bushveld Complex Geology","type":"regional","impact":7,"correlation":0.50,"sector":"Mining","parentId":"sbsw_rh"},
      {"id":"tsla_ev","label":"Tesla EV Growth (TSLA)","type":"substitute","impact":-5,"correlation":-0.35,"sector":"EV","parentId":"ev_threat"},
      {"id":"hyundai_fcev","label":"Hyundai FCEV (HYMTF)","type":"consumer","impact":2,"correlation":0.15,"sector":"Fuel Cell","parentId":"platinum_rh"},
      {"id":"sa_grid","label":"SA Load-Shedding","type":"macro","impact":5,"correlation":0.38,"sector":"Energy","parentId":"eskom_rh"},
      {"id":"pgm_basket","label":"PGM Basket Price","type":"index","impact":8,"correlation":0.72,"sector":"Commodities","parentId":"rh_index"},
      {"id":"amag_rh","label":"AMAG Recycling","type":"processor","impact":-3,"correlation":-0.20,"sector":"Recycling","parentId":"recyclers_rh"},
      {"id":"jewelry_rh","label":"Rhodium Jewelry Demand","type":"consumer","impact":2,"correlation":0.12,"sector":"Luxury","parentId":"rh_index"},
      {"id":"alb_rh","label":"Albemarle (ALB)","type":"supplier","impact":2,"correlation":0.14,"sector":"Chemicals","parentId":"glass_rh"}
    ]},
    {"nodes": [
      {"id":"epa_regs","label":"EPA Emissions Rules","type":"policy","impact":4,"correlation":0.28,"sector":"Regulation","parentId":"euro7"},
      {"id":"ice_ban","label":"ICE Vehicle Bans 2035","type":"policy","impact":-6,"correlation":-0.40,"sector":"Regulation","parentId":"tsla_ev"},
      {"id":"sa_water","label":"SA Water Scarcity","type":"macro","impact":3,"correlation":0.22,"sector":"Environment","parentId":"bushveld"},
      {"id":"pgm_refining","label":"SA PGM Refining Bottleneck","type":"processor","impact":4,"correlation":0.30,"sector":"Processing","parentId":"bushveld"},
      {"id":"hybrid_demand","label":"Hybrid Vehicle Growth","type":"macro","impact":4,"correlation":0.28,"sector":"Automotive","parentId":"euro7"},
      {"id":"byd_ev","label":"BYD EV Growth (BYDDY)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"EV","parentId":"ice_ban"},
      {"id":"emerging_auto","label":"Emerging Market Auto Growth","type":"macro","impact":3,"correlation":0.22,"sector":"Automotive","parentId":"china_vi"},
      {"id":"mining_capex","label":"PGM Mining Capex Cycle","type":"macro","impact":4,"correlation":0.30,"sector":"Mining","parentId":"pgm_basket"},
      {"id":"h2_catalyst","label":"Hydrogen Catalyst Demand","type":"consumer","impact":2,"correlation":0.15,"sector":"Clean Energy","parentId":"hyundai_fcev"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Rhodium is the rarest and most expensive of the platinum group metals, with annual global production of roughly one million ounces -- a fraction of gold or platinum output. Over 80% of rhodium demand comes from three-way catalytic converters in gasoline vehicles, where it uniquely converts nitrogen oxides (NOx) into harmless nitrogen gas. South Africa's Bushveld Complex supplies more than 80% of the world's rhodium, creating extreme geographic concentration risk. Unlike gold or silver, rhodium has no significant futures market, and physical supply is dominated by a handful of South African miners. This illiquidity has produced extraordinary price swings: rhodium traded below $1,000/oz in 2016, surged past $29,000 in 2021, and has since corrected sharply. The metal is always mined as a co-product alongside platinum and palladium, meaning its supply cannot be independently ramped in response to price signals.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Sibanye-Stillwater (SBSW), Impala Platinum (IMPUY), and Anglo American Platinum (ANGPY) are the dominant producers, with rhodium revenue providing crucial margin uplift during price spikes. On the demand side, global automakers -- GM, Ford, Toyota, Stellantis -- are captive consumers through their catalytic converter requirements. Tightening emissions standards (Euro 7, China VI-b) increase rhodium loadings per vehicle, supporting structural demand even as unit sales fluctuate.

**Secondary -- Supply Chain and Processing:** Catalytic converter manufacturers source rhodium through long-term supply agreements, but spot purchases during shortages can dramatically inflate costs. PGM recycling from spent catalytic converters provides a secondary supply source, accounting for roughly 25-30% of rhodium availability. The wave of catalytic converter thefts across North America and Europe reflects rhodium's extreme value density and has prompted legislative responses. South Africa's Eskom power utility remains a persistent supply risk, as load-shedding directly curtails smelting and refining operations.

**Tertiary -- Macro and Second-Order Effects:** The accelerating transition to battery electric vehicles represents a long-term existential threat to rhodium demand, as EVs require no catalytic converters. However, hybrid vehicles -- which still need catalysts -- are growing faster than pure EVs in many markets, providing a demand bridge. Platinum and palladium substitution research has intensified, with some automakers developing tri-metal catalysts that reduce rhodium loadings. The glass industry uses rhodium in bushings for fiberglass production, a small but price-inelastic demand segment.

## Which Companies and ETFs Benefit When the Price Rises?

Rhodium price spikes disproportionately benefit South African PGM miners, particularly Sibanye-Stillwater and Impala Platinum, where rhodium can represent 20-30% of PGM basket revenue despite being a minor volume component. PGM recyclers see improved economics as higher prices justify processing lower-grade scrap material. South African government mining royalties increase with PGM basket prices, supporting fiscal revenues.

## Which Companies and Sectors Are Hurt by a Price Increase?

Automakers absorb higher catalytic converter costs during rhodium rallies, with per-vehicle catalyst costs potentially rising by hundreds of dollars. Catalytic converter manufacturers face margin compression when spot procurement is required. Consumers in emerging markets may defer vehicle purchases as sticker prices rise, dampening auto sales growth. The glass and chemical industries face input cost inflation on an irreplaceable catalyst material.

## What Should Traders Watch When Analyzing This Market?

Rhodium has no liquid exchange-traded futures contract; pricing is set by Johnson Matthey and BASF reference prices. The SPPP ETF provides partial PGM basket exposure but does not purely track rhodium. Monitor Sibanye-Stillwater quarterly results for PGM production and basket price guidance. Eskom load-shedding schedules serve as a real-time supply disruption indicator. Watch Euro 7 implementation timelines and China emissions policy for demand signals. The rhodium/palladium price ratio indicates substitution pressure -- when rhodium trades at extreme premiums, automakers accelerate reformulation efforts. EV penetration rates in Europe and China are the most critical long-term demand variable; track monthly registration data from ACEA and CPCA.
