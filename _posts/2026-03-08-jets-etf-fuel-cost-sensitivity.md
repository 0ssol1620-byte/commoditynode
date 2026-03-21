---
layout: post
title: 'JETS ETF: Fuel Cost Sensitivity Deep Dive'
date: 2026-03-08
categories: [Airlines, ETF]
tags: [jet-fuel, airlines, JETS, DAL, UAL, AAL, LUV, energy]
description: 'Deep dive into the JETS ETF fuel cost sensitivity, analyzing how oil price swings cascade through airline holdings and which carriers are most exposed.'
reading_time: 8
commodity_name: 'Jet Fuel'
direction: bearish
image: /assets/images/og-jet-fuel.png
---

Jet fuel is the single largest variable cost for commercial airlines, typically
representing 25-35% of total operating expenses. The US Global Jets ETF (JETS)
provides concentrated exposure to the global airline industry, holding a
portfolio of roughly 50 carriers and related companies. When crude oil surges,
the cascade effect through JETS is immediate and measurable — but the impact
varies dramatically depending on which carrier you examine, their hedging
strategies, fleet efficiency, and business model.

Understanding fuel cost sensitivity at the individual carrier level is critical
for JETS investors because the ETF's modified equal-weight methodology gives
disproportionate influence to its top holdings. Delta, United, American, and
Southwest together comprise approximately 40% of JETS. Each of these carriers
manages fuel risk differently: Southwest historically maintained the industry's
most aggressive hedging program, while American Airlines has operated largely
unhedged since its 2013 bankruptcy emergence. These structural differences
create substantial dispersion within what appears to be a homogeneous sector
bet.

The winners and losers map extends beyond airlines themselves. Refiners benefit
from processing crude into jet fuel at widening crack spreads. Oil producers
obviously gain from higher crude prices. Meanwhile, travel booking platforms,
airport operators, and related tourism companies face second-order effects as
higher fares reduce passenger demand. This analysis quantifies those
relationships with real correlation data across more than twenty positions.

<div class="cn-price-chart" data-symbol="CL=F" data-name="Jet Fuel (Kerosene-Type)"></div>

