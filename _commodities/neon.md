---
layout: commodity
unit: "$/m³"
image: "/assets/images/og-neon.png"
title: "Neon Gas Price Impact: Semiconductor Chips & Supply"
description: "How neon gas supply disruptions cascade through semiconductor lithography, chip manufacturing, and the Ukraine-Russia geopolitical risk axis."
commodity_slug: "neon"
symbol: "SOXX"
data_type: "proxy"
sector: "Noble Gases/Semiconductor"
etfs: ["SOXX", "SMH"]
companies: ["ASML"]
substitutes: ["Fluorine-based Lasers", "EUV Direct"]
themes: ["Supply Chain Disruption", "Geopolitical Risk"]
tags: ["neon"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "neon", "label": "Neon"},
  "levels": [
    {"nodes": [
      {"id":"ne_index","label":"Neon Gas Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"soxx_ne","label":"SOXX Semiconductor ETF","type":"etf","impact":-4,"correlation":-0.30,"sector":"Semiconductors"},
      {"id":"smh_ne","label":"SMH VanEck Chip ETF","type":"etf","impact":-4,"correlation":-0.28,"sector":"Semiconductors"},
      {"id":"asml_ne","label":"ASML Holdings","type":"supplier","impact":-3,"correlation":-0.22,"sector":"Lithography"},
      {"id":"amat_ne","label":"Applied Materials (AMAT)","type":"supplier","impact":-2,"correlation":-0.18,"sector":"Chip Equipment"},
      {"id":"tsmc_ne","label":"TSMC (TSM)","type":"consumer","impact":-5,"correlation":-0.35,"sector":"Foundry"},
      {"id":"ingas_ne","label":"Ingas (Ukraine)","type":"producer","impact":9,"correlation":0.75,"sector":"Noble Gas"},
      {"id":"cryoin_ne","label":"Cryoin (Ukraine)","type":"producer","impact":8,"correlation":0.70,"sector":"Noble Gas"},
      {"id":"air_liquide","label":"Air Liquide (AI.PA)","type":"producer","impact":5,"correlation":0.40,"sector":"Industrial Gas"},
      {"id":"linde_ne","label":"Linde plc (LIN)","type":"producer","impact":5,"correlation":0.38,"sector":"Industrial Gas"}
    ]},
    {"nodes": [
      {"id":"samsung_semi","label":"Samsung Foundry","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Foundry","parentId":"tsmc_ne"},
      {"id":"intel_ne","label":"Intel (INTC)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"IDM","parentId":"tsmc_ne"},
      {"id":"sk_hynix","label":"SK Hynix","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Memory","parentId":"soxx_ne"},
      {"id":"micron_ne","label":"Micron (MU)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Memory","parentId":"soxx_ne"},
      {"id":"cymer_ne","label":"Cymer (ASML DUV)","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Lithography","parentId":"asml_ne"},
      {"id":"gigaphoton","label":"Gigaphoton (Komatsu)","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Lithography","parentId":"asml_ne"},
      {"id":"nippon_sanso","label":"Nippon Sanso","type":"producer","impact":4,"correlation":0.32,"sector":"Industrial Gas","parentId":"linde_ne"},
      {"id":"iceblick","label":"Iceblick (Ukraine)","type":"producer","impact":7,"correlation":0.55,"sector":"Noble Gas","parentId":"ingas_ne"},
      {"id":"praxair_ne","label":"Praxair/Linde Supply","type":"processor","impact":4,"correlation":0.30,"sector":"Gas Supply","parentId":"linde_ne"},
      {"id":"messer_ne","label":"Messer Group","type":"producer","impact":3,"correlation":0.25,"sector":"Industrial Gas","parentId":"air_liquide"}
    ]},
    {"nodes": [
      {"id":"ukraine_war","label":"Ukraine Conflict Risk","type":"policy","impact":9,"correlation":0.70,"sector":"Geopolitics","parentId":"ingas_ne"},
      {"id":"euv_shift","label":"EUV Lithography Shift","type":"substitute","impact":-6,"correlation":-0.45,"sector":"Lithography","parentId":"cymer_ne"},
      {"id":"chip_shortage","label":"Global Chip Shortage","type":"macro","impact":7,"correlation":0.50,"sector":"Semiconductors","parentId":"tsmc_ne"},
      {"id":"dxy_ne","label":"US Dollar (DXY)","type":"fx","impact":-2,"correlation":-0.20,"sector":"Forex","parentId":"ne_index"},
      {"id":"steel_byproduct","label":"Steel Mill Production","type":"macro","impact":5,"correlation":0.40,"sector":"Steel","parentId":"ingas_ne"},
      {"id":"ai_chip_demand","label":"AI Chip Demand Surge","type":"macro","impact":6,"correlation":0.42,"sector":"AI/ML","parentId":"tsmc_ne"},
      {"id":"china_neon","label":"China Neon Production","type":"producer","impact":5,"correlation":0.35,"sector":"Industrial Gas","parentId":"air_liquide"},
      {"id":"krypton_related","label":"Krypton (Related Gas)","type":"commodity","impact":5,"correlation":0.55,"sector":"Noble Gas","parentId":"cryoin_ne"},
      {"id":"xenon_related","label":"Xenon (Related Gas)","type":"commodity","impact":4,"correlation":0.50,"sector":"Noble Gas","parentId":"cryoin_ne"},
      {"id":"recycling_ne","label":"Neon Recycling Systems","type":"processor","impact":-3,"correlation":-0.25,"sector":"Gas Recovery","parentId":"tsmc_ne"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Neon is the invisible enabler of modern semiconductor manufacturing. This noble gas is essential for deep ultraviolet (DUV) excimer lasers used in photolithography -- the process that etches circuit patterns onto silicon wafers at nodes from 250nm down to 7nm. Prior to 2022, Ukraine produced approximately 50% of the world's semiconductor-grade neon, purified from crude neon collected as a by-product of steel manufacturing in large oxygen separation units. The Russian invasion of Ukraine in February 2022 disrupted this supply chain catastrophically, with Ingas and Cryoin -- the two largest Ukrainian neon purifiers located in Mariupol and Odesa -- forced to halt operations. Neon prices spiked over 10x within weeks. While the semiconductor industry has since diversified sourcing, the episode exposed a critical single-point-of-failure in the chip supply chain. Global neon consumption for semiconductor applications is estimated at 540 million liters annually.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- DUV Lithography and Chip Manufacturing:** KrF (248nm) and ArF (193nm) excimer lasers consume neon as both the lasing medium and buffer gas, with neon comprising roughly 96% of the gas mixture. Every advanced logic and memory chip manufactured using DUV lithography depends on a continuous supply of ultra-high-purity neon (99.999%+). ASML's DUV lithography systems and Cymer/Gigaphoton laser light sources are the primary consumption points. A single advanced fab can consume hundreds of thousands of liters of neon monthly. When supply tightens, fabs face the prospect of reducing utilization rates, directly impacting chip output for TSMC, Samsung, Intel, and memory manufacturers.

**Secondary -- Downstream Semiconductor Impact:** Neon supply disruptions propagate through the entire electronics value chain. Memory chip production (SK Hynix, Micron, Samsung) is particularly vulnerable as DRAM and NAND manufacturing relies heavily on DUV lithography for the majority of patterning steps. Logic chip constraints affect processor availability for PCs, smartphones, automotive, and data center applications. The 2022 supply shock accelerated diversification efforts -- South Korean and Japanese gas companies invested in neon purification capacity, and major fabs implemented neon recycling systems that can recover and reuse 80-90% of consumed neon.

**Tertiary -- Structural Shifts and Alternatives:** The transition to extreme ultraviolet (EUV) lithography at the most advanced nodes (5nm and below) reduces but does not eliminate neon dependency, as EUV uses tin plasma rather than gas lasers. However, legacy DUV tools continue to perform the majority of lithography steps even in EUV-generation chips. The fundamental supply structure -- neon as a by-product of steel industry air separation -- means production is tied to steel manufacturing geography and activity levels. China has emerged as a significant neon supplier, reflecting its dominant steel production capacity. Neon recycling technology adoption by major fabs represents the most impactful structural demand reduction.

## Which Companies and ETFs Benefit When the Price Rises?

Industrial gas companies (Air Liquide, Linde, Nippon Sanso) that invested in neon purification capacity benefit from both higher pricing and long-term supply agreements with semiconductor manufacturers. Chinese neon producers gain market share as the industry diversifies away from Ukrainian supply. Neon recycling equipment manufacturers see surging demand from fabs seeking to reduce consumption. EUV lithography tool demand (ASML) receives an indirect boost as the technology reduces neon dependency versus DUV. Steel producers with air separation units gain a new revenue stream from crude neon sales.

## Which Companies and Sectors Are Hurt by a Price Increase?

Semiconductor manufacturers (TSMC, Samsung, Intel, SK Hynix, Micron) face direct input cost increases that are difficult to pass through on contractual chip pricing. Chip equipment makers see potential fab utilization reductions that defer tool purchases. Fabless semiconductor companies face delivery delays and potentially higher foundry pricing. Automotive OEMs remain vulnerable to chip supply disruptions triggered by gas shortages. Consumer electronics brands face component availability constraints during severe neon disruptions.

## Key Impact Relationships

| Node | Impact (±10% Move) | Correlation | Sector |
|------|-------------------|-------------|--------|
| Neon Gas Price Index | +10.0% | 0.99 | Commodities |
| SOXX Semiconductor ETF | −4.0% | −0.30 | Semiconductors |
| SMH VanEck Chip ETF | −4.0% | −0.28 | Semiconductors |
| ASML Holdings | −3.0% | −0.22 | Lithography |
| Applied Materials (AMAT) | −2.0% | −0.18 | Chip Equipment |
| TSMC (TSM) | −5.0% | −0.35 | Foundry |
| Ingas (Ukraine) | +9.0% | 0.75 | Noble Gas |
| Cryoin (Ukraine) | +8.0% | 0.70 | Noble Gas |
| Air Liquide (AI.PA) | +5.0% | 0.40 | Industrial Gas |
| Linde plc (LIN) | +5.0% | 0.38 | Industrial Gas |

## What Should Traders Watch When Analyzing This Market?

Neon does not trade on commodity exchanges -- pricing is based on bilateral contracts and spot market assessments from gasworld and Industrial Gas Analytics. Monitor Ukrainian industrial gas production status and steel mill operations for traditional supply indicators. Track Chinese neon export volumes and pricing as the marginal supply source. Semiconductor industry fab utilization rates (reported by TSMC, Samsung quarterly) indicate demand intensity. ASML DUV tool shipments versus EUV tool shipments track the structural demand trajectory. Monitor Air Liquide and Linde earnings calls for gas supply commentary. The neon recycling adoption rate at major fabs is the most important variable for long-term demand modeling.
