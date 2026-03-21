---
layout: post
title: 'Hershey: Cocoa Price Impact on Margins'
date: 2026-03-15
categories: [Soft, Analysis]
tags: [cocoa, soft, HSY, MDLZ, NSRGY, TR, chocolate, agriculture]
description: 'How cocoa price surges squeeze Hershey margins, the confectionery industry pricing power dynamics, and winners in the cocoa supply chain.'
reading_time: 9
commodity_name: 'Cocoa'
image: /assets/images/og-cocoa.png
---

Cocoa prices have reached an extraordinary $9,800 per metric ton on the ICE Futures exchange, a level that would have been considered unthinkable just three years ago when the commodity traded at $2,500. For Hershey Company, North America's dominant chocolate manufacturer with an estimated 45% share of the U.S. chocolate market, this price environment represents the most severe cost challenge in the company's 130-year history. Cocoa and cocoa butter together represent approximately 35-40% of Hershey's cost of goods sold, and unlike many commodity exposures that can be hedged over multi-year horizons, cocoa's extreme volatility and thin futures liquidity beyond 12-18 months make long-term hedging prohibitively expensive.

The cocoa supply crisis is structural, not cyclical. West Africa -- specifically Ivory Coast and Ghana, which together produce roughly 60% of the world's cocoa -- is facing a convergence of crises: the cocoa swollen shoot virus disease (CSSVD) has infected an estimated 15-20% of Ghana's cocoa tree stock, requiring mass cutting and replanting programs that remove productive trees for 3-5 years. Simultaneously, aging tree demographics are reducing yields across the region, as trees planted during the cocoa boom of the 1980s and 1990s approach the end of their productive lives at 25-30 years. Climate change is shifting rainfall patterns in the Guinean forest zone, compressing the optimal growing belt and increasing crop stress.

For equity investors, the cocoa price surge creates the most dramatic winner-loser divide in the soft commodities space. Upstream cocoa-producing nations and trading houses capture windfall profits, while downstream chocolate manufacturers face an unprecedented cost squeeze that is forcing fundamental changes in product formulation, package sizes, and pricing strategy. The magnitude of the current rally -- cocoa has nearly quadrupled from its 2022 lows -- exceeds any comparable move in the past half century and requires investors to rethink traditional assumptions about mean reversion in agricultural commodities.

<div class="cn-price-chart" data-symbol="CC=F" data-name="Cocoa Futures (ICE)"></div>

