# SUBREDDIT: r/dataisbeautiful
# FLAIR: [OC]
# IMAGE: dataisbeautiful-forecast-bars.png

---

# TITLE
[OC] Ran Amazon's Chronos-2 time series model on 19 commodity futures. Here's what it thinks happens over the next 90 days.

---

# POST BODY

Fed it 5 years of daily closing prices for each commodity via yfinance, then let the model output probabilistic median forecasts. Green = bullish, red = bearish on the 90-day horizon.

A few things that stood out to me:

Crude oil is the most bearish signal at -8.8%. The model seems to be weighing the US-China demand slowdown and record US shale output more heavily than the Iran geopolitical premium — though the 80% confidence interval spans $67 to $138, so it's not exactly high conviction.

Gold at +6.5% makes sense given the dollar setup. The interesting one is orange juice at +5.2% — that's a Brazil drought signal the model picked up from the seasonal pattern in the training data.

Wheat and crude both bearish while corn is slightly bullish is an unusual divergence. Worth watching if you trade ags.

The model is Amazon Chronos-2 (released Oct 2025) — zero-shot, no fine-tuning, just raw price sequences as input. Made the chart in Python/matplotlib.

Caveats: these are median forecasts. The confidence intervals are extremely wide for volatile stuff like crude and gold. Don't trade off this.

---

# FIRST COMMENT
Code and interactive version with fan charts for each commodity: https://commoditynode.com

Happy to share the matplotlib code if anyone wants it.
