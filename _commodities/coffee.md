---
layout: commodity
unit: "cents/lb"
image: "/assets/images/og-coffee.png"
title: "Coffee"
description: "Coffee as the world's second-most traded commodity with climate-vulnerable supply chains."
commodity_slug: "coffee"
symbol: "KC=F"
sector: "Soft Commodities"
etfs: ["JO"]
companies: ["SBUX", "KDP", "DNKN"]
substitutes: ["Tea", "Energy Drinks"]
themes: ["Food Inflation"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "coffee", "label": "Coffee (Arabica)"},
  "levels": [
    {"nodes": [
      {"id":"jo","label":"JO Coffee ETN","type":"etf","impact":9,"correlation":0.88,"sector":"Soft Commodities"},
      {"id":"coffee_index","label":"Coffee Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"sbux_cf","label":"Starbucks (SBUX)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Coffee Retail"},
      {"id":"kdp","label":"Keurig Dr Pepper (KDP)","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Beverages"},
      {"id":"bros","label":"Dutch Bros (BROS)","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Coffee Retail"},
      {"id":"farm","label":"Farmer Bros (FARM)","type":"consumer","impact":-8,"correlation":-0.70,"sector":"Coffee Wholesale"},
      {"id":"jde","label":"JDE Peet's (JDEPY)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Coffee Retail"},
      {"id":"nsrgy_cf","label":"Nestlé (NSRGY)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Packaged Food"},
      {"id":"dba_cf","label":"DBA Agriculture ETF","type":"etf","impact":5,"correlation":0.45,"sector":"Agriculture"},
      {"id":"xlp_cf","label":"XLP Consumer Staples ETF","type":"etf","impact":-2,"correlation":-0.15,"sector":"Consumer Staples"},
      {"id":"deo_cf","label":"Diageo (DEO)","type":"consumer","impact":-1,"correlation":-0.08,"sector":"Beverages"}
    ]},
    {"nodes": [
      {"id":"mcd_cf","label":"McDonald's (MCD)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"QSR","parentId":"sbux_cf"},
      {"id":"yum_cf","label":"Yum Brands (YUM)","type":"consumer","impact":-1,"correlation":-0.10,"sector":"QSR","parentId":"sbux_cf"},
      {"id":"cmg_cf","label":"Chipotle (CMG)","type":"consumer","impact":-1,"correlation":-0.08,"sector":"QSR","parentId":"mcd_cf"},
      {"id":"robusta","label":"Robusta Coffee","type":"commodity","impact":7,"correlation":0.80,"sector":"Coffee","parentId":"coffee_index"},
      {"id":"green_beans","label":"Green Coffee Beans","type":"commodity","impact":9,"correlation":0.95,"sector":"Raw Coffee","parentId":"coffee_index"},
      {"id":"roasters","label":"Specialty Roasters","type":"processor","impact":-5,"correlation":-0.42,"sector":"Roasting","parentId":"farm"},
      {"id":"packaging_cf","label":"Coffee Packaging","type":"supplier","impact":2,"correlation":0.15,"sector":"Packaging","parentId":"kdp"},
      {"id":"treatt","label":"Treatt (TET.L)","type":"supplier","impact":3,"correlation":0.22,"sector":"Flavor/Fragrance","parentId":"nsrgy_cf"},
      {"id":"sysco_cf","label":"Sysco (SYY)","type":"supplier","impact":2,"correlation":0.12,"sector":"Food Distribution","parentId":"sbux_cf"},
      {"id":"usfd_cf","label":"US Foods (USFD)","type":"supplier","impact":2,"correlation":0.10,"sector":"Food Distribution","parentId":"farm"},
      {"id":"pods_market","label":"Coffee Pod Market","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Single Serve","parentId":"kdp"}
    ]},
    {"nodes": [
      {"id":"brl_cf","label":"Brazilian Real (BRL)","type":"fx","impact":6,"correlation":0.50,"sector":"Forex","parentId":"coffee_index"},
      {"id":"cop_cf","label":"Colombian Peso (COP)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"coffee_index"},
      {"id":"dxy_cf","label":"US Dollar (DXY)","type":"fx","impact":-5,"correlation":-0.45,"sector":"Forex","parentId":"coffee_index"},
      {"id":"vnd_cf","label":"Vietnamese Dong (VND)","type":"fx","impact":3,"correlation":0.28,"sector":"Forex","parentId":"robusta"},
      {"id":"brazil_frost","label":"Brazil Frost Risk","type":"macro","impact":8,"correlation":0.55,"sector":"Weather","parentId":"brl_cf"},
      {"id":"colombia_harvest","label":"Colombia Harvest","type":"regional","impact":5,"correlation":0.40,"sector":"Supply","parentId":"cop_cf"},
      {"id":"vietnam_robusta","label":"Vietnam Robusta Output","type":"regional","impact":4,"correlation":0.35,"sector":"Supply","parentId":"vnd_cf"},
      {"id":"el_nino_cf","label":"El Niño Weather","type":"macro","impact":6,"correlation":0.45,"sector":"Weather","parentId":"brazil_frost"},
      {"id":"coffee_rust","label":"Coffee Leaf Rust","type":"macro","impact":5,"correlation":0.38,"sector":"Disease","parentId":"colombia_harvest"},
      {"id":"consumer_spending","label":"Consumer Spending","type":"macro","impact":3,"correlation":0.22,"sector":"Demand","parentId":"sbux_cf"},
      {"id":"tea_sub","label":"Tea (Substitute)","type":"substitute","impact":-3,"correlation":-0.20,"sector":"Beverages","parentId":"coffee_index"}
    ]},
    {"nodes": [
      {"id":"ico_report","label":"ICO Monthly Report","type":"macro","impact":5,"correlation":0.40,"sector":"Data Release","parentId":"coffee_index"},
      {"id":"ethiopia_origin","label":"Ethiopia Origin","type":"regional","impact":4,"correlation":0.30,"sector":"Supply","parentId":"green_beans"},
      {"id":"climate_change_cf","label":"Climate Impact on Coffee","type":"macro","impact":5,"correlation":0.35,"sector":"Long-term Supply","parentId":"brazil_frost"},
      {"id":"fair_trade","label":"Fair Trade Premium","type":"policy","impact":3,"correlation":0.20,"sector":"ESG","parentId":"roasters"},
      {"id":"cold_brew_trend","label":"Cold Brew/RTD Trend","type":"macro","impact":3,"correlation":0.22,"sector":"Consumer","parentId":"consumer_spending"},
      {"id":"energy_drinks_comp","label":"Energy Drinks (Competitor)","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Beverages","parentId":"tea_sub"},
      {"id":"shipping_cf","label":"Container Shipping","type":"freight","impact":3,"correlation":0.22,"sector":"Logistics","parentId":"green_beans"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Coffee is the second-most traded commodity in the world by value after crude oil, with a global market exceeding $450 billion annually. Production is concentrated in Brazil (35-40% of global supply) and Vietnam (15-20%), making the market highly sensitive to weather events in these two origins. The Arabica/Robusta quality split creates two distinct markets -- ICE KC futures for Arabica and London Robusta futures -- with different supply chains and end uses. Global consumption continues to grow at 2-3% annually, with emerging middle-class demand in Asia driving incremental growth above traditional Western markets.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Starbucks, Keurig Dr Pepper, and restaurant chains face direct input cost exposure to green coffee prices. However, roasters typically hedge 6-18 months forward, creating a lag between futures price spikes and retail price increases. Starbucks' vertically integrated sourcing provides a relative cost advantage, while smaller specialty roasters face margin compression first during supply shocks. Nestle, JDE Peet's, and Lavazza dominate the packaged retail segment where brand loyalty provides some insulation from cost pass-through resistance.

**Secondary -- Supply Chain and Processing:** Brazil's Minas Gerais region produces the majority of Arabica coffee, making it vulnerable to frost events (historically devastating in 1975 and 1994) and prolonged drought. Vietnam's Robusta production is sensitive to monsoon patterns. Climate change is pushing viable growing regions to higher altitudes, threatening long-term supply growth and increasing production costs for farmers. Coffee trading houses (Neumann Kaffee, ECOM, Volcafe) manage physical logistics, warehousing, and blending operations that link origin production to roaster demand.

**Tertiary -- Macro and Second-Order Effects:** Coffee exports are a primary source of foreign exchange for Ethiopia, Colombia, Honduras, and Uganda. Price spikes generate windfall revenues for producing nations but can trigger currency appreciation that harms other export sectors. Fair trade and sustainability certifications increasingly influence institutional purchasing decisions and supply chain investment. Coffee price inflation feeds directly into consumer CPI and restaurant industry cost structures.

## Winners

Coffee farmers in Brazil, Colombia, and Vietnam capture direct upside from price rallies, though hedging and forward contracts can limit gains. Large trading houses with physical inventory benefit from appreciation on stored beans. Starbucks and premium roasters with pricing power can expand margins by passing through cost increases while maintaining brand loyalty. Equipment and input suppliers to coffee farms (fertilizer, irrigation) see increased spending during high-price periods.

## Losers

Budget-oriented coffee brands and private-label roasters face the sharpest margin compression due to limited pricing power. Restaurant chains and foodservice operators absorb cost increases that cannot be fully passed to menu prices. Importing nations face trade balance deterioration and consumer price inflation. Smaller specialty roasters with thin margins risk business failure during sustained price spikes, as their customer base resists the steep retail price increases needed to maintain profitability.

## Trading Note

The Arabica/Robusta price spread reflects quality premiums and substitution dynamics in blending. Certified ICE warehouse stocks serve as a visible supply indicator, though they represent a small fraction of total global inventories. Monitor Brazilian real (BRL) exchange rates alongside coffee prices, as a weak BRL incentivizes Brazilian farmer selling even at lower dollar-denominated prices. USDA and ICO crop forecasts are the primary fundamental catalysts for position adjustments. The commitment of traders (COT) report reveals speculative positioning extremes that often precede major reversals.
