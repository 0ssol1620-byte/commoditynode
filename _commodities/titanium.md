---
layout: commodity
unit: "$/kg"
image: "/assets/images/og-titanium.png"
title: "Titanium Price Impact: Aerospace, Defense, Medical & Russia Supply Risk"
description: "How titanium price shifts cascade through aerospace manufacturers, defense contractors, medical implants, and the Russia-dominated supply chain."
commodity_slug: "titanium"
symbol: "TIE"
sector: "Aerospace/Defense"
etfs: ["ITA", "XAR"]
companies: ["TIE", "HWM"]
substitutes: ["Advanced Aluminum Alloys", "Carbon Fiber Composites"]
themes: ["Aerospace Supply Chain", "Defense Reshoring"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "titanium", "label": "Titanium"},
  "levels": [
    {"nodes": [
      {"id":"ti_index","label":"Titanium Sponge Price","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"ita_ti","label":"ITA Aerospace ETF","type":"etf","impact":-4,"correlation":-0.30,"sector":"Aerospace"},
      {"id":"xar_ti","label":"XAR Aerospace & Defense ETF","type":"etf","impact":-3,"correlation":-0.25,"sector":"Defense"},
      {"id":"vsmpo","label":"VSMPO-AVISMA (Russia)","type":"producer","impact":9,"correlation":0.75,"sector":"Titanium"},
      {"id":"timet","label":"Titanium Metals (TIE)","type":"producer","impact":8,"correlation":0.70,"sector":"Titanium"},
      {"id":"howmet","label":"Howmet Aerospace (HWM)","type":"producer","impact":7,"correlation":0.55,"sector":"Aerostructures"},
      {"id":"boeing_ti","label":"Boeing (BA)","type":"consumer","impact":-6,"correlation":-0.45,"sector":"Aerospace"},
      {"id":"airbus_ti","label":"Airbus (AIR.PA)","type":"consumer","impact":-6,"correlation":-0.42,"sector":"Aerospace"},
      {"id":"lmt_ti","label":"Lockheed Martin (LMT)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Defense"},
      {"id":"medical_ti","label":"Medical Implant Sector","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Medical"}
    ]},
    {"nodes": [
      {"id":"ge_aero_ti","label":"GE Aerospace (GE)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Engines","parentId":"boeing_ti"},
      {"id":"rtx_ti","label":"RTX (Pratt & Whitney)","type":"consumer","impact":-4,"correlation":-0.28,"sector":"Engines","parentId":"airbus_ti"},
      {"id":"saf_ti","label":"Safran (SAF.PA)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Engines","parentId":"airbus_ti"},
      {"id":"f35_ti","label":"F-35 Program","type":"consumer","impact":-5,"correlation":-0.38,"sector":"Military","parentId":"lmt_ti"},
      {"id":"stryker_ti","label":"Stryker (SYK)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Medical","parentId":"medical_ti"},
      {"id":"zimmer_ti","label":"Zimmer Biomet (ZBH)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Medical","parentId":"medical_ti"},
      {"id":"ati_ti","label":"ATI Inc (ATI)","type":"producer","impact":6,"correlation":0.50,"sector":"Specialty Metals","parentId":"timet"},
      {"id":"toho_ti","label":"Toho Titanium (Japan)","type":"producer","impact":5,"correlation":0.42,"sector":"Titanium","parentId":"timet"},
      {"id":"kronos_ti","label":"Kronos Worldwide (KRO)","type":"producer","impact":4,"correlation":0.35,"sector":"TiO₂ Pigment","parentId":"ti_index"},
      {"id":"tronox_ti","label":"Tronox (TROX)","type":"producer","impact":4,"correlation":0.32,"sector":"TiO₂ Pigment","parentId":"ti_index"}
    ]},
    {"nodes": [
      {"id":"russia_sanctions","label":"Russia Sanctions Risk","type":"policy","impact":8,"correlation":0.60,"sector":"Geopolitics","parentId":"vsmpo"},
      {"id":"cfrp_sub","label":"Carbon Fiber Composite Sub","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Composites","parentId":"boeing_ti"},
      {"id":"al_li_sub","label":"Al-Li Alloy Substitute","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Metals","parentId":"airbus_ti"},
      {"id":"dxy_ti","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.25,"sector":"Forex","parentId":"ti_index"},
      {"id":"rub_ti","label":"Russian Ruble (RUB)","type":"fx","impact":4,"correlation":0.30,"sector":"Forex","parentId":"vsmpo"},
      {"id":"aircraft_backlog","label":"Aircraft Order Backlog","type":"macro","impact":6,"correlation":0.42,"sector":"Aerospace","parentId":"boeing_ti"},
      {"id":"defense_spend","label":"Global Defense Spending","type":"macro","impact":5,"correlation":0.35,"sector":"Defense","parentId":"lmt_ti"},
      {"id":"3d_print_ti","label":"3D Printing (Ti Powder)","type":"consumer","impact":4,"correlation":0.30,"sector":"Manufacturing","parentId":"ati_ti"},
      {"id":"desalination","label":"Desalination Plants","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Water","parentId":"medical_ti"},
      {"id":"china_sponge","label":"China Sponge Production","type":"producer","impact":5,"correlation":0.38,"sector":"Titanium","parentId":"toho_ti"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Titanium is the aerospace and defense industry's irreplaceable structural metal -- combining exceptional strength-to-weight ratio, corrosion resistance, and biocompatibility that no alternative fully replicates. The global titanium sponge market is approximately 200,000 tonnes annually, with the metal consumed primarily by aerospace (50%+), industrial applications (30%), and medical devices (10%). Russia's VSMPO-AVISMA historically supplied roughly 30% of the world's aerospace-grade titanium, including approximately 35% of Boeing's and 50% of Airbus's titanium requirements prior to the 2022 invasion of Ukraine. Western sanctions and voluntary supply chain de-risking have forced the aerospace industry into an urgent reshoring effort, driving investment in U.S., Japanese, and Kazakh titanium production capacity. Titanium dioxide (TiO₂) pigment production represents a separate and much larger market by volume, but aerospace-grade titanium sponge and mill products command premium pricing and face distinct supply-demand dynamics.

## Key Impact Channels

**Primary -- Aerospace Structural Components:** Modern commercial aircraft use 15-20% titanium by weight, concentrated in landing gear, wing structures, fasteners, and engine components. The Boeing 787 Dreamliner uses approximately 15% titanium, while the Airbus A350 contains roughly 14%. Military aircraft are even more titanium-intensive -- the F-35 Joint Strike Fighter airframe is approximately 15% titanium, with each aircraft consuming roughly 60 tonnes of titanium alloy input (including machining waste). With Boeing and Airbus order backlogs exceeding 12,000 aircraft combined, titanium demand from aerospace is locked in for years ahead. Price increases directly impact aircraft manufacturing economics and potentially affect delivery schedules.

**Secondary -- Engine and Defense Applications:** Jet engine components represent the highest-value titanium applications, with fan blades, compressor discs, and engine casings requiring specialized titanium alloys (Ti-6Al-4V being the dominant grade). GE Aerospace, Pratt & Whitney (RTX), and Safran consume substantial titanium volumes. The defense sector's demand is growing as global military spending rises, with titanium required for armor plating, naval vessel components, missile systems, and spacecraft. Additive manufacturing (3D printing) of titanium parts is a rapidly growing segment that uses specialized titanium powder and could transform supply chain economics by dramatically reducing machining waste ratios.

**Tertiary -- Supply Reshoring and Medical:** The aerospace industry's post-2022 effort to reduce Russian titanium dependency has driven significant investment in Western production capacity. ATI, Howmet Aerospace, and Japanese producers (Toho Titanium, Osaka Titanium) are expanding. Kazakhstan's UKTMP has emerged as an alternative supply source. Medical-grade titanium for orthopedic implants (hip and knee replacements), dental implants, and surgical instruments represents a premium market segment with growing demand from aging populations in developed economies. Carbon fiber reinforced polymer (CFRP) composites are the primary structural substitute in aerospace, but titanium remains essential where temperature resistance, damage tolerance, and galvanic compatibility with CFRP are required.

## Winners

Western titanium producers (ATI, Howmet Aerospace, Toho Titanium) benefit from both price increases and market share gains as the industry de-risks from Russian supply. Kazakhstan's UKTMP gains strategic importance. Titanium recyclers benefit from high prices improving scrap economics. Defense contractors may receive government support for titanium supply chain security. TiO₂ pigment producers (Kronos, Tronox, Chemours) benefit from titanium mineral price increases. Additive manufacturing companies using titanium powder see growing adoption as the technology reduces material waste.

## Losers

Boeing and Airbus face direct structural cost increases on their largest production programs. Engine manufacturers (GE Aerospace, RTX, Safran) absorb higher input costs on long-term contracts. Defense programs face potential cost overruns when titanium prices spike. Medical device companies (Stryker, Zimmer Biomet, DePuy) face higher implant material costs. Smaller aerospace suppliers and machining shops face working capital pressure from higher raw material costs.

## Trading Note

Titanium sponge does not trade on commodity exchanges -- pricing follows CRU Group and Platts assessments for various grades and forms. Monitor VSMPO-AVISMA sanctions developments and Russian export data for supply disruption signals. Boeing and Airbus delivery rates and order backlog data drive demand forecasts. Track ATI and Howmet Aerospace earnings for Western capacity expansion timelines. The titanium sponge/scrap price spread indicates recycling economics and supply tightness. Defense budget appropriations for major titanium-intensive platforms (F-35, B-21, Virginia-class submarines) provide demand visibility. China's titanium sponge production data from the China Nonferrous Metals Industry Association offers a supply indicator, though Chinese material is largely consumed domestically.
