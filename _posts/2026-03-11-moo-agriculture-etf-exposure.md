---
layout: post
title: 'MOO: Agriculture ETF Cross-Commodity Exposure'
date: 2026-03-11
categories: [Agriculture, ETF]
tags: [agriculture, soybeans, corn, wheat, MOO, DE, ADM, NTR, CTVA]
description: 'MOO agriculture ETF analysis — cross-commodity exposure to grain prices, fertilizer costs, and the farm equipment cycle across global agribusiness.'
reading_time: 8
commodity_name: 'Agriculture'
direction: bullish
image: /assets/images/og-soybeans.png
---

The VanEck Agribusiness ETF (MOO) sits at the intersection of every major agricultural commodity cycle. When grain prices surge, MOO captures the ripple effect through its diversified holdings spanning farm equipment manufacturers, fertilizer producers, seed technology companies, and grain processors. But the relationship is far from simple: rising crop prices create winners and losers within agribusiness itself, and understanding those dynamics is essential for positioning in the agriculture space.

MOO's top holdings read like a who's who of global agribusiness: Deere & Company (DE), Archer-Daniels-Midland (ADM), Nutrien (NTR), and Corteva Agriscience (CTVA) together represent nearly 30% of the fund. Each responds differently to grain price movements. Equipment makers benefit from farmer profitability, fertilizer companies see demand pull-through, and seed companies capture pricing power during planting season rallies.

What makes MOO particularly interesting in the current environment is the divergence between upstream and downstream agriculture. A 10% rise in grain prices lifts farm incomes and equipment orders, but simultaneously squeezes livestock producers, food processors, and restaurant chains that depend on cheap agricultural inputs. This report maps the full cross-commodity exposure chain from field to fork.

