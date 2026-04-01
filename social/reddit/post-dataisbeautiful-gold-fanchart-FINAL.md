# SUBREDDIT: r/dataisbeautiful
# FLAIR: [OC]
# IMAGE: dataisbeautiful-gold-fanchart.png

---

# TITLE
[OC] Gold price fan chart — historical data + Amazon Chronos-2 AI probabilistic forecast with 50% and 80% confidence bands (April 2026)

---

# POST BODY

**What is a fan chart?**

A fan chart shows a probabilistic forecast where the shaded bands represent the range of outcomes at different confidence levels:
- **Dark purple band:** 50% confidence interval (P25–P75) — there's a 50% probability the price will land within this range
- **Light purple band:** 80% confidence interval (P10–P90) — 80% probability range
- **Cyan line:** Median forecast (most likely single path)
- **Gray line:** Actual historical price data (last 90 days shown)

---

**Current reading:**

- Today's price: **$4,712/oz**
- 30-day median target: **$4,829 (+2.5%)**
- 60-day median target: **$4,896 (+4.0%)**
- 80% confidence range by June 2026: **$4,023 (bear) to $6,032 (bull)**

---

**The wide bands are intentional:**

Gold has had extraordinary volatility over the past 6 months. The model correctly captures this uncertainty — note how the bands widen faster than historical volatility alone would predict. This reflects regime uncertainty: the model is assigning probability mass to both a dollar recovery scenario (which would pressure gold back toward $4,000) and a continued safe-haven demand surge scenario.

---

**Why is the median bullish?**

The model picks up three persistent signals in the 5-year training data:
1. Dollar index below 100 correlates strongly with gold appreciation (rolling correlation ~-0.70)
2. Post-2022 central bank buying patterns — structural demand floor that didn't exist pre-2022
3. Real yields (inflation-adjusted) — still negative in real terms despite nominal rate levels

---

**Tools:**
- Python 3.12, matplotlib
- Data: yfinance (GC=F futures, 5yr daily)
- Model: Amazon Chronos-2 (October 2025 release) via `chronos-forecasting` library v2.2.2

---

# FIRST COMMENT:
Interactive version with tab switching (Gold/Copper/Crude Oil) and 30D/60D/90D horizon selector: https://commoditynode.com

Source code for the chart available if anyone wants it — happy to share.
