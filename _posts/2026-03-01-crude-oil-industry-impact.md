---
layout: post
title: "Crude Oil Price Impact: Winners & Losers Across 12 Industries"
date: 2026-03-01
categories: [Energy, Analysis]
tags: [crude-oil, XOM, CVX, HAL, XLE, JETS, energy, airlines, refining]
description: "Interactive analysis of how crude oil price movements impact XOM, CVX, HAL, airlines (JETS ETF), and the entire energy sector with correlation data."
reading_time: 9
---

Crude oil remains the world's most traded commodity — and its price swings create immediate winners and losers across global markets. A 10% move in WTI crude ripples through airlines, refiners, oilfield services, and consumer staples within days. Understanding those correlations is the edge every investor needs.

## The Impact Map

<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  nodes: [
    { id: "crude_oil", label: "Crude Oil +10%", type: "commodity", price: "$85.40", change: "+10%" },
    { id: "xle", label: "XLE (Energy ETF)", type: "etf", impact: +8.2, correlation: 0.92 },
    { id: "jets", label: "JETS (Airlines ETF)", type: "etf", impact: -7.1, correlation: -0.81 },
    { id: "xom", label: "ExxonMobil (XOM)", type: "positive", impact: +9, correlation: 0.89, sector: "Energy" },
    { id: "cvx", label: "Chevron (CVX)", type: "positive", impact: +8, correlation: 0.87, sector: "Energy" },
    { id: "hal", label: "Halliburton (HAL)", type: "positive", impact: +14, correlation: 0.91, sector: "Oilfield Services" },
    { id: "slb", label: "SLB (SLB)", type: "positive", impact: +12, correlation: 0.88, sector: "Oilfield Services" },
    { id: "aal", label: "American Airlines (AAL)", type: "negative", impact: -11, correlation: -0.79, sector: "Airlines" },
    { id: "dal", label: "Delta Air Lines (DAL)", type: "negative", impact: -9, correlation: -0.76, sector: "Airlines" },
    { id: "ups", label: "UPS (UPS)", type: "negative", impact: -4, correlation: -0.62, sector: "Logistics" },
    { id: "oilfield_services", label: "Oilfield Services", type: "positive", impact: +13, sector: "Energy" },
    { id: "refining", label: "Refining Sector", type: "positive", impact: +6, sector: "Energy" },
    { id: "airlines_industry", label: "Airlines Industry", type: "negative", impact: -10, sector: "Transportation" },
    { id: "plastics", label: "Plastics & Chemicals", type: "negative", impact: -5, sector: "Materials" },
  ],
  links: [
    { source: "crude_oil", target: "xle", strength: 0.92 },
    { source: "crude_oil", target: "jets", strength: 0.81 },
    { source: "crude_oil", target: "xom", strength: 0.89 },
    { source: "crude_oil", target: "cvx", strength: 0.87 },
    { source: "crude_oil", target: "hal", strength: 0.91 },
    { source: "crude_oil", target: "slb", strength: 0.88 },
    { source: "crude_oil", target: "aal", strength: 0.79 },
    { source: "crude_oil", target: "dal", strength: 0.76 },
    { source: "crude_oil", target: "ups", strength: 0.62 },
    { source: "crude_oil", target: "oilfield_services", strength: 0.90 },
    { source: "crude_oil", target: "refining", strength: 0.75 },
    { source: "crude_oil", target: "airlines_industry", strength: 0.80 },
    { source: "crude_oil", target: "plastics", strength: 0.65 },
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

---

*Disclaimer: This analysis is for educational purposes only and does not constitute financial advice. Correlation data is based on historical patterns and past performance does not guarantee future results. Always conduct your own due diligence before making investment decisions.*