<div class="cn-price-chart" data-symbol="ZS=F" data-name="Soybeans (CBOT)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "agriculture", label: "Grain Prices ↑10%", price: "Index", change: "+10%" },
  levels: [
    { nodes: [
      { id: "moo", label: "VanEck Agribusiness (MOO)", type: "etf", impact: 7.5, correlation: 0.82, marketCap: "1.2B", sector: "ETF" },
      { id: "de", label: "Deere & Co (DE)", type: "consumer", impact: 6.8, correlation: 0.74, marketCap: "118B", sector: "Farm Equipment" },
      { id: "adm", label: "Archer-Daniels (ADM)", type: "processor", impact: 8.2, correlation: 0.86, marketCap: "28B", sector: "Grain Processing" },
      { id: "ntr", label: "Nutrien (NTR)", type: "producer", impact: 9.5, correlation: 0.88, marketCap: "25B", sector: "Fertilizer" },
      { id: "ctva", label: "Corteva (CTVA)", type: "producer", impact: 5.8, correlation: 0.71, marketCap: "42B", sector: "Seed/Crop Science" },
      { id: "tsn", label: "Tyson Foods (TSN)", type: "consumer", impact: -6.5, correlation: -0.72, marketCap: "22B", sector: "Livestock" },
      { id: "dba", label: "Invesco Ag Fund (DBA)", type: "etf", impact: 8.5, correlation: 0.91, marketCap: "0.9B", sector: "ETF" },
      { id: "bg", label: "Bunge Global (BG)", type: "processor", impact: 7.6, correlation: 0.83, marketCap: "14B", sector: "Grain Trading" },
      { id: "mos_moo", label: "Mosaic Co (MOS)", type: "producer", impact: 10.2, correlation: 0.85, marketCap: "12B", sector: "Fertilizer" },
      { id: "cf_moo", label: "CF Industries (CF)", type: "producer", impact: 8.8, correlation: 0.8, marketCap: "16B", sector: "Nitrogen Fertilizer" },
      { id: "cnhi", label: "CNH Industrial (CNHI)", type: "consumer", impact: 5.5, correlation: 0.68, marketCap: "18B", sector: "Farm Equipment" },
      { id: "ipi_moo", label: "Intrepid Potash (IPI)", type: "producer", impact: 11, correlation: 0.78, marketCap: "0.5B", sector: "Potash" }
    ]},
    { nodes: [
      { id: "ppc", label: "Pilgrims Pride (PPC)", type: "consumer", impact: -7.2, correlation: -0.76, marketCap: "8B", sector: "Poultry", parentId: "tsn" },
      { id: "hor", label: "Hormel Foods (HRL)", type: "consumer", impact: -4.8, correlation: -0.58, marketCap: "17B", sector: "Meat Processing", parentId: "tsn" },
      { id: "fmc", label: "FMC Corp (FMC)", type: "producer", impact: 4.5, correlation: 0.62, marketCap: "6B", sector: "Crop Protection", parentId: "ctva" },
      { id: "fpi", label: "Farmland Partners (FPI)", type: "regional", impact: 6, correlation: 0.7, marketCap: "0.6B", sector: "Farmland REIT", parentId: "de" },
      { id: "agco_moo", label: "AGCO Corp (AGCO)", type: "consumer", impact: 5.2, correlation: 0.65, marketCap: "8B", sector: "Farm Equipment", parentId: "cnhi" },
      { id: "gis", label: "General Mills (GIS)", type: "consumer", impact: -3.5, correlation: -0.45, marketCap: "38B", sector: "Food Processing", parentId: "bg" },
      { id: "cal_maine", label: "Cal-Maine Foods (CALM)", type: "consumer", impact: -5.5, correlation: -0.62, marketCap: "4B", sector: "Egg Production", parentId: "tsn" },
      { id: "sanderson", label: "Sanderson Farms (SAFM)", type: "consumer", impact: -6.8, correlation: -0.7, marketCap: "5B", sector: "Poultry", parentId: "ppc" },
      { id: "lxu_moo", label: "LSB Industries (LXU)", type: "producer", impact: 7.5, correlation: 0.7, marketCap: "1.2B", sector: "Nitrogen", parentId: "cf_moo" },
      { id: "icl_moo", label: "ICL Group (ICL)", type: "producer", impact: 8.5, correlation: 0.74, marketCap: "8B", sector: "Specialty Minerals", parentId: "mos_moo" }
    ]},
    { nodes: [
      { id: "mcd", label: "McDonald's (MCD)", type: "consumer", impact: -2.8, correlation: -0.38, marketCap: "210B", sector: "Restaurants", parentId: "hor" },
      { id: "cpb", label: "Campbell Soup (CPB)", type: "consumer", impact: -3, correlation: -0.4, marketCap: "14B", sector: "Food Processing", parentId: "gis" },
      { id: "khc_moo", label: "Kraft Heinz (KHC)", type: "consumer", impact: -3.2, correlation: -0.42, marketCap: "42B", sector: "Packaged Food", parentId: "gis" },
      { id: "cost_moo", label: "Costco (COST)", type: "consumer", impact: -1.5, correlation: -0.22, marketCap: "380B", sector: "Retail", parentId: "gis" },
      { id: "sbux_moo", label: "Starbucks (SBUX)", type: "consumer", impact: -1.8, correlation: -0.25, marketCap: "105B", sector: "Restaurants", parentId: "mcd" },
      { id: "wheat_moo", label: "Wheat Futures (ZW=F)", type: "commodity", impact: 9, correlation: 0.88, sector: "Grains", parentId: "dba" },
      { id: "corn_moo", label: "Corn Futures (ZC=F)", type: "commodity", impact: 8.5, correlation: 0.85, sector: "Grains", parentId: "dba" },
      { id: "soy_moo", label: "Soybean Futures (ZS=F)", type: "commodity", impact: 9.5, correlation: 0.9, sector: "Oilseeds", parentId: "dba" },
      { id: "brazil_ag", label: "Brazilian Agriculture", type: "regional", impact: -4, correlation: -0.42, sector: "Agriculture", parentId: "bg" },
      { id: "india_ag", label: "India Agricultural Demand", type: "regional", impact: 5, correlation: 0.5, sector: "Agriculture", parentId: "ntr" },
      { id: "cbot_volume", label: "CBOT Trading Volume", type: "index", impact: 3.5, correlation: 0.45, sector: "Futures Markets", parentId: "adm" }
    ]},
    { nodes: [
      { id: "yum", label: "Yum! Brands (YUM)", type: "consumer", impact: -2.2, correlation: -0.32, marketCap: "40B", sector: "Restaurants", parentId: "mcd" },
      { id: "weather", label: "La Nina / El Nino Cycle", type: "macro", impact: 12, correlation: 0.72, sector: "Macro", parentId: "dba" },
      { id: "usd_ag", label: "USD / Export Demand", type: "fx", impact: -5.5, correlation: -0.6, sector: "Currency", parentId: "adm" },
      { id: "ethanol", label: "Ethanol Mandate / RFS", type: "policy", impact: 4, correlation: 0.42, sector: "Macro", parentId: "corn_moo" },
      { id: "china_import", label: "China Import Demand", type: "regional", impact: 8, correlation: 0.65, sector: "Macro", parentId: "bg" },
      { id: "usda_wasde", label: "USDA WASDE Reports", type: "macro", impact: 7, correlation: 0.6, sector: "Macro", parentId: "dba" },
      { id: "kos_moo", label: "Kellogg (K)", type: "consumer", impact: -2.5, correlation: -0.35, marketCap: "20B", sector: "Packaged Food", parentId: "cpb" },
      { id: "wmt_moo", label: "Walmart (WMT)", type: "consumer", impact: -1.2, correlation: -0.18, marketCap: "580B", sector: "Retail", parentId: "cost_moo" }
    ]},
    { nodes: [
      { id: "palm_oil", label: "Palm Oil (Substitute)", type: "substitute", impact: 6, correlation: 0.65, sector: "Vegetable Oils", parentId: "soy_moo" },
      { id: "brl_fx_moo", label: "Brazilian Real (BRL/USD)", type: "fx", impact: -3.5, correlation: -0.38, sector: "Currency", parentId: "brazil_ag" },
      { id: "cny_fx_moo", label: "Chinese Yuan (CNY)", type: "fx", impact: 2.5, correlation: 0.3, sector: "Currency", parentId: "china_import" },
      { id: "freight_moo", label: "Grain Freight Rates (BIMCO)", type: "freight", impact: 3, correlation: 0.35, sector: "Shipping", parentId: "bg" },
      { id: "fertilizer_xlink", label: "Fertilizer Prices (Cross-Link)", type: "commodity", impact: 8, correlation: 0.75, sector: "Fertilizer", parentId: "ntr" },
      { id: "biofuel_demand", label: "Biofuel / SAF Demand", type: "macro", impact: 5, correlation: 0.48, sector: "Energy", parentId: "soy_moo" },
      { id: "rice_cross", label: "Rice Prices (Cross-Link)", type: "commodity", impact: 4, correlation: 0.42, sector: "Grains", parentId: "wheat_moo" },
      { id: "argentina_ag", label: "Argentina Crop Exports", type: "regional", impact: -3.5, correlation: -0.38, sector: "S. America", parentId: "brazil_ag" },
      { id: "livestock_feed", label: "Livestock Feed Cost Index", type: "index", impact: -6, correlation: -0.65, sector: "Feed Costs", parentId: "tsn" }
    ]}
  ]
};
</script>

