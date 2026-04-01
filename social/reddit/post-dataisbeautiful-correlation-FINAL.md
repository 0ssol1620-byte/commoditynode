# SUBREDDIT: r/dataisbeautiful
# FLAIR: [OC]
# IMAGE: dataisbeautiful-correlation-matrix.png

---

# TITLE
[OC] 90-day rolling Pearson correlations across 15 commodity markets — some of these surprised me

---

# POST BODY

Calculated from daily closing prices over the last 90 trading days. A few things I didn't expect:

Crude oil and palladium are at -0.82. Makes sense in hindsight — palladium is an autocatalyst metal, so higher EV adoption (which tracks with oil demand pessimism) reduces ICE vehicle demand. But seeing it this negative in the current data was still a bit striking.

Soybeans and coffee at -0.85 is interesting. Both Brazil-heavy supply chains, but the drought that hammered coffee in Minas Gerais didn't hit soy the same way. So they've been diverging.

Crude oil and wheat at +0.91 is higher than usual — fertilizer cost passthrough (nat gas → ammonia → grain input costs) seems to be particularly tight right now.

Gold and crude at -0.18 is notable because they usually move together. Right now they're diverging: gold bullish on dollar/rate expectations, crude bearish on demand. Rare uncorrelated pair if you're building a commodity portfolio.

Built with numpy/matplotlib. 90-day window, no smoothing.

---

# FIRST COMMENT
Interactive version with 30/60/90-day toggle: https://commoditynode.com/correlation/

Code:
```python
def pearson(x, y, n=90):
    x, y = np.array(x[-n:]), np.array(y[-n:])
    mx, my = x.mean(), y.mean()
    num = ((x - mx) * (y - my)).sum()
    den = np.sqrt(((x-mx)**2).sum() * ((y-my)**2).sum())
    return 0 if den == 0 else num / den
```
