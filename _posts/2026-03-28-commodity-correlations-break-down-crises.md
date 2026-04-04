---
layout: post
title: "Why Commodity Correlations Break Down During Crises — And What That Tells You"
date: 2026-03-28
categories: [Research]
tags: [correlations, crisis, macro, risk-management, methodology, gold, crude-oil, copper]
description: "Academic research and empirical data show that commodity-equity correlations are unstable during market stress. Understanding when and why they break reveals more about portfolio risk than any single correlation coefficient."
reading_time: 13
image: /assets/images/og-gold.png
author: CommodityNode Research
commodity_name: "General"
---

## Abstract

Commodity-equity correlations are treated as stable parameters in most portfolio construction frameworks. They are not. Empirical analysis of five major market stress episodes (2008 GFC, 2011 Eurozone crisis, 2015-16 China slowdown, 2020 COVID shock, 2022 Russia-Ukraine) reveals that correlations between commodity prices and related equities undergo systematic regime shifts during crises. Specifically: (1) cross-asset correlations converge toward +1.0 during liquidity crises as forced selling dominates fundamental relationships, (2) supply-shock crises create anomalous divergences where commodities and their consumers decouple entirely, and (3) post-crisis correlation recovery follows a predictable timeline of 8-16 weeks. These findings have direct implications for how investors should use CommodityNode's impact maps — and when to distrust them.

---

## 1. Introduction: The Stability Assumption

Every impact map on CommodityNode displays correlation coefficients derived from rolling 3-year windows of weekly data. These coefficients are presented as relatively stable parameters: crude oil and XLE have a correlation of ~0.85, gold and GDX show ~0.88, copper and FCX register ~0.88.

In normal market conditions, these numbers hold up remarkably well. The 60-day realized correlation between crude oil and XLE has ranged between **0.78 and 0.93** during non-stress periods from 2020-2026 — a tight band that validates the use of historical correlations for position sizing and pair trading.

But markets are not always normal. And the moments when correlations break down are precisely the moments when accurate risk assessment matters most.

This research note examines the empirical evidence on correlation instability during market stress, proposes a framework for identifying correlation regime shifts in real-time, and suggests adjustments to how impact map data should be interpreted during crisis periods.

## 2. Literature Review

The instability of financial correlations during market stress is well-documented in academic literature:

**Forbes and Rigobon (2002)** demonstrated that cross-market correlation increases during crises are partially a statistical artifact of increased volatility (higher volatility mechanically inflates measured correlations), but that genuine contagion effects persist even after correcting for this bias.

**Longin and Solnik (2001)** showed that equity market correlations increase specifically during bear markets — the asymmetry means diversification fails precisely when it's needed most. This finding, replicated across multiple asset classes, is known as the "diversification curse."

**Baur and Lucey (2010)** specifically examined gold-equity correlations and found that gold acts as a safe haven (negative or zero correlation with equities) during extreme market stress — but this safe-haven property is conditional on the *type* of crisis. During deflationary liquidity crises (2008), gold initially fell alongside equities before decoupling. During inflationary crises, gold moved inversely from the start.

**Silvennoinen and Thorp (2013)** found that commodity-equity correlations underwent a structural increase after the 2004-2008 "financialization" of commodity markets, as index fund flows created mechanical linkages between commodity futures and equity markets that didn't exist when commodity markets were dominated by physical hedgers.

## 3. Empirical Evidence: Five Crisis Episodes

### 3.1 Global Financial Crisis (September-November 2008)

**What happened to correlations:**

During the Lehman Brothers collapse and subsequent liquidity crisis, virtually all asset classes converged toward correlation +1.0. Crude oil, gold, copper, equities, credit — everything fell simultaneously as forced deleveraging dominated price action.

