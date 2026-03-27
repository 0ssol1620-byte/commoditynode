---
layout: commodity
unit: "$/barrel"
image: "/assets/images/og-crude-oil.png"
title: "Crude Oil Price Impact: Industries, Stocks & ETFs"
description: "How WTI crude oil price movements ripple through airlines, energy stocks, and consumer spending."
commodity_slug: "crude-oil"
symbol: "CL=F"
sector: "Energy"
etfs: ["XLE", "USO", "OIH"]
companies: ["XOM", "CVX", "HAL", "SLB"]
substitutes: ["Natural Gas", "Renewables", "Nuclear"]
themes: ["Supply Chain Disruption", "Clean Energy"]
tags: [crude oil, commodity analysis, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "crude_oil", "label": "Crude Oil (WTI)"},
  "levels": [
    {"nodes": [
      {"id":"xle","label":"XLE Energy ETF","type":"etf","impact":8,"correlation":0.85,"sector":"Energy"},
      {"id":"uso","label":"USO Oil Fund","type":"etf","impact":9,"correlation":0.95,"sector":"Commodities"},
      {"id":"oih","label":"OIH Services ETF","type":"etf","impact":10,"correlation":0.88,"sector":"OFS"},
      {"id":"xom","label":"ExxonMobil (XOM)","type":"producer","impact":7,"correlation":0.82,"sector":"Integrated Oil"},
      {"id":"cvx","label":"Chevron (CVX)","type":"producer","impact":7,"correlation":0.80,"sector":"Integrated Oil"},
      {"id":"cop","label":"ConocoPhillips (COP)","type":"producer","impact":9,"correlation":0.85,"sector":"E&P"},
      {"id":"hal","label":"Halliburton (HAL)","type":"supplier","impact":12,"correlation":0.88,"sector":"OFS"},
      {"id":"jets","label":"JETS ETF (Airlines)","type":"etf","impact":-7,"correlation":-0.75,"sector":"Airlines"},
      {"id":"aal","label":"American Airlines (AAL)","type":"consumer","impact":-9,"correlation":-0.78,"sector":"Airlines"},
      {"id":"fang","label":"Diamondback (FANG)","type":"producer","impact":11,"correlation":0.87,"sector":"Permian E&P"},
      {"id":"pxd","label":"Pioneer Natural Res","type":"producer","impact":10,"correlation":0.86,"sector":"Permian E&P"},
      {"id":"oxy","label":"Occidental (OXY)","type":"producer","impact":10,"correlation":0.84,"sector":"E&P"},
      {"id":"vlo","label":"Valero (VLO)","type":"processor","impact":5,"correlation":0.60,"sector":"Refining"},
      {"id":"wti_index","label":"WTI Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"}
    ]},
    {"nodes": [
      {"id":"slb","label":"SLB Ltd (SLB)","type":"supplier","impact":11,"correlation":0.86,"sector":"OFS","parentId":"hal"},
      {"id":"bkr","label":"Baker Hughes (BKR)","type":"supplier","impact":10,"correlation":0.82,"sector":"OFS","parentId":"hal"},
      {"id":"dal","label":"Delta Air Lines (DAL)","type":"consumer","impact":-8,"correlation":-0.72,"sector":"Airlines","parentId":"jets"},
      {"id":"ual","label":"United Airlines (UAL)","type":"consumer","impact":-7,"correlation":-0.70,"sector":"Airlines","parentId":"jets"},
      {"id":"luv","label":"Southwest (LUV)","type":"consumer","impact":-6,"correlation":-0.65,"sector":"Airlines","parentId":"jets"},
      {"id":"ups","label":"UPS (UPS)","type":"consumer","impact":-4,"correlation":-0.50,"sector":"Logistics","parentId":"jets"},
      {"id":"fdx","label":"FedEx (FDX)","type":"consumer","impact":-4,"correlation":-0.48,"sector":"Logistics","parentId":"jets"},
      {"id":"mpc","label":"Marathon Petro (MPC)","type":"processor","impact":5,"correlation":0.58,"sector":"Refining","parentId":"vlo"},
      {"id":"psx","label":"Phillips 66 (PSX)","type":"processor","impact":5,"correlation":0.55,"sector":"Refining","parentId":"vlo"},
      {"id":"midstream","label":"Midstream (WMB)","type":"producer","impact":5,"correlation":0.62,"sector":"Pipelines","parentId":"cop"},
      {"id":"et","label":"Energy Transfer (ET)","type":"producer","impact":5,"correlation":0.58,"sector":"Pipelines","parentId":"cop"},
      {"id":"petrochem","label":"Petrochemicals (LYB)","type":"consumer","impact":-4,"correlation":-0.45,"sector":"Chemicals","parentId":"xom"}
    ]},
    {"nodes": [
      {"id":"saudi_aramco","label":"Saudi Aramco (2222.SR)","type":"regional","impact":8,"correlation":0.78,"sector":"OPEC","parentId":"cop"},
      {"id":"adnoc","label":"ADNOC (UAE)","type":"regional","impact":5,"correlation":0.65,"sector":"OPEC","parentId":"saudi_aramco"},
      {"id":"shell","label":"Shell plc (SHEL)","type":"producer","impact":6,"correlation":0.75,"sector":"Integrated Oil","parentId":"xom"},
      {"id":"bp","label":"BP plc (BP)","type":"producer","impact":6,"correlation":0.73,"sector":"Integrated Oil","parentId":"cvx"},
      {"id":"tte","label":"TotalEnergies (TTE)","type":"producer","impact":6,"correlation":0.72,"sector":"Integrated Oil","parentId":"cvx"},
      {"id":"dow_chem","label":"Dow Inc (DOW)","type":"consumer","impact":-3,"correlation":-0.40,"sector":"Chemicals","parentId":"petrochem"},
      {"id":"basf","label":"BASF (BAS.DE)","type":"consumer","impact":-3,"correlation":-0.38,"sector":"Chemicals","parentId":"petrochem"},
      {"id":"neste","label":"Neste Oyj (NTOIF)","type":"processor","impact":4,"correlation":0.45,"sector":"Renewable Diesel","parentId":"mpc"},
      {"id":"tankers","label":"Oil Tankers (FRO)","type":"freight","impact":6,"correlation":0.55,"sector":"Shipping","parentId":"midstream"},
      {"id":"dkl","label":"Delek Logistics (DKL)","type":"producer","impact":4,"correlation":0.50,"sector":"Midstream","parentId":"midstream"},
      {"id":"consumer_disc","label":"Consumer Discret (XLY)","type":"consumer","impact":-3,"correlation":-0.35,"sector":"Retail","parentId":"ups"},
      {"id":"trucking","label":"Trucking (KNX)","type":"consumer","impact":-3,"correlation":-0.40,"sector":"Transport","parentId":"fdx"}
    ]},
    {"nodes": [
      {"id":"dxy_oil","label":"US Dollar (DXY)","type":"fx","impact":-6,"correlation":-0.55,"sector":"Forex","parentId":"uso"},
      {"id":"rub_oil","label":"Russian Ruble (RUB)","type":"fx","impact":5,"correlation":0.48,"sector":"Forex","parentId":"saudi_aramco"},
      {"id":"cad_oil","label":"Canadian Dollar (CAD)","type":"fx","impact":5,"correlation":0.55,"sector":"Forex","parentId":"shell"},
      {"id":"opec_policy","label":"OPEC+ Quotas","type":"policy","impact":10,"correlation":0.65,"sector":"Supply Policy","parentId":"saudi_aramco"},
      {"id":"spr","label":"US SPR Releases","type":"policy","impact":-5,"correlation":-0.40,"sector":"Gov Policy","parentId":"wti_index"},
      {"id":"iran_sanctions","label":"Iran Sanctions","type":"policy","impact":6,"correlation":0.45,"sector":"Geopolitics","parentId":"opec_policy"},
      {"id":"bdi_oil","label":"Baltic Dirty Tanker","type":"freight","impact":5,"correlation":0.50,"sector":"Shipping","parentId":"tankers"},
      {"id":"eia_report","label":"EIA Weekly Report","type":"macro","impact":7,"correlation":0.55,"sector":"Data Releases","parentId":"wti_index"}
    ]},
    {"nodes": [
      {"id":"brent_spread","label":"Brent Crude (Spread)","type":"commodity","impact":9,"correlation":0.97,"sector":"Energy","parentId":"dxy_oil"},
      {"id":"natgas_sub","label":"Natural Gas (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Energy","parentId":"opec_policy"},
      {"id":"renewables_sub","label":"Renewables (Substitute)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Clean Energy","parentId":"spr"},
      {"id":"rbob","label":"Gasoline RBOB (Deriv)","type":"commodity","impact":8,"correlation":0.90,"sector":"Refined Products","parentId":"eia_report"},
      {"id":"heating_oil","label":"Heating Oil (Deriv)","type":"commodity","impact":7,"correlation":0.88,"sector":"Refined Products","parentId":"eia_report"},
      {"id":"jet_fuel","label":"Jet Fuel (Deriv)","type":"commodity","impact":7,"correlation":0.85,"sector":"Refined Products","parentId":"bdi_oil"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Crude oil is the world's most traded commodity -- a price swing in WTI reverberates through airlines, chemicals, shipping, and consumer spending simultaneously. A **+10% move in crude** generates an average **+8.2% response in XLE** and a **-7.1% drop in the JETS ETF**. Global consumption exceeds 100 million barrels per day, with OPEC+ production decisions, U.S. shale output, and Chinese demand growth forming the three pillars of the supply-demand balance. The WTI-Brent spread reflects regional logistics and export dynamics, while the futures curve structure signals market expectations for future supply adequacy.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Integrated majors like ExxonMobil and Chevron see direct revenue expansion. Oilfield services (Halliburton, SLB) amplify the move -- with leverage factors of 1.3-1.5x crude's percentage change. U.S. shale producers in the Permian Basin (Pioneer, Diamondback) respond to price signals with a 3-6 month drilling lag, creating a supply feedback loop that moderates extreme price moves. OPEC+ spare capacity, concentrated in Saudi Arabia and UAE, acts as the market's strategic buffer.

**Secondary -- Supply Chain and Processing:** Refiners (Valero, Marathon) benefit from crack-spread expansion in the initial phase but face margin compression if crude stays elevated. Plastics and synthetic material costs escalate with a 4-8 week lag. The entire petrochemical value chain -- from naphtha crackers to polyethylene producers -- reprices based on crude oil movements. Midstream pipeline operators and tanker companies see increased utilization and rate improvements during high-production environments.

**Tertiary -- Macro and Second-Order Effects:** Jet fuel represents 20-30% of airline operating costs. AAL, which hedges less than Delta, shows the highest beta to crude. The XLE/JETS pair trade has delivered consistent risk-adjusted returns during sustained oil trends. Consumer spending contracts during prolonged crude rallies as gasoline prices erode disposable income, with a rule-of-thumb impact of $0.01/gallon costing U.S. consumers roughly $1.4 billion annually. Petrodollar recycling from oil-exporting nations influences global capital flows and sovereign wealth fund investment.

## Winners

Exploration and production companies with low breakeven costs benefit most from price rallies, particularly U.S. shale operators and Middle Eastern national oil companies. Oilfield services firms see activity expansion and pricing power. Oil-exporting nations (Saudi Arabia, UAE, Norway, Canada) enjoy improved fiscal balances and political leverage. Pipeline operators and tanker companies benefit from higher throughput volumes.

## Losers

Airlines face the most acute margin compression among major industries. Consumer discretionary spending declines as gasoline prices rise. Chemical manufacturers and plastics producers absorb higher feedstock costs. Oil-importing nations (India, Japan, Turkey) face trade balance deterioration and currency pressure. Transportation and logistics companies pass through fuel surcharges but absorb timing lags.

## Trading Note

The 10-day correlation between crude and XLE is historically 0.82-0.88. During geopolitical shocks (Russia-Ukraine, Middle East escalation), the correlation briefly spikes to 0.95+ before reverting. Consider 2:1 weighting (XLE long / JETS short) during uptrend phases. The EIA weekly petroleum status report (Wednesday 10:30 AM ET) and OPEC monthly oil market report are the primary data catalysts. Managed money positioning on NYMEX indicates speculative sentiment extremes that often precede reversals.

## Latest Signal Reports
- [Oil's Geopolitical Premium: Strait of Hormuz](/crude-oil-strait-hormuz-geopolitical-premium/)
- [Oil Price Surge: Industry Impact Analysis](/oil-price-surge-industry-impact/)
- [March 2026 Oil Market & OPEC Update](/march-2026-oil-market-opec/)
- [Diesel at $3.8/Gallon: The Inflation Tax](/diesel-transportation-inflation/)

## Key Impact Relationships

| Node | Impact (±10% Move) | Correlation | Sector |
|------|-------------------|-------------|--------|
| XLE Energy ETF | +8.0% | 0.85 | Energy |
| USO Oil Fund | +9.0% | 0.95 | Commodities |
| OIH Services ETF | +10.0% | 0.88 | Oilfield Services |
| ExxonMobil (XOM) | +7.0% | 0.82 | Integrated Oil |
| Chevron (CVX) | +7.0% | 0.80 | Integrated Oil |
| ConocoPhillips (COP) | +9.0% | 0.85 | E&P |
| Halliburton (HAL) | +12.0% | 0.88 | Oilfield Services |
| JETS Airlines ETF | −7.0% | −0.75 | Airlines |
| American Airlines (AAL) | −9.0% | −0.78 | Airlines |
| Delta Air Lines (DAL) | −8.0% | −0.72 | Airlines |
