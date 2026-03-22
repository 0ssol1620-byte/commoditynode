---
layout: commodity
title: "Graphite"
description: "Graphite as the dominant anode material in lithium-ion batteries, with Chinese processing dominance and EV-driven demand growth."
commodity_slug: "graphite"
symbol: "MP"
sector: "Metals/EV"
etfs: ["LIT", "REMX"]
companies: ["MP", "ALB", "SQM"]
substitutes: ["Silicon Anodes", "Synthetic Graphite", "Lithium Titanate"]
themes: ["EV Battery Supply Chain", "Critical Minerals"]
tags: [graphite, EV batteries, anode material, critical minerals, china processing, synthetic graphite, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "graphite", "label": "Graphite"},
  "levels": [
    {"nodes": [
      {"id":"lit_g","label":"LIT Lithium Battery ETF","type":"etf","impact":5,"correlation":0.42,"sector":"Battery Metals"},
      {"id":"remx_g","label":"REMX Rare Earth ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Critical Minerals"},
      {"id":"syrah_g","label":"Syrah Resources (SYAAF)","type":"producer","impact":10,"correlation":0.90,"sector":"Graphite Mining"},
      {"id":"nmg_g","label":"Nouveau Monde (NMG)","type":"producer","impact":10,"correlation":0.88,"sector":"Graphite Mining"},
      {"id":"wwr_g","label":"Westwater Resources (WWR)","type":"producer","impact":9,"correlation":0.85,"sector":"Graphite Mining"},
      {"id":"mp_g","label":"MP Materials (MP)","type":"supplier","impact":4,"correlation":0.30,"sector":"Critical Minerals"},
      {"id":"g_index","label":"Graphite Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"eaf_g","label":"GrafTech International (EAF)","type":"producer","impact":8,"correlation":0.72,"sector":"Synthetic Graphite"},
      {"id":"tsla_g","label":"Tesla (TSLA)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"EV"},
      {"id":"china_flake","label":"China Flake Graphite","type":"regional","impact":9,"correlation":0.80,"sector":"China Supply"},
      {"id":"china_synth","label":"China Synthetic Graphite","type":"regional","impact":9,"correlation":0.82,"sector":"China Processing"},
      {"id":"steel_eaf_g","label":"EAF Steelmaking Demand","type":"consumer","impact":5,"correlation":0.40,"sector":"Steel"},
      {"id":"ev_demand_g","label":"Global EV Battery Demand","type":"macro","impact":8,"correlation":0.65,"sector":"EV Demand"}
    ]},
    {"nodes": [
      {"id":"catl_g","label":"CATL Battery","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Batteries","parentId":"tsla_g"},
      {"id":"panasonic_g","label":"Panasonic (PCRFY)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Batteries","parentId":"tsla_g"},
      {"id":"lges_g","label":"LG Energy Sol","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Batteries","parentId":"tsla_g"},
      {"id":"samsung_sdi_g","label":"Samsung SDI","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Batteries","parentId":"ev_demand_g"},
      {"id":"anode_proc","label":"Anode Material Processors","type":"processor","impact":8,"correlation":0.70,"sector":"Battery Materials","parentId":"china_flake"},
      {"id":"spherical_g","label":"Spherical Graphite Market","type":"commodity","impact":9,"correlation":0.88,"sector":"Battery Grade","parentId":"g_index"},
      {"id":"refractories_g","label":"Refractories Sector","type":"consumer","impact":4,"correlation":0.30,"sector":"Industrial","parentId":"steel_eaf_g"},
      {"id":"nucor_g","label":"Nucor (NUE)","type":"consumer","impact":3,"correlation":0.22,"sector":"Steel","parentId":"steel_eaf_g"},
      {"id":"stld_g","label":"Steel Dynamics (STLD)","type":"consumer","impact":3,"correlation":0.20,"sector":"Steel","parentId":"steel_eaf_g"},
      {"id":"electrode_g","label":"Graphite Electrodes","type":"commodity","impact":7,"correlation":0.65,"sector":"Steelmaking","parentId":"eaf_g"},
      {"id":"mozam_g","label":"Mozambique (Balama Mine)","type":"regional","impact":8,"correlation":0.72,"sector":"Supply","parentId":"syrah_g"},
      {"id":"quebec_g","label":"Quebec Graphite Hub","type":"regional","impact":7,"correlation":0.60,"sector":"Supply","parentId":"nmg_g"}
    ]},
    {"nodes": [
      {"id":"silicon_anode","label":"Silicon Anode (Substitute)","type":"substitute","impact":-6,"correlation":-0.45,"sector":"Battery Tech","parentId":"spherical_g"},
      {"id":"lto_sub","label":"Lithium Titanate (LTO)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Battery Alt","parentId":"spherical_g"},
      {"id":"dxy_g","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.35,"sector":"Forex","parentId":"g_index"},
      {"id":"cny_g","label":"Chinese Yuan (CNY)","type":"fx","impact":5,"correlation":0.42,"sector":"Forex","parentId":"china_flake"},
      {"id":"critical_min_g","label":"US Critical Mineral Policy","type":"policy","impact":6,"correlation":0.48,"sector":"US Policy","parentId":"remx_g"},
      {"id":"eu_crma","label":"EU Critical Raw Materials Act","type":"policy","impact":5,"correlation":0.40,"sector":"EU Policy","parentId":"critical_min_g"},
      {"id":"ira_battery_g","label":"IRA Battery Incentives","type":"policy","impact":6,"correlation":0.45,"sector":"US Policy","parentId":"nmg_g"},
      {"id":"nuclear_g","label":"Nuclear Graphite Demand","type":"consumer","impact":3,"correlation":0.22,"sector":"Nuclear","parentId":"g_index"},
      {"id":"lubricant_g","label":"Graphite Lubricants","type":"consumer","impact":2,"correlation":0.15,"sector":"Industrial","parentId":"g_index"},
      {"id":"lithium_link","label":"Lithium (Related)","type":"commodity","impact":6,"correlation":0.55,"sector":"Battery Metals","parentId":"lit_g"},
      {"id":"cobalt_link","label":"Cobalt (Related)","type":"commodity","impact":4,"correlation":0.40,"sector":"Battery Metals","parentId":"lit_g"}
    ]},
    {"nodes": [
      {"id":"gigafactory_g","label":"Gigafactory Pipeline","type":"macro","impact":5,"correlation":0.40,"sector":"Manufacturing","parentId":"ev_demand_g"},
      {"id":"coating_tech","label":"Anode Coating Technology","type":"macro","impact":5,"correlation":0.35,"sector":"Battery Tech","parentId":"anode_proc"},
      {"id":"china_export_ctrl","label":"China Export Controls","type":"policy","impact":8,"correlation":0.65,"sector":"Geopolitics","parentId":"china_flake"},
      {"id":"nat_vs_synth","label":"Natural vs Synthetic Pricing","type":"macro","impact":6,"correlation":0.50,"sector":"Market Structure","parentId":"g_index"},
      {"id":"mzn_fx","label":"Mozambique Metical (MZN)","type":"fx","impact":4,"correlation":0.28,"sector":"Forex","parentId":"mozam_g"},
      {"id":"cad_g","label":"Canadian Dollar (CAD)","type":"fx","impact":3,"correlation":0.22,"sector":"Forex","parentId":"quebec_g"},
      {"id":"recycled_anode","label":"Anode Recycling","type":"processor","impact":-3,"correlation":-0.25,"sector":"Recycling","parentId":"anode_proc"},
      {"id":"solid_state_g","label":"Solid-State Battery Threat","type":"substitute","impact":-4,"correlation":-0.28,"sector":"Future Tech","parentId":"silicon_anode"},
      {"id":"grid_storage_g","label":"Grid Storage Demand","type":"macro","impact":5,"correlation":0.38,"sector":"Energy Storage","parentId":"ev_demand_g"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Graphite is the single largest component by weight in lithium-ion battery anodes, typically comprising 50-60% of cell mass. Every EV battery requires roughly 50-100 kg of processed graphite, making it one of the most volume-intensive critical minerals in the energy transition. The market splits between natural graphite (mined as flake graphite, then processed into spherical graphite for batteries) and synthetic graphite (manufactured from petroleum coke at high temperatures). China dominates both segments, controlling over 65% of natural graphite mining, 80% of synthetic graphite production, and virtually all spherical graphite processing. Annual global production exceeds 1.3 million tonnes, but battery-grade material represents a fast-growing premium segment with widening supply-demand deficits.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Syrah Resources operates the Balama mine in Mozambique, the largest integrated natural graphite mine outside China, and is developing active anode material processing in Louisiana with DOE funding. Nouveau Monde Graphite (NMG) is building an integrated mine-to-anode operation in Quebec. GrafTech International (EAF) is the leading Western producer of synthetic graphite electrodes used in electric arc furnace steelmaking. Tesla, CATL, and LG Energy Solution are the primary battery-grade graphite consumers through their cell manufacturing operations.

**Secondary -- Supply Chain and Processing:** The anode supply chain is remarkably concentrated. Natural flake graphite must undergo purification, spheronization, and coating before it meets battery specifications -- processes that China controls almost exclusively. Synthetic graphite avoids mining but requires energy-intensive graphitization furnaces, making production costs sensitive to electricity prices and petroleum coke availability. The electric arc furnace steelmaking sector represents a parallel demand channel, consuming graphite electrodes that face their own supply-demand dynamics independent of the battery market.

**Tertiary -- Macro and Second-Order Effects:** China's December 2023 export controls on graphite products sent shockwaves through battery supply chains and accelerated Western efforts to build domestic processing capacity. The US Critical Minerals List and EU Critical Raw Materials Act have prioritized graphite, unlocking government financing for projects like Syrah's Vidalia facility and NMG's Becancour plant. Silicon anode technology, which blends silicon with graphite to increase energy density, represents both a partial substitute and a potential demand modifier -- reducing graphite content per cell while enabling larger batteries. Nuclear reactors use graphite as a moderator, providing niche but stable demand.

## Winners

Graphite price increases benefit non-Chinese producers disproportionately as supply chain diversification premiums widen. Syrah Resources (SYAAF) and Nouveau Monde Graphite (NMG) capture both commodity price upside and strategic value as Western governments fund alternatives to Chinese supply. GrafTech International benefits from graphite electrode pricing power in tight markets. Nations with graphite deposits outside China -- Mozambique, Canada, Tanzania, Madagascar -- gain geopolitical significance and attract foreign direct investment.

## Losers

Battery cell manufacturers face direct anode material cost inflation, with graphite representing 15-20% of cell bill-of-materials cost. EV automakers including Tesla, GM, and Ford see battery pack costs rise, threatening price parity targets with internal combustion vehicles. Synthetic graphite producers outside China face margin pressure from high energy costs during petroleum coke price spikes. Refractories manufacturers in the steel industry compete with battery applications for supply, facing allocation risk during shortages.

## Trading Note

Graphite lacks exchange-traded futures, with pricing referenced through Benchmark Minerals, Fastmarkets, and CRU assessments. Monitor China's export license decisions and environmental inspection campaigns as primary supply-side catalysts. The natural-versus-synthetic graphite price spread indicates substitution dynamics and energy cost pass-through. Syrah Resources' Balama production reports provide the best publicly available proxy for non-Chinese supply conditions. Track IRA-qualifying anode material milestones for policy-driven demand signals. The ratio of battery-grade spherical graphite to flake graphite prices indicates processing margin health and midstream capacity constraints.