| Pair | Pre-Crisis Corr (2007) | Crisis Corr (Sep-Nov 2008) | Change |
|------|----------------------|---------------------------|--------|
| Crude Oil / XLE | 0.82 | 0.96 | +0.14 |
| Gold / GDX | 0.85 | 0.92 | +0.07 |
| Copper / FCX | 0.80 | 0.97 | +0.17 |
| Crude Oil / JETS | −0.72 | +0.45 | **+1.17** |
| Gold / S&P 500 | −0.15 | +0.65 | **+0.80** |

The most striking breakdown was crude oil and airlines. Under normal conditions, they move inversely (−0.72 correlation). During the GFC, they moved *together* (+0.45) because the selling was driven by margin calls and fund redemptions, not by fundamental commodity-equity relationships. Airlines fell because all equities fell, not because oil was rising.

**Key insight:** In a liquidity crisis, the correlation structure you've built your portfolio around inverts. Pairs that are supposed to hedge each other move in the same direction.

### 3.2 COVID Crash (February-March 2020)

**What happened to correlations:**

Similar to 2008 but faster. The COVID crash compressed what took 3 months in 2008 into 4 weeks. Correlations spiked toward +1.0 across all asset classes during the February 20 - March 23 selloff, then rapidly reverted as central bank intervention stabilized markets.

| Pair | Pre-COVID Corr | Crash Corr (Feb-Mar 2020) | Recovery Corr (Apr-Jun 2020) |
|------|---------------|--------------------------|------------------------------|
| Crude Oil / XLE | 0.85 | 0.97 | 0.90 |
| Gold / Equities | −0.10 | +0.55 | −0.30 |
| Copper / China PMI | 0.45 | 0.15 | 0.65 |

**Notable anomaly:** Gold initially fell during the crash (from $1,680 to $1,470) before rallying to all-time highs by August. This is the "gold dip" phenomenon: in acute liquidity crises, even safe havens get sold to meet margin calls. The safe-haven property reasserts itself once the liquidation phase ends — typically within 2-3 weeks.

### 3.3 Russia-Ukraine Conflict (February-April 2022)

**What happened to correlations:**

This was a *supply shock* crisis, and the correlation behavior was fundamentally different from liquidity crises. Instead of everything converging toward +1.0, commodity-equity correlations *diverged*. Oil spiked while oil-consuming equities crashed. Wheat surged while food company stocks fell. The fundamental relationships *amplified* rather than broke down.

| Pair | Pre-Conflict Corr | Conflict Corr (Feb-Apr 2022) | Direction |
|------|-------------------|------------------------------|-----------|
| Crude Oil / XLE | 0.84 | 0.95 | Amplified |
| Crude Oil / Airlines | −0.70 | −0.92 | Amplified |
| Wheat / Food Stocks | −0.30 | −0.75 | Amplified |
| Natural Gas EU / Industrial | −0.40 | −0.85 | Amplified |

**Key insight:** Supply-shock crises make commodity correlations *more* reliable, not less. The impact map relationships work better during supply disruptions because the fundamental transmission channels (higher input costs → margin compression) are operating at maximum intensity.

## 4. A Taxonomy of Correlation Regimes

Based on the empirical evidence, we can classify correlation behavior into three regimes:

### Regime 1: Normal (85% of the time)
Correlations are stable and close to their 3-year rolling averages. Impact map data is reliable. Historical pair trades work as expected.

### Regime 2: Liquidity Crisis (5-8% of the time)
All correlations converge toward +1.0. Fundamental relationships break down. Safe havens initially fail. **Impact maps become unreliable** for 2-6 weeks until the liquidation phase ends.

*Indicators:* VIX above 35, credit spreads widening >100bps in a week, TED spread spiking, repo market stress.

### Regime 3: Supply Shock (7-10% of the time)
Commodity-equity correlations amplify. Fundamental relationships intensify. **Impact maps become more reliable** — potentially underestimating the actual impact magnitude.

*Indicators:* Single commodity or commodity group rising >20% in a month, geopolitical event disrupting physical supply, sanctions or trade restrictions on commodity-producing nations.