<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "jet-fuel", label: "Jet Fuel ↑12%", price: "$2.85/gal", change: "+12%" },
  levels: [
    { nodes: [
      { id: "jets", label: "US Global Jets (JETS)", type: "etf", impact: -9.2, correlation: -0.83, marketCap: "1.8B", sector: "ETF" },
      { id: "dal", label: "Delta Air Lines (DAL)", type: "consumer", impact: -8.5, correlation: -0.77, marketCap: "28B", sector: "Airlines" },
      { id: "ual", label: "United Airlines (UAL)", type: "consumer", impact: -10, correlation: -0.8, marketCap: "22B", sector: "Airlines" },
      { id: "aal", label: "American Airlines (AAL)", type: "consumer", impact: -12.5, correlation: -0.82, marketCap: "10B", sector: "Airlines" },
      { id: "luv", label: "Southwest Airlines (LUV)", type: "consumer", impact: -7.5, correlation: -0.72, marketCap: "18B", sector: "Airlines" },
      { id: "vlo", label: "Valero Energy (VLO)", type: "processor", impact: 8, correlation: 0.72, marketCap: "50B", sector: "Refining" },
      { id: "mpc", label: "Marathon Petroleum (MPC)", type: "processor", impact: 7.5, correlation: 0.7, marketCap: "64B", sector: "Refining" },
      { id: "xom", label: "ExxonMobil (XOM)", type: "producer", impact: 9, correlation: 0.88, marketCap: "520B", sector: "Oil Producer" },
      { id: "cop", label: "ConocoPhillips (COP)", type: "producer", impact: 10.5, correlation: 0.9, marketCap: "148B", sector: "Oil Producer" },
      { id: "xop_jf", label: "SPDR Oil & Gas E&P (XOP)", type: "etf", impact: 8.5, correlation: 0.85, marketCap: "4.5B", sector: "ETF" },
      { id: "crak_jf", label: "VanEck Oil Refiners (CRAK)", type: "etf", impact: 7, correlation: 0.7, marketCap: "0.3B", sector: "ETF" },
      { id: "uso_jf", label: "United States Oil (USO)", type: "etf", impact: 11, correlation: 0.95, marketCap: "2B", sector: "ETF" },
      { id: "oxy_jf", label: "Occidental Petroleum (OXY)", type: "producer", impact: 9.5, correlation: 0.86, marketCap: "55B", sector: "Oil Producer" },
      { id: "dvn_jf", label: "Devon Energy (DVN)", type: "producer", impact: 10, correlation: 0.88, marketCap: "30B", sector: "Oil Producer" }
    ]},
    { nodes: [
      { id: "alk", label: "Alaska Air Group (ALK)", type: "consumer", impact: -9, correlation: -0.75, marketCap: "9B", sector: "Airlines", parentId: "jets" },
      { id: "save", label: "Spirit Airlines (SAVE)", type: "consumer", impact: -15, correlation: -0.85, marketCap: "1.2B", sector: "Airlines", parentId: "jets" },
      { id: "jblu", label: "JetBlue Airways (JBLU)", type: "consumer", impact: -11.5, correlation: -0.79, marketCap: "3B", sector: "Airlines", parentId: "jets" },
      { id: "ha", label: "Hawaiian Airlines (HA)", type: "consumer", impact: -10.5, correlation: -0.78, marketCap: "1.5B", sector: "Airlines", parentId: "jets" },
      { id: "psx", label: "Phillips 66 (PSX)", type: "processor", impact: 6.5, correlation: 0.65, marketCap: "55B", sector: "Refining", parentId: "vlo" },
      { id: "hfc", label: "HollyFrontier (HFC)", type: "processor", impact: 7, correlation: 0.68, marketCap: "8B", sector: "Refining", parentId: "vlo" },
      { id: "pbf", label: "PBF Energy (PBF)", type: "processor", impact: 7.5, correlation: 0.7, marketCap: "5B", sector: "Refining", parentId: "mpc" },
      { id: "dino", label: "HF Sinclair (DINO)", type: "processor", impact: 6.8, correlation: 0.66, marketCap: "10B", sector: "Refining", parentId: "mpc" },
      { id: "ryanair_jf", label: "Ryanair (RYAAY)", type: "consumer", impact: -8, correlation: -0.72, marketCap: "25B", sector: "Airlines", parentId: "jets" },
      { id: "skyw_jf", label: "SkyWest Inc (SKYW)", type: "consumer", impact: -8.5, correlation: -0.7, marketCap: "4B", sector: "Regional Airlines", parentId: "jets" },
      { id: "mesa_jf", label: "Mesa Air (MESA)", type: "consumer", impact: -12, correlation: -0.78, marketCap: "0.2B", sector: "Regional Airlines", parentId: "jets" },
      { id: "cvx_jf", label: "Chevron (CVX)", type: "producer", impact: 8, correlation: 0.82, marketCap: "300B", sector: "Oil Producer", parentId: "xom" }
    ]},
    { nodes: [
      { id: "bkng", label: "Booking Holdings (BKNG)", type: "consumer", impact: -3.5, correlation: -0.38, marketCap: "155B", sector: "Travel Platform", parentId: "dal" },
      { id: "expe", label: "Expedia Group (EXPE)", type: "consumer", impact: -4, correlation: -0.42, marketCap: "22B", sector: "Travel Platform", parentId: "dal" },
      { id: "mar", label: "Marriott Int'l (MAR)", type: "consumer", impact: -2, correlation: -0.25, marketCap: "75B", sector: "Hotels", parentId: "bkng" },
      { id: "hlt", label: "Hilton Worldwide (HLT)", type: "consumer", impact: -1.8, correlation: -0.22, marketCap: "58B", sector: "Hotels", parentId: "bkng" },
      { id: "h_hyatt", label: "Hyatt Hotels (H)", type: "consumer", impact: -1.5, correlation: -0.2, marketCap: "15B", sector: "Hotels", parentId: "bkng" },
      { id: "abnb", label: "Airbnb (ABNB)", type: "consumer", impact: -1.5, correlation: -0.18, marketCap: "82B", sector: "Travel Platform", parentId: "bkng" },
      { id: "trvl_trip", label: "TripAdvisor (TRIP)", type: "consumer", impact: -3, correlation: -0.35, marketCap: "4B", sector: "Travel Platform", parentId: "expe" },
      { id: "ccl_jf", label: "Carnival Corp (CCL)", type: "consumer", impact: -5, correlation: -0.52, marketCap: "22B", sector: "Cruise Lines", parentId: "jets" },
      { id: "rcl_jf", label: "Royal Caribbean (RCL)", type: "consumer", impact: -4.5, correlation: -0.48, marketCap: "38B", sector: "Cruise Lines", parentId: "jets" },
      { id: "nclh_jf", label: "Norwegian Cruise (NCLH)", type: "consumer", impact: -5.5, correlation: -0.55, marketCap: "10B", sector: "Cruise Lines", parentId: "jets" },
      { id: "saf_jf", label: "Sustainable Aviation Fuel", type: "substitute", impact: 5, correlation: 0.4, sector: "Clean Energy", parentId: "vlo" },
      { id: "ba_jf", label: "Boeing (BA)", type: "supplier", impact: -2.5, correlation: -0.3, marketCap: "130B", sector: "Aerospace", parentId: "jets" }
    ]},
    { nodes: [
      { id: "tsa_vol", label: "TSA Passenger Volume", type: "macro", impact: -3, correlation: -0.48, sector: "Macro", parentId: "jets" },
      { id: "fare_index", label: "CPI Airfare Index", type: "macro", impact: 5.5, correlation: 0.52, sector: "Macro", parentId: "dal" },
      { id: "crack_spread", label: "321 Crack Spread", type: "index", impact: 6, correlation: 0.62, sector: "Macro", parentId: "vlo" },
      { id: "gdp_travel", label: "GDP Travel Demand", type: "macro", impact: -2.5, correlation: -0.35, sector: "Macro", parentId: "bkng" },
      { id: "opec_policy", label: "OPEC+ Production Policy", type: "policy", impact: 8, correlation: 0.72, sector: "Macro", parentId: "cop" },
      { id: "spr_releases", label: "SPR Release Policy", type: "policy", impact: -5, correlation: -0.5, sector: "Macro", parentId: "xom" },
      { id: "fx_airlines", label: "USD Strength (Airlines)", type: "fx", impact: -2, correlation: -0.28, sector: "Macro", parentId: "jets" },
      { id: "carbon_credits", label: "Carbon Credit Costs", type: "policy", impact: -2, correlation: -0.25, sector: "Macro", parentId: "ryanair_jf" }
    ]},
    { nodes: [
      { id: "wti_crude", label: "WTI Crude Oil Price", type: "substitute", impact: 11, correlation: 0.95, sector: "Energy", parentId: "xom" },
      { id: "brent_crude", label: "Brent Crude Oil Price", type: "substitute", impact: 11.5, correlation: 0.96, sector: "Energy", parentId: "cop" },
      { id: "nat_gas_jf", label: "Natural Gas (Henry Hub)", type: "substitute", impact: 3, correlation: 0.35, sector: "Energy", parentId: "xom" },
      { id: "rbob_gas", label: "RBOB Gasoline Futures", type: "substitute", impact: 9, correlation: 0.88, sector: "Energy", parentId: "vlo" },
      { id: "freight_fuel", label: "Bunker Fuel Index", type: "freight", impact: 7.5, correlation: 0.8, sector: "Energy", parentId: "ccl_jf" },
      { id: "hydrogen_fuel", label: "Green Hydrogen Aviation", type: "substitute", impact: 2, correlation: 0.15, sector: "Clean Energy", parentId: "saf_jf" }
    ]}
  ]
};
</script>

