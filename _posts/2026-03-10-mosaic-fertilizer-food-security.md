---
layout: post
title: 'Mosaic Company: Fertilizer Prices and Food Security'
date: 2026-03-10
categories: [Agriculture, Analysis]
tags: [fertilizer, agriculture, MOS, NTR, CF, IPI, natural-gas, wheat]
description: 'How Mosaic Company fertilizer operations link natural gas prices to global food security, with analysis of potash and phosphate market dynamics.'
reading_time: 9
commodity_name: 'Fertilizer'
direction: bullish
image: /assets/images/og-natural-gas.png
---

Fertilizer is the invisible engine of global food production, and the Mosaic Company sits at the intersection of the two most critical nutrient markets: phosphate and potash. When fertilizer prices rise -- as they have through early 2026 with DAP (diammonium phosphate) climbing to $520 per metric ton -- the consequences ripple from natural gas wellheads through chemical plants, across farm gates, and ultimately to grocery store shelves in every country on earth. Understanding Mosaic's position in this supply chain reveals how energy prices, mining economics, and agricultural policy converge to determine the cost of feeding 8 billion people.

The fertilizer market is structured around three primary nutrients: nitrogen (N), phosphorus (P), and potassium (K). Mosaic is the world's largest producer of finished phosphate products and one of the largest potash producers, operating mines in Florida, Louisiana, Saskatchewan, and Brazil. The company's cost structure is fundamentally different from nitrogen producers like CF Industries and Nutrien's nitrogen segment: while nitrogen fertilizer production is directly tied to natural gas prices (gas is both the feedstock and energy source for ammonia synthesis), Mosaic's phosphate and potash operations are mining businesses where costs are driven by ore grade, extraction efficiency, and logistics. This distinction matters enormously when natural gas prices spike -- nitrogen producers face immediate cost pressure while Mosaic's potash and phosphate margins are largely insulated.

The food security dimension of fertilizer pricing has become a geopolitical priority since the disruptions of 2022-2023. Russia and Belarus together account for approximately 40% of global potash exports and significant shares of phosphate and nitrogen trade. Western sanctions, export restrictions, and logistics disruptions have permanently altered global fertilizer supply chains, creating sustained pricing premiums for non-sanctioned producers like Mosaic. For investors, the fertilizer sector offers a unique combination of commodity exposure, food security thematic investing, and geopolitical hedge characteristics that few other sectors can match.

<div class="cn-price-chart" data-symbol="NG=F" data-name="Natural Gas (Fertilizer Feedstock)"></div>

<div id="impact-graph"></div>

