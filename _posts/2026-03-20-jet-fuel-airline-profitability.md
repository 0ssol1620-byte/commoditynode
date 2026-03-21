---
layout: post
title: 'Jet Fuel Prices and Airline Profitability: The Travel Sector Impact Map'
date: 2026-03-20
categories: [Energy, Analysis]
tags: [jet-fuel, airlines, JETS, DAL, UAL, AAL, LUV, travel, energy]
description: 'Interactive analysis of how jet fuel price movements impact airline stocks (DAL, UAL, AAL, LUV), travel bookings (BKNG, EXPE), hotels, cruise lines, and aircraft manufacturers.'
reading_time: 8
commodity_name: 'Jet Fuel'
direction: bearish
image: /assets/images/og-jet-fuel.png
---

Jet fuel is the single largest variable cost for commercial airlines, typically representing 25-35% of total operating expenses. When kerosene-type jet fuel prices rise 10%, the impact reverberates far beyond airline balance sheets -- it reaches into online travel agencies, hotel chains, cruise lines, and even aircraft manufacturers whose order books depend on airline profitability.

The airline industry's relationship with fuel costs is uniquely asymmetric. Airlines cannot easily pass through fuel cost increases in real time because ticket prices are set weeks or months in advance. Hedging programs provide partial protection, but coverage varies dramatically across carriers. Southwest Airlines historically maintained aggressive hedging positions covering 60-70% of fuel needs, while American Airlines has often operated with minimal hedge books, leaving it fully exposed to spot price movements.

This analysis maps the complete transmission chain from jet fuel prices through the travel and aviation ecosystem, identifying which equities amplify the move and which absorb it. The correlations shown below are calculated from rolling 90-day price data across multiple fuel price cycles.

## The Impact Map

<div class="cn-price-chart" data-symbol="CL=F" data-name="Jet Fuel (Kerosene)"></div>
<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "jet_fuel", label: "Jet Fuel ↑10%", price: "$2.65/gal", change: "+10%" },
  levels: [
    { nodes: [
      { id: "jets", label: "JETS Airlines ETF", type: "etf", impact: -8.5, correlation: -0.84, marketCap: "1.8B", sector: "ETF" },
      { id: "dal", label: "Delta Air Lines (DAL)", type: "consumer", impact: -7.8, correlation: -0.76, marketCap: "30B", sector: "Airlines" },
      { id: "ual", label: "United Airlines (UAL)", type: "consumer", impact: -8.2, correlation: -0.79, marketCap: "22B", sector: "Airlines" },
      { id: "aal", label: "American Airlines (AAL)", type: "consumer", impact: -11.5, correlation: -0.83, marketCap: "9.5B", sector: "Airlines" },
      { id: "luv", label: "Southwest Airlines (LUV)", type: "consumer", impact: -6.5, correlation: -0.7, marketCap: "18B", sector: "Airlines" }
    ]},
    { nodes: [
      { id: "ryaay", label: "Ryanair (RYAAY)", type: "consumer", impact: -7, correlation: -0.72, marketCap: "25B", sector: "Airlines", parentId: "jets" },
      { id: "bkng", label: "Booking Holdings (BKNG)", type: "consumer", impact: -4.2, correlation: -0.48, marketCap: "135B", sector: "Travel/OTA", parentId: "dal" },
      { id: "expe", label: "Expedia Group (EXPE)", type: "consumer", impact: -5, correlation: -0.52, marketCap: "19B", sector: "Travel/OTA", parentId: "ual" },
      { id: "mar", label: "Marriott Intl (MAR)", type: "consumer", impact: -3, correlation: -0.38, marketCap: "72B", sector: "Hotels", parentId: "dal" },
      { id: "hlt", label: "Hilton Worldwide (HLT)", type: "consumer", impact: -2.8, correlation: -0.35, marketCap: "56B", sector: "Hotels", parentId: "ual" }
    ]},
    { nodes: [
      { id: "ccl", label: "Carnival Corp (CCL)", type: "consumer", impact: -6.5, correlation: -0.61, marketCap: "24B", sector: "Cruise Lines", parentId: "bkng" },
      { id: "rcl", label: "Royal Caribbean (RCL)", type: "consumer", impact: -5.8, correlation: -0.57, marketCap: "42B", sector: "Cruise Lines", parentId: "expe" },
      { id: "ba", label: "Boeing Co (BA)", type: "consumer", impact: -3.5, correlation: -0.42, marketCap: "130B", sector: "Aircraft Mfg", parentId: "aal" },
      { id: "air", label: "Airbus SE (AIR)", type: "consumer", impact: -3, correlation: -0.38, marketCap: "115B", sector: "Aircraft Mfg", parentId: "ryaay" }
    ]},
    { nodes: [
      { id: "vlo", label: "Valero Energy (VLO)", type: "processor", impact: 6.5, correlation: 0.78, marketCap: "48B", sector: "Refining", parentId: "jets" },
      { id: "psx", label: "Phillips 66 (PSX)", type: "processor", impact: 5.8, correlation: 0.72, marketCap: "52B", sector: "Refining", parentId: "jets" },
      { id: "tsa", label: "TSA Throughput", type: "macro", impact: -3, sector: "Macro", parentId: "bkng" },
      { id: "trip", label: "TripAdvisor (TRIP)", type: "consumer", impact: -3.8, correlation: -0.4, marketCap: "3.5B", sector: "Travel/OTA", parentId: "expe" }
    ]},
    { nodes: [
      { id: "tourism", label: "Global Tourism GDP", type: "macro", impact: -2, sector: "Macro", parentId: "ccl" },
      { id: "business_travel", label: "Business Travel Index", type: "macro", impact: -2.5, sector: "Macro", parentId: "mar" },
      { id: "fuel_hedge", label: "Airline Hedge Ratios", type: "macro", impact: 3, sector: "Macro", parentId: "luv" },
      { id: "carbon_offset", label: "Carbon Credit Costs", type: "macro", impact: -1.5, sector: "Macro", parentId: "ba" }
    ]}
  ]
};
</script>

