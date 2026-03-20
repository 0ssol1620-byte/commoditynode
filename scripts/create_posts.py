#!/usr/bin/env python3
"""Generate remaining new posts for CommodityNode."""
import os

POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', '_posts')

posts = [

# ---- JET FUEL ----
("2026-03-19-jet-fuel-airline-profitability.md", """---
layout: post
title: "Jet Fuel Price Impact: Airlines, Airports & the Global Travel Chain"
date: 2026-03-19
categories: [Energy, Analysis]
tags: [jet-fuel, airlines, energy, JETS, DAL, UAL, AAL, travel, LUV]
description: "Jet fuel accounts for 20-30% of airline operating costs. Interactive impact map showing how fuel price shocks hit DAL, UAL, AAL, and cascade through airports and travel demand."
reading_time: 8
commodity_name: "Jet Fuel"
image: /assets/images/og-jet-fuel.png
canonical_url: https://commoditynode.com/jet-fuel-airline-profitability/
---

Jet fuel is to airlines what blood is to the human body — cut the supply or spike the cost, and the entire system feels it immediately. With fuel representing 20–30% of total airline operating expenses, a 10% move in jet fuel prices can swing annual margins by hundreds of millions of dollars for major carriers.

Unlike trucking, where fuel surcharges can be passed through relatively quickly, airlines operate in a competitive pricing environment where fare increases to cover fuel costs are constrained by consumer elasticity and competitive dynamics. The result: fuel spikes compress margins fast, and the ripple travels from carriers to airports, travel companies, and ultimately consumer leisure spending.

## The Impact Map

<div class="cn-price-chart" data-symbol="CL=F" data-name="Crude Oil (Jet Fuel Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "jet_fuel", label: "Jet Fuel ↑10%", price: "$3.20/gal", change: "+10%" },
  levels: [
    { nodes: [
      { id: "jets", label: "JETS Airlines ETF", type: "etf", impact: -7.5, correlation: -0.84, marketCap: "2B", sector: "ETF" },
      { id: "dal", label: "Delta Air Lines (DAL)", type: "negative", impact: -9.5, correlation: -0.81, marketCap: "25B", sector: "Airlines" },
      { id: "ual", label: "United Airlines (UAL)", type: "negative", impact: -10.2, correlation: -0.79, marketCap: "18B", sector: "Airlines" },
      { id: "aal", label: "American Airlines (AAL)", type: "negative", impact: -12.5, correlation: -0.83, marketCap: "9B", sector: "Airlines" },
      { id: "luv", label: "Southwest Airlines (LUV)", type: "negative", impact: -8.0, correlation: -0.77, marketCap: "18B", sector: "Airlines" }
    ]},
    { nodes: [
      { id: "airport", label: "Airport operators", type: "negative", impact: -4.0, correlation: -0.55, sector: "Infrastructure", parentId: "jets" },
      { id: "bkng", label: "Booking Holdings (BKNG)", type: "negative", impact: -5.5, correlation: -0.62, marketCap: "160B", sector: "Travel", parentId: "dal" },
      { id: "expe", label: "Expedia Group (EXPE)", type: "negative", impact: -5.0, correlation: -0.58, marketCap: "22B", sector: "Travel", parentId: "ual" },
      { id: "hedge", label: "Fuel hedge gains", type: "positive", impact: 3.5, sector: "Finance", parentId: "luv" },
      { id: "mro", label: "Aircraft MRO costs", type: "negative", impact: -2.0, sector: "Services", parentId: "aal" }
    ]},
    { nodes: [
      { id: "hotel", label: "Marriott / Hilton", type: "negative", impact: -3.0, correlation: -0.44, sector: "Hotels", parentId: "bkng" },
      { id: "cruise", label: "Carnival / RCL", type: "negative", impact: -2.5, correlation: -0.38, sector: "Cruise", parentId: "expe" },
      { id: "boe_air", label: "Boeing (BA) orders", type: "negative", impact: -3.5, correlation: -0.52, sector: "Aerospace", parentId: "airport" },
      { id: "fuel_eff", label: "Fuel-efficient fleets premium", type: "positive", impact: 4.0, sector: "Aviation Tech", parentId: "hedge" }
    ]},
    { nodes: [
      { id: "consumer_travel", label: "Consumer travel spend", type: "negative", impact: -2.0, sector: "Macro", parentId: "hotel" },
      { id: "cargo", label: "Air cargo rates ↑", type: "positive", impact: 3.0, sector: "Freight", parentId: "fuel_eff" },
      { id: "oil_ma", label: "OPEC production policy", type: "negative", impact: -5.0, sector: "Macro", parentId: "boe_air" }
    ]}
  ]
};
</script>

## Winners: Who benefits when jet fuel rises?

**Fuel hedging desks** (Southwest famously runs aggressive fuel hedges) can generate mark-to-market gains when prices spike — but this is a short-term treasury benefit, not an operational one.

**Rail and ground transport** gains modal-shift demand as business travelers and freight shippers find air less cost-competitive at higher fares.

**Aircraft lessors (AER, AL)** see demand shift toward newer, fuel-efficient aircraft. Airlines accelerate fleet renewals when fuel costs spike, benefiting lessors with modern A321neo and 787 inventory.

## Losers: Who gets hurt?

**Full-service carriers (DAL, UAL, AAL)** bear the brunt. AAL carries the least fuel-hedge coverage and tends to see the largest earnings impact. DAL has historically maintained stronger hedging programs.

**Online travel agencies (BKNG, EXPE)** see booking volume drop as fare increases dampen demand, particularly for leisure travel. Business travel is more inelastic but still affected.

**Hotel chains and resort operators** suffer second-order demand destruction as travelers cut trip frequency when airfares rise.

## Key Takeaway

Jet fuel is one of the clearest transmission channels from crude oil markets to consumer leisure and corporate travel spending. Monitor airline fuel hedge disclosures (found in quarterly earnings calls), capacity guidance cuts, and fare yield trends as the key leading indicators of how deeply a fuel spike will propagate through the travel ecosystem.
"""),

# ---- LNG ----
("2026-03-20-lng-natural-gas-global-trade.md", """---
layout: post
title: "LNG Price Impact: Utilities, Chemicals & the Global Gas Trade"
date: 2026-03-20
categories: [Energy, Analysis]
tags: [lng, natural-gas, energy, utilities, chemicals, fertilizer, ET, LNG, SRE]
description: "LNG price movements ripple through utilities, chemical plants, fertilizer producers and industrial gas consumers globally. Interactive impact map for Cheniere, Sempra, and downstream sectors."
reading_time: 9
commodity_name: "LNG"
image: /assets/images/og-lng.png
canonical_url: https://commoditynode.com/lng-natural-gas-global-trade/
---

Liquefied Natural Gas (LNG) has transformed from a regional fuel into a globally-traded commodity — and with that transformation came a new set of price ripple chains that span continents. A supply disruption in Australia, a cold snap in Europe, or a new US export terminal coming online can now move prices that affect power utilities in Japan, fertilizer plants in India, and chemical manufacturers in Germany simultaneously.

The US LNG export boom has tightened the link between Henry Hub domestic prices and international gas benchmarks. This means domestic utilities, industrial users, and chemical companies now share price exposure with global energy markets in ways that weren't true a decade ago.

## The Impact Map

<div class="cn-price-chart" data-symbol="NG=F" data-name="Natural Gas (Henry Hub)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "lng", label: "LNG ↑15%", price: "$14/MMBtu", change: "+15%" },
  levels: [
    { nodes: [
      { id: "cqp", label: "Cheniere Energy (LNG)", type: "positive", impact: 11.0, correlation: 0.88, marketCap: "45B", sector: "LNG Export" },
      { id: "sre", label: "Sempra Energy (SRE)", type: "positive", impact: 7.5, correlation: 0.72, marketCap: "42B", sector: "LNG Infrastructure" },
      { id: "et", label: "Energy Transfer (ET)", type: "positive", impact: 6.0, correlation: 0.68, marketCap: "48B", sector: "Pipelines" },
      { id: "util", label: "Utilities (XLU ETF)", type: "negative", impact: -5.5, correlation: -0.64, marketCap: "70B", sector: "ETF" },
      { id: "cf", label: "CF Industries (CF)", type: "negative", impact: -9.0, correlation: -0.82, marketCap: "16B", sector: "Fertilizer" }
    ]},
    { nodes: [
      { id: "mos", label: "Mosaic Co (MOS)", type: "negative", impact: -7.5, correlation: -0.74, marketCap: "12B", sector: "Fertilizer", parentId: "cf" },
      { id: "dow", label: "Dow Inc (DOW)", type: "negative", impact: -6.0, correlation: -0.68, marketCap: "40B", sector: "Chemicals", parentId: "util" },
      { id: "lyr", label: "LyondellBasell (LYB)", type: "negative", impact: -5.5, correlation: -0.64, marketCap: "28B", sector: "Petrochems", parentId: "util" },
      { id: "kmi", label: "Kinder Morgan (KMI)", type: "positive", impact: 4.0, correlation: 0.58, marketCap: "22B", sector: "Pipelines", parentId: "et" },
      { id: "eu_util", label: "European utilities pain", type: "negative", impact: -8.0, sector: "International", parentId: "cqp" }
    ]},
    { nodes: [
      { id: "agri_cost", label: "Fertilizer cost → crop prices", type: "negative", impact: -3.5, sector: "Agriculture", parentId: "mos" },
      { id: "plastic", label: "Plastics / resins ↑", type: "negative", impact: -4.0, sector: "Materials", parentId: "dow" },
      { id: "ind_gas", label: "Air Products (APD)", type: "negative", impact: -3.0, correlation: -0.44, marketCap: "55B", sector: "Industrial Gas", parentId: "lyr" },
      { id: "spot_lng", label: "Asian spot LNG premium", type: "positive", impact: 5.0, sector: "International", parentId: "kmi" }
    ]},
    { nodes: [
      { id: "food_cpi", label: "Food CPI via fertilizer", type: "negative", impact: -2.0, sector: "Macro", parentId: "agri_cost" },
      { id: "renewables", label: "Renewable energy acceleration", type: "positive", impact: 3.0, sector: "Clean Energy", parentId: "eu_util" },
      { id: "petchem_asia", label: "Asian petrochems margin squeeze", type: "negative", impact: -4.5, sector: "International", parentId: "plastic" }
    ]}
  ]
};
</script>

## Winners

**LNG exporters (Cheniere/LNG, Sempra/SRE)** are the most direct beneficiaries. Cheniere's long-term contracts are indexed to Henry Hub plus a margin, but their marketing volumes benefit significantly from high spot prices.

**Pipeline operators (ET, KMI)** see volume and throughput gains as LNG export demand pulls more gas through their networks.

## Losers

**Fertilizer producers (CF, MOS)** use natural gas as the primary feedstock for nitrogen fertilizer (urea, ammonia). Gas typically represents 70–80% of nitrogen fertilizer production costs, so LNG spikes hit them hard and fast.

**Chemical manufacturers (DOW, LYB)** use natural gas as both energy and feedstock. Ethylene crackers and methanol plants are particularly sensitive.

**Utilities with gas-heavy generation (PPL, NRG)** face higher fuel costs that either compress margins (if they have price-capped customers) or increase consumer electricity bills.

## Key Takeaway

LNG price spikes travel quickly from the wellhead to fertilizer bags and plastic pellets. The cleanest pair trades: long Cheniere vs. short CF Industries when LNG tightens, or vice versa on softening. Watch NYMEX-to-JKM spread for early signals of US export constraint.
"""),

# ---- COAL ----
("2026-03-20-coal-power-mining-impact.md", """---
layout: post
title: "Coal Price Impact: Power Generation, Steel & the Energy Transition"
date: 2026-03-20
categories: [Energy, Analysis]
tags: [coal, energy, steel, mining, power, BTU, ARCH, NUE, X]
description: "Coal price movements affect electricity generation costs, steel production, and cement industries while accelerating or decelerating the energy transition. Impact map for Peabody, Arch, and downstream steel."
reading_time: 7
commodity_name: "Coal"
image: /assets/images/og-coal.png
canonical_url: https://commoditynode.com/coal-power-mining-impact/
---

Coal's story in 2024–2026 is a paradox: structurally declining in Western markets due to energy transition policies, yet still critical infrastructure in Asia and a powerful swing factor for global steel and electricity prices. Metallurgical (coking) coal and thermal coal have diverging demand paths, but both retain the ability to generate significant market ripples when prices move sharply.

Thermal coal drives power generation cost curves — high coal prices lift electricity prices and accelerate renewable investment economics. Metallurgical coal is irreplaceable in the current steel production process, making it a critical input cost driver for the entire industrial metals complex.

## The Impact Map

<div class="cn-price-chart" data-symbol="BTU" data-name="Peabody Energy (Coal Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "coal", label: "Coal ↑20%", price: "$320/ton", change: "+20%" },
  levels: [
    { nodes: [
      { id: "btu", label: "Peabody Energy (BTU)", type: "positive", impact: 18.0, correlation: 0.91, marketCap: "3B", sector: "Coal Mining" },
      { id: "arch", label: "Arch Resources (ARCH)", type: "positive", impact: 16.0, correlation: 0.89, marketCap: "3B", sector: "Met Coal" },
      { id: "nue", label: "Nucor Corp (NUE)", type: "negative", impact: -4.5, correlation: -0.55, marketCap: "35B", sector: "Steel" },
      { id: "x_steel", label: "U.S. Steel (X)", type: "negative", impact: -5.5, correlation: -0.61, marketCap: "8B", sector: "Steel" },
      { id: "util_coal", label: "Coal-dependent utilities", type: "negative", impact: -6.0, correlation: -0.67, sector: "Utilities" }
    ]},
    { nodes: [
      { id: "clf", label: "Cleveland-Cliffs (CLF)", type: "negative", impact: -4.0, correlation: -0.52, marketCap: "10B", sector: "Steel", parentId: "nue" },
      { id: "vmw_cem", label: "Vulcan Materials (VMC)", type: "negative", impact: -2.5, correlation: -0.38, marketCap: "28B", sector: "Cement", parentId: "x_steel" },
      { id: "duk", label: "Duke Energy (DUK)", type: "negative", impact: -5.0, correlation: -0.62, marketCap: "72B", sector: "Utilities", parentId: "util_coal" },
      { id: "renewables_coal", label: "Solar / Wind IRR improves", type: "positive", impact: 4.5, sector: "Clean Energy", parentId: "util_coal" },
      { id: "aus_coal", label: "Australian coal royalties", type: "positive", impact: 12.0, sector: "International", parentId: "arch" }
    ]},
    { nodes: [
      { id: "construction_c", label: "Construction cost inflation", type: "negative", impact: -2.0, sector: "Real Estate", parentId: "vmw_cem" },
      { id: "next_era", label: "NextEra Energy (NEE)", type: "positive", impact: 3.5, correlation: 0.41, marketCap: "140B", sector: "Clean Energy", parentId: "renewables_coal" },
      { id: "china_steel", label: "China steel cost floor ↑", type: "negative", impact: -3.5, sector: "International", parentId: "aus_coal" }
    ]},
    { nodes: [
      { id: "cpi_coal", label: "Industrial goods CPI", type: "negative", impact: -1.5, sector: "Macro", parentId: "construction_c" },
      { id: "carbon_coal", label: "Carbon credit demand ↑", type: "positive", impact: 2.5, sector: "ESG", parentId: "next_era" }
    ]}
  ]
};
</script>

## Winners

**Coal miners (BTU, ARCH)** are direct beneficiaries, particularly in the met coal segment where Arch Resources focuses. Thermal coal miners benefit less structurally given the ongoing closure of coal-fired power plants in OECD countries.

**Renewable energy developers (NEE, ENPH)** benefit from improved economics: high coal prices make the levelized cost of energy (LCOE) from solar and wind more competitive, accelerating utility RFPs for clean power contracts.

## Losers

**Integrated steel producers** relying on blast furnace technology (U.S. Steel, Cleveland-Cliffs) face direct met coal cost increases. EAF producers like Nucor use scrap steel instead of coal, giving them a structural cost advantage during coal spikes.

**Coal-dependent utilities (DUK, AES)** face fuel cost increases that are either absorbed (regulatory lag) or passed to consumers as higher electricity bills.

## Key Takeaway

Coal remains a bridging fuel with significant price impact on steel and electricity. The clearest investment implication: when met coal prices surge, monitor the spread between integrated (BF-BOF) steel producers like X/CLF versus EAF-based Nucor — the gap in margin pressure is often tradeable.
"""),

# ---- NICKEL ----
("2026-03-21-nickel-ev-battery-stainless.md", """---
layout: post
title: "Nickel Price Impact: EV Batteries, Stainless Steel & the Critical Minerals Race"
date: 2026-03-21
categories: [Metals, Analysis]
tags: [nickel, ev, battery, stainless-steel, metals, VALE, NORILSK, TSLA, LIT]
description: "Nickel is the critical mineral at the intersection of EVs and stainless steel. Interactive impact map showing how nickel price swings hit battery manufacturers, Stainless producers, and the EV supply chain."
reading_time: 9
commodity_name: "Nickel"
image: /assets/images/og-nickel.png
canonical_url: https://commoditynode.com/nickel-ev-battery-stainless/
---

Nickel is having its identity crisis decade. Long dominated by stainless steel demand (which still accounts for ~70% of global consumption), it has rapidly become a critical mineral in the EV battery supply chain. High-nickel cathode chemistries (NMC 811, NCA) now compete for supply with stainless mills, creating a structural demand tension that makes nickel prices volatile and directionally complex.

The 2022 LME nickel short squeeze — where prices briefly hit $100,000/ton before trading was suspended — demonstrated just how thin and manipulable this market can become when a new demand driver (batteries) collides with concentrated supply (Russia's Norilsk, Indonesian HPAL projects) and speculative positioning.

## The Impact Map

<div class="cn-price-chart" data-symbol="NI=F" data-name="Nickel (LME Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "nickel", label: "Nickel ↑15%", price: "$18,500/ton", change: "+15%" },
  levels: [
    { nodes: [
      { id: "vale", label: "Vale S.A. (VALE)", type: "positive", impact: 9.5, correlation: 0.82, marketCap: "55B", sector: "Mining" },
      { id: "lit", label: "Lithium & Battery ETF (LIT)", type: "negative", impact: -6.5, correlation: -0.71, marketCap: "3B", sector: "ETF" },
      { id: "tsla", label: "Tesla (TSLA)", type: "negative", impact: -4.5, correlation: -0.58, marketCap: "800B", sector: "EV" },
      { id: "aperam", label: "Stainless mills (NAS)", type: "negative", impact: -7.0, correlation: -0.74, sector: "Stainless Steel" },
      { id: "ptm", label: "Palamon / HPAL projects", type: "positive", impact: 12.0, sector: "Nickel Mining" }
    ]},
    { nodes: [
      { id: "panasonic", label: "Panasonic Energy", type: "negative", impact: -7.5, correlation: -0.76, sector: "Battery Cells", parentId: "lit" },
      { id: "catl", label: "CATL (battery cost ↑)", type: "negative", impact: -5.0, correlation: -0.62, sector: "Battery Maker", parentId: "tsla" },
      { id: "rivian", label: "Rivian (RIVN)", type: "negative", impact: -8.0, correlation: -0.77, marketCap: "15B", sector: "EV", parentId: "tsla" },
      { id: "ss_auto", label: "Auto stainless costs ↑", type: "negative", impact: -3.0, sector: "Automotive", parentId: "aperam" },
      { id: "lfp_shift", label: "LFP chemistry shift", type: "positive", impact: 4.0, sector: "Battery Tech", parentId: "catl" }
    ]},
    { nodes: [
      { id: "ev_ase", label: "EV affordability pressure", type: "negative", impact: -3.5, sector: "Consumer", parentId: "rivian" },
      { id: "ss_food", label: "Food equipment costs ↑", type: "negative", impact: -1.5, sector: "Industrial", parentId: "ss_auto" },
      { id: "recycling", label: "Nickel recycling demand ↑", type: "positive", impact: 3.0, sector: "Circular Economy", parentId: "lfp_shift" }
    ]},
    { nodes: [
      { id: "ev_sub", label: "EV subsidy pressure", type: "negative", impact: -2.0, sector: "Policy", parentId: "ev_ase" },
      { id: "indo_nickel", label: "Indonesia supply response", type: "negative", impact: -5.0, sector: "International", parentId: "ptm" }
    ]}
  ]
};
</script>

## Winners

**Nickel miners (Vale, Norilsk, First Quantum)** benefit directly. Vale's nickel segment is a meaningful contributor to earnings at elevated prices. Indonesian HPAL project operators also gain but face longer payback periods.

**LFP battery chemistry** (lithium iron phosphate, which uses no nickel) becomes relatively more competitive when nickel prices spike, benefiting producers that have shifted to LFP (BYD, CATL's lower-range vehicles).

## Losers

**Battery cell manufacturers** using high-nickel cathodes (Panasonic, LG Energy Solution) see direct cost increases. The impact flows through to EV OEMs within 1–3 quarters as contracts reset.

**Stainless steel producers (Acerinox, Aperam)** face immediate input cost increases. Stainless mills have limited ability to pass through cost increases quickly due to long-term supply contracts.

## Key Takeaway

Nickel is the most complex of the battery metals because its largest demand base is still stainless steel, not batteries. Watch the ratio of Class 1 (battery-grade) to Class 2 (stainless-grade) nickel premiums as an early signal of where price pressure is concentrated — and whether a nickel spike is truly an EV cost story or a broader industrial metals move.
"""),

# ---- COBALT ----
("2026-03-21-cobalt-battery-supply-chain.md", """---
layout: post
title: "Cobalt Price Impact: EV Batteries, Smartphones & Congo Supply Risk"
date: 2026-03-21
categories: [Metals, Analysis]
tags: [cobalt, ev, battery, metals, critical-minerals, TSLA, AAPL, GLENCORE]
description: "Over 70% of cobalt comes from the DRC. Price spikes ripple through EV batteries, smartphones, and aerospace — interactive ripple map for Tesla, Apple supply chain, and battery makers."
reading_time: 8
commodity_name: "Cobalt"
image: /assets/images/og-cobalt.png
canonical_url: https://commoditynode.com/cobalt-battery-supply-chain/
---

Cobalt is the supply chain vulnerability that nobody talks about until a crisis hits. With over 70% of global production concentrated in the Democratic Republic of Congo — and much of that controlled or influenced by Chinese interests — cobalt represents one of the most geopolitically concentrated commodity exposures in the modern supply chain.

Used in lithium-cobalt-oxide (LCO) batteries for smartphones and laptops, and in NMC cathodes for EV batteries, cobalt sits at the intersection of consumer electronics and the energy transition. Supply disruptions or price spikes in cobalt don't stay isolated — they ripple into battery cost structures, EV margins, and ultimately consumer electronics prices.

## The Impact Map

<div class="cn-price-chart" data-symbol="GLENCORE" data-name="Cobalt (Glencore Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "cobalt", label: "Cobalt ↑25%", price: "$35,000/ton", change: "+25%" },
  levels: [
    { nodes: [
      { id: "glen", label: "Glencore (GLEN.L)", type: "positive", impact: 8.0, correlation: 0.76, sector: "Mining" },
      { id: "tsla_co", label: "Tesla (TSLA)", type: "negative", impact: -3.5, correlation: -0.52, marketCap: "800B", sector: "EV" },
      { id: "aapl_co", label: "Apple (AAPL)", type: "negative", impact: -2.5, correlation: -0.41, marketCap: "3.5T", sector: "Consumer Electronics" },
      { id: "catl_co", label: "CATL battery cost", type: "negative", impact: -6.5, correlation: -0.72, sector: "Battery Maker" },
      { id: "recyc_co", label: "Li-Cycle / Redwood", type: "positive", impact: 9.0, correlation: 0.81, sector: "Battery Recycling" }
    ]},
    { nodes: [
      { id: "lgchem", label: "LG Energy Solution", type: "negative", impact: -5.5, correlation: -0.68, sector: "Battery", parentId: "catl_co" },
      { id: "samsung_co", label: "Samsung SDI", type: "negative", impact: -5.0, correlation: -0.64, sector: "Battery", parentId: "aapl_co" },
      { id: "lfp_win_co", label: "LFP wins market share", type: "positive", impact: 5.0, sector: "Battery Tech", parentId: "tsla_co" },
      { id: "drc_risk", label: "DRC political risk premium", type: "positive", impact: 6.0, sector: "Geopolitical", parentId: "glen" }
    ]},
    { nodes: [
      { id: "ev_cost_co", label: "EV battery pack cost ↑", type: "negative", impact: -4.0, sector: "Automotive", parentId: "lgchem" },
      { id: "phone_asp", label: "Smartphone ASP pressure", type: "negative", impact: -1.5, sector: "Consumer Electronics", parentId: "samsung_co" },
      { id: "cobalt_free", label: "Cobalt-free chemistry R&D", type: "positive", impact: 4.0, sector: "Research", parentId: "lfp_win_co" }
    ]},
    { nodes: [
      { id: "ev_sub_co", label: "EV affordability gap widens", type: "negative", impact: -2.5, sector: "Consumer", parentId: "ev_cost_co" },
      { id: "chin_supply", label: "Chinese supply chain leverage", type: "positive", impact: 3.0, sector: "Geopolitical", parentId: "drc_risk" }
    ]}
  ]
};
</script>

## Winners

**Glencore** is uniquely positioned as the world's largest cobalt producer with major DRC assets. Price spikes directly boost earnings from their cobalt marketing and mining operations.

**Battery recyclers (Li-Cycle, Redwood Materials)** become more economically viable when virgin cobalt prices spike, making secondary recovery from end-of-life batteries more competitive.

## Losers

**Battery cell makers (CATL, LG ES, Samsung SDI)** face direct cost increases, particularly for NMC chemistry products. The impact passes through to OEM battery supply agreements with a quarter or two of lag.

**EV affordability** suffers at the consumer level — high cobalt prices push up battery pack costs, widening the price gap between EVs and ICE vehicles.

## Key Takeaway

Cobalt is the critical minerals market where geopolitical concentration risk is most acute. Any DRC stability deterioration or Chinese supply constraint is an immediate price catalyst. The strategic response — cobalt-free LFP adoption, recycling investment, alternative chemistries — is accelerating, but the transition takes years. For now, Glencore's cobalt exposure is the cleanest way to trade a price spike.
"""),

# ---- SOYBEANS ----
("2026-03-22-soybeans-livestock-biofuel.md", """---
layout: post
title: "Soybean Price Impact: Livestock Feed, Biofuel & the Agri-Food Chain"
date: 2026-03-22
categories: [Agriculture, Analysis]
tags: [soybeans, agriculture, livestock, biofuel, food, ADM, BG, TSN, REGI]
description: "Soybeans are dual-use: soybean meal feeds livestock while soybean oil powers renewable diesel. Price spikes ripple through chicken, pork, beef, and the entire food supply chain."
reading_time: 8
commodity_name: "Soybeans"
image: /assets/images/og-soybeans.png
canonical_url: https://commoditynode.com/soybeans-livestock-biofuel/
---

Soybeans occupy a unique position in global agricultural markets — they're simultaneously a protein source (soybean meal for animal feed), an energy source (soybean oil for biodiesel and renewable diesel), and a geopolitical lever between the US and China. No other single crop has as many downstream transmission channels into consumer food prices, energy policy, and international trade flows.

When soybean prices spike — whether from drought, export policy changes, or biodiesel mandates — the impact doesn't stay in the grain market. It moves through feed costs into chicken and pork prices, through renewable diesel economics into fuel markets, and through farmer income into agricultural equipment demand.

## The Impact Map

<div class="cn-price-chart" data-symbol="ZS=F" data-name="Soybeans (CBOT)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "soybeans", label: "Soybeans ↑15%", price: "$14.50/bu", change: "+15%" },
  levels: [
    { nodes: [
      { id: "adm_soy", label: "Archer-Daniels (ADM)", type: "positive", impact: 6.5, correlation: 0.71, marketCap: "30B", sector: "Agri-Processing" },
      { id: "bg_soy", label: "Bunge Global (BG)", type: "positive", impact: 5.5, correlation: 0.66, marketCap: "14B", sector: "Grain Trading" },
      { id: "tsn", label: "Tyson Foods (TSN)", type: "negative", impact: -7.5, correlation: -0.74, marketCap: "20B", sector: "Poultry/Protein" },
      { id: "regi", label: "REG / Renewable Energy Group", type: "positive", impact: 4.5, correlation: 0.61, sector: "Biodiesel" },
      { id: "de_soy", label: "Deere & Co (DE)", type: "positive", impact: 5.0, correlation: 0.62, marketCap: "120B", sector: "Farm Equipment" }
    ]},
    { nodes: [
      { id: "ppc", label: "Pilgrim's Pride (PPC)", type: "negative", impact: -8.0, correlation: -0.77, marketCap: "10B", sector: "Chicken", parentId: "tsn" },
      { id: "hrl", label: "Hormel Foods (HRL)", type: "negative", impact: -5.0, correlation: -0.62, marketCap: "18B", sector: "Pork/Protein", parentId: "tsn" },
      { id: "saf", label: "SAF / Renewable Diesel demand", type: "positive", impact: 3.5, sector: "Biofuel", parentId: "regi" },
      { id: "mosaic_soy", label: "Mosaic (MOS) — farmer spending ↑", type: "positive", impact: 4.0, correlation: 0.55, sector: "Fertilizer", parentId: "de_soy" },
      { id: "china_import", label: "China import patterns", type: "negative", impact: -4.0, sector: "International", parentId: "adm_soy" }
    ]},
    { nodes: [
      { id: "food_cpi_soy", label: "Chicken/Pork CPI ↑", type: "negative", impact: -3.0, sector: "Consumer", parentId: "ppc" },
      { id: "fast_food", label: "McDonald's / YUM margins", type: "negative", impact: -2.5, sector: "Restaurants", parentId: "hrl" },
      { id: "brazil_soy", label: "Brazil soy competition", type: "negative", impact: -3.5, sector: "International", parentId: "china_import" }
    ]},
    { nodes: [
      { id: "consumer_food", label: "Grocery food inflation", type: "negative", impact: -2.0, sector: "Macro", parentId: "food_cpi_soy" },
      { id: "corn_sub", label: "Corn/wheat substitution", type: "negative", impact: -2.5, sector: "Grains", parentId: "brazil_soy" }
    ]}
  ]
};
</script>

## Winners

**Grain traders and processors (ADM, BG)** benefit from wider crush margins when soybean prices rise relative to meal/oil, and from higher commodity trading volumes. Bunge is particularly exposed to South American soy flows.

**Biodiesel producers** benefit when soy oil prices rise relative to petroleum diesel — the economics of renewable diesel and SAF production improve.

**Farm equipment (Deere)** benefits from improved farmer income and sentiment leading to capital equipment purchases.

## Losers

**Livestock producers (TSN, PPC, HRL)** face direct feed cost increases. Soybean meal typically represents 25–40% of broiler feed costs. Tyson and Pilgrim's face the most direct impact given their integrated poultry operations.

**QSR chains (MCD, YUM)** see upstream cost pressure from chicken and pork suppliers, which eventually flows into food costs and menu pricing decisions.

## Key Takeaway

The soybean market is the most globally connected agricultural commodity. Watch three signals: the USDA WASDE report (supply/demand revisions), Brazil harvest progress (January–April), and China buying patterns (weekly USDA export inspections). When all three align bearishly for supply, soybean prices move fast and the livestock sector gets squeezed hard within 60 days.
"""),

# ---- PLATINUM ----
("2026-03-22-platinum-automotive-catalysts.md", """---
layout: post
title: "Platinum Price Impact: Auto Catalysts, Fuel Cells & Hydrogen Economy"
date: 2026-03-22
categories: [Precious Metals, Analysis]
tags: [platinum, automotive, hydrogen, fuel-cells, precious-metals, ANGPY, SBSW, TM]
description: "Platinum's dual role in autocatalysts and hydrogen fuel cells makes it a critical metals play. Impact map showing sensitivity for Anglo American Platinum, Sibanye, and automotive catalyst demand chains."
reading_time: 8
commodity_name: "Platinum"
image: /assets/images/og-platinum.png
canonical_url: https://commoditynode.com/platinum-automotive-catalysts/
---

Platinum occupies a paradoxical position in the commodities universe: it's a precious metal that trades at a significant discount to gold, yet its industrial demand profile makes it arguably more strategically important. The vast majority of global platinum supply comes from South Africa's Bushveld Complex and Russia, creating both a geographic concentration risk and a currency dynamic (ZAR/USD) that affects the economics of production.

The emerging hydrogen economy has added a new demand driver — platinum is the preferred catalyst for PEM (proton exchange membrane) electrolyzer and fuel cell technology, meaning its long-term demand outlook is tied to the pace of hydrogen infrastructure buildout globally.

## The Impact Map

<div class="cn-price-chart" data-symbol="PL=F" data-name="Platinum (NYMEX)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "platinum", label: "Platinum ↑15%", price: "$1,100/oz", change: "+15%" },
  levels: [
    { nodes: [
      { id: "angpy", label: "Anglo American Platinum", type: "positive", impact: 14.0, correlation: 0.88, sector: "PGM Mining" },
      { id: "sbsw", label: "Sibanye Stillwater (SBSW)", type: "positive", impact: 12.0, correlation: 0.85, marketCap: "5B", sector: "PGM Mining" },
      { id: "tm_plat", label: "Toyota (TM) — catalyst cost", type: "negative", impact: -3.0, correlation: -0.44, marketCap: "280B", sector: "Automotive" },
      { id: "plug", label: "Plug Power (PLUG)", type: "positive", impact: 5.0, correlation: 0.58, marketCap: "3B", sector: "Hydrogen" },
      { id: "be_fuel", label: "Bloom Energy (BE)", type: "positive", impact: 4.0, correlation: 0.51, marketCap: "4B", sector: "Fuel Cells" }
    ]},
    { nodes: [
      { id: "diesel_cat", label: "Diesel autocatalyst demand", type: "positive", impact: 8.0, correlation: 0.72, sector: "Automotive", parentId: "angpy" },
      { id: "palladium_sub", label: "Palladium substitution ↑", type: "positive", impact: 6.0, sector: "PGM", parentId: "sbsw" },
      { id: "hyd_infra", label: "Hydrogen infrastructure cost ↑", type: "negative", impact: -4.5, sector: "Clean Energy", parentId: "plug" },
      { id: "jewelry_plat", label: "Platinum jewelry demand (Asia)", type: "positive", impact: 3.0, sector: "Consumer", parentId: "angpy" }
    ]},
    { nodes: [
      { id: "euro6", label: "Euro 6 emissions compliance", type: "positive", impact: 5.0, sector: "Regulatory", parentId: "diesel_cat" },
      { id: "fcev_cost", label: "FCEV vehicle cost ↑", type: "negative", impact: -3.5, sector: "Automotive", parentId: "hyd_infra" },
      { id: "zar_plat", label: "ZAR/USD impact on supply", type: "positive", impact: 4.0, sector: "Currency", parentId: "sbsw" }
    ]},
    { nodes: [
      { id: "euro_auto", label: "European auto margins", type: "negative", impact: -2.0, sector: "Automotive", parentId: "euro6" },
      { id: "h2_policy", label: "Hydrogen policy acceleration", type: "positive", impact: 3.5, sector: "Policy", parentId: "fcev_cost" }
    ]}
  ]
};
</script>

## Winners

**PGM miners (Anglo American Platinum, Sibanye Stillwater, Impala)** are the primary direct beneficiaries. These companies have significant fixed-cost structures, so margin leverage to platinum price is high.

**Palladium-to-platinum substitution** creates additional demand uplift — as platinum becomes more attractive relative to palladium for gasoline autocatalysts, automotive companies accelerate the switch, adding demand.

## Losers

**Hydrogen technology companies** face a complex trade-off: high platinum prices validate their technology's importance but increase electrolyzer and fuel cell costs, potentially slowing adoption curves.

**Diesel vehicle OEMs** see higher catalyst costs at a time when diesel faces structural regulatory headwinds in Europe and elsewhere.

## Key Takeaway

Platinum is the most bifurcated precious metal story: bearish near-term (diesel decline) versus bullish long-term (hydrogen scale-up). The cleanest trade is the platinum/palladium spread — when it compresses below $500/oz, it typically signals a rebalancing catalyst substitution opportunity.
"""),

# ---- SUGAR ----
("2026-03-23-sugar-ethanol-food-impact.md", """---
layout: post
title: "Sugar Price Surge: Ethanol, Food & Beverage, and Emerging Market Impact"
date: 2026-03-23
categories: [Agriculture, Analysis]
tags: [sugar, agriculture, ethanol, food, beverage, biofuel, KO, PEP, RAIZ]
description: "Sugar is both a food commodity and an energy feedstock via Brazilian ethanol. Price spikes ripple through Coca-Cola, PepsiCo, candy makers, and food CPI globally — interactive impact map."
reading_time: 7
commodity_name: "Sugar"
image: /assets/images/og-sugar.png
canonical_url: https://commoditynode.com/sugar-ethanol-food-impact/
---

Sugar is one of the most politically sensitive agricultural commodities in the world, with heavy government intervention in major producing countries (Brazil, India, Thailand) and strong cultural ties to food prices in emerging markets. Yet it's also increasingly an energy commodity — Brazil's sugarcane mills can switch flex between sugar and ethanol production, making sugar prices linked to crude oil economics.

When sugar prices spike — whether from weather events in Brazil, Indian export restrictions, or crude oil economics pulling sugarcane toward ethanol — the ripple hits food & beverage companies' cost structures, confectionery margins, and consumer food budgets from Indonesia to Mexico.

## The Impact Map

<div class="cn-price-chart" data-symbol="SB=F" data-name="Sugar No. 11 (ICE)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "sugar", label: "Sugar ↑20%", price: "28¢/lb", change: "+20%" },
  levels: [
    { nodes: [
      { id: "ko_sug", label: "Coca-Cola (KO)", type: "negative", impact: -3.5, correlation: -0.51, marketCap: "260B", sector: "Beverages" },
      { id: "pep_sug", label: "PepsiCo (PEP)", type: "negative", impact: -3.0, correlation: -0.47, marketCap: "230B", sector: "Beverages" },
      { id: "mdlz", label: "Mondelez (MDLZ)", type: "negative", impact: -5.5, correlation: -0.65, marketCap: "85B", sector: "Confectionery" },
      { id: "brazil_eth", label: "Brazil ethanol economics", type: "positive", impact: 7.0, correlation: 0.73, sector: "Biofuel" },
      { id: "hs_sug", label: "Hershey (HSY)", type: "negative", impact: -6.0, correlation: -0.68, marketCap: "34B", sector: "Candy" }
    ]},
    { nodes: [
      { id: "syrup", label: "HFCS substitution demand", type: "positive", impact: 4.0, sector: "Food Ingredients", parentId: "ko_sug" },
      { id: "coty_food", label: "General Mills (GIS)", type: "negative", impact: -3.5, correlation: -0.49, marketCap: "32B", sector: "Packaged Food", parentId: "pep_sug" },
      { id: "wrigley", label: "Mars / Ferrero margins", type: "negative", impact: -5.0, sector: "Confectionery", parentId: "mdlz" },
      { id: "raiz", label: "Raizen (RAIZ3.SA)", type: "positive", impact: 12.0, correlation: 0.87, sector: "Sugarcane", parentId: "brazil_eth" }
    ]},
    { nodes: [
      { id: "qsr_sug", label: "QSR dessert margins", type: "negative", impact: -2.0, sector: "Restaurants", parentId: "coty_food" },
      { id: "india_export", label: "India export ban risk", type: "positive", impact: 8.0, sector: "Policy", parentId: "raiz" },
      { id: "sweetener", label: "Stevia / sucralose pricing", type: "positive", impact: 3.5, sector: "Alternative Sweeteners", parentId: "syrup" }
    ]},
    { nodes: [
      { id: "em_food", label: "EM food CPI pressure", type: "negative", impact: -3.0, sector: "Macro", parentId: "qsr_sug" },
      { id: "biofuel_pol", label: "Brazilian energy policy", type: "positive", impact: 4.0, sector: "Policy", parentId: "india_export" }
    ]}
  ]
};
</script>

## Winners

**Brazilian sugarcane producers (Raizen, São Martinho)** benefit directly from higher sugar prices. Brazil's flex mills can also optimize between sugar and ethanol production in real-time, giving them maximum upside capture.

**Alternative sweetener companies** benefit as food manufacturers seek to reduce sugar exposure through HFCS (high-fructose corn syrup), stevia, or sucralose substitution.

## Losers

**Confectionery and beverage companies (KO, PEP, MDLZ, HSY)** face direct cost increases. Sugar is a top-5 input cost for companies like Hershey and Mondelez, and price volatility compresses margins in quarters when contracts reset.

**Emerging market consumers** feel sugar price spikes acutely — sugar is a core calorie source in many developing markets, and price spikes directly drive food inflation and political sensitivity.

## Key Takeaway

Sugar is a bimodal commodity — food demand provides a floor, energy economics (Brazilian ethanol parity) provide a ceiling. When crude oil rises, Brazilian mills shift toward ethanol, tightening sugar supply. Monitor Brazil's Center-South harvest data (April–November) and India's export policy as the two key catalysts for major sugar price moves.
"""),

# ---- ZINC ----
("2026-03-22-zinc-galvanizing-construction.md", """---
layout: post
title: "Zinc Price Impact: Galvanizing, Construction & Auto Supply Chains"
date: 2026-03-22
categories: [Metals, Analysis]
tags: [zinc, metals, construction, automotive, galvanizing, TECK, GLENCORE, CAT]
description: "Zinc is the galvanizing metal behind steel corrosion protection. Price spikes ripple through construction, automotive, and infrastructure — interactive impact map for Teck, Glencore, and downstream users."
reading_time: 7
commodity_name: "Zinc"
image: /assets/images/og-zinc.png
canonical_url: https://commoditynode.com/zinc-galvanizing-construction/
---

Zinc rarely makes headlines, but it's the quiet enabler of modern infrastructure. Approximately 50% of all zinc produced globally goes into galvanizing — coating steel to protect it from corrosion. That galvanized steel goes into bridges, buildings, cars, and electrical transmission towers. When zinc prices move, the impact shows up in construction bid margins, automotive steel costs, and infrastructure project economics.

The zinc market is also one of the most supply-concentrated in metals, with major mines in Australia (Teck's Red Dog), Peru, and China. Mine supply constraints or smelter outages can create rapid price dislocations that feed through to industrial users with limited short-term alternatives.

## The Impact Map

<div class="cn-price-chart" data-symbol="TECK" data-name="Zinc (Teck Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "zinc", label: "Zinc ↑15%", price: "$3,200/ton", change: "+15%" },
  levels: [
    { nodes: [
      { id: "teck", label: "Teck Resources (TECK)", type: "positive", impact: 12.0, correlation: 0.83, marketCap: "22B", sector: "Mining" },
      { id: "glen_zn", label: "Glencore zinc assets", type: "positive", impact: 7.0, correlation: 0.71, sector: "Mining" },
      { id: "cat_zn", label: "Caterpillar (CAT)", type: "negative", impact: -3.0, correlation: -0.45, marketCap: "160B", sector: "Equipment" },
      { id: "nue_zn", label: "Nucor (NUE) galv cost", type: "negative", impact: -4.5, correlation: -0.57, marketCap: "35B", sector: "Steel" },
      { id: "gm_zn", label: "GM (GM) — body panels", type: "negative", impact: -2.5, correlation: -0.41, marketCap: "50B", sector: "Automotive" }
    ]},
    { nodes: [
      { id: "infrastructure", label: "Infrastructure project costs", type: "negative", impact: -3.5, sector: "Construction", parentId: "nue_zn" },
      { id: "roofing", label: "Metal roofing / cladding ↑", type: "negative", impact: -4.0, sector: "Building Materials", parentId: "cat_zn" },
      { id: "ford_zn", label: "Ford (F) steel input cost", type: "negative", impact: -2.0, correlation: -0.38, sector: "Automotive", parentId: "gm_zn" },
      { id: "battery_zn", label: "Zinc-air batteries demand", type: "positive", impact: 6.0, sector: "Energy Storage", parentId: "glen_zn" }
    ]},
    { nodes: [
      { id: "housing_zn", label: "Homebuilder (DHI, LEN) margins", type: "negative", impact: -2.5, sector: "Real Estate", parentId: "infrastructure" },
      { id: "rebar_zn", label: "Rebar/structural steel premium", type: "negative", impact: -2.0, sector: "Construction", parentId: "roofing" },
      { id: "battery_tech_zn", label: "Grid storage alt. to lithium", type: "positive", impact: 4.5, sector: "Clean Energy", parentId: "battery_zn" }
    ]},
    { nodes: [
      { id: "cpi_zn", label: "Construction CPI component", type: "negative", impact: -1.5, sector: "Macro", parentId: "housing_zn" }
    ]}
  ]
};
</script>

## Winners

**Zinc miners (Teck, Glencore)** benefit directly from price increases. Teck's Red Dog mine in Alaska is one of the world's largest zinc operations, and the metal contributes meaningfully to earnings at elevated prices.

**Zinc-air battery technology** gains commercial viability as zinc prices rise — paradoxically, higher commodity prices can accelerate technology investment as developers seek to lock in supply economics.

## Losers

**Steel galvanizers and downstream users** (auto OEMs, construction companies) face margin pressure. Galvanizing represents a significant portion of steel processing costs for corrosion-resistant products.

**Infrastructure project developers** see bid economics deteriorate when zinc-heavy galvanized steel costs spike — this can delay project starts or compress contractor margins.

## Key Takeaway

Zinc is a high-beta infrastructure play. It typically underperforms in construction downturns and dramatically outperforms in infrastructure build cycles. With major infrastructure packages active globally, watch for zinc demand as a real-time indicator of infrastructure project activity. LME inventory levels and Chinese smelter operating rates are the key short-term price drivers.
"""),

# ---- COTTON ----
("2026-03-23-cotton-textile-apparel-impact.md", """---
layout: post
title: "Cotton Price Impact: Textile, Fast Fashion & the Global Apparel Chain"
date: 2026-03-23
categories: [Agriculture, Analysis]
tags: [cotton, agriculture, textile, apparel, fashion, HBI, PVH, NKE, VFC]
description: "Cotton price swings flow through textile mills, clothing brands, and fast fashion retailers with a 6-12 month lag. Impact map for Nike, PVH, Hanesbrands, and the global apparel supply chain."
reading_time: 7
commodity_name: "Cotton"
image: /assets/images/og-cotton.png
canonical_url: https://commoditynode.com/cotton-textile-apparel-impact/
---

Cotton is the original global commodity — traded for centuries, grown on five continents, and woven into the clothing of billions. But its price journey from farm to finished garment is surprisingly long, creating an unusual 6–12 month lag between spot price moves and earnings impact at apparel brands.

By the time cotton fiber is spun into yarn, woven into fabric, cut and sewn in Vietnam or Bangladesh, shipped to a distribution center, and put on a shelf, the cotton price spike that triggered the supply chain adjustment may have already reversed. This makes cotton a uniquely challenging commodity for apparel company earnings forecasting — and a rich source of mispriced stocks when the market fails to account for the lag.

## The Impact Map

<div class="cn-price-chart" data-symbol="CT=F" data-name="Cotton No. 2 (ICE)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "cotton", label: "Cotton ↑20%", price: "90¢/lb", change: "+20%" },
  levels: [
    { nodes: [
      { id: "hbi", label: "Hanesbrands (HBI)", type: "negative", impact: -11.0, correlation: -0.82, marketCap: "2B", sector: "Basics Apparel" },
      { id: "pvh", label: "PVH Corp (PVH)", type: "negative", impact: -7.5, correlation: -0.72, marketCap: "6B", sector: "Apparel" },
      { id: "vfc", label: "VF Corp (VFC)", type: "negative", impact: -6.0, correlation: -0.68, marketCap: "4B", sector: "Apparel" },
      { id: "nke_cot", label: "Nike (NKE)", type: "negative", impact: -4.0, correlation: -0.55, marketCap: "120B", sector: "Athletic" },
      { id: "cotton_gin", label: "Cotton gin operators ↑", type: "positive", impact: 8.0, correlation: 0.81, sector: "Processing" }
    ]},
    { nodes: [
      { id: "spin_yarn", label: "Yarn spinners (Asia margin)", type: "negative", impact: -9.0, correlation: -0.83, sector: "Textile", parentId: "hbi" },
      { id: "shein_zara", label: "Fast fashion (ZARA/Shein) cost", type: "negative", impact: -5.5, correlation: -0.66, sector: "Fast Fashion", parentId: "pvh" },
      { id: "gap", label: "Gap Inc (GPS)", type: "negative", impact: -5.0, correlation: -0.63, marketCap: "4B", sector: "Apparel", parentId: "vfc" },
      { id: "synth_sub", label: "Polyester substitution demand", type: "positive", impact: 6.0, sector: "Synthetic Fibers", parentId: "nke_cot" }
    ]},
    { nodes: [
      { id: "bangladesh", label: "Bangladesh mill margin squeeze", type: "negative", impact: -7.0, sector: "Manufacturing", parentId: "spin_yarn" },
      { id: "apparel_cpi", label: "Apparel CPI rises (6-12mo lag)", type: "negative", impact: -3.5, sector: "Consumer", parentId: "shein_zara" },
      { id: "indorama", label: "Indorama Ventures (polyester)", type: "positive", impact: 5.5, sector: "Petrochems", parentId: "synth_sub" }
    ]},
    { nodes: [
      { id: "consumer_app", label: "Consumer apparel spend shifts", type: "negative", impact: -2.0, sector: "Consumer", parentId: "apparel_cpi" },
      { id: "us_cotton", label: "US cotton farmer income ↑", type: "positive", impact: 7.0, sector: "Agriculture", parentId: "cotton_gin" }
    ]}
  ]
};
</script>

## Winners

**US cotton farmers and ginners** are the direct beneficiaries. The US is a major cotton exporter, and price spikes improve farm income significantly, supporting agricultural equipment and rural economy activity.

**Synthetic fiber producers (Indorama, Reliance Industries)** benefit from substitution demand as apparel manufacturers accelerate their shift from cotton to polyester when cotton prices spike.

## Losers

**Basics apparel companies (HBI)** have the most direct and least-diversified exposure — Hanesbrands' T-shirts, underwear, and socks are cotton-intensive, and their private-label, basics-focused business model offers less pricing power than premium brands.

**Fast fashion retailers** face a margin squeeze since their compressed sourcing cycles provide less time to negotiate new pricing with manufacturers.

## Key Takeaway

The cotton lag effect is the key to trading apparel stocks around commodity moves: buy on the spike (6 months early for stock price reaction) and sell when the earnings impact hits the income statement. The USDA's monthly supply/demand report (WASDE) and Chinese reserve auction announcements are the primary price catalysts for cotton.
"""),

# ---- COCOA ----
("2026-03-23-cocoa-chocolate-confectionery.md", """---
layout: post
title: "Cocoa Price Surge: Chocolate Brands, Confectionery & West Africa Supply Risk"
date: 2026-03-23
categories: [Agriculture, Analysis]
tags: [cocoa, agriculture, food, confectionery, chocolate, HSY, MDLZ, NESN]
description: "The 2024-2026 cocoa price surge to record highs is reshaping chocolate brand economics globally. Impact map for Hershey, Mondelez, Nestle and the entire confectionery supply chain."
reading_time: 8
commodity_name: "Cocoa"
image: /assets/images/og-cocoa.png
canonical_url: https://commoditynode.com/cocoa-chocolate-confectionery/
---

Cocoa's 2024 price surge to over $12,000 per metric ton — more than triple its historical average — was one of the most dramatic agricultural commodity dislocations in recent memory. It was driven by a combination of El Niño-induced crop failures in West Africa, structural aging of cocoa trees in Ghana and Côte d'Ivoire, and fungal disease outbreaks that reduced yields for two consecutive seasons.

The result: Hershey and Mondelez reported their worst margin environments in years, "shrinkflation" hit chocolate bars globally, and premium chocolate brands began competing with commodity products in ways previously unseen. Understanding cocoa's supply concentration and demand inelasticity is essential for anyone holding consumer staples positions.

## The Impact Map

<div class="cn-price-chart" data-symbol="CC=F" data-name="Cocoa (ICE)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "cocoa", label: "Cocoa ↑30%", price: "$10,000/ton", change: "+30%" },
  levels: [
    { nodes: [
      { id: "hsy", label: "Hershey Company (HSY)", type: "negative", impact: -14.0, correlation: -0.86, marketCap: "34B", sector: "Candy" },
      { id: "mdlz_co", label: "Mondelez (MDLZ)", type: "negative", impact: -9.5, correlation: -0.78, marketCap: "85B", sector: "Confectionery" },
      { id: "nesn", label: "Nestlé (NESN.SW)", type: "negative", impact: -6.5, correlation: -0.69, sector: "Food & Bev" },
      { id: "lindt", label: "Lindt & Sprüngli", type: "negative", impact: -8.0, correlation: -0.74, sector: "Premium Chocolate" },
      { id: "ivory_gh", label: "Ivory Coast / Ghana exports ↑", type: "positive", impact: 15.0, correlation: 0.90, sector: "Producer" }
    ]},
    { nodes: [
      { id: "cargill_co", label: "Cargill cocoa grinding", type: "positive", impact: 5.0, correlation: 0.62, sector: "Commodity Trade", parentId: "ivory_gh" },
      { id: "shrink", label: "Shrinkflation / price hikes", type: "negative", impact: -5.0, sector: "Consumer", parentId: "hsy" },
      { id: "pvt_label", label: "Private label chocolate gains", type: "positive", impact: 6.0, sector: "Retail", parentId: "mdlz_co" },
      { id: "premium_down", label: "Premiumization reverses", type: "negative", impact: -4.5, sector: "Retail", parentId: "lindt" }
    ]},
    { nodes: [
      { id: "grocery_coc", label: "Grocery chain shelf economics", type: "negative", impact: -2.5, sector: "Retail", parentId: "shrink" },
      { id: "alt_sweet_co", label: "Carob / alternative ingredients", type: "positive", impact: 3.0, sector: "Ingredients", parentId: "pvt_label" },
      { id: "el_nino", label: "El Niño / climate cycle", type: "negative", impact: -8.0, sector: "Weather/Macro", parentId: "ivory_gh" }
    ]},
    { nodes: [
      { id: "consumer_conf", label: "Consumer trade-down in candy", type: "negative", impact: -3.0, sector: "Consumer", parentId: "grocery_coc" },
      { id: "certified", label: "Certified sustainable cocoa premium", type: "positive", impact: 2.5, sector: "ESG", parentId: "alt_sweet_co" }
    ]}
  ]
};
</script>

## Winners

**West African producing countries** (Côte d'Ivoire and Ghana control ~60% of global supply) benefit enormously from price spikes, though this rarely translates to farmer-level income given government marketing board structures.

**Commodity trading houses (Cargill, Barry Callebaut)** with grinding operations benefit from wider processing margins and volatility trading opportunities.

## Losers

**Chocolate brand companies (HSY, MDLZ)** face the most direct impact. Hershey's business is nearly pure chocolate, making it uniquely exposed. Mondelez has a larger snack portfolio that provides partial insulation.

**Premium and specialty chocolate** faces a demand destruction risk — as prices spike, consumers trade down from $8 artisan bars to private-label alternatives.

## Key Takeaway

Cocoa is a stark reminder that concentration of agricultural supply in fragile regions creates tail risk. The 2024 episode demonstrated that multi-year supply damage (tree aging, disease) can drive price spikes that last far longer than one crop cycle. For investors: Hershey's forward cocoa hedge coverage (disclosed quarterly) is the most actionable signal for timing entry into an HSY position around cocoa dislocations.
"""),

# ---- TIN ----
("2026-03-22-tin-electronics-semiconductor.md", """---
layout: post
title: "Tin Price Impact: Semiconductors, Electronics & the Solder Supply Chain"
date: 2026-03-22
categories: [Metals, Analysis]
tags: [tin, metals, semiconductor, electronics, solder, INTC, AMAT, MSFT]
description: "Tin is the invisible metal in every circuit board — as solder, it connects the semiconductor economy. Price spikes ripple through chip manufacturers, electronics assemblers, and PCB producers."
reading_time: 7
commodity_name: "Tin"
image: /assets/images/og-tin.png
canonical_url: https://commoditynode.com/tin-electronics-semiconductor/
---

Tin may be the least-discussed metal in the technology supply chain, but it's literally what holds it together. Approximately 50% of global tin consumption goes into solder — the metallic alloy that creates electrical connections on circuit boards. Every smartphone, server, electric vehicle control unit, and satellite contains tin solder in its electronics. When tin prices spike, the ripple runs through the entire electronics manufacturing value chain.

The tin market is also one of the smallest major base metals markets by volume, making it susceptible to supply disruptions from key producing regions (Indonesia, Myanmar, China) that can move prices rapidly.

## The Impact Map

<div class="cn-price-chart" data-symbol="SN=F" data-name="Tin (LME Proxy)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "tin", label: "Tin ↑20%", price: "$35,000/ton", change: "+20%" },
  levels: [
    { nodes: [
      { id: "myanmar_tin", label: "Myanmar Wa State tin", type: "positive", impact: 15.0, correlation: 0.88, sector: "Mining" },
      { id: "amat", label: "Applied Materials (AMAT)", type: "negative", impact: -3.5, correlation: -0.48, marketCap: "190B", sector: "Semiconductor Equipment" },
      { id: "foxconn", label: "Foxconn / EMS assembly cost", type: "negative", impact: -4.0, correlation: -0.55, sector: "Electronics Assembly" },
      { id: "pcb_mfg", label: "PCB manufacturers (margin)", type: "negative", impact: -6.5, correlation: -0.71, sector: "PCB" },
      { id: "alphametals", label: "Alpha Metals / solder suppliers", type: "positive", impact: 10.0, correlation: 0.84, sector: "Solder" }
    ]},
    { nodes: [
      { id: "tsmc_tin", label: "TSMC packaging costs", type: "negative", impact: -2.5, correlation: -0.41, sector: "Semiconductor", parentId: "amat" },
      { id: "aapl_tin", label: "Apple BOM cost ↑", type: "negative", impact: -1.5, correlation: -0.32, marketCap: "3.5T", sector: "Consumer Tech", parentId: "foxconn" },
      { id: "ev_pcb", label: "EV control unit PCB cost", type: "negative", impact: -3.5, correlation: -0.51, sector: "Automotive", parentId: "pcb_mfg" },
      { id: "lead_free", label: "Lead-free solder premium", type: "positive", impact: 5.0, sector: "Regulatory", parentId: "alphametals" }
    ]},
    { nodes: [
      { id: "iphone_bom", label: "iPhone BOM increase $2-4", type: "negative", impact: -1.5, sector: "Consumer Electronics", parentId: "aapl_tin" },
      { id: "server_cost", label: "Server/data center build cost ↑", type: "negative", impact: -2.5, sector: "Cloud Infrastructure", parentId: "tsmc_tin" },
      { id: "recycling_tin", label: "E-waste tin recovery value ↑", type: "positive", impact: 4.5, sector: "Recycling", parentId: "lead_free" }
    ]},
    { nodes: [
      { id: "hyperscaler", label: "Hyperscaler capex efficiency", type: "negative", impact: -1.5, sector: "Cloud", parentId: "server_cost" },
      { id: "indo_supply", label: "Indonesia regulatory supply", type: "positive", impact: 6.0, sector: "Policy", parentId: "myanmar_tin" }
    ]}
  ]
};
</script>

## Winners

**Tin miners and processors** in Indonesia and the smelting operators in Malaysia benefit directly. The Alphametals/Henkel solder business also sees revenue gains when tin prices spike, as solder pricing follows the metal cost.

**E-waste recyclers** see improved economics for tin recovery as the value of recovered tin from circuit boards increases.

## Losers

**EMS companies (Foxconn, Jabil, Flex)** face direct solder cost increases. While tin is a small share of total electronics BOM cost (~0.5–2%), a sharp price spike can still move margins meaningfully in a low-margin contract manufacturing business.

**PCB manufacturers** are most directly affected, as solder is core to their manufacturing process.

## Key Takeaway

Tin is a small market with outsized impact on electronics manufacturing costs during supply disruptions. The Myanmar conflict and Indonesian regulatory shifts are the two key supply-side monitoring points. Watch LME tin inventory levels and Indonesian export licensing announcements as leading indicators of tightening supply.
"""),

]

for filename, content in posts:
    path = os.path.join(POSTS_DIR, filename)
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(content)
        print(f"Created: {filename}")
    else:
        print(f"Exists: {filename}")

print(f"\nDone. Total posts in {POSTS_DIR}: {len(os.listdir(POSTS_DIR))}")