## Understanding MOO Exposure

The VanEck Agribusiness ETF (MOO) offers diversified exposure to the agriculture cycle, but its composition creates nuanced sensitivity to different commodity price regimes. MOO holds approximately 55 stocks spanning farm equipment, fertilizers, seed technology, grain trading, and animal health. This diversification means MOO never captures 100% of a grain price rally, but it also provides downside protection when any single commodity collapses.

MOO's largest sector exposure is farm equipment and machinery, led by Deere & Company (DE) at roughly 8% of the fund. This matters because equipment demand lags grain prices by 6-12 months. When soybean and corn prices surge, farmers book record profits and then invest in new tractors and combines during the following planting season. This delayed transmission mechanism means MOO often underperforms pure grain futures during the initial price spike but continues rising after grain prices stabilize.

The fertilizer component, anchored by Nutrien (NTR) and Mosaic (MOS), provides the most direct correlation to crop prices. When grains rise, farmers increase planted acreage and application rates, driving demand for potash, phosphate, and nitrogen. During the 2021-2022 agriculture supercycle, fertilizer stocks outperformed every other agribusiness subsector, with NTR gaining over 80% in twelve months.

## Winners When Grain Prices Rise

### Farm Equipment & Input Providers

| Asset | Type | Avg Impact (10% Grain Move) | Correlation |
|-------|------|----------------------------|-------------|
| **Nutrien (NTR)** | Fertilizer | +9.5% | 0.88 |
| **Mosaic Co (MOS)** | Fertilizer | +10.2% | 0.85 |
| **CF Industries (CF)** | Nitrogen | +8.8% | 0.80 |
| **Deere & Co (DE)** | Equipment | +6.8% | 0.74 |
| **Corteva (CTVA)** | Seeds/Crop Sci | +5.8% | 0.71 |