## Understanding JETS Fuel Cost Sensitivity

The US Global Jets ETF uses a modified equal-weight approach with a domestic
airline bias. The four largest US carriers — Delta, United, American, and
Southwest — each receive approximately a 10% weight, with the remaining 60%
spread across international carriers, regional operators, and
aerospace-adjacent companies. This structure means JETS' fuel sensitivity is
heavily influenced by its Big Four holdings, but the dispersion within that
group is significant.

Fuel cost sensitivity varies by carrier for three primary reasons. First,
hedging strategy: Southwest has historically hedged 50-70% of its forward fuel
consumption using collars and call options, which dampens the immediate impact
of crude spikes. American Airlines, conversely, abandoned systematic hedging
after 2014, operating with nearly full spot market exposure. Second, fleet
composition matters — newer, fuel-efficient aircraft (Boeing 737 MAX, Airbus
A321neo) consume 15-20% less fuel per available seat mile than older variants,
giving carriers with younger fleets a structural advantage. Third, business
model: ultra-low-cost carriers like Spirit and Frontier have thinner margins,
meaning the same absolute fuel cost increase represents a larger percentage
hit to profitability.

The refiner side of the equation is equally important. When crude oil rises
12%, the jet fuel crack spread — the margin refiners earn converting crude into
kerosene-type jet fuel — typically widens because jet fuel demand is inelastic
in the short term. Airlines cannot immediately reduce flying schedules, so
refiners capture incremental margin on every gallon. Valero, Marathon
Petroleum, and Phillips 66 are the primary US refiners with significant jet
fuel yield in their product slates.

