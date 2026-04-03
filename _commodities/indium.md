---
layout: commodity
unit: "$/kg"
image: "/assets/images/og-indium.png"
title: "Indium Price Impact: Touchscreens, Solar Panels & Semiconductor Supply"
description: "How indium price shifts cascade through display manufacturers, thin-film solar, semiconductor packaging, and the zinc refining by-product chain."
commodity_slug: "indium"
symbol: "FRES.L"
sector: "Critical Minerals/Tech"
etfs: ["REMX"]
companies: ["FRES.L", "TEC.PA"]
substitutes: ["Fluorine-doped Tin Oxide", "Silver Nanowires"]
themes: ["Display Technology", "Solar Energy"]
---

<script>
window.COMMODITY_DATA = {
  "commodity": {"id": "indium", "label": "Indium"},
  "levels": [
    {"nodes": [
      {"id":"in_index","label":"Indium Price Index","type":"index","impact":10,"correlation":0.99,"sector":"Commodities"},
      {"id":"remx_in","label":"REMX Critical Minerals ETF","type":"etf","impact":3,"correlation":0.28,"sector":"Critical Minerals"},
      {"id":"korea_zinc","label":"Korea Zinc (010130.KS)","type":"producer","impact":7,"correlation":0.55,"sector":"Zinc/Indium"},
      {"id":"teck_in","label":"Teck Resources (TECK)","type":"producer","impact":5,"correlation":0.40,"sector":"Zinc Mining"},
      {"id":"nyrstar","label":"Nyrstar (Zinc Refining)","type":"producer","impact":6,"correlation":0.48,"sector":"Zinc Refining"},
      {"id":"ito_sector","label":"ITO Coating Sector","type":"consumer","impact":-6,"correlation":-0.50,"sector":"Display Tech"},
      {"id":"cigs_solar","label":"CIGS Thin-Film Solar","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Solar"},
      {"id":"solder_alloy","label":"Lead-Free Solder","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Electronics"},
      {"id":"lcd_panel","label":"LCD Panel Producers","type":"consumer","impact":-5,"correlation":-0.40,"sector":"Display"},
      {"id":"zinc_related","label":"Zinc (Parent Metal)","type":"commodity","impact":6,"correlation":0.55,"sector":"Metals"}
    ]},
    {"nodes": [
      {"id":"samsung_disp","label":"Samsung Display","type":"consumer","impact":-5,"correlation":-0.38,"sector":"Display","parentId":"ito_sector"},
      {"id":"lg_display","label":"LG Display (LPL)","type":"consumer","impact":-4,"correlation":-0.35,"sector":"Display","parentId":"ito_sector"},
      {"id":"boe_tech","label":"BOE Technology","type":"consumer","impact":-4,"correlation":-0.32,"sector":"Display","parentId":"ito_sector"},
      {"id":"first_solar_in","label":"First Solar (FSLR)","type":"competitor","impact":3,"correlation":0.20,"sector":"Solar","parentId":"cigs_solar"},
      {"id":"manz_ag","label":"Manz AG (Solar)","type":"consumer","impact":-3,"correlation":-0.22,"sector":"Solar","parentId":"cigs_solar"},
      {"id":"corning_in","label":"Corning (GLW)","type":"consumer","impact":-2,"correlation":-0.18,"sector":"Glass","parentId":"lcd_panel"},
      {"id":"apple_in","label":"Apple (AAPL)","type":"consumer","impact":-2,"correlation":-0.12,"sector":"Electronics","parentId":"ito_sector"},
      {"id":"umicore_in","label":"Umicore (Indium Recycling)","type":"processor","impact":4,"correlation":0.30,"sector":"Recycling","parentId":"nyrstar"},
      {"id":"indium_corp","label":"Indium Corporation","type":"processor","impact":5,"correlation":0.42,"sector":"Processing","parentId":"korea_zinc"},
      {"id":"dowa_in","label":"Dowa Holdings (Japan)","type":"producer","impact":5,"correlation":0.38,"sector":"Refining","parentId":"nyrstar"}
    ]},
    {"nodes": [
      {"id":"oled_displace","label":"OLED Displacement (Threat)","type":"substitute","impact":-5,"correlation":-0.35,"sector":"Display Tech","parentId":"samsung_disp"},
      {"id":"fto_sub","label":"FTO Glass Substitute","type":"substitute","impact":-3,"correlation":-0.22,"sector":"Solar","parentId":"cigs_solar"},
      {"id":"china_refining_in","label":"China Indium Refining","type":"processor","impact":5,"correlation":0.40,"sector":"Processing","parentId":"boe_tech"},
      {"id":"dxy_in","label":"US Dollar (DXY)","type":"fx","impact":-3,"correlation":-0.28,"sector":"Forex","parentId":"in_index"},
      {"id":"ev_display","label":"EV Dashboard Displays","type":"macro","impact":4,"correlation":0.30,"sector":"Automotive","parentId":"lcd_panel"},
      {"id":"smartphone_growth","label":"Smartphone Display Demand","type":"macro","impact":5,"correlation":0.38,"sector":"Electronics","parentId":"samsung_disp"},
      {"id":"silver_nanowire","label":"Silver Nanowire Alternative","type":"substitute","impact":-3,"correlation":-0.20,"sector":"Materials","parentId":"ito_sector"},
      {"id":"thermal_interface","label":"Thermal Interface (Indium)","type":"consumer","impact":-2,"correlation":-0.15,"sector":"Semiconductor","parentId":"solder_alloy"},
      {"id":"zinc_price_link","label":"Zinc Mine Output","type":"macro","impact":5,"correlation":0.45,"sector":"Mining","parentId":"teck_in"},
      {"id":"recycling_rate","label":"Indium Recycling Rate","type":"processor","impact":-3,"correlation":-0.22,"sector":"Recycling","parentId":"umicore_in"}
    ]}
  ]
};
</script>
<div id="impact-graph"></div>

