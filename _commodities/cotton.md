---
layout: commodity
image: "/assets/images/og-cotton.png"
title: "Cotton"
description: "Cotton's textile industry dynamics, weather sensitivity, and polyester competition."
commodity_slug: "cotton"
symbol: "CT=F"
sector: "Soft Commodities"
etfs: ["BAL"]
companies: ["LEVI", "GPS", "PVH"]
substitutes: ["Polyester", "Nylon", "Rayon"]
themes: ["Supply Chain Disruption"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "cotton", "label": "Cotton (ICE)"},
  "levels": [
    {"nodes": [
      {"id":"bal","label":"BAL Cotton ETN","type":"etf","impact":9,"correlation":0.88,"sector":"Soft Commodities"},
      {"id":"cotton_index","label":"Cotton Futures Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"levi_ct","label":"Levi Strauss (LEVI)","type":"consumer","impact":-5,"correlation":-0.45,"sector":"Apparel"},
      {"id":"gps_ct","label":"Gap Inc (GPS)","type":"consumer","impact":-4,"correlation":-0.40,"sector":"Apparel"},
      {"id":"pvh_ct","label":"PVH Corp (PVH)","type":"consumer","impact":-4,"correlation":-0.38,"sector":"Apparel"},
      {"id":"nke_ct","label":"Nike (NKE)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Athletic Apparel"},
      {"id":"hbi","label":"Hanesbrands (HBI)","type":"consumer","impact":-5,"correlation":-0.48,"sector":"Basic Apparel"},
      {"id":"vfc_ct","label":"VF Corp (VFC)","type":"consumer","impact":-4,"correlation":-0.38,"sector":"Apparel"},
      {"id":"xrt_ct","label":"XRT Retail ETF","type":"etf","impact":-2,"correlation":-0.18,"sector":"Retail"},
      {"id":"dba_ct","label":"DBA Agriculture ETF","type":"etf","impact":5,"correlation":0.45,"sector":"Agriculture"},
      {"id":"ctva_ct","label":"Corteva (CTVA)","type":"supplier","impact":4,"correlation":0.35,"sector":"Ag Inputs"}
    ]},
    {"nodes": [
      {"id":"rl","label":"Ralph Lauren (RL)","type":"consumer","impact":-3,"correlation":-0.28,"sector":"Luxury Apparel","parentId":"pvh_ct"},
      {"id":"tpr","label":"Tapestry (TPR)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Luxury","parentId":"pvh_ct"},
      {"id":"ua","label":"Under Armour (UA)","type":"consumer","impact":-3,"correlation":-0.25,"sector":"Athletic Apparel","parentId":"nke_ct"},
      {"id":"colm","label":"Columbia Sportswear (COLM)","type":"consumer","impact":-2,"correlation":-0.20,"sector":"Outdoor Apparel","parentId":"vfc_ct"},
      {"id":"de_ct","label":"Deere & Co (DE)","type":"supplier","impact":3,"correlation":0.25,"sector":"Farm Equipment","parentId":"ctva_ct"},
      {"id":"mos_ct","label":"Mosaic (MOS)","type":"supplier","impact":3,"correlation":0.22,"sector":"Fertilizers","parentId":"ctva_ct"},
      {"id":"polyester_sub","label":"Polyester (Substitute)","type":"substitute","impact":-5,"correlation":-0.40,"sector":"Synthetic Fiber","parentId":"cotton_index"},
      {"id":"nylon_sub","label":"Nylon (Substitute)","type":"substitute","impact":-3,"correlation":-0.25,"sector":"Synthetic Fiber","parentId":"polyester_sub"},
      {"id":"yarn_mfg","label":"Yarn Manufacturing","type":"processor","impact":-4,"correlation":-0.35,"sector":"Textiles","parentId":"hbi"},
      {"id":"denim_mfg","label":"Denim Manufacturing","type":"processor","impact":-5,"correlation":-0.42,"sector":"Textiles","parentId":"levi_ct"},
      {"id":"adm_ct","label":"Archer Daniels (ADM)","type":"processor","impact":3,"correlation":0.25,"sector":"Cottonseed Oil","parentId":"dba_ct"}
    ]},
    {"nodes": [
      {"id":"dxy_ct","label":"US Dollar (DXY)","type":"fx","impact":-4,"correlation":-0.40,"sector":"Forex","parentId":"cotton_index"},
      {"id":"inr_ct","label":"Indian Rupee (INR)","type":"fx","impact":4,"correlation":0.35,"sector":"Forex","parentId":"cotton_index"},
      {"id":"cny_ct","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.32,"sector":"Forex","parentId":"cotton_index"},
      {"id":"us_planting_ct","label":"US Cotton Planting","type":"macro","impact":6,"correlation":0.48,"sector":"Supply","parentId":"cotton_index"},
      {"id":"india_cotton","label":"India Cotton Policy","type":"policy","impact":5,"correlation":0.40,"sector":"Trade Policy","parentId":"inr_ct"},
      {"id":"china_stockpile","label":"China Cotton Stockpile","type":"policy","impact":-5,"correlation":-0.42,"sector":"Reserves","parentId":"cny_ct"},
      {"id":"xinjiang_ban","label":"Xinjiang Cotton Ban","type":"policy","impact":4,"correlation":0.30,"sector":"Trade Policy","parentId":"china_stockpile"},
      {"id":"weather_ct","label":"Texas Weather Impact","type":"macro","impact":6,"correlation":0.45,"sector":"Weather","parentId":"us_planting_ct"},
      {"id":"fast_fashion","label":"Fast Fashion Demand","type":"macro","impact":4,"correlation":0.30,"sector":"Consumer","parentId":"xrt_ct"},
      {"id":"organic_cotton","label":"Organic Cotton Premium","type":"commodity","impact":3,"correlation":0.25,"sector":"Sustainability","parentId":"cotton_index"},
      {"id":"rayon_sub","label":"Rayon (Substitute)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Regenerated Fiber","parentId":"polyester_sub"}
    ]},
    {"nodes": [
      {"id":"usda_ct","label":"USDA Cotton Report","type":"macro","impact":6,"correlation":0.48,"sector":"Data Release","parentId":"us_planting_ct"},
      {"id":"monsoon","label":"Indian Monsoon","type":"macro","impact":5,"correlation":0.38,"sector":"Weather","parentId":"india_cotton"},
      {"id":"oil_polyester","label":"Oil Price-Polyester Link","type":"commodity","impact":-4,"correlation":-0.35,"sector":"Energy","parentId":"polyester_sub"},
      {"id":"ecommerce_apparel","label":"E-commerce Apparel","type":"macro","impact":3,"correlation":0.22,"sector":"Retail","parentId":"fast_fashion"},
      {"id":"sustainable_fashion","label":"Sustainable Fashion","type":"macro","impact":3,"correlation":0.20,"sector":"ESG","parentId":"organic_cotton"},
      {"id":"brazil_cotton","label":"Brazil Cotton Output","type":"regional","impact":5,"correlation":0.40,"sector":"Supply","parentId":"dba_ct"},
      {"id":"cottonseed","label":"Cottonseed Products","type":"commodity","impact":5,"correlation":0.55,"sector":"Byproducts","parentId":"adm_ct"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## Overview

Cotton is the world's most important natural fiber, providing raw material for approximately 27% of global textile production. The United States, India, and China are the three largest producers, but production economics and export availability differ dramatically by region. Cotton competes directly with polyester -- when cotton prices spike, textile manufacturers accelerate substitution toward synthetic fibers, creating a natural price ceiling. The Xinjiang supply chain controversy has added a geopolitical dimension to cotton sourcing decisions. Global production averages 25-27 million tonnes annually, with trade flows heavily influenced by Chinese state reserve policy.

## Key Impact Channels

**Primary -- Direct Producers and Consumers:** Cotton lint flows from gins to spinning mills to fabric manufacturers to brand-name apparel companies. Levi Strauss, Gap, and PVH (Calvin Klein, Tommy Hilfiger) face raw material cost exposure, though cotton typically represents only 5-10% of a finished garment's retail price due to substantial value-add in manufacturing and branding. Fast fashion's rapid inventory turnover amplifies the speed at which cotton price changes impact purchasing decisions.

**Secondary -- Supply Chain and Processing:** Cotton farming is highly weather-sensitive, with drought in West Texas (the largest U.S. producing region) capable of reducing the U.S. crop by 20-30% in severe years. India's monsoon quality determines whether the country is a net exporter or importer, swinging millions of bales of global trade. Cottonseed oil and cottonseed meal are valuable by-products that partially offset production costs and link cotton to the oilseed complex. Spinning mills in Bangladesh, Vietnam, and India form the critical manufacturing midstream, with their procurement decisions driving physical cotton trade flows.

**Tertiary -- Macro and Second-Order Effects:** The U.S. Uyghur Forced Labor Prevention Act has effectively banned cotton imports from Xinjiang, which produces 85%+ of Chinese cotton. This policy has forced global supply chain restructuring, benefiting cotton producers in India, Brazil, Australia, and West Africa. Chinese strategic reserve management (purchases and releases from state stockpiles) can override market fundamentals and stabilize or distort pricing. Cotton price inflation feeds through to apparel CPI and retail spending patterns in consuming economies.

## Winners

U.S. cotton farmers, particularly large-scale operations in Texas, Mississippi, and Georgia, benefit directly from price rallies. Cotton merchants and trading houses (Louis Dreyfus, Cargill Cotton) profit from elevated volumes and basis volatility. Polyester producers gain market share as mills substitute away from expensive cotton. Australian and Brazilian exporters capture increased demand as trade restrictions redirect flows away from Chinese-origin cotton.

## Losers

Apparel brands and retailers face margin compression that is difficult to pass through in competitive fast-fashion markets. Textile mills in South and Southeast Asia see raw material cost inflation that squeezes processing margins. Consumers pay higher clothing prices or accept lower quality as manufacturers use thinner fabrics or higher polyester blend ratios. Cotton-importing nations face trade balance deterioration during sustained price rallies.

## Trading Note

ICE cotton futures (CT) are the global benchmark, with the USDA weekly export sales report and monthly WASDE providing fundamental catalysts. Monitor the cotton/polyester price ratio as a substitution threshold -- when cotton prices exceed 1.5x polyester equivalent, textile mill switching accelerates. U.S. crop condition ratings (USDA weekly during growing season) and West Texas rainfall are the primary supply-side variables. Certificated stocks on ICE indicate deliverable supply tightness as contract expiration approaches. The on-call sales report reveals unfixed-price contracts that create forced buying when mills must price against futures.
