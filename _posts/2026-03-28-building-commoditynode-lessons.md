---
layout: post
title: "Building CommodityNode: What I Learned Mapping 60 Commodity Supply Chains"
date: 2026-03-28
categories: [Behind the Scenes]
tags: [commoditynode, methodology, data, visualization, building]
description: "The story behind CommodityNode — why I built it, what went wrong, what I learned about commodity markets by trying to map all of them, and the design decisions that shaped the site."
reading_time: 11
image: /assets/images/og-default.png
author: CommodityNode Research
---

I didn't set out to build a commodity analysis platform. I set out to answer a single question: *"If oil goes up 10%, what happens to my portfolio?"*

It seemed simple. It wasn't.

That question led me down a rabbit hole that consumed the better part of a year, involved building interactive visualizations for 60+ commodities, reading hundreds of 10-K filings, and developing a healthy respect for the sheer complexity of global supply chains. This is the story of how CommodityNode came to be — the mistakes, the surprises, the things I wish someone had told me at the start, and why I think mapping commodity supply chains is one of the most undervalued forms of market research.

---

## Why This Exists

The genesis was frustration.

I was looking at my portfolio in late 2024 — a mix of tech stocks, some ETFs, a few positions in energy — and realized I had no idea how exposed I was to commodity prices. Not just energy. *All* commodities. My Tesla position was exposed to lithium and copper. My Starbucks shares were exposed to coffee and dairy. My homebuilder stocks were exposed to lumber, copper, and steel. Even my tech stocks had indirect exposure through data center power costs (natural gas, uranium) and semiconductor inputs (neon, gallium, germanium).

I went looking for a tool that would map these relationships. Something interactive, data-driven, and comprehensive. I found scattered resources — academic papers on commodity-equity correlations, broker research notes on individual supply chains, a few static infographics. But nothing that connected everything in one place.

So I started building.

---

## Lesson 1: The Data Is Worse Than You Think

My first assumption was that commodity market data would be clean, standardized, and easily accessible. After all, these are the most liquid futures markets in the world.

Wrong.

**Price data** is the easy part. Yahoo Finance, FRED, and the exchanges provide decent historical prices for major commodities. But as soon as you move beyond crude oil, gold, and copper, things get messy. Lithium? There's no centralized exchange — prices come from Benchmark Mineral Intelligence, Asian Metal, and Fastmarkets, each with different methodologies and coverage. Rare earths? Forget about it. Pricing is opaque, contract-based, and dominated by a single country (China) that doesn't publish data in standardized formats.

**Company exposure data** is even harder. When I say "Tesla is exposed to lithium," I need to know: How much lithium goes into each vehicle? What's their battery chemistry mix (NMC vs. LFP)? How much do they source vs. produce in-house? What's their hedging strategy? Some of this is in 10-K filings. Some is buried in earnings call transcripts. Some is only available from third-party supply chain intelligence providers. And some is genuinely unknown — companies treat supply chain details as competitive intelligence.

I spent three months just building the data foundation — mapping commodity → company exposure for ~200 equities across 60 commodities. It's still imperfect. Every impact score on this site has uncertainty around it. I try to be honest about that.

---

## Lesson 2: Correlation ≠ Causation, but It's Still Useful

The academic in me wanted to build causation models — proper structural equation models that traced the physical flow of commodities through supply chains and estimated the impact at each step.

The pragmatist in me realized that correlation coefficients, calculated properly, give you 80% of the answer in 5% of the time.

Here's what I mean. When I calculate that the correlation between crude oil and XLE is 0.85, I haven't proven that oil *causes* XLE to move. I've shown that they move together 85% of the time with a consistent magnitude relationship. For an investor building a pair trade, that's sufficient. You don't need to model every refinery's crack spread and every pipeline's tariff schedule to know that energy stocks go up when oil goes up.

Where causation matters is in the *secondary and tertiary* effects — the Level 2 and Level 3 nodes on the impact maps. Does copper *cause* homebuilder stocks to fall? Not directly — copper is 1-2% of total home construction cost. But copper is correlated with broader construction input cost inflation, which is correlated with housing affordability pressure, which affects homebuilder demand. The correlation captures this indirect chain, but it can break down if the transmission mechanism changes.

My compromise: use correlations for Level 1 (direct) relationships, and supplement with fundamental supply chain analysis for Level 2+ relationships. The correlation tells you *that* a relationship exists and approximately how strong it is. The fundamental analysis tells you *why* it exists and whether it's likely to persist.

---

## Lesson 3: Visualization Is the Analysis

I originally planned to publish CommodityNode as a series of written reports — like traditional sell-side research. Each commodity would get a PDF with tables of correlations, lists of affected companies, and written analysis.

I built a prototype and showed it to a few people. The response was universal: "I don't have time to read 15 pages about copper." Fair.

Then I built the first interactive impact map using D3.js — a force-directed node graph where you could see the entire web of relationships at a glance, drag nodes around, hover for details. I showed *that* to the same people.

"Oh. *Now* I get it."