<script>
window.COMMODITY_DATA = {
  commodity: { id: "fertilizer", label: "Fertilizer ↑12%", price: "$520/t DAP", change: "+12%" },
  levels: [
    { nodes: [
      { id: "mos", label: "Mosaic (MOS)", type: "consumer", impact: 14, correlation: 0.85, marketCap: "12B", sector: "Phosphate/Potash" },
      { id: "ntr", label: "Nutrien (NTR)", type: "consumer", impact: 12, correlation: 0.82, marketCap: "28B", sector: "Diversified Fertilizer" },
      { id: "cf", label: "CF Industries (CF)", type: "consumer", impact: 10.5, correlation: 0.78, marketCap: "16B", sector: "Nitrogen Fertilizer" },
      { id: "ipi", label: "Intrepid Potash (IPI)", type: "producer", impact: 16, correlation: 0.8, marketCap: "0.5B", sector: "Potash" },
      { id: "eqt", label: "EQT Corp (EQT)", type: "producer", impact: 4.5, correlation: 0.45, marketCap: "20B", sector: "Natural Gas" },
      { id: "adm_fert", label: "ADM (ADM)", type: "consumer", impact: -3.5, correlation: -0.38, marketCap: "26B", sector: "Ag Processing" }
    ]},
    { nodes: [
      { id: "ice", label: "ICL Group (ICL)", type: "consumer", impact: 11, correlation: 0.76, marketCap: "8B", sector: "Specialty Minerals", parentId: "mos" },
      { id: "fmc", label: "FMC Corp (FMC)", type: "consumer", impact: 5.5, correlation: 0.5, marketCap: "7B", sector: "Crop Protection", parentId: "ntr" },
      { id: "farmers", label: "U.S. Farm Operators", type: "negative", impact: -8, correlation: -0.72, sector: "Agriculture", parentId: "mos" },
      { id: "ura_nitrogen", label: "UAN/Urea Markets", type: "consumer", impact: 13, correlation: 0.8, sector: "Nitrogen Pricing", parentId: "cf" },
      { id: "bg_fert", label: "Bunge (BG)", type: "consumer", impact: -2.5, correlation: -0.3, marketCap: "16B", sector: "Ag Processing", parentId: "adm_fert" }
    ]},
    { nodes: [
      { id: "de", label: "Deere & Co (DE)", type: "consumer", impact: 3.5, correlation: 0.35, marketCap: "110B", sector: "Farm Equipment", parentId: "farmers" },
      { id: "grain_buyers", label: "Global Grain Buyers", type: "consumer", impact: -5.5, correlation: -0.55, sector: "Food Import", parentId: "farmers" },
      { id: "wheat_price", label: "Wheat Price Impact", type: "producer", impact: 7, correlation: 0.65, sector: "Grains", parentId: "farmers" },
      { id: "food_processors", label: "Food Processors (GIS, KHC)", type: "consumer", impact: -4, correlation: -0.45, sector: "Packaged Food", parentId: "grain_buyers" },
      { id: "brazil_ag", label: "Brazilian Agriculture", type: "negative", impact: -6, correlation: -0.58, sector: "Agriculture", parentId: "mos" },
      { id: "potash_market", label: "Global Potash Market", type: "consumer", impact: 12.5, correlation: 0.82, sector: "Fertilizer", parentId: "ipi" }
    ]},
    { nodes: [
      { id: "food_security", label: "Global Food Security", type: "macro", impact: -7, correlation: -0.6, sector: "Macro", parentId: "grain_buyers" },
      { id: "india_subsidy", label: "India Fertilizer Subsidies", type: "macro", impact: 6, correlation: 0.5, sector: "Macro", parentId: "potash_market" },
      { id: "russia_sanctions", label: "Russia/Belarus Sanctions", type: "macro", impact: 10, correlation: 0.72, sector: "Macro", parentId: "potash_market" },
      { id: "nat_gas_cost", label: "Natural Gas Feedstock Cost", type: "macro", impact: 8, correlation: 0.68, sector: "Macro", parentId: "cf" },
      { id: "consumer_food_prices", label: "Consumer Food Inflation", type: "macro", impact: -4.5, correlation: -0.48, sector: "Macro", parentId: "food_processors" }
    ]}
  ]
};
</script>

## Understanding Mosaic's Fertilizer Exposure

Mosaic operates two primary business segments: Phosphates and Potash. The Phosphates segment mines phosphate rock in Florida and processes it into finished fertilizer products (DAP, MAP, and animal feed phosphates) at facilities in Florida and Louisiana. The Potash segment operates the Esterhazy and Belle Plaine mines in Saskatchewan and the Colonsay mine, producing muriate of potash (MOP) for agricultural and industrial use. In 2025, Mosaic produced approximately 7.5 million metric tons of finished phosphate products and 9.2 million metric tons of potash, generating combined revenue of $12.8 billion.

The critical distinction between Mosaic's two segments lies in their cost dynamics. Phosphate production costs are driven by sulfur prices (used to make sulfuric acid for phosphate rock digestion), ammonia prices (for DAP and MAP formulation), and mining costs that escalate as Florida ore bodies mature. Potash production costs are dominated by mining and processing efficiency at depth -- Mosaic's Esterhazy mine operates at depths exceeding 1,000 meters, which creates significant fixed-cost leverage. When fertilizer prices rise, Mosaic's potash segment typically sees the largest margin expansion because its costs are largely fixed while revenue per ton increases proportionally.

Mosaic's geographic diversification adds resilience to its business model. The company's Mosaic Fertilizantes subsidiary in Brazil, acquired in 2018, provides access to the world's fourth-largest fertilizer market. Brazil imports approximately 85% of its potash and 50% of its phosphate requirements, making it a price-taker in global fertilizer markets. When global fertilizer prices rise, Mosaic's Brazilian distribution network captures premium pricing in a market where logistics costs and import dependency create natural barriers to competition.

This combination of upstream production in North America and downstream distribution in Brazil gives Mosaic a unique position in the global fertilizer supply chain. The company can produce potash in Saskatchewan, ship it to Brazil via rail and ocean freight, and sell it through its own distribution network at prices that reflect both the global commodity benchmark and the local logistics premium. This integrated model generates higher returns per ton than either pure production or pure distribution alone.

## Winners When Fertilizer Rises

### Fertilizer Producers