<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "cocoa", label: "Cocoa ↑20%", price: "$9,800/t", change: "+20%" },
  levels: [
    { nodes: [
      { id: "hsy", label: "Hershey (HSY)", type: "negative", impact: -11.0, correlation: -0.85, marketCap: "33B", sector: "Chocolate" },
      { id: "mdlz", label: "Mondelez (MDLZ)", type: "negative", impact: -5.5, correlation: -0.55, marketCap: "92B", sector: "Snacks/Chocolate" },
      { id: "nib", label: "iPath Cocoa (NIB)", type: "etf", impact: 19.2, correlation: 0.97, marketCap: "0.09B", sector: "ETF" },
      { id: "nsrgy", label: "Nestlé (NSRGY)", type: "negative", impact: -3.8, correlation: -0.45, marketCap: "285B", sector: "Food/Chocolate" },
      { id: "barry", label: "Barry Callebaut (BARN.SW)", type: "negative", impact: -8.5, correlation: -0.78, marketCap: "8B", sector: "Chocolate Processing" }
    ]},
    { nodes: [
      { id: "ivory_coast", label: "Ivory Coast CCC", type: "positive", impact: 22.0, correlation: 0.96, sector: "National Board", parentId: "nib" },
      { id: "ghana_cocobod", label: "Ghana Cocobod", type: "positive", impact: 20.0, correlation: 0.94, sector: "National Board", parentId: "nib" },
      { id: "tr", label: "Tootsie Roll (TR)", type: "negative", impact: -7.0, correlation: -0.68, marketCap: "2.8B", sector: "Confectionery", parentId: "hsy" },
      { id: "rmcf", label: "Rocky Mountain Choc (RMCF)", type: "negative", impact: -16.0, correlation: -0.90, marketCap: "0.04B", sector: "Specialty Chocolate", parentId: "hsy" },
      { id: "olam", label: "Olam Group", type: "positive", impact: 10.0, correlation: 0.80, marketCap: "4.5B", sector: "Cocoa Trading", parentId: "barry" }
    ]},
    { nodes: [
      { id: "west_africa_farm", label: "West African Growers", type: "positive", impact: 18.0, correlation: 0.93, sector: "Cocoa Farming", parentId: "ivory_coast" },
      { id: "cargill_cocoa", label: "Cargill Cocoa (Private)", type: "positive", impact: 9.0, correlation: 0.75, sector: "Cocoa Processing", parentId: "olam" },
      { id: "lindt", label: "Lindt & Sprüngli", type: "negative", impact: -6.5, correlation: -0.62, marketCap: "24B", sector: "Premium Chocolate", parentId: "nsrgy" },
      { id: "craft_choc", label: "Craft Chocolate Makers", type: "negative", impact: -20.0, correlation: -0.94, sector: "Artisan Chocolate", parentId: "rmcf" },
      { id: "cocoa_butter", label: "Cocoa Butter Market", type: "positive", impact: 15.0, correlation: 0.90, sector: "Ingredients", parentId: "barry" }
    ]},
    { nodes: [
      { id: "carob_alt", label: "Carob/Alternatives", type: "positive", impact: 8.0, correlation: 0.58, sector: "Alternatives", parentId: "craft_choc" },
      { id: "shrinkflation", label: "Shrinkflation Trend", type: "negative", impact: -4.0, correlation: -0.40, sector: "Consumer Impact", parentId: "tr" },
      { id: "cosmetics_cb", label: "Cocoa Butter Cosmetics", type: "negative", impact: -5.5, correlation: -0.52, sector: "Beauty", parentId: "cocoa_butter" },
      { id: "cssvd", label: "Swollen Shoot Virus (CSSVD)", type: "positive", impact: 16.0, sector: "Macro", parentId: "ghana_cocobod" },
      { id: "aging_trees", label: "Aging Tree Stock", type: "positive", impact: 12.0, sector: "Macro", parentId: "ivory_coast" },
      { id: "restaurant_choc", label: "Restaurants (Chocolate Menu)", type: "negative", impact: -2.5, correlation: -0.28, sector: "Restaurants", parentId: "lindt" }
    ]}
  ]
};
</script>

## Understanding Hershey's Cocoa Exposure

Hershey purchases approximately 350,000 metric tons of cocoa beans and cocoa-derived ingredients annually, making it one of the top five cocoa buyers in the world. The company's procurement strategy involves a combination of forward purchasing through ICE cocoa futures, direct origin purchasing from cooperatives in West Africa and South America, and pre-agreed pricing contracts with processing intermediaries like Barry Callebaut and Cargill. In normal market conditions, Hershey maintains a 6-12 month hedge book that provides cost visibility for near-term production planning. However, the current price environment has strained this approach: with cocoa prices having roughly quadrupled from 2022 levels, hedging at current prices locks in historically elevated costs, while leaving positions unhedged exposes the company to further upside risk.

The margin impact on Hershey is already severe and accelerating. In the most recent quarter, Hershey reported a 450 basis point year-over-year decline in gross margin, with cocoa and cocoa butter costs cited as the primary driver. The company's response has been multi-pronged: retail price increases averaging 8-12% across its portfolio, package size reductions (shrinkflation) on popular products including Hershey's Kisses and Reese's cups, and reformulation efforts to reduce cocoa content in certain products by substituting cocoa butter equivalents (CBEs) and increasing sugar and milk content. These measures have partially offset the cost impact but have not prevented margin erosion, and they carry brand risk if consumers perceive quality degradation.

