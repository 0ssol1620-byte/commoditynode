---
layout: commodity
title: "Silicon Price Impact: Solar Polysilicon, Semiconductor Wafers & Aluminum Alloys"
description: "How silicon metal and polysilicon prices cascade through solar panel manufacturing, semiconductor wafer production, and aluminum casting industries."
commodity_slug: "silicon"
symbol: ""
sector: "Critical Minerals/Solar"
etfs: ["TAN", "SMH", "REMX"]
companies: ["ENPH", "FSLR", "WFG"]
substitutes: ["Thin-Film Solar (CdTe)", "Perovskite Solar Cells"]
themes: ["Solar Energy Transition", "Semiconductor Expansion", "China Polysilicon Dominance"]
tags: ["silicon", "polysilicon", "solar", "semiconductor wafer", "metallurgical silicon", "aluminum alloy"]
image: /assets/images/og-silicon.png
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "silicon", "label": "Silicon"},
  "levels": [
    {"nodes": [
      {"id":"si_price","label":"Silicon Metal Price","type":"index","impact":10,"correlation":0.99,"sector":"Industrial Metals"},
      {"id":"poly_price","label":"Polysilicon Price Index","type":"index","impact":9,"correlation":0.85,"sector":"Solar Materials"},
      {"id":"tan_si","label":"TAN Solar ETF","type":"etf","impact":-5,"correlation":-0.42,"sector":"Solar Energy"},
      {"id":"smh_si","label":"SMH Semiconductor ETF","type":"etf","impact":-2,"correlation":-0.15,"sector":"Semiconductors"},
      {"id":"tongwei","label":"Tongwei (Polysilicon)","type":"producer","impact":9,"correlation":0.78,"sector":"Polysilicon"},
      {"id":"gcl_tech","label":"GCL Technology","type":"producer","impact":8,"correlation":0.72,"sector":"Polysilicon"},
      {"id":"wacker_si","label":"Wacker Chemie (WCH)","type":"producer","impact":7,"correlation":0.60,"sector":"Polysilicon/Silicones"},
      {"id":"elkem_si","label":"Elkem ASA","type":"producer","impact":7,"correlation":0.58,"sector":"Silicon Metal"},
      {"id":"longi_si","label":"LONGi Green Energy","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Solar Wafer/Module"},
      {"id":"jinko_si","label":"JinkoSolar (JKS)","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Solar Module"}
    ]},
    {"nodes": [
      {"id":"solar_wafer","label":"Solar Wafer Market","type":"consumer","impact":-7,"correlation":-0.55,"sector":"Solar","parentId":"longi_si"},
      {"id":"semi_wafer","label":"Semiconductor Wafer (EG Si)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Semiconductors","parentId":"smh_si"},
      {"id":"al_alloy","label":"Aluminum Alloy Casting","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Automotive","parentId":"si_price"},
      {"id":"silicone_chem","label":"Silicone Chemicals","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Chemicals","parentId":"wacker_si"},
      {"id":"trina_si","label":"Trina Solar","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Solar Module","parentId":"solar_wafer"},
      {"id":"canadian_sol","label":"Canadian Solar (CSIQ)","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Solar Module","parentId":"solar_wafer"},
      {"id":"sumco_si","label":"SUMCO (Semi Wafer)","type":"producer","impact":5,"correlation":0.42,"sector":"Semiconductor Wafer","parentId":"semi_wafer"},
      {"id":"shin_etsu","label":"Shin-Etsu Chemical","type":"producer","impact":6,"correlation":0.48,"sector":"Semi Wafer/Silicones","parentId":"semi_wafer"},
      {"id":"ferroglobe","label":"Ferroglobe (GSM)","type":"producer","impact":7,"correlation":0.58,"sector":"Silicon Metal","parentId":"elkem_si"},
      {"id":"daqo_si","label":"Daqo New Energy (DQ)","type":"producer","impact":8,"correlation":0.68,"sector":"Polysilicon","parentId":"tongwei"}
    ]},
    {"nodes": [
      {"id":"cdte_sub","label":"CdTe Thin Film (Sub)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Solar Tech","parentId":"solar_wafer"},
      {"id":"perovskite","label":"Perovskite Solar (Sub)","type":"substitute","impact":-3,"correlation":-0.18,"sector":"Future Solar","parentId":"solar_wafer"},
      {"id":"china_poly_dom","label":"China Polysilicon Dominance","type":"policy","impact":7,"correlation":0.55,"sector":"Supply Concentration","parentId":"tongwei"},
      {"id":"uyghur_ban","label":"UFLPA Xinjiang Import Ban","type":"policy","impact":6,"correlation":0.45,"sector":"Trade Policy","parentId":"china_poly_dom"},
      {"id":"dxy_si","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.28,"sector":"Forex","parentId":"si_price"},
      {"id":"cny_si","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.30,"sector":"Forex","parentId":"china_poly_dom"},
      {"id":"electricity_cost","label":"Electricity Cost (Smelting)","type":"macro","impact":5,"correlation":0.40,"sector":"Energy","parentId":"elkem_si"},
      {"id":"solar_install","label":"Global Solar Installation GW","type":"macro","impact":6,"correlation":0.48,"sector":"Clean Energy","parentId":"tan_si"},
      {"id":"ev_casting","label":"EV Giga-Casting Demand","type":"macro","impact":3,"correlation":0.22,"sector":"Automotive","parentId":"al_alloy"},
      {"id":"fslr_si","label":"First Solar CdTe (Beneficiary)","type":"consumer","impact":3,"correlation":0.22,"sector":"Thin Film Solar","parentId":"cdte_sub"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Silicon is the second most abundant element in Earth's crust yet requires energy-intensive refining to reach metallurgical grade (MG-Si, 98%+ purity) and further purification for solar-grade polysilicon (9N purity) and electronic-grade semiconductor wafers (11N purity). China produces over 75% of global metallurgical silicon and approximately 85% of polysilicon, creating extreme supply concentration. The silicon value chain bifurcates: solar polysilicon feeds the world's fastest-growing energy source (500+ GW annual installations projected by 2030), while electronic-grade silicon wafers underpin the entire semiconductor industry. Aluminum foundries consume MG-Si as an alloying element for castings. The polysilicon market experienced wild price swings — from $6/kg to $40/kg and back — between 2020-2024 as Chinese capacity expansions repeatedly overshoot demand cycles. Annual MG-Si production exceeds 3 million tonnes globally.

## Key Impact Channels

**Primary — Solar PV Supply Chain:** Polysilicon → ingot → wafer → cell → module represents a vertically integrated chain dominated by Chinese companies (Tongwei, GCL, LONGi, JinkoSolar, Trina). Polysilicon cost represents 15-25% of finished module price. Chinese producers leveraged cheap hydropower in Yunnan and Sichuan and cheap coal power in Xinjiang/Inner Mongolia to achieve sub-$8/kg production costs, making Western competitors uneconomic.

**Secondary — Semiconductor Wafer Market:** Electronic-grade silicon wafers (300mm) are produced by a tight oligopoly: Shin-Etsu, SUMCO, Siltronic, SK Siltron, and GlobalWafers. This market is decoupled from solar polysilicon pricing due to vastly higher purity requirements and different supply chains. Semiconductor wafer prices respond to chip demand cycles rather than silicon metal commodity pricing.

**Tertiary — Trade Policy and Substitution:** The Uyghur Forced Labor Prevention Act (UFLPA) has blocked Xinjiang-origin polysilicon from entering the U.S., forcing supply chain traceability and shifting procurement to non-Xinjiang Chinese and Western producers. CdTe thin-film technology (First Solar) avoids silicon entirely, gaining competitive advantage from trade restrictions. Perovskite solar cells represent a longer-term substitution threat but remain pre-commercial at scale.

## Winners

Chinese polysilicon producers (Tongwei, GCL, Daqo) dominate through cost leadership but face margin compression during capacity glut cycles. First Solar (FSLR) benefits uniquely — its CdTe technology avoids polysilicon entirely and gains market share when silicon supply is disrupted or trade-restricted. Semiconductor wafer makers (Shin-Etsu, SUMCO) maintain pricing power in a structurally tight oligopoly. Non-Xinjiang polysilicon producers gain strategic premium from UFLPA compliance demand.

## Losers

Solar module manufacturers face squeeze between polysilicon cost volatility and downstream module price pressure from fierce competition. Western polysilicon producers (Wacker, REC Silicon, Hemlock) struggle to compete with Chinese cost structures. Aluminum foundries absorb MG-Si cost increases in automotive casting operations. Solar project developers face module cost uncertainty that complicates project finance economics. Countries dependent on solar deployment for energy transition face higher installation costs during polysilicon price spikes.

## Trading Note

Polysilicon spot prices are tracked by PVInsights, Bernreuter Research, and InfoLink. MG-Si is priced via CRU and Fastmarkets assessments with distinct European and Chinese benchmarks. Monitor China's monthly polysilicon production capacity utilization (CPIA data) — oversupply drives prices below marginal cost, triggering producer shutdowns. Track monthly global solar installation data (BloombergNEF, Wood Mackenzie) as the key demand driver. The TAN ETF provides broad solar exposure but inversely correlates with polysilicon price spikes. Watch UFLPA Customs enforcement actions for supply chain disruption signals. Daqo (DQ) and GCL Technology quarterly reports provide direct polysilicon market commentary and cost curve positioning.
