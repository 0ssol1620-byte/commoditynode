---
layout: post
title: "From Farm to Fork: Mapping the Food Price Transmission Chain"
date: 2026-03-28
categories: [Deep Dive]
tags: [wheat, corn, soybeans, food, agriculture, inflation, supply-chain]
description: "When wheat prices spike 40%, bread prices rise 8%. Where does the other 32% go? A deep investigation into how commodity prices transmit — and don't transmit — through the food supply chain."
reading_time: 15
image: /assets/images/og-gold.png
author: CommodityNode Research
commodity_name: "General"
---

Maria runs a small bakery in suburban Chicago. In March 2022, when Russia invaded Ukraine and wheat futures spiked 40% in two weeks, her flour supplier called with an apologetic price increase: 22%. Maria absorbed it for three weeks, then raised her bread prices by 15%. Her customers grumbled but kept coming. By the time the wheat rally faded six months later, her flour costs had normalized — but her bread prices hadn't come back down.

That asymmetry — the gap between a 40% commodity spike and a 15% retail price increase that never fully reverses — is one of the most important dynamics in the global food system. And it's almost completely invisible to commodity investors who only watch the futures screen.

This report traces the full transmission chain from field to fork, quantifying where commodity price signals get amplified, dampened, delayed, and permanently absorbed along the way.

---

## The Transmission Chain: A Simplified Map

Before diving into the details, here's the big picture. When wheat prices move, the signal passes through five stages:

```
Farm Gate → Grain Elevator → Mill/Processor → Manufacturer → Retailer → Consumer
   100%        85-95%          50-70%          20-40%        8-15%       5-12%
```

Those percentages represent how much of the original commodity price move survives at each stage. A 40% wheat spike becomes a 34-38% increase at the elevator, a 20-28% flour cost increase at the mill, a 8-16% cost impact for the bread manufacturer, a 3-6% shelf price increase at the grocery store, and a 2-5% increase in the consumer's total food bill.

Each stage dampens the signal. Understanding *why* and *how* is the key to understanding food inflation.

---

## Stage 1: Farm Gate to Elevator (85-95% Transmission)

The first link in the chain is the tightest. When Chicago Board of Trade wheat futures move, the cash price offered to farmers at local grain elevators follows almost immediately — usually within the same trading day. The "basis" (the difference between futures price and local cash price) absorbs local supply-demand imbalances, but the directional move passes through with high fidelity.

**Why 85-95% and not 100%?** Basis variation. If wheat futures spike 40% because of a Black Sea supply disruption, but the local Kansas harvest is abundant, the local elevator might only raise its bid 34-36%. Conversely, if local drought hits at the same time as a global rally, the basis can invert and the farm-gate price might rise *more* than the futures price.

**The hedging buffer:** Large farming operations hedge 50-80% of their expected crop in the futures market months before harvest. When prices spike during the growing season, hedged farmers capture limited upside. Unhedged farmers (typically smaller operations) capture the full windfall — or bear the full loss on the downside.

**Data point:** ADM, Bunge, Cargill, and Louis Dreyfus — the four trading houses that collectively handle ~70% of global grain trade — reported combined agricultural services revenue of **$280 billion** in 2025. Their margins on physical grain trading averaged just **1.8-2.5%**, but the absolute dollar volume means even small margin fluctuations generate billions in profit variation.

---

## Stage 2: Elevator to Mill (50-70% Transmission)

This is where the first major dampening occurs. Flour mills purchase wheat from elevators, but they don't do it at spot prices. Mills typically maintain **60-120 days of wheat inventory** and lock in prices through forward contracts covering **3-6 months** of production.

When wheat spikes 40% in a week, mills feel... almost nothing. Immediately. Their flour cost reflects the wheat they bought two months ago, not today's price. The spike only flows into flour costs gradually, as old inventory is consumed and new (expensive) wheat enters the supply chain.

**The delay:** Empirical data from the BLS Producer Price Index shows that the peak transmission from wheat to flour occurs with a **6-8 week lag**. A wheat spike in March hits flour prices hardest in May. By then, the wheat price itself might have already corrected — meaning the flour price increase could be simultaneously *arriving* and *peaking*.

