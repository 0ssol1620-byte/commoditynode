---
layout: post
title: 'DBA: Agriculture Commodity Basket Risk Profile'
date: 2026-03-15
categories: [Agriculture, ETF]
tags: [agriculture, wheat, corn, soybeans, coffee, sugar, DBA, MOO]
description: 'DBA agriculture commodity ETF risk analysis — basket composition, weather sensitivity, and how diversified ag exposure compares to single-commodity plays.'
reading_time: 8
commodity_name: 'Agriculture'
image: /assets/images/og-wheat.png
---

The Invesco DB Agriculture Fund (DBA) is the most widely held agriculture commodity ETF, offering diversified exposure to a basket of agricultural futures including wheat, corn, soybeans, coffee, sugar, cocoa, cotton, and live cattle. Unlike equity-based agriculture ETFs like MOO that hold agribusiness stocks, DBA provides direct commodity price exposure through futures contracts, making it a fundamentally different instrument with distinct risk characteristics and correlation profiles.

DBA's basket approach creates a natural diversification benefit that single-commodity plays cannot replicate. When drought devastates the US corn crop, Brazilian soybeans may benefit from increased demand, and Australian wheat harvests may come in strong. This offsetting dynamic means DBA typically moves less than any individual component but provides steadier, more predictable returns during broad agricultural inflation. For investors seeking a hedge against food price increases without the stock-specific risk of individual agribusiness companies, DBA is the most direct available instrument.

The current agricultural environment features divergent forces: La Nina conditions threatening South American soybean and coffee production, record US corn plantings depressing domestic grain prices, and persistent cocoa supply deficits driving that market to historic highs. This patchwork of bullish and bearish signals across DBA's components illustrates exactly why basket diversification matters and how the fund's rolling methodology and commodity weights determine the ultimate portfolio impact of a 10% move in the underlying index.

