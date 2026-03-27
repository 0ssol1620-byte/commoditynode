---
layout: post
title: "Neon Gas — The Semiconductor Industry's Invisible Dependency"
date: 2026-03-28
categories: [Noble Gases, Analysis]
tags: [neon, semiconductor, ukraine, lithography]
description: "Neon gas is essential for chip lithography lasers, and the Ukraine conflict exposed catastrophic supply concentration. The semiconductor industry has diversified but remains vulnerable."
reading_time: 8
commodity_name: "Neon"
direction: bullish
image: /assets/images/og-neon.png
canonical_url: https://commoditynode.com/neon-gas-semiconductor-dependency/
---

The most advanced semiconductor factories on Earth — the ones building the AI chips that power ChatGPT, the memory chips in your phone, and the processors in every modern vehicle — depend on a gas that most people associate with bar signs and party balloons. Neon, the noble gas with atomic number 10, is the invisible but irreplaceable medium in the deep ultraviolet lasers that etch circuits onto silicon wafers. Before February 2022, Ukraine produced roughly half the world's semiconductor-grade neon. Then Russia invaded. The resulting supply shock — neon prices spiked over 10x — exposed one of the most dangerous single points of failure in the global technology supply chain. Three years later, the industry has diversified but the underlying vulnerability persists.

## Why Neon Matters for Chips

To understand neon's criticality, you need to understand photolithography — the process that transforms a silicon wafer into a functioning chip. Photolithography uses light to project circuit patterns through a mask onto a photoresist-coated wafer. The wavelength of light determines the minimum feature size that can be printed. For the past three decades, the semiconductor industry has relied on **deep ultraviolet (DUV)** lithography using excimer lasers operating at 248nm (KrF) and 193nm (ArF) wavelengths.

These excimer lasers — manufactured primarily by Cymer (now an ASML subsidiary) and Gigaphoton (a Komatsu subsidiary) — use neon as both the lasing medium and buffer gas. The gas mixture in a typical ArF laser is approximately **96% neon**, 3.5% argon, and 0.5% fluorine. The neon must be **ultra-high purity** (99.999%+, or "5N" grade) to prevent contamination that degrades laser performance and shortens gas lifetime.

A single advanced semiconductor fab can consume **hundreds of thousands of liters** of neon monthly. TSMC's Fab 18 in Tainan, Samsung's Pyeongtaek complex, and Intel's fabs in Oregon and Arizona all require continuous neon supply to maintain lithography tool uptime. When neon supply is disrupted, fabs face a binary choice: reduce utilization rates (cutting chip output) or pay exponentially higher prices for available supply.

## The Ukraine Supply Shock

Ukraine's dominance in neon production was an accident of Soviet industrial planning. Large-scale steel production in eastern Ukraine generated massive volumes of air as a by-product of oxygen separation for blast furnaces. This air contains approximately 18 parts per million of neon. Ukrainian companies — principally **Ingas** in Mariupol and **Cryoin** in Odesa — developed expertise in extracting and purifying this crude neon to semiconductor-grade specifications.

By 2021, these two companies were estimated to supply **45-54% of the world's semiconductor-grade neon**. The concentration was known within the gas industry but had never been stress-tested at scale. When Russia launched its full-scale invasion in February 2022, Ingas's Mariupol facility was in the direct path of Russian forces. The city fell after a brutal siege. Cryoin's Odesa operations were disrupted by missile strikes and infrastructure damage. Effectively overnight, half the world's semiconductor neon supply went dark.

**Neon prices exploded.** Spot prices for semiconductor-grade neon surged from roughly $400 per thousand cubic meters to over $4,000 — a 10x increase within weeks. Contract prices followed with varying lags depending on hedging and inventory positions. The semiconductor industry, already grappling with the post-COVID chip shortage, faced a new input cost crisis.

## The Industry Response: Diversification and Recycling

The neon shock triggered the most aggressive supply chain diversification effort in semiconductor history, short of TSMC's entire Arizona expansion. The response followed two parallel tracks:

### Sourcing Diversification

**Chinese producers** rapidly scaled neon purification capacity, leveraging China's dominant steel industry (and its associated air separation infrastructure) as a crude neon source. By late 2022, Chinese neon producers — including Jinan Hengxin, Suzhou Jinhong, and Air Products' Chinese JV — had captured significant market share. Japan's Nippon Sanso, Korea's SK Materials, and Air Liquide all invested in expanding neon purification capacity closer to semiconductor manufacturing hubs.

**South Korean investment** was particularly aggressive. SK Materials expanded its neon production facility in Sejong City, targeting self-sufficiency for Samsung and SK Hynix fabs. The Korean government designated neon as a strategic material, providing subsidies and tax incentives for domestic production.

By 2024, the semiconductor industry's neon supply was materially more diversified than pre-2022, with estimated sourcing roughly split between China (35%), South Korea/Japan (25%), other Asian producers (15%), and remaining Ukrainian/Russian supply (10-15%), with Western industrial gas companies supplying the balance.

### Neon Recycling Technology

Perhaps the most impactful structural change has been the adoption of **neon recycling systems** at major fabs. These systems capture exhaust gas from lithography tools, re-purify the neon, and return it to the laser chambers. Recovery rates of **80-95%** are achievable with modern systems, dramatically reducing a fab's gross neon consumption.

