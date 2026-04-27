---
layout: commodity
unit: "$/kg"
image: "/assets/images/og-rare-earth.png"
title: "Rare Earth Price Impact: Tech Supply Chains & Critical Minerals"
description: "Rare earth elements powering permanent magnets for EV motors, wind turbines, and defense systems, with extreme Chinese supply chain dominance."
commodity_slug: "rare-earth"
symbol: "MP"
data_type: "proxy"
sector: "Metals/Technology"
etfs: ["REMX", "PICK"]
companies: ["MP"]
substitutes: ["Ferrite Magnets", "Induction Motors", "Recycled REE"]
themes: ["EV Transition", "Defense Rearming", "US-China Tariff War"]
tags: [rare earth, neodymium, permanent magnets, EV motors, wind turbines, defense, china dominance, critical minerals, supply chain]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "rare_earth", "label": "Rare Earth Elements"},
  "levels": [
    {"nodes": [
      {"id":"remx_re","label":"REMX Rare Earth ETF","type":"etf","impact":9,"correlation":0.82,"sector":"Critical Minerals"},
      {"id":"pick_re","label":"PICK Mining ETF","type":"etf","impact":4,"correlation":0.30,"sector":"Mining"},
      {"id":"mp_re","label":"MP Materials (MP)","type":"producer","impact":10,"correlation":0.90,"sector":"Rare Earth Mining"},
      {"id":"lynas_re","label":"Lynas Rare Earths (LYSCF)","type":"producer","impact":10,"correlation":0.88,"sector":"Rare Earth Mining"},
      {"id":"re_index","label":"NdPr Oxide Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"china_re","label":"China REE Production","type":"regional","impact":9,"correlation":0.82,"sector":"China Supply"},
      {"id":"tsla_re","label":"Tesla (TSLA)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"EV"},
      {"id":"gm_re","label":"General Motors (GM)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Automotive"},
      {"id":"f_re","label":"Ford Motor (F)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Automotive"},
      {"id":"gev_re","label":"GE Vernova (GEV)","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Wind Energy"},
      {"id":"lmt_re","label":"Lockheed Martin (LMT)","type":"consumer","impact":-3,"correlation":-0.20,"sector":"Defense"},
      {"id":"rtx_re","label":"RTX Corp (RTX)","type":"consumer","impact":-3,"correlation":-0.18,"sector":"Defense"},
      {"id":"magnet_demand","label":"NdFeB Magnet Demand","type":"macro","impact":9,"correlation":0.85,"sector":"Permanent Magnets"}
    ]},
    {"nodes": [
      {"id":"noc_re","label":"Northrop Grumman (NOC)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Defense","parentId":"lmt_re"},
      {"id":"vwsy_re","label":"Vestas Wind (VWSYF)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Wind Energy","parentId":"gev_re"},
      {"id":"aapl_re","label":"Apple (AAPL)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Consumer Electronics","parentId":"magnet_demand"},
      {"id":"china_sep","label":"China REE Separation","type":"processor","impact":9,"correlation":0.80,"sector":"Processing","parentId":"china_re"},
      {"id":"mountain_pass","label":"Mountain Pass Mine (US)","type":"regional","impact":8,"correlation":0.75,"sector":"US Supply","parentId":"mp_re"},
      {"id":"mt_weld","label":"Mt Weld Mine (Australia)","type":"regional","impact":8,"correlation":0.72,"sector":"Australia Supply","parentId":"lynas_re"},
      {"id":"ndpr_oxide","label":"NdPr Oxide Market","type":"commodity","impact":10,"correlation":0.98,"sector":"Magnet Feedstock","parentId":"re_index"},
      {"id":"dy_oxide","label":"Dysprosium Oxide Market","type":"commodity","impact":8,"correlation":0.75,"sector":"Heavy REE","parentId":"re_index"},
      {"id":"rivn_re","label":"Rivian (RIVN)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"EV","parentId":"tsla_re"},
      {"id":"nio_re","label":"NIO Inc (NIO)","type":"consumer","impact":-3,"correlation":-0.20,"sector":"EV","parentId":"china_re"},
      {"id":"siemens_gamesa","label":"Siemens Gamesa","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Wind Energy","parentId":"gev_re"},
      {"id":"ev_motor_demand","label":"EV Motor Production","type":"macro","impact":8,"correlation":0.70,"sector":"EV Demand","parentId":"tsla_re"}
    ]},
    {"nodes": [
      {"id":"ferrite_sub","label":"Ferrite Magnets (Substitute)","type":"substitute","impact":-5,"correlation":-0.38,"sector":"Magnet Alt","parentId":"magnet_demand"},
      {"id":"induction_sub","label":"Induction Motors (Substitute)","type":"substitute","impact":-5,"correlation":-0.35,"sector":"Motor Alt","parentId":"ev_motor_demand"},
      {"id":"recycled_ree","label":"REE Recycling","type":"processor","impact":-4,"correlation":-0.28,"sector":"Recycling","parentId":"china_sep"},
      {"id":"dxy_re","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.38,"sector":"Forex","parentId":"re_index"},
      {"id":"cny_re","label":"Chinese Yuan (CNY)","type":"fx","impact":5,"correlation":0.45,"sector":"Forex","parentId":"china_re"},
      {"id":"aud_re","label":"Australian Dollar (AUD)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"lynas_re"},
      {"id":"dod_stockpile","label":"DoD Strategic Stockpile","type":"policy","impact":6,"correlation":0.45,"sector":"Defense Policy","parentId":"lmt_re"},
      {"id":"china_export_re","label":"China REE Export Controls","type":"policy","impact":9,"correlation":0.70,"sector":"Geopolitics","parentId":"china_re"},
      {"id":"eu_magnet_policy","label":"EU Magnet Reshoring","type":"policy","impact":5,"correlation":0.38,"sector":"EU Policy","parentId":"remx_re"},
      {"id":"ev_adoption_re","label":"Global EV Adoption","type":"macro","impact":7,"correlation":0.58,"sector":"Demand","parentId":"ev_motor_demand"},
      {"id":"offshore_wind","label":"Offshore Wind Growth","type":"macro","impact":6,"correlation":0.48,"sector":"Wind Energy","parentId":"gev_re"}
    ]},
    {"nodes": [
      {"id":"us_sep_plant","label":"US Separation Capacity","type":"policy","impact":7,"correlation":0.52,"sector":"Supply Chain","parentId":"mountain_pass"},
      {"id":"japan_magnet","label":"Japan Magnet Makers (TDK)","type":"processor","impact":5,"correlation":0.38,"sector":"Magnets","parentId":"magnet_demand"},
      {"id":"myanmar_re","label":"Myanmar REE Mining","type":"regional","impact":6,"correlation":0.45,"sector":"Supply","parentId":"china_sep"},
      {"id":"defense_esg","label":"Defense Supply Chain Risk","type":"policy","impact":5,"correlation":0.35,"sector":"National Security","parentId":"dod_stockpile"},
      {"id":"grain_boundary","label":"Grain Boundary Diffusion","type":"macro","impact":4,"correlation":0.28,"sector":"Technology","parentId":"dy_oxide"},
      {"id":"robotics_re","label":"Robotics REE Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Emerging Demand","parentId":"magnet_demand"},
      {"id":"ira_re","label":"IRA Critical Mineral Credits","type":"policy","impact":5,"correlation":0.40,"sector":"US Policy","parentId":"mp_re"},
      {"id":"terbium_market","label":"Terbium Oxide Market","type":"commodity","impact":5,"correlation":0.55,"sector":"Heavy REE","parentId":"dy_oxide"},
      {"id":"scandium_link","label":"Scandium (Related)","type":"commodity","impact":3,"correlation":0.25,"sector":"Light Metals","parentId":"re_index"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Rare earth elements -- particularly neodymium, praseodymium, dysprosium, and terbium -- are indispensable for the permanent magnets that power EV traction motors, direct-drive wind turbines, guided missiles, and countless electronic devices. Despite the name, rare earths are geologically abundant but economically concentrated: China controls over 60% of global mining, 85% of separation and processing, and 90% of finished magnet production. NdFeB (neodymium-iron-boron) permanent magnets are the strongest commercially available magnets, and no substitute offers equivalent performance in the compact, high-torque applications that define modern electrification. Global rare earth oxide production is approximately 350,000 tonnes annually, but the high-value magnet rare earths (NdPr oxide and heavy REE) represent the strategic bottleneck.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Direct Producers and Consumers:** MP Materials operates the Mountain Pass mine in California, the only scaled rare earth mine in the Western hemisphere, and is investing in downstream oxide separation and magnet manufacturing. Lynas Rare Earths (LYC.AX / LYSCF) operates the Mt Weld mine in Australia and a separation plant in Malaysia, making it the largest non-Chinese rare earth producer. EV manufacturers -- Tesla, GM, Ford, Rivian, NIO -- consume growing volumes of NdFeB magnets for permanent magnet synchronous motors (PMSMs), which deliver 5-10% greater efficiency than induction motor alternatives. Wind turbine OEMs like GE Vernova and Vestas use direct-drive generators containing 600+ kg of rare earth magnets per MW.

**Secondary -- Supply Chain and Processing:** Chinese separation plants in Jiangxi and Inner Mongolia process the vast majority of global rare earth concentrate into separated oxides. This midstream chokepoint gives China leverage that extends far beyond mining. Defense contractors -- Lockheed Martin, RTX, Northrop Grumman -- depend on rare earth magnets for precision-guided munitions, fighter jet actuators, satellite systems, and submarine propulsion. Consumer electronics (Apple, Samsung) use smaller quantities per device but aggregate into substantial demand across billions of units. Japanese magnet manufacturers (TDK, Shin-Etsu) are critical intermediaries between Chinese oxide supply and global OEM demand.

**Tertiary -- Macro and Second-Order Effects:** China's willingness to use rare earth export controls as a geopolitical tool -- demonstrated during the 2010 Japan dispute and escalating in 2023-2024 -- has elevated supply chain security to a national priority for the US, EU, Japan, and Australia. The US Department of Defense is funding strategic stockpiles and domestic processing capacity. Grain boundary diffusion technology reduces dysprosium usage per magnet by 50% or more, partially mitigating heavy REE supply risk. Emerging demand from robotics, drones, and electric aviation is expanding the addressable market for high-performance magnets beyond current projections.

## Which Companies and ETFs Benefit When the Price Rises?

MP Materials (MP) and Lynas (LYSCF) are the primary beneficiaries of both higher rare earth prices and Western supply chain diversification spending. Government funding, offtake agreements with automakers (MP's deal with GM), and strategic importance create a multi-layered value proposition beyond commodity price exposure. Chinese rare earth producers (Northern Rare Earth, China Rare Earth Group) benefit from pricing power and vertical integration into magnets. Nations with undeveloped REE deposits -- Greenland, Brazil, India, Canada -- attract exploration investment and geopolitical attention.

## Which Companies and Sectors Are Hurt by a Price Increase?

EV manufacturers face motor cost inflation when NdPr prices rise, with each vehicle containing 2-4 kg of rare earth magnets worth $200-500 at current prices. Wind turbine developers see higher nacelle costs that erode project economics, particularly for offshore direct-drive designs. Defense contractors face supply chain vulnerability and may need to qualify alternative suppliers at significant time and cost. Consumer electronics companies absorb incremental component costs across haptic motors, speakers, and hard drive magnets. Ferrite magnet and induction motor alternatives gain relative competitiveness but sacrifice performance.

## What Should Traders Watch When Analyzing This Market?

Rare earth pricing is referenced through Asian Metal, Fastmarkets, and Shanghai Metal Market assessments, with no liquid Western futures contract. MP Materials and Lynas share prices serve as the most accessible equity proxies. Monitor China's rare earth production quotas (issued semi-annually), export license decisions, and environmental enforcement actions as primary supply catalysts. The NdPr-to-dysprosium price ratio indicates light versus heavy REE market dynamics and magnet cost composition shifts. Defense authorization bills and DOD rare earth procurement announcements signal policy-driven demand. Track EV motor architecture decisions (permanent magnet vs induction) from major automakers as the single most important long-term demand variable.
