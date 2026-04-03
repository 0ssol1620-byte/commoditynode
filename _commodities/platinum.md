---
layout: commodity
unit: "$/oz"
image: "/assets/images/og-platinum.png"
title: "Platinum"
description: "Platinum price impact analysis: tracking the metal's transition from diesel catalytic converters to hydrogen fuel cell technology. Explore how platinum supply constraints in South Africa and shifting demand from auto catalysts to green hydrogen shape global markets."
commodity_slug: "platinum"
symbol: "PL=F"
sector: "Precious Metals"
etfs: ["PPLT"]
companies: ["SBSW", "IMPUY", "ANGPY"]
substitutes: ["Palladium", "Rhodium"]
themes: ["EV Transition", "Clean Energy"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "platinum", "label": "Platinum (NYMEX)"},
  "levels": [
    {"nodes": [
      {"id":"pplt","label":"PPLT Platinum ETF","type":"etf","impact":9,"correlation":0.90,"sector":"Precious Metals"},
      {"id":"sbsw_pt","label":"Sibanye-Stillwater (SBSW)","type":"producer","impact":10,"correlation":0.82,"sector":"PGM Mining"},
      {"id":"impuy_pt","label":"Impala Platinum (IMPUY)","type":"producer","impact":11,"correlation":0.85,"sector":"PGM Mining"},
      {"id":"angpy","label":"Anglo Amer Platinum (ANGPY)","type":"producer","impact":10,"correlation":0.83,"sector":"PGM Mining"},
      {"id":"pt_index","label":"Platinum Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"xme_pt","label":"XME Metals Mining ETF","type":"etf","impact":4,"correlation":0.38,"sector":"Mining"},
      {"id":"gm_pt","label":"General Motors (GM)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Auto Catalysts"},
      {"id":"tm_pt","label":"Toyota Motor (TM)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Auto Catalysts"},
      {"id":"f_pt","label":"Ford Motor (F)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Auto Catalysts"},
      {"id":"plug_pt","label":"Plug Power (PLUG)","type":"consumer","impact":4,"correlation":0.30,"sector":"Hydrogen"},
      {"id":"be_pt","label":"Bloom Energy (BE)","type":"consumer","impact":3,"correlation":0.25,"sector":"Fuel Cells"},
      {"id":"gld_related","label":"Gold (Related)","type":"commodity","impact":6,"correlation":0.65,"sector":"Precious Metals"}
    ]},
    {"nodes": [
      {"id":"stla_pt","label":"Stellantis (STLA)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Automotive","parentId":"gm_pt"},
      {"id":"hmc_pt","label":"Honda Motor (HMC)","type":"consumer","impact":-2,"correlation":-0.14,"sector":"Automotive","parentId":"tm_pt"},
      {"id":"catalyst_mfg","label":"Catalytic Converter Mfg","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Auto Parts","parentId":"gm_pt"},
      {"id":"basf_pt","label":"BASF (BAS.DE)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Catalysts/Chemicals","parentId":"catalyst_mfg"},
      {"id":"jm_pt","label":"Johnson Matthey (JMPLY)","type":"processor","impact":5,"correlation":0.42,"sector":"PGM Refining","parentId":"sbsw_pt"},
      {"id":"jewelry_pt","label":"Jewelry Demand","type":"consumer","impact":3,"correlation":0.25,"sector":"Luxury","parentId":"pt_index"},
      {"id":"tif_pt","label":"Tiffany (LVMUY)","type":"consumer","impact":2,"correlation":0.15,"sector":"Luxury","parentId":"jewelry_pt"},
      {"id":"sig_pt","label":"Signet Jewelers (SIG)","type":"consumer","impact":2,"correlation":0.18,"sector":"Jewelry Retail","parentId":"jewelry_pt"},
      {"id":"fcel_pt","label":"FuelCell Energy (FCEL)","type":"consumer","impact":3,"correlation":0.22,"sector":"Fuel Cells","parentId":"plug_pt"},
      {"id":"hydr_etf","label":"Hydrogen ETF (HDRO)","type":"etf","impact":3,"correlation":0.25,"sector":"Clean Energy","parentId":"be_pt"},
      {"id":"palladium_sub","label":"Palladium (Substitute)","type":"substitute","impact":-5,"correlation":-0.40,"sector":"PGMs","parentId":"catalyst_mfg"},
      {"id":"recycling_pt","label":"PGM Recycling","type":"processor","impact":-4,"correlation":-0.30,"sector":"Recycling","parentId":"jm_pt"}
    ]},
    {"nodes": [
      {"id":"zar_pt","label":"South African Rand (ZAR)","type":"fx","impact":6,"correlation":0.52,"sector":"Forex","parentId":"sbsw_pt"},
      {"id":"dxy_pt","label":"US Dollar (DXY)","type":"fx","impact":-5,"correlation":-0.45,"sector":"Forex","parentId":"pt_index"},
      {"id":"sa_power","label":"SA Power Crisis (Eskom)","type":"macro","impact":7,"correlation":0.50,"sector":"Supply Risk","parentId":"zar_pt"},
      {"id":"sa_mining_policy","label":"SA Mining Policy","type":"policy","impact":6,"correlation":0.45,"sector":"Regulation","parentId":"zar_pt"},
      {"id":"diesel_catalyst","label":"Diesel Catalyst Demand","type":"consumer","impact":3,"correlation":0.25,"sector":"Auto Emissions","parentId":"catalyst_mfg"},
      {"id":"ev_threat_pt","label":"EV Adoption (Threat)","type":"macro","impact":-6,"correlation":-0.45,"sector":"Auto Transition","parentId":"gm_pt"},
      {"id":"hydrogen_economy","label":"Hydrogen Economy Growth","type":"macro","impact":5,"correlation":0.38,"sector":"Clean Energy","parentId":"plug_pt"},
      {"id":"investment_demand","label":"Investment Demand","type":"macro","impact":5,"correlation":0.40,"sector":"Finance","parentId":"pplt"},
      {"id":"glass_mfg","label":"Glass Manufacturing","type":"consumer","impact":2,"correlation":0.15,"sector":"Industrial","parentId":"pt_index"},
      {"id":"medical_pt","label":"Medical Devices","type":"consumer","impact":2,"correlation":0.12,"sector":"Healthcare","parentId":"pt_index"},
      {"id":"wpic_data","label":"WPIC Supply/Demand Data","type":"macro","impact":5,"correlation":0.40,"sector":"Data Release","parentId":"pt_index"},
      {"id":"rhodium_related","label":"Rhodium (Related)","type":"commodity","impact":5,"correlation":0.55,"sector":"PGMs","parentId":"palladium_sub"}
    ]},
    {"nodes": [
      {"id":"euro_emission","label":"Euro 7 Emission Std","type":"policy","impact":5,"correlation":0.35,"sector":"Regulation","parentId":"diesel_catalyst"},
      {"id":"china_auto_pt","label":"China Auto Catalyst","type":"macro","impact":5,"correlation":0.38,"sector":"Demand","parentId":"catalyst_mfg"},
      {"id":"fcev_growth","label":"FCEV Market Growth","type":"macro","impact":4,"correlation":0.28,"sector":"Hydrogen","parentId":"hydrogen_economy"},
      {"id":"pt_deficit","label":"Platinum Market Deficit","type":"macro","impact":6,"correlation":0.48,"sector":"Supply/Demand","parentId":"wpic_data"},
      {"id":"mining_depth","label":"SA Mining Depth Challenge","type":"macro","impact":5,"correlation":0.35,"sector":"Supply","parentId":"sa_mining_policy"},
      {"id":"pt_gold_ratio","label":"Platinum/Gold Ratio","type":"macro","impact":4,"correlation":0.35,"sector":"Relative Value","parentId":"gld_related"},
      {"id":"autocatalyst_recov","label":"Autocatalyst Recovery","type":"processor","impact":-3,"correlation":-0.22,"sector":"Recycling","parentId":"recycling_pt"},
      {"id":"green_hydrogen","label":"Green Hydrogen Policy","type":"policy","impact":4,"correlation":0.30,"sector":"Clean Energy","parentId":"fcev_growth"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Platinum is a rare precious metal with a unique demand profile spanning auto catalysts, jewelry, and emerging hydrogen economy applications. South Africa produces over 70% of global platinum supply, making the market acutely sensitive to South African mining conditions including electricity reliability (Eskom load-shedding), labor relations, and geological challenges in aging Bushveld Complex mines. Platinum has traded at a persistent discount to palladium since 2015, reversing a historical premium relationship. Annual mine production is approximately 6 million ounces, with the market in structural deficit as mine supply declines against stable-to-growing demand.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Platinum is the preferred catalyst for diesel vehicle emission systems, but declining diesel market share in Europe (from 55% to below 20% of new car sales) has structurally reduced this demand channel. Sibanye-Stillwater and Impala Platinum are the largest primary producers, with earnings highly leveraged to the PGM basket price. The platinum/palladium substitution cycle is underway, with automakers incorporating platinum into gasoline catalysts to diversify away from expensive palladium. Anglo American Platinum (Amplats) is the world's largest single producer.

**Secondary -- Supply Chain and Processing:** Jewelry fabrication, primarily in China and Japan, accounts for approximately 25-30% of platinum demand. Investment demand through PPLT ETF, coins, and bars provides incremental price support. Platinum's discount to gold (historically, platinum traded at a premium) has attracted value-oriented precious metal investors. World Platinum Investment Council (WPIC) quarterly reports provide the most comprehensive supply-demand balances. PGM recycling from autocatalysts and jewelry provides a secondary supply source that grows as end-of-life vehicle scrapping increases.

**Tertiary -- Macro and Second-Order Effects:** Proton exchange membrane (PEM) fuel cells for hydrogen vehicles and stationary power applications use platinum as a catalyst, with each fuel cell vehicle requiring 30-60 grams of platinum. While hydrogen adoption remains early-stage, this represents the most significant long-term demand growth catalyst. Green hydrogen electrolyzer deployments also require platinum-group metals, linking platinum demand to the broader clean energy transition. Platinum's role in glass fiber manufacturing and petroleum refining catalysts provides diversified industrial demand.

## Which Companies and ETFs Benefit When the Price Rises?

South African PGM miners (Sibanye-Stillwater, Impala Platinum, Anglo American Platinum) capture direct price upside given their dominant supply position. Platinum recyclers and auto catalyst processors benefit from higher scrap values. Hydrogen fuel cell companies see reduced relative cost disadvantage as platinum prices support investment in thrifting technology. South Africa's mining sector employment and fiscal revenues improve during sustained price rallies.

## Which Companies and Sectors Are Hurt by a Price Increase?

Automakers using platinum catalysts in diesel and hybrid vehicles absorb higher per-vehicle catalyst costs. Jewelry retailers face demand elasticity as consumers shift to lower-priced alternatives. Hydrogen fuel cell adoption faces cost headwinds when platinum prices rise, slowing deployment timelines. Industrial users in glass, chemical, and petroleum refining applications see higher catalyst costs that cannot be easily substituted. Diesel vehicle manufacturers face a compounding cost challenge from emissions compliance.

## What Should Traders Watch When Analyzing This Market?

The platinum/palladium spread is the core relative value trade in PGMs. When platinum trades at a deep discount to palladium (exceeding $1,000/oz), substitution incentives accelerate. Monitor South African electricity supply reliability (Eskom generation capacity) as the primary near-term supply risk factor. Anglo American Platinum's and Sibanye's quarterly production reports move the market. Hydrogen policy announcements (EU hydrogen strategy, U.S. hydrogen hubs) serve as sentiment catalysts for longer-term positioning. NYMEX platinum futures and London Platinum and Palladium Market (LPPM) fixings are the primary price references.