<div class="cn-price-chart" data-symbol="ZW=F" data-name="Wheat Futures (CBOT)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "agriculture", label: "Ag Basket ↑10%", price: "Index", change: "+10%" },
  levels: [
    { nodes: [
      { id: "dba", label: "Invesco DB Ag (DBA)", type: "etf", impact: 9.2, correlation: 0.95, marketCap: "0.9B", sector: "ETF" },
      { id: "adm_dba", label: "Archer-Daniels (ADM)", type: "positive", impact: 7.5, correlation: 0.82, marketCap: "28B", sector: "Grain Processing" },
      { id: "bg_dba", label: "Bunge Global (BG)", type: "positive", impact: 7.0, correlation: 0.80, marketCap: "14B", sector: "Grain Trading" },
      { id: "mos_dba", label: "Mosaic Co (MOS)", type: "positive", impact: 8.8, correlation: 0.78, marketCap: "12B", sector: "Fertilizer" },
      { id: "ntr_dba", label: "Nutrien (NTR)", type: "positive", impact: 8.2, correlation: 0.76, marketCap: "25B", sector: "Fertilizer" },
      { id: "gis_dba", label: "General Mills (GIS)", type: "negative", impact: -3.8, correlation: -0.48, marketCap: "38B", sector: "Food Processing" }
    ]},
    { nodes: [
      { id: "moo_dba", label: "VanEck Agribusiness (MOO)", type: "etf", impact: 6.5, correlation: 0.78, marketCap: "1.2B", sector: "ETF", parentId: "dba" },
      { id: "de_dba", label: "Deere & Co (DE)", type: "positive", impact: 5.5, correlation: 0.68, marketCap: "118B", sector: "Farm Equipment", parentId: "adm_dba" },
      { id: "cf_dba", label: "CF Industries (CF)", type: "positive", impact: 7.8, correlation: 0.74, marketCap: "16B", sector: "Nitrogen", parentId: "ntr_dba" },
      { id: "cpb_dba", label: "Campbell Soup (CPB)", type: "negative", impact: -3.2, correlation: -0.42, marketCap: "14B", sector: "Food Processing", parentId: "gis_dba" },
      { id: "tsn_dba", label: "Tyson Foods (TSN)", type: "negative", impact: -5.8, correlation: -0.68, marketCap: "22B", sector: "Livestock", parentId: "gis_dba" }
    ]},
    { nodes: [
      { id: "mcd_dba", label: "McDonald's (MCD)", type: "negative", impact: -2.5, correlation: -0.35, marketCap: "210B", sector: "Restaurants", parentId: "cpb_dba" },
      { id: "yum_dba", label: "Yum! Brands (YUM)", type: "negative", impact: -2.0, correlation: -0.30, marketCap: "40B", sector: "Restaurants", parentId: "mcd_dba" },
      { id: "sbux_dba", label: "Starbucks (SBUX)", type: "negative", impact: -3.5, correlation: -0.55, marketCap: "105B", sector: "Coffee Retail", parentId: "dba" },
      { id: "fpi_dba", label: "Farmland Partners (FPI)", type: "positive", impact: 5.5, correlation: 0.65, marketCap: "0.6B", sector: "Farmland REIT", parentId: "de_dba" },
      { id: "ppc_dba", label: "Pilgrims Pride (PPC)", type: "negative", impact: -6.5, correlation: -0.72, marketCap: "8B", sector: "Poultry", parentId: "tsn_dba" }
    ]},
    { nodes: [
      { id: "hsy_dba", label: "Hershey Co (HSY)", type: "negative", impact: -4.0, correlation: -0.50, marketCap: "32B", sector: "Confectionery", parentId: "sbux_dba" },
      { id: "kgc_dba", label: "Keurig Dr Pepper (KDP)", type: "negative", impact: -2.8, correlation: -0.38, marketCap: "46B", sector: "Beverages", parentId: "sbux_dba" },
      { id: "weather_dba", label: "La Nina / El Nino Cycle", type: "macro", impact: 14.0, sector: "Macro", parentId: "dba" },
      { id: "usd_dba", label: "USD Strength", type: "negative", impact: -6.0, correlation: -0.62, sector: "Macro", parentId: "adm_dba" },
      { id: "biofuel_dba", label: "Biofuel Mandates", type: "positive", impact: 5.0, sector: "Macro", parentId: "bg_dba" },
      { id: "food_cpi", label: "Food CPI Inflation", type: "negative", impact: -3.0, sector: "Macro", parentId: "gis_dba" }
    ]}
  ]
};
</script>

## Understanding DBA Exposure

DBA tracks the DBIQ Diversified Agriculture Index Excess Return, which uses an optimized rolling methodology to select futures contracts across 10 agricultural commodities. The fund's weighting changes periodically based on a proprietary algorithm that considers backwardation, contango, and historical price signals. As of early 2026, DBA's approximate weighting is: soybeans (~14%), corn (~13%), wheat (~13%), sugar (~12%), coffee (~11%), cocoa (~10%), cotton (~9%), live cattle (~8%), lean hogs (~5%), and feeder cattle (~5%).

This diversified composition means DBA responds to broad agricultural inflation rather than any single crop's fortune. The fund's 0.95 correlation to its own index is expected, but the more useful metric is DBA's 0.78 correlation to MOO (the agribusiness equity ETF). This strong but imperfect correlation arises because agribusiness stocks carry earnings momentum, multiple expansion, and equity market beta in addition to commodity price sensitivity. DBA strips away all the equity noise and delivers pure commodity exposure.

A critical consideration for DBA investors is the roll yield cost. Agricultural futures curves are frequently in contango (front-month contracts cheaper than deferred), which means DBA loses value each month as it rolls expiring contracts into more expensive ones. This "contango drag" has historically cost DBA investors 3-6% annually, meaning the underlying commodities must appreciate by at least that amount just for the ETF to break even. During strong backwardation periods (like the 2022 grain crisis), this dynamic reverses and DBA earns positive roll yield on top of price appreciation.