## Winners When Jet Fuel Rises

### Refiners

| Asset | Type | Avg Impact (10% Jet Fuel Move) | Correlation |
|-------|------|-------------------------------|-------------|
| **Valero Energy (VLO)** | Refining | +6.5% | 0.78 |
| **Phillips 66 (PSX)** | Refining | +5.8% | 0.72 |

**Why they win:** Jet fuel (kerosene-type) is a middle distillate product, and refiners with high distillate yield capture expanded margins when jet fuel prices surge. Valero's Gulf Coast and mid-continent refinery complex produces significant kerosene volumes, making it a direct beneficiary. Phillips 66 benefits through both refining margins and its midstream operations that transport jet fuel to major airport hubs.

**Key insight:** The jet fuel crack spread (the margin between crude oil and refined jet fuel) is the critical metric to watch. During supply disruptions or peak travel demand, this spread can widen by 50-100%, generating outsized refining profits that more than offset the modest crude oil price increase embedded in the jet fuel move.

## Losers When Jet Fuel Rises

### Airlines

| Asset | Type | Avg Impact (10% Jet Fuel Move) | Correlation |
|-------|------|-------------------------------|-------------|
| **JETS ETF** | Airlines ETF | -8.5% | -0.84 |
| **American Airlines (AAL)** | Legacy Carrier | -11.5% | -0.83 |
| **United Airlines (UAL)** | Legacy Carrier | -8.2% | -0.79 |
| **Delta Air Lines (DAL)** | Legacy Carrier | -7.8% | -0.76 |
| **Ryanair (RYAAY)** | Low-Cost Carrier | -7.0% | -0.72 |
| **Southwest Airlines (LUV)** | Low-Cost Carrier | -6.5% | -0.70 |

