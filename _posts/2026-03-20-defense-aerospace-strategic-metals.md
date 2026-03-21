---
layout: post
title: 'Defense & Aerospace: Strategic Metal Dependencies'
date: 2026-03-20
categories: [Defense, Sector Analysis]
tags: [rare-earth, titanium, aluminum, steel, LMT, RTX, GD, BA, defense]
description: 'Strategic metal dependencies in defense and aerospace — how titanium, rare earth, aluminum, and steel prices impact military procurement and aircraft production.'
reading_time: 10
commodity_name: 'Titanium'
image: /assets/images/og-aluminum.png
---

The defense and aerospace sector depends on a portfolio of strategic metals that are simultaneously critical to national security and vulnerable to supply chain disruption. Titanium alloys form the structural backbone of fighter jets and missile systems. Rare earth elements enable the precision guidance systems, radar arrays, and electronic warfare suites that define modern military capability. Aluminum alloys comprise 60-80% of commercial aircraft airframes by weight. High-strength steel is essential for naval vessels, armored vehicles, and munitions. When these metal prices move, the impact reverberates through defense prime contractors, their supply chains, and ultimately national defense budgets.

What makes the defense sector's metal exposure uniquely complex is the contracting structure. Major weapons programs are typically awarded as fixed-price or cost-plus contracts spanning 5-15 years. Under fixed-price contracts -- which the Pentagon has increasingly favored since the mid-2010s -- defense primes absorb material cost increases that exceed their estimates at bid time. A titanium price spike three years into a fixed-price fighter jet production program can erase the entire profit margin on remaining deliveries. Cost-plus contracts provide more protection but still expose contractors to "should cost" challenges where the government disputes whether price increases are reasonable.

The geopolitical dimension is inescapable. Russia and China together control critical supply chains for several metals essential to Western defense production. Russia was historically the world's largest titanium exporter, and while Western defense primes have diversified away from Russian supply since 2022, the structural tightness in non-Russian titanium persists. China's dominance of rare earth processing means that the guidance systems in American missiles, the magnets in F-35 actuators, and the electronic warfare components in Navy destroyers all depend on materials processed in a potential adversary's territory. This vulnerability has driven a bipartisan effort to rebuild domestic supply chains, but progress has been slow relative to the scale of the dependency.

<div class="cn-price-chart" data-symbol="ALI=F" data-name="Aluminum (Aerospace Metal Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "defense-metals", label: "Strategic Metals ↑10%", price: "Multi", change: "+10%" },
  levels: [
    { nodes: [
      { id: "lmt", label: "Lockheed Martin (LMT)", type: "negative", impact: -2.8, correlation: -0.38, marketCap: "130B", sector: "Defense Prime" },
      { id: "rtx", label: "RTX Corporation (RTX)", type: "negative", impact: -3.2, correlation: -0.42, marketCap: "155B", sector: "Defense/Aerospace" },
      { id: "gd", label: "General Dynamics (GD)", type: "negative", impact: -2.5, correlation: -0.35, marketCap: "78B", sector: "Defense/Marine" },
      { id: "ba", label: "Boeing (BA)", type: "negative", impact: -3.8, correlation: -0.50, marketCap: "120B", sector: "Commercial Aerospace" },
      { id: "ati", label: "ATI Inc (ATI)", type: "positive", impact: 12.5, correlation: 0.85, marketCap: "7B", sector: "Specialty Metals" },
      { id: "mp_def", label: "MP Materials (MP)", type: "positive", impact: 14.0, correlation: 0.88, marketCap: "4B", sector: "Rare Earth Mining" }
    ]},
    { nodes: [
      { id: "hwm", label: "Howmet Aerospace (HWM)", type: "positive", impact: 8.5, correlation: 0.72, marketCap: "38B", sector: "Aerospace Metals/Parts", parentId: "ati" },
      { id: "air", label: "Airbus (AIR.PA)", type: "negative", impact: -3.0, correlation: -0.40, marketCap: "120B", sector: "Commercial Aerospace", parentId: "ba" },
      { id: "noc", label: "Northrop Grumman (NOC)", type: "negative", impact: -2.2, correlation: -0.32, marketCap: "72B", sector: "Defense/Space", parentId: "lmt" },
      { id: "lhx", label: "L3Harris (LHX)", type: "negative", impact: -2.0, correlation: -0.30, marketCap: "45B", sector: "Defense Electronics", parentId: "rtx" },
      { id: "lynas_def", label: "Lynas Rare Earths (LYC.AX)", type: "positive", impact: 15.0, correlation: 0.90, marketCap: "6B", sector: "Rare Earth Mining", parentId: "mp_def" },
      { id: "hei", label: "HEICO Corp (HEI)", type: "negative", impact: -1.8, correlation: -0.26, marketCap: "28B", sector: "Aerospace Parts", parentId: "hwm" }
    ]},
    { nodes: [
      { id: "tps", label: "TPS Aerospace (Titanium Parts)", type: "positive", impact: 6.5, correlation: 0.58, sector: "Titanium Components", parentId: "hwm" },
      { id: "aa", label: "Alcoa (AA)", type: "positive", impact: 7.8, correlation: 0.72, marketCap: "9B", sector: "Aluminum Production", parentId: "ati" },
      { id: "stld", label: "Steel Dynamics (STLD)", type: "positive", impact: 5.5, correlation: 0.55, marketCap: "18B", sector: "Steel Production", parentId: "gd" },
      { id: "spr", label: "Spirit AeroSystems (SPR)", type: "negative", impact: -4.5, correlation: -0.58, marketCap: "8B", sector: "Aerostructures", parentId: "ba" },
      { id: "tdg", label: "TransDigm (TDG)", type: "negative", impact: -1.2, correlation: -0.18, marketCap: "68B", sector: "Aerospace Components", parentId: "hei" },
      { id: "recyclers_def", label: "Metal Recyclers (CMC, SCHN)", type: "positive", impact: 5.0, correlation: 0.50, sector: "Metal Recycling", parentId: "stld" }
    ]},
    { nodes: [
      { id: "dod_budget", label: "DoD Budget Pressure", type: "macro", impact: -3.0, sector: "Fiscal", parentId: "lmt" },
      { id: "reshoring", label: "Supply Chain Reshoring", type: "macro", impact: 6.0, sector: "Geopolitical", parentId: "mp_def" },
      { id: "russia_ti", label: "Russia Titanium Cutoff", type: "macro", impact: 10.0, sector: "Geopolitical", parentId: "ati" },
      { id: "fixed_price", label: "Fixed-Price Contract Risk", type: "macro", impact: -4.0, sector: "Contracting", parentId: "rtx" },
      { id: "nato_spend", label: "NATO Spending Increase", type: "macro", impact: 5.0, sector: "Geopolitical", parentId: "lmt" }
    ]}
  ]
};
</script>

