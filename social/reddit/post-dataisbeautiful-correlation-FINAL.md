# SUBREDDIT: r/dataisbeautiful
# FLAIR: [OC]
# IMAGE: dataisbeautiful-correlation-matrix.png

---

# TITLE
[OC] Commodity correlation matrix — 90-day rolling Pearson coefficients across 15 major commodities (April 2026)

---

# POST BODY

**What you're looking at:**

Pearson correlation coefficients calculated from the last 90 trading days of daily price data for 15 major commodities. Values range from -1 (perfect inverse relationship) to +1 (perfect positive relationship). Calculated using a rolling window so it reflects current market regime, not long-term averages.

---

**Most interesting patterns right now:**

**Strong positive correlations (green, >0.7):**
- **Silver ↔ Platinum: 0.93** — both PGMs with industrial + precious metal demand overlap
- **Silver ↔ Palladium: 0.85** — autocatalyst demand linkage
- **Crude Oil ↔ Wheat: 0.91** — fertilizer cost passthrough (natural gas → ammonia → grain prices). This is higher than usual, suggesting current energy-agriculture linkage is particularly tight.
- **Wheat ↔ Corn: 0.80** — feed substitution and shared weather/logistics exposure
- **Copper ↔ Silver: 0.68** — industrial demand correlation

**Strong negative correlations (red, < -0.6):**
- **Crude Oil ↔ Copper: -0.67** — counter-intuitive but reflects current macro split: oil bearish (demand destruction from tariffs), copper roughly neutral (Chile strike premium offsetting demand concerns)
- **Crude Oil ↔ Palladium: -0.82** — Palladium used in catalytic converters; higher EV adoption (which tracks with oil bearishness) reduces ICE vehicle demand and thus palladium demand... but current reading may also reflect Russian supply dynamics
- **Soybeans ↔ Coffee: -0.85** — interesting divergence; Brazil drought damaged coffee but soybean supply from Brazil has been relatively strong this season

---

**What this means for portfolio construction:**

If you're building a commodity-exposed portfolio and want genuine diversification right now:
- Gold + Crude Oil are nearly uncorrelated (-0.18) — rare, as they usually move together
- Gold + Sugar is -0.67 — one of the better hedging pairs in the current regime
- Silver and the PGMs are highly correlated — holding multiple gives you concentration, not diversification

---

**Methodology:**

```python
import numpy as np

def pearson(x, y, n=90):
    x, y = np.array(x[-n:]), np.array(y[-n:])
    mx, my = x.mean(), y.mean()
    num = ((x - mx) * (y - my)).sum()
    den = np.sqrt(((x - mx)**2).sum() * ((y - my)**2).sum())
    return 0 if den == 0 else num / den
```

Data: yfinance daily closing prices. 90-day rolling window. No smoothing applied.

Note: 90-day correlations are point-in-time and can shift significantly with macro regime changes. Long-term (5yr) correlations would look quite different.

---

# FIRST COMMENT:
Interactive version with 30D/60D/90D toggle: https://commoditynode.com/correlation/

Made with matplotlib, data from yfinance. Happy to share full code.
