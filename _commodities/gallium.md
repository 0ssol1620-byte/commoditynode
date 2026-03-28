---
layout: commodity
title: "Gallium Price Impact: Semiconductors, 5G Infrastructure & China Export Controls"
description: "How gallium supply disruptions cascade through semiconductor fabs, LED manufacturing, 5G deployment, and defense electronics amid China's export restrictions."
commodity_slug: "gallium"
symbol: ""
sector: "Critical Minerals/Tech"
etfs: ["REMX", "SMH"]
companies: ["INTC", "CREE", "TSM"]
substitutes: ["Silicon Carbide (SiC)", "Indium Phosphide"]
themes: ["China Export Controls", "CHIPS Act", "5G Rollout"]
tags: ["gallium", "semiconductors", "5G", "critical minerals", "china export ban", "GaAs", "GaN"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "gallium", "label": "Gallium"},
  "levels": [
    {"nodes": [
      {"id":"ga_price","label":"Gallium Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Critical Minerals"},
      {"id":"remx_ga","label":"REMX Rare Earth ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Critical Minerals"},
      {"id":"smh_ga","label":"SMH Semiconductor ETF","type":"etf","impact":-3,"correlation":-0.20,"sector":"Semiconductors"},
      {"id":"chinalco_ga","label":"Chinalco (Aluminum/Gallium)","type":"producer","impact":9,"correlation":0.75,"sector":"Aluminum/Gallium"},
      {"id":"cmc_ga","label":"China Mineral (CMC)","type":"producer","impact":8,"correlation":0.70,"sector":"Gallium Refining"},
      {"id":"intc_ga","label":"Intel (INTC)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Semiconductors"},
      {"id":"tsm_ga","label":"TSMC (TSM)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Semiconductors"},
      {"id":"cree_ga","label":"Wolfspeed (CREE)","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Wide Bandgap"},
      {"id":"osram_ga","label":"ams-OSRAM","type":"consumer","impact":-4,"correlation":-0.32,"sector":"LED/Optoelectronics"},
      {"id":"germanium_rel","label":"Germanium (Related)","type":"commodity","impact":7,"correlation":0.65,"sector":"Critical Minerals"}
    ]},
    {"nodes": [
      {"id":"gan_chips","label":"GaN Power Chips","type":"consumer","impact":-6,"correlation":-0.48,"sector":"Power Electronics","parentId":"cree_ga"},
      {"id":"gaas_wafer","label":"GaAs Wafer Market","type":"consumer","impact":-7,"correlation":-0.55,"sector":"Compound Semi","parentId":"intc_ga"},
      {"id":"5g_infra","label":"5G Infrastructure Demand","type":"macro","impact":5,"correlation":0.40,"sector":"Telecom","parentId":"smh_ga"},
      {"id":"led_market","label":"LED Lighting Market","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Lighting","parentId":"osram_ga"},
      {"id":"ii_vi_ga","label":"II-VI / Coherent","type":"processor","impact":-4,"correlation":-0.30,"sector":"Compound Semi","parentId":"gaas_wafer"},
      {"id":"sumitomo_ga","label":"Sumitomo Chemical","type":"processor","impact":5,"correlation":0.38,"sector":"Gallium Refining","parentId":"chinalco_ga"},
      {"id":"neo_perf","label":"Neo Performance Materials","type":"producer","impact":6,"correlation":0.48,"sector":"Rare Earth/Gallium","parentId":"remx_ga"},
      {"id":"freiberger","label":"Freiberger Compound","type":"processor","impact":5,"correlation":0.40,"sector":"Wafer Mfg","parentId":"gaas_wafer"},
      {"id":"qcom_ga","label":"Qualcomm (QCOM)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"RF Chips","parentId":"5g_infra"},
      {"id":"skyworks_ga","label":"Skyworks Solutions","type":"consumer","impact":-4,"correlation":-0.35,"sector":"RF Semiconductors","parentId":"5g_infra"}
    ]},
    {"nodes": [
      {"id":"china_ban","label":"China Gallium Export Ban","type":"policy","impact":9,"correlation":0.70,"sector":"Geopolitics","parentId":"cmc_ga"},
      {"id":"chips_act","label":"US CHIPS Act Funding","type":"policy","impact":5,"correlation":0.35,"sector":"Industrial Policy","parentId":"intc_ga"},
      {"id":"sic_sub","label":"SiC Substitution Threat","type":"substitute","impact":-5,"correlation":-0.35,"sector":"Wide Bandgap","parentId":"gan_chips"},
      {"id":"inp_sub","label":"Indium Phosphide (Sub)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Compound Semi","parentId":"gaas_wafer"},
      {"id":"dxy_ga","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.30,"sector":"Forex","parentId":"ga_price"},
      {"id":"cny_ga","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.32,"sector":"Forex","parentId":"china_ban"},
      {"id":"aluminum_byp","label":"Aluminum Production Link","type":"macro","impact":5,"correlation":0.45,"sector":"Base Metals","parentId":"chinalco_ga"},
      {"id":"defense_elec","label":"Defense Electronics Demand","type":"consumer","impact":4,"correlation":0.30,"sector":"Defense","parentId":"gan_chips"},
      {"id":"eu_crma","label":"EU Critical Raw Materials Act","type":"policy","impact":4,"correlation":0.28,"sector":"Regulation","parentId":"china_ban"},
      {"id":"japan_stockpile","label":"Japan Strategic Stockpile","type":"policy","impact":3,"correlation":0.22,"sector":"Geopolitics","parentId":"china_ban"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Gallium is a critical mineral with no stand-alone mining — it is extracted exclusively as a by-product of aluminum refining (bauxite) and zinc processing. China controls over 95% of global gallium production, making it one of the most geographically concentrated supply chains in the world. In July 2023, China imposed export controls on gallium and germanium, weaponizing its supply dominance in response to U.S. semiconductor restrictions. Gallium arsenide (GaAs) and gallium nitride (GaN) compound semiconductors are essential for 5G RF front-end modules, LEDs, power electronics, and military radar systems. Annual global demand is roughly 600 tonnes — a minuscule market with outsized strategic importance. The U.S. CHIPS Act and EU Critical Raw Materials Act are driving diversification efforts, but building non-Chinese refining capacity requires years.

## Key Impact Channels

**Primary — Compound Semiconductor Supply Chain:** GaAs wafers power virtually all smartphone RF front-end chips and fiber-optic laser diodes. GaN devices are critical for 5G base stations, EV fast chargers, and military electronic warfare systems. Gallium supply disruption directly threatens Wolfspeed, Skyworks, Qorvo, and II-VI's production pipelines. Wafer fabricators face 6-12 month inventory cycles, creating delayed but severe impact from sustained supply cuts.

**Secondary — Aluminum Industry Linkage and Processing:** Since gallium is a by-product of Bayer process alumina refining, its supply is structurally tied to global aluminum production economics. Chinese smelters can extract gallium opportunistically when prices justify the additional processing step. Non-Chinese sources (Japan's Dowa, Germany's PPM Pure Metals) represent less than 5% of capacity, creating a near-monopoly bottleneck.

**Tertiary — Geopolitical Escalation and Substitution:** China's gallium export controls established a precedent for critical mineral weaponization, prompting allied nations to accelerate stockpiling and domestic refining programs. Silicon carbide (SiC) is substituting for GaN in some power electronics applications, but no viable substitute exists for GaAs in high-frequency RF applications. Defense procurement agencies are securing dedicated gallium supply chains outside Chinese control.

## Winners

Chinese gallium refiners (Chinalco subsidiaries, East Hope Group) benefit from tighter export quotas that elevate domestic pricing power and create a geopolitical leverage asset. Non-Chinese gallium recyclers and secondary producers gain strategic importance and government subsidies. SiC manufacturers (Wolfspeed, STMicroelectronics) capture displaced demand in power electronics where GaN substitution stalls. Nations with bauxite reserves outside China (Australia, Guinea, India) attract investment for integrated alumina-gallium refining.

## Losers

Compound semiconductor foundries face raw material cost inflation and allocation uncertainty. 5G equipment makers (Ericsson, Nokia, Samsung Networks) absorb higher component costs as RF chip prices rise. LED manufacturers dependent on GaAs substrates face margin compression. Consumer electronics OEMs ultimately bear pass-through costs on smartphones, data center optics, and display technologies. Western defense contractors face supply security risks for critical electronic warfare and radar systems.

## Key Impact Relationships

| Node | Impact (±10% Move) | Correlation | Sector |
|------|-------------------|-------------|--------|
| Gallium Price Index | +10.0% | 0.99 | Critical Minerals |
| REMX Rare Earth ETF | +4.0% | 0.35 | Critical Minerals |
| SMH Semiconductor ETF | −3.0% | −0.20 | Semiconductors |
| Chinalco (Aluminum/Gallium) | +9.0% | 0.75 | Aluminum/Gallium |
| China Mineral (CMC) | +8.0% | 0.70 | Gallium Refining |
| Intel (INTC) | −3.0% | −0.22 | Semiconductors |
| TSMC (TSM) | −2.0% | −0.15 | Semiconductors |
| Wolfspeed (CREE) | −5.0% | −0.40 | Wide Bandgap |
| ams-OSRAM | −4.0% | −0.32 | LED/Optoelectronics |
| Germanium (Related) | +7.0% | 0.65 | Critical Minerals |

## Trading Note

Gallium has no exchange-traded futures contract; prices are assessed by Asian Metal, Argus, and Fastmarkets. Monitor China's MOFCOM export license approvals for real-time supply signals — license denials or delays directly move spot prices. Track global aluminum production data as a leading indicator for potential gallium by-product availability. The REMX ETF provides indirect exposure through rare earth and critical mineral miners. Wolfspeed (CREE) and Skyworks (SWKS) share prices inversely correlate with gallium price spikes. Watch for Japan and South Korea strategic reserve releases as a price ceiling mechanism during supply crises.