The visualization isn't a wrapper around the analysis. It *is* the analysis. When you see crude oil at the center with airlines pulling away and oilfield services pulling toward it, you understand the fundamental dynamic in two seconds. No reading required. The node sizes, colors, positions, and connections encode information more efficiently than any table or paragraph.

This lesson shaped the entire site. Every commodity hub page leads with the interactive graph. The written analysis supports and supplements the visualization, not the other way around.

---

## Lesson 4: Supply Chains Are Deeper Than You Think

When I started mapping crude oil's impact chain, I expected to get to Level 3 — direct producers, refiners, and consumers — and stop. Instead, I kept finding meaningful connections deeper and deeper.

Oil → refiners → petrochemicals → plastics → food packaging → food manufacturers → grocery retailers → consumer spending.

Oil → jet fuel → airlines → travel demand → hotel chains → hospitality REITs → commercial real estate.

Oil → diesel → trucking → shipping costs → e-commerce margins → consumer price inflation → Federal Reserve policy.

Each of those chains has quantifiable correlations and real investment implications. The further you go, the weaker and less reliable the signal gets — but it never hits zero. Everything is connected, and the connections decay gradually, not abruptly.

I set the maximum depth at 6 levels because that's where the signal-to-noise ratio drops below what I consider tradeable. But the connections exist beyond Level 6 — they're just too diffuse to act on with confidence.

---

## Lesson 5: The Same Commodity Can Be a Winner and a Loser Simultaneously

This sounds contradictory, but it's one of the most important insights from the mapping process. When copper rises:

- Copper miners WIN (higher revenue per pound)
- Copper fabricators face mixed effects (higher input costs but also higher product prices)
- Construction companies LOSE (higher wiring and plumbing costs)
- EV manufacturers LOSE (higher motor and wiring costs)

But here's the twist: copper rises *because* demand is strong, and demand is strong because construction and EV manufacturing are booming. So the same companies that are "losers" from higher copper costs are "winners" from the demand environment that caused copper to rise in the first place.

This is the reflexivity problem in commodity analysis. The impact map shows the *cost transmission* channel — higher copper = higher costs for consumers. But it doesn't fully capture the *demand validation* channel — higher copper signals strong end-market activity that benefits those same consumers.

In practice, this means commodity price increases are initially negative for consumers (cost shock) but the net effect depends on *why* prices are rising. Demand-driven rallies (which signal strong end-markets) are less damaging than supply-shock rallies (which impose costs without corresponding demand). I try to note this distinction in the Signal Reports, but the impact maps themselves are agnostic about the cause of the price move.

---

## Lesson 6: The Hardest Part Wasn't Building It — It Was Maintaining It

Getting CommodityNode to version 1.0 was the fun part. The hard part is keeping it accurate.

Correlations shift over time. Company supply chains evolve. New commodities become important (who was tracking neon gas before the Ukraine war?). Old relationships change (the gold-real-yields correlation broke down in 2023-2024 after being stable for a decade).

I recalculate correlations quarterly using rolling 3-year windows. I update company exposure estimates when new 10-K filings are published. I add new commodities when they become investable or policy-relevant. I retire impact connections that the data no longer supports.

It's a treadmill. But it's a treadmill that makes the site more accurate over time, and accuracy is the only thing that matters in research.

---

## Lesson 7: Free Access Matters More Than Revenue Optimization

I considered various monetization models — subscriptions, premium tiers, paywalled reports. I chose advertising for a simple reason: the information in commodity supply chain analysis should be accessible to any retail investor, not just to those who can afford a Bloomberg terminal or a hedge fund research budget.

The institutional investors who trade commodity-equity relationships already have this data. They pay six figures for Kpler, Wood Mackenzie, CRU, and Bloomberg commodity analytics. The information asymmetry between institutional and retail investors in commodity markets is enormous.

CommodityNode doesn't eliminate that asymmetry — institutional tools are far more powerful and granular. But it narrows the gap. A retail investor who understands that Halliburton has a 0.91 correlation to crude oil and a +14% sensitivity to a 10% oil move is better equipped than one trading on headlines alone.

---

## What's Next

The site is never done. Current priorities:

1. **More commodities.** I've mapped 60; the investable commodity universe has 150+. Agricultural commodities in particular need deeper coverage — I've barely scratched the surface on cocoa, sugar, cotton, and specialty crops.

2. **Real-time correlation monitoring.** Currently, correlations are updated quarterly. I want to build a system that tracks rolling correlations daily and alerts users when a historical relationship is breaking down — a potential regime change signal.

3. **Scenario analysis.** What if oil hits $120? What if lithium drops to $10,000? The impact maps show 10% move scenarios; I want users to model custom scenarios and see the full ripple chain.

4. **Coverage of non-US equities.** The site is heavily tilted toward US-listed companies. But commodity impacts are global — BHP is listed in Australia, Glencore in London, Saudi Aramco in Riyadh. Expanding geographic coverage would make the analysis more complete.

I built CommodityNode because I wanted a tool that didn't exist. I'm keeping it going because, judging by the emails I get, other people wanted it too.

If you've read this far: thank you. And if you have suggestions, data corrections, or commodity relationships I've missed — [reach out](/contact/). The maps get better when more people contribute to them.

---

*Philip — CommodityNode*
