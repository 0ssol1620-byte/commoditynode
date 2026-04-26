---
layout: default
title: "Data & Methodology"
permalink: /data-methodology/
description: "CommodityNode data sources, update cadence, model methodology, and limitations."
no_loader: true
disable_ads: true
---

<style>
.legal-shell{max-width:920px;margin:0 auto;padding:76px 20px 96px;color:var(--text2)}
.legal-shell h1{font-size:clamp(2.2rem,5vw,4.2rem);line-height:1.02;color:var(--text);margin:0 0 18px;letter-spacing:-0.04em}
.legal-shell h2{color:var(--text);margin:36px 0 12px;font-size:1.35rem}
.legal-shell p,.legal-shell li{line-height:1.75;color:var(--text2)}
.legal-shell a{color:var(--accent)}
.legal-kicker{display:inline-flex;padding:7px 11px;border-radius:999px;border:1px solid rgba(34,211,238,.28);background:rgba(34,211,238,.08);color:#22d3ee;font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:18px}
.legal-notice{border:1px solid rgba(251,191,36,.24);background:linear-gradient(135deg,rgba(251,191,36,.10),rgba(34,211,238,.05));border-radius:20px;padding:18px 20px;margin:24px 0;color:#fde68a}
.legal-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:14px;margin:24px 0}
.legal-card{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);border-radius:18px;padding:18px;min-width:0}
</style>

<section class="legal-shell">
  <div class="legal-kicker">CommodityNode policy</div>

  <h1>Data &amp; Methodology</h1>
  <p>CommodityNode combines public market data, commodity reference datasets, supply-chain context, and AI-assisted research workflows to produce market intelligence and scenario analytics.</p>
  <div class="legal-grid">
    <div class="legal-card"><h2>Data sources</h2><p>Sources may include exchange-traded futures references, Yahoo Finance market data, government datasets such as EIA/FRED/USDA/BLS, company filings, and curated public news references.</p></div>
    <div class="legal-card"><h2>Update cadence</h2><p>Prices and model artifacts are typically refreshed daily when data providers are available. Some macro or fundamental datasets update weekly, monthly, quarterly, or irregularly.</p></div>
    <div class="legal-card"><h2>Model outputs</h2><p>Forecast ranges and consensus estimates are probabilistic scenario inputs, not instructions or promises. Model versions and source data can change over time.</p></div>
  </div>
  <h2>Forecast horizon and uncertainty</h2>
  <p>CommodityNode may display 30/60/90-day model horizons, uncertainty bands, consensus blends, or scenario ranges. These are designed to help users frame risk and business planning questions, not to predict guaranteed market outcomes.</p>
  <h2>Data quality handling</h2>
  <p>Missing, stale, sparse, or proxy-priced data can occur. Where possible, CommodityNode labels proxy series, suppresses unreliable moves, and shows timestamps so users can evaluate freshness.</p>
  <h2>Backtests and historical context</h2>
  <p>Historical relationships are used for research context. Past performance, historical correlation, or previous scenario behavior does not guarantee future behavior.</p>

</section>