## Winners When the Ag Basket Rises

### Grain Processors & Traders

| Asset | Type | Avg Impact (10% Basket Move) | Correlation |
|-------|------|------------------------------|-------------|
| **DBA ETF (Direct)** | Commodity ETF | +9.2% | 0.95 |
| **Archer-Daniels (ADM)** | Grain Processing | +7.5% | 0.82 |
| **Bunge Global (BG)** | Grain Trading | +7.0% | 0.80 |
| **MOO ETF** | Agribusiness | +6.5% | 0.78 |

**Why they win:** ADM and Bunge are the infrastructure of global grain markets. They own the silos, barges, port terminals, and crushing facilities through which agricultural commodities flow from farm to end user. When the DBA basket rises 10%, it signals broad agricultural inflation that increases the dollar value of grain in transit and storage, widens origination margins as farmers accelerate selling, and expands crush spreads for soybean processors. ADM's Nutrition segment also benefits from higher protein meal prices.

**Key insight:** DBA and MOO respond similarly to broad agricultural inflation (+9.2% vs +6.5%), but their risk profiles differ substantially. DBA carries no equity market beta, making it a better hedge against food price inflation in a stock market downturn. MOO carries stock market risk but also captures operating leverage from agribusiness company earnings growth. The optimal agricultural allocation may include both.

### Fertilizer Producers

| Asset | Type | Avg Impact (10% Basket Move) | Correlation |
|-------|------|------------------------------|-------------|
| **Mosaic Co (MOS)** | Potash/Phosphate | +8.8% | 0.78 |
| **Nutrien (NTR)** | Diversified Fertilizer | +8.2% | 0.76 |
| **CF Industries (CF)** | Nitrogen | +7.8% | 0.74 |
| **Farmland Partners (FPI)** | Farmland REIT | +5.5% | 0.65 |
| **Deere & Co (DE)** | Farm Equipment | +5.5% | 0.68 |

**Why they win:** Broad agricultural price increases signal strong farmer economics, which drives demand for yield-maximizing inputs. When the DBA basket is elevated, farmers are incentivized to plant maximum acreage and apply maximum fertilizer to capitalize on high prices. Mosaic benefits from potash and phosphate demand in soybean and corn production. CF Industries captures nitrogen demand for corn (the most nitrogen-intensive major crop). Farmland Partners sees direct appreciation in rental income and underlying land values.

**Key insight:** Fertilizer stocks correlate more strongly with individual grain prices (especially corn for nitrogen, soybeans for potash) than with the DBA basket because different crops require different nutrient profiles. MOS correlation to soybeans alone is 0.85, higher than its 0.78 correlation to DBA. For maximum fertilizer exposure, focus on the grain components rather than the full basket.

## Losers When the Ag Basket Rises

### Livestock Producers

| Asset | Type | Avg Impact (10% Basket Move) | Correlation |
|-------|------|------------------------------|-------------|
| **Pilgrims Pride (PPC)** | Poultry | -6.5% | -0.72 |
| **Tyson Foods (TSN)** | Diversified Meat | -5.8% | -0.68 |

**Why they lose:** Livestock producers are the most direct losers from rising agricultural commodity prices because grain represents 55-70% of poultry and hog production costs. When DBA's corn and soybean components rise simultaneously, feed costs spike across all protein categories. Pilgrims Pride, as the largest US chicken producer, has the most concentrated exposure: a 10% increase in the DBA basket translates to approximately 6-7% feed cost inflation, which takes 3-6 months to pass through to wholesale chicken prices. During that lag, margins get crushed.

**Key insight:** The DBA-livestock relationship creates one of the most reliable mean-reversion trades in commodities. When grain prices spike, livestock producers suffer for 1-2 quarters before raising meat prices to restore margins. TSN typically recovers within 6 months of a grain price peak, making the trough in TSN shares a historically reliable buying opportunity.

### Food Companies & Restaurants

