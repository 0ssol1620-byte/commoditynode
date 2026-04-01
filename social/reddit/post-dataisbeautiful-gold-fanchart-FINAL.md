# SUBREDDIT: r/dataisbeautiful
# FLAIR: [OC]
# IMAGE: dataisbeautiful-gold-fanchart.png

---

# TITLE
[OC] Gold price fan chart — 90 days of history + 60-day AI forecast with probability bands

---

# POST BODY

Dark band = 50% probability range (P25–P75). Light band = 80% range (P10–P90). Cyan line = median forecast.

Model is Amazon Chronos-2, fed 5 years of daily GC=F futures data. The bands widen faster than historical vol alone would suggest — the model is pricing in genuine regime uncertainty, not just extrapolating recent volatility.

Median target by early June: ~$4,900. But the 80% band runs from ~$4,000 to ~$6,000, which tells you the model basically doesn't know — it's just giving you the distribution.

The sharp drop from $5,200+ in early March to $4,400 by late March is real (Turkey central bank sold ~50T in March apparently). The model's training data includes that, which is probably why the upper band is wide — it's seen this kind of volatility before.

Built in Python, data from yfinance. Interactive version with 30/60/90-day toggles in the link below.

---

# FIRST COMMENT
Interactive version: https://commoditynode.com

Source code available if anyone wants it — just ask.
