---
layout: commodity
unit: "$/oz"
image: "/assets/images/og-iridium.png"
title: "Iridium Price Impact: Green Hydrogen, PEM Electrolyzers & PGM Supply Chain"
description: "How iridium price shifts cascade through green hydrogen production, PEM electrolyzer manufacturers, and the South Africa-concentrated PGM supply chain."
commodity_slug: "iridium"
symbol: "SBSW"
sector: "PGM/Clean Energy"
etfs: ["PPLT"]
companies: ["SBSW", "IMPUY"]
substitutes: ["Ruthenium Catalysts", "AEM Electrolyzers"]
themes: ["Green Hydrogen", "Clean Energy Transition"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "iridium", "label": "Iridium"},
  "levels": [
    {"nodes": [
      {"id":"ir_index","label":"Iridium Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"pplt_ir","label":"PPLT Platinum ETF","type":"etf","impact":3,"correlation":0.30,"sector":"PGMs"},
      {"id":"sbsw_ir","label":"Sibanye-Stillwater (SBSW)","type":"producer","impact":8,"correlation":0.65,"sector":"PGM Mining"},
      {"id":"impuy_ir","label":"Impala Platinum (IMPUY)","type":"producer","impact":7,"correlation":0.58,"sector":"PGM Mining"},
      {"id":"anglo_plat","label":"Anglo American Platinum","type":"producer","impact":7,"correlation":0.55,"sector":"PGM Mining"},
      {"id":"pem_electro","label":"PEM Electrolyzer Sector","type":"consumer","impact":-7,"correlation":-0.50,"sector":"Clean Energy"},
      {"id":"spark_plug","label":"Spark Plug Industry","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Automotive"},
      {"id":"crucible","label":"High-Temp Crucibles","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Industrial"},
      {"id":"ichem_ir","label":"Iridium Chemical Catalysts","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Chemicals"},
      {"id":"heraeus_ir","label":"Heraeus (Processing)","type":"processor","impact":5,"correlation":0.40,"sector":"PGM Processing"}
    ]},
    {"nodes": [
      {"id":"plug_ir","label":"Plug Power (PLUG)","type":"consumer","impact":-5,"correlation":-0.38,"sector":"Green Hydrogen","parentId":"pem_electro"},
      {"id":"nel_ir","label":"Nel ASA (NEL)","type":"consumer","impact":-5,"correlation":-0.35,"sector":"Electrolyzer","parentId":"pem_electro"},
      {"id":"itm_ir","label":"ITM Power (ITM.L)","type":"consumer","impact":-5,"correlation":-0.35,"sector":"Electrolyzer","parentId":"pem_electro"},
      {"id":"bloom_ir","label":"Bloom Energy (BE)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Fuel Cells","parentId":"pem_electro"},
      {"id":"johnson_matt","label":"Johnson Matthey","type":"processor","impact":5,"correlation":0.40,"sector":"PGM Processing","parentId":"heraeus_ir"},
      {"id":"tanaka_ir","label":"Tanaka Precious Metals","type":"processor","impact":4,"correlation":0.32,"sector":"PGM Processing","parentId":"heraeus_ir"},
      {"id":"northam_ir","label":"Northam Platinum","type":"producer","impact":5,"correlation":0.42,"sector":"PGM Mining","parentId":"sbsw_ir"},
      {"id":"sa_mines","label":"SA Bushveld Complex","type":"producer","impact":8,"correlation":0.60,"sector":"Mining Region","parentId":"anglo_plat"},
      {"id":"platinum_rel","label":"Platinum (Related)","type":"commodity","impact":5,"correlation":0.55,"sector":"PGMs","parentId":"pplt_ir"},
      {"id":"rhodium_rel","label":"Rhodium (Related)","type":"commodity","impact":4,"correlation":0.45,"sector":"PGMs","parentId":"pplt_ir"}
    ]},
    {"nodes": [
      {"id":"sa_power_crisis","label":"SA Load-Shedding Crisis","type":"policy","impact":7,"correlation":0.50,"sector":"Geopolitics","parentId":"sa_mines"},
      {"id":"aem_sub","label":"AEM Electrolyzer Substitute","type":"substitute","impact":-5,"correlation":-0.35,"sector":"Clean Energy","parentId":"pem_electro"},
      {"id":"ru_catalyst","label":"Ruthenium Catalyst Alt","type":"substitute","impact":-4,"correlation":-0.28,"sector":"Catalysis","parentId":"ichem_ir"},
      {"id":"h2_subsidy","label":"H₂ Production Subsidies","type":"policy","impact":5,"correlation":0.38,"sector":"Policy","parentId":"pem_electro"},
      {"id":"eu_green_deal","label":"EU Green Deal H₂ Target","type":"policy","impact":5,"correlation":0.35,"sector":"Regulation","parentId":"pem_electro"},
      {"id":"dxy_ir","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.25,"sector":"Forex","parentId":"ir_index"},
      {"id":"zar_ir","label":"South African Rand (ZAR)","type":"fx","impact":4,"correlation":0.32,"sector":"Forex","parentId":"sa_mines"},
      {"id":"ir_recycling","label":"Iridium Recycling","type":"processor","impact":-3,"correlation":-0.22,"sector":"Recycling","parentId":"johnson_matt"},
      {"id":"oled_ir","label":"OLED Applications","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Display","parentId":"ichem_ir"},
      {"id":"ev_transition","label":"EV Transition (ICE Decline)","type":"macro","impact":-2,"correlation":-0.15,"sector":"Automotive","parentId":"spark_plug"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Iridium is the rarest stable element used in industrial applications and has become the critical bottleneck for green hydrogen production at scale. As a platinum group metal (PGM), iridium is produced almost exclusively as a minor by-product of platinum and palladium mining in South Africa's Bushveld Complex, with global annual production of merely 7-8 tonnes. This makes iridium one of the scarcest commercially traded metals on Earth. The primary demand driver is proton exchange membrane (PEM) electrolysis, where iridium oxide serves as the anode catalyst -- currently, there is no commercially proven substitute that matches iridium's performance in the acidic PEM environment. With governments worldwide targeting hundreds of gigawatts of electrolyzer capacity by 2030, iridium supply represents a fundamental constraint on green hydrogen deployment speed.

## Key Impact Channels

**Primary -- PEM Electrolyzers and Green Hydrogen:** PEM electrolyzers use iridium oxide coatings on the oxygen evolution reaction (OER) anode, consuming approximately 1-2 grams of iridium per kilowatt of electrolyzer capacity. With global electrolyzer deployment targets exceeding 100 GW by 2030, the implied iridium demand would consume multiples of current annual production. This creates an unprecedented supply-demand mismatch. Companies like Plug Power, Nel ASA, ITM Power, and Siemens Energy face direct cost and availability constraints. The industry is aggressively working to reduce iridium loading through thinner catalyst layers and novel deposition techniques, but even 90% reduction scenarios strain available supply at projected deployment rates.

**Secondary -- PGM Supply Chain Concentration:** South Africa's Bushveld Complex produces approximately 80% of global iridium supply, creating extreme geographic concentration risk. The South African mining industry faces structural challenges including Eskom's load-shedding electricity crisis, aging mine infrastructure, labor disputes, and regulatory uncertainty. Iridium production cannot be increased independently -- it occurs in fixed ratios with platinum and palladium in PGM ore bodies. This means iridium supply is fundamentally constrained by the economics of platinum and palladium mining, which face their own headwinds from the EV transition reducing catalytic converter demand.

**Tertiary -- Substitution and Technology Pathways:** Anion exchange membrane (AEM) electrolysis represents the most promising substitute technology, using nickel or cobalt-based catalysts instead of iridium. However, AEM technology remains at early commercial stage with lower durability and efficiency than PEM systems. Alkaline electrolyzers avoid iridium entirely but sacrifice the dynamic response characteristics that make PEM preferred for renewable energy integration. Iridium recycling from spent catalysts and electronic components can supplement primary supply, but current recycling volumes are minimal relative to projected demand growth.

## Winners

PGM miners (Sibanye-Stillwater, Impala Platinum, Anglo American Platinum) benefit from iridium price rallies with zero marginal production cost since iridium is a by-product. PGM processors (Heraeus, Johnson Matthey, Tanaka) capture margin on refining and fabricating iridium catalysts. AEM electrolyzer developers gain competitive positioning against iridium-dependent PEM technology. Iridium recyclers see dramatically improved economics. Alkaline electrolyzer manufacturers benefit as the technology avoids PGM dependency entirely.

## Losers

PEM electrolyzer manufacturers (Plug Power, Nel ASA, ITM Power, Siemens Energy) face direct cost escalation and potential deployment delays. Green hydrogen project developers see higher capital costs that reduce project economics and subsidy effectiveness. Governments with aggressive hydrogen strategies (EU, Japan, South Korea) face potential timeline slippage on decarbonization targets. Fuel cell manufacturers using PGM catalysts face parallel material cost pressure. Traditional iridium applications (spark plugs, crucibles, OLED compounds) face availability constraints as hydrogen demand absorbs supply.

## Trading Note

Iridium trades through dealer markets with Johnson Matthey and Heraeus base prices published daily. The metal is too illiquid for futures trading, with annual production value under $2 billion. Monitor South African mining production data and Eskom load-shedding schedules for supply indicators. Track electrolyzer order books and deployment announcements from Plug Power, Nel, and ITM Power for demand signals. EU and US hydrogen subsidy policy (EU REPowerEU, US IRA Section 45V) directly influences PEM electrolyzer deployment pace. The iridium loading reduction rate (grams per kilowatt) at commercial PEM systems is the most critical variable for supply-demand modeling. Monitor AEM electrolyzer commercial milestones as the primary substitution threat.
