---
layout: commodity
unit: "$/MMBtu"
image: "/assets/images/og-natural-gas.png"
title: "Natural Gas Price Impact: Utilities, Fertilizers & LNG"
description: "How Henry Hub natural gas prices affect utilities, fertilizer makers, and LNG exporters."
commodity_slug: "natural-gas"
symbol: "NG=F"
data_type: "direct_futures"
sector: "Energy"
etfs: ["UNG", "BOIL", "FCG"]
companies: []
substitutes: ["Solar", "Wind", "Nuclear", "Oil"]
themes: ["Clean Energy", "Food Inflation"]
tags: [natural gas, commodity analysis, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "natural_gas", "label": "Natural Gas"},
  "levels": [
    {"nodes": [
      {"id":"fcg","label":"FCG Gas ETF","type":"etf","impact":9,"correlation":0.82,"sector":"Energy"},
      {"id":"ung","label":"UNG Nat Gas Fund","type":"etf","impact":10,"correlation":0.92,"sector":"Commodities"},
      {"id":"boil","label":"BOIL 2x Gas ETF","type":"etf","impact":14,"correlation":0.90,"sector":"Commodities"},
      {"id":"eqt","label":"EQT Corp (EQT)","type":"producer","impact":11,"correlation":0.87,"sector":"E&P"},
      {"id":"ar","label":"Antero Resources (AR)","type":"producer","impact":10,"correlation":0.84,"sector":"E&P"},
      {"id":"swn","label":"Southwestern Energy (SWN)","type":"producer","impact":10,"correlation":0.83,"sector":"E&P"},
      {"id":"cok","label":"Coterra Energy (CTRA)","type":"producer","impact":8,"correlation":0.75,"sector":"E&P"},
      {"id":"nee","label":"NextEra Energy (NEE)","type":"consumer","impact":5,"correlation":0.58,"sector":"Utilities"},
      {"id":"cf","label":"CF Industries (CF)","type":"consumer","impact":7,"correlation":0.70,"sector":"Fertilizers"},
      {"id":"dow","label":"Dow Inc (DOW)","type":"consumer","impact":-5,"correlation":-0.62,"sector":"Chemicals"},
      {"id":"lng_cheniere","label":"Cheniere Energy (LNG)","type":"producer","impact":9,"correlation":0.80,"sector":"LNG"},
      {"id":"xlu_gas","label":"XLU Utilities ETF","type":"etf","impact":4,"correlation":0.45,"sector":"Utilities"},
      {"id":"henry_hub","label":"Henry Hub Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"chk","label":"Chesapeake Energy (CHK)","type":"producer","impact":10,"correlation":0.85,"sector":"E&P"}
    ]},
    {"nodes": [
      {"id":"rrc","label":"Range Resources (RRC)","type":"producer","impact":9,"correlation":0.82,"sector":"Appalachia E&P","parentId":"eqt"},
      {"id":"cck","label":"Comstock Resources (CRK)","type":"producer","impact":8,"correlation":0.78,"sector":"Haynesville E&P","parentId":"chk"},
      {"id":"mos_gas","label":"Mosaic Co (MOS)","type":"consumer","impact":6,"correlation":0.65,"sector":"Fertilizers","parentId":"cf"},
      {"id":"ntr_gas","label":"Nutrien (NTR)","type":"consumer","impact":5,"correlation":0.60,"sector":"Fertilizers","parentId":"cf"},
      {"id":"trgp","label":"Targa Resources (TRGP)","type":"processor","impact":6,"correlation":0.65,"sector":"Gas Processing","parentId":"eqt"},
      {"id":"wes","label":"Western Midstream (WES)","type":"processor","impact":5,"correlation":0.58,"sector":"Midstream","parentId":"ar"},
      {"id":"so","label":"Southern Co (SO)","type":"consumer","impact":4,"correlation":0.48,"sector":"Utilities","parentId":"nee"},
      {"id":"d_gas","label":"Dominion Energy (D)","type":"consumer","impact":4,"correlation":0.45,"sector":"Utilities","parentId":"nee"},
      {"id":"plastic","label":"Plastics & Resins","type":"consumer","impact":-4,"correlation":-0.55,"sector":"Materials","parentId":"dow"},
      {"id":"emn","label":"Eastman Chemical (EMN)","type":"consumer","impact":-4,"correlation":-0.52,"sector":"Chemicals","parentId":"dow"},
      {"id":"kinder","label":"Kinder Morgan (KMI)","type":"processor","impact":5,"correlation":0.55,"sector":"Pipelines","parentId":"lng_cheniere"},
      {"id":"wmb","label":"Williams Cos (WMB)","type":"processor","impact":5,"correlation":0.58,"sector":"Pipelines","parentId":"lng_cheniere"}
    ]},
    {"nodes": [
      {"id":"sabine","label":"Sabine Pass LNG","type":"regional","impact":7,"correlation":0.72,"sector":"LNG Export","parentId":"lng_cheniere"},
      {"id":"cchristi","label":"Corpus Christi LNG","type":"regional","impact":6,"correlation":0.68,"sector":"LNG Export","parentId":"lng_cheniere"},
      {"id":"freeport_lng","label":"Freeport LNG","type":"regional","impact":6,"correlation":0.65,"sector":"LNG Export","parentId":"sabine"},
      {"id":"dcp","label":"DCP Midstream","type":"processor","impact":4,"correlation":0.52,"sector":"Gas Processing","parentId":"trgp"},
      {"id":"oke","label":"ONEOK Inc (OKE)","type":"processor","impact":5,"correlation":0.55,"sector":"NGL Processing","parentId":"trgp"},
      {"id":"duo","label":"Duke Energy (DUK)","type":"consumer","impact":3,"correlation":0.40,"sector":"Utilities","parentId":"so"},
      {"id":"aep","label":"AEP Inc (AEP)","type":"consumer","impact":3,"correlation":0.38,"sector":"Utilities","parentId":"so"},
      {"id":"linde","label":"Linde plc (LIN)","type":"consumer","impact":-3,"correlation":-0.42,"sector":"Industrial Gas","parentId":"emn"},
      {"id":"apd","label":"Air Products (APD)","type":"consumer","impact":-3,"correlation":-0.40,"sector":"Industrial Gas","parentId":"emn"},
      {"id":"data_centers","label":"Data Center Power","type":"consumer","impact":4,"correlation":0.35,"sector":"Tech","parentId":"nee"},
      {"id":"ce_chem","label":"Celanese (CE)","type":"consumer","impact":-3,"correlation":-0.38,"sector":"Chemicals","parentId":"plastic"},
      {"id":"lyb_gas","label":"LyondellBasell (LYB)","type":"consumer","impact":-3,"correlation":-0.40,"sector":"Chemicals","parentId":"plastic"}
    ]},
    {"nodes": [
      {"id":"ttf","label":"TTF Europe Price","type":"index","impact":7,"correlation":0.55,"sector":"Global Gas","parentId":"sabine"},
      {"id":"jkm","label":"JKM Asia LNG Price","type":"index","impact":6,"correlation":0.50,"sector":"Global Gas","parentId":"cchristi"},
      {"id":"weather_gas","label":"US Weather Forecasts","type":"macro","impact":10,"correlation":0.70,"sector":"Weather","parentId":"henry_hub"},
      {"id":"eia_storage","label":"EIA Storage Report","type":"macro","impact":8,"correlation":0.65,"sector":"Data Releases","parentId":"henry_hub"},
      {"id":"coal_switch","label":"Coal Switching Price","type":"macro","impact":5,"correlation":0.45,"sector":"Power Gen","parentId":"so"},
      {"id":"dxy_gas","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.38,"sector":"Forex","parentId":"ung"},
      {"id":"ferc_policy","label":"FERC Pipeline Policy","type":"policy","impact":5,"correlation":0.40,"sector":"Regulation","parentId":"kinder"},
      {"id":"lng_export_pol","label":"LNG Export Permits","type":"policy","impact":6,"correlation":0.48,"sector":"Energy Policy","parentId":"sabine"}
    ]},
    {"nodes": [
      {"id":"crude_cross","label":"Crude Oil (Cross-Link)","type":"commodity","impact":5,"correlation":0.55,"sector":"Energy","parentId":"ttf"},
      {"id":"coal_sub","label":"Coal (Substitute)","type":"substitute","impact":-4,"correlation":-0.40,"sector":"Power Gen","parentId":"coal_switch"},
      {"id":"solar_sub","label":"Solar (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Clean Energy","parentId":"coal_switch"},
      {"id":"wind_sub","label":"Wind (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Clean Energy","parentId":"coal_switch"},
      {"id":"ngl_deriv","label":"NGLs (Derivative)","type":"commodity","impact":5,"correlation":0.60,"sector":"Liquids","parentId":"eia_storage"},
      {"id":"ammonia_deriv","label":"Ammonia (Derivative)","type":"commodity","impact":6,"correlation":0.65,"sector":"Fertilizers","parentId":"eia_storage"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Natural gas pricing sits at the intersection of weather, LNG exports, and industrial demand. A **+15% seasonal spike** in Henry Hub prices creates immediate winners in E&P stocks while pressuring chemical manufacturers and utility margins. U.S. production exceeds 100 Bcf/d, making the country the world's largest natural gas producer. The growing linkage between domestic Henry Hub prices and international benchmarks (TTF, JKM) through LNG exports has fundamentally changed how the U.S. gas market functions, connecting American wellhead economics to global energy security dynamics.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** EQT, Range Resources, and Coterra see near-linear earnings leverage to Henry Hub. FCG ETF typically moves 0.75-0.90x the percentage change in nat gas. Appalachian producers (EQT, Southwestern Energy) and Haynesville operators (Chesapeake, Comstock Resources) are the most gas-weighted E&P companies in the U.S. Associated gas production from Permian Basin oil wells adds supply that is insensitive to gas prices, creating a persistent overhang that moderates price rallies.

**Secondary -- Supply Chain and Processing:** Natural gas is the primary feedstock for ammonia synthesis. CF Industries and Mosaic see input cost surges that compress margins 6-10% per $1/MMBtu increase in gas. Gas processing plants operated by Targa Resources and DCP Midstream separate natural gas liquids (NGLs) from the gas stream, with processing margins sensitive to the NGL-to-gas price ratio. Power generators using combined-cycle gas turbines represent the largest demand segment, with gas-fired electricity generation fluctuating based on renewable output and coal switching economics.

**Tertiary -- Macro and Second-Order Effects:** Sabine Pass and Corpus Christi liquefaction plants benefit when global LNG prices (JKM, TTF) diverge from Henry Hub -- creating arbitrage opportunities. Rising domestic gas prices feed through to electricity costs for residential and commercial consumers. Natural gas price spikes during winter cold snaps create heating cost burdens for lower-income households, generating political pressure for price controls or utility rate relief. Data center power demand growth is creating a new structural demand channel that favors gas-fired generation for baseload reliability.

## Which Companies and ETFs Benefit When the Price Rises?

Gas-focused E&P companies with low breakeven costs and unhedged production capture direct price upside. EQT Corp, Range Resources (AR), and Southwestern Energy (SWN) are the purest plays. LNG exporters (Cheniere Energy) benefit when international prices rise relative to domestic Henry Hub. Midstream operators earn higher throughput fees and processing margins during production growth periods.

## Which Companies and Sectors Are Hurt by a Price Increase?

Chemical manufacturers using gas as feedstock face cost inflation that compresses margins. Dow Inc. and Eastman Chemical are particularly exposed. Fertilizer producers (CF Industries) see input costs rise, though they can pass through some increases to farmers. Electric utilities face fuel cost increases that may exceed regulatory rate recovery timelines. Residential and commercial consumers pay higher heating and cooling bills, reducing discretionary spending.

## What Should Traders Watch When Analyzing This Market?

Natural gas exhibits the highest seasonal volatility of all major commodities. Winter storage draws (Oct-Mar) and summer cooling demand create predictable trading windows. Monitor the EIA weekly storage report every Thursday at 10:30 AM ET. The storage deficit or surplus relative to the five-year average is the most watched fundamental indicator. Weather model forecasts (GFS, European) for temperature deviations drive short-term price movements, with cold winter outlooks capable of moving prices 5-10% in a single session.

## How to Use This Hub in Practice

If you are tracking utilities, LNG exporters, fertilizer names, or U.S. shale gas equities, use this page in four steps. First, check whether Henry Hub is moving because of weather, storage, or global LNG linkage. Second, identify whether the move primarily helps producers, LNG-linked infrastructure, or downstream gas consumers. Third, compare the live banner and chart with the most relevant Signal Reports below. Fourth, cross-check substitute chains like crude oil, solar, and wind when gas is moving because of broader power-market repricing rather than gas-specific fundamentals.

## Best Companion Hubs

- [Crude Oil](/commodities/crude-oil/) for cross-energy regime shifts and substitution effects
- [Wheat](/commodities/wheat/) if fertilizer and food-input inflation are part of the thesis
- [Copper](/commodities/copper/) for industrial growth confirmation versus weather-driven gas moves

## Latest Signal Reports
- [Natural Gas Storage Glut & Price Collapse](/natural-gas-storage-glut-price-collapse/)
- [LNG & Natural Gas Global Trade](/lng-natural-gas-global-trade/)
- [Utilities Sector: Natural Gas & Coal](/utilities-sector-natural-gas-coal/)
- [Natural Gas Price Impact Analysis](/natural-gas-price-impact/)

## Key Impact Relationships

| Node | Impact (±10% Move) | Correlation | Sector |
|------|-------------------|-------------|--------|
| UNG Natural Gas ETF | +9.5% | 0.97 | Natural Gas |
| EQT Corporation (EQT) | +12.0% | 0.82 | Gas Producer |
| Antero Resources (AR) | +14.0% | 0.85 | Gas Producer |
| Cheniere Energy (LNG) | +5.0% | 0.55 | LNG Export |
| CF Industries (CF) | −6.0% | −0.65 | Fertilizer (input cost) |
| Mosaic (MOS) | −4.0% | −0.50 | Fertilizer (input cost) |
| Residential Utilities | −3.0% | −0.40 | Utility Costs |
| Industrial Gas Users | −2.5% | −0.35 | Manufacturing |
| Coal Price | +3.5% | 0.50 | Fuel Substitution |
| Electricity Price | +4.0% | 0.58 | Power Generation |
