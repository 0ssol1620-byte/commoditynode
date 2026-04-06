---
layout: commodity
image: "/assets/images/og-ammonia.png"
title: "Ammonia Price Impact: Fertilizers, Stocks & ETFs"
description: "How ammonia (NH3) price movements ripple through nitrogen fertilizers, natural gas markets, and green hydrogen."
commodity_slug: "ammonia"
symbol: "CF"
sector: "Agriculture/Chemicals"
etfs: ["MOO", "XLB"]
companies: ["CF", "NTR"]
substitutes: ["Organic Nitrogen", "Urea", "Ammonium Nitrate"]
themes: ["Clean Energy", "Food Security"]
tags: [ammonia, commodity analysis, fertilizer, green hydrogen]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "ammonia", "label": "Ammonia (NH3)"},
  "levels": [
    {"nodes": [
      {"id":"cf","label":"CF Industries (CF)","type":"producer","impact":10,"correlation":0.92,"sector":"Nitrogen Fertilizer"},
      {"id":"ntr","label":"Nutrien (NTR)","type":"producer","impact":7,"correlation":0.75,"sector":"Fertilizer"},
      {"id":"uan","label":"CVR Partners (UAN)","type":"producer","impact":11,"correlation":0.90,"sector":"Nitrogen Fertilizer"},
      {"id":"lsb","label":"LSB Industries (LXU)","type":"producer","impact":10,"correlation":0.88,"sector":"Nitrogen Fertilizer"},
      {"id":"oci","label":"OCI NV (OCI)","type":"producer","impact":8,"correlation":0.82,"sector":"Nitrogen Fertilizer"},
      {"id":"moo","label":"MOO Agribusiness ETF","type":"etf","impact":5,"correlation":0.55,"sector":"Agriculture"},
      {"id":"xlb","label":"XLB Materials ETF","type":"etf","impact":4,"correlation":0.45,"sector":"Materials"},
      {"id":"natgas","label":"Natural Gas (NG=F)","type":"commodity","impact":9,"correlation":0.85,"sector":"Energy"},
      {"id":"urea_market","label":"Urea Market","type":"commodity","impact":9,"correlation":0.90,"sector":"Fertilizer"},
      {"id":"corn_futures","label":"Corn Futures (ZC)","type":"commodity","impact":6,"correlation":0.55,"sector":"Grains"},
      {"id":"green_h2","label":"Green Hydrogen Index","type":"index","impact":5,"correlation":0.35,"sector":"Clean Energy"},
      {"id":"yara","label":"Yara International (YAR.OL)","type":"producer","impact":8,"correlation":0.80,"sector":"Nitrogen Fertilizer"},
      {"id":"mideast_prod","label":"Middle East Producers","type":"regional","impact":8,"correlation":0.72,"sector":"Low-Cost Supply"}
    ]},
    {"nodes": [
      {"id":"sabic","label":"SABIC (2010.SR)","type":"producer","impact":6,"correlation":0.60,"sector":"Petrochemicals","parentId":"mideast_prod"},
      {"id":"qafco","label":"QAFCO (Qatar)","type":"regional","impact":7,"correlation":0.65,"sector":"Middle East","parentId":"mideast_prod"},
      {"id":"henry_hub","label":"Henry Hub Natgas","type":"commodity","impact":8,"correlation":0.82,"sector":"Energy","parentId":"natgas"},
      {"id":"ttf_gas","label":"TTF European Gas","type":"commodity","impact":9,"correlation":0.88,"sector":"Energy","parentId":"natgas"},
      {"id":"eu_shutdowns","label":"European Plant Shutdowns","type":"macro","impact":10,"correlation":0.75,"sector":"Supply Disruption","parentId":"yara"},
      {"id":"an_market","label":"Ammonium Nitrate (AN)","type":"commodity","impact":8,"correlation":0.85,"sector":"Fertilizer","parentId":"urea_market"},
      {"id":"uas_market","label":"UAN Solutions Market","type":"commodity","impact":8,"correlation":0.88,"sector":"Fertilizer","parentId":"urea_market"},
      {"id":"adm","label":"Archer-Daniels (ADM)","type":"consumer","impact":4,"correlation":0.40,"sector":"Agribusiness","parentId":"moo"},
      {"id":"de","label":"Deere & Co (DE)","type":"consumer","impact":4,"correlation":0.45,"sector":"Farm Equipment","parentId":"moo"},
      {"id":"wheat_futures","label":"Wheat Futures (ZW)","type":"commodity","impact":5,"correlation":0.50,"sector":"Grains","parentId":"corn_futures"},
      {"id":"plug","label":"Plug Power (PLUG)","type":"producer","impact":4,"correlation":0.30,"sector":"Green Hydrogen","parentId":"green_h2"},
      {"id":"fcel","label":"FuelCell Energy (FCEL)","type":"producer","impact":3,"correlation":0.25,"sector":"Fuel Cells","parentId":"green_h2"}
    ]},
    {"nodes": [
      {"id":"shipping_fuel","label":"Ammonia Shipping Fuel","type":"commodity","impact":4,"correlation":0.28,"sector":"Maritime","parentId":"green_h2"},
      {"id":"food_inflation","label":"Food CPI Index","type":"macro","impact":-6,"correlation":-0.48,"sector":"Macro","parentId":"wheat_futures"},
      {"id":"farm_margin","label":"US Farm Margins","type":"macro","impact":-5,"correlation":-0.42,"sector":"Agriculture","parentId":"adm"},
      {"id":"china_urea","label":"China Urea Exports","type":"regional","impact":7,"correlation":0.60,"sector":"Asian Supply","parentId":"urea_market"},
      {"id":"india_demand","label":"India Nitrogen Demand","type":"regional","impact":6,"correlation":0.50,"sector":"Asian Demand","parentId":"an_market"},
      {"id":"basf","label":"BASF (BAS.DE)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Chemicals","parentId":"eu_shutdowns"},
      {"id":"russia_supply","label":"Russia Nitrogen Exports","type":"regional","impact":8,"correlation":0.65,"sector":"Russian Supply","parentId":"eu_shutdowns"},
      {"id":"lng_comp","label":"LNG Competition","type":"commodity","impact":5,"correlation":0.55,"sector":"Energy","parentId":"ttf_gas"},
      {"id":"brazil_demand","label":"Brazil Nitrogen Demand","type":"regional","impact":6,"correlation":0.48,"sector":"LatAm","parentId":"corn_futures"},
      {"id":"be","label":"Bloom Energy (BE)","type":"producer","impact":3,"correlation":0.22,"sector":"Clean Energy","parentId":"plug"},
      {"id":"organic_n","label":"Organic Nitrogen","type":"substitute","impact":-2,"correlation":-0.12,"sector":"Alternatives","parentId":"farm_margin"}
    ]},
    {"nodes": [
      {"id":"imo_regs","label":"IMO Shipping Regulations","type":"policy","impact":4,"correlation":0.25,"sector":"Maritime Policy","parentId":"shipping_fuel"},
      {"id":"usd_ammonia","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.38,"sector":"Forex","parentId":"henry_hub"},
      {"id":"eur_fx","label":"Euro (EUR/USD)","type":"fx","impact":3,"correlation":0.30,"sector":"Forex","parentId":"ttf_gas"},
      {"id":"china_export_ban","label":"China Export Restrictions","type":"policy","impact":8,"correlation":0.55,"sector":"Trade Policy","parentId":"china_urea"},
      {"id":"india_subsidy","label":"India Urea Subsidy","type":"policy","impact":6,"correlation":0.42,"sector":"Gov Policy","parentId":"india_demand"},
      {"id":"fao_index","label":"FAO Food Price Index","type":"index","impact":5,"correlation":0.45,"sector":"Global Food","parentId":"food_inflation"},
      {"id":"us_ethanol","label":"US Ethanol Mandate","type":"policy","impact":4,"correlation":0.35,"sector":"Biofuels","parentId":"corn_futures"},
      {"id":"carbon_price","label":"EU Carbon Price (EUA)","type":"commodity","impact":5,"correlation":0.40,"sector":"Emissions","parentId":"basf"},
      {"id":"bdi_freight","label":"Baltic Dry Index (BDI)","type":"freight","impact":4,"correlation":0.30,"sector":"Shipping","parentId":"shipping_fuel"},
      {"id":"an_substitute","label":"Ammonium Nitrate Sub","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Alternatives","parentId":"organic_n"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Ammonia (NH3) is the world's most-produced inorganic chemical at roughly 180 million tonnes annually -- and 80% of it goes directly into nitrogen fertilizers that underpin global food production. The Haber-Bosch process consumes natural gas as both feedstock and fuel, making ammonia prices structurally tethered to gas markets: a **+10% move in Henry Hub** typically drives **+7-9% in CF Industries** within 30 days. Beyond fertilizer, ammonia is emerging as a zero-carbon fuel for maritime shipping and a hydrogen carrier for long-distance clean energy transport. European producers like Yara and BASF face existential cost disadvantage when TTF gas prices spike, creating a two-tier global cost structure where Middle Eastern and U.S. Gulf Coast producers operate at $150-200/tonne while European plants see costs exceed $600/tonne.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** CF Industries, the largest publicly traded nitrogen producer, operates low-cost plants on U.S. Gulf Coast natural gas and captures the full spread between Henry Hub-linked costs and global ammonia prices. CVR Partners (UAN) and LSB Industries offer higher-beta exposure with smaller scale and less hedging. Yara International and OCI NV provide global diversification. These companies exhibit operating leverage of 2-3x on ammonia price moves above cash cost, making earnings highly volatile in both directions.

**Secondary -- Supply Chain and Processing:** The ammonia-urea-UAN chain represents a tightly coupled value system. Ammonia is the base molecule from which urea, ammonium nitrate, and UAN solutions are manufactured, so price moves cascade through the derivative products with 85-90% correlation. European plant shutdowns during the 2022 gas crisis removed 15-20% of European nitrogen capacity, redirecting global trade flows toward Middle Eastern and North African exports. China's periodic urea export restrictions (designed to protect domestic food security) can remove 5-10 million tonnes from global markets within weeks, triggering price spikes.

**Tertiary -- Macro and Second-Order Effects:** Ammonia costs feed into corn, wheat, and rice production economics with a one-season lag. When nitrogen fertilizer prices doubled in 2022, U.S. farmers reduced application rates by 10-15%, contributing to lower yields and higher grain prices. The green ammonia opportunity -- producing NH3 via electrolysis-powered hydrogen instead of natural gas -- could reshape the cost curve by the 2030s. Companies like Plug Power and FuelCell Energy are piloting green ammonia plants, while the IMO's tightening emissions standards position ammonia as a leading candidate for zero-carbon shipping fuel.

## Which Companies and ETFs Benefit When the Price Rises?

U.S. Gulf Coast nitrogen producers with locked-in Henry Hub gas supply benefit most when global ammonia prices rise on international gas spikes. Middle Eastern producers (SABIC, QAFCO) enjoy structurally low feedstock costs at $1-2/MMBtu. Green hydrogen companies see accelerated investment timelines as conventional ammonia becomes expensive. Agricultural equipment makers benefit indirectly as high crop prices incentivize planting expansion.

## Which Companies and Sectors Are Hurt by a Price Increase?

European chemical producers face margin destruction and forced curtailments when TTF gas prices spike. Import-dependent nations -- India, Brazil, and Sub-Saharan Africa -- absorb higher nitrogen costs that directly reduce crop yields and exacerbate food insecurity. Farmers operating on thin margins face a squeeze between rising input costs and uncertain crop prices. Livestock producers see feed cost inflation as grain prices respond to reduced fertilizer application.

## What Should Traders Watch When Analyzing This Market?

The CF Industries-to-natural gas ratio is the key mean-reverting signal for ammonia equities: when CF/NG exceeds 2 standard deviations above the 5-year mean, nitrogen producer margins are peaking. The TTF-Henry Hub gas spread directly predicts European plant shutdowns -- margins turn negative for Yara when TTF exceeds $30/MMBtu equivalent. USDA quarterly grain stocks reports and China's fertilizer export license announcements are the primary demand-side catalysts. The Tampa CFR ammonia benchmark, settled monthly between Yara and Mosaic, sets the global reference price and moves the entire nitrogen complex.
