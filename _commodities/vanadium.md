---
layout: commodity
image: "/assets/images/og-default.png"
title: "Vanadium"
description: "Vanadium's dual role in high-strength steel alloys and grid-scale redox flow batteries, with Chinese supply dominance."
commodity_slug: "vanadium"
symbol: "RIO"
sector: "Metals"
etfs: ["PICK", "XME"]
companies: ["RIO", "GLEN.L", "AMG"]
substitutes: ["Molybdenum", "Titanium", "Chromium"]
themes: ["Grid-Scale Energy Storage", "Steel Alloys"]
tags: [vanadium, steel alloys, energy storage, VRFB, china supply, critical minerals, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "vanadium", "label": "Vanadium"},
  "levels": [
    {"nodes": [
      {"id":"pick_v","label":"PICK Mining ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Mining"},
      {"id":"xme_v","label":"XME Metals ETF","type":"etf","impact":4,"correlation":0.32,"sector":"Mining"},
      {"id":"rio_v","label":"Rio Tinto (RIO)","type":"producer","impact":5,"correlation":0.40,"sector":"Diversified Mining"},
      {"id":"glen_v","label":"Glencore (GLEN.L)","type":"producer","impact":5,"correlation":0.38,"sector":"Diversified Mining"},
      {"id":"amg_v","label":"AMG Advanced (AMG)","type":"producer","impact":8,"correlation":0.72,"sector":"Specialty Metals"},
      {"id":"lgo_v","label":"Largo Inc (LGO)","type":"producer","impact":10,"correlation":0.92,"sector":"Vanadium Mining"},
      {"id":"v_index","label":"Vanadium Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"steel_demand","label":"Global Steel Demand","type":"macro","impact":7,"correlation":0.60,"sector":"Steel"},
      {"id":"nucor_v","label":"Nucor (NUE)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Steel"},
      {"id":"mt_v","label":"ArcelorMittal (MT)","type":"consumer","impact":-4,"correlation":-0.28,"sector":"Steel"},
      {"id":"vrfb_demand","label":"VRFB Storage Demand","type":"macro","impact":8,"correlation":0.65,"sector":"Energy Storage"},
      {"id":"china_prod","label":"China Vanadium Output","type":"regional","impact":9,"correlation":0.78,"sector":"China Supply"},
      {"id":"pangang_v","label":"Pangang Group (Panzhihua)","type":"producer","impact":9,"correlation":0.80,"sector":"Chinese Mining"}
    ]},
    {"nodes": [
      {"id":"fev_v","label":"Ferrovanadium Market","type":"commodity","impact":9,"correlation":0.95,"sector":"Steel Alloys","parentId":"v_index"},
      {"id":"v2o5","label":"V2O5 Pentoxide Price","type":"commodity","impact":10,"correlation":0.98,"sector":"Chemicals","parentId":"v_index"},
      {"id":"hsla_steel","label":"HSLA Steel Demand","type":"consumer","impact":6,"correlation":0.50,"sector":"Construction","parentId":"steel_demand"},
      {"id":"rebar_v","label":"Rebar/Construction Steel","type":"consumer","impact":7,"correlation":0.55,"sector":"Construction","parentId":"steel_demand"},
      {"id":"invinity_v","label":"Invinity Energy (IVNF)","type":"consumer","impact":8,"correlation":0.68,"sector":"Energy Storage","parentId":"vrfb_demand"},
      {"id":"cellcube_v","label":"CellCube Energy","type":"consumer","impact":7,"correlation":0.60,"sector":"Energy Storage","parentId":"vrfb_demand"},
      {"id":"bushveld_v","label":"Bushveld Minerals","type":"producer","impact":9,"correlation":0.85,"sector":"Vanadium Mining","parentId":"lgo_v"},
      {"id":"evraz_v","label":"Evraz (Steel/V)","type":"producer","impact":6,"correlation":0.48,"sector":"Steel/Mining","parentId":"glen_v"},
      {"id":"tio2_link","label":"Titanium Slag (Co-product)","type":"commodity","impact":4,"correlation":0.30,"sector":"Titanium","parentId":"rio_v"},
      {"id":"aerospace_v","label":"Aerospace Ti-V Alloys","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Aerospace","parentId":"amg_v"},
      {"id":"sumitomo_v","label":"Sumitomo Electric","type":"consumer","impact":5,"correlation":0.40,"sector":"Energy Storage","parentId":"vrfb_demand"},
      {"id":"china_refine","label":"China V Refining","type":"processor","impact":8,"correlation":0.70,"sector":"Processing","parentId":"china_prod"}
    ]},
    {"nodes": [
      {"id":"china_rebar_std","label":"China Rebar Standards","type":"policy","impact":8,"correlation":0.62,"sector":"Regulation","parentId":"rebar_v"},
      {"id":"moly_sub","label":"Molybdenum (Substitute)","type":"substitute","impact":-5,"correlation":-0.38,"sector":"Alloy Metals","parentId":"fev_v"},
      {"id":"chromium_sub","label":"Chromium (Substitute)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Alloy Metals","parentId":"fev_v"},
      {"id":"liion_compete","label":"Li-ion Grid Storage","type":"substitute","impact":-6,"correlation":-0.45,"sector":"Energy Storage","parentId":"vrfb_demand"},
      {"id":"dxy_v","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.35,"sector":"Forex","parentId":"v_index"},
      {"id":"cny_v","label":"Chinese Yuan (CNY)","type":"fx","impact":5,"correlation":0.42,"sector":"Forex","parentId":"china_prod"},
      {"id":"critical_min_v","label":"Critical Mineral Policy","type":"policy","impact":5,"correlation":0.38,"sector":"US Policy","parentId":"pick_v"},
      {"id":"infra_spend","label":"Global Infrastructure Spend","type":"macro","impact":6,"correlation":0.48,"sector":"Construction","parentId":"hsla_steel"},
      {"id":"ba_v","label":"Boeing (BA)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Aerospace","parentId":"aerospace_v"},
      {"id":"lmt_v","label":"Lockheed Martin (LMT)","type":"consumer","impact":-2,"correlation":-0.10,"sector":"Defense","parentId":"aerospace_v"},
      {"id":"iron_ore_link","label":"Iron Ore (Related)","type":"commodity","impact":5,"correlation":0.45,"sector":"Ferrous Metals","parentId":"steel_demand"}
    ]},
    {"nodes": [
      {"id":"green_steel","label":"Green Steel Transition","type":"macro","impact":4,"correlation":0.30,"sector":"Decarbonization","parentId":"hsla_steel"},
      {"id":"grid_mod","label":"Grid Modernization Spend","type":"macro","impact":5,"correlation":0.38,"sector":"Utilities","parentId":"vrfb_demand"},
      {"id":"sa_mining","label":"South Africa Mining Risk","type":"regional","impact":5,"correlation":0.35,"sector":"Geopolitics","parentId":"bushveld_v"},
      {"id":"russia_v","label":"Russia Vanadium Supply","type":"regional","impact":5,"correlation":0.38,"sector":"Geopolitics","parentId":"evraz_v"},
      {"id":"titanium_sub","label":"Titanium Alloys (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Aerospace","parentId":"aerospace_v"},
      {"id":"recycled_v","label":"Vanadium Recycling","type":"processor","impact":-3,"correlation":-0.25,"sector":"Recycling","parentId":"china_refine"},
      {"id":"electrolyte_cost","label":"VRFB Electrolyte Cost","type":"macro","impact":7,"correlation":0.55,"sector":"Energy Storage","parentId":"invinity_v"},
      {"id":"niobium_sub","label":"Niobium (Substitute)","type":"substitute","impact":-4,"correlation":-0.32,"sector":"Alloy Metals","parentId":"fev_v"},
      {"id":"zar_v","label":"South African Rand (ZAR)","type":"fx","impact":4,"correlation":0.28,"sector":"Forex","parentId":"sa_mining"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Vanadium occupies a unique position in the commodity landscape as both an essential steel alloying element and a promising energy storage metal. Approximately 90% of global vanadium consumption goes into steel, primarily as ferrovanadium (FeV) added to high-strength low-alloy (HSLA) steels used in rebar, pipelines, and structural applications. The remaining 10% flows into chemical applications and, increasingly, vanadium redox flow batteries (VRFBs). China dominates the market, producing over 55% of global supply primarily as a co-product of iron ore processing at facilities like Pangang Group in Sichuan province. Annual global production is roughly 100,000 tonnes of V2O5 equivalent, making it a small but strategically important market with high price volatility.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Largo Inc (LGO) is the only publicly traded pure-play vanadium producer, operating the Maracas Menchen mine in Brazil. Bushveld Minerals in South Africa provides additional primary production exposure. Among diversified miners, Rio Tinto and Glencore produce vanadium as a by-product of titanium slag and other operations. On the demand side, steelmakers such as ArcelorMittal (MT) and Nucor (NUE) are the largest consumers, with vanadium intensity per tonne of steel rising as construction standards tighten -- particularly China's rebar standards (GB/T 1499) that mandate higher vanadium content.

**Secondary -- Supply Chain and Processing:** The VRFB sector represents vanadium's highest-growth demand channel. Companies like Invinity Energy Systems and Sumitomo Electric are deploying flow batteries for grid-scale storage where cycle life and duration (4-12 hours) advantages over lithium-ion justify higher upfront costs. The vanadium electrolyte is not consumed during battery operation and can be recycled indefinitely, creating a circular economy argument. Ferrovanadium pricing closely tracks V2O5 pentoxide prices, with European and Chinese benchmarks sometimes diverging due to trade flows and tariff structures.

**Tertiary -- Macro and Second-Order Effects:** China's dual role as the largest producer and consumer creates a self-referencing market where domestic policy decisions -- such as environmental shutdowns of stone-coal vanadium plants or changes to rebar standards -- can swing global prices 30-50% within months. Substitution threats from molybdenum, niobium, and chromium in steel applications provide a soft ceiling on prices, while lithium-ion battery competition caps VRFB adoption rates. Critical mineral designation in the US and EU is driving policy support for non-Chinese supply development.

## Winners

Vanadium price surges disproportionately benefit Largo Inc (LGO) and Bushveld Minerals, whose revenues are almost entirely vanadium-derived. VRFB manufacturers benefit indirectly from higher vanadium visibility and the associated investment flows into energy storage, though their input costs also rise. AMG Advanced Metallurgy captures value through its specialty alloys and processing operations. South African and Brazilian producers gain margin expansion when the rand and real weaken against the dollar simultaneously.

## Losers

Steelmakers absorb vanadium cost inflation directly, particularly in markets where rebar and structural steel pricing is competitive and cost pass-through is limited. VRFB developers face a paradox where higher vanadium prices increase battery system costs and slow adoption relative to lithium-ion alternatives. Aerospace companies using titanium-vanadium alloys see incremental materials cost pressure. Construction companies in price-sensitive emerging markets may downgrade steel specifications or delay projects when ferrovanadium costs spike.

## Trading Note

Vanadium trades in an opaque physical market with pricing set by assessments from Fastmarkets and Asian Metal. There is no liquid futures contract, so exposure is typically obtained through equities (Largo, Bushveld) or diversified mining ETFs (PICK, XME). Monitor China's rebar standard enforcement and environmental inspection campaigns as primary price catalysts. The vanadium-to-ferrovanadium conversion spread indicates processing margins and downstream demand health. VRFB deployment announcements provide leading indicators for the structural demand growth thesis, but steel consumption remains the dominant price driver in the near term.
