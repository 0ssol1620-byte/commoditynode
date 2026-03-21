---
layout: commodity
title: "Uranium"
description: "Uranium's nuclear renaissance driven by SMR technology and post-Fukushima supply deficits."
commodity_slug: "uranium"
symbol: "URA"
sector: "Battery Metals"
etfs: ["URA", "URNM"]
companies: ["CCJ", "NXE", "LEU", "UEC"]
substitutes: ["Solar", "Wind", "Natural Gas"]
themes: ["Nuclear Renaissance", "Clean Energy"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "uranium", "label": "Uranium (URA)"},
  "levels": [
    {"nodes": [
      {"id":"ura","label":"URA ETF","type":"etf","impact":10,"correlation":0.90,"sector":"Nuclear"},
      {"id":"urnm","label":"URNM ETF","type":"etf","impact":12,"correlation":0.92,"sector":"Nuclear"},
      {"id":"ccj","label":"Cameco (CCJ)","type":"producer","impact":14,"correlation":0.88,"sector":"Mining"},
      {"id":"nxe","label":"NexGen Energy (NXE)","type":"producer","impact":15,"correlation":0.85,"sector":"Mining"},
      {"id":"uec","label":"Uranium Energy (UEC)","type":"producer","impact":13,"correlation":0.82,"sector":"Mining"}
    ]},
    {"nodes": [
      {"id":"leu","label":"Centrus Energy (LEU)","type":"processor","impact":11,"correlation":0.78,"sector":"Enrichment","parentId":"ccj"},
      {"id":"dnn","label":"Denison Mines (DNN)","type":"producer","impact":12,"correlation":0.80,"sector":"Mining","parentId":"nxe"},
      {"id":"sput","label":"Sprott Physical Uranium","type":"etf","impact":9,"correlation":0.85,"sector":"Physical","parentId":"ura"},
      {"id":"kazatom","label":"Kazatomprom","type":"producer","impact":10,"correlation":0.82,"sector":"Mining","parentId":"ccj"},
      {"id":"smr_demand","label":"SMR Demand Growth","type":"consumer","impact":7,"correlation":0.60,"sector":"Nuclear","parentId":"urnm"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Uranium is the fuel that powers approximately 10% of global electricity generation through 440+ commercial nuclear reactors worldwide. The market operates on unique 10-year contracting cycles between utilities and miners, creating a disconnect between spot and long-term contract prices. Post-Fukushima mine closures and production curtailments have created a structural supply deficit that is tightening as reactor restarts and new builds accelerate globally. Global primary mine production covers only about 75% of annual reactor requirements, with the deficit filled by secondary supplies (government inventories, recycled material) that are steadily depleting.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Cameco and Kazatomprom control a dominant share of global uranium production. Uranium enrichment (Centrus Energy/LEU) and fuel fabrication add value between mine and reactor. Unlike oil or gas, uranium fuel costs represent only 5-10% of nuclear plant operating expenses, meaning utilities are price-insensitive buyers who prioritize supply security over cost. This inelasticity supports higher prices once long-term contracts roll over. NexGen Energy (NXE) and Uranium Energy Corp (UEC) represent development-stage companies with large undeveloped deposits.

**Secondary -- Supply Chain and Processing:** SMR technology from companies like NuScale, GE-Hitachi, and Rolls-Royce represents the most significant catalyst for uranium demand growth. SMR designs promise faster construction timelines, lower capital costs, and the ability to site reactors in locations unsuitable for traditional gigawatt-scale plants. Data center power demand is accelerating interest in co-located SMR projects. The enrichment bottleneck (dominated by Russia's Rosatom, Urenco, and Orano) adds a supply chain constraint that can tighten fuel availability independent of mine supply.

**Tertiary -- Macro and Second-Order Effects:** Sprott Physical Uranium Trust and other physical holding vehicles have become significant market participants, purchasing and sequestering material from the spot market. This financialization of uranium has tightened available spot supply and created a reflexive dynamic where rising prices attract more investment capital into physical funds, further reducing available material. Government nuclear energy policies, reactor license extensions, and new build commitments drive long-term demand expectations and investment sentiment across the uranium value chain.

## Winners

Uranium miners with permitted, near-production assets benefit most from price rallies. Cameco (CCJ) captures direct margin expansion on its Saskatchewan operations. Kazatomprom benefits from its position as the world's lowest-cost producer. Development-stage companies (NexGen, Uranium Energy Corp, Denison Mines) see share price appreciation as higher prices bring their projects closer to economic viability. Physical uranium fund investors (Sprott) benefit from NAV appreciation.

## Losers

Nuclear utilities face higher fuel procurement costs as legacy low-price contracts expire and are replaced at current market rates. Enrichment-dependent utilities face additional cost pressure from constrained SWU (separative work unit) capacity. Countries pursuing nuclear expansion face higher construction costs as uranium price increases compound with steel, concrete, and labor inflation. Anti-nuclear jurisdictions that shut down reactors face energy cost regret as replacement power costs exceed nuclear operating costs.

## Trading Note

The uranium spot/term price spread is the key indicator of market tightness. When spot prices approach or exceed long-term contract levels, it signals that uncovered utility demand is pulling material from the spot market. Monitor the World Nuclear Association's reactor pipeline, Kazatomprom production guidance, and U.S. DOE enrichment inventories as fundamental drivers. URA and URNM ETFs provide liquid exposure but trade at significant premiums to NAV during bull markets. Numerco's daily spot price updates and TradeTech's weekly contract indicators provide the highest-frequency price data in this opaque market.