**Concentration matters:** The US flour milling industry is dominated by four companies — Ardent Mills (a Cargill/CHS JV), ADM Milling, Bay State Milling, and Grain Craft — controlling roughly 60% of production capacity. This concentration gives millers bargaining power. They can resist passing through 100% of wheat cost increases, particularly to large-volume customers (national bakeries, major food manufacturers) who can credibly threaten to switch suppliers.

**The math:** Wheat represents approximately **50-55%** of the cost of producing a standard bag of all-purpose flour. The rest is energy (milling, transport), labor, packaging, and overhead. So even a 40% wheat increase translates to roughly a **20-22% increase** in the total cost of flour — before any inventory buffer or contract protection.

---

## Stage 3: Mill to Food Manufacturer (20-40% Transmission)

Here's where things get really interesting. Flour is an input for bread, pasta, cereals, snack foods, and hundreds of other products — but it's rarely the *dominant* cost.

For a standard loaf of commercial bread:
- **Flour/wheat:** 8-12% of retail price
- **Labor:** 25-30%
- **Packaging:** 8-10%
- **Energy (baking, transport):** 10-15%
- **Distribution & logistics:** 10-12%
- **Overhead & profit:** 15-20%
- **Retailer margin:** 15-25%

When flour costs rise 22%, the impact on the total cost of producing a loaf of bread is **1.8-2.6%** (22% × the 8-12% flour share). That's the mathematical reason a 40% wheat spike turns into an 8% bread price increase — the commodity is a small fraction of the final product cost.

**The exception: commodity-intensive products.** Pasta, where durum wheat is 40-50% of cost, transmits wheat price changes at 2-3x the rate of bread. Tortillas, where corn masa is 35-45% of cost, transmit corn prices more directly. Animal feed, where grain is 60-70% of cost, transmits grain prices almost dollar-for-dollar — which is why **Tyson Foods (TSN)**, **Pilgrim's Pride (PPC)**, and other protein processors show the highest sensitivity to grain prices of any food company.

---

## Stage 4: The Ratchet Effect — Why Prices Go Up Fast and Come Down Slow

This is the phenomenon Maria the baker experienced, and it's the single most important dynamic for understanding food inflation.

When input costs rise, food manufacturers raise prices within **4-8 weeks** (faster for commodity-intensive products, slower for branded goods where consumer price sensitivity constrains the pace of increase).

When input costs fall, food manufacturers... wait. And wait. And sometimes never fully reverse the increase.

The data is stark. The USDA Economic Research Service tracks retail food price changes relative to commodity price changes and finds a consistent asymmetry:

| Commodity Move | Time to Peak Retail Impact | Retail Price Increase | Time to Retail Reversal | Retail Price Decrease |
|---------------|--------------------------|----------------------|------------------------|--------------------|
| Wheat +40% | 8-12 weeks | +8-12% (bread) | Never fully reverses | −3-5% after 6 months |
| Corn +30% | 6-10 weeks | +5-8% (cereal) | 20+ weeks | −2-4% |
| Soybeans +25% | 8-14 weeks | +4-6% (cooking oil) | 16+ weeks | −2-3% |

**Why the asymmetry?** Three reasons:

1. **Menu cost stickiness:** Changing prices has real costs — reprinting labels, updating POS systems, renegotiating retailer agreements. Companies prefer fewer, larger price changes to frequent small adjustments. This creates inertia in both directions, but the upward pressure from cost increases is stronger than the downward pressure from cost decreases because companies have a profit incentive to maintain higher prices.

2. **Consumer reference price adaptation:** Behavioral economics tells us consumers adapt to higher prices within 8-12 weeks. After that adaptation, a price decrease doesn't feel like a "return to normal" — it feels like a discount. Companies know this and are reluctant to establish lower reference prices.

3. **Competitive coordination:** If all major bread manufacturers raised prices during a wheat spike, none has an incentive to be the first to lower prices. The first mover loses margin without gaining significant market share, because consumers have already adapted.

