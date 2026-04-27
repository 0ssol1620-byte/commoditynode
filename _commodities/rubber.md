---
layout: commodity
unit: "cents/lb"
image: "/assets/images/og-rubber.png"
title: "Rubber Price Impact: Auto, Tires & Industrial Supply Chain"
description: "Natural rubber's tire industry dominance, Southeast Asian supply concentration, and synthetic substitution dynamics."
commodity_slug: "rubber"
symbol: "GT"
data_type: "proxy"
sector: "Agriculture/Industrial"
etfs: ["DBA", "MOO"]
companies: ["GT", "BRDCY"]
substitutes: ["Synthetic Rubber", "Silicone", "Recycled Rubber"]
themes: ["EV Transition", "Emerging Markets"]
tags: [rubber, tires, agriculture, southeast asia, automotive, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "rubber", "label": "Natural Rubber"},
  "levels": [
    {"nodes": [
      {"id":"gt_rb","label":"Goodyear Tire (GT)","type":"consumer","impact":-6,"correlation":-0.55,"sector":"Tires"},
      {"id":"mgddy_rb","label":"Michelin (MGDDY)","type":"consumer","impact":-6,"correlation":-0.52,"sector":"Tires"},
      {"id":"brdcy_rb","label":"Bridgestone (BRDCY)","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Tires"},
      {"id":"ctb_rb","label":"Cooper Tire (CTB)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Tires"},
      {"id":"dba_rb","label":"DBA Agriculture ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Agriculture"},
      {"id":"moo_rb","label":"MOO Agribusiness ETF","type":"etf","impact":3,"correlation":0.28,"sector":"Agribusiness"},
      {"id":"rb_index","label":"TSR20 Rubber Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"gm_rb","label":"General Motors (GM)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Automotive"},
      {"id":"f_rb","label":"Ford Motor (F)","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Automotive"},
      {"id":"tm_rb","label":"Toyota Motor (TM)","type":"consumer","impact":-3,"correlation":-0.18,"sector":"Automotive"},
      {"id":"lyb_rb","label":"LyondellBasell (LYB)","type":"producer","impact":5,"correlation":0.40,"sector":"Synthetic Rubber"},
      {"id":"crude_rb","label":"Crude Oil (CL)","type":"commodity","impact":5,"correlation":0.45,"sector":"Energy"},
      {"id":"thb_rb","label":"Thai Baht (THB)","type":"fx","impact":-4,"correlation":-0.38,"sector":"Forex"}
    ]},
    {"nodes": [
      {"id":"thai_prod","label":"Thailand Production (35%)","type":"regional","impact":8,"correlation":0.70,"sector":"SE Asia","parentId":"rb_index"},
      {"id":"indo_prod","label":"Indonesia Production (25%)","type":"regional","impact":7,"correlation":0.60,"sector":"SE Asia","parentId":"rb_index"},
      {"id":"viet_prod","label":"Vietnam Production (8%)","type":"regional","impact":5,"correlation":0.42,"sector":"SE Asia","parentId":"rb_index"},
      {"id":"synth_sub","label":"Synthetic Rubber (SBR)","type":"substitute","impact":-5,"correlation":-0.40,"sector":"Petrochemicals","parentId":"lyb_rb"},
      {"id":"latex_proc","label":"Latex Processing","type":"processor","impact":5,"correlation":0.38,"sector":"Processing","parentId":"rb_index"},
      {"id":"bwa_rb","label":"BorgWarner (BWA)","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Auto Parts","parentId":"gm_rb"},
      {"id":"cat_rb","label":"Caterpillar (CAT)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Construction","parentId":"rb_index"},
      {"id":"de_rb","label":"Deere & Co (DE)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Agriculture Equip","parentId":"rb_index"},
      {"id":"glove_rb","label":"Medical Glove Makers","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Healthcare","parentId":"latex_proc"},
      {"id":"idr_rb","label":"Indonesian Rupiah (IDR)","type":"fx","impact":-3,"correlation":-0.30,"sector":"Forex","parentId":"indo_prod"},
      {"id":"butadiene","label":"Butadiene (Synth Input)","type":"commodity","impact":4,"correlation":0.38,"sector":"Petrochemicals","parentId":"crude_rb"},
      {"id":"recycled_rb","label":"Recycled Rubber","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Recycling","parentId":"rb_index"}
    ]},
    {"nodes": [
      {"id":"monsoon_rb","label":"Monsoon Weather Impact","type":"macro","impact":6,"correlation":0.45,"sector":"Weather","parentId":"thai_prod"},
      {"id":"leaf_blight","label":"Leaf Blight Disease Risk","type":"macro","impact":7,"correlation":0.50,"sector":"Agriculture","parentId":"thai_prod"},
      {"id":"smallholder","label":"Smallholder Farmer Supply","type":"regional","impact":6,"correlation":0.42,"sector":"Agriculture","parentId":"indo_prod"},
      {"id":"china_auto","label":"China Auto Demand","type":"macro","impact":5,"correlation":0.38,"sector":"Automotive","parentId":"tm_rb"},
      {"id":"tire_replace","label":"Tire Replacement Cycle","type":"macro","impact":4,"correlation":0.30,"sector":"Aftermarket","parentId":"gt_rb"},
      {"id":"tglvy_rb","label":"Top Glove (TGLVY)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Gloves","parentId":"glove_rb"},
      {"id":"harly_rb","label":"Hartalega (HARTY)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Gloves","parentId":"glove_rb"},
      {"id":"constr_tire","label":"Construction OTR Tires","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Off-Road","parentId":"cat_rb"},
      {"id":"lanxess_rb","label":"Lanxess (LNXSF)","type":"producer","impact":4,"correlation":0.32,"sector":"Synthetic Rubber","parentId":"synth_sub"},
      {"id":"exxon_rb","label":"ExxonMobil Butyl (XOM)","type":"producer","impact":3,"correlation":0.25,"sector":"Synthetic Rubber","parentId":"butadiene"},
      {"id":"sicom_rb","label":"SICOM Futures (SGX)","type":"index","impact":8,"correlation":0.90,"sector":"Futures","parentId":"rb_index"}
    ]},
    {"nodes": [
      {"id":"enso_rb","label":"El Nino/La Nina Cycle","type":"macro","impact":5,"correlation":0.38,"sector":"Weather","parentId":"monsoon_rb"},
      {"id":"thai_policy","label":"Thai Rubber Price Support","type":"policy","impact":4,"correlation":0.30,"sector":"Policy","parentId":"thai_prod"},
      {"id":"irsg_rb","label":"IRSG Supply Forecast","type":"macro","impact":4,"correlation":0.28,"sector":"Industry Body","parentId":"rb_index"},
      {"id":"ev_tire","label":"EV Tire Demand (Heavier)","type":"macro","impact":4,"correlation":0.30,"sector":"EV","parentId":"tire_replace"},
      {"id":"africa_rb","label":"African Rubber Expansion","type":"regional","impact":-3,"correlation":-0.20,"sector":"New Supply","parentId":"smallholder"},
      {"id":"guayule","label":"Guayule Alt Rubber","type":"substitute","impact":-2,"correlation":-0.15,"sector":"Bio-Rubber","parentId":"recycled_rb"},
      {"id":"dandelion_rb","label":"Dandelion Rubber (TKS)","type":"substitute","impact":-2,"correlation":-0.12,"sector":"Bio-Rubber","parentId":"recycled_rb"},
      {"id":"truck_tire","label":"Commercial Truck Tire Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Transport","parentId":"tire_replace"},
      {"id":"airline_tire","label":"Aviation Tire Demand","type":"consumer","impact":2,"correlation":0.15,"sector":"Aviation","parentId":"constr_tire"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Natural rubber is a critical agricultural commodity produced from the latex of Hevea brasiliensis rubber trees, with global output of approximately 14 million tonnes annually. Southeast Asia dominates production: Thailand (35%), Indonesia (25%), and Vietnam (8%) collectively account for nearly 70% of world supply, mostly from smallholder farms with trees requiring seven years to reach maturity. Tires consume over 70% of natural rubber production, making the auto industry the primary demand driver. Unlike many commodities, natural rubber cannot be fully replaced by synthetic alternatives (made from petroleum-derived butadiene) in high-performance applications -- truck tires, aircraft tires, and heavy equipment tires require natural rubber's superior elasticity and heat resistance. The SICOM contract on Singapore Exchange and TOCOM in Tokyo are the primary pricing benchmarks.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Goodyear (GT), Michelin (MGDDY), and Bridgestone (BRDCY) are the world's largest tire manufacturers and the most direct beneficiaries or victims of rubber price movements. Raw material costs represent 30-40% of tire production expenses, with natural rubber the single largest input. Auto OEMs -- GM, Ford, Toyota -- face indirect exposure through original equipment tire pricing and replacement market dynamics. LyondellBasell (LYB) and Lanxess (LNXSF) produce synthetic rubber (styrene-butadiene rubber, polybutadiene) that competes with natural rubber in passenger tire applications.

**Secondary -- Supply Chain and Processing:** Thailand's smallholder-dominated production structure means supply responds slowly to price signals, as tapping decisions are made by millions of individual farmers. Latex processing facilities concentrate in southern Thailand and Sumatra, creating logistics bottlenecks during harvest season. Medical glove manufacturers -- Top Glove, Hartalega -- consume concentrated latex and experienced extreme demand shocks during the pandemic, temporarily competing with tire makers for feedstock. The Thai government periodically intervenes with price support programs and export controls, adding policy-driven supply variability.

**Tertiary -- Macro and Second-Order Effects:** Monsoon patterns directly affect tapping seasons, with heavy rains halting latex collection for months during wintering periods. South American Leaf Blight (SALB) remains the rubber industry's greatest biological threat -- if the fungus ever reaches Southeast Asian plantations, the impact on global supply would be catastrophic. Electric vehicles are an emerging positive for rubber demand, as EVs weigh 20-30% more than equivalent ICE vehicles, increasing tire wear rates and replacement frequency. Alternative rubber sources including guayule (desert shrub) and Russian dandelion (TKS) are in pilot stages but remain decades from commercial scale.

## Which Companies and ETFs Benefit When the Price Rises?

Tire manufacturers benefit from rubber price declines, as cheaper raw materials expand gross margins while retail tire prices adjust slowly downward. Synthetic rubber producers gain when natural rubber prices spike, as buyers substitute where technically feasible. Southeast Asian producing countries see improved trade balances and rural incomes during rubber rallies, supporting local currencies and consumer spending. Recycled rubber processors benefit from higher virgin rubber prices improving their competitive economics.

## Which Companies and Sectors Are Hurt by a Price Increase?

Tire manufacturers suffer during rubber price spikes, facing margin compression when retail price pass-through lags input cost increases. Automakers absorb higher original equipment tire costs. Medical glove manufacturers face raw material inflation on concentrated latex. Smallholder rubber farmers face income volatility and may abandon tapping during prolonged price downturns, reducing future supply elasticity. Construction and mining companies see higher operating costs through off-the-road (OTR) tire expenses.

## What Should Traders Watch When Analyzing This Market?

Natural rubber trades on SICOM (Singapore), TOCOM (Tokyo), and Shanghai Futures Exchange. The TSR20 grade is the international benchmark for technically specified rubber. Monitor Thai Meteorological Department forecasts for monsoon timing and intensity, as wintering season supply disruptions drive seasonal price patterns. Track China auto sales data (CPCA monthly) as the dominant marginal demand signal. The crude oil price influences synthetic rubber costs and sets a substitution price ceiling for natural rubber. Watch IRSG quarterly bulletins for global supply-demand balances. The Thai baht and Indonesian rupiah correlate inversely with dollar-denominated rubber prices, as local currency weakness incentivizes producer selling. EV adoption rates represent a structural positive worth monitoring through monthly registration data.
