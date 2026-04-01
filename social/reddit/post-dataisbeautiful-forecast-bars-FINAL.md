# SUBREDDIT: r/dataisbeautiful
# FLAIR: [OC]
# IMAGE: dataisbeautiful-forecast-bars.png

---

# TITLE
[OC] AI Model (Amazon Chronos-2) forecasts 19 commodity prices over the next 90 days — April 2026

---

# POST BODY

**Tools/Methods:**
- **Model:** Amazon Chronos-2 (released Oct 2025) — transformer-based time series foundation model, 120M parameters, trained on 100K+ real-world datasets
- **Data:** yfinance daily futures prices, 5-year historical context per commodity
- **Output:** Probabilistic median forecast for each commodity over a 90-day horizon

---

**What you're looking at:**

Each bar represents the AI model's median price forecast change (%) for that commodity between today (April 1, 2026) and approximately July 2026.

Green = bullish forecast, Red = bearish forecast.

---

**Notable findings from this run:**

- **Crude Oil (-8.8%)** is the most bearish signal — reflecting demand slowdown pressure from US-China tariffs and record US shale output, despite the Iran-Strait of Hormuz tail risk
- **Gold (+6.5%)** is the most bullish among major commodities — DXY below 100 and central bank buying continuity are the primary drivers the model picks up
- **Orange Juice (+5.2%)** stands out in agriculture — Brazil supply constraints from drought damage in Minas Gerais state
- **Corn (+2.7%)** quietly bullish while Wheat (-3.2%) bearish — unusual divergence worth watching
- **Palladium (+5.6%)** notable given catalytic converter demand dynamics and Russian supply uncertainty

---

**Caveats:**

- The Chronos-2 model is zero-shot (no fine-tuning on commodity-specific data)
- Forecasts are probabilistic medians — the 80% confidence intervals are extremely wide for volatile commodities like crude oil ($66.80 to $138.08 by July)
- Past model performance ≠ future accuracy. This is an analytical tool, not financial advice.

---

**Methodology note:**

Chronos-2 uses a modified transformer with "group attention" allowing cross-series information sharing. Unlike ARIMA or GARCH, it doesn't require explicit feature engineering — it learns temporal patterns and regime changes from raw price sequences. The 5-year context window (1,300+ daily observations) allows it to capture annual seasonality cycles.

---

*Interactive fan charts with confidence bands for all 19 commodities: link in first comment*

---

# FIRST COMMENT:
Full interactive dashboard (fan charts, supply disruption tracker, correlation matrix): https://commoditynode.com

Made with Python/matplotlib. Happy to share the code if anyone's interested.
