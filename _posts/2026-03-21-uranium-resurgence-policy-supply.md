---
layout: post
title: 'Uranium Resurgence: Policy Tailwinds and Supply Deficit'
date: 2026-03-21
categories: [Energy, Event Update]
tags: [uranium, nuclear, energy, CCJ, URA, NXE, LEU, clean-energy]
description: 'Uranium prices surge on nuclear policy tailwinds and deepening supply deficits — how reactor restarts and new builds reshape the uranium investment thesis.'
reading_time: 9
commodity_name: 'Uranium'
direction: bullish
image: /assets/images/og-uranium.png
---

Uranium spot prices have surged to $105 per pound of U3O8, an 18% gain since January and the highest level since the Fukushima-era panic selling of 2007. But unlike the speculative frenzy that briefly pushed uranium above $140 in that cycle, the current rally is underpinned by a confluence of policy support, structural supply deficits, and a global reassessment of nuclear energy's role in decarbonization that has no historical parallel. For the first time in a generation, governments in the United States, Europe, Japan, South Korea, China, and India are simultaneously expanding nuclear capacity, and the uranium market is not remotely prepared for the demand this creates.

The week's catalyst arrived on March 16, when Japan's Ministry of Economy, Trade and Industry (METI) announced the accelerated restart of four additional reactors -- Onagawa Unit 2, Takahama Units 3 and 4, and Shimane Unit 2 -- bringing Japan's operational reactor fleet to 18 units, up from just 9 in early 2025. Japan's nuclear share of electricity generation will reach 15% by Q3 2026, up from 7% a year ago, and the government has set an ambitious target of 20-22% by 2030. Each restarted reactor requires approximately 400,000 pounds of U3O8 equivalent for initial fueling, with 150,000-200,000 pounds of annual reload requirements thereafter. The four new restarts add roughly 2.2 million pounds of cumulative demand over the next three years.

But Japan is just one piece of a global nuclear renaissance. The U.S. Nuclear Regulatory Commission approved Vogtle Unit 4's full commercial operation in January 2026, and the Department of Energy's Loan Programs Office has committed $12 billion in conditional loan guarantees for next-generation nuclear projects, including NuScale's SMR deployment in Idaho and TerraPower's Natrium reactor in Wyoming. The European Commission's March 5 announcement classifying nuclear as a "strategic net-zero technology" under the Net-Zero Industry Act unlocked an estimated 50 billion euros in government-backed financing for reactor life extensions and new builds across France, the Czech Republic, Poland, and Finland. China continues its breakneck pace with 26 reactors under construction and plans to double nuclear capacity to 100 GW by 2035. The demand wave is building, and the uranium supply chain is not keeping pace.