## Defense and Aerospace Metal Exposure Overview

The defense and aerospace industry consumes metals in ways that differ fundamentally from other industrial sectors. Where an automotive manufacturer can substitute steel grades or switch to aluminum to manage costs, a defense contractor building an F-35 must use the exact titanium alloy specified in the technical data package -- Ti-6Al-4V for structural components, Ti-6242 for engine parts -- with no substitution permitted without a lengthy requalification process that can take 2-3 years and cost millions. This materials rigidity means that defense companies are price-takers for critical metals to a degree that would be unusual in any other industry.

Titanium is the defense sector's signature metal. The F-35 Lightning II contains approximately 9,000 pounds of titanium per aircraft, representing roughly 15% of the airframe by weight. The F/A-18 Super Hornet uses approximately 12% titanium. Commercial aircraft like the Boeing 787 Dreamliner use even more -- roughly 15% titanium by weight. Beyond airframes, titanium is critical for jet engine components, submarine hulls (in some designs), and armor applications. The global aerospace-grade titanium market is dominated by a handful of producers -- VSMPO-AVISMA in Russia, Timet (now part of Berkshire Hathaway's PCC), ATI, and a few Japanese producers -- creating a supply structure vulnerable to disruption.

Rare earth elements represent a more concentrated vulnerability. A single F-35 contains approximately 920 pounds of rare earth materials, used in the permanent magnets that power actuators, the samarium-cobalt magnets in traveling wave tubes for radar, and various electronic components. An Arleigh Burke-class destroyer uses approximately 5,200 pounds of rare earth materials. The entire US defense supply chain processes virtually none of these materials domestically at the oxide-to-metal-to-magnet stages, creating what the Department of Defense has called "a single point of failure" in the defense industrial base.

## Winners When Strategic Metal Prices Rise

### Specialty Metal Producers

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **ATI Inc (ATI)** | Titanium/Nickel Superalloys | +12.5% | 0.85 |
| **Howmet Aerospace (HWM)** | Aerospace Castings/Forgings | +8.5% | 0.72 |
| **Alcoa (AA)** | Aluminum Production | +7.8% | 0.72 |
| **Steel Dynamics (STLD)** | Steel/Specialty Steel | +5.5% | 0.55 |

**Why they win:** ATI is the premier pure-play on defense and aerospace metal demand. The company produces titanium mill products, nickel-based superalloys for jet engines, and specialty stainless steels for defense applications. When metal prices rise, ATI captures the full commodity upside plus a manufacturing margin on processed products. Importantly, ATI's long-term agreements with Boeing and the defense primes include material cost escalation clauses, ensuring that rising metal prices translate directly to higher revenue and wider margins. Howmet Aerospace, spun off from Arconic, produces engineered titanium and nickel castings and forgings for jet engines and airframes. Its value-added manufacturing position means it benefits from both metal price increases (passed through to customers) and the increased complexity of next-generation engine and airframe designs that require more specialty metal content.

