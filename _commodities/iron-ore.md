---
layout: commodity
image: "/assets/images/og-iron-ore.png"
title: "Iron Ore"
description: "Iron ore as the essential steel feedstock driven by China's 70%+ consumption share."
commodity_slug: "iron-ore"
symbol: "VALE"
sector: "Industrial Metals"
etfs: ["PICK"]
companies: ["BHP", "RIO", "VALE", "CLF"]
substitutes: ["Recycled Scrap Steel"]
themes: ["Infrastructure Boom"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "iron_ore", "label": "Iron Ore (62% Fe)"},
  "levels": [
    {"nodes": [
      {"id":"pick","label":"PICK Global Mining ETF","type":"etf","impact":7,"correlation":0.70,"sector":"Mining"},
      {"id":"bhp_fe","label":"BHP Group (BHP)","type":"producer","impact":8,"correlation":0.75,"sector":"Diversified Mining"},
      {"id":"rio_fe","label":"Rio Tinto (RIO)","type":"producer","impact":9,"correlation":0.80,"sector":"Iron Ore Mining"},
      {"id":"vale_fe","label":"Vale SA (VALE)","type":"producer","impact":10,"correlation":0.85,"sector":"Iron Ore Mining"},
      {"id":"clf_fe","label":"Cleveland-Cliffs (CLF)","type":"producer","impact":11,"correlation":0.88,"sector":"Iron Ore"},
      {"id":"fmg","label":"Fortescue (FSUGY)","type":"producer","impact":10,"correlation":0.85,"sector":"Iron Ore"},
      {"id":"xme_fe","label":"XME Metals Mining ETF","type":"etf","impact":6,"correlation":0.60,"sector":"Mining"},
      {"id":"iron_index","label":"Iron Ore Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"slx_fe","label":"SLX Steel ETF","type":"etf","impact":7,"correlation":0.72,"sector":"Steel"},
      {"id":"nue_fe","label":"Nucor (NUE)","type":"consumer","impact":-3,"correlation":-0.30,"sector":"Steel"},
      {"id":"stld_fe","label":"Steel Dynamics (STLD)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Steel"},
      {"id":"x_fe","label":"US Steel (X)","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Steel"},
      {"id":"mt_fe","label":"ArcelorMittal (MT)","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Steel"}
    ]},
    {"nodes": [
      {"id":"clf_pellets","label":"CLF Pellet Premium","type":"commodity","impact":8,"correlation":0.78,"sector":"Iron Ore","parentId":"clf_fe"},
      {"id":"cat_fe","label":"Caterpillar (CAT)","type":"supplier","impact":4,"correlation":0.35,"sector":"Mining Equipment","parentId":"bhp_fe"},
      {"id":"de_fe","label":"Deere & Co (DE)","type":"supplier","impact":3,"correlation":0.25,"sector":"Equipment","parentId":"cat_fe"},
      {"id":"rs_fe","label":"Reliance Steel (RS)","type":"consumer","impact":-2,"correlation":-0.20,"sector":"Steel Distribution","parentId":"nue_fe"},
      {"id":"pave_fe","label":"PAVE Infrastructure ETF","type":"etf","impact":4,"correlation":0.35,"sector":"Infrastructure","parentId":"slx_fe"},
      {"id":"dhi_fe","label":"DR Horton (DHI)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Homebuilding","parentId":"nue_fe"},
      {"id":"gm_fe","label":"General Motors (GM)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Automotive","parentId":"stld_fe"},
      {"id":"f_fe","label":"Ford Motor (F)","type":"consumer","impact":-2,"correlation":-0.14,"sector":"Automotive","parentId":"stld_fe"},
      {"id":"scrap_compete","label":"Scrap Steel (Competitor)","type":"substitute","impact":-4,"correlation":-0.35,"sector":"Recycling","parentId":"nue_fe"},
      {"id":"coking_coal","label":"Coking Coal (Related)","type":"commodity","impact":6,"correlation":0.65,"sector":"Steelmaking","parentId":"mt_fe"},
      {"id":"csx_fe","label":"CSX Corp (CSX)","type":"supplier","impact":3,"correlation":0.25,"sector":"Rail Transport","parentId":"clf_fe"},
      {"id":"nsc_fe","label":"Norfolk Southern (NSC)","type":"supplier","impact":3,"correlation":0.22,"sector":"Rail Transport","parentId":"clf_fe"}
    ]},
    {"nodes": [
      {"id":"china_steel","label":"China Steel Output","type":"macro","impact":8,"correlation":0.65,"sector":"Industrial","parentId":"mt_fe"},
      {"id":"dxy_fe","label":"US Dollar (DXY)","type":"fx","impact":-5,"correlation":-0.48,"sector":"Forex","parentId":"iron_index"},
      {"id":"aud_fe","label":"Australian Dollar (AUD)","type":"fx","impact":6,"correlation":0.55,"sector":"Forex","parentId":"bhp_fe"},
      {"id":"brl_fe","label":"Brazilian Real (BRL)","type":"fx","impact":5,"correlation":0.48,"sector":"Forex","parentId":"vale_fe"},
      {"id":"china_property","label":"China Property Sector","type":"macro","impact":7,"correlation":0.55,"sector":"Real Estate","parentId":"china_steel"},
      {"id":"china_infra_fe","label":"China Infrastructure","type":"policy","impact":7,"correlation":0.50,"sector":"Policy","parentId":"china_steel"},
      {"id":"port_stocks","label":"China Port Stockpiles","type":"macro","impact":-6,"correlation":-0.55,"sector":"Supply Data","parentId":"iron_index"},
      {"id":"shipping_fe","label":"Dry Bulk Shipping (SBLK)","type":"freight","impact":5,"correlation":0.45,"sector":"Shipping","parentId":"vale_fe"},
      {"id":"bdi_fe","label":"Baltic Dry Index","type":"freight","impact":5,"correlation":0.50,"sector":"Shipping","parentId":"shipping_fe"},
      {"id":"green_steel","label":"Green Steel Transition","type":"macro","impact":3,"correlation":0.20,"sector":"ESG","parentId":"scrap_compete"},
      {"id":"len_fe","label":"Lennar Corp (LEN)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Homebuilding","parentId":"dhi_fe"},
      {"id":"hd_fe","label":"Home Depot (HD)","type":"consumer","impact":-1,"correlation":-0.10,"sector":"Retail","parentId":"dhi_fe"}
    ]},
    {"nodes": [
      {"id":"china_pmi_fe","label":"China PMI Data","type":"macro","impact":6,"correlation":0.48,"sector":"Economic Data","parentId":"china_steel"},
      {"id":"india_steel_fe","label":"India Steel Growth","type":"macro","impact":5,"correlation":0.38,"sector":"Emerging Markets","parentId":"china_infra_fe"},
      {"id":"iron_ore_grade","label":"Iron Ore Grade Premium","type":"commodity","impact":7,"correlation":0.75,"sector":"Commodities","parentId":"clf_pellets"},
      {"id":"sintering","label":"Sintering/Pelletizing","type":"processor","impact":5,"correlation":0.40,"sector":"Processing","parentId":"clf_pellets"},
      {"id":"mining_capex_fe","label":"Mining CapEx Cycle","type":"macro","impact":4,"correlation":0.32,"sector":"Investment","parentId":"cat_fe"},
      {"id":"tariffs_fe","label":"Steel Tariffs","type":"policy","impact":-4,"correlation":-0.30,"sector":"Trade Policy","parentId":"x_fe"},
      {"id":"decarbonization_fe","label":"Steel Decarbonization","type":"policy","impact":4,"correlation":0.25,"sector":"ESG","parentId":"green_steel"},
      {"id":"hydrogen_dri","label":"Hydrogen DRI","type":"substitute","impact":-3,"correlation":-0.20,"sector":"Green Steel","parentId":"green_steel"},
      {"id":"auto_cycle_fe","label":"Global Auto Cycle","type":"macro","impact":4,"correlation":0.30,"sector":"Automotive","parentId":"gm_fe"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Iron ore is the primary raw material for steelmaking, and its price is overwhelmingly determined by Chinese demand, which accounts for over 70% of global seaborne iron ore imports. The market is dominated by three mining giants -- BHP, Rio Tinto, and Vale -- whose combined production represents roughly 60% of seaborne supply. Iron ore pricing shifted from annual benchmark negotiations to spot-based index pricing in 2010, dramatically increasing price volatility. Global production exceeds 2.5 billion tonnes annually, making iron ore one of the highest-volume commodities traded internationally.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Blast furnace steelmaking consumes approximately 1.6 tonnes of iron ore per tonne of crude steel produced. Chinese steel mill profitability, measured by rebar margins, directly determines restocking and destocking cycles that drive iron ore prices. BHP, Rio Tinto, and Vale trade as leveraged proxies on Chinese industrial activity, with earnings highly sensitive to the iron ore price given their low-cost production bases ($15-20/tonne cash cost versus market prices often above $100/tonne).

**Secondary -- Supply Chain and Processing:** Chinese property construction starts and government infrastructure stimulus programs are the ultimate demand drivers. Cleveland-Cliffs (CLF) operates as the dominant U.S. iron ore producer, serving domestic blast furnace steelmakers. Infrastructure spending bills and urbanization trends in India and Southeast Asia represent the next wave of structural demand growth beyond China. Pelletizing and sintering operations add value between mine and mill, with premium pellet prices reflecting environmental emission advantages at the blast furnace.

**Tertiary -- Macro and Second-Order Effects:** Iron ore is the largest dry bulk commodity by volume, making it a key driver of Capesize freight rates and the Baltic Dry Index. Port inventory levels at Chinese ports (typically tracked at 45 major ports) serve as a leading indicator of near-term demand. Rising inventories signal weakening steel mill demand, while drawdowns indicate restocking and price support. Iron ore price cycles amplify commodity currency movements in Australia and Brazil, where mining export revenues are a significant share of GDP.

## Winners

Major miners BHP, Rio Tinto, and Vale capture extraordinary margins during price rallies due to their low-cost Pilbara and Carajas operations. Australian and Brazilian government budgets benefit from mining royalties and corporate tax windfalls. Shipping companies operating Capesize and Valemax bulk carriers earn higher freight rates as iron ore trade volumes expand. Indian iron ore miners gain when export restrictions are relaxed during high-price environments.

## Losers

Steelmakers face raw material cost inflation that compresses margins, particularly when downstream steel prices lag. Automakers, appliance manufacturers, and construction firms absorb higher steel costs driven by iron ore price increases. High-cost iron ore producers with marginal deposits face margin pressure during price declines but often cannot ramp quickly enough to capture rallies. Infrastructure project budgets escalate when steel input costs rise, potentially delaying government spending programs.

## Trading Note

Chinese port inventories and daily steel mill blast furnace utilization rates are the highest-frequency fundamental indicators for iron ore. The 62% Fe benchmark (Platts IODEX) is the standard pricing reference. Monitor the spread between 62% Fe and 58% Fe grades as a quality premium indicator -- wider spreads signal strong demand and environmental enforcement driving mills toward higher-grade feed. Vale's quarterly production reports and BHP/Rio operational updates move the market on the supply side. The SGX (Singapore Exchange) iron ore futures contract has become the primary hedging instrument for financial participants.