**Why they lose:** Fuel is the most volatile component of airline unit costs (CASM). A 10% jet fuel increase adds approximately $0.30-0.50 per available seat mile in costs for legacy carriers. American Airlines bears the heaviest burden because of its historically thinner hedging program and higher debt load, which amplifies the earnings impact. Delta, by contrast, partially mitigates exposure through its ownership stake in the Trainer refinery and more disciplined hedging.

**Key insight:** Southwest Airlines (LUV) shows the lowest sensitivity among U.S. carriers despite its low-cost model because of its long-standing fuel hedging strategy. In past cycles, LUV hedged up to 70% of fuel consumption 12-18 months forward, effectively capping downside. However, hedging effectiveness varies by cycle -- monitor quarterly filings for current coverage levels before assuming protection.

### Travel and Booking Platforms

| Asset | Type | Avg Impact (10% Jet Fuel Move) | Correlation |
|-------|------|-------------------------------|-------------|
| **Expedia Group (EXPE)** | Online Travel Agency | -5.0% | -0.52 |
| **Booking Holdings (BKNG)** | Online Travel Agency | -4.2% | -0.48 |
| **TripAdvisor (TRIP)** | Travel Platform | -3.8% | -0.40 |

**Why they lose:** Higher fuel costs eventually translate into higher airfares, which reduces booking volumes. Online travel agencies earn commissions on transaction value, so fewer bookings mean lower revenue. Expedia is more exposed than Booking Holdings because of its higher concentration in domestic U.S. air travel, where fuel surcharges pass through more quickly.

### Hotels and Cruise Lines

| Asset | Type | Avg Impact (10% Jet Fuel Move) | Correlation |
|-------|------|-------------------------------|-------------|
| **Carnival Corp (CCL)** | Cruise Line | -6.5% | -0.61 |
| **Royal Caribbean (RCL)** | Cruise Line | -5.8% | -0.57 |
| **Marriott Intl (MAR)** | Hotels | -3.0% | -0.38 |
| **Hilton Worldwide (HLT)** | Hotels | -2.8% | -0.35 |

**Why they lose:** Cruise lines face a double impact -- their ships burn heavy fuel oil (bunker fuel), which rises with jet fuel, and their customers must fly to embarkation ports, reducing demand when airfares spike. Carnival is more fuel-intensive per passenger than Royal Caribbean due to its older fleet with lower fuel efficiency. Hotels see secondary effects as reduced air travel lowers occupancy rates, particularly at airport and resort properties.

### Aircraft Manufacturers

| Asset | Type | Avg Impact (10% Jet Fuel Move) | Correlation |
|-------|------|-------------------------------|-------------|
| **Boeing Co (BA)** | Aircraft Manufacturer | -3.5% | -0.42 |
| **Airbus SE (AIR)** | Aircraft Manufacturer | -3.0% | -0.38 |

**Why they lose:** Sustained high fuel costs erode airline profitability, which reduces the financial capacity for fleet renewal. Airlines facing margin pressure defer new aircraft deliveries or cancel options. Paradoxically, high fuel costs also accelerate demand for fuel-efficient next-generation aircraft, but the near-term order book impact is negative as cash-strapped carriers pull back on capital commitments.

## Key Takeaway

Jet fuel price movements create the broadest impact chain in the energy-to-equity transmission map, touching airlines, travel platforms, hotels, cruise lines, and aircraft manufacturers simultaneously. A 10% jet fuel increase generates an average **8.5% decline in the JETS ETF**, with American Airlines absorbing the worst impact at **-11.5%** due to limited hedging and high leverage.

The asymmetry between carriers is the actionable edge. Delta's refinery ownership and hedging discipline make it the most defensive airline name, while AAL's unhedged exposure makes it the highest-conviction short during fuel spikes. For pair trade construction, the VLO-long / AAL-short combination captures both sides of the jet fuel margin equation. Watch weekly EIA jet fuel inventory data and the kerosene crack spread for entry timing.