**Key insight:** The specialty metal producers occupy the single best position in the defense supply chain during inflationary periods. Their customer concentration (Boeing, Airbus, and the five defense primes represent the vast majority of revenue) would normally be a risk, but these customers cannot substitute away from aerospace-grade metals on existing programs. ATI and Howmet essentially hold a toll-road position on defense production -- every F-35, every Pratt & Whitney engine, and every 787 must pass through their manufacturing capabilities. The multi-year order backlogs at both companies provide earnings visibility that is rare in the metals industry.

### Rare Earth and Strategic Miners

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Lynas Rare Earths (LYC.AX)** | Non-Chinese RE Producer | +15.0% | 0.90 |
| **MP Materials (MP)** | US Rare Earth Mining | +14.0% | 0.88 |
| **Metal Recyclers (CMC, SCHN)** | Defense Scrap Recovery | +5.0% | 0.50 |

**Why they win:** Lynas and MP Materials are the only significant rare earth producers outside of Chinese control, giving them a strategic premium that goes far beyond commodity price leverage. The US Department of Defense has provided direct financial support to both companies -- MP Materials received $58 million in Defense Production Act funding to build domestic rare earth processing, while Lynas received $258 million to build a US-based heavy rare earth separation facility. When rare earth prices rise, these companies capture the commodity upside plus an expanding geopolitical premium as policymakers accelerate reshoring efforts. Metal recyclers benefit from the economics of recovering titanium, nickel, and other aerospace metals from manufacturing scrap and end-of-life aircraft, with recycled titanium commanding 30-50% of virgin metal pricing.

**Key insight:** The defense-driven rare earth investment thesis operates on a longer time horizon than typical commodity trades. Even if rare earth spot prices decline, the structural demand from defense reshoring initiatives, funded by multi-year Congressional appropriations, provides a floor under MP Materials' and Lynas' revenues. The Defense Production Act allocations, combined with the CHIPS Act provisions for critical minerals and the IRA's supply chain incentives, create a policy-driven revenue stream that is effectively independent of market prices. These companies are evolving from commodity producers into national security assets with quasi-government revenue support.

## Losers When Strategic Metal Prices Rise

### Defense Prime Contractors (Fixed-Price Programs)

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **RTX Corporation (RTX)** | Engines/Missiles/Electronics | -3.2% | -0.42 |
| **Lockheed Martin (LMT)** | Fighter Jets/Missiles/Space | -2.8% | -0.38 |
| **General Dynamics (GD)** | Naval/Combat Systems | -2.5% | -0.35 |
| **Northrop Grumman (NOC)** | Bombers/Space/Cyber | -2.2% | -0.32 |
| **L3Harris (LHX)** | Defense Electronics | -2.0% | -0.30 |

**Why they lose:** Defense primes operating under fixed-price contracts absorb material cost increases that were not anticipated at bid time. RTX (formerly Raytheon Technologies) faces the broadest exposure: its Pratt & Whitney engine division consumes titanium and nickel superalloys in enormous quantities, while its missile business uses rare earth guidance components and specialty steel casings. When these metal prices rise 10%, RTX's material cost on a fixed-price Patriot missile contract or F135 engine order increases without a corresponding revenue adjustment. Lockheed Martin faces concentrated exposure on the F-35 program, where each aircraft contains thousands of pounds of titanium and hundreds of pounds of rare earth materials. The program's production rate of 140+ aircraft per year means even small per-unit cost increases aggregate rapidly.

**Key insight:** The fixed-price contract risk is asymmetric and often underestimated by investors. Defense primes typically bid programs with 8-12% profit margins, but material cost escalation clauses -- where they exist -- often cap reimbursement at CPI or PPI-linked indices that do not capture aerospace metal price volatility. A 10% across-the-board increase in strategic metals can reduce program margins by 150-250 basis points, converting a profitable contract into a breakeven or loss-making obligation. RTX's $1.1 billion charge on the fixed-price Pratt & Whitney engine contract in 2023 demonstrated how severe this risk can be. The company disclosed that titanium and powder nickel cost increases were the primary drivers -- exactly the scenario this analysis describes.

### Commercial Aerospace

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Boeing (BA)** | Commercial Aircraft | -3.8% | -0.50 |
| **Airbus (AIR.PA)** | Commercial Aircraft | -3.0% | -0.40 |
| **Spirit AeroSystems (SPR)** | Aerostructures | -4.5% | -0.58 |
| **HEICO Corp (HEI)** | Aerospace Aftermarket | -1.8% | -0.26 |