TSMC, Samsung, Intel, and SK Hynix have all invested in neon recycling across their major fabs. The payback period at elevated neon prices is measured in months rather than years. However, recycling doesn't eliminate neon demand — initial fill requirements for new tools, purge gas losses, and less-than-perfect recovery rates still require primary supply. And the rapid expansion of semiconductor manufacturing capacity (TSMC Arizona, Intel Ohio, Samsung Taylor) creates incremental primary neon demand even with recycling.

## The EUV Question: Salvation or Mirage?

The semiconductor industry's transition to **extreme ultraviolet (EUV) lithography** at advanced nodes (5nm and below) is sometimes cited as the solution to neon dependency. EUV lithography uses tin plasma to generate 13.5nm light, eliminating the excimer laser (and its neon consumption) for the most critical patterning steps.

However, the EUV narrative oversimplifies the reality:

1. **EUV doesn't eliminate DUV.** Even the most advanced EUV-generation chips — TSMC's N3 and N2, Samsung's 3GAE — still use DUV lithography for **the majority of patterning steps**. A cutting-edge logic chip might use 15-20 EUV layers but 60+ DUV layers. DUV neon consumption per wafer has decreased, but it hasn't disappeared.

2. **Memory is still DUV-dependent.** DRAM manufacturing uses DUV almost exclusively, with EUV adoption in memory running several years behind logic. NAND flash uses DUV for patterning and is unlikely to adopt EUV at all due to the lower resolution requirements of 3D stacking architectures. Memory fabs remain heavy neon consumers.

3. **Legacy and mature nodes.** The massive buildout of mature-node capacity (28nm-65nm) for automotive, industrial, and IoT applications — driven by the post-COVID chip shortage realizations — uses DUV exclusively. These fabs will consume neon for decades.

4. **EUV has its own supply chain risks.** EUV tools require hydrogen gas (for tin debris cleaning), ultra-pure tin (for the light source), and specialized pellicles and masks. Trading one supply dependency for another doesn't eliminate structural risk.

## The Ongoing Vulnerability

Despite diversification efforts, the neon market remains structurally vulnerable to disruption for several reasons:

**Steel industry linkage:** Neon is fundamentally a by-product of air separation at steel mills. Neon supply is tied to steel production geography and operating rates, not semiconductor demand signals. A global steel downturn — triggered by a China construction slowdown, for example — could constrain neon supply even as semiconductor demand grows.

**Purification bottleneck:** Crude neon from air separation units requires multi-stage purification to reach semiconductor grade. The purification infrastructure is the true bottleneck, not crude neon availability. Building new purification capacity takes 12-18 months and requires specialized expertise.

**Inventory opacity:** Unlike copper or oil, there are no public inventory data for neon. Fabs maintain proprietary buffer stocks, gas companies hold undisclosed inventories, and there is no exchange-based price discovery. This opacity means disruptions can propagate rapidly before the market can respond.

**Geopolitical risk persistence:** The Ukraine conflict continues, and even a ceasefire would not immediately restore Ukrainian neon production to pre-war levels. Chinese producers now represent the largest supply concentration risk, and U.S.-China tensions create the possibility of future gas supply disruptions mirroring China's semiconductor equipment restrictions.

## Investment Positioning

The neon supply chain is not directly investable through a single-name equity play — the gas is a small revenue line even for major industrial gas companies. The opportunity lies in understanding how neon supply dynamics affect the broader semiconductor value chain.

**Beneficiaries of neon scarcity:**
- **Industrial gas companies** — Air Liquide (AI.PA), Linde (LIN), and Nippon Sanso (4091.T) have invested in neon capacity and command premium pricing during tightness.
- **Neon recycling equipment** — Companies supplying gas recovery systems to fabs benefit from structural adoption.
- **EUV tool demand** — ASML (ASML) benefits indirectly as fabs accelerate EUV adoption to reduce DUV neon dependency.

**Vulnerable to neon disruption:**
- **Semiconductor ETFs** — SOXX, SMH face broad chip supply risk during severe neon disruptions.
- **Memory manufacturers** — SK Hynix, Micron (MU), Samsung are the most DUV-dependent and therefore most neon-sensitive.
- **Fabless chips** — Companies like Nvidia (NVDA), AMD, and Qualcomm face foundry delivery risk if TSMC or Samsung reduce utilization.

## What To Watch

1. **Ukrainian industrial gas production status** — Track Ingas and Cryoin operational updates for traditional supply recovery.
2. **Chinese neon export volumes** — Chinese customs data provides monthly supply flow indicators.
3. **SK Materials and Air Liquide capacity announcements** — New purification capacity additions signal supply diversification progress.
4. **TSMC/Samsung fab utilization rates** — Quarterly earnings disclose utilization that could indicate gas supply constraints.
5. **Steel industry production data** — Global steel output (particularly in China and India) drives crude neon availability.
6. **ASML DUV vs. EUV tool shipments** — The ratio tracks the structural demand trajectory for neon.

The semiconductor industry learned in 2022 that its most advanced manufacturing processes depended on a gas it couldn't price, couldn't store at scale, and couldn't source from more than two cities. The diversification since then has been real but incomplete. Neon remains a high-consequence, low-probability risk embedded in every chip the world produces.

---

*This report is part of CommodityNode's Signal series — institutional-grade analysis on commodity market dislocations and the companies they impact. For the full neon impact map and live data, visit the [Neon Commodity Hub](/commodities/neon/).*