What makes Hershey uniquely vulnerable compared to peers like Mondelez or Nestle is its product concentration. Chocolate products represent approximately 80% of Hershey's revenue, compared to roughly 30% for Mondelez (which has large non-chocolate businesses in biscuits, gum, and candy) and less than 15% for Nestle (where coffee, pet food, and infant nutrition dominate). This concentration means cocoa price movements hit Hershey's bottom line with far greater force than any competitor, earning HSY its well-deserved reputation as the "cocoa proxy" among institutional investors.

Hershey's salty snacks segment -- including SkinnyPop, Pirate's Booty, and Dot's Pretzels -- provides some natural hedge against cocoa prices because these products have zero cocoa content and benefit from consumer trade-down during periods when chocolate becomes more expensive. This segment has been growing at 8-12% annually and now represents roughly 15% of revenue. However, it is not yet large enough to meaningfully offset the cocoa impact on the dominant chocolate business. For the salty snacks segment to become a genuine diversification shield, it would need to reach 25-30% of revenue -- a target that Hershey management has indicated they are pursuing through both organic growth and potential acquisitions.

## Winners When Cocoa Rises

### Cocoa Producers and National Boards

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Ivory Coast CCC** | National Cocoa Board | +22.0% | 0.96 |
| **Ghana Cocobod** | National Cocoa Board | +20.0% | 0.94 |
| **iPath Cocoa (NIB)** | Cocoa Futures ETN | +19.2% | 0.97 |
| **West African Growers** | Cocoa Farming | +18.0% | 0.93 |

**Why they win:** The Conseil du Cafe-Cacao (CCC) in Ivory Coast and the Ghana Cocoa Board (Cocobod) are the two most powerful institutions in the global cocoa market. Both set farmgate prices for their respective countries' cocoa crops and collect export taxes and levies that scale with international prices. When ICE cocoa futures rise, these national boards capture a direct revenue windfall through higher export duties and increased forward sales revenue. Ivory Coast's cocoa export revenue is projected to exceed $8 billion in the current crop year, up from $4 billion just two years ago.

For individual West African growers, the farmgate price increases mandated by CCC and Cocobod translate to significantly higher household incomes, though the pass-through is partial (farmers typically receive 50-60% of the FOB export price). The recent political pressure in both countries to increase the farmer share of export value adds a secondary dynamic -- both governments have raised the Living Income Differential (LID), a $400/t premium above the ICE price, though enforcement has been inconsistent.

**Key insight:** The NIB ETN provides the most direct publicly tradeable exposure to cocoa prices with a 0.97 correlation, but carries important structural risks. NIB is an exchange-traded note (not a fund), meaning it carries issuer credit risk. Additionally, NIB's AUM is relatively small at approximately $90 million, which can create liquidity issues during volatile periods and can result in premiums or discounts to NAV exceeding 3-5%. For larger institutional positions, direct cocoa futures on ICE or the LIFFE are more appropriate vehicles. The December and March cocoa contracts typically offer the best liquidity.

### Cocoa Traders and Processors

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Cocoa Butter Market** | Ingredients | +15.0% | 0.90 |
| **Olam Group** | Cocoa Trading | +10.0% | 0.80 |
| **Cargill Cocoa (Private)** | Cocoa Processing | +9.0% | 0.75 |
| **Carob/Alternatives** | Alternatives | +8.0% | 0.58 |

**Why they win:** The cocoa butter market deserves special attention because cocoa butter prices have risen even faster than cocoa bean prices. Cocoa butter is produced during the grinding process as beans are separated into cocoa solids (used for cocoa powder) and cocoa butter (used for chocolate texture and cosmetics). The cocoa butter ratio -- the price of butter expressed as a multiple of bean prices -- has expanded from its typical 2.5x to over 3.0x, indicating that butter demand is outstripping supply even relative to the already-elevated bean market.

Olam Group, one of the three largest cocoa traders globally alongside Cargill and Barry Callebaut, benefits from wider origination margins and increased inventory gains during rising price environments. Trading houses profit from the volatility itself -- their physical trading operations capture wider bid-ask spreads when the market is moving rapidly, and their warehouse financing activities generate higher returns when the value of stored inventory appreciates. Carob and cocoa alternatives see increased interest as chocolate manufacturers explore cost-saving substitutions, though the total addressable market for alternatives remains small relative to traditional cocoa.