<div class="cn-price-chart" data-symbol="URA" data-name="Uranium (U3O8)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "uranium", label: "Uranium ↑18%", price: "$105/lb", change: "+18%" },
  levels: [
    { nodes: [
      { id: "ccj", label: "Cameco (CCJ)", type: "producer", impact: 16.0, correlation: 0.92, marketCap: "28B", sector: "Uranium Mining" },
      { id: "nxe", label: "NexGen Energy (NXE)", type: "producer", impact: 22.0, correlation: 0.88, marketCap: "6B", sector: "Uranium Development" },
      { id: "ura_etf", label: "Global X Uranium (URA)", type: "etf", impact: 15.0, correlation: 0.94, marketCap: "3.5B", sector: "ETF" },
      { id: "leu", label: "Centrus Energy (LEU)", type: "processor", impact: 25.0, correlation: 0.82, marketCap: "3B", sector: "Enrichment" },
      { id: "ceg", label: "Constellation Energy (CEG)", type: "consumer", impact: 8.5, correlation: 0.65, marketCap: "72B", sector: "Nuclear Utility" },
      { id: "nat_gas_gen", label: "Natural Gas Generators", type: "consumer", impact: -4.5, correlation: -0.42, sector: "Power Generation" },
      { id: "uuuu", label: "Energy Fuels (UUUU)", type: "producer", impact: 20.0, correlation: 0.86, marketCap: "2.5B", sector: "Uranium Mining" },
      { id: "dnn", label: "Denison Mines (DNN)", type: "producer", impact: 24.0, correlation: 0.85, marketCap: "2B", sector: "Uranium Development" },
      { id: "urnm", label: "Sprott Uranium Miners (URNM)", type: "etf", impact: 18.0, correlation: 0.93, marketCap: "1.5B", sector: "ETF" },
      { id: "vst", label: "Vistra Corp (VST)", type: "consumer", impact: 6.5, correlation: 0.55, marketCap: "38B", sector: "Nuclear Utility" },
      { id: "bwxt", label: "BWX Technologies (BWXT)", type: "supplier", impact: 7.0, correlation: 0.52, marketCap: "10B", sector: "Nuclear Components" },
      { id: "fli", label: "Fission Uranium (FCU.TO)", type: "producer", impact: 26.0, correlation: 0.84, marketCap: "0.8B", sector: "Uranium Development" },
      { id: "glatf", label: "Global Atomic (GLO.TO)", type: "producer", impact: 28.0, correlation: 0.80, marketCap: "0.5B", sector: "Uranium Development" }
    ]},
    { nodes: [
      { id: "kazatom", label: "Kazatomprom (KAP.IL)", type: "producer", impact: 12.0, correlation: 0.85, marketCap: "15B", sector: "Uranium Mining", parentId: "ccj" },
      { id: "pdn", label: "Paladin Energy (PDN.AX)", type: "producer", impact: 21.0, correlation: 0.84, marketCap: "3B", sector: "Uranium Mining", parentId: "uuuu" },
      { id: "boss", label: "Boss Energy (BOE.AX)", type: "producer", impact: 23.0, correlation: 0.82, marketCap: "2B", sector: "Uranium Mining", parentId: "uuuu" },
      { id: "sput", label: "Sprott Physical Uranium (U.UN)", type: "etf", impact: 14.0, correlation: 0.96, marketCap: "6B", sector: "Physical Trust", parentId: "urnm" },
      { id: "smr_pipeline", label: "SMR Developers (NuScale, OKLO)", type: "supplier", impact: 12.0, correlation: 0.60, marketCap: "5B", sector: "Advanced Nuclear", parentId: "leu" },
      { id: "coal_gen", label: "Coal Power Plants", type: "consumer", impact: -5.0, correlation: -0.48, sector: "Power Generation", parentId: "nat_gas_gen" },
      { id: "conversion", label: "Conversion Services (Cameco/Orano)", type: "processor", impact: 15.0, correlation: 0.78, sector: "Fuel Cycle", parentId: "ccj" },
      { id: "tlw", label: "Talen Energy (TLN)", type: "consumer", impact: 5.5, correlation: 0.50, marketCap: "8B", sector: "Nuclear Utility", parentId: "ceg" },
      { id: "pse", label: "Public Service Ent (PEG)", type: "consumer", impact: 4.0, correlation: 0.42, marketCap: "38B", sector: "Nuclear Utility", parentId: "vst" },
      { id: "exel", label: "Exelon Corp (EXC)", type: "consumer", impact: 3.5, correlation: 0.38, marketCap: "42B", sector: "Nuclear Utility", parentId: "ceg" },
      { id: "orano", label: "Orano (Private)", type: "processor", impact: 10.0, correlation: 0.72, sector: "Enrichment/Fuel Cycle", parentId: "leu" },
      { id: "urenco", label: "Urenco (Private)", type: "processor", impact: 9.0, correlation: 0.68, sector: "Enrichment", parentId: "leu" }
    ]},
    { nodes: [
      { id: "renewable_port", label: "Pure Renewable Portfolios", type: "substitute", impact: -3.0, correlation: -0.30, sector: "Renewables", parentId: "coal_gen" },
      { id: "pnw", label: "Pinnacle West (PNW)", type: "consumer", impact: -2.5, correlation: -0.22, marketCap: "10B", sector: "Gas-Heavy Utility", parentId: "nat_gas_gen" },
      { id: "gev", label: "GE Vernova (GEV)", type: "supplier", impact: 5.0, correlation: 0.45, marketCap: "45B", sector: "Power Equipment", parentId: "bwxt" },
      { id: "fluor", label: "Fluor Corp (FLR)", type: "supplier", impact: 4.5, correlation: 0.40, marketCap: "8B", sector: "Nuclear Engineering", parentId: "bwxt" },
      { id: "bechtel", label: "Bechtel (Private)", type: "supplier", impact: 4.0, correlation: 0.38, sector: "Nuclear Construction", parentId: "smr_pipeline" },
      { id: "oklo", label: "Oklo Inc (OKLO)", type: "supplier", impact: 15.0, correlation: 0.58, marketCap: "3B", sector: "Advanced Nuclear", parentId: "smr_pipeline" },
      { id: "nuscale", label: "NuScale Power (SMR)", type: "supplier", impact: 14.0, correlation: 0.55, marketCap: "2.5B", sector: "SMR Developer", parentId: "smr_pipeline" },
      { id: "deep_yellow", label: "Deep Yellow (DYL.AX)", type: "producer", impact: 25.0, correlation: 0.82, marketCap: "1.5B", sector: "Uranium Development", parentId: "pdn" },
      { id: "cgn_mining", label: "CGN Mining (1164.HK)", type: "producer", impact: 10.0, correlation: 0.70, marketCap: "2B", sector: "Uranium Mining", parentId: "kazatom" },
      { id: "lotus", label: "Lotus Resources (LOT.AX)", type: "producer", impact: 27.0, correlation: 0.78, marketCap: "0.4B", sector: "Uranium Development", parentId: "boss" }
    ]},
    { nodes: [
      { id: "japan_restart", label: "Japan Reactor Restarts", type: "policy", impact: 9.0, sector: "Policy", parentId: "ccj" },
      { id: "us_policy", label: "U.S. Nuclear Policy Support", type: "policy", impact: 8.0, sector: "Policy", parentId: "leu" },
      { id: "eu_taxonomy", label: "EU Net-Zero Taxonomy", type: "policy", impact: 7.5, sector: "Policy", parentId: "ceg" },
      { id: "china_builds", label: "China Nuclear Buildout", type: "macro", impact: 8.5, sector: "Macro", parentId: "nxe" },
      { id: "supply_deficit", label: "Structural Supply Deficit", type: "macro", impact: 10.0, sector: "Macro", parentId: "kazatom" },
      { id: "russia_ban", label: "Russian Enrichment Ban", type: "policy", impact: 12.0, sector: "Policy", parentId: "orano" },
      { id: "data_center", label: "Data Center Power Demand", type: "macro", impact: 6.0, sector: "Macro", parentId: "ceg" },
      { id: "india_nuclear", label: "India Nuclear Expansion", type: "policy", impact: 5.0, sector: "Policy", parentId: "glatf" }
    ]},
    { nodes: [
      { id: "sulfuric_acid", label: "Sulfuric Acid Shortage (Kazakh)", type: "macro", impact: 7.0, sector: "Supply Constraint", parentId: "kazatom" },
      { id: "wna_demand", label: "WNA Demand Forecast", type: "macro", impact: 8.0, sector: "Demand Projection", parentId: "supply_deficit" },
      { id: "spot_term_spread", label: "Spot-Term Price Spread", type: "index", impact: 5.0, correlation: 0.55, sector: "Uranium Pricing", parentId: "sput" },
      { id: "niger_politics", label: "Niger Political Instability", type: "macro", impact: 6.0, sector: "Geopolitics", parentId: "orano" },
      { id: "haleu_premium", label: "HALEU Price Premium", type: "index", impact: 10.0, correlation: 0.72, sector: "Fuel Cycle", parentId: "leu" },
      { id: "kaz_logistics", label: "Kazakhstan Logistics (Sanctions)", type: "macro", impact: 5.0, sector: "Geopolitics", parentId: "kazatom" }
    ]}
  ]
};
</script>