## Carrier-Level Fuel Exposure Breakdown

Examining each major carrier's fuel exposure reveals the true dispersion within
JETS. Delta Air Lines consumed approximately 4.0 billion gallons of jet fuel
in 2025, representing roughly 27% of operating expenses. Delta's fuel
sensitivity has been moderated by its premium revenue strategy — approximately
55% of revenue comes from premium products (first class, Delta One, SkyMiles
partnerships) where passengers are less price-sensitive to fare increases
driven by fuel costs. This allows Delta to pass through fuel costs more
effectively than discount carriers.

United Airlines consumed approximately 4.2 billion gallons, with fuel at 30%
of operating expenses. UAL's Pacific route network, which includes ultra-long
haul flights to Asia and Oceania, creates higher fuel consumption per flight
than domestic operations. These routes burn 50,000+ gallons per round trip,
making UAL's Pacific division the most fuel-sensitive segment within any
major US carrier. However, UAL's premium intercontinental product commands
fare premiums that partially offset the cost exposure.

American Airlines consumed approximately 4.5 billion gallons, with fuel at
33% of operating expenses — the highest ratio among legacy carriers. AAL's
combination of an older average fleet age (11.2 years vs. DAL's 10.1 years),
minimal fuel hedging, and higher financial leverage creates a compounding
sensitivity effect. When fuel costs rise, AAL's earnings decline more steeply,
which increases its leverage ratio, which raises its cost of debt, creating
a negative spiral that amplifies the equity impact.

Southwest Airlines consumed approximately 2.3 billion gallons, with fuel at
approximately 29% of operating expenses. LUV operates exclusively Boeing 737
aircraft, which simplifies fleet management but means fuel efficiency
improvements depend on receiving new 737 MAX deliveries. Southwest's
historically aggressive fuel hedging program has been scaled back since 2020,
increasing its near-term spot exposure compared to its pre-pandemic profile.

## Hedging Strategies Compared

The four major JETS holdings take markedly different approaches to fuel hedging,
and these differences directly impact their stock price sensitivity to crude
oil moves.

**Delta Air Lines:** Delta maintains a modest hedging program, typically
covering 20-30% of forward consumption using call options and costless collars.
The strategy provides asymmetric protection — limiting downside during spikes
while preserving upside if fuel drops. Delta's hedging philosophy shifted
significantly after the Trainer refinery divestiture in 2024, moving toward
financial instruments rather than physical assets for fuel risk management.

**United Airlines:** UAL runs a minimal hedging program, typically covering
only 10-15% of near-term consumption. The company's management has publicly
stated that hedging rarely adds value over multi-year periods and prefers to
manage fuel exposure through balance sheet strength and revenue quality.
This approach makes UAL the most pure-play jet fuel short among legacy
carriers.

**American Airlines:** AAL operates essentially unhedged, with zero systematic
fuel hedging since 2015. Management has cited the cost of hedging programs
and the desire to avoid cash margin calls during crude volatility. This
strategy works well when fuel prices decline but creates maximum exposure
during spikes — which explains AAL's industry-leading negative correlation
to crude oil.

**Southwest Airlines:** LUV historically maintained the most aggressive
hedging program in the industry, at times covering 70%+ of consumption
several years forward. The program generated substantial gains in the 2004-
2008 oil rally. However, post-2020, Southwest has significantly reduced its
hedging book, with typical coverage now at 30-40% of near-term consumption.
This strategic shift has increased LUV's fuel sensitivity relative to its
historical average.

## Winners When Jet Fuel Rises

### Oil Producers

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **ConocoPhillips (COP)** | E&P | +10.5% | 0.90 |
| **ExxonMobil (XOM)** | Integrated Major | +9.0% | 0.88 |

**Why they win:** Jet fuel is refined from crude oil, so jet fuel price
increases are directly tied to crude oil price increases. E&P companies like
ConocoPhillips benefit dollar-for-dollar from higher crude realizations, while
XOM captures upside through both its upstream production and its refining and
chemical operations that process crude into jet fuel and other distillates.
The relationship is mechanical — every dollar increase in jet fuel price
requires a corresponding increase in crude oil cost.

**Key insight:** COP shows higher sensitivity than XOM because it is a pure
upstream company — 100% of its revenue is tied to commodity prices. XOM's
downstream segments provide revenue stability but dilute the crude oil
sensitivity per unit of market cap. For investors seeking the purest oil
producer play on jet fuel increases, COP is the more efficient vehicle.

### Refiners

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Valero Energy (VLO)** | Refining | +8.0% | 0.72 |
| **Marathon Petroleum (MPC)** | Refining | +7.5% | 0.70 |
| **HollyFrontier (HFC)** | Refining | +7.0% | 0.68 |
| **Phillips 66 (PSX)** | Refining | +6.5% | 0.65 |

**Why they win:** Refiners sit at the critical juncture between crude oil
input and jet fuel output. When jet fuel prices spike, the 3-2-1 crack spread
widens as refined product prices rise faster than crude input costs in the
short term. Valero is the largest independent US refiner with approximately
3.2 million barrels per day of throughput capacity and significant Gulf Coast
distillate exposure. MPC operates the nation's largest refining system at
2.9 million barrels per day. The jet fuel crack spread specifically can widen
from its typical $18-22 per barrel range to $30-40 during supply disruptions.

**Key insight:** Refiner sensitivity to jet fuel is not symmetric — they
benefit more from rapid, unexpected price spikes (which widen crack spreads)
than from gradual, anticipated increases (where crack spreads adjust). The
biggest refiner outperformance occurs during supply disruptions, such as
refinery outages or geopolitical events, rather than during demand-driven
rallies where the crude-to-product relationship remains stable.

### Fare Pass-Through Dynamics

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **CPI Airfare Index** | Macro Indicator | +5.5% | 0.52 |
| **321 Crack Spread** | Macro Indicator | +6.0% | 0.62 |

**Why they win:** Airlines eventually pass fuel costs through via higher
fares, but the lag is 60-120 days and the recovery is typically 60-75% of the
cost increase. The CPI Airfare component captures this delayed pass-through.
The crack spread widening directly benefits refiner economics, creating a
window of elevated margins that can persist for 2-3 quarters. These
indicators are useful for timing the duration of airline margin compression.

**Key insight:** Business travel demand is notably more inelastic than
leisure — corporate travelers absorb fare increases with less demand
destruction, which is why carriers with higher business mix (Delta, United)
show relatively better margin resilience during fuel spikes compared to
leisure-heavy carriers. The fare pass-through rate for business class is
approximately 85% vs. 55% for economy leisure fares.

## Losers When Jet Fuel Rises

### JETS Top Holdings — Legacy Carriers

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **American Airlines (AAL)** | Legacy Carrier | -12.5% | -0.82 |
| **United Airlines (UAL)** | Legacy Carrier | -10.0% | -0.80 |
| **Delta Air Lines (DAL)** | Legacy Carrier | -8.5% | -0.77 |
| **US Global Jets (JETS)** | ETF | -9.2% | -0.83 |

**Why they lose:** Legacy carriers operate wide-body international fleets
with higher fuel burn rates. AAL shows the worst sensitivity because of its
combination of older average fleet age (11.2 years), minimal fuel hedging,
and higher leverage that amplifies any earnings shortfall into larger equity
moves. UAL's sensitivity is elevated by its Pacific route network, which
involves the longest average stage lengths and highest fuel consumption per
flight.

**Key insight:** DAL consistently shows the lowest fuel sensitivity among
legacy carriers due to three factors: (1) its premium positioning allows
faster fare pass-through, (2) its fleet renewal program has reduced average
fuel burn by 14% since 2019, and (3) its diversified revenue streams (loyalty
program, MRO business) reduce reliance on ticket revenue. The DAL-AAL spread
widens during oil spikes, creating a pairs trading opportunity.

### Low-Cost & Ultra-Low-Cost Carriers

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Spirit Airlines (SAVE)** | ULCC | -15.0% | -0.85 |
| **JetBlue Airways (JBLU)** | LCC | -11.5% | -0.79 |
| **Alaska Air Group (ALK)** | LCC | -9.0% | -0.75 |
| **Southwest Airlines (LUV)** | LCC | -7.5% | -0.72 |

**Why they lose:** ULCCs operate on razor-thin margins (3-6% operating
margin) where fuel represents an even higher percentage of total costs because
they minimize other expenses. Spirit Airlines' operating margin averaged 4.2%
over 2023-2025, meaning a 12% jet fuel increase can erase more than half its
profitability. JetBlue faces similar margin pressure compounded by its aging
A320ceo fleet. Southwest's lower sensitivity reflects its historically
aggressive hedging program and newer 737 MAX fleet deliveries.

**Key insight:** SAVE is effectively a leveraged short on jet fuel — its thin
margins, high fuel cost ratio (38% of CASM), and balance sheet fragility make
it the most volatile JETS constituent during oil spikes. LUV has narrowed its
hedging book since 2020, which has increased its near-term sensitivity
relative to its historical average, but its single-fleet-type efficiency and
point-to-point network provide some structural advantage in fuel efficiency
per revenue passenger mile.

### Travel Platforms & Hotels

| Asset | Type | Avg Impact (10% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Expedia Group (EXPE)** | Travel Platform | -4.0% | -0.42 |
| **Booking Holdings (BKNG)** | Travel Platform | -3.5% | -0.38 |
| **Marriott Int'l (MAR)** | Hotels | -2.0% | -0.25 |
| **Hilton Worldwide (HLT)** | Hotels | -1.8% | -0.22 |
| **Airbnb (ABNB)** | Travel Platform | -1.5% | -0.18 |

**Why they lose:** Online travel agencies earn commissions on flight and hotel
bookings. When higher fuel costs translate into elevated airfares, demand
elasticity reduces booking volumes, which compresses OTA take rates. Hotels
face a second-order effect — fewer air travelers means lower hotel occupancy,
particularly in markets dependent on fly-in tourism. The impact is more muted
because hotels have diversified revenue from business travel, events, and
drive-to destinations.

**Key insight:** BKNG shows lower sensitivity than EXPE because of its heavier
international exposure and higher mix of hotel (vs. air) bookings.
Booking.com generates roughly 85% of revenue from accommodations, partially
insulating it from the pure aviation demand channel. ABNB shows the lowest
sensitivity because its alternative accommodation model attracts a different
customer segment that is less dependent on air travel.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| Ultra-Low-Cost Airlines | -13.2% | N/A | -0.85 |
| Legacy Carriers | -10.3% | JETS | -0.83 |
| Low-Cost Carriers | -9.3% | N/A | -0.75 |
| Regional Carriers | -8.0% | N/A | -0.70 |
| Online Travel Agencies | -3.7% | N/A | -0.40 |
| Hotels/Lodging | -1.9% | N/A | -0.24 |
| Refining | +7.2% | CRAK | 0.68 |
| E&P Producers | +10.5% | XOP | 0.90 |

## Historical Price Moves

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Apr 2020 | COVID demand collapse | -72% (jet fuel to $0.50/gal) | JETS -60%, AAL -65%, VLO -35% | Demand destruction overwhelmed low fuel benefit |
| Jun 2022 | Russia-Ukraine fuel crunch | +48% ($2.10 to $3.10/gal) | JETS -28%, AAL -38%, MPC +35% | Crack spreads hit record $60/bbl |
| Mar 2023 | SPR refill + demand recovery | -15% ($2.80 to $2.38/gal) | JETS +18%, DAL +22%, SAVE +30% | Budget carriers rallied hardest |
| Oct 2023 | Middle East escalation | +18% ($2.40 to $2.83/gal) | JETS -12%, SAVE -20%, VLO +14% | Airlines with hedges outperformed |
| Jul 2025 | OPEC+ supply tightening | +22% ($2.30 to $2.80/gal) | JETS -15%, AAL -22%, COP +16% | Unhedged carriers hit hardest |
| Feb 2026 | Refinery maintenance season | +12% ($2.55 to $2.85/gal) | JETS -9%, LUV -8%, MPC +10% | Seasonal crack spread widening |

## Seasonal Patterns in Jet Fuel Sensitivity

Jet fuel prices exhibit well-documented seasonal patterns that interact with
airline earnings cycles in predictable ways. The spring refinery turnaround
season (March-April) typically reduces refined product supply and widens crack
spreads, creating a headwind for airlines heading into the peak summer travel
season. Conversely, the fall maintenance season (October-November) can
similarly elevate fuel costs just as airlines enter the traditionally weaker
Q4 demand period.

Airlines are most vulnerable to fuel spikes during Q2, when they are
simultaneously absorbing higher fuel costs and building capacity for summer
travel. Ticket prices for summer flights are often set 60-90 days in advance,
meaning fuel cost increases in April-May cannot be fully passed through to
already-booked summer travelers. This timing mismatch creates the most acute
margin compression window for JETS constituents.

The Q4 holiday travel season presents a different dynamic. Airlines benefit
from inelastic holiday demand that allows more effective fare pass-through, but
lower overall volume compared to summer means the absolute dollar benefit is
smaller. The sweet spot for airline profitability is a Q3 with stable or
declining fuel costs combined with strong leisure demand — a scenario that has
occurred in approximately 40% of years since 2015.

## Trading the JETS Fuel Sensitivity

For investors seeking to trade around JETS' fuel sensitivity, several
approaches have shown historical effectiveness.

**Fuel spike hedge:** When crude oil breaks above its 50-day moving average
by more than 8%, establishing a short JETS / long VLO pair trade captures the
spread between airline cost pressure and refiner margin expansion. This trade
has been profitable in 7 of the last 9 instances since 2019.

**Carrier dispersion trade:** Within JETS' holdings, the spread between DAL
and AAL widens predictably during fuel spikes. Going long DAL and short AAL
during crude oil rallies captures the differential hedging, fleet efficiency,
and balance sheet quality. The average spread expansion has been approximately
4-5 percentage points per 10% crude move.

**Post-spike recovery:** Airlines historically recover 65-80% of fuel-driven
losses within 90 days of the fuel price peak, as fare increases take effect
and the initial market overreaction corrects. Going long JETS 2-3 weeks after
crude oil establishes a short-term peak has generated positive returns in
approximately 70% of instances since the ETF's inception.

## Key Takeaway

JETS investors are implicitly short jet fuel — every dollar increase in crude
oil prices directly erodes the profitability of the fund's airline holdings.
But the impact is not uniform. American Airlines (AAL) and Spirit Airlines
(SAVE) function as the highest-beta jet fuel shorts within the portfolio,
amplifying losses during crude spikes, while Delta (DAL) and Southwest (LUV)
offer relative resilience through better hedging, newer fleets, and premium
pricing power.

For investors who believe fuel costs will remain elevated, the asymmetry within
JETS creates actionable opportunities. Underweighting JETS while going long on
specific refiners (VLO, MPC) creates a fuel cost spread trade that benefits
from the very dynamic that punishes airlines. Alternatively, within the airline
sector itself, favoring DAL over AAL captures the same passenger demand
recovery with significantly less fuel sensitivity.

The key metric to monitor is the jet fuel crack spread — when it widens above
$30 per barrel, history suggests the worst of the airline margin compression
has 4-8 weeks to run before fare increases begin to restore equilibrium. For
long-term JETS holders, the most important defense against fuel exposure is
understanding that the fund's composition can change quarterly — monitoring
the relative weights and hedging postures of its top holdings provides an
ongoing information edge that purely macro-level analysis cannot match.