**Investment implication:** Food companies (General Mills, Kraft Heinz, Mondelez) have *structurally positive* exposure to commodity price spikes because the ratchet effect means they capture permanent margin expansion. This is why Hershey (HSY) can absorb a 50% cocoa rally and emerge with *higher* long-term margins — the price increases stick, but cocoa eventually reverts.

---

## Stage 5: Retailer to Consumer (5-12% Transmission)

The final stage introduces yet another dampening mechanism: **retailer private-label competition and promotional dynamics.**

Grocery retailers operate on razor-thin margins (1.5-3% net). They absorb manufacturer price increases reluctantly and push back aggressively. Kroger, Walmart, Costco, and other major retailers have dedicated teams whose sole job is negotiating with CPG manufacturers to limit price pass-throughs.

Additionally, retailers use **private-label products** as a competitive weapon. When branded bread prices rise, store-brand bread (which the retailer controls directly) can be held at lower prices to gain share. This forces branded manufacturers to moderate their price increases or risk losing shelf space.

The result: the consumer sees roughly **one-quarter to one-third** of the original commodity price move, after a 2-4 month delay, with an asymmetric reversal profile.

---

## Case Study: The 2022 Wheat Crisis in Real Time

The Russia-Ukraine conflict in February 2022 created a natural experiment in food price transmission:

**Week 0 (Feb 24):** Russia invades Ukraine. CBOT wheat futures at $8.00/bushel.

**Week 2 (Mar 7):** Wheat hits $12.50/bushel (+56%). Farm-gate prices follow within days.

**Week 4 (Mar 21):** Flour mills report 15-18% cost increases on new wheat purchases. Inventory buffers delay full impact.

**Week 8 (Apr 18):** Bread manufacturers announce 6-9% price increases to retailers, effective June 1.

**Week 14 (Jun 1):** Consumer bread prices at retail begin reflecting the increases. Average white bread: $1.98 → $2.14 (+8.1%).

**Week 24 (Aug 15):** Wheat futures have corrected to $7.80/bushel — *below* pre-invasion levels. Flour prices stabilize but don't decline.

**Week 48 (Feb 2023):** Consumer bread prices: $2.09. Down from the peak, but still **+5.6%** above pre-invasion levels — despite wheat being back to pre-invasion prices.

**Week 96 (Feb 2024):** Consumer bread prices: $2.12. The increase is *permanent*.

This is the ratchet effect in action: a commodity round-trip produced a one-way price increase for consumers.

---

## The Investment Framework

Understanding food price transmission creates three distinct investment opportunities:

**1. Long grain traders during volatility.** ADM, Bunge, and ADECOAGRO benefit from price *volatility* regardless of direction. Their margins expand when bid-ask spreads widen and basis differentials increase — both of which happen during supply disruptions.

**2. Long food manufacturers after commodity spikes.** General Mills, Kraft Heinz, and Mondelez perform best in the 6-18 months *after* a commodity spike, when input costs are normalizing but retail prices remain elevated. The margin expansion window is the sweet spot.

**3. Short/avoid protein processors during grain rallies.** Tyson Foods and Pilgrim's Pride have the highest grain cost exposure (60-70% of feed costs) and the weakest pricing power (chicken is highly commoditized). They are the most direct losers from grain price increases.

---

## What CommodityNode's Impact Maps Show (And Don't Show)

Our impact maps quantify the *direct* price sensitivity — the statistical relationship between commodity prices and equity prices based on historical data. They capture the end-state: Tyson stock falls X% when corn rises 10%.

What they *don't* capture is the *timing* and *asymmetry* of transmission. The impact doesn't arrive instantaneously — it unfolds over 6-16 weeks. And the reversal doesn't mirror the initial impact — it's slower and incomplete.

For investors using our maps to build positions around agricultural commodity moves, the practical adjustment is: **expect the equity impact to be front-loaded (fear + anticipation) and the actual earnings impact to be back-loaded (real cost transmission)**. The best entry for shorting food consumers like Tyson is often *before* the earnings report that reveals the margin compression — not the day the commodity spikes.

---

*Commodity price data from CME Group. Retail price data from BLS CPI and USDA ERS Food Price Outlook. Milling industry data from the North American Millers' Association. Company financials from SEC filings.*