**Key insight:** Watch the Ivory Coast and Ghana forward cocoa sales data (published by CCC and Cocobod respectively) as a leading indicator of supply expectations. When these national boards slow their forward sales, it signals that they expect prices to continue rising, which creates further upward pressure on the market. Current data shows that Ivory Coast has sold forward only 40% of its projected 2026/27 crop, well below the historical average of 65% at this point in the season -- a bullish signal for continued price strength.

## Losers When Cocoa Rises

### Chocolate Manufacturers

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Craft Chocolate Makers** | Artisan Chocolate | -20.0% | -0.94 |
| **Rocky Mountain Choc (RMCF)** | Specialty Chocolate | -16.0% | -0.90 |
| **Hershey (HSY)** | Chocolate/Confectionery | -11.0% | -0.85 |
| **Barry Callebaut (BARN.SW)** | Chocolate Processing | -8.5% | -0.78 |
| **Tootsie Roll (TR)** | Confectionery | -7.0% | -0.68 |

**Why they lose:** The craft chocolate segment is devastated by cocoa price surges because these small-batch producers use premium single-origin cocoa beans (typically priced at 2-3x commodity cocoa) and have zero hedging capability and minimal pricing power with their niche customer base. A craft chocolate bar that cost $8 at $3,000/t cocoa now needs to retail at $14+ to maintain margins, pushing deeply into consumer resistance territory. Rocky Mountain Chocolate Factory, as the only publicly traded specialty chocolate franchisor, serves as a barometer for the broader artisan segment, and its shares have declined 25%+ from pre-rally levels.

Hershey absorbs the next-heaviest impact due to its 80% chocolate revenue concentration. Barry Callebaut is a unique case: as the world's largest B2B chocolate processor (supplying chocolate couverture to other manufacturers), it operates on a cost-plus model where raw material costs are theoretically passed through to customers. However, when cocoa prices spike this dramatically, Barry Callebaut's customers push back on pass-throughs, compress purchasing volumes, and reformulate products to reduce chocolate content, creating volume and margin headwinds that its theoretical business model does not fully capture.

**Key insight:** Hershey's stock historically oversells during cocoa price spikes because the market extrapolates current spot prices into perpetuity. In reality, Hershey's hedge book provides 6-12 months of cost protection at pre-spike prices, meaning the full P&L impact is deferred. Furthermore, HSY's pricing actions typically offset 50-60% of commodity cost increases within 2-3 quarters. For contrarian investors, HSY at 18-20x forward earnings during a cocoa spike (vs. its typical 23-25x) has historically been a high-probability entry point, provided you have conviction that cocoa prices will eventually normalize -- even partially.

### Diversified Food and Confectionery Companies

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Lindt & Sprungli** | Premium Chocolate | -6.5% | -0.62 |
| **Mondelez (MDLZ)** | Snacks/Chocolate | -5.5% | -0.55 |
| **Cocoa Butter Cosmetics** | Beauty | -5.5% | -0.52 |
| **Nestlé (NSRGY)** | Food/Chocolate | -3.8% | -0.45 |
| **Shrinkflation Trend** | Consumer Impact | -4.0% | -0.40 |
| **Restaurants (Chocolate Menu Items)** | Restaurants | -2.5% | -0.28 |

**Why they lose:** Lindt occupies a premium niche where its pricing power is strongest -- Lindt customers are less price-sensitive, and the brand can raise prices more aggressively than mass-market competitors. However, at current cocoa prices, even Lindt faces volume pressure as the absolute price of a box of Lindor truffles reaches levels that deter impulse purchasing. Mondelez is better insulated than Hershey because its Cadbury, Toblerone, and Milka chocolate brands represent roughly 30% of revenue, with the remaining 70% from non-chocolate categories (Oreo, belVita, Halls, Trident).

