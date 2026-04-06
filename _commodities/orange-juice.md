---
layout: commodity
unit: "cents/lb"
image: "/assets/images/og-coffee.png"
title: "Orange Juice Price Impact: Citrus Supply, Weather Risk & ETFs"
description: "How FCOJ futures ripple through beverage companies, Florida agriculture, Brazilian exports, and vitamin supplement markets."
commodity_slug: "orange-juice"
symbol: "OJ=F"
sector: "Agriculture"
etfs: ["JJA", "DBA"]
companies: ["PEP"]
substitutes: ["Apple Juice", "Other Citrus", "Vitamin Supplements"]
themes: []
tags: [orange juice, commodity analysis, citrus, beverages]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "orange_juice", "label": "Orange Juice FCOJ (OJ=F)"},
  "levels": [
    {"nodes": [
      {"id":"jja","label":"JJA Agriculture ETN","type":"etf","impact":5,"correlation":0.48,"sector":"Agriculture"},
      {"id":"dba_oj","label":"DBA Agri Fund","type":"etf","impact":4,"correlation":0.35,"sector":"Agriculture"},
      {"id":"pep","label":"PepsiCo (PEP)","type":"consumer","impact":-5,"correlation":-0.42,"sector":"Beverages"},
      {"id":"ko","label":"Coca-Cola (KO)","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Beverages"},
      {"id":"mnst","label":"Monster Beverage (MNST)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Beverages"},
      {"id":"brazil_prod","label":"Brazil Production (60%+)","type":"regional","impact":10,"correlation":0.88,"sector":"South America"},
      {"id":"florida_prod","label":"Florida Citrus Production","type":"regional","impact":9,"correlation":0.85,"sector":"US Agriculture"},
      {"id":"hlb_disease","label":"Citrus Greening (HLB)","type":"macro","impact":10,"correlation":0.75,"sector":"Crop Disease"},
      {"id":"oj_index","label":"FCOJ Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"hurricane","label":"Hurricane Season Risk","type":"macro","impact":9,"correlation":0.65,"sector":"Weather"},
      {"id":"cutrale","label":"Cutrale Group (Private)","type":"processor","impact":8,"correlation":0.72,"sector":"Citrus Processing"},
      {"id":"citrosuco","label":"Citrosuco (Private)","type":"processor","impact":7,"correlation":0.68,"sector":"Citrus Processing"},
      {"id":"grocery_bev","label":"Grocery Beverage Aisle","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Retail"},
      {"id":"vitc_demand","label":"Vitamin C Supplement Demand","type":"substitute","impact":4,"correlation":0.38,"sector":"Health Supplements"}
    ]},
    {"nodes": [
      {"id":"tropicana","label":"Tropicana (PEP Brand)","type":"consumer","impact":-7,"correlation":-0.60,"sector":"Juice Brands","parentId":"pep"},
      {"id":"mmaid","label":"Minute Maid (KO Brand)","type":"consumer","impact":-6,"correlation":-0.55,"sector":"Juice Brands","parentId":"ko"},
      {"id":"stz","label":"Constellation Brands (STZ)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Beverages","parentId":"ko"},
      {"id":"brl","label":"Brazilian Real (BRL)","type":"fx","impact":6,"correlation":0.52,"sector":"Forex","parentId":"brazil_prod"},
      {"id":"sao_paulo","label":"Sao Paulo State Farms","type":"regional","impact":9,"correlation":0.82,"sector":"Brazil Citrus","parentId":"brazil_prod"},
      {"id":"fl_land","label":"Florida Farmland Values","type":"regional","impact":7,"correlation":0.58,"sector":"Real Estate","parentId":"florida_prod"},
      {"id":"fmc_oj","label":"FMC Corp (FMC)","type":"supplier","impact":4,"correlation":0.35,"sector":"Crop Protection","parentId":"hlb_disease"},
      {"id":"ctva","label":"Corteva (CTVA)","type":"supplier","impact":4,"correlation":0.32,"sector":"Crop Protection","parentId":"hlb_disease"},
      {"id":"wmt_oj","label":"Walmart (WMT)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Grocery Retail","parentId":"grocery_bev"},
      {"id":"kr_oj","label":"Kroger (KR)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Grocery Retail","parentId":"grocery_bev"},
      {"id":"cost_oj","label":"Costco (COST)","type":"consumer","impact":-2,"correlation":-0.20,"sector":"Grocery Retail","parentId":"grocery_bev"},
      {"id":"nbi","label":"NBI Supplements Index","type":"substitute","impact":3,"correlation":0.30,"sector":"Health Supplements","parentId":"vitc_demand"}
    ]},
    {"nodes": [
      {"id":"apple_sub","label":"Apple Juice (Substitute)","type":"substitute","impact":-4,"correlation":-0.30,"sector":"Fruit Juices","parentId":"oj_index"},
      {"id":"citrus_sub","label":"Other Citrus (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Fruit Juices","parentId":"oj_index"},
      {"id":"vita_sub","label":"Vitamin Supplements (Sub)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Health Products","parentId":"nbi"},
      {"id":"ice_exchange","label":"ICE Exchange Volume","type":"macro","impact":5,"correlation":0.45,"sector":"Market Structure","parentId":"oj_index"},
      {"id":"de_oj","label":"Deere & Co (DE)","type":"supplier","impact":3,"correlation":0.25,"sector":"Farm Equipment","parentId":"fl_land"},
      {"id":"lnn","label":"Lindsay Corp (LNN)","type":"supplier","impact":3,"correlation":0.28,"sector":"Irrigation","parentId":"fl_land"},
      {"id":"shipping_oj","label":"Reefer Shipping Rates","type":"freight","impact":5,"correlation":0.42,"sector":"Cold Chain","parentId":"citrosuco"},
      {"id":"mexico_prod","label":"Mexico Citrus Exports","type":"regional","impact":5,"correlation":0.45,"sector":"North America","parentId":"sao_paulo"},
      {"id":"usd_oj","label":"US Dollar (DXY)","type":"fx","impact":-5,"correlation":-0.42,"sector":"Forex","parentId":"brl"},
      {"id":"climate_shift","label":"Climate Change Risk","type":"macro","impact":7,"correlation":0.50,"sector":"Long-Term Trends","parentId":"hurricane"},
      {"id":"fl_hurricane","label":"FL Hurricane Damage","type":"macro","impact":9,"correlation":0.68,"sector":"Natural Disaster","parentId":"hurricane"}
    ]},
    {"nodes": [
      {"id":"usda_citrus","label":"USDA Citrus Report","type":"macro","impact":7,"correlation":0.55,"sector":"Data Releases","parentId":"oj_index"},
      {"id":"brazil_frost","label":"Brazil Frost Risk","type":"macro","impact":8,"correlation":0.62,"sector":"Weather","parentId":"sao_paulo"},
      {"id":"fema_aid","label":"FEMA Disaster Aid (FL)","type":"policy","impact":4,"correlation":0.30,"sector":"Gov Policy","parentId":"fl_hurricane"},
      {"id":"brazil_trade","label":"Brazil Trade Policy","type":"policy","impact":5,"correlation":0.40,"sector":"Trade Policy","parentId":"brl"},
      {"id":"fda_labeling","label":"FDA Juice Labeling Rules","type":"policy","impact":3,"correlation":0.22,"sector":"Regulation","parentId":"tropicana"},
      {"id":"sugar_oj","label":"Sugar Price Correlation","type":"commodity","impact":4,"correlation":0.38,"sector":"Agriculture","parentId":"brazil_trade"},
      {"id":"cold_chain","label":"Cold Storage Capacity","type":"freight","impact":4,"correlation":0.35,"sector":"Logistics","parentId":"shipping_oj"},
      {"id":"hlb_research","label":"HLB Disease Research","type":"policy","impact":5,"correlation":0.35,"sector":"Agri R&D","parentId":"hlb_disease"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Frozen concentrated orange juice (FCOJ) is one of the most volatile soft commodities, driven by an unusually concentrated supply base and persistent biological threats. Brazil's Sao Paulo state produces over 60% of the world's orange juice, while Florida -- once the dominant U.S. source -- has seen production collapse by over 75% since 2004 due to citrus greening disease (Huanglongbing/HLB) and successive hurricanes. FCOJ futures have surged past **$5.00/lb in 2024-2025**, levels previously unimaginable, as the global citrus crop faces structural decline. A **+10% move in OJ futures** compresses margins at Tropicana (PepsiCo) and Minute Maid (Coca-Cola) by an estimated 3-5%, forcing either retail price increases or reformulation with cheaper juices. The market trades on ICE with moderate liquidity, making it responsive to weather headlines and USDA crop reports.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Beverage Companies and Processors:** PepsiCo's Tropicana and Coca-Cola's Minute Maid are the two largest branded OJ buyers in the world. Brazilian processors Cutrale and Citrosuco control an estimated 50%+ of global FCOJ processing capacity, giving them significant pricing power. Monster Beverage and Constellation Brands face secondary exposure through citrus-flavored product lines. When OJ prices spike, beverage companies face the choice of absorbing costs, raising shelf prices, or quietly reducing juice content percentages.

**Secondary -- Agriculture and Supply Chain:** Citrus greening disease has made crop protection chemicals from FMC and Corteva essential for surviving groves. Florida farmland values reflect the long-term viability of citrus cultivation, with many growers converting acreage to residential development or solar farms. Reefer (refrigerated) shipping rates on the Brazil-to-U.S./Europe lanes directly affect delivered OJ costs. Irrigation technology from Lindsay Corp supports the water-intensive citrus growing process. Mexico has emerged as a growing alternative supplier, though volumes remain small relative to Brazil.

**Tertiary -- Weather, Disease, and Substitution:** Hurricane season (June-November) poses catastrophic risk to Florida's remaining citrus groves -- Hurricane Ian (2022) alone destroyed an estimated 10-15% of the surviving crop. Brazilian frost events in July-August can damage the Sao Paulo citrus belt and trigger 20%+ single-day price spikes. Consumer substitution into apple juice, other citrus beverages, and vitamin C supplements accelerates when OJ prices remain elevated. The Brazilian Real exchange rate affects export competitiveness -- a weaker BRL reduces dollar-denominated OJ costs for importers.

## Which Companies and ETFs Benefit When the Price Rises?

Brazilian processors Cutrale and Citrosuco benefit from pricing power in a supply-constrained market. Surviving Florida growers with healthy trees enjoy premium pricing. Crop protection companies (FMC, Corteva) see demand for HLB management chemicals. Apple juice and alternative beverage producers gain market share through substitution. Vitamin supplement makers capture consumers seeking cheaper vitamin C sources than orange juice.

## Which Companies and Sectors Are Hurt by a Price Increase?

PepsiCo and Coca-Cola face persistent input cost inflation on their juice brands, with limited ability to pass through the full increase without destroying demand. Grocery retailers absorb margin pressure on juice aisle products. Florida's citrus industry faces existential decline -- the state's orange production has fallen from 240 million boxes (1998) to under 20 million. Consumers pay record retail prices for orange juice, accelerating the long-term shift away from juice consumption among health-conscious buyers concerned about sugar content.

## What Should Traders Watch When Analyzing This Market?

FCOJ futures trade on ICE with open interest typically between 10,000-20,000 contracts -- thin by agricultural commodity standards. The USDA Citrus Crop Production Report (monthly during season) is the primary data catalyst. Monitor Brazilian weather services (INMET) for frost warnings during the June-August Sao Paulo winter. Hurricane track forecasts from the National Hurricane Center drive intraday volatility during storm season. The JJA and DBA ETFs provide minimal OJ-specific exposure. For equity proxies, PEP and KO offer modest inverse correlation -- but juice is a small fraction of their total revenue, diluting the signal. The structural supply deficit from citrus greening means the long-term price trend remains upward until a disease cure or significant new planting regions emerge.