**Why they win:** Fertilizer producers have the most direct link to grain prices because higher crop values incentivize farmers to maximize yields through increased fertilizer application. Nutrien operates the world's largest retail agricultural distribution network and is the top potash producer globally. When grain prices rise 10%, farmer profitability expands significantly, and the incremental dollar of crop revenue justifies additional input spending. Deere benefits on a lag, as strong farm income translates to equipment orders 2-3 quarters later.

**Key insight:** The NTR-to-grain correlation of 0.88 is among the highest of any stock-to-commodity relationship in agribusiness. However, fertilizer stocks carry their own supply-side risk: potash production disruptions from Belarus sanctions or Saskatchewan mine flooding can move NTR independently of grain prices.

### Grain Traders & Processors

| Asset | Type | Avg Impact (10% Grain Move) | Correlation |
|-------|------|----------------------------|-------------|
| **Archer-Daniels (ADM)** | Grain Processing | +8.2% | 0.86 |
| **Bunge Global (BG)** | Grain Trading | +7.6% | 0.83 |
| **MOO ETF** | Agribusiness | +7.5% | 0.82 |
| **Farmland Partners (FPI)** | Farmland REIT | +6.0% | 0.70 |

**Why they win:** ADM and Bunge sit at the nexus of global grain flows. They profit from origination margins (buying from farmers), processing spreads (crushing soybeans into meal and oil), and transportation logistics. Rising grain prices increase the dollar value of their inventory and widen origination margins because farmer selling accelerates. Farmland Partners benefits directly through higher rental income as cropland values appreciate alongside commodity prices.

**Key insight:** ADM and BG benefit most from grain price volatility rather than simply direction. Their trading desks profit from wider bid-ask spreads during volatile markets, which is why these stocks sometimes rally even when grain prices are falling sharply.

## Losers When Grain Prices Rise

### Livestock Producers

| Asset | Type | Avg Impact (10% Grain Move) | Correlation |
|-------|------|----------------------------|-------------|
| **Pilgrims Pride (PPC)** | Poultry | -7.2% | -0.76 |
| **Tyson Foods (TSN)** | Meat Processing | -6.5% | -0.72 |
| **Hormel Foods (HRL)** | Meat Products | -4.8% | -0.58 |

**Why they lose:** Feed costs represent 55-70% of total production costs for poultry and hog operations. Corn and soybean meal are the primary feed ingredients, so a 10% grain price increase directly compresses livestock margins. Pilgrims Pride, as a pure-play poultry producer, carries the highest sensitivity because chicken has the shortest production cycle, meaning current feed costs immediately impact current profitability. Tyson's diversification across beef, pork, chicken, and prepared foods provides some buffer.