## What's Driving the Uranium Resurgence

The uranium market has a unique supply-demand structure that amplifies price moves in both directions. Unlike oil or copper, where production can be ramped within months, uranium mine restarts require 3-5 years of permitting, development, and commissioning. The industry's supply infrastructure was systematically dismantled after Fukushima: between 2011 and 2020, global uranium mine production fell from 147 million pounds to 123 million pounds as low prices forced mine closures and care-and-maintenance across Kazakhstan, Canada, Australia, and the United States. Cameco's flagship McArthur River mine in Saskatchewan, the world's largest high-grade uranium deposit, was shut down for five years before restarting in 2022 and is still ramping back to full capacity.

Kazatomprom, the world's largest uranium producer at roughly 55 million pounds annually, has been the critical swing supplier. But the company disclosed in its February 2026 operational update that sulfuric acid shortages and well-field development delays would constrain 2026 production to 80% of its licensed capacity, approximately 48 million pounds versus the 60 million pounds the market had been expecting. This 12 million pound shortfall -- roughly 8% of global annual consumption of 150 million pounds -- sent shockwaves through the contract market and pushed the term price (the price for multi-year delivery contracts) above $90/lb for the first time, signaling that utilities can no longer rely on Kazakh supply to fill their requirements.

The demand pipeline is staggering. The World Nuclear Association's updated reactor database shows 440 operable reactors globally, with 65 under construction and 110 in the planning pipeline. If just half of the planned reactors proceed to construction, uranium demand will increase by 40-50 million pounds annually by 2035 -- an increase roughly equal to Kazatomprom's entire current annual output. The Sprott Physical Uranium Trust (U.UN) continues to absorb spot supply, having purchased 8 million pounds since January 2026, further tightening an already illiquid spot market. The flywheel effect of utility contracting, physical trust buying, and mine supply constraints is creating a price dynamic that veteran uranium traders compare to the 2005-2007 bull market, but with stronger fundamental underpinnings.

