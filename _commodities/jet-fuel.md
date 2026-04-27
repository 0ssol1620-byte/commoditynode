---
layout: commodity
unit: "$/gal"
image: "/assets/images/og-jet-fuel.png"
title: "Jet Fuel Price Impact: Airline Costs, Hedging & ETFs"
description: "Jet fuel price impact: how aviation fuel costs affect airline profitability, ticket prices, and hedging strategies. Jet fuel is 20-30% of airline costs."
commodity_slug: "jet-fuel"
symbol: "CL=F"
data_type: "proxy"
sector: "Energy"
etfs: ["JETS"]
companies: ["DAL"]
substitutes: ["Sustainable Aviation Fuel", "Electric Aircraft"]
themes: ["Supply Chain Disruption"]
tags: ["jet-fuel"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "jet_fuel", "label": "Jet Fuel (Kerosene)"},
  "levels": [
    {"nodes": [
      {"id":"jets","label":"JETS Airlines ETF","type":"etf","impact":-8,"correlation":-0.78,"sector":"Airlines"},
      {"id":"dal_jf","label":"Delta Air Lines (DAL)","type":"consumer","impact":-7,"correlation":-0.70,"sector":"Airlines"},
      {"id":"ual_jf","label":"United Airlines (UAL)","type":"consumer","impact":-8,"correlation":-0.75,"sector":"Airlines"},
      {"id":"aal_jf","label":"American Airlines (AAL)","type":"consumer","impact":-9,"correlation":-0.80,"sector":"Airlines"},
      {"id":"luv_jf","label":"Southwest Airlines (LUV)","type":"consumer","impact":-7,"correlation":-0.68,"sector":"Airlines"},
      {"id":"jf_index","label":"Jet Fuel Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"vlo_jf","label":"Valero (VLO)","type":"processor","impact":6,"correlation":0.55,"sector":"Refining"},
      {"id":"mpc_jf","label":"Marathon Petro (MPC)","type":"processor","impact":6,"correlation":0.52,"sector":"Refining"},
      {"id":"ba_jf","label":"Boeing (BA)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Aircraft Mfg"},
      {"id":"rtx_jf","label":"RTX Corp (RTX)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Aerospace"},
      {"id":"xle_jf","label":"XLE Energy ETF","type":"etf","impact":5,"correlation":0.55,"sector":"Energy"},
      {"id":"uso_jf","label":"USO Oil Fund","type":"etf","impact":7,"correlation":0.80,"sector":"Crude Link"}
    ]},
    {"nodes": [
      {"id":"algt","label":"Allegiant Travel (ALGT)","type":"consumer","impact":-8,"correlation":-0.72,"sector":"Airlines","parentId":"jets"},
      {"id":"jblu","label":"JetBlue (JBLU)","type":"consumer","impact":-8,"correlation":-0.70,"sector":"Airlines","parentId":"jets"},
      {"id":"ha","label":"Hawaiian Airlines (HA)","type":"consumer","impact":-7,"correlation":-0.65,"sector":"Airlines","parentId":"jets"},
      {"id":"bkng","label":"Booking Holdings (BKNG)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Travel","parentId":"dal_jf"},
      {"id":"expe","label":"Expedia Group (EXPE)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Travel","parentId":"dal_jf"},
      {"id":"abnb_jf","label":"Airbnb (ABNB)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Travel","parentId":"bkng"},
      {"id":"eadsy","label":"Airbus (EADSY)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Aircraft Mfg","parentId":"ba_jf"},
      {"id":"ge_jf","label":"GE Aerospace (GE)","type":"supplier","impact":-2,"correlation":-0.15,"sector":"Engines","parentId":"ba_jf"},
      {"id":"tps","label":"TPS Aerospace (TDG)","type":"supplier","impact":-2,"correlation":-0.12,"sector":"Parts","parentId":"rtx_jf"},
      {"id":"pbf_jf","label":"PBF Energy (PBF)","type":"processor","impact":5,"correlation":0.48,"sector":"Refining","parentId":"vlo_jf"},
      {"id":"dino_jf","label":"HF Sinclair (DINO)","type":"processor","impact":5,"correlation":0.45,"sector":"Refining","parentId":"mpc_jf"},
      {"id":"crack_jf","label":"Jet Crack Spread","type":"index","impact":8,"correlation":0.85,"sector":"Refining Margin","parentId":"jf_index"}
    ]},
    {"nodes": [
      {"id":"mar_jf","label":"Marriott (MAR)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Hotels","parentId":"bkng"},
      {"id":"hlt_jf","label":"Hilton (HLT)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Hotels","parentId":"bkng"},
      {"id":"ccl_jf","label":"Carnival Corp (CCL)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Cruise","parentId":"expe"},
      {"id":"rcl_jf","label":"Royal Caribbean (RCL)","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Cruise","parentId":"expe"},
      {"id":"dxy_jf","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.40,"sector":"Forex","parentId":"jf_index"},
      {"id":"crude_input","label":"WTI Crude (Input)","type":"commodity","impact":8,"correlation":0.88,"sector":"Energy","parentId":"uso_jf"},
      {"id":"saf","label":"Sustainable Aviation Fuel","type":"substitute","impact":-3,"correlation":-0.15,"sector":"Clean Energy","parentId":"jf_index"},
      {"id":"hedging","label":"Airline Fuel Hedging","type":"macro","impact":-4,"correlation":-0.35,"sector":"Risk Mgmt","parentId":"dal_jf"},
      {"id":"pax_demand","label":"Passenger Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Travel","parentId":"jets"},
      {"id":"cargo_demand","label":"Air Cargo Demand","type":"macro","impact":3,"correlation":0.25,"sector":"Logistics","parentId":"ual_jf"},
      {"id":"opec_jf","label":"OPEC+ Supply Policy","type":"policy","impact":6,"correlation":0.50,"sector":"Supply Policy","parentId":"crude_input"}
    ]},
    {"nodes": [
      {"id":"tourism_cycle","label":"Global Tourism Cycle","type":"macro","impact":4,"correlation":0.30,"sector":"Travel","parentId":"pax_demand"},
      {"id":"fleet_efficiency","label":"Fleet Fuel Efficiency","type":"macro","impact":-3,"correlation":-0.20,"sector":"Technology","parentId":"ba_jf"},
      {"id":"electric_aircraft","label":"Electric Aircraft","type":"substitute","impact":-2,"correlation":-0.10,"sector":"Future Tech","parentId":"saf"},
      {"id":"saf_mandate","label":"SAF Blending Mandate","type":"policy","impact":3,"correlation":0.20,"sector":"Regulation","parentId":"saf"},
      {"id":"geopolitical_risk","label":"Geopolitical Risk","type":"policy","impact":5,"correlation":0.40,"sector":"Geopolitics","parentId":"opec_jf"},
      {"id":"seasonal_travel","label":"Seasonal Travel Demand","type":"macro","impact":5,"correlation":0.38,"sector":"Seasonal","parentId":"pax_demand"},
      {"id":"refinery_margin","label":"Refinery Margin Cycle","type":"macro","impact":5,"correlation":0.42,"sector":"Refining","parentId":"crack_jf"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Jet fuel (kerosene-type Jet-A) represents 20-30% of airline operating costs, making it the single largest variable expense for commercial carriers. Unlike many commodities with diverse end uses, jet fuel demand is almost exclusively driven by commercial and military aviation. The jet fuel crack spread from crude oil reflects refinery yield economics and regional supply-demand balances, with Gulf Coast and Singapore benchmarks serving as primary pricing references. Global jet fuel consumption exceeds 8 million barrels per day and has surpassed pre-pandemic levels, driven by Asia-Pacific travel recovery and secular growth in air cargo.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Delta, United, American, and Southwest each consume billions of gallons of jet fuel annually. Hedging strategies vary dramatically by carrier -- Southwest historically hedged aggressively using derivatives, while American Airlines has largely operated unhedged. A $10/barrel change in jet fuel prices impacts major U.S. carrier operating costs by $400-600 million annually. The JETS ETF provides basket exposure to this fuel cost sensitivity. Low-cost carriers (Spirit, Frontier) face disproportionate pressure given their thinner operating margins.

**Secondary -- Supply Chain and Processing:** Jet fuel is a middle-distillate product competing for refinery yield with diesel and heating oil. Refiners optimize crude slates and catalytic cracking to maximize high-value distillate output. When jet fuel demand recovers (post-pandemic travel surges), crack spreads widen and benefit refiners like Valero and Marathon Petroleum. Regional refinery outages can create localized jet fuel shortages that spike airport delivery prices. Pipeline operators delivering fuel to major hub airports (Colonial Pipeline for the U.S. East Coast) form a critical logistics link.

**Tertiary -- Macro and Second-Order Effects:** SAF produced from waste oils, agricultural residues, or synthetic processes currently costs 2-5x conventional jet fuel. Airlines face mandates (EU ReFuelEU) requiring increasing SAF blending percentages. This transition creates both a cost headwind for carriers and an investment opportunity in SAF producers and feedstock suppliers. Jet fuel price spikes feed through to airfare increases, dampening travel demand and impacting tourism-dependent economies. Military jet fuel procurement, particularly during heightened geopolitical tension, can tighten regional supply.

## Which Companies and ETFs Benefit When the Price Rises?

Refiners with high distillate yield configurations capture wider crack spreads during jet fuel rallies. Valero, Marathon Petroleum, and PBF Energy benefit from optimized crude slates. SAF producers gain competitive positioning as conventional fuel prices rise, narrowing the green premium. Hedged airlines like Delta gain a relative cost advantage over unhedged competitors during price spikes, translating fuel savings into market share and earnings outperformance.

## Which Companies and Sectors Are Hurt by a Price Increase?

Unhedged airlines face acute margin compression -- American Airlines (AAL) shows the highest earnings sensitivity among major U.S. carriers. Low-cost carriers face existential margin pressure during prolonged jet fuel rallies. Air cargo operators pass through fuel surcharges but experience volume declines. Tourism-dependent economies (Caribbean, Mediterranean, Southeast Asia) suffer as higher airfares reduce visitor counts and spending.

## What Should Traders Watch When Analyzing This Market?

Monitor TSA throughput data and airline capacity announcements (available seat miles) for real-time demand signals. The jet fuel crack spread versus the diesel crack spread indicates relative refinery economics and product substitution incentives. Airline earnings calls provide forward hedging percentages and fuel cost guidance that move individual stock prices. Seasonal travel patterns (summer peak, holiday surges) create predictable demand cycles, but geopolitical events and pandemic risk introduce asymmetric downside. Platts jet fuel assessments at key hubs (Singapore, Rotterdam, U.S. Gulf Coast) provide regional pricing transparency.
