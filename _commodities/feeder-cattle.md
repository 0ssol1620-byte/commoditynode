---
layout: commodity
image: "/assets/images/og-default.png"
title: "Feeder Cattle"
description: "Feeder cattle as weaned calves entering feedlots, driven by the cattle cycle, corn costs, and drought conditions."
commodity_slug: "feeder-cattle"
symbol: "GF=F"
sector: "Agriculture/Livestock"
etfs: ["COW", "DBA"]
companies: ["TSN", "JBSAY", "CVGW"]
substitutes: ["Live Cattle", "Dairy Calves", "Imported Beef"]
themes: ["Cattle Cycle", "Drought Impact"]
tags: [feeder cattle, cattle cycle, feedlot, beef, livestock, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "feeder_cattle", "label": "Feeder Cattle"},
  "levels": [
    {"nodes": [
      {"id":"gf_futures","label":"Feeder Cattle Futures (GF=F)","type":"index","impact":10,"correlation":0.99,"sector":"Livestock"},
      {"id":"live_cattle","label":"Live Cattle (LE=F)","type":"commodity","impact":8,"correlation":0.82,"sector":"Livestock"},
      {"id":"corn_feed","label":"Corn Feed Cost (ZC=F)","type":"commodity","impact":-8,"correlation":-0.72,"sector":"Agriculture"},
      {"id":"tsn_fc","label":"Tyson Foods (TSN)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Meat Processing"},
      {"id":"jbs_fc","label":"JBS (JBSAY)","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Meat Processing"},
      {"id":"cow_etf","label":"COW Livestock ETF","type":"etf","impact":7,"correlation":0.68,"sector":"Livestock"},
      {"id":"dba_fc","label":"DBA Agriculture ETF","type":"etf","impact":3,"correlation":0.28,"sector":"Agriculture"},
      {"id":"cow_calf","label":"Cow-Calf Ranchers","type":"producer","impact":9,"correlation":0.85,"sector":"Ranching"},
      {"id":"feedlot_ops","label":"Feedlot Operators","type":"consumer","impact":-6,"correlation":-0.55,"sector":"Cattle Feeding"},
      {"id":"drought_index","label":"US Drought Monitor","type":"macro","impact":7,"correlation":0.60,"sector":"Weather"},
      {"id":"cattle_cycle","label":"Cattle Cycle Phase","type":"macro","impact":8,"correlation":0.70,"sector":"Supply Cycle"},
      {"id":"beef_exports","label":"US Beef Export Demand","type":"macro","impact":5,"correlation":0.42,"sector":"International Trade"},
      {"id":"usda_cof","label":"USDA Cattle on Feed","type":"macro","impact":7,"correlation":0.62,"sector":"Data Release"}
    ]},
    {"nodes": [
      {"id":"meatpackers","label":"Big Four Meatpackers","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Meat Processing","parentId":"tsn_fc"},
      {"id":"cattle_placed","label":"Cattle Placements","type":"macro","impact":7,"correlation":0.60,"sector":"Supply","parentId":"usda_cof"},
      {"id":"backgrounding","label":"Backgrounding Operations","type":"processor","impact":6,"correlation":0.52,"sector":"Cattle Feeding","parentId":"feedlot_ops"},
      {"id":"auction_markets","label":"Auction Markets / Sale Barns","type":"index","impact":8,"correlation":0.75,"sector":"Price Discovery","parentId":"cow_calf"},
      {"id":"hay_cost","label":"Hay & Forage Costs","type":"commodity","impact":-5,"correlation":-0.42,"sector":"Feed","parentId":"cow_calf"},
      {"id":"cattle_inv","label":"US Cattle Inventory","type":"macro","impact":-7,"correlation":-0.62,"sector":"Supply","parentId":"cattle_cycle"},
      {"id":"heifer_retention","label":"Heifer Retention Rate","type":"macro","impact":-6,"correlation":-0.55,"sector":"Herd Rebuild","parentId":"cattle_cycle"},
      {"id":"japan_beef","label":"Japan Beef Imports","type":"regional","impact":4,"correlation":0.35,"sector":"Export Market","parentId":"beef_exports"},
      {"id":"korea_beef","label":"Korea Beef Imports","type":"regional","impact":4,"correlation":0.32,"sector":"Export Market","parentId":"beef_exports"},
      {"id":"china_beef","label":"China Beef Imports","type":"regional","impact":3,"correlation":0.25,"sector":"Export Market","parentId":"beef_exports"},
      {"id":"ddgs_feed","label":"DDGS in Cattle Rations","type":"commodity","impact":-3,"correlation":-0.25,"sector":"Feed","parentId":"corn_feed"},
      {"id":"feeder_index","label":"CME Feeder Cattle Index","type":"index","impact":9,"correlation":0.95,"sector":"Cash Settlement","parentId":"gf_futures"}
    ]},
    {"nodes": [
      {"id":"pasture_cond","label":"Pasture Conditions","type":"macro","impact":6,"correlation":0.50,"sector":"Grazing","parentId":"drought_index"},
      {"id":"swd_drought","label":"Southwest Drought","type":"regional","impact":7,"correlation":0.58,"sector":"Weather","parentId":"drought_index"},
      {"id":"cattle_weights","label":"Average Cattle Weights","type":"macro","impact":-4,"correlation":-0.32,"sector":"Supply","parentId":"cattle_placed"},
      {"id":"beef_retail","label":"Retail Beef Prices","type":"index","impact":5,"correlation":0.42,"sector":"Consumer","parentId":"live_cattle"},
      {"id":"imported_beef","label":"Imported Beef (Substitute)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"International Supply","parentId":"live_cattle"},
      {"id":"dairy_calves","label":"Dairy Calves (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Dairy","parentId":"feedlot_ops"},
      {"id":"vet_pharma","label":"Veterinary Pharma (ZTS)","type":"supplier","impact":3,"correlation":0.22,"sector":"Animal Health","parentId":"cow_calf"},
      {"id":"beta_agonists","label":"Beta-Agonist Feed Additives","type":"supplier","impact":3,"correlation":0.20,"sector":"Feed Additives","parentId":"feedlot_ops"},
      {"id":"transport_fc","label":"Livestock Trucking","type":"freight","impact":3,"correlation":0.22,"sector":"Logistics","parentId":"auction_markets"},
      {"id":"interest_rates","label":"Ranch Financing Costs","type":"macro","impact":-3,"correlation":-0.25,"sector":"Finance","parentId":"cow_calf"},
      {"id":"protein_demand","label":"Protein Consumption Trend","type":"macro","impact":4,"correlation":0.30,"sector":"Consumer Demand","parentId":"beef_retail"}
    ]},
    {"nodes": [
      {"id":"herd_liquidation","label":"Drought Liquidation Event","type":"macro","impact":8,"correlation":0.65,"sector":"Supply Shock","parentId":"swd_drought"},
      {"id":"cot_fc","label":"CFTC Spec Positioning","type":"index","impact":4,"correlation":0.32,"sector":"Futures","parentId":"gf_futures"},
      {"id":"usda_cold_storage","label":"USDA Cold Storage Report","type":"macro","impact":4,"correlation":0.30,"sector":"Data Release","parentId":"beef_retail"},
      {"id":"aus_herd","label":"Australian Cattle Cycle","type":"regional","impact":-3,"correlation":-0.22,"sector":"International Supply","parentId":"imported_beef"},
      {"id":"plant_based","label":"Plant-Based Meat Trend","type":"substitute","impact":-2,"correlation":-0.12,"sector":"Alternative Protein","parentId":"protein_demand"},
      {"id":"usd_fc","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.25,"sector":"Forex","parentId":"beef_exports"},
      {"id":"jpy_fc","label":"Japanese Yen (JPY)","type":"fx","impact":3,"correlation":0.22,"sector":"Forex","parentId":"japan_beef"},
      {"id":"ethanol_corn","label":"Ethanol Corn Demand","type":"macro","impact":-3,"correlation":-0.20,"sector":"Corn Competition","parentId":"corn_feed"},
      {"id":"land_values","label":"Ranch Land Values","type":"macro","impact":4,"correlation":0.30,"sector":"Real Assets","parentId":"interest_rates"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Feeder cattle are weaned calves weighing 600-900 pounds that enter feedlots to be grain-finished to slaughter weight of approximately 1,300 pounds. The CME feeder cattle futures contract (GF) cash-settles against the CME Feeder Cattle Index, which aggregates auction market and direct trade prices across the US. The feeder cattle market sits at the intersection of two powerful forces: the multi-year cattle cycle that determines available supply, and corn prices that drive the cost of gain in the feedlot. With the US cattle herd near multi-decade lows following years of drought-induced liquidation, feeder cattle prices have reached historically elevated levels as tight supply meets resilient beef demand from both domestic consumers and export markets in Japan, Korea, and China.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Cow-calf ranchers are the primary beneficiaries of high feeder cattle prices, as calves are their principal revenue source. Feedlot operators face a cost squeeze -- they buy feeder cattle at elevated prices and must sell finished cattle (live cattle futures LE) at prices sufficient to cover both the purchase cost and corn-based feed expenses. Meatpackers Tyson, JBS, Cargill, and National Beef operate as the primary buyers of finished cattle, with processing margins inversely related to cattle prices. The concentration of packing capacity among four firms creates market structure tensions with cattle producers.

**Secondary -- Supply Chain and Processing:** The cattle cycle, typically spanning 8-12 years from trough to peak, is the dominant long-term price driver. Heifer retention rates signal whether the industry is in a herd-building (bullish feeders) or liquidation (bearish near-term, bullish long-term) phase. Backgrounding operations serve as an intermediate step, growing calves on forage before feedlot placement, creating a buffer that smooths seasonal supply patterns. Auction markets and sale barns provide transparent price discovery, with the CME Feeder Cattle Index aggregating these transactions. DDGS from ethanol production serve as a partial corn substitute in cattle rations.

**Tertiary -- Macro and Second-Order Effects:** Drought conditions in the Southern Plains and Southwest directly force rancher liquidation by destroying pasture and hay supplies, creating a paradox where short-term oversupply from forced selling leads to multi-year undersupply as the breeding herd shrinks. US beef export demand, particularly from Japan under favorable trade agreements, provides price support independent of domestic consumption trends. The plant-based meat movement has had minimal measurable impact on beef demand, while overall protein consumption per capita continues to rise.

## Which Companies and ETFs Benefit When the Price Rises?

Cow-calf ranchers with established herds benefit directly from elevated feeder cattle prices during tight supply phases of the cattle cycle. Ranch land values appreciate alongside cattle prices. Veterinary pharmaceutical companies like Zoetis see steady demand for animal health products across the cycle. Meatpackers benefit during periods of excess cattle supply when procurement costs decline and processing margins expand.

## Which Companies and Sectors Are Hurt by a Price Increase?

Feedlot operators face margin compression from the dual pressure of high feeder cattle purchase prices and elevated corn feed costs. Meatpackers see margins squeezed during tight cattle supply periods when they must compete aggressively for available animals. Retail beef consumers face higher prices passed through from packers. New entrants attempting to build cow-calf herds during high price periods face steep startup costs and multi-year payback timelines, with replacement heifer prices at historic premiums.

## What Should Traders Watch When Analyzing This Market?

The monthly USDA Cattle on Feed report (released on the third Friday) is the single most important data release, with cattle placements data serving as a forward indicator of feedlot supply. Monitor the feeder cattle/corn price ratio as a profitability proxy for feedlot placement decisions -- when the ratio is high, feedlots are incentivized to place aggressively. The US Drought Monitor provides weekly updates on pasture conditions that influence rancher selling decisions. Seasonal patterns show feeder cattle prices typically peaking in March-April when placements slow ahead of spring grazing season, then declining into the fall weaning season when large volumes of calves enter the market. Basis risk between CME futures and regional cash markets can be substantial, particularly in drought-affected areas where forced selling creates localized supply gluts.
