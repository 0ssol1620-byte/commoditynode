---
layout: commodity
title: "Tungsten Price Impact: Cemented Carbide, Defense & China Supply Dominance"
description: "How tungsten prices cascade through cutting tool manufacturers, defense munitions, heavy industry, and mining equipment amid China's 80%+ supply control."
commodity_slug: "tungsten"
symbol: ""
data_type: "analysis_only"
sector: "Industrial Metals/Defense"
etfs: ["XME", "ITA"]
companies: ["SBSW"]
substitutes: ["Ceramics Cutting Tools", "Molybdenum Alloys"]
themes: ["US-China Tariff War", "Defense Rearming", "Deglobalization"]
tags: ["tungsten", "cemented carbide", "defense", "cutting tools", "china supply", "industrial metals", "APT"]
image: /assets/images/og-tungsten.png
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "tungsten", "label": "Tungsten"},
  "levels": [
    {"nodes": [
      {"id":"w_price","label":"APT Tungsten Price","type":"index","impact":10,"correlation":0.99,"sector":"Industrial Metals"},
      {"id":"xme_w","label":"XME Metals Mining ETF","type":"etf","impact":3,"correlation":0.25,"sector":"Mining"},
      {"id":"ita_w","label":"ITA Defense ETF","type":"etf","impact":2,"correlation":0.15,"sector":"Defense"},
      {"id":"china_minmetals","label":"China Minmetals (Tungsten)","type":"producer","impact":9,"correlation":0.80,"sector":"Tungsten Mining"},
      {"id":"xiamen_w","label":"Xiamen Tungsten","type":"producer","impact":10,"correlation":0.85,"sector":"Tungsten Mining"},
      {"id":"sandvik_w","label":"Sandvik AB","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Cutting Tools"},
      {"id":"kennametal","label":"Kennametal (KMT)","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Cemented Carbide"},
      {"id":"gd_w","label":"General Dynamics (GD)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Defense Munitions"},
      {"id":"alrosa_w","label":"Alrosa/Russian Supply","type":"producer","impact":4,"correlation":0.35,"sector":"Mining"},
      {"id":"moly_rel","label":"Molybdenum (Related)","type":"commodity","impact":5,"correlation":0.45,"sector":"Refractory Metals"}
    ]},
    {"nodes": [
      {"id":"carbide_insert","label":"Cemented Carbide Inserts","type":"consumer","impact":-7,"correlation":-0.55,"sector":"Machining","parentId":"kennametal"},
      {"id":"drill_bits","label":"Mining/Oil Drill Bits","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Drilling","parentId":"sandvik_w"},
      {"id":"ap_munitions","label":"Armor-Piercing Munitions","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Defense","parentId":"gd_w"},
      {"id":"wolfram_bg","label":"Wolfram Bergbau (Austria)","type":"producer","impact":6,"correlation":0.48,"sector":"European Supply","parentId":"xme_w"},
      {"id":"mitsubishi_mat","label":"Mitsubishi Materials","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Carbide Tools","parentId":"carbide_insert"},
      {"id":"iscar_w","label":"ISCAR (Berkshire)","type":"consumer","impact":-4,"correlation":-0.30,"sector":"Cutting Tools","parentId":"carbide_insert"},
      {"id":"hcstarck","label":"H.C. Starck Tungsten","type":"processor","impact":5,"correlation":0.42,"sector":"APT Processing","parentId":"xiamen_w"},
      {"id":"gtp_w","label":"Global Tungsten & Powders","type":"processor","impact":5,"correlation":0.40,"sector":"Powder Metallurgy","parentId":"hcstarck"},
      {"id":"rth_w","label":"RTX (Raytheon)","type":"consumer","impact":-2,"correlation":-0.10,"sector":"Defense","parentId":"ap_munitions"},
      {"id":"noc_w","label":"Northrop Grumman (NOC)","type":"consumer","impact":-1,"correlation":-0.08,"sector":"Defense","parentId":"ap_munitions"}
    ]},
    {"nodes": [
      {"id":"china_quota","label":"China Tungsten Export Quotas","type":"policy","impact":8,"correlation":0.65,"sector":"Geopolitics","parentId":"xiamen_w"},
      {"id":"ceramic_sub","label":"Ceramic Cutting Tools (Sub)","type":"substitute","impact":-4,"correlation":-0.28,"sector":"Machining","parentId":"carbide_insert"},
      {"id":"moly_sub","label":"Molybdenum Alloy (Sub)","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Refractory","parentId":"moly_rel"},
      {"id":"dxy_w","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.30,"sector":"Forex","parentId":"w_price"},
      {"id":"cny_w","label":"Chinese Yuan (CNY)","type":"fx","impact":4,"correlation":0.32,"sector":"Forex","parentId":"china_quota"},
      {"id":"auto_mfg","label":"Auto Manufacturing PMI","type":"macro","impact":4,"correlation":0.35,"sector":"Industrial","parentId":"carbide_insert"},
      {"id":"nato_spend","label":"NATO Defense Spending","type":"policy","impact":4,"correlation":0.28,"sector":"Defense","parentId":"ap_munitions"},
      {"id":"recycling_w","label":"Tungsten Scrap Recycling","type":"processor","impact":-4,"correlation":-0.30,"sector":"Recycling","parentId":"gtp_w"},
      {"id":"construction_w","label":"Global Construction Activity","type":"macro","impact":3,"correlation":0.25,"sector":"Construction","parentId":"drill_bits"},
      {"id":"portugal_w","label":"Portugal Tungsten (Panasqueira)","type":"regional","impact":3,"correlation":0.22,"sector":"European Supply","parentId":"wolfram_bg"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Tungsten possesses the highest melting point of any metal (3,422°C) and exceptional hardness, making it irreplaceable in cemented carbide cutting tools, armor-piercing munitions, and high-temperature industrial applications. China dominates the tungsten market, controlling over 80% of global mine production and an even higher share of downstream APT (ammonium paratungstate) processing. Annual global production is approximately 80,000 tonnes of tungsten content. The market is priced via APT benchmarks assessed in China and Europe. Tungsten's strategic importance spans civilian manufacturing (every machined metal part requires tungsten carbide tools) and military applications (kinetic energy penetrators, counterweights for missiles). Supply concentration in China, combined with historical export quotas, makes tungsten a perennial supply security concern for Western industrial and defense sectors.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary — Cemented Carbide and Machining:** Roughly 60% of tungsten consumption goes into cemented tungsten carbide (WC-Co) cutting inserts, drill bits, and wear-resistant parts. Sandvik, Kennametal, Mitsubishi Materials, and ISCAR collectively dominate the ~$20B global cutting tool market. Any tungsten price spike directly inflates tooling costs across automotive, aerospace, and general machining — a universal industrial input cost multiplier.

**Secondary — Defense and Munitions:** Tungsten heavy alloy (WHA) is the preferred material for kinetic energy armor-piercing projectiles, replacing depleted uranium in many applications. NATO rearmament and rising global defense budgets are increasing tungsten demand for munitions stockpiling. Defense procurement represents price-inelastic demand that competes with industrial users during supply tightness.

**Tertiary — Recycling and Substitution:** Approximately 30% of tungsten supply in Western markets comes from recycling hard scrap (spent carbide inserts, drill bits). This high recycling rate partially insulates Western manufacturers from Chinese supply disruptions. Ceramic cutting tools and cermets can substitute in some machining operations but with inferior performance in interrupted cutting and heavy roughing applications.

## Which Companies and ETFs Benefit When the Price Rises?

Chinese tungsten producers (Xiamen Tungsten, China Minmetals, Jiangxi Tungsten) benefit from monopolistic pricing power and government-managed production quotas. European producers like Wolfram Bergbau (Austria) and Almonty Industries (Portugal, South Korea) gain strategic premium from non-Chinese supply status. Tungsten recyclers capture margin expansion when primary prices rise. Defense contractors with secured tungsten supply chains gain competitive advantage in munitions procurement.

## Which Companies and Sectors Are Hurt by a Price Increase?

Cutting tool manufacturers (Kennametal, Sandvik, Mitsubishi Materials) face raw material cost inflation that squeezes margins in competitive markets. Automotive and aerospace manufacturers absorb higher machining costs across entire production lines. Oil and gas drilling operators face costlier drill bits and downhole tools. Small and medium manufacturers in Western countries are most exposed to supply disruptions with limited ability to stockpile.

## What Should Traders Watch When Analyzing This Market?

Tungsten is traded OTC via APT (ammonium paratungstate) price assessments from Argus and Fastmarkets, with separate European and Chinese benchmark prices. The European-China APT price spread indicates supply flow dynamics and export control tightness. Monitor China's tungsten mining quotas (announced biannually by MOFCOM/MLR) as the key supply-side variable. Kennametal (KMT) quarterly earnings provide real-time commentary on tungsten cost pass-through and demand conditions. Track global manufacturing PMI as a leading demand indicator. Watch for U.S. and EU critical mineral designation policy changes that could trigger strategic stockpile purchases.
