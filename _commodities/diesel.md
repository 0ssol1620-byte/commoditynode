---
layout: commodity
unit: "$/gallon"
image: "/assets/images/og-diesel.png"
title: "Diesel Price Impact: Freight, Trucking & Agriculture"
description: "Diesel price impact analysis: how diesel costs ripple through freight, trucking, logistics, and agriculture, driving consumer prices across every sector."
commodity_slug: "diesel"
symbol: "HO=F"
data_type: "direct_futures"
sector: "Energy"
etfs: ["UGA"]
companies: ["VLO", "MPC", "PSX"]
substitutes: ["Biodiesel", "Electric Trucks", "LNG"]
themes: ["Supply Chain Disruption"]
tags: ["diesel"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "diesel", "label": "Diesel (ULSD)"},
  "levels": [
    {"nodes": [
      {"id":"uga","label":"UGA Gasoline Fund (Proxy)","type":"etf","impact":7,"correlation":0.75,"sector":"Refined Products"},
      {"id":"vlo_di","label":"Valero (VLO)","type":"processor","impact":8,"correlation":0.70,"sector":"Refining"},
      {"id":"mpc_di","label":"Marathon Petro (MPC)","type":"processor","impact":8,"correlation":0.68,"sector":"Refining"},
      {"id":"psx_di","label":"Phillips 66 (PSX)","type":"processor","impact":7,"correlation":0.65,"sector":"Refining"},
      {"id":"diesel_index","label":"ULSD Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"odfl","label":"Old Dominion (ODFL)","type":"consumer","impact":-6,"correlation":-0.55,"sector":"Trucking"},
      {"id":"knx","label":"Knight-Swift (KNX)","type":"consumer","impact":-7,"correlation":-0.60,"sector":"Trucking"},
      {"id":"jbht","label":"JB Hunt (JBHT)","type":"consumer","impact":-6,"correlation":-0.52,"sector":"Trucking"},
      {"id":"ups_di","label":"UPS (UPS)","type":"consumer","impact":-5,"correlation":-0.48,"sector":"Logistics"},
      {"id":"fdx_di","label":"FedEx (FDX)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Logistics"},
      {"id":"xle_di","label":"XLE Energy ETF","type":"etf","impact":6,"correlation":0.60,"sector":"Energy"},
      {"id":"dbt_index","label":"Diesel Crack Spread","type":"index","impact":9,"correlation":0.90,"sector":"Refining Margin"}
    ]},
    {"nodes": [
      {"id":"wern","label":"Werner Enterprises (WERN)","type":"consumer","impact":-5,"correlation":-0.48,"sector":"Trucking","parentId":"knx"},
      {"id":"xpo","label":"XPO Inc (XPO)","type":"consumer","impact":-4,"correlation":-0.40,"sector":"Logistics","parentId":"odfl"},
      {"id":"r","label":"Ryder System (R)","type":"consumer","impact":-4,"correlation":-0.38,"sector":"Fleet","parentId":"jbht"},
      {"id":"pcar","label":"PACCAR (PCAR)","type":"supplier","impact":-3,"correlation":-0.30,"sector":"Trucks","parentId":"knx"},
      {"id":"cmi_di","label":"Cummins (CMI)","type":"supplier","impact":-3,"correlation":-0.28,"sector":"Diesel Engines","parentId":"pcar"},
      {"id":"de_di","label":"Deere & Co (DE)","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Agriculture","parentId":"diesel_index"},
      {"id":"agco_di","label":"AGCO Corp (AGCO)","type":"consumer","impact":-3,"correlation":-0.30,"sector":"Agriculture","parentId":"de_di"},
      {"id":"cat_di","label":"Caterpillar (CAT)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Construction","parentId":"diesel_index"},
      {"id":"uso_di","label":"USO Oil Fund","type":"etf","impact":6,"correlation":0.65,"sector":"Crude Link","parentId":"xle_di"},
      {"id":"pbf","label":"PBF Energy (PBF)","type":"processor","impact":7,"correlation":0.62,"sector":"Refining","parentId":"vlo_di"},
      {"id":"dino","label":"HF Sinclair (DINO)","type":"processor","impact":7,"correlation":0.60,"sector":"Refining","parentId":"mpc_di"},
      {"id":"renewable_diesel","label":"Renewable Diesel (REGI)","type":"processor","impact":4,"correlation":0.30,"sector":"Biodiesel","parentId":"vlo_di"}
    ]},
    {"nodes": [
      {"id":"crude_link","label":"WTI Crude (Input)","type":"commodity","impact":8,"correlation":0.85,"sector":"Energy","parentId":"uso_di"},
      {"id":"dxy_di","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.40,"sector":"Forex","parentId":"diesel_index"},
      {"id":"food_inflation","label":"Food Price Inflation","type":"macro","impact":5,"correlation":0.40,"sector":"Agriculture","parentId":"de_di"},
      {"id":"trucking_rates","label":"Trucking Spot Rates","type":"macro","impact":-6,"correlation":-0.55,"sector":"Transport","parentId":"knx"},
      {"id":"imo_regs","label":"IMO Shipping Regs","type":"policy","impact":5,"correlation":0.38,"sector":"Maritime","parentId":"diesel_index"},
      {"id":"ev_trucks","label":"Electric Trucks (Threat)","type":"substitute","impact":-3,"correlation":-0.20,"sector":"EV","parentId":"cmi_di"},
      {"id":"biodiesel_mandate","label":"Biodiesel Blend Mandate","type":"policy","impact":4,"correlation":0.30,"sector":"Regulation","parentId":"renewable_diesel"},
      {"id":"harvest_season","label":"Harvest Season Demand","type":"macro","impact":5,"correlation":0.35,"sector":"Seasonal","parentId":"de_di"},
      {"id":"construction_cycle","label":"Construction Cycle","type":"macro","impact":4,"correlation":0.30,"sector":"Construction","parentId":"cat_di"},
      {"id":"consumer_prices","label":"Consumer Price Impact","type":"macro","impact":-4,"correlation":-0.35,"sector":"Inflation","parentId":"food_inflation"},
      {"id":"lng_trucks","label":"LNG Trucks (Substitute)","type":"substitute","impact":-3,"correlation":-0.18,"sector":"Alternative Fuel","parentId":"cmi_di"}
    ]},
    {"nodes": [
      {"id":"crack_spread_seasonal","label":"Seasonal Crack Spreads","type":"macro","impact":6,"correlation":0.55,"sector":"Refining","parentId":"dbt_index"},
      {"id":"refinery_utilization","label":"Refinery Utilization","type":"macro","impact":5,"correlation":0.45,"sector":"Supply","parentId":"vlo_di"},
      {"id":"opec_impact","label":"OPEC+ Impact on Crude","type":"policy","impact":6,"correlation":0.48,"sector":"Supply Policy","parentId":"crude_link"},
      {"id":"winter_diesel","label":"Winter Diesel Premium","type":"commodity","impact":5,"correlation":0.42,"sector":"Seasonal","parentId":"diesel_index"},
      {"id":"sulfur_regs","label":"Sulfur Content Regs","type":"policy","impact":4,"correlation":0.30,"sector":"Regulation","parentId":"imo_regs"},
      {"id":"inventory_data","label":"EIA Distillate Data","type":"macro","impact":6,"correlation":0.50,"sector":"Data Release","parentId":"diesel_index"},
      {"id":"last_mile","label":"Last-Mile Delivery","type":"consumer","impact":-3,"correlation":-0.25,"sector":"E-commerce","parentId":"ups_di"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Diesel fuel powers the backbone of the global economy -- trucking, rail, marine shipping, and agricultural equipment all run on distillate fuel. Unlike gasoline, which is primarily a consumer product, diesel demand is a direct proxy for economic activity and freight volumes. The diesel crack spread (the difference between diesel and crude oil prices) reflects refinery economics and is a critical indicator of downstream energy sector profitability. U.S. diesel consumption alone exceeds 4 million barrels per day, and global distillate demand continues to grow with industrial activity and freight movement.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Trucking companies consume approximately 35 billion gallons of diesel annually in the U.S. alone. Fuel surcharges allow carriers to partially pass through diesel cost increases, but small fleet operators and owner-operators face acute margin pressure during price spikes. Valero, Marathon Petroleum, and Phillips 66 profit from elevated crack spreads, as their refining margins expand when diesel demand outpaces supply. Railroad operators (Union Pacific, BNSF) and marine shipping companies also face significant diesel-equivalent fuel exposure.

**Secondary -- Supply Chain and Processing:** Farm equipment -- tractors, combines, irrigation pumps -- runs almost entirely on diesel. A sustained $1/gallon increase in diesel prices adds approximately $30,000-50,000 in annual operating costs for a mid-size farming operation. This cost pressure flows through to food prices with a 3-6 month lag, making diesel a leading indicator of agricultural inflation. Construction equipment and mining operations represent additional heavy-diesel demand segments where electrification alternatives remain years away from commercial viability.

**Tertiary -- Macro and Second-Order Effects:** Diesel and heating oil are chemically similar distillate products, creating seasonal demand overlap in the U.S. Northeast during winter months. Industrial diesel generators provide backup power and primary electricity in developing markets. The transition to biodiesel blending (B5, B20 mandates) is gradually shifting the demand mix but remains a small percentage of total consumption. Diesel prices function as a broad economic tax -- when prices spike, shipping costs rise across every product category, contributing to goods inflation throughout the economy.

## Which Companies and ETFs Benefit When the Price Rises?

Refiners with high distillate yield configurations capture outsized margins when diesel cracks widen. Valero (VLO), Marathon Petroleum (MPC), and Phillips 66 (PSX) benefit most among U.S. refiners. Biodiesel producers gain competitive advantage as conventional diesel prices rise, improving the economics of renewable alternatives. Trucking companies with fuel surcharge mechanisms effectively pass through cost increases to shippers, maintaining margin neutrality during price rallies.

## Which Companies and Sectors Are Hurt by a Price Increase?

Owner-operators and small trucking fleets without fuel surcharge contracts absorb cost increases directly, facing potential insolvency during prolonged spikes. E-commerce companies and retailers bear higher shipping costs that compress delivery margins. Farmers face rising operating costs that may not be recoverable through crop prices. Consumers ultimately pay through higher goods prices across nearly every category, as diesel touches every link in the physical supply chain.

## What Should Traders Watch When Analyzing This Market?

The ULSD (ultra-low sulfur diesel) crack spread on NYMEX is the primary profitability indicator for refiners. Monitor refinery utilization rates (typically 90-95% during peak demand), distillate inventory levels from the EIA weekly petroleum status report, and trucking freight indices (DAT, Cass) for demand signals. Seasonal tightness typically peaks in Q4 when heating oil demand overlaps with agricultural harvest diesel consumption. The diesel/gasoline crack spread ratio indicates relative product economics and refinery optimization incentives.
