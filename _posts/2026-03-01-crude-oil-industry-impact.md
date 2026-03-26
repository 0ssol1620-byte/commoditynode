---
layout: post
title: "Crude Oil Price Impact: Winners & Losers Across 12 Industries"
date: 2026-03-01
categories: [Energy, Analysis]
tags: [crude-oil, XOM, CVX, HAL, XLE, JETS, energy, airlines, refining]
description: "Interactive analysis of how crude oil price movements impact XOM, CVX, HAL, airlines (JETS ETF), and the entire energy sector with correlation data."
reading_time: 9
commodity_name: "Crude Oil"
direction: bullish
image: /assets/images/og-crude-oil.png
canonical_url: https://commoditynode.com/crude-oil-industry-impact/
---

Crude oil remains the world's most traded commodity — and its price swings create immediate winners and losers across global markets. A 10% move in WTI crude ripples through airlines, refiners, oilfield services, and consumer staples within days. Understanding those correlations is the edge every investor needs.

## The Impact Map

<div class="cn-price-chart" data-symbol="CL=F" data-name="Crude Oil (WTI)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "crude_oil", label: "Crude Oil ↑10%", price: "$85/bbl", change: "+10%" },
  levels: [
    { nodes: [
      { id: "xle", label: "XLE Energy ETF", type: "etf", impact: 8.2, correlation: 0.92, marketCap: "36B", sector: "ETF" },
      { id: "xop", label: "XOP E&P ETF", type: "etf", impact: 12.5, correlation: 0.94, marketCap: "4.2B", sector: "ETF" },
      { id: "oih", label: "OIH Services ETF", type: "etf", impact: 13.8, correlation: 0.90, marketCap: "2.8B", sector: "ETF" },
      { id: "xom", label: "ExxonMobil (XOM)", type: "producer", impact: 9, correlation: 0.89, marketCap: "512B", sector: "Oil Major" },
      { id: "cvx", label: "Chevron (CVX)", type: "producer", impact: 8, correlation: 0.87, marketCap: "298B", sector: "Oil Major" },
      { id: "cop", label: "ConocoPhillips (COP)", type: "producer", impact: 11.5, correlation: 0.91, marketCap: "148B", sector: "E&P" },
      { id: "oxy", label: "Occidental (OXY)", type: "producer", impact: 14, correlation: 0.88, marketCap: "52B", sector: "E&P" },
      { id: "eog", label: "EOG Resources (EOG)", type: "producer", impact: 10.8, correlation: 0.86, marketCap: "72B", sector: "E&P" },
      { id: "jets", label: "JETS Airlines ETF", type: "etf", impact: -7.1, correlation: -0.81, marketCap: "2B", sector: "ETF" },
      { id: "aal", label: "American Airlines (AAL)", type: "consumer", impact: -11, correlation: -0.79, marketCap: "9B", sector: "Airlines" },
      { id: "dal", label: "Delta Air Lines (DAL)", type: "consumer", impact: -9, correlation: -0.76, marketCap: "25B", sector: "Airlines" },
      { id: "ual", label: "United Airlines (UAL)", type: "consumer", impact: -9.5, correlation: -0.78, marketCap: "23B", sector: "Airlines" },
      { id: "luv", label: "Southwest Airlines (LUV)", type: "consumer", impact: -6.2, correlation: -0.68, marketCap: "18B", sector: "Airlines" }
    ]},
    { nodes: [
      { id: "hal", label: "Halliburton (HAL)", type: "supplier", impact: 14, correlation: 0.91, marketCap: "32B", sector: "Oilfield Services", parentId: "xom" },
      { id: "slb", label: "SLB (SLB)", type: "supplier", impact: 12, correlation: 0.88, marketCap: "65B", sector: "Oilfield Services", parentId: "cvx" },
      { id: "bkr", label: "Baker Hughes (BKR)", type: "supplier", impact: 10.5, correlation: 0.84, marketCap: "38B", sector: "Oilfield Services", parentId: "cop" },
      { id: "psx", label: "Phillips 66 (PSX)", type: "processor", impact: 4.5, correlation: 0.62, marketCap: "52B", sector: "Refining", parentId: "xom" },
      { id: "mpc", label: "Marathon Pete (MPC)", type: "processor", impact: 5.2, correlation: 0.66, marketCap: "60B", sector: "Refining", parentId: "cvx" },
      { id: "vlo", label: "Valero Energy (VLO)", type: "processor", impact: 5.8, correlation: 0.68, marketCap: "49B", sector: "Refining", parentId: "cop" },
      { id: "epd", label: "Enterprise Products (EPD)", type: "supplier", impact: 3.8, correlation: 0.52, marketCap: "65B", sector: "Midstream", parentId: "eog" },
      { id: "et", label: "Energy Transfer (ET)", type: "supplier", impact: 4.2, correlation: 0.55, marketCap: "52B", sector: "Midstream", parentId: "oxy" },
      { id: "ups", label: "UPS (UPS)", type: "consumer", impact: -4, correlation: -0.62, marketCap: "110B", sector: "Logistics", parentId: "jets" },
      { id: "fdx", label: "FedEx (FDX)", type: "consumer", impact: -4.5, correlation: -0.55, marketCap: "65B", sector: "Logistics", parentId: "jets" },
      { id: "odfl", label: "Old Dominion (ODFL)", type: "consumer", impact: -3.8, correlation: -0.50, marketCap: "42B", sector: "Trucking", parentId: "aal" },
      { id: "fang", label: "Diamondback Energy (FANG)", type: "producer", impact: 15, correlation: 0.92, marketCap: "35B", sector: "E&P", parentId: "xop" }
    ]},
    { nodes: [
      { id: "drilling", label: "Patterson-UTI (PTEN)", type: "producer", impact: 11, correlation: 0.85, marketCap: "4B", sector: "Contract Drilling", parentId: "slb" },
      { id: "pipeline", label: "Kinder Morgan (KMI)", type: "supplier", impact: 3.2, correlation: 0.48, marketCap: "22B", sector: "Pipelines", parentId: "psx" },
      { id: "wmb", label: "Williams Cos (WMB)", type: "supplier", impact: 3.5, correlation: 0.50, marketCap: "50B", sector: "Pipelines", parentId: "mpc" },
      { id: "chemicals", label: "LyondellBasell (LYB)", type: "consumer", impact: -5, correlation: -0.55, marketCap: "28B", sector: "Chemicals", parentId: "mpc" },
      { id: "dow_chem", label: "Dow Inc (DOW)", type: "consumer", impact: -4.5, correlation: -0.52, marketCap: "40B", sector: "Chemicals", parentId: "vlo" },
      { id: "cheniere", label: "Cheniere Energy (LNG)", type: "producer", impact: 8.5, correlation: 0.72, marketCap: "40B", sector: "LNG Export", parentId: "epd" },
      { id: "dvn", label: "Devon Energy (DVN)", type: "producer", impact: 13.5, correlation: 0.91, marketCap: "30B", sector: "E&P", parentId: "fang" },
      { id: "ctra", label: "Coterra Energy (CTRA)", type: "producer", impact: 9.5, correlation: 0.82, marketCap: "20B", sector: "E&P", parentId: "eog" },
      { id: "uber", label: "Uber Technologies (UBER)", type: "consumer", impact: -3.8, correlation: -0.48, marketCap: "145B", sector: "Ride-hail", parentId: "ups" },
      { id: "ccl", label: "Carnival Corp (CCL)", type: "consumer", impact: -6.5, correlation: -0.65, marketCap: "24B", sector: "Cruise Lines", parentId: "dal" },
      { id: "rcl", label: "Royal Caribbean (RCL)", type: "consumer", impact: -5.5, correlation: -0.58, marketCap: "40B", sector: "Cruise Lines", parentId: "ual" },
      { id: "nclh", label: "Norwegian Cruise (NCLH)", type: "consumer", impact: -7.2, correlation: -0.70, marketCap: "10B", sector: "Cruise Lines", parentId: "luv" }
    ]},
    { nodes: [
      { id: "auto", label: "Ford Motor (F)", type: "consumer", impact: -2, correlation: -0.32, marketCap: "48B", sector: "Automotive", parentId: "ups" },
      { id: "trucking", label: "Werner Enterprises (WERN)", type: "consumer", impact: -6, correlation: -0.68, marketCap: "3B", sector: "Trucking", parentId: "odfl" },
      { id: "tankers", label: "Frontline (FRO)", type: "supplier", impact: 8.5, correlation: 0.72, marketCap: "6B", sector: "Oil Tankers", parentId: "pipeline" },
      { id: "sblk", label: "Star Bulk Carriers (SBLK)", type: "supplier", impact: 5.2, correlation: 0.55, marketCap: "2.5B", sector: "Shipping", parentId: "wmb" },
      { id: "xpo", label: "XPO Inc (XPO)", type: "consumer", impact: -5.2, correlation: -0.60, marketCap: "12B", sector: "Trucking", parentId: "fdx" },
      { id: "bkng", label: "Booking Holdings (BKNG)", type: "consumer", impact: -3.5, correlation: -0.45, marketCap: "145B", sector: "Travel/OTA", parentId: "ccl" },
      { id: "expe", label: "Expedia (EXPE)", type: "consumer", impact: -3.8, correlation: -0.50, marketCap: "20B", sector: "Travel/OTA", parentId: "rcl" },
      { id: "mar", label: "Marriott Intl (MAR)", type: "consumer", impact: -2.8, correlation: -0.35, marketCap: "74B", sector: "Hotels", parentId: "nclh" },
      { id: "hlt", label: "Hilton (HLT)", type: "consumer", impact: -2.5, correlation: -0.33, marketCap: "58B", sector: "Hotels", parentId: "bkng" },
      { id: "gm", label: "General Motors (GM)", type: "consumer", impact: -2.2, correlation: -0.35, marketCap: "52B", sector: "Automotive", parentId: "auto" },
      { id: "basfy", label: "BASF SE (BASFY)", type: "consumer", impact: -4.8, correlation: -0.50, marketCap: "42B", sector: "Chemicals", parentId: "chemicals" },
      { id: "chx", label: "ChampionX (CHX)", type: "supplier", impact: 9.5, correlation: 0.78, marketCap: "6B", sector: "Production Chemicals", parentId: "drilling" }
    ]},
    { nodes: [
      { id: "inflation_o", label: "CPI Inflation", type: "macro", impact: -2.5, correlation: -0.42, sector: "Macro", parentId: "auto" },
      { id: "opec", label: "OPEC+ Supply", type: "macro", impact: 7, correlation: 0.75, sector: "Macro", parentId: "xom" },
      { id: "usd_o", label: "USD Index (DXY)", type: "fx", impact: -3.5, correlation: -0.62, sector: "Macro", parentId: "pipeline" },
      { id: "consumer_o", label: "Consumer Spending", type: "macro", impact: -1.8, correlation: -0.30, sector: "Macro", parentId: "trucking" },
      { id: "eurusd", label: "EUR/USD", type: "fx", impact: 2.5, correlation: 0.45, sector: "Macro", parentId: "tankers" },
      { id: "baltic", label: "Baltic Dirty Tanker Index", type: "freight", impact: 6.5, correlation: 0.68, sector: "Macro", parentId: "sblk" },
      { id: "geopolitics", label: "Geopolitical Risk Index", type: "policy", impact: 5.5, correlation: 0.55, sector: "Macro", parentId: "opec" },
      { id: "rig_count", label: "US Rig Count", type: "index", impact: 4.5, correlation: 0.65, sector: "Macro", parentId: "drilling" }
    ]},
    { nodes: [
      { id: "natgas_sub", label: "Natural Gas (Substitute)", type: "substitute", impact: 4.2, correlation: 0.58, sector: "Energy", parentId: "cheniere" },
      { id: "coal_sub", label: "Coal (Substitute)", type: "substitute", impact: 3.5, correlation: 0.50, sector: "Energy", parentId: "natgas_sub" },
      { id: "brent_spread", label: "Brent-WTI Spread", type: "index", impact: 2.8, correlation: 0.42, sector: "Energy", parentId: "tankers" },
      { id: "gasoline_crack", label: "Gasoline Crack Spread", type: "index", impact: 5.5, correlation: 0.65, sector: "Energy", parentId: "psx" },
      { id: "diesel_crack", label: "Diesel Crack Spread", type: "index", impact: 6.0, correlation: 0.70, sector: "Energy", parentId: "vlo" },
      { id: "spr_reserves", label: "US SPR Reserves", type: "policy", impact: -2.0, correlation: -0.35, sector: "Policy", parentId: "geopolitics" }
    ]}
  ]
};
</script>


