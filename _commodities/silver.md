---
layout: commodity
title: "Silver"
description: "Silver's dual role as precious metal and industrial input for solar panels and electronics."
commodity_slug: "silver"
symbol: "SI=F"
sector: "Precious Metals"
etfs: ["SLV", "SIVR"]
companies: ["PAAS", "AG", "WPM", "MAG"]
substitutes: ["Gold", "Platinum", "Copper"]
themes: ["Clean Energy"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "silver", "label": "Silver (SI)"},
  "levels": [
    {"nodes": [
      {"id":"slv","label":"SLV Silver ETF","type":"etf","impact":9,"correlation":0.92,"sector":"Precious Metals"},
      {"id":"sivr","label":"SIVR Silver ETF","type":"etf","impact":9,"correlation":0.90,"sector":"Precious Metals"},
      {"id":"paas","label":"Pan American Silver (PAAS)","type":"producer","impact":10,"correlation":0.82,"sector":"Silver Mining"},
      {"id":"ag","label":"First Majestic (AG)","type":"producer","impact":12,"correlation":0.88,"sector":"Silver Mining"},
      {"id":"wpm","label":"Wheaton Precious (WPM)","type":"producer","impact":8,"correlation":0.75,"sector":"Streaming"},
      {"id":"hl","label":"Hecla Mining (HL)","type":"producer","impact":11,"correlation":0.85,"sector":"Silver Mining"},
      {"id":"cde","label":"Coeur Mining (CDE)","type":"producer","impact":11,"correlation":0.84,"sector":"Silver Mining"},
      {"id":"gdxj_si","label":"GDXJ Junior Miners ETF","type":"etf","impact":7,"correlation":0.68,"sector":"Mining"},
      {"id":"si_index","label":"Silver Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"gld_cross","label":"Gold (Related)","type":"commodity","impact":7,"correlation":0.80,"sector":"Precious Metals"},
      {"id":"solar_si","label":"Solar Silver Demand","type":"consumer","impact":5,"correlation":0.40,"sector":"Solar"},
      {"id":"electronics_si","label":"Electronics Demand","type":"consumer","impact":3,"correlation":0.25,"sector":"Industrial"},
      {"id":"jewelry_si","label":"Jewelry/Silverware","type":"consumer","impact":3,"correlation":0.22,"sector":"Luxury"}
    ]},
    {"nodes": [
      {"id":"mag","label":"MAG Silver (MAG)","type":"producer","impact":10,"correlation":0.82,"sector":"Silver Mining","parentId":"ag"},
      {"id":"ssrm","label":"SSR Mining (SSRM)","type":"producer","impact":8,"correlation":0.70,"sector":"Mining","parentId":"paas"},
      {"id":"eza","label":"South Africa ETF (EZA)","type":"etf","impact":3,"correlation":0.25,"sector":"Regional","parentId":"paas"},
      {"id":"fslr_si","label":"First Solar (FSLR)","type":"consumer","impact":3,"correlation":0.22,"sector":"Solar","parentId":"solar_si"},
      {"id":"enph_si","label":"Enphase Energy (ENPH)","type":"consumer","impact":2,"correlation":0.18,"sector":"Solar","parentId":"solar_si"},
      {"id":"tan_si","label":"TAN Solar ETF","type":"etf","impact":3,"correlation":0.25,"sector":"Solar","parentId":"solar_si"},
      {"id":"gld_etf","label":"GLD Gold ETF","type":"etf","impact":6,"correlation":0.72,"sector":"Precious Metals","parentId":"gld_cross"},
      {"id":"nem_si","label":"Newmont (NEM)","type":"producer","impact":5,"correlation":0.55,"sector":"Gold/Silver","parentId":"gld_cross"},
      {"id":"dbs_si","label":"Deutsche Bank Silver","type":"etf","impact":7,"correlation":0.78,"sector":"Silver","parentId":"slv"},
      {"id":"semi_si","label":"Semiconductors (SOXX)","type":"consumer","impact":2,"correlation":0.15,"sector":"Electronics","parentId":"electronics_si"},
      {"id":"silver_coins","label":"Silver Coin/Bar Demand","type":"consumer","impact":5,"correlation":0.42,"sector":"Investment","parentId":"si_index"},
      {"id":"tif_si","label":"Tiffany/LVMH (LVMUY)","type":"consumer","impact":2,"correlation":0.15,"sector":"Luxury","parentId":"jewelry_si"}
    ]},
    {"nodes": [
      {"id":"dxy_si","label":"US Dollar (DXY)","type":"fx","impact":-6,"correlation":-0.55,"sector":"Forex","parentId":"si_index"},
      {"id":"mxn_si","label":"Mexican Peso (MXN)","type":"fx","impact":5,"correlation":0.42,"sector":"Forex","parentId":"paas"},
      {"id":"inr_si","label":"Indian Rupee (INR)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"si_index"},
      {"id":"fed_rate_si","label":"Fed Interest Rate","type":"policy","impact":-7,"correlation":-0.58,"sector":"Monetary Policy","parentId":"dxy_si"},
      {"id":"inflation_hedge","label":"Inflation Hedge Demand","type":"macro","impact":6,"correlation":0.50,"sector":"Investment","parentId":"slv"},
      {"id":"india_demand","label":"India Silver Demand","type":"macro","impact":5,"correlation":0.40,"sector":"Demand","parentId":"inr_si"},
      {"id":"solar_growth","label":"Global Solar Buildout","type":"macro","impact":6,"correlation":0.45,"sector":"Clean Energy","parentId":"solar_si"},
      {"id":"mine_supply","label":"Global Mine Supply","type":"macro","impact":-5,"correlation":-0.42,"sector":"Supply","parentId":"si_index"},
      {"id":"silver_deficit","label":"Silver Market Deficit","type":"macro","impact":7,"correlation":0.55,"sector":"Supply/Demand","parentId":"mine_supply"},
      {"id":"copper_related_si","label":"Copper (Related)","type":"commodity","impact":5,"correlation":0.50,"sector":"Base Metals","parentId":"si_index"},
      {"id":"platinum_related","label":"Platinum (Related)","type":"commodity","impact":4,"correlation":0.45,"sector":"Precious Metals","parentId":"gld_cross"},
      {"id":"photovoltaic","label":"Photovoltaic Paste","type":"consumer","impact":5,"correlation":0.38,"sector":"Solar Mfg","parentId":"fslr_si"}
    ]},
    {"nodes": [
      {"id":"gold_silver_ratio","label":"Gold/Silver Ratio","type":"macro","impact":5,"correlation":0.45,"sector":"Relative Value","parentId":"gld_cross"},
      {"id":"comex_inventories","label":"COMEX Inventories","type":"macro","impact":-5,"correlation":-0.45,"sector":"Supply Data","parentId":"si_index"},
      {"id":"cftc_positioning","label":"CFTC Net Positioning","type":"macro","impact":5,"correlation":0.42,"sector":"Sentiment","parentId":"silver_coins"},
      {"id":"mexico_mining","label":"Mexico Mining Policy","type":"policy","impact":5,"correlation":0.38,"sector":"Supply","parentId":"mxn_si"},
      {"id":"5g_silver","label":"5G Silver Demand","type":"macro","impact":3,"correlation":0.22,"sector":"Technology","parentId":"electronics_si"},
      {"id":"ev_silver","label":"EV Silver Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Auto","parentId":"solar_growth"},
      {"id":"peru_mining","label":"Peru Mining Output","type":"regional","impact":4,"correlation":0.32,"sector":"Supply","parentId":"mine_supply"},
      {"id":"wsb_silver","label":"Retail Investor Demand","type":"macro","impact":4,"correlation":0.28,"sector":"Sentiment","parentId":"silver_coins"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Silver occupies a unique position among commodities with a dual identity as both a precious metal and an industrial workhorse. Over 50% of annual silver demand comes from industrial applications including solar panel manufacturing, electronics, and medical devices, making it far more economically sensitive than gold. The silver/gold ratio serves as a widely watched indicator of relative value and risk appetite across metals markets. Annual mine production is approximately 830 million ounces, but the market has been in persistent deficit as industrial demand growth outpaces supply additions.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Silver paste is a critical component in photovoltaic cell production, with each solar panel consuming 10-20 grams. As global solar installations accelerate, industrial silver demand has grown at 5-8% annually. Pan American Silver (PAAS) and First Majestic Silver (AG) are the largest primary silver miners, though most silver is produced as a by-product of lead, zinc, copper, and gold mining. Wheaton Precious Metals (WPM) provides streaming exposure with lower operating risk.

**Secondary -- Supply Chain and Processing:** Silver tracks gold directionally but with 1.5-2x the volatility, earning its reputation as "gold on steroids." SLV and SIVR ETFs channel retail and institutional investment flows. During risk-off episodes, silver initially sells off with industrial metals before catching a safe-haven bid alongside gold. Physical silver bars and coins represent a meaningful demand category, with premiums over spot prices widening during periods of strong retail investor interest. Mexican and Peruvian mines provide the largest share of primary silver supply.

**Tertiary -- Macro and Second-Order Effects:** While traditional film photography demand has declined, silver's antimicrobial properties are driving adoption in water purification, wound care, and textile treatments. 5G infrastructure buildout requires silver-based components in high-frequency circuits and antennas. Silver brazing alloys are essential in HVAC, automotive, and industrial assembly applications. The metal's role in electric vehicle components (contacts, switches, battery connections) adds an EV-linked demand layer on top of solar growth.

## Winners

Primary silver miners capture direct earnings leverage during price rallies, with operational leverage amplifying returns for low-cost producers. Pan American Silver, First Majestic, and MAG Silver benefit most among pure-play equities. Silver-producing nations (Mexico, Peru, China) collect higher royalties. Physical silver dealers see demand surges and wider premiums. Solar panel recyclers benefit as rising silver values improve the economics of recovering metal from end-of-life panels.

## Losers

Solar panel manufacturers face higher silver paste costs that pressure module margins and slow the decline in solar electricity costs. Electronics manufacturers absorb incremental costs on connectors, contacts, and circuit board components. Jewelry makers face raw material inflation, though silver's lower absolute price compared to gold limits the impact. Industrial users of silver brazing alloys see consumable costs rise. Silverware and tableware manufacturers face cost pressure in a discretionary product category.

## Trading Note

The gold/silver ratio is the primary spread indicator for silver traders. Historically averaging around 60:1, the ratio has ranged from 30:1 to 120:1. When the ratio exceeds 80-85, silver is considered historically cheap relative to gold, and mean-reversion trades (long silver / short gold) have generated strong risk-adjusted returns over 6-12 month horizons. Monitor COMEX positioning data and Indian import volumes as leading demand indicators. Solar installation growth rates and the Silver Institute's annual supply-demand balance provide the key fundamental framework for assessing structural deficit persistence.