## What Is This Commodity and What Drives Its Price?

Indium is the invisible element behind every touchscreen, flat-panel display, and many thin-film solar cells. Roughly 70% of global indium consumption goes into indium tin oxide (ITO) coatings -- the transparent conductive layer that makes capacitive touchscreens work on smartphones, tablets, laptops, and automotive displays. The metal is almost exclusively produced as a by-product of zinc refining, meaning its supply is inextricably linked to zinc market economics rather than indium's own price signals. Global primary production is approximately 900 tonnes annually, with China responsible for roughly 60% of refined output. South Korea's Korea Zinc, Japan's Dowa Holdings, and Belgium's Nyrstar are other significant producers. The by-product nature creates a fundamental supply inelasticity -- even if indium prices double, zinc miners won't increase production just for indium recovery.

## How Does a Price Move Ripple Through Industries and Stocks?

**Primary -- Display and ITO Manufacturing:** ITO sputtering targets are the dominant use case, consumed by display panel manufacturers including Samsung Display, LG Display, BOE Technology, and Japan Display. ITO coatings are deposited on glass substrates to create the transparent electrodes that enable touch sensitivity and pixel addressing in LCDs. The display industry's transition from LCD to OLED partially reduces indium intensity per panel, but the proliferation of screens (automotive, smart home, wearables) partially offsets this substitution effect. Display manufacturers face direct cost pressure when indium prices rise, particularly on large-format panels where ITO consumption per unit is highest.

**Secondary -- Solar and Electronics:** Copper indium gallium selenide (CIGS) thin-film solar cells represent the second major demand channel. While crystalline silicon dominates solar photovoltaics, CIGS technology offers advantages in building-integrated and flexible applications. Indium is also used in lead-free solders for electronics assembly, thermal interface materials for semiconductor packaging, and compound semiconductors (InP, InGaAs) for fiber optic communications and high-frequency electronics. These applications are smaller by volume but high-value, creating premium pricing segments.

**Tertiary -- Supply Chain and Substitution:** The zinc by-product constraint means indium supply responds to zinc market conditions, not indium demand signals. Zinc mine closures or curtailments directly reduce indium availability regardless of indium market conditions. Recycling from spent ITO sputtering targets recovers approximately 30% of indium used in manufacturing, but end-of-life recycling from consumer electronics remains economically challenging due to the thin coating layers involved. Silver nanowire and fluorine-doped tin oxide (FTO) alternatives exist but face performance and cost barriers for large-scale display applications.

## Which Companies and ETFs Benefit When the Price Rises?

Korea Zinc and other zinc refiners with indium recovery circuits benefit from price rallies with minimal marginal cost increase. Specialized processors like Indium Corporation and Dowa Holdings capture margin expansion on refined indium products. Indium recyclers see improved economics for sputtering target recovery. First Solar (CdTe technology) gains competitive advantage over CIGS competitors when indium prices rise. OLED display manufacturers gain relative positioning as their technology uses less indium than LCD alternatives.

## Which Companies and Sectors Are Hurt by a Price Increase?

LCD display manufacturers (Samsung Display, LG Display, BOE) face direct ITO material cost inflation on high-volume panel production. Consumer electronics brands (Apple, Samsung, Xiaomi) absorb higher display component costs. CIGS solar manufacturers face cell cost increases that reduce competitiveness versus crystalline silicon. Automotive display suppliers face margin pressure as vehicle screen sizes and counts increase. Lead-free solder cost increases affect electronics assembly margins across the industry.

## What Should Traders Watch When Analyzing This Market?

Indium lacks exchange-traded contracts -- pricing is based on Metal Bulletin and Asian Metals spot assessments. Monitor zinc mine production data and refinery operating rates as the primary supply indicator. The zinc/indium production ratio varies by ore body, making specific refinery disruptions more impactful than aggregate zinc data. Track display panel pricing and production data from Omdia and DSCC for demand signals. ITO sputtering target inventories at major depositors indicate near-term supply-demand balance. China's indium export data provides a monthly supply flow indicator. The OLED penetration rate in smartphones and TVs is the most important structural demand variable for indium's long-term outlook.
