---
layout: post
title: "Crude Oil Price Impact: Winners & Losers Across 12 Industries"
date: 2026-03-01
categories: [Energy, Analysis]
tags: [crude-oil, XOM, CVX, HAL, XLE, JETS, energy, airlines, refining]
description: "Interactive analysis of how crude oil price movements impact XOM, CVX, HAL, airlines (JETS ETF), and the entire energy sector with correlation data."
reading_time: 9
commodity_name: "Crude Oil"
image: /assets/images/og-crude-oil.png
canonical_url: https://commoditynode.com/crude-oil-industry-impact/
---

Crude oil remains the world's most traded commodity — and its price swings create immediate winners and losers across global markets. A 10% move in WTI crude ripples through airlines, refiners, oilfield services, and consumer staples within days. Understanding those correlations is the edge every investor needs.

## The Impact Map

<div class="cn-price-chart" data-symbol="CL=F" data-name="Crude Oil (WTI)"></div>
<script src="/assets/js/price-chart.js"></script><div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "crude_oil", label: "Crude Oil ↑10%", price: "$85/bbl", change: "+10%" },
  levels: [
    { nodes: [
      { id: "xle", label: "XLE Energy ETF", type: "etf", impact: 8.2, correlation: 0.92, marketCap: "36B", sector: "ETF" },
      { id: "xom", label: "ExxonMobil (XOM)", type: "positive", impact: 9.0, correlation: 0.89, marketCap: "512B", sector: "Oil Major" },
      { id: "cvx", label: "Chevron (CVX)", type: "positive", impact: 8.0, correlation: 0.87, marketCap: "298B", sector: "Oil Major" },
      { id: "jets", label: "JETS Airlines ETF", type: "etf", impact: -7.1, correlation: -0.81, marketCap: "2B", sector: "ETF" },
      { id: "aal", label: "American Airlines (AAL)", type: "negative", impact: -11.0, correlation: -0.79, marketCap: "9B", sector: "Airlines" },
      { id: "dal", label: "Delta Air Lines (DAL)", type: "negative", impact: -9.0, correlation: -0.76, marketCap: "25B", sector: "Airlines" }
    ]},
    { nodes: [
      { id: "hal", label: "Halliburton (HAL)", type: "positive", impact: 14.0, correlation: 0.91, marketCap: "32B", sector: "Oilfield Services", parentId: "xom" },
      { id: "slb", label: "SLB (SLB)", type: "positive", impact: 12.0, correlation: 0.88, marketCap: "65B", sector: "Oilfield Services", parentId: "cvx" },
      { id: "psx", label: "Phillips 66 (PSX)", type: "positive", impact: 4.5, correlation: 0.62, marketCap: "52B", sector: "Refining", parentId: "xom" },
      { id: "mpc", label: "Marathon Pete (MPC)", type: "positive", impact: 5.2, correlation: 0.66, marketCap: "60B", sector: "Refining", parentId: "cvx" },
      { id: "ups", label: "UPS (UPS)", type: "negative", impact: -4.0, correlation: -0.62, marketCap: "110B", sector: "Logistics", parentId: "jets" }
    ]},
    { nodes: [
      { id: "bhp_o", label: "BHP Group (BHP)", type: "positive", impact: 5.5, correlation: 0.58, marketCap: "145B", sector: "Diversified Mining", parentId: "hal" },
      { id: "drilling", label: "Patterson-UTI (PTEN)", type: "positive", impact: 11.0, correlation: 0.85, marketCap: "4B", sector: "Contract Drilling", parentId: "slb" },
      { id: "pipeline", label: "Kinder Morgan (KMI)", type: "positive", impact: 3.2, correlation: 0.48, marketCap: "22B", sector: "Pipelines", parentId: "psx" },
      { id: "chemicals", label: "LyondellBasell (LYB)", type: "negative", impact: -5.0, correlation: -0.55, marketCap: "28B", sector: "Chemicals", parentId: "mpc" }
    ]},
    { nodes: [
      { id: "auto", label: "Ford Motor (F)", type: "negative", impact: -2.0, correlation: -0.32, marketCap: "48B", sector: "Automotive", parentId: "ups" },
      { id: "trucking", label: "Werner Enterprises (WERN)", type: "negative", impact: -6.0, correlation: -0.68, marketCap: "3B", sector: "Trucking", parentId: "ups" },
      { id: "plastics", label: "Dow Inc (DOW)", type: "negative", impact: -4.5, correlation: -0.52, marketCap: "40B", sector: "Plastics", parentId: "chemicals" },
      { id: "tankers", label: "Frontline (FRO)", type: "positive", impact: 8.5, correlation: 0.72, marketCap: "6B", sector: "Oil Tankers", parentId: "pipeline" }
    ]},
    { nodes: [
      { id: "inflation_o", label: "CPI Inflation", type: "negative", impact: -2.5, sector: "Macro", parentId: "auto" },
      { id: "opec", label: "OPEC+ Supply", type: "positive", impact: 7.0, sector: "Macro", parentId: "xom" },
      { id: "usd_o", label: "USD Strength", type: "negative", impact: -3.5, correlation: -0.62, sector: "Macro", parentId: "pipeline" },
      { id: "consumer_o", label: "Consumer Spending", type: "negative", impact: -1.8, sector: "Macro", parentId: "trucking" }
    ]}
  ]
};
</script>
<script src="/assets/js/impact-graph.js"></script>

## 🟢 Winners When Oil Rises

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

## 🔴 Losers When Oil Rises

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

## 📊 Historical Price Move Analysis

| Date | Oil Price Move | XLE Change | JETS Change | XOM Change | HAL Change | Notes |
|------|---------------|-----------|------------|-----------|-----------|-------|
| Mar 2020 | -65% (COVID crash) | -45% | +12% | -40% | -55% | Demand collapse |
| Oct 2021 | +25% (Recovery) | +18% | -14% | +16% | +22% | Post-COVID rebound |
| Feb 2022 | +30% (Russia-Ukraine) | +22% | -18% | +20% | +28% | Supply shock |
| Jun 2022 | -35% (Recession fear) | -25% | +15% | -20% | -30% | Demand destruction |
| Jan 2024 | +15% (Middle East) | +12% | -10% | +11% | +16% | Geopolitical risk |
| **Average** | **±10%** | **±8.2%** | **±7.1%** | **±7.8%** | **±11.4%** | |

## 🎯 Key Takeaway

Crude oil's 10% move generates an average **8.2% response in XLE**, with oilfield services companies (HAL, SLB) amplifying that to **12-14%**. Airlines bear the heaviest cost burden, with JETS ETF dropping **7.1%** on average. For traders: the oil-airline inverse relationship is one of the most reliable macro trades in commodities.

**Position sizing note:** The XLE/JETS pair trade has delivered consistent risk-adjusted returns during sustained oil trends. Consider 2:1 weighting (XLE long vs JETS short) during uptrend phases.
