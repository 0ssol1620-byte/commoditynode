---
layout: commodity
title: "Germanium Price Impact: Fiber Optics, Infrared Optics & China Export Controls"
description: "How germanium supply constraints ripple through fiber optic networks, IR military optics, satellite solar cells, and semiconductor substrates amid Chinese export restrictions."
commodity_slug: "germanium"
symbol: ""
sector: "Critical Minerals/Tech"
etfs: ["REMX"]
companies: ["UMICORE", "TECK"]
substitutes: ["Silicon Photonics", "Zinc Selenide IR"]
themes: ["China Export Controls", "Defense Optics", "Fiber Broadband Expansion"]
tags: ["germanium", "fiber optics", "infrared", "critical minerals", "china export controls", "defense optics"]
image: /assets/images/og-germanium.png
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "germanium", "label": "Germanium"},
  "levels": [
    {"nodes": [
      {"id":"ge_price","label":"Germanium Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Critical Minerals"},
      {"id":"remx_ge","label":"REMX Rare Earth ETF","type":"etf","impact":4,"correlation":0.32,"sector":"Critical Minerals"},
      {"id":"yunnan_ge","label":"Yunnan Germanium","type":"producer","impact":10,"correlation":0.85,"sector":"Germanium Mining"},
      {"id":"teck_ge","label":"Teck Resources (TECK)","type":"producer","impact":5,"correlation":0.40,"sector":"Diversified Mining"},
      {"id":"umicore_ge","label":"Umicore (UMICY)","type":"processor","impact":6,"correlation":0.48,"sector":"Refining"},
      {"id":"corning_ge","label":"Corning (GLW)","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Fiber Optics"},
      {"id":"ii_vi_ge","label":"II-VI / Coherent","type":"consumer","impact":-5,"correlation":-0.40,"sector":"IR Optics"},
      {"id":"lmt_ge","label":"Lockheed Martin (LMT)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Defense"},
      {"id":"gallium_rel","label":"Gallium (Related)","type":"commodity","impact":7,"correlation":0.70,"sector":"Critical Minerals"},
      {"id":"zinc_link","label":"Zinc Production Link","type":"macro","impact":5,"correlation":0.42,"sector":"Base Metals"}
    ]},
    {"nodes": [
      {"id":"fiber_mkt","label":"Fiber Optic Cable Market","type":"consumer","impact":-5,"correlation":-0.38,"sector":"Telecom Infrastructure","parentId":"corning_ge"},
      {"id":"ir_lens","label":"IR Thermal Imaging Lenses","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Defense Optics","parentId":"ii_vi_ge"},
      {"id":"sat_solar","label":"Satellite Solar Cells (MJ)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Space","parentId":"lmt_ge"},
      {"id":"ppm_pure","label":"PPM Pure Metals (Germany)","type":"processor","impact":5,"correlation":0.42,"sector":"Refining","parentId":"umicore_ge"},
      {"id":"indium_ge","label":"Indium Corp","type":"processor","impact":4,"correlation":0.32,"sector":"Specialty Metals","parentId":"umicore_ge"},
      {"id":"5g_fiber","label":"5G/FTTH Fiber Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Telecom","parentId":"fiber_mkt"},
      {"id":"flir_ge","label":"FLIR / Teledyne (TDY)","type":"consumer","impact":-4,"correlation":-0.32,"sector":"IR Imaging","parentId":"ir_lens"},
      {"id":"huawei_fiber","label":"Huawei Marine Fiber","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Submarine Cables","parentId":"fiber_mkt"},
      {"id":"spectra_ge","label":"Spectrolab (Boeing)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Space Solar","parentId":"sat_solar"},
      {"id":"coal_byp","label":"Coal Fly Ash Recovery","type":"producer","impact":3,"correlation":0.25,"sector":"Secondary Supply","parentId":"yunnan_ge"}
    ]},
    {"nodes": [
      {"id":"china_ge_ban","label":"China Ge Export Controls","type":"policy","impact":9,"correlation":0.72,"sector":"Geopolitics","parentId":"yunnan_ge"},
      {"id":"si_photonics","label":"Silicon Photonics (Sub)","type":"substitute","impact":-5,"correlation":-0.38,"sector":"Photonics","parentId":"fiber_mkt"},
      {"id":"znse_sub","label":"ZnSe IR Optics (Sub)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"IR Optics","parentId":"ir_lens"},
      {"id":"dxy_ge","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.28,"sector":"Forex","parentId":"ge_price"},
      {"id":"cny_ge","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.30,"sector":"Forex","parentId":"china_ge_ban"},
      {"id":"us_stockpile","label":"US NDS Germanium Stockpile","type":"policy","impact":4,"correlation":0.28,"sector":"Strategic Reserve","parentId":"china_ge_ban"},
      {"id":"eu_crma_ge","label":"EU CRMA Germanium","type":"policy","impact":4,"correlation":0.25,"sector":"Regulation","parentId":"china_ge_ban"},
      {"id":"recycling_ge","label":"Ge Recycling (Optical Scrap)","type":"processor","impact":-3,"correlation":-0.22,"sector":"Recycling","parentId":"ppm_pure"},
      {"id":"pet_catalyst","label":"PET Catalyst Demand","type":"consumer","impact":3,"correlation":0.20,"sector":"Chemicals","parentId":"ge_price"},
      {"id":"canada_supply","label":"Canada Ge Supply (Teck)","type":"regional","impact":4,"correlation":0.30,"sector":"Western Supply","parentId":"teck_ge"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Germanium is a rare semiconductor metalloid produced almost entirely as a by-product of zinc refining and coal fly ash processing. China controls approximately 60% of global germanium production, with the remainder split between Canada, Belgium, and Russia. In August 2023, China imposed export licensing requirements on germanium alongside gallium, signaling strategic resource leverage. Annual global production is roughly 130 tonnes — an extremely thin market. Germanium's key applications span fiber optic cables (GeO₂ dopant for refractive index), infrared thermal imaging lenses (transparent to 8-12μm wavelengths), multi-junction satellite solar cells, and PET plastic catalysts. Its dual military-civilian use makes it a high-priority item on every major nation's critical minerals list.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary — Fiber Optics and Telecom Infrastructure:** Germanium dioxide is the essential dopant in single-mode optical fiber cores, with no commercially viable substitute at scale. Corning and other fiber manufacturers consume roughly 30% of global germanium. As 5G backhaul, FTTH (fiber-to-the-home), and submarine cable deployments accelerate globally, germanium demand from telecom alone is growing 4-6% annually.

**Secondary — Defense and Space Optics:** Germanium's transparency to long-wave infrared makes it irreplaceable for thermal imaging systems — FLIR cameras, missile seekers, and night vision optics all require germanium lenses and windows. Military procurement represents a price-inelastic demand segment. Multi-junction germanium-based solar cells power virtually all commercial satellites and spacecraft, tying germanium supply to space industry growth.

**Tertiary — Substitution Dynamics and Supply Diversification:** Silicon photonics is gradually displacing germanium-doped fiber in short-reach data center interconnects, but long-haul telecom fiber remains germanium-dependent. Zinc selenide can substitute for germanium in some IR applications but with inferior performance. Western governments are investing in germanium recycling from optical scrap and spent fiber, aiming to reduce Chinese dependency.

## Which Companies and ETFs Benefit When the Price Rises?

Yunnan Germanium and other Chinese producers benefit from export control-driven pricing power and strategic leverage. Teck Resources, which produces germanium as a zinc by-product at its Trail smelter in Canada, gains from Western reshoring demand. Umicore's germanium recycling operations in Belgium become strategically critical. Companies developing silicon photonics alternatives (Intel, Cisco) benefit from increased adoption urgency.

## Which Companies and Sectors Are Hurt by a Price Increase?

Fiber optic manufacturers (Corning, Prysmian, Furukawa) face raw material cost escalation with limited pass-through ability in competitive telecom markets. Defense contractors dependent on germanium IR optics (Teledyne FLIR, L3Harris, Leonardo DRS) face supply allocation uncertainty. Satellite manufacturers absorb higher multi-junction solar cell costs. Broadband expansion programs globally face higher infrastructure costs as fiber cable prices rise.

## What Should Traders Watch When Analyzing This Market?

Germanium has no liquid futures market; prices are assessed via Asian Metal, Minor Metals Trade Association, and Fastmarkets. Monitor China MOFCOM germanium export license data monthly — any tightening immediately impacts spot prices. Track zinc smelter production as a leading supply indicator since germanium is extracted from zinc residues. Teck Resources quarterly reports provide visibility into Western germanium output. The germanium/gallium price ratio serves as a gauge of China's critical mineral policy intensity. Watch US National Defense Stockpile (NDS) purchase announcements for demand-side price support signals.
