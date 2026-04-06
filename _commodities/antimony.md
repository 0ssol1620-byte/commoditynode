---
layout: commodity
unit: "$/ton"
image: "/assets/images/og-antimony.png"
title: "Antimony Price Impact: Defense & Flame Retardants"
description: "How antimony price shifts cascade through defense contractors, flame retardant manufacturers, lead-acid batteries, and the China-dominated supply chain."
commodity_slug: "antimony"
symbol: "SBMMF"
sector: "Critical Minerals/Defense"
etfs: ["REMX"]
companies: ["UEC"]
substitutes: ["Tin Alloys", "Aluminum Trihydrate"]
themes: ["Rare Earth", "Defense Rearming"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "antimony", "label": "Antimony"},
  "levels": [
    {"nodes": [
      {"id":"sb_index","label":"Antimony Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"remx_sb","label":"REMX Rare Earth ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Critical Minerals"},
      {"id":"usac_sb","label":"US Antimony (UAMY)","type":"producer","impact":10,"correlation":0.85,"sector":"Mining"},
      {"id":"hsikwang","label":"Hsikwang Shan (China)","type":"producer","impact":8,"correlation":0.70,"sector":"Mining"},
      {"id":"mandalay","label":"Mandalay Resources","type":"producer","impact":6,"correlation":0.55,"sector":"Mining"},
      {"id":"flame_retard","label":"Flame Retardant Sector","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Chemicals"},
      {"id":"lead_acid","label":"Lead-Acid Battery Sector","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Energy Storage"},
      {"id":"ammo_alloy","label":"Ammunition Alloys","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Defense"},
      {"id":"xme_sb","label":"XME Metals Mining ETF","type":"etf","impact":3,"correlation":0.28,"sector":"Mining"},
      {"id":"dod_stockpile","label":"US DoD Stockpile","type":"policy","impact":6,"correlation":0.45,"sector":"Defense"}
    ]},
    {"nodes": [
      {"id":"basf_sb","label":"BASF (Flame Retardants)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Chemicals","parentId":"flame_retard"},
      {"id":"lanxess","label":"Lanxess AG","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Chemicals","parentId":"flame_retard"},
      {"id":"enersys","label":"EnerSys (ENS)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Energy Storage","parentId":"lead_acid"},
      {"id":"gso_sb","label":"GS Yuasa","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Batteries","parentId":"lead_acid"},
      {"id":"olin_sb","label":"Olin Corp (OLN)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Defense","parentId":"ammo_alloy"},
      {"id":"vista_sb","label":"Vista Outdoor","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Ammunition","parentId":"ammo_alloy"},
      {"id":"perpetua","label":"Perpetua Resources (PPTA)","type":"producer","impact":7,"correlation":0.60,"sector":"Mining","parentId":"usac_sb"},
      {"id":"tri_star","label":"Tri-Star Resources","type":"producer","impact":5,"correlation":0.42,"sector":"Mining","parentId":"mandalay"},
      {"id":"hunan_sb","label":"Hunan Nonferrous","type":"producer","impact":7,"correlation":0.58,"sector":"Mining","parentId":"hsikwang"},
      {"id":"sb_trioxide","label":"Antimony Trioxide Market","type":"processor","impact":5,"correlation":0.40,"sector":"Processing","parentId":"flame_retard"}
    ]},
    {"nodes": [
      {"id":"china_export_ctrl","label":"China Export Controls","type":"policy","impact":9,"correlation":0.70,"sector":"Geopolitics","parentId":"hsikwang"},
      {"id":"ath_substitute","label":"ATH Substitute Threat","type":"substitute","impact":-5,"correlation":-0.35,"sector":"Chemicals","parentId":"basf_sb"},
      {"id":"dxy_sb","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.30,"sector":"Forex","parentId":"sb_index"},
      {"id":"cny_sb","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"china_export_ctrl"},
      {"id":"defense_budget","label":"US Defense Budget","type":"macro","impact":5,"correlation":0.38,"sector":"Defense","parentId":"dod_stockpile"},
      {"id":"fire_safety_reg","label":"Fire Safety Regulation","type":"policy","impact":4,"correlation":0.32,"sector":"Regulation","parentId":"flame_retard"},
      {"id":"lead_related","label":"Lead (Related)","type":"commodity","impact":5,"correlation":0.50,"sector":"Metals","parentId":"lead_acid"},
      {"id":"solar_glass","label":"Solar Glass (Sb Use)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Solar","parentId":"sb_trioxide"},
      {"id":"semiconductor_sb","label":"Semiconductor (III-V)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Tech","parentId":"sb_trioxide"},
      {"id":"tajikistan","label":"Tajikistan Supply","type":"producer","impact":4,"correlation":0.30,"sector":"Mining","parentId":"mandalay"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Antimony is one of the most strategically important yet least discussed critical minerals in global commodity markets. China dominates over 80% of worldwide antimony production, creating a supply concentration risk that rivals rare earths. The metal serves three primary end-use markets: flame retardants (accounting for roughly 40% of consumption through antimony trioxide), lead-acid battery hardening alloys, and military applications including ammunition and armor-piercing projectiles. The U.S. Department of Defense has classified antimony as a critical mineral, and the Defense Logistics Agency maintains strategic stockpiles. Annual global production is approximately 83,000 tonnes, with Hunan province in China producing the majority through state-linked mining operations. In 2023-2024, China imposed export controls on antimony, sending prices to multi-decade highs and exposing the West's dependence on Chinese supply for both civilian and military applications.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Defense and Flame Retardants:** Antimony trioxide (ATO) is the dominant synergist in halogenated flame retardant systems used in electronics, textiles, automotive interiors, and construction materials. Roughly 40% of antimony consumption flows through this channel. When antimony prices spike, flame retardant manufacturers face margin compression or must pass costs to downstream industries including consumer electronics and automotive. The defense channel is equally critical -- antimony hardens lead in small-caliber ammunition, is used in tracer rounds, and appears in night-vision optics and infrared sensors. U.S. military consumption creates inelastic demand that cannot easily substitute away.

**Secondary -- Battery and Industrial Applications:** Lead-acid batteries require antimony alloys for grid hardening (antimonial lead), particularly in deep-cycle applications for forklifts, UPS systems, and telecommunications backup power. While calcium-lead alloys have partially displaced antimony in automotive starter batteries, industrial and motive power applications remain dependent. Antimony compounds are also used as catalysts in PET plastic production (polyester bottles and fibers), creating an indirect link to the packaging and textile industries.

**Tertiary -- Geopolitical and Substitution Dynamics:** China's willingness to weaponize antimony exports -- as demonstrated by the 2024 export permit requirements -- has elevated antimony to a frontline commodity in the U.S.-China strategic competition. The Perpetua Resources Stibnite Gold Project in Idaho represents the only significant antimony development project in the U.S., and has received Department of Defense funding. Substitution with aluminum trihydrate (ATH) in flame retardants is technically possible but requires reformulation and compromises fire safety performance, limiting rapid switching.

## Which Companies and ETFs Benefit When the Price Rises?

US Antimony Corporation (UAMY) and Perpetua Resources (PPTA) benefit directly from antimony price rallies and Western reshoring efforts. Defense contractors with antimony-intensive ammunition lines see strategic importance increase, potentially unlocking government procurement support. Tajikistan and other non-Chinese producers gain market share as buyers diversify. Recyclers of lead-acid batteries and electronic waste capture higher value for recovered antimony. Companies developing ATH and non-halogenated flame retardant alternatives gain commercial traction during supply disruptions.

## Which Companies and Sectors Are Hurt by a Price Increase?

Flame retardant manufacturers (BASF, Lanxess, ICL) face direct input cost inflation with limited ability to pass through quickly in formula-based contracts. Electronics and automotive companies absorb higher component costs for fire-rated materials. Ammunition manufacturers including Olin Corporation and Vista Outdoor face margin pressure on military and civilian cartridge production. Lead-acid battery producers (EnerSys, GS Yuasa) see alloy costs rise, particularly for industrial deep-cycle products. PET plastic producers face catalyst cost increases that affect polyester fiber and packaging margins.

## Key Impact Relationships

| Node | Impact (±10% Move) | Correlation | Sector |
|------|-------------------|-------------|--------|
| Antimony Price Index | +10.0% | 0.99 | Commodities |
| REMX Rare Earth ETF | +4.0% | 0.35 | Critical Minerals |
| US Antimony (UAMY) | +10.0% | 0.85 | Mining |
| Hsikwang Shan (China) | +8.0% | 0.70 | Mining |
| Mandalay Resources | +6.0% | 0.55 | Mining |
| Flame Retardant Sector | −5.0% | −0.40 | Chemicals |
| Lead-Acid Battery Sector | −3.0% | −0.25 | Energy Storage |
| Ammunition Alloys | −4.0% | −0.30 | Defense |
| XME Metals Mining ETF | +3.0% | 0.28 | Mining |
| US DoD Stockpile | +6.0% | 0.45 | Defense |

## What Should Traders Watch When Analyzing This Market?

Antimony does not trade on major commodity exchanges -- pricing is based on Metal Bulletin and Asian Metals assessments for antimony metal and antimony trioxide. Monitor China's Ministry of Commerce export permit announcements for supply-side disruptions. The Perpetua Resources project timeline is a key Western supply catalyst. Track U.S. Defense Production Act invocations and DLA stockpile purchase announcements for demand signals. The antimony/lead price ratio indicates battery alloy substitution economics. Chinese domestic antimony prices in RMB/ton often lead international markets by 2-4 weeks.