## Winners From This Move

### Uranium Miners

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Denison Mines (DNN)** | Development | +24.0% | 0.85 |
| **NexGen Energy (NXE)** | Development | +22.0% | 0.88 |
| **Energy Fuels (UUUU)** | Mining | +20.0% | 0.86 |
| **Cameco (CCJ)** | Mining | +16.0% | 0.92 |

**Why they win:** Uranium miners offer extraordinary leverage to the spot price because the industry has been in an extended investment drought. CCJ, the largest publicly traded pure-play uranium miner, has all-in costs of approximately $35/lb at McArthur River, meaning its margin at $105 uranium is approximately $70/lb -- a 67% operating margin that will produce record free cash flow in 2026. NXE's Rook I project in the Athabasca Basin has a projected AISC of $15/lb, potentially the lowest-cost uranium mine in the world once it enters production in 2029-2030. DNN's Wheeler River project offers similar economics. UUUU provides U.S.-based production leverage with additional optionality from its rare earth element processing operations.

**Key insight:** The distinction between producers (CCJ, UUUU) and developers (NXE, DNN) is critical. Producers benefit immediately from higher prices through existing production and contract re-pricing. Developers benefit through higher NPV of their projects and easier access to project financing, but they do not generate cash flow from uranium sales today. For near-term earnings leverage, CCJ and UUUU are the plays. For maximum beta to a sustained bull market, NXE and DNN offer 2-3x the upside with commensurately higher risk.

### Enrichment & Fuel Cycle

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Centrus Energy (LEU)** | Enrichment | +25.0% | 0.82 |
| **Conversion Services** | Fuel Cycle | +15.0% | 0.78 |

**Why they win:** Enrichment is arguably the tightest link in the nuclear fuel chain. Centrus Energy is one of only two enrichment companies with HALEU (High-Assay Low-Enriched Uranium) production capability in the United States, a critical fuel type for next-generation SMR reactors. The U.S. ban on Russian uranium enrichment services, which took full effect in January 2026, has redirected enrichment demand to LEU and European providers, creating a structural shortage that will persist for years as new centrifuge capacity is built. Conversion services (the step between mining and enrichment) face similar bottlenecks, with only three major conversion facilities globally operating at capacity.