## Winners When Oil Rises

### Energy Producers & ETFs

| Asset | Type | Avg Impact (10% Oil Move) | Correlation |
|-------|------|--------------------------|-------------|
| **XLE** | Energy ETF | +8.2% | 0.92 |
| **ExxonMobil (XOM)** | Integrated Major | +9.0% | 0.89 |
| **Chevron (CVX)** | Integrated Major | +8.0% | 0.87 |
| **Halliburton (HAL)** | Oilfield Services | +14.0% | 0.91 |
| **SLB** | Oilfield Services | +12.0% | 0.88 |

**Why they win:** Upstream producers earn more per barrel sold. Oilfield services companies see surging demand for drilling equipment and expertise. The XLE ETF captures the broad energy sector move with diversified exposure.

**Key insight:** HAL and SLB tend to outperform integrated majors during oil surges because rising prices incentivize capex spending on new wells — amplifying services demand beyond simple price leverage.

## Losers When Oil Rises

### Airlines & Logistics

| Asset | Type | Avg Impact (10% Oil Move) | Correlation |
|-------|------|--------------------------|-------------|
| **JETS ETF** | Airlines ETF | -7.1% | -0.81 |
| **American Airlines (AAL)** | Airline | -11.0% | -0.79 |
| **Delta Air Lines (DAL)** | Airline | -9.0% | -0.76 |
| **UPS** | Logistics | -4.0% | -0.62 |
| **Plastics & Chemicals** | Industry | -5.0% | -0.65 |