| Asset | Type | Avg Impact (12% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Intrepid Potash (IPI)** | Potash Mining | +16.0% | 0.80 |
| **Mosaic (MOS)** | Phosphate/Potash | +14.0% | 0.85 |
| **Nutrien (NTR)** | Diversified Fertilizer | +12.0% | 0.82 |
| **CF Industries (CF)** | Nitrogen Fertilizer | +10.5% | 0.78 |
| **ICL Group (ICL)** | Specialty Minerals | +11.0% | 0.76 |

**Why they win:** Fertilizer producers are the most direct beneficiaries of rising nutrient prices because their production volumes are largely fixed in the short term while selling prices adjust immediately. Intrepid Potash shows the highest percentage impact because it is a pure-play potash producer with high operating leverage -- small revenue gains disproportionately increase earnings from its solar evaporation operations in Wendover, Utah and Carlsbad, New Mexico.

Mosaic benefits from dual exposure to phosphate and potash, with its potash segment providing the largest margin expansion. The company's integrated phosphate operations, which include both mining and chemical processing, generate higher margins than competitors who purchase phosphate rock on the open market. Nutrien's diversified model, spanning potash, nitrogen, and the world's largest retail distribution network with over 2,000 farm centers, provides slightly lower leverage but more consistent performance and visibility into farmer purchasing patterns.

CF Industries, as a pure nitrogen producer, benefits when fertilizer prices rise broadly but faces offsetting cost pressure if natural gas (its primary feedstock) rises simultaneously. The company's advantage is its access to low-cost North American natural gas at $2-4 per MMBtu compared to European competitors paying $8-12, which translates to a $100-150 per ton cost advantage in ammonia production.

ICL Group, headquartered in Israel, produces potash from the Dead Sea and specialty phosphate products for food, agriculture, and industrial applications. Its Dead Sea potash operations have among the lowest production costs globally due to the natural evaporation process and high mineral concentration of the brine.

**Key insight:** The fertilizer sector exhibits classic oligopoly pricing dynamics. The top four potash producers (Nutrien, Belaruskali, Uralkali, and Mosaic) control approximately 70% of global capacity. When any major producer curtails output -- as Belarus did involuntarily due to sanctions -- the pricing impact is amplified across the entire industry. Monitor IFA (International Fertilizer Association) supply-demand balances and Indian tender announcements as leading indicators.

### Natural Gas Producers (Indirect Beneficiary)

| Asset | Type | Avg Impact (12% Move) | Correlation |
|-------|------|----------------------|-------------|
| **EQT Corp (EQT)** | Natural Gas | +4.5% | 0.45 |

**Why they win:** Natural gas is the primary feedstock for nitrogen fertilizer production. Ammonia synthesis via the Haber-Bosch process consumes approximately 33-38 MMBtu of natural gas per metric ton of ammonia produced, making fertilizer manufacturing the single largest industrial consumer of natural gas in North America. When fertilizer prices rise due to strong agricultural demand, nitrogen producers increase output and consume more gas. U.S. ammonia production capacity of approximately 18 million tons requires roughly 600-680 Bcf of natural gas annually.

EQT benefits from this demand pull, though the correlation is moderate because natural gas prices are influenced by weather, storage levels, and LNG export demand far more than fertilizer manufacturing alone. The benefit is most visible during periods when fertilizer plants are operating at maximum utilization rates, typically during the spring pre-plant fertilizer application season from March through May.

**Key insight:** The natural gas-to-fertilizer linkage is strongest when fertilizer price increases are driven by demand factors (high crop prices incentivizing maximum yield applications) rather than supply disruptions (which may reduce fertilizer production and thus gas consumption). The direction of causality matters for trading this relationship.

### Farm Equipment and Crop Protection

| Asset | Type | Avg Impact (12% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Deere & Co (DE)** | Farm Equipment | +3.5% | 0.35 |
| **FMC Corp (FMC)** | Crop Protection | +5.5% | 0.50 |

**Why they win:** Rising fertilizer prices are often accompanied by high crop prices, which increase farm profitability and spending on equipment and crop protection products. Farmers who face higher input costs for fertilizer are simultaneously motivated to protect their investment through premium seed, pesticides, and herbicides -- the logic being that if you are spending $200 per acre on nutrients, you want to ensure maximum yield by also spending $50-75 per acre on crop protection.

Deere's correlation to fertilizer prices is moderate because equipment purchases are capital decisions influenced by many factors including interest rates, used equipment values, and multi-year farm income trends. However, the directional relationship is positive, and during periods of sustained high commodity prices, Deere has historically seen order books strengthen by 15-25% within two to three quarters.

FMC benefits more directly because its crop protection chemicals are complementary to fertilizer application. The company's portfolio of insecticides, herbicides, and fungicides represents the final layer of input spending before harvest. Farmers who invest in maximum nutrient programs also invest in maximum crop protection -- the correlation between fertilizer spending and crop protection spending at the farm level exceeds 0.70.

**Key insight:** The farm equipment cycle lags fertilizer prices by approximately two to three quarters, as farmers make equipment purchasing decisions based on realized crop revenue rather than input cost projections. This lag creates a secondary investment opportunity after the initial fertilizer price move.

## Losers When Fertilizer Rises

### Farm Operators

| Asset | Type | Avg Impact (12% Move) | Correlation |
|-------|------|----------------------|-------------|
| **U.S. Farm Operators** | Agriculture | -8.0% | -0.72 |
| **Brazilian Agriculture** | Agriculture | -6.0% | -0.58 |

**Why they lose:** Farmers are the primary consumers of fertilizer products, and a 12% increase in DAP and potash prices can add $30-50 per acre to production costs for corn and soybeans. For a 1,000-acre Midwest farm operating on a typical budget, total fertilizer spending may increase from $130,000 to $165,000 per season. This represents a direct hit to farm operating margins that cannot be immediately offset because crop prices are determined by global supply and demand, not by individual farm input costs.

The timing mismatch is critical: fertilizer must be purchased months before the crop is planted, priced, and sold. A farmer buying DAP at $520 per ton in March 2026 will not sell their corn or soybean crop until September-November, creating a six to eight month gap during which they bear both the input cost risk and the crop price risk. Many farmers use crop insurance and forward contracts to manage this risk, but the hedging programs typically cover only a portion of expected production.

Brazilian farmers are particularly exposed because Brazil imports the vast majority of its fertilizer. Potash must be shipped from Canada, Russia, or Belarus; phosphate from Morocco or the U.S.; and nitrogen from Trinidad, Russia, or the Middle East. Each import adds ocean freight, port handling, and inland logistics costs that amplify the global benchmark price increase by an additional 15-25% at the farm gate. The real exchange rate between the Brazilian Real and the U.S. Dollar adds another layer of cost volatility.

**Key insight:** Farm operator profitability is the ratio of crop revenue to input costs. Fertilizer typically represents 25-35% of total variable production costs for corn and 15-20% for soybeans. When fertilizer prices rise faster than crop prices, the margin squeeze can be severe -- this is the primary transmission mechanism through which fertilizer costs ultimately affect food prices.

### Food Processors and Ag Processors (Downstream)

| Asset | Type | Avg Impact (12% Move) | Correlation |
|-------|------|----------------------|-------------|
| **ADM (ADM)** | Ag Processing | -3.5% | -0.38 |
| **Bunge (BG)** | Ag Processing | -2.5% | -0.30 |
| **Food Processors (GIS, KHC)** | Packaged Food | -4.0% | -0.45 |

**Why they lose:** Higher fertilizer costs raise the floor price for agricultural commodities. Farmers who face elevated input costs require higher commodity prices to remain profitable, which establishes a higher cost basis for the entire downstream food supply chain. The effect is not immediate but builds over multiple crop cycles as farm-level economics adjust.

ADM and Bunge, while beneficiaries of rising grain prices on their processing margins, face the second-order effect of reduced farmer profitability potentially leading to lower planted acreage and tighter supply. If enough farmers reduce acreage in response to unfavorable input economics, the resulting lower production can tighten supplies beyond what processors can efficiently source, disrupting their origination operations.

Food processors like General Mills and Kraft Heinz absorb the final cost pass-through as raw ingredient prices rise, compressing margins on products with established retail price points. The correlation is moderate because food companies hedge 3-9 months forward and can partially offset costs through pricing actions, pack size reductions, and promotional frequency adjustments. However, sustained fertilizer-driven inflation in agricultural raw materials eventually overwhelms hedging programs and tests the limits of consumer price tolerance.

**Key insight:** The food processor impact operates with a 6-12 month lag because hedging programs and annual purchasing contracts delay the transmission of fertilizer costs through to finished goods. This lag creates a misleading sense of insulation during the initial fertilizer price move, followed by margin pressure that surfaces in later earnings reports and guidance revisions.

### Global Grain Buyers and Food Importers

| Asset | Type | Avg Impact (12% Move) | Correlation |
|-------|------|----------------------|-------------|
| **Global Grain Buyers** | Food Import | -5.5% | -0.55 |

**Why they lose:** Countries that are net food importers -- particularly in North Africa, the Middle East, and Southeast Asia -- face compounding cost pressure when fertilizer prices rise. Higher fertilizer costs reduce global yields (or prevent yield increases), which tightens grain supply, which raises import prices for countries dependent on foreign food production.

Egypt, the world's largest wheat importer, saw its food import bill increase by over $3 billion in 2022-2023 when the fertilizer-driven yield reduction coincided with the Ukraine conflict's supply disruption. Bangladesh, Indonesia, the Philippines, and several Sub-Saharan African nations face similar vulnerabilities. For these countries, fertilizer prices are not an investment variable but a matter of social stability and food security.

The World Bank estimates that a sustained 25% increase in global fertilizer prices reduces cereal yields by approximately 3-5% in developing countries where farmers cannot afford to maintain optimal application rates. This yield reduction, applied across hundreds of millions of hectares, translates to tens of millions of tons of lost production that must be replaced through expensive imports.

**Key insight:** The FAO Food Price Index has shown a 0.65 correlation to the global fertilizer price index over the past 20 years, confirming that fertilizer costs are a fundamental driver of food inflation. For macro investors, fertilizer prices are a leading indicator of food price inflation 6-9 months forward. This relationship makes fertilizer stocks an effective portfolio hedge against food-driven inflation surprises.

## Impact Correlation Matrix

| Industry | Impact % | Primary ETF | 30-Day Correlation |
|----------|----------|-------------|-------------------|
| Potash Producers | +15.0% | MOS | 0.83 |
| Phosphate Producers | +13.0% | MOS | 0.85 |
| Nitrogen Fertilizer | +10.5% | CF | 0.78 |
| Crop Protection Chemicals | +5.5% | FMC | 0.50 |
| Farm Equipment | +3.5% | DE | 0.35 |
| U.S. Farm Operators | -8.0% | DBA | -0.72 |
| Food Processors | -4.0% | XLP | -0.45 |
| Food Importing Nations | -5.5% | -- | -0.55 |

## Historical Price Moves

| Date | Event | Price Move | Market Impact | Notes |
|------|-------|-----------|---------------|-------|
| Q1-Q2 2022 | Ukraine war, Belarus sanctions | DAP +95%, MOP +130% | MOS +65%, NTR +50% | Worst fertilizer crisis since 2008 |
| 2008 | Oil-driven commodity supercycle | DAP hit $1,200/t | MOS +180% peak-to-peak | Fertilizer prices collapsed 70% in 6 months post-peak |
| 2020-2021 | Post-COVID supply chain crisis | DAP +85% in 12 months | CF +90%, IPI +120% | Chinese export restrictions amplified supply tightness |
| 2015-2016 | Potash cartel breakdown | MOP -45% from peak | MOS -40%, IPI -55% | BPC marketing alliance dissolved, price war ensued |
| Q3 2023 | Indian tender demand surge | DAP +15% in 6 weeks | MOS +12%, NTR +8% | India purchased 3.5M tons in single tender round |
| Q4 2025 | China phosphate export restrictions | DAP +20% in 8 weeks | MOS +18%, ICL +14% | Beijing limited phosphate exports to protect domestic supply |

## Key Takeaway

Mosaic's dual phosphate-potash platform generates a **+14.0% average stock response** to a 12% fertilizer price rally, with the potash segment providing the greatest margin expansion due to its fixed-cost operating leverage. The global fertilizer market remains structurally tight: sanctions continue to limit **40% of global potash** exports from Russia and Belarus, Chinese export controls restrict phosphate supply, and natural gas volatility constrains nitrogen production economics. These supply constraints, combined with a global population requiring **2% annual food production growth**, create a favorable long-term pricing environment for producers.

On the losing side, farm operators bear the heaviest burden at **-8.0%** margin impact, which cascades through to food processors (**-4.0%**) and food-importing nations (**-5.5%** in import cost increases) over 6-12 month lag periods.

For investors, the actionable framework is to monitor the quarterly Indian fertilizer tenders and the USDA's planting intention reports as timing signals: when intended corn acreage exceeds 92 million acres, fertilizer demand exceeds domestic production capacity and prices accelerate. Long MOS and NTR for core fertilizer exposure, with CF Industries offering nitrogen-specific upside tied to natural gas spread dynamics. Intrepid Potash provides the highest-beta pure-play for traders seeking maximum leverage to potash price moves, though its small market capitalization of $500 million introduces liquidity risk on position sizing.