Nestle's minimal cocoa exposure through KitKat and Nestle Crunch is dwarfed by its coffee, pet food, and health science divisions, making it the most insulated major food company. Cocoa butter cosmetics companies -- including brands using cocoa butter as a key ingredient in moisturizers, lip balms, and body lotions -- face indirect but meaningful cost pressure from the cocoa butter ratio expansion. Restaurants with chocolate-forward menu items (chocolate lava cakes, hot chocolate beverages, dessert menus) face cost pressure that is difficult to pass through without reprinting menus and risking customer sticker shock.

**Key insight:** The MDLZ/HSY performance spread during cocoa spikes is one of the most reliable pairs in consumer staples. Because Mondelez has 2.5x more revenue diversification than Hershey, it consistently outperforms HSY by 5-8 percentage points during periods of elevated cocoa prices. This spread has generated positive returns in 9 of the last 10 major cocoa rally periods dating back to 2005, making it a high-conviction relative value trade.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| Cocoa Futures (Direct) | +19.2% | NIB | 0.97 |
| West African National Boards | +21.0% | N/A | 0.95 |
| Cocoa Butter Processing | +15.0% | N/A | 0.90 |
| Cocoa Traders (Olam, Cargill) | +9.5% | N/A | 0.78 |
| Craft/Specialty Chocolate | -18.0% | N/A | -0.92 |
| Pure-play Chocolate (HSY) | -11.0% | N/A | -0.85 |
| B2B Chocolate Processing (BARN) | -8.5% | N/A | -0.78 |
| Diversified Snacks (MDLZ) | -5.5% | XLP (partial) | -0.55 |

## Historical Price Moves

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Mar 2011 | Ivory Coast civil war | +35% in 6 weeks | HSY -8%, NIB +33% | Export ban disrupted West African supply |
| Jul 2016 | El Nino drought | +25% over 3 months | HSY -6%, MDLZ -3%, NIB +24% | West African crop stress and yield decline |
| Mar 2020 | COVID lockdowns | -20% in 4 weeks | HSY -15% (dual hit), NIB -19% | Simultaneous demand and supply disruption |
| Jan 2024 | CSSVD + drought begins | +110% over 12 months | HSY -22%, MDLZ -10%, NIB +105% | Structural supply crisis emerges |
| Oct 2024 | Cocoa breaks $8,000/t | +45% from Jan 2024 | HSY -18%, Barry Callebaut -30% | Record highs exceed all forecasts |
| Feb 2026 | Sustained at $9,800/t | +20% YTD | HSY -10%, RMCF -25%, NIB +18% | Market prices in multi-year deficit |

## Key Takeaway

Cocoa's 20% price surge creates the most extreme winner-loser dispersion of any agricultural commodity currently trading. West African cocoa boards capture +20% to +22% revenue gains, while craft chocolate makers face -20% margin destruction that threatens business viability. Among publicly traded equities, Hershey bears the heaviest impact at -11% due to its concentrated chocolate exposure, while Mondelez at -5.5% benefits from portfolio diversification that provides a natural hedge against cocoa-specific risk.

The structural nature of the current cocoa crisis cannot be overstated. Unlike weather-driven commodity spikes that resolve within 1-2 growing seasons, the combination of CSSVD, aging tree demographics, and climate change means the cocoa market is facing a multi-year supply deficit that will not be resolved until at least 2028-2029, when newly planted trees reach productive maturity. For investors, this means traditional mean-reversion strategies may not work on their typical timeline. Hershey stock may appear cheap on a historical P/E basis, but if cocoa prices remain elevated for 2-3 years, the earnings base against which that P/E is calculated will be structurally lower than consensus expects.

The most sophisticated approach is to separate the cyclical from the structural. If cocoa eventually normalizes to $5,000-6,000/t (still elevated vs. history but representing a 40-50% decline from current levels), Hershey's earnings recovery would be dramatic -- potentially 30-40% EPS growth from the trough. For investors willing to underwrite that scenario over a 2-3 year horizon, accumulating HSY below $170 (approximately 20x trough earnings) offers compelling risk-reward. The Barry Callebaut/NIB ratio remains the most reliable technical indicator for timing cocoa mean-reversion trades -- when BARN.SW/NIB reaches extreme lows, it has historically marked attractive entry points for the chocolate processing stock as the first derivative play on eventual cocoa price normalization.
