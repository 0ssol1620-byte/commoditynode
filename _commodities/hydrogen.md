---
layout: commodity
image: "/assets/images/og-default.png"
title: "Hydrogen"
description: "Hydrogen's role as a clean energy carrier, electrolyzer economics, and the green vs grey transition."
commodity_slug: "hydrogen"
symbol: "PLUG"
sector: "Energy/Clean"
etfs: ["HDRO", "ICLN"]
companies: ["PLUG", "BE", "FCEL"]
substitutes: ["Batteries", "Natural Gas", "Biofuels"]
themes: ["Clean Energy Transition", "Industrial Decarbonization"]
tags: [hydrogen, clean energy, electrolysis, fuel cells, decarbonization, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "hydrogen", "label": "Hydrogen"},
  "levels": [
    {"nodes": [
      {"id":"plug_h2","label":"Plug Power (PLUG)","type":"producer","impact":9,"correlation":0.85,"sector":"Electrolyzers"},
      {"id":"be_h2","label":"Bloom Energy (BE)","type":"producer","impact":7,"correlation":0.65,"sector":"Fuel Cells"},
      {"id":"fcel_h2","label":"FuelCell Energy (FCEL)","type":"producer","impact":7,"correlation":0.62,"sector":"Fuel Cells"},
      {"id":"hdro_h2","label":"HDRO Hydrogen ETF","type":"etf","impact":6,"correlation":0.70,"sector":"Clean Energy"},
      {"id":"icln_h2","label":"ICLN Clean Energy ETF","type":"etf","impact":4,"correlation":0.45,"sector":"Clean Energy"},
      {"id":"apd_h2","label":"Air Products (APD)","type":"producer","impact":8,"correlation":0.72,"sector":"Industrial Gas"},
      {"id":"lin_h2","label":"Linde (LIN)","type":"producer","impact":7,"correlation":0.65,"sector":"Industrial Gas"},
      {"id":"nel_h2","label":"NEL ASA (NLLSF)","type":"producer","impact":8,"correlation":0.78,"sector":"Electrolyzers"},
      {"id":"bldp_h2","label":"Ballard Power (BLDP)","type":"producer","impact":7,"correlation":0.68,"sector":"Fuel Cells"},
      {"id":"h2_index","label":"Hydrogen Cost Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"natgas_h2","label":"Natural Gas (NG)","type":"commodity","impact":7,"correlation":0.60,"sector":"Energy"},
      {"id":"nkla_h2","label":"Nikola Corp (NKLA)","type":"consumer","impact":5,"correlation":0.55,"sector":"Heavy Transport"},
      {"id":"cmi_h2","label":"Cummins (CMI)","type":"producer","impact":6,"correlation":0.50,"sector":"Engines/Electrolyzers"}
    ]},
    {"nodes": [
      {"id":"itm_h2","label":"ITM Power (ITMPF)","type":"producer","impact":7,"correlation":0.70,"sector":"Electrolyzers","parentId":"plug_h2"},
      {"id":"refining_h2","label":"Refining H2 Demand","type":"consumer","impact":5,"correlation":0.35,"sector":"Oil Refining","parentId":"natgas_h2"},
      {"id":"ammonia_h2","label":"Ammonia Production","type":"consumer","impact":6,"correlation":0.45,"sector":"Fertilizers","parentId":"apd_h2"},
      {"id":"toyota_fcev","label":"Toyota FCEV (TM)","type":"consumer","impact":4,"correlation":0.30,"sector":"Automotive","parentId":"bldp_h2"},
      {"id":"hyzon_h2","label":"Hyzon Motors (HYZN)","type":"consumer","impact":4,"correlation":0.48,"sector":"Heavy Transport","parentId":"nkla_h2"},
      {"id":"ira_h2","label":"IRA Hydrogen Credits","type":"policy","impact":8,"correlation":0.55,"sector":"US Policy","parentId":"h2_index"},
      {"id":"eu_h2","label":"EU Hydrogen Strategy","type":"policy","impact":7,"correlation":0.50,"sector":"EU Policy","parentId":"h2_index"},
      {"id":"solar_h2","label":"Solar Input Cost","type":"commodity","impact":-5,"correlation":-0.40,"sector":"Renewables","parentId":"plug_h2"},
      {"id":"wind_h2","label":"Wind Input Cost","type":"commodity","impact":-4,"correlation":-0.35,"sector":"Renewables","parentId":"nel_h2"},
      {"id":"battery_sub","label":"Battery Storage (Sub)","type":"substitute","impact":-5,"correlation":-0.38,"sector":"Energy Storage","parentId":"h2_index"},
      {"id":"pem_tech","label":"PEM Electrolyzer Tech","type":"processor","impact":7,"correlation":0.55,"sector":"Technology","parentId":"plug_h2"},
      {"id":"alk_tech","label":"Alkaline Electrolyzer Tech","type":"processor","impact":6,"correlation":0.48,"sector":"Technology","parentId":"nel_h2"}
    ]},
    {"nodes": [
      {"id":"iridium_h2","label":"Iridium Catalyst Cost","type":"commodity","impact":-4,"correlation":-0.30,"sector":"PGM","parentId":"pem_tech"},
      {"id":"steel_decarb","label":"Green Steel (H2-DRI)","type":"consumer","impact":5,"correlation":0.38,"sector":"Steel","parentId":"ammonia_h2"},
      {"id":"shipping_h2","label":"Shipping Fuel (NH3)","type":"consumer","impact":4,"correlation":0.30,"sector":"Maritime","parentId":"ammonia_h2"},
      {"id":"pipeline_h2","label":"H2 Pipeline Infrastructure","type":"macro","impact":5,"correlation":0.35,"sector":"Infrastructure","parentId":"apd_h2"},
      {"id":"grey_h2","label":"Grey Hydrogen Baseline","type":"commodity","impact":-3,"correlation":-0.25,"sector":"Fossil H2","parentId":"natgas_h2"},
      {"id":"carbon_price","label":"Carbon Price (EUA)","type":"policy","impact":6,"correlation":0.45,"sector":"Carbon Markets","parentId":"eu_h2"},
      {"id":"water_use","label":"Water Electrolysis Demand","type":"macro","impact":-3,"correlation":-0.20,"sector":"Water","parentId":"pem_tech"},
      {"id":"h2_storage","label":"H2 Storage Technology","type":"macro","impact":4,"correlation":0.30,"sector":"Technology","parentId":"pipeline_h2"},
      {"id":"biofuel_sub","label":"Biofuels Substitution","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Bioenergy","parentId":"battery_sub"},
      {"id":"china_h2","label":"China Hydrogen Plan","type":"policy","impact":5,"correlation":0.35,"sector":"China Policy","parentId":"eu_h2"},
      {"id":"truck_fleet","label":"Heavy Truck Fleet (PCAR)","type":"consumer","impact":3,"correlation":0.22,"sector":"Transport","parentId":"nkla_h2"}
    ]},
    {"nodes": [
      {"id":"platinum_elec","label":"Platinum Electrolyzer Use","type":"commodity","impact":3,"correlation":0.22,"sector":"PGM","parentId":"iridium_h2"},
      {"id":"desalination","label":"Desalination for H2","type":"macro","impact":-2,"correlation":-0.15,"sector":"Water","parentId":"water_use"},
      {"id":"h2_hubs","label":"US Regional H2 Hubs","type":"policy","impact":5,"correlation":0.35,"sector":"Infrastructure","parentId":"ira_h2"},
      {"id":"eur_usd","label":"EUR/USD (H2 Trade)","type":"fx","impact":-3,"correlation":-0.25,"sector":"Forex","parentId":"carbon_price"},
      {"id":"lng_link","label":"LNG Price Linkage","type":"commodity","impact":5,"correlation":0.42,"sector":"Energy","parentId":"grey_h2"},
      {"id":"methanol_h2","label":"Green Methanol","type":"consumer","impact":3,"correlation":0.22,"sector":"Chemicals","parentId":"shipping_h2"},
      {"id":"electrolyzer_scale","label":"Electrolyzer GW Scale-Up","type":"macro","impact":6,"correlation":0.45,"sector":"Manufacturing","parentId":"pem_tech"},
      {"id":"aviation_h2","label":"Hydrogen Aviation (AIRBUS)","type":"consumer","impact":2,"correlation":0.15,"sector":"Aerospace","parentId":"h2_storage"},
      {"id":"salt_cavern","label":"Salt Cavern H2 Storage","type":"macro","impact":3,"correlation":0.22,"sector":"Infrastructure","parentId":"h2_storage"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Hydrogen is the most abundant element in the universe and is emerging as a critical energy carrier for decarbonizing sectors that batteries cannot easily reach. Today, approximately 95 million tonnes of hydrogen are produced annually, with over 95% derived from natural gas (grey hydrogen) or coal (brown hydrogen) without carbon capture. Green hydrogen -- produced via electrolysis powered by renewable electricity -- currently accounts for less than 1% of production but is the focus of massive policy support and capital investment. The Inflation Reduction Act's production tax credit of up to $3/kg and the EU's REPowerEU target of 10 million tonnes of domestic green hydrogen by 2030 are reshaping the industry's economics. The key challenge remains cost: green hydrogen costs $4-7/kg versus $1-2/kg for grey, though the gap is narrowing as electrolyzer costs decline and renewable electricity prices fall.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** Plug Power (PLUG) and NEL ASA are leading PEM and alkaline electrolyzer manufacturers scaling gigawatt-level production. Industrial gas incumbents Air Products (APD) and Linde (LIN) are investing billions in integrated green hydrogen mega-projects, leveraging existing distribution infrastructure. Bloom Energy (BE) and FuelCell Energy (FCEL) focus on stationary fuel cell power systems, while Ballard Power (BLDP) targets heavy-duty transport applications. Cummins (CMI) spans both electrolyzer manufacturing and hydrogen engine development, positioning across the value chain.

**Secondary -- Supply Chain and Processing:** Green hydrogen economics depend on three inputs: electrolyzer capital cost, renewable electricity price, and capacity utilization. PEM electrolyzers require iridium catalysts, creating a potential bottleneck as production scales. Ammonia synthesis consumes roughly 35% of global hydrogen production as feedstock, making the fertilizer industry both the largest current market and a key decarbonization target. Heavy transport -- long-haul trucking, shipping, and eventually aviation -- represents the most compelling growth market where hydrogen's energy density advantages over batteries are decisive.

**Tertiary -- Macro and Second-Order Effects:** Carbon pricing mechanisms (EU ETS, potential US carbon border adjustments) improve green hydrogen's competitiveness by raising grey hydrogen costs. Hydrogen pipeline infrastructure and geological storage (salt caverns) are critical enablers that require decades of development. The natural gas price directly sets the floor for grey hydrogen costs, meaning LNG price spikes temporarily improve the green hydrogen business case. Water availability for electrolysis is an underappreciated constraint in arid regions pursuing large-scale projects.

## Which Companies and ETFs Benefit When the Price Rises?

Electrolyzer manufacturers benefit from exponential order book growth as government subsidies de-risk project economics. Air Products and Linde capture margin on hydrogen distribution and long-term offtake contracts. Platinum group metal miners benefit from increased catalyst demand in PEM electrolyzers and fuel cells. Renewable energy developers gain incremental demand from dedicated hydrogen production facilities. Countries with abundant cheap renewables -- Australia, Chile, the Middle East -- position as future green hydrogen exporters.

## Which Companies and Sectors Are Hurt by a Price Increase?

Natural gas producers face long-term demand erosion as green hydrogen displaces grey hydrogen in refining and ammonia production. Pure-play hydrogen startups with negative cash flows face dilution risk if the cost curve declines slower than projected. Battery electric vehicle manufacturers face competitive pressure from hydrogen fuel cell vehicles in heavy transport segments. Incumbent grey hydrogen producers without carbon capture face stranded asset risk as carbon prices rise and green mandates expand.

## What Should Traders Watch When Analyzing This Market?

Hydrogen lacks a standardized commodity benchmark; track project-level offtake contract pricing and electrolyzer cost surveys from BNEF and IEA. The HDRO ETF provides diversified exposure to the hydrogen value chain. Monitor IRA guidance updates and EU delegated act definitions of "green hydrogen" for regulatory catalysts. Natural gas futures (Henry Hub, TTF) serve as a grey hydrogen cost proxy. Watch quarterly earnings from PLUG, APD, and LIN for order backlog and project commissioning data. Electrolyzer cost per kilowatt is the industry's most important metric -- a decline below $300/kW would make green hydrogen competitive with grey in most regions without subsidies.