| Asset | Type | Avg Impact (10% Basket Move) | Correlation |
|-------|------|------------------------------|-------------|
| **Hershey Co (HSY)** | Confectionery | -4.0% | -0.50 |
| **General Mills (GIS)** | Packaged Food | -3.8% | -0.48 |
| **Starbucks (SBUX)** | Coffee Retail | -3.5% | -0.55 |
| **Campbell Soup (CPB)** | Packaged Food | -3.2% | -0.42 |
| **Keurig Dr Pepper (KDP)** | Beverages | -2.8% | -0.38 |
| **McDonald's (MCD)** | QSR | -2.5% | -0.35 |
| **Yum! Brands (YUM)** | QSR | -2.0% | -0.30 |

**Why they lose:** When the DBA basket rises 10%, it means wheat (General Mills cereals), cocoa (Hershey chocolate), coffee (Starbucks and Keurig), sugar (confectionery and beverages), and corn/soybeans (cooking oil, animal feed for restaurant beef) are all more expensive simultaneously. This broad cost inflation squeezes margins across the food value chain. Hershey carries the highest basket sensitivity because cocoa and sugar together represent a large portion of its COGS, and both are DBA components.

**Key insight:** Starbucks' -0.55 correlation to the ag basket is disproportionately driven by coffee price moves within DBA. Coffee represents roughly 11% of DBA's weight but drives approximately 60% of SBUX's DBA sensitivity. This means SBUX is a better short against coffee-specific inflation than broad agricultural inflation, and investors should examine DBA component weights when evaluating individual stock exposures.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| DBA (Direct) | +9.2% | DBA | 0.95 |
| Fertilizer | +8.3% | MOS/NTR | 0.76 |
| Grain Traders | +7.3% | ADM/BG | 0.81 |
| Agribusiness ETF | +6.5% | MOO | 0.78 |
| Farm Equipment | +5.5% | DE/CNHI | 0.68 |
| Livestock | -6.2% | TSN/PPC | -0.70 |
| Confectionery | -4.0% | HSY | -0.50 |
| Packaged Food | -3.5% | GIS/CPB | -0.45 |

## Historical Price Moves

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Mar 2022 | Ukraine war / grain embargo | DBA +28% | ADM +32%, MOS +55%, TSN -15% | Black Sea blockade |
| Jul 2023 | US Midwest drought | DBA +12% | BG +14%, NTR +10%, PPC -9% | Corn/soy rally |
| Nov 2023 | Record global harvest | DBA -15% | ADM -12%, CF -18%, TSN +10% | Bumper crops worldwide |
| Oct 2024 | Cocoa supply crisis | DBA +8% (cocoa +60%) | HSY -22%, DBA modest gain | Single commodity dominated |
| Apr 2025 | La Nina grain scare | DBA +10% | MOO +8%, DE +6%, GIS -4% | South American drought |
| Jan 2026 | Broad ag inflation | DBA +10% | DBA +9.2%, MOS +9%, SBUX -4% | Multi-commodity rally |

## Key Takeaway

DBA delivers approximately +9.2% for every 10% rise in its underlying agriculture basket, making it the most direct and efficient instrument for broad agricultural commodity exposure. The fund's diversification across 10 commodities provides natural hedging that single-crop futures cannot match: even when corn disappoints, coffee and cocoa can carry the basket higher. DBA's primary cost is the contango roll yield drag of 3-6% annually, which investors must account for in their return expectations.

The DBA-versus-MOO comparison reveals a fundamental tradeoff: DBA provides purer commodity exposure with a 0.95 index correlation but carries roll costs and no equity upside, while MOO captures agribusiness earnings growth but introduces stock market beta and company-specific risk. For inflation hedging, DBA is the superior instrument. For long-term capital appreciation in an agricultural bull market, MOO may compound more effectively. The clearest portfolio application for DBA is as a tactical overlay during periods of rising food inflation, particularly when weather disruptions (La Nina/El Nino) threaten multiple growing regions simultaneously.
