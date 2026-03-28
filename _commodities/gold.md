---
layout: commodity
unit: "$/oz"
image: "/assets/images/og-gold.png"
title: "Gold Price Impact: Miners, Dollar & Safe Haven Flows"
description: "How gold price movements reflect inflation hedging, currency dynamics, and risk sentiment across global markets. Impact map for miners, ETFs, and macro factors."
commodity_slug: "gold"
symbol: "GC=F"
sector: "Precious Metals"
etfs: ["GLD", "GDX", "IAU", "GDXJ"]
companies: ["NEM", "GOLD", "AEM", "KGC"]
substitutes: ["Silver", "Bitcoin", "Treasury Bonds"]
themes: ["Clean Energy"]
tags: [gold, commodity analysis, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "gold", "label": "Gold (GC)"},
  "levels": [
    {"nodes": [
      {"id":"gld","label":"GLD ETF","type":"etf","impact":9,"correlation":0.95,"sector":"Precious Metals"},
      {"id":"iau","label":"IAU ETF","type":"etf","impact":9,"correlation":0.95,"sector":"Precious Metals"},
      {"id":"gdx","label":"GDX Miners ETF","type":"etf","impact":15,"correlation":0.88,"sector":"Mining"},
      {"id":"gdxj","label":"GDXJ Junior Miners","type":"etf","impact":14,"correlation":0.82,"sector":"Mining"},
      {"id":"nem","label":"Newmont (NEM)","type":"producer","impact":15,"correlation":0.87,"sector":"Mining"},
      {"id":"gold_barrick","label":"Barrick Gold (GOLD)","type":"producer","impact":14,"correlation":0.85,"sector":"Mining"},
      {"id":"aem","label":"Agnico Eagle (AEM)","type":"producer","impact":13,"correlation":0.84,"sector":"Mining"},
      {"id":"kgc","label":"Kinross Gold (KGC)","type":"producer","impact":12,"correlation":0.82,"sector":"Mining"},
      {"id":"dxy_gold","label":"US Dollar (DXY inv.)","type":"fx","impact":-6,"correlation":-0.70,"sector":"Forex"},
      {"id":"tips","label":"TIPS / Real Yields","type":"macro","impact":4,"correlation":0.55,"sector":"Fixed Income"},
      {"id":"jewelry_sector","label":"Jewelry Demand","type":"consumer","impact":3,"correlation":0.45,"sector":"Consumer"},
      {"id":"central_banks","label":"Central Bank Buying","type":"macro","impact":5,"correlation":0.60,"sector":"Finance"},
      {"id":"gc_index","label":"COMEX Gold Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"vix_gold","label":"VIX (Fear Index)","type":"macro","impact":5,"correlation":0.45,"sector":"Volatility"}
    ]},
    {"nodes": [
      {"id":"fnv","label":"Franco-Nevada (FNV)","type":"producer","impact":11,"correlation":0.82,"sector":"Royalty/Streaming","parentId":"gdx"},
      {"id":"wpm","label":"Wheaton Prec (WPM)","type":"producer","impact":11,"correlation":0.80,"sector":"Royalty/Streaming","parentId":"gdx"},
      {"id":"rgld","label":"Royal Gold (RGLD)","type":"producer","impact":10,"correlation":0.78,"sector":"Royalty/Streaming","parentId":"gdx"},
      {"id":"paas","label":"Pan American Silver (PAAS)","type":"producer","impact":10,"correlation":0.78,"sector":"Silver/Gold","parentId":"gdxj"},
      {"id":"au_btk","label":"B2Gold (BTG)","type":"producer","impact":11,"correlation":0.80,"sector":"Mining","parentId":"gdxj"},
      {"id":"hmyf","label":"Harmony Gold (HMY)","type":"producer","impact":10,"correlation":0.76,"sector":"Mining","parentId":"gdxj"},
      {"id":"ssrm","label":"SSR Mining (SSRM)","type":"producer","impact":9,"correlation":0.74,"sector":"Mining","parentId":"gdxj"},
      {"id":"tif_jewel","label":"Tiffany / LVMH","type":"consumer","impact":2,"correlation":0.35,"sector":"Luxury","parentId":"jewelry_sector"},
      {"id":"sig","label":"Signet Jewelers (SIG)","type":"consumer","impact":2,"correlation":0.30,"sector":"Jewelry Retail","parentId":"jewelry_sector"},
      {"id":"pboc","label":"PBOC (China CB)","type":"macro","impact":6,"correlation":0.55,"sector":"Central Banks","parentId":"central_banks"},
      {"id":"rbi","label":"RBI (India CB)","type":"macro","impact":4,"correlation":0.45,"sector":"Central Banks","parentId":"central_banks"},
      {"id":"tlt_gold","label":"TLT (Long Bonds)","type":"etf","impact":4,"correlation":0.50,"sector":"Fixed Income","parentId":"tips"}
    ]},
    {"nodes": [
      {"id":"anglogold","label":"AngloGold (AU)","type":"producer","impact":12,"correlation":0.80,"sector":"Mining","parentId":"nem"},
      {"id":"goldfields","label":"Gold Fields (GFI)","type":"producer","impact":11,"correlation":0.78,"sector":"Mining","parentId":"nem"},
      {"id":"alamos","label":"Alamos Gold (AGI)","type":"producer","impact":9,"correlation":0.75,"sector":"Mining","parentId":"aem"},
      {"id":"eldorado","label":"Eldorado Gold (EGO)","type":"producer","impact":8,"correlation":0.72,"sector":"Mining","parentId":"aem"},
      {"id":"osisko","label":"Osisko Gold (OR)","type":"producer","impact":8,"correlation":0.74,"sector":"Royalty/Streaming","parentId":"fnv"},
      {"id":"sandstorm","label":"Sandstorm Gold (SAND)","type":"producer","impact":7,"correlation":0.70,"sector":"Royalty/Streaming","parentId":"fnv"},
      {"id":"valcambi","label":"Valcambi Refinery","type":"processor","impact":3,"correlation":0.30,"sector":"Refining","parentId":"gld"},
      {"id":"pamp","label":"PAMP SA Refinery","type":"processor","impact":3,"correlation":0.28,"sector":"Refining","parentId":"gld"},
      {"id":"gold_etl","label":"Gold Electronics Use","type":"consumer","impact":2,"correlation":0.20,"sector":"Tech","parentId":"jewelry_sector"},
      {"id":"india_demand","label":"India Physical Demand","type":"regional","impact":5,"correlation":0.40,"sector":"Consumer","parentId":"rbi"},
      {"id":"china_demand","label":"China Physical Demand","type":"regional","impact":6,"correlation":0.45,"sector":"Consumer","parentId":"pboc"},
      {"id":"turkey_cb","label":"Turkey CB Buying","type":"macro","impact":3,"correlation":0.38,"sector":"Central Banks","parentId":"central_banks"}
    ]},
    {"nodes": [
      {"id":"fed_rates_gold","label":"Fed Funds Rate","type":"policy","impact":-7,"correlation":-0.60,"sector":"Monetary Policy","parentId":"dxy_gold"},
      {"id":"ecb_rates","label":"ECB Rate Policy","type":"policy","impact":-4,"correlation":-0.40,"sector":"Monetary Policy","parentId":"dxy_gold"},
      {"id":"cpi_inflation","label":"US CPI Inflation","type":"macro","impact":6,"correlation":0.55,"sector":"Inflation","parentId":"tips"},
      {"id":"geopolitical","label":"Geopolitical Risk","type":"macro","impact":7,"correlation":0.50,"sector":"Risk Premium","parentId":"vix_gold"},
      {"id":"jpy_gold","label":"Japanese Yen (JPY)","type":"fx","impact":4,"correlation":0.40,"sector":"Forex","parentId":"dxy_gold"},
      {"id":"cnh_gold","label":"Chinese Yuan (CNH)","type":"fx","impact":3,"correlation":0.35,"sector":"Forex","parentId":"pboc"},
      {"id":"dedollar","label":"De-dollarization Trend","type":"policy","impact":5,"correlation":0.42,"sector":"Geopolitics","parentId":"central_banks"},
      {"id":"money_supply","label":"Global M2 Supply","type":"macro","impact":5,"correlation":0.48,"sector":"Monetary","parentId":"cpi_inflation"}
    ]},
    {"nodes": [
      {"id":"silver_cross","label":"Silver (Cross-Link)","type":"commodity","impact":8,"correlation":0.82,"sector":"Precious Metals","parentId":"fed_rates_gold"},
      {"id":"btc_alt","label":"Bitcoin (Alternative)","type":"substitute","impact":-3,"correlation":-0.15,"sector":"Crypto","parentId":"dedollar"},
      {"id":"platinum_cross","label":"Platinum (Cross-Link)","type":"commodity","impact":5,"correlation":0.60,"sector":"PGMs","parentId":"geopolitical"},
      {"id":"palladium_cross","label":"Palladium (Cross-Link)","type":"commodity","impact":3,"correlation":0.40,"sector":"PGMs","parentId":"geopolitical"},
      {"id":"treasury_sub","label":"Treasuries (Safe Haven)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Fixed Income","parentId":"fed_rates_gold"},
      {"id":"copper_ratio","label":"Copper/Gold Ratio","type":"index","impact":4,"correlation":0.50,"sector":"Risk Indicator","parentId":"money_supply"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Gold operates as the world's premier safe-haven asset -- inversely correlated with the U.S. dollar, real interest rates, and equity volatility. A **+5% gold move** signals elevated inflation expectations or systemic financial stress. Annual mine production is approximately 3,600 tonnes, but above-ground stocks exceeding 200,000 tonnes mean that gold supply is essentially infinite at the right price -- the market is driven by the willingness to hold versus sell existing metal. Central bank purchases, particularly from China, India, and Turkey, have structurally increased since 2022, adding a new demand pillar alongside jewelry and investment.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** GDX and individual miners (Newmont, Barrick) exhibit 2-3x leverage to gold prices due to fixed production costs. A 10% gold rally can generate 20-30% EPS expansion for major producers. Agnico Eagle Mines (AEM) and Kinross Gold (KGC) provide additional pure-play exposure with different geographic risk profiles. Royalty and streaming companies (Franco-Nevada, Wheaton Precious Metals) offer leveraged gold exposure with lower operating risk than miners.

**Secondary -- Supply Chain and Processing:** Central bank purchases have averaged 1,000+ tonnes annually in recent years, reflecting de-dollarization trends and geopolitical hedging. Jewelry fabrication, concentrated in India and China, accounts for roughly 50% of annual physical demand and responds to both price levels and local currency dynamics. Gold refiners (Valcambi, PAMP, Metalor) process mine output and recycled scrap into investment-grade bars, earning processing margins that are stable regardless of price direction.

**Tertiary -- Macro and Second-Order Effects:** Gold maintains a -0.70 rolling correlation with DXY. Dollar strength consistently pressures gold. Monitor Fed Funds futures for rate trajectory as the primary gold driver. TIPS bonds and gold often move together during stagflationary regimes. When real yields are negative, gold's opportunity cost disappears -- the strongest bull case. Gold's role in the global monetary system gives it unique reflexive properties where rising prices attract momentum capital, creating self-reinforcing rallies.

## Winners

Gold miners with high operating leverage and long mine lives benefit most from sustained price increases. Newmont (NEM) and Barrick Gold (GOLD) are the largest producers. Streaming and royalty companies capture price upside without cost inflation. Central banks holding gold reserves see balance sheet appreciation. Physical gold dealers and coin shops see increased retail demand and wider premiums during price rallies.

## Losers

Jewelry manufacturers and retailers face demand destruction as higher prices push consumers toward lower-karat or smaller pieces. Industrial users of gold in electronics and dentistry absorb cost increases on a small-volume but essential input. Short sellers and gold bears face mark-to-market losses during sustained rallies. The U.S. dollar's relative attractiveness as a reserve asset diminishes when gold rallies signal loss of confidence in fiat currencies.

## Trading Note

The gold/silver ratio (historically averaging ~60-65:1) is a key spread trade. When the ratio exceeds 80-90, silver is historically cheap relative to gold -- suggesting a long silver / short gold position with mean-reversion potential. COMEX positioning data, GLD ETF tonnage flows, and central bank purchase reports from the World Gold Council provide the key demand-side indicators. The gold/real yield relationship (inverted 10-year TIPS yield) remains the most reliable fundamental framework for directional positioning.

## Latest Signal Reports
- [Gold Price Regime Change](/gold-price-regime-change/)
- [Gold Breaks $5,000: Mining Stocks Impact](/gold-breaks-5000-mining-stocks/)
- [Gold Mining, Emerging Markets Chain](/gold-mining-emerging-markets-chain/)
- [GDX vs GLD: Mining vs Physical Gold](/gdx-vs-gld-gold-mining-physical/)

## Key Impact Relationships

| Node | Impact (±10% Move) | Correlation | Sector |
|------|-------------------|-------------|--------|
| GLD Gold ETF | +9.8% | 0.99 | Precious Metals |
| GDX Gold Miners ETF | +18.0% | 0.88 | Gold Mining |
| GDXJ Junior Miners ETF | +22.0% | 0.82 | Junior Mining |
| Newmont (NEM) | +16.0% | 0.85 | Gold Mining |
| Barrick Gold (GOLD) | +17.0% | 0.84 | Gold Mining |
| Agnico Eagle (AEM) | +15.0% | 0.83 | Gold Mining |
| Wheaton Precious (WPM) | +12.0% | 0.80 | Royalty/Streaming |
| Franco-Nevada (FNV) | +10.0% | 0.78 | Royalty/Streaming |
| USD Index (DXY) | −3.5% | −0.45 | Macro/FX |
| Real Yields (TIP) | −2.0% | −0.35 | Macro/Rates |