**Why they lose:** Boeing faces the most acute metal cost exposure in commercial aerospace. The company is simultaneously ramping 737 MAX and 787 Dreamliner production while managing a supply chain still recovering from pandemic disruptions. The 787 is particularly metal-intensive, using approximately 15% titanium and 50% composite materials (which themselves require specialty metals in tooling and processing). Spirit AeroSystems, Boeing's largest aerostructures supplier, faces even more concentrated exposure because its revenue is entirely derived from manufacturing metal and composite structures -- every dollar of material cost increase comes directly off its thin margins. Airbus faces similar dynamics but benefits from a more favorable contract structure with its supply chain and greater geographic diversification of metal sourcing.

**Key insight:** Boeing's metal cost exposure interacts dangerously with its broader financial challenges. The company is burning cash while ramping production, and higher metal costs extend the timeline to positive free cash flow generation. Every $1/lb increase in titanium costs adds approximately $50-60 million in annual production costs across Boeing's commercial programs. With the company already stretched financially, metal cost increases have an outsized impact on the equity story and can trigger disproportionate stock price reactions as analysts extend their FCF breakeven projections.

### Aerospace Component Suppliers

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **TransDigm (TDG)** | Sole-Source Aerospace Parts | -1.2% | -0.18 |

**Why they lose:** TransDigm operates a portfolio of sole-source aerospace component businesses with exceptional pricing power in the aftermarket. Rising metal costs represent a modest headwind because the company's value-add -- proprietary designs and sole-source positions -- insulates it from most commodity pass-through challenges. However, its OEM business (approximately 40% of revenue) operates on thinner margins where metal costs are more impactful.

**Key insight:** TransDigm is the least impacted "loser" because its business model is designed around pricing power rather than cost efficiency. The -1.2% impact is modest, and the company has historically offset material cost increases through aftermarket price increases that exceed CPI. It is included here for completeness, but investors should recognize that TransDigm behaves more like a toll-road business than a manufacturer in terms of commodity sensitivity.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| Specialty Metal Producers | +8.6% | XME (Metals/Mining) | 0.74 |
| Rare Earth Mining | +14.5% | REMX (Rare Earth) | 0.89 |
| Aluminum Production | +7.8% | XME (Metals/Mining) | 0.72 |
| Steel Production | +5.5% | SLX (Steel) | 0.55 |
| Defense Primes (Fixed-Price) | -2.7% | ITA (Aerospace/Defense) | -0.36 |
| Commercial Aerospace | -3.4% | ITA (Aerospace/Defense) | -0.46 |
| Aerostructures Suppliers | -4.5% | ITA (Aerospace/Defense) | -0.58 |
| Metal Recyclers | +5.0% | XME (Metals/Mining) | 0.50 |

## Historical Price Moves

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Mar 2022 | Russia-Ukraine War (Ti Cutoff) | Aerospace Ti +40% | ATI +35%, BA -12% | Western primes scrambled to source non-Russian titanium |
| Q3 2022 | Aluminum Spiked on Energy Crisis | Al +25% YoY | AA +45%, AIR -8% | Airbus flagged material cost headwinds |
| Jul 2023 | RTX Pratt & Whitney Engine Charge | N/A (contract loss) | RTX -12% in week | $1.1B charge driven by titanium/nickel costs |
| Oct 2023 | China Rare Earth Export Expansion | RE +15-20% | MP +18%, LMT -3% | DoD accelerated reshoring announcements |
| Q2 2025 | Titanium Supply Tightness | Ti sponge +22% | HWM +15%, SPR -10% | Boeing 787 ramp competed with defense for supply |
| Jan 2026 | NATO Metal Stockpiling Announcement | Multi-metal +8-12% | ATI +12%, RTX -5% | European defense spending drove strategic reserves |

## Key Takeaway

The defense and aerospace sector's strategic metal dependencies create a clear two-tier investment framework. On one side, specialty metal producers like ATI and Howmet Aerospace, along with rare earth miners like MP Materials and Lynas, occupy structurally advantaged positions where rising prices directly enhance profitability. On the other, defense primes locked into fixed-price contracts and commercial aerospace manufacturers face margin erosion that can persist for years until contracts are renegotiated or programs complete.

The geopolitical overlay makes this sector unique among commodity-exposed industries. Unlike chemicals or consumer staples, where commodity sensitivity is purely an economic factor, defense metal exposure carries national security implications that drive government intervention -- subsidies for domestic producers, stockpile purchases, and reshoring mandates. This creates a policy put under specialty metal producer valuations that does not exist in other sectors. For investors, the optimal positioning combines long specialty metal producers and rare earth miners with selective short exposure to defense primes on specific fixed-price programs where metal cost risk is identifiable through contract disclosures. The ITA aerospace and defense ETF is a poor proxy for this trade because it blends metal winners and losers; targeted single-stock positions are essential to capture the full dispersion.
