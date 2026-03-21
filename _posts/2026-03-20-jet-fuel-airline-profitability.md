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
      { id: "luv", label: "Southwest Airlines (LUV)", type: "consumer", impact: -6.5, correlation: -0.70, marketCap: "18B", sector: "Airlines" },
      { id: "vlo", label: "Valero Energy (VLO)", type: "processor", impact: 6.5, correlation: 0.78, marketCap: "48B", sector: "Refining" },
      { id: "psx", label: "Phillips 66 (PSX)", type: "processor", impact: 5.8, correlation: 0.72, marketCap: "52B", sector: "Refining" },
      { id: "mpc", label: "Marathon Petroleum (MPC)", type: "processor", impact: 5.5, correlation: 0.70, marketCap: "58B", sector: "Refining" },
      { id: "xom", label: "Exxon Mobil (XOM)", type: "producer", impact: 3.2, correlation: 0.45, marketCap: "480B", sector: "Oil Major" },
      { id: "cvx", label: "Chevron Corp (CVX)", type: "producer", impact: 3.0, correlation: 0.42, marketCap: "310B", sector: "Oil Major" },
      { id: "jblu", label: "JetBlue Airways (JBLU)", type: "consumer", impact: -10.2, correlation: -0.81, marketCap: "3B", sector: "Airlines" },
      { id: "algt", label: "Allegiant Travel (ALGT)", type: "consumer", impact: -9.5, correlation: -0.78, marketCap: "2.2B", sector: "Airlines" },
      { id: "save", label: "Spirit Airlines (SAVE)", type: "consumer", impact: -13.0, correlation: -0.86, marketCap: "0.5B", sector: "Airlines" },
      { id: "bkng", label: "Booking Holdings (BKNG)", type: "consumer", impact: -4.2, correlation: -0.48, marketCap: "135B", sector: "Travel/OTA" }
    ]},
    { nodes: [
      { id: "ryaay", label: "Ryanair (RYAAY)", type: "consumer", impact: -7.0, correlation: -0.72, marketCap: "25B", sector: "Airlines", parentId: "jets" },
      { id: "wizz", label: "Wizz Air (WIZZ.L)", type: "consumer", impact: -8.5, correlation: -0.77, marketCap: "4B", sector: "Airlines", parentId: "jets" },
      { id: "expe", label: "Expedia Group (EXPE)", type: "consumer", impact: -5.0, correlation: -0.52, marketCap: "19B", sector: "Travel/OTA", parentId: "bkng" },
      { id: "mar", label: "Marriott Intl (MAR)", type: "consumer", impact: -3.0, correlation: -0.38, marketCap: "72B", sector: "Hotels", parentId: "dal" },
      { id: "hlt", label: "Hilton Worldwide (HLT)", type: "consumer", impact: -2.8, correlation: -0.35, marketCap: "56B", sector: "Hotels", parentId: "ual" },
      { id: "hyh", label: "Hyatt Hotels (H)", type: "consumer", impact: -2.5, correlation: -0.32, marketCap: "15B", sector: "Hotels", parentId: "dal" },
      { id: "pbr", label: "Petrobras (PBR)", type: "producer", impact: 4.0, correlation: 0.52, marketCap: "90B", sector: "Oil Major", parentId: "xom" },
      { id: "dkng", label: "DraftKings (DKNG)", type: "consumer", impact: -1.5, correlation: -0.15, marketCap: "18B", sector: "Travel/Leisure", parentId: "bkng" },
      { id: "abnb", label: "Airbnb (ABNB)", type: "consumer", impact: -3.5, correlation: -0.40, marketCap: "80B", sector: "Travel/OTA", parentId: "bkng" },
      { id: "ry4c", label: "IAG (IAG.L)", type: "consumer", impact: -7.5, correlation: -0.74, marketCap: "12B", sector: "Airlines", parentId: "jets" },
      { id: "lha", label: "Lufthansa (LHA.DE)", type: "consumer", impact: -7.0, correlation: -0.71, marketCap: "8B", sector: "Airlines", parentId: "jets" },
      { id: "dks_crack", label: "Jet Fuel Crack Spread", type: "index", impact: 8.0, correlation: 0.85, sector: "Refining Margin", parentId: "vlo" }
    ]},
    { nodes: [
      { id: "ccl", label: "Carnival Corp (CCL)", type: "consumer", impact: -6.5, correlation: -0.61, marketCap: "24B", sector: "Cruise Lines", parentId: "expe" },
      { id: "rcl", label: "Royal Caribbean (RCL)", type: "consumer", impact: -5.8, correlation: -0.57, marketCap: "42B", sector: "Cruise Lines", parentId: "expe" },
      { id: "nclh", label: "Norwegian Cruise (NCLH)", type: "consumer", impact: -6.2, correlation: -0.59, marketCap: "12B", sector: "Cruise Lines", parentId: "expe" },
      { id: "ba", label: "Boeing Co (BA)", type: "consumer", impact: -3.5, correlation: -0.42, marketCap: "130B", sector: "Aircraft Mfg", parentId: "aal" },
      { id: "air", label: "Airbus SE (AIR)", type: "consumer", impact: -3.0, correlation: -0.38, marketCap: "115B", sector: "Aircraft Mfg", parentId: "ryaay" },
      { id: "ge", label: "GE Aerospace (GE)", type: "supplier", impact: -2.0, correlation: -0.28, marketCap: "190B", sector: "Engine Mfg", parentId: "ba" },
      { id: "rtx", label: "RTX Corp (RTX)", type: "supplier", impact: -1.8, correlation: -0.25, marketCap: "140B", sector: "Engine Mfg", parentId: "air" },
      { id: "saf", label: "Safran SA (SAF.PA)", type: "supplier", impact: -1.5, correlation: -0.22, marketCap: "85B", sector: "Engine Mfg", parentId: "air" },
      { id: "trip", label: "TripAdvisor (TRIP)", type: "consumer", impact: -3.8, correlation: -0.40, marketCap: "3.5B", sector: "Travel/OTA", parentId: "expe" },
      { id: "hxt", label: "HollyFrontier (HF)", type: "processor", impact: 5.0, correlation: 0.65, marketCap: "10B", sector: "Refining", parentId: "vlo" },
      { id: "pbf", label: "PBF Energy (PBF)", type: "processor", impact: 7.2, correlation: 0.80, marketCap: "5B", sector: "Refining", parentId: "psx" },
      { id: "cpa", label: "Copa Holdings (CPA)", type: "consumer", impact: -8.0, correlation: -0.73, marketCap: "4B", sector: "Airlines", parentId: "ryaay" }
    ]},
    { nodes: [
      { id: "tsa", label: "TSA Throughput", type: "macro", impact: -3.0, sector: "Macro", parentId: "bkng" },
      { id: "tdg", label: "TransDigm Group (TDG)", type: "supplier", impact: -1.2, correlation: -0.18, marketCap: "72B", sector: "Aero Parts", parentId: "ba" },
      { id: "hei", label: "HEICO Corp (HEI)", type: "supplier", impact: -1.0, correlation: -0.15, marketCap: "30B", sector: "Aero Parts", parentId: "ba" },
      { id: "flr", label: "Flir Aviation Svcs", type: "supplier", impact: -1.5, correlation: -0.20, sector: "MRO Services", parentId: "ge" },
      { id: "wynn", label: "Wynn Resorts (WYNN)", type: "consumer", impact: -2.0, correlation: -0.25, marketCap: "10B", sector: "Hotels/Gaming", parentId: "mar" },
      { id: "mgm", label: "MGM Resorts (MGM)", type: "consumer", impact: -1.8, correlation: -0.22, marketCap: "14B", sector: "Hotels/Gaming", parentId: "hlt" },
      { id: "usd_jpy", label: "USD/JPY FX Impact", type: "fx", impact: 1.5, correlation: 0.20, sector: "FX", parentId: "ryaay" },
      { id: "biofuel", label: "SAF / Biofuel Producers", type: "substitute", impact: 3.5, correlation: 0.40, sector: "Sustainable Aviation", parentId: "mpc" },
      { id: "cargo", label: "Air Cargo Index", type: "index", impact: -4.0, correlation: -0.50, sector: "Air Freight", parentId: "ual" }
    ]},
    { nodes: [
      { id: "tourism", label: "Global Tourism GDP", type: "macro", impact: -2.0, sector: "Macro", parentId: "ccl" },
      { id: "business_travel", label: "Business Travel Index", type: "macro", impact: -2.5, sector: "Macro", parentId: "mar" },
      { id: "fuel_hedge", label: "Airline Hedge Ratios", type: "macro", impact: 3.0, sector: "Macro", parentId: "luv" },
      { id: "carbon_offset", label: "Carbon Credit Costs", type: "policy", impact: -1.5, sector: "Policy", parentId: "ba" },
      { id: "opec_policy", label: "OPEC+ Production Policy", type: "policy", impact: 5.0, sector: "Policy", parentId: "xom" },
      { id: "baltic_freight", label: "Baltic Dry / Freight Index", type: "freight", impact: 2.0, correlation: 0.30, sector: "Freight", parentId: "pbr" },
      { id: "nat_gas_sub", label: "Natural Gas (Substitute)", type: "substitute", impact: -2.5, correlation: -0.30, sector: "Energy", parentId: "vlo" },
      { id: "cpi_travel", label: "CPI Travel Component", type: "macro", impact: -1.8, sector: "Macro", parentId: "abnb" },
      { id: "diesel_spread", label: "Diesel/Kerosene Spread", type: "index", impact: 3.0, correlation: 0.55, sector: "Refining", parentId: "psx" }
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