**Key insight:** LEU is the highest-beta name in the uranium space because of its dual exposure to uranium prices and the HALEU premium. The company's HALEU demonstration contract with the DOE positions it as the sole domestic supplier for next-gen reactor fuel. However, LEU is also the most volatile and carries execution risk on its enrichment capacity expansion. The risk-reward is asymmetric: if the SMR buildout proceeds as planned, LEU could be a multi-bagger; if SMR timelines slip, the premium will compress.

### Nuclear Utilities & Components

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Constellation Energy (CEG)** | Nuclear Utility | +8.5% | 0.65 |
| **Vistra Corp (VST)** | Nuclear Utility | +6.5% | 0.55 |
| **BWX Technologies (BWXT)** | Nuclear Components | +7.0% | 0.52 |

**Why they win:** CEG operates the largest nuclear fleet in the United States with 21 GW of nuclear capacity across 12 power plants. While higher uranium prices increase fuel costs, CEG has long-term fuel supply contracts that insulate it from spot price moves. The real benefit is indirect: a higher uranium price validates the value of CEG's existing nuclear fleet and increases the replacement cost barrier for competitors. In an environment where data center power demand is surging and clean energy mandates are tightening, CEG's nuclear baseload generation is increasingly valuable. VST benefits similarly through its Comanche Peak nuclear station. BWXT manufactures nuclear fuel assemblies, naval reactors, and advanced nuclear components, positioning it as a picks-and-shovels play on the nuclear renaissance.

**Key insight:** CEG's recently announced Microsoft data center nuclear power purchase agreement at Three Mile Island Unit 1 (restart planned for 2028) is a template for how nuclear utilities will monetize their assets in the AI era. Watch for additional utility-tech partnerships that value nuclear power at a premium to market rates.

## Losers From This Move

### Natural Gas Generators

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Natural Gas Generators** | Power Generation | -4.5% | -0.42 |
| **Pinnacle West (PNW)** | Gas-Heavy Utility | -2.5% | -0.22 |

**Why they lose:** The nuclear renaissance is a direct competitive threat to natural gas in baseload power generation. Every gigawatt of nuclear capacity that comes online or restarts displaces gas-fired generation, particularly in regions where nuclear plants operate as must-run baseload. Japan's reactor restarts alone will displace approximately 15 million tonnes of annual LNG imports as nuclear takes back baseload share from gas turbines. In the U.S., the combination of new nuclear builds and reactor life extensions reduces the long-term demand trajectory for gas-fired generation, compressing the terminal value of gas generation assets. PNW, with its primarily gas and solar generation mix, faces relative disadvantage against nuclear-heavy peers.

**Key insight:** The impact is gradual rather than immediate, as reactor restarts and new builds take years to materialize. But the market is forward-looking, and the re-rating of nuclear utilities (CEG, VST) has come at the expense of gas-heavy utility multiples. The spread between CEG's and PNW's EV/EBITDA has widened from 2x to 5x over the past 18 months, reflecting the market's preference for nuclear exposure.

### Coal Power Plants

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Coal Power Plants** | Power Generation | -5.0% | -0.48 |

**Why they lose:** Coal faces a double threat from the nuclear resurgence. First, nuclear expansion directly displaces coal from baseload generation, particularly in markets like India, China, and Eastern Europe where coal still provides 30-60% of electricity. Second, the policy environment that supports nuclear -- carbon pricing, clean energy standards, net-zero mandates -- is the same policy environment that penalizes coal. The EU's classification of nuclear as a net-zero technology further marginalizes coal by providing nuclear projects with the same financing advantages as wind and solar. Coal plant operators face accelerated retirement timelines as nuclear provides a reliable, clean baseload alternative that renewables alone cannot deliver.

**Key insight:** The coal-to-nuclear switching narrative is most relevant in Asia, where coal's share of electricity generation is highest and nuclear build pipelines are largest. In the U.S. and Europe, coal's displacement is already well advanced, and the marginal competitive threat is from gas, not coal.

### Pure Renewable Portfolios

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Pure Renewable Portfolios** | Renewables | -3.0% | -0.30 |

