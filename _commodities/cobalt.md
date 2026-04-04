---
layout: commodity
unit: "$/ton"
image: "/assets/images/og-cobalt.png"
title: "Cobalt Price Impact: EV Batteries, Supply Chain Risk & Mining Stocks"
description: "How cobalt price shifts cascade through EV battery manufacturers, smartphone supply chains, DRC geopolitical risk, and companies like Glencore and CATL."
commodity_slug: "cobalt"
symbol: "GLNCY"
sector: "Battery Metals"
etfs: ["BATT"]
companies: ["GLNCY"]
substitutes: ["LFP Chemistry", "High-Nickel NMC"]
themes: ["EV Transition", "Supply Chain Disruption"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "cobalt", "label": "Cobalt"},
  "levels": [
    {"nodes": [
      {"id":"batt_co","label":"BATT Battery ETF","type":"etf","impact":5,"correlation":0.45,"sector":"Battery Metals"},
      {"id":"lit_co","label":"LIT Lithium Battery ETF","type":"etf","impact":4,"correlation":0.38,"sector":"Battery Metals"},
      {"id":"glncy_co","label":"Glencore (GLNCY)","type":"producer","impact":8,"correlation":0.70,"sector":"Diversified Mining"},
      {"id":"cmclf","label":"CMOC Group (CMCLF)","type":"producer","impact":10,"correlation":0.80,"sector":"Cobalt Mining"},
      {"id":"cobalt_index","label":"Cobalt Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"tsla_co","label":"Tesla (TSLA)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"EV"},
      {"id":"aapl_co","label":"Apple (AAPL)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Consumer Electronics"},
      {"id":"vale_co","label":"Vale SA (VALE)","type":"producer","impact":4,"correlation":0.35,"sector":"Diversified Mining"},
      {"id":"bhp_co","label":"BHP Group (BHP)","type":"producer","impact":3,"correlation":0.28,"sector":"Diversified Mining"},
      {"id":"xme_co","label":"XME Metals Mining ETF","type":"etf","impact":4,"correlation":0.38,"sector":"Mining"}
    ]},
    {"nodes": [
      {"id":"catl_co","label":"CATL Battery","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Batteries","parentId":"tsla_co"},
      {"id":"panasonic_co","label":"Panasonic (PCRFY)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Batteries","parentId":"tsla_co"},
      {"id":"samsung_sdi_co","label":"Samsung SDI","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Batteries","parentId":"aapl_co"},
      {"id":"gm_co","label":"General Motors (GM)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Automotive","parentId":"tsla_co"},
      {"id":"rivn_co","label":"Rivian (RIVN)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"EV","parentId":"tsla_co"},
      {"id":"hon_co","label":"Honeywell (HON)","type":"consumer","impact":-1,"correlation":-0.10,"sector":"Aerospace","parentId":"aapl_co"},
      {"id":"superalloys","label":"Superalloy Sector","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Aerospace","parentId":"bhp_co"},
      {"id":"ivn_co","label":"Ivanhoe Mines (IVN)","type":"producer","impact":7,"correlation":0.55,"sector":"Mining","parentId":"glncy_co"},
      {"id":"erg_co","label":"ERG Africa (Mining)","type":"producer","impact":8,"correlation":0.65,"sector":"Cobalt Mining","parentId":"cmclf"},
      {"id":"freeport_co","label":"Freeport Cobalt","type":"processor","impact":5,"correlation":0.40,"sector":"Processing","parentId":"glncy_co"},
      {"id":"umicore","label":"Umicore (UMICY)","type":"processor","impact":4,"correlation":0.32,"sector":"Refining","parentId":"freeport_co"}
    ]},
    {"nodes": [
      {"id":"lfp_threat","label":"LFP Chemistry (Threat)","type":"substitute","impact":-7,"correlation":-0.50,"sector":"Battery Tech","parentId":"catl_co"},
      {"id":"high_ni_nmc","label":"High-Nickel NMC","type":"substitute","impact":-5,"correlation":-0.38,"sector":"Battery Tech","parentId":"panasonic_co"},
      {"id":"drc_risk","label":"DRC Political Risk","type":"policy","impact":8,"correlation":0.55,"sector":"Geopolitics","parentId":"cmclf"},
      {"id":"child_labor","label":"ESG Supply Chain Risk","type":"policy","impact":5,"correlation":0.35,"sector":"ESG","parentId":"drc_risk"},
      {"id":"dxy_co","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.38,"sector":"Forex","parentId":"cobalt_index"},
      {"id":"cdf_co","label":"Congolese Franc (CDF)","type":"fx","impact":5,"correlation":0.35,"sector":"Forex","parentId":"drc_risk"},
      {"id":"ev_adoption_co","label":"Global EV Adoption","type":"macro","impact":6,"correlation":0.45,"sector":"EV Demand","parentId":"tsla_co"},
      {"id":"recycling_co","label":"Cobalt Recycling","type":"processor","impact":-4,"correlation":-0.30,"sector":"Recycling","parentId":"umicore"},
      {"id":"nickel_related_co","label":"Nickel (Related)","type":"commodity","impact":6,"correlation":0.60,"sector":"Battery Metals","parentId":"lit_co"},
      {"id":"lithium_related_co","label":"Lithium (Related)","type":"commodity","impact":5,"correlation":0.50,"sector":"Battery Metals","parentId":"lit_co"},
      {"id":"ba_co","label":"Boeing (BA)","type":"consumer","impact":-1,"correlation":-0.08,"sector":"Aerospace","parentId":"superalloys"},
      {"id":"ge_co","label":"GE Aerospace (GE)","type":"consumer","impact":-1,"correlation":-0.08,"sector":"Aerospace","parentId":"superalloys"}
    ]},
    {"nodes": [
      {"id":"solid_state","label":"Solid-State Batteries","type":"substitute","impact":-4,"correlation":-0.25,"sector":"Future Tech","parentId":"lfp_threat"},
      {"id":"artisanal_mining","label":"Artisanal Mining Reform","type":"policy","impact":4,"correlation":0.28,"sector":"Regulation","parentId":"child_labor"},
      {"id":"china_refining","label":"China Cobalt Refining","type":"processor","impact":5,"correlation":0.40,"sector":"Processing","parentId":"freeport_co"},
      {"id":"battery_recyc_mandate","label":"Battery Recycling Mandate","type":"policy","impact":3,"correlation":0.22,"sector":"Regulation","parentId":"recycling_co"},
      {"id":"grid_storage_co","label":"Grid Storage Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Energy Storage","parentId":"ev_adoption_co"},
      {"id":"smartphone_demand","label":"Smartphone Demand","type":"macro","impact":3,"correlation":0.22,"sector":"Electronics","parentId":"samsung_sdi_co"},
      {"id":"defense_alloys","label":"Defense Superalloys","type":"consumer","impact":2,"correlation":0.15,"sector":"Defense","parentId":"superalloys"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Cobalt is one of the most geopolitically concentrated commodities in the world, with the Democratic Republic of Congo producing over 70% of global mine supply. The metal is essential for battery cathode stability in NMC (nickel manganese cobalt) chemistries, but its supply chain -- including artisanal mining concerns in the DRC and Chinese dominance of refining -- has made it a focal point for ethical sourcing scrutiny. Critically, cobalt is primarily produced as a by-product of copper and nickel mining, meaning its supply responds to those metals' economics rather than its own price signals. Annual global production is approximately 200,000 tonnes, a tiny market relative to its strategic importance.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** NMC 811 (80% nickel, 10% manganese, 10% cobalt) and NMC 622 cathode chemistries require cobalt for thermal stability and cycle life performance. Glencore operates the largest cobalt mines globally (Mutanda, Katanga in the DRC), while Chinese refiners (CMOC, Huayou Cobalt) dominate processing. The industry push to reduce cobalt content per battery cell has been partially offset by sheer volume growth in EV production.

**Secondary -- Supply Chain and Processing:** Artisanal and small-scale mining (ASM) in the DRC accounts for 15-20% of cobalt production and has drawn international attention over child labor and unsafe working conditions. Automakers and battery producers face reputational risk and regulatory pressure (EU Battery Regulation) to demonstrate responsible sourcing. Blockchain-based traceability platforms and third-party audits are becoming industry requirements, adding supply chain costs. Chinese-owned processing facilities in the DRC and Indonesia are vertically integrating to secure offtake, concentrating midstream control.

**Tertiary -- Macro and Second-Order Effects:** As first-generation EV batteries reach end of life, cobalt recycling is becoming economically viable. Recovered cobalt from spent batteries can satisfy 10-20% of demand by 2030, partially alleviating primary supply constraints. Companies developing hydrometallurgical recycling processes (Li-Cycle, Redwood Materials) represent an emerging supply source that reduces DRC dependency. Geopolitical competition between the U.S. and China for critical mineral supply chains has elevated cobalt to a national security priority, driving investment in non-DRC sources.

## Which Companies and ETFs Benefit When the Price Rises?

Cobalt price rallies disproportionately benefit Glencore (GLNCY), which controls the largest share of primary production and can ramp or idle DRC operations strategically. CMOC Group, which acquired the Tenke Fungurume mine, captures margin expansion on both mining and refining. DRC government revenues surge through royalties and export levies. Battery recyclers benefit as higher cobalt prices improve the economics of recovering metal from spent cells.

## Which Companies and Sectors Are Hurt by a Price Increase?

EV battery manufacturers including CATL, LG Energy Solution, and Samsung SDI face direct cathode material cost inflation that compresses cell-level margins. Automakers absorb higher battery pack costs or pass them through to consumers, risking demand destruction. Consumer electronics companies (smartphones, laptops) face input cost pressure on a product category where cobalt usage per unit is small but aggregate volume is substantial. Ethical sourcing compliance costs escalate during supply tightness as buyers compete for certified material.

## What Should Traders Watch When Analyzing This Market?

Cobalt lacks a liquid exchange-traded futures contract, with pricing set through Fastmarkets and Metal Bulletin assessments. Monitor Glencore's production reports for supply-side direction, as single-company decisions (Mutanda mine suspension in 2019) can move the entire market. DRC fiscal policy (royalty increases, export taxes) represents a persistent regulatory risk. The LFP battery adoption rate is the most important demand-side variable -- faster LFP adoption structurally reduces cobalt consumption growth. Track Chinese cobalt metal and cobalt hydroxide prices for real-time market signals. The cobalt/lithium price ratio indicates relative battery chemistry economics and substitution incentives.