**Key insight:** The TSN-to-corn inverse correlation of -0.72 creates one of the clearest pair-trade opportunities in agriculture: long NTR (fertilizer) / short TSN (livestock) captures the full value transfer when grain prices rise. This spread widened by over 40% during the 2022 grain price spike.

### Food Processors & Restaurants

| Asset | Type | Avg Impact (10% Grain Move) | Correlation |
|-------|------|----------------------------|-------------|
| **General Mills (GIS)** | Packaged Food | -3.5% | -0.45 |
| **Campbell Soup (CPB)** | Packaged Food | -3.0% | -0.40 |
| **McDonald's (MCD)** | Quick Service | -2.8% | -0.38 |
| **Yum! Brands (YUM)** | Quick Service | -2.2% | -0.32 |

**Why they lose:** Food processors face a margin squeeze when wheat, corn, and soybean oil prices rise simultaneously. General Mills uses wheat as a primary input for cereals and baking products, while McDonald's faces higher costs across beef (grain-fed cattle), cooking oil, and bun ingredients. The correlations are lower than livestock producers because these companies have greater pricing power and longer-term supply contracts that buffer against short-term commodity spikes.

**Key insight:** Restaurant chains like MCD and YUM have demonstrated an ability to pass through commodity costs via menu price increases, but there is typically a 2-3 quarter lag. During that gap, margins compress and the stocks underperform. Watch for same-store sales reports following grain price spikes as the key indicator of successful pass-through.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| Fertilizer Producers | +9.8% | MOS/NTR | 0.86 |
| Grain Traders | +7.9% | ADM/BG | 0.84 |
| Farm Equipment | +6.2% | DE/CNHI | 0.71 |
| Seed Technology | +5.8% | CTVA/FMC | 0.67 |
| Farmland REITs | +6.0% | FPI | 0.70 |
| Livestock Producers | -6.9% | TSN/PPC | -0.74 |
| Food Processors | -3.3% | GIS/CPB | -0.43 |
| Restaurants | -2.5% | MCD/YUM | -0.35 |

## Historical Price Moves

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Mar 2022 | Ukraine war grain shock | Wheat +60%, Corn +30% | MOO +22%, NTR +45%, TSN -18% | Black Sea export blockade |
| Jun 2023 | Midwest drought scare | Soybeans +18%, Corn +22% | MOO +11%, DE +8%, PPC -12% | Heat dome over Corn Belt |
| Oct 2021 | China stockpiling | Soybeans +25% | ADM +20%, BG +18%, GIS -6% | Record Chinese imports |
| Apr 2020 | COVID demand collapse | Corn -20%, Wheat -15% | MOO -14%, NTR -18%, TSN +5% | Ethanol demand cratered |
| Feb 2025 | Argentine drought | Soybeans +15%, Corn +10% | MOO +9%, MOS +14%, HRL -5% | Worst drought in 50 years |
| Aug 2024 | Record US harvest | Corn -12%, Soybeans -10% | MOO -7%, CF -11%, TSN +8% | Bin-busting yields |

## Key Takeaway

MOO delivers approximately +7.5% for every 10% rise in grain prices, making it an effective but moderated play on agricultural commodity cycles. The ETF's diversification across fertilizers (+9.8% sector impact), equipment (+6.2%), and grain traders (+7.9%) provides broad upside exposure while naturally hedging against single-commodity risk. Investors seeking maximum leverage should look at individual fertilizer names like NTR and MOS, which amplify grain moves by nearly 1:1.

The critical dynamic to monitor is the upstream-downstream divergence. When grain prices rise, the agriculture value chain splits cleanly: input providers and grain handlers win while livestock producers, food companies, and restaurants lose. This creates actionable pair-trade opportunities and sector rotation signals. The strongest historical predictor of MOO performance is the USDA monthly WASDE (World Agricultural Supply and Demand Estimates) report, which moves grain prices and, by extension, the entire agribusiness complex.