**Why they lose:** This is a relative rather than absolute impact. Pure-play renewable energy companies are not losing money because of higher uranium prices, but they are losing market share of the "clean energy" investment narrative. Capital that previously flowed exclusively to wind, solar, and battery storage is now being redirected to nuclear, dividing the clean energy investment pie. The EU's net-zero taxonomy decision was particularly impactful because it places nuclear on equal footing with renewables for green finance, potentially diverting billions in green bond funding toward nuclear projects. Companies like Orsted, NextEra's renewable subsidiary, and Brookfield Renewable face a more competitive landscape for clean energy investment dollars.

**Key insight:** The smarter framing is not "renewables vs. nuclear" but "renewables plus nuclear vs. fossil fuels." Both technologies are needed to decarbonize the grid, and the total addressable market for clean energy investment is expanding faster than capital is being reallocated. The short-term headwind for renewable equities is real but likely transient as the market digests the complementary nature of nuclear and renewable deployment.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| Uranium Developers | +23.0% | URNM | 0.86 |
| Uranium Producers | +18.0% | URA | 0.92 |
| Enrichment/Fuel Cycle | +20.0% | None (LEU) | 0.80 |
| Physical Uranium Trusts | +14.0% | None (U.UN) | 0.96 |
| Nuclear Utilities | +7.5% | None (CEG, VST) | 0.60 |
| Nuclear Components | +7.0% | None (BWXT) | 0.52 |
| Natural Gas Generation | -4.5% | None | -0.42 |
| Coal Power Generation | -5.0% | None | -0.48 |

## Historical Precedents

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Jan 2007 | Pre-Fukushima uranium bull peak | +180% over 18 months | CCJ +250%, exploration stocks 5-10x | Speculative excess; supply response eventually crashed price |
| Mar 2011 | Fukushima disaster | -50% in 3 months | CCJ -40%, URA -55% | Nuclear fleet shutdowns removed demand for a decade |
| Aug 2021 | Sprott Physical Uranium Trust launch | +40% in 2 months | CCJ +60%, DNN +90% | Financial buying tightened spot market dramatically |
| Nov 2023 | COP28 "triple nuclear" declaration | +25% in 3 months | URA +35%, LEU +50% | First global political endorsement of nuclear expansion |
| Jul 2024 | Kazatomprom production downgrade | +15% in 6 weeks | CCJ +22%, NXE +30% | Supply-side catalyst validated structural deficit thesis |
| Jan 2026 | Russian uranium enrichment ban takes effect | +12% in 4 weeks | LEU +40%, UUUU +25% | Enrichment bottleneck became dominant market narrative |

## Key Takeaway

The uranium market at $105/lb is in the early-to-middle innings of a structural bull cycle that differs fundamentally from the speculative episode of 2007. That cycle was driven by a single buyer (a hedge fund accumulating physical uranium) and collapsed when new supply arrived. This cycle is driven by 440 operating reactors, 65 under construction, 110 in planning, simultaneous policy support from every major economy, and a supply chain that cannot meaningfully increase production for 3-5 years. The Kazatomprom shortfall alone removes 12 million pounds from a market that was already in a 15-20 million pound annual deficit. The math is inescapable: utilities need to sign long-term contracts at prices that incentivize new mine development, and those prices are $80-100/lb or higher.

For positioning, CCJ remains the cornerstone allocation for any uranium portfolio -- it is the most liquid, best-managed, and has the production base to benefit immediately. LEU is the highest-conviction high-beta play if you believe the SMR buildout is real. NXE and DNN offer developer optionality for patient capital with a 3-5 year horizon. On the utility side, CEG is effectively a call option on the nuclear renaissance being monetized through data center PPAs. The key risks to monitor are geopolitical disruptions to Kazakhstan supply routes, any reversal in Japanese restart policy following seismic events, and the timeline for Kazatomprom to resolve its sulfuric acid procurement issues. The next major catalyst is the World Nuclear Association's Spring Symposium in April, where utility contracting activity and new reactor announcements typically accelerate. Pullbacks toward $90-95 should be viewed as accumulation opportunities in a market where the structural deficit is deepening, not resolving.