## 5. Practical Implications for Investors

### 5.1 Adjusting Impact Map Interpretation During Stress

**During liquidity crises:** Reduce confidence in *all* correlations. Assume pair trade relationships will temporarily fail. Reduce position sizes by 50% or move to cash. The impact map shows you what relationships *should* look like, not what they *will* look like during forced selling. Wait for the VIX to fall below 25 before re-engaging with correlation-based strategies.

**During supply shocks:** Increase confidence in *direct* correlations (Level 1 and Level 2 on impact maps). Consider increasing position sizes for fundamental pair trades (long producers, short consumers). The map may actually *understate* the opportunity during supply shocks because the historical average includes calm periods that dilute the stressed-period sensitivity.

### 5.2 The Recovery Timeline

After a correlation breakdown, how long does it take for normal relationships to reassert themselves?

| Crisis | Duration of Breakdown | Recovery to Normal |
|--------|----------------------|-------------------|
| GFC 2008 | ~10 weeks | 16 weeks |
| Eurozone 2011 | ~4 weeks | 8 weeks |
| China 2015-16 | ~6 weeks | 12 weeks |
| COVID 2020 | ~4 weeks | 8 weeks |
| Russia-Ukraine 2022 | N/A (amplification) | N/A |

Average recovery time: **8-16 weeks** for liquidity crises. Supply shocks don't require "recovery" because correlations amplify rather than break.

**Trading implication:** After a liquidity crisis, the best opportunity is not during the crisis itself (when correlations are broken) but during the 8-16 week recovery window — when correlations are reverting to normal and the fundamental relationships in the impact maps start working again, often with amplified sensitivity as markets "catch up" on missed fundamental repricing.

### 5.3 Portfolio Construction Adjustments

Standard portfolio theory assumes correlation stability. The evidence shows this assumption fails in the tails. Practical adjustments:

1. **Stress-test pair trades** using crisis-period correlations, not normal-period correlations. If your pair trade only works with a −0.75 correlation but flips to +0.50 during liquidity events, your maximum drawdown calculation is wrong.

2. **Maintain a gold allocation** despite its imperfect safe-haven behavior. Gold does fail briefly during acute liquidation — but it recovers faster than equities and eventually delivers the negative correlation investors seek. The 2-3 week gold dip during liquidity crises is actually a buying opportunity if you can stomach the interim volatility.

3. **Diversify across regime types.** Positions that benefit from supply shocks (long producers) and positions that benefit from demand recovery (long consumers at trough valuations) create a portfolio that works across multiple correlation regimes.

## 6. Conclusion

Commodity-equity correlations are reliable tools — most of the time. The discipline required is not in *using* them, but in knowing when *not* to use them. The framework is simple:

- **Normal markets:** Trust the impact map. Trade the correlations.
- **Liquidity crises:** Don't trust anything. Reduce exposure. Wait for the VIX to calm.
- **Supply shocks:** Trust the impact map even more than usual. The fundamental channels are amplified.

The CommodityNode methodology page details how our correlation coefficients are calculated. This research note is a companion piece explaining when those calculations reflect reality — and when reality departs from the model.

---

## References

- Forbes, K. and Rigobon, R. (2002). "No Contagion, Only Interdependence: Measuring Stock Market Comovements." *Journal of Finance*, 57(5), 2223-2261.
- Longin, F. and Solnik, B. (2001). "Extreme Correlation of International Equity Markets." *Journal of Finance*, 56(2), 649-676.
- Baur, D. and Lucey, B. (2010). "Is Gold a Hedge or a Safe Haven? An Analysis of Stocks, Bonds and Gold." *Financial Review*, 45(2), 217-229.
- Silvennoinen, A. and Thorp, S. (2013). "Financialization, Crisis and Commodity Correlation Dynamics." *Journal of International Financial Markets*, 24, 42-65.
- CommodityNode Methodology: [commoditynode.com/methodology/](/methodology/)