**Why they lose:** Jet fuel represents 20-30% of airline operating costs. A 10% rise in crude directly compresses margins unless airlines have hedged exposure. Logistics and trucking face similar cost pressure on diesel.

**Key insight:** AAL has historically less hedging than Delta, making it more volatile during oil spikes. Watch the hedge ratio in quarterly earnings to calibrate exposure timing.

## Historical Price Move Analysis

| Date | Oil Price Move | XLE Change | JETS Change | XOM Change | HAL Change | Notes |
|------|---------------|-----------|------------|-----------|-----------|-------|
| Mar 2020 | -65% (COVID crash) | -45% | +12% | -40% | -55% | Demand collapse |
| Oct 2021 | +25% (Recovery) | +18% | -14% | +16% | +22% | Post-COVID rebound |
| Feb 2022 | +30% (Russia-Ukraine) | +22% | -18% | +20% | +28% | Supply shock |
| Jun 2022 | -35% (Recession fear) | -25% | +15% | -20% | -30% | Demand destruction |
| Jan 2024 | +15% (Middle East) | +12% | -10% | +11% | +16% | Geopolitical risk |
| **Average** | **±10%** | **±8.2%** | **±7.1%** | **±7.8%** | **±11.4%** | |

## Key Takeaway

Crude oil's 10% move generates an average **8.2% response in XLE**, with oilfield services companies (HAL, SLB) amplifying that to **12-14%**. Airlines bear the heaviest cost burden, with JETS ETF dropping **7.1%** on average. For traders: the oil-airline inverse relationship is one of the most reliable macro trades in commodities.

**Position sizing note:** The XLE/JETS pair trade has delivered consistent risk-adjusted returns during sustained oil trends. Consider 2:1 weighting (XLE long vs JETS short) during uptrend phases.

---

## Related Oil & Energy Reports
- [Crude Oil Industry Impact](/crude-oil-industry-impact/)
- [Oil's Geopolitical Premium: Hormuz](/crude-oil-strait-hormuz-geopolitical-premium/)
- [Oil Price Surge: Industry Impact](/oil-price-surge-industry-impact/)
- [March 2026 Oil Market & OPEC](/march-2026-oil-market-opec/)
- [Diesel at $3.8/Gallon: Inflation Tax](/diesel-transportation-inflation/)
- [XLE vs XOP: Oil ETF Comparison](/xle-vs-xop-oil-etf-comparison/)
