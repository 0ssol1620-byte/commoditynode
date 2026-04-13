---
no_loader: true
layout: default
title: About CommodityNode
description: "CommodityNode is an independent commodity intelligence publisher mapping how raw-material price moves ripple through industries, stocks, ETFs, and supply chains."
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About CommodityNode",
  "url": "https://commoditynode.com/about/",
  "description": "CommodityNode is an independent commodity intelligence publisher focused on commodity-to-equity ripple effects, supply-chain exposure, and decision-useful market context.",
  "mainEntity": {
    "@type": "Organization",
    "name": "CommodityNode",
    "url": "https://commoditynode.com",
    "email": "contact@commoditynode.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://commoditynode.com/assets/images/logo.svg",
      "width": 200,
      "height": 60
    },
    "sameAs": [
      "https://www.threads.net/@commoditynode",
      "https://twitter.com/commoditynode"
    ],
    "description": "Independent commodity intelligence publisher providing impact maps, Signal Reports, scenario tools, and forecast ranges across commodity-sensitive markets.",
    "knowsAbout": [
      "Commodity Markets",
      "Supply Chain Risk",
      "Equity Sensitivity Analysis",
      "Portfolio Risk",
      "Energy Markets",
      "Industrial Metals",
      "Agricultural Commodities"
    ]
  }
}
</script>

<div class="post-header">
  <div class="container">
    <div class="post-header-badge">
      <span class="badge badge-cyan">About</span>
      <span class="badge badge-gold">Independent publisher</span>
    </div>
    <h1>About CommodityNode</h1>
    <p class="post-meta-bar">Independent commodity intelligence for investors, analysts, and operators who need more than a headline chart.</p>
  </div>
</div>

<div class="container" style="padding:48px 24px 80px;">
<div style="max-width:780px;margin:0 auto;">
<div class="post-content" data-animate>

{% assign commodity_count = site.coverage_counts.commodity_hubs | default: site.commodities.size %}

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:0 0 28px;">
  <div style="padding:18px;background:rgba(34,211,238,0.05);border:1px solid rgba(34,211,238,0.14);border-radius:14px;">
    <div style="font-size:0.76rem;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:700;margin-bottom:8px;">Coverage</div>
    <div style="font-size:1.5rem;font-weight:800;color:#f8fafc;">{{ commodity_count }} hubs</div>
    <p style="font-size:0.86rem;color:var(--text2);margin:8px 0 0;">Live commodity reference pages tied to companies, industries, and reports.</p>
  </div>
  <div style="padding:18px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.14);border-radius:14px;">
    <div style="font-size:0.76rem;letter-spacing:0.1em;text-transform:uppercase;color:#10b981;font-weight:700;margin-bottom:8px;">Editorial model</div>
    <div style="font-size:1.5rem;font-weight:800;color:#f8fafc;">Research first</div>
    <p style="font-size:0.86rem;color:var(--text2);margin:8px 0 0;">We prioritize methodology, caveats, and second-order impact over noisy commentary.</p>
  </div>
  <div style="padding:18px;background:rgba(168,85,247,0.05);border:1px solid rgba(168,85,247,0.14);border-radius:14px;">
    <div style="font-size:0.76rem;letter-spacing:0.1em;text-transform:uppercase;color:#a855f7;font-weight:700;margin-bottom:8px;">Commercial model</div>
    <div style="font-size:1.5rem;font-weight:800;color:#f8fafc;">Ads + Pro</div>
    <p style="font-size:0.86rem;color:var(--text2);margin:8px 0 0;">Advertising and subscriptions support the site, but do not determine coverage.</p>
  </div>
</div>

<h2>What CommodityNode Does</h2>
<p>CommodityNode maps how raw-material price moves ripple into industries, companies, ETFs, and portfolio risk. We built the site for people who need to move from <strong>commodity price action</strong> to <strong>decision-useful context</strong> quickly — without relying on vague macro commentary or generic market recaps.</p>
<p>When crude oil jumps, the real question is not just “what happened?” It is “which companies, sectors, and supply chains feel it first, and how strong is the transmission?” CommodityNode exists to answer that second question.</p>

<h2>What Makes This Different</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:18px 0 22px;">
  <div style="background:rgba(34,211,238,0.04);border:1px solid rgba(34,211,238,0.1);border-radius:12px;padding:18px;">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px;">Commodity-to-equity mapping</div>
    <p style="font-size:0.86rem;color:var(--text2);margin:0;">We do not stop at the commodity chart. We connect the move to equities, sectors, and supply-chain nodes.</p>
  </div>
  <div style="background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.1);border-radius:12px;padding:18px;">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px;">Transparent caveats</div>
    <p style="font-size:0.86rem;color:var(--text2);margin:0;">Proxy pages are labeled, weak feeds are disclosed, and unavailable daily changes are not dressed up as precise signals.</p>
  </div>
  <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.1);border-radius:12px;padding:18px;">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px;">Live + editorial workflow</div>
    <p style="font-size:0.86rem;color:var(--text2);margin:0;">Each hub is tied to a research archive, methodology, and scenario workflow instead of existing as a disconnected static page.</p>
  </div>
</div>

<h2>Who Uses CommodityNode</h2>
<ul>
  <li><strong>Self-directed investors</strong> who need to understand how commodity moves change their watchlist.</li>
  <li><strong>Analysts and macro traders</strong> who want faster context on second-order transmission paths.</li>
  <li><strong>Operators and supply-chain teams</strong> who need market signals translated into input-cost or margin risk.</li>
  <li><strong>Researchers and journalists</strong> who need a structured map from raw-material moves to corporate and sector impact.</li>
</ul>

<h2>How We Publish</h2>
<p>CommodityNode publishes under the <strong>CommodityNode Research</strong> identity. The site blends quantitative market data, documented methodology, and manual editorial judgment.</p>
<ul>
  <li><strong>Commodity hubs</strong> are maintained as living reference pages with data labels, price context, and related research.</li>
  <li><strong>Signal Reports</strong> explain why a move matters now, not just what the chart did.</li>
  <li><strong>Forecast and scenario tools</strong> are presented as probabilistic aids with explicit uncertainty ranges.</li>
  <li><strong>Corrections and freshness</strong> matter: we distinguish between automated price refreshes and editorial publication dates.</li>
</ul>

<div style="padding:22px;background:rgba(34,211,238,0.05);border:1px solid rgba(34,211,238,0.14);border-radius:14px;margin:24px 0;">
  <div style="font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:#22d3ee;font-weight:700;margin-bottom:10px;">Trust center</div>
  <p style="margin:0 0 12px;color:var(--text2);">If you are reviewing CommodityNode as a publisher, start with the pages below. They explain who publishes the site, how pages are reviewed, how corrections are handled, and where data limitations are disclosed.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <a href="/about/editorial-team/" class="btn btn-secondary">Editorial Team</a>
    <a href="/about/editorial-process/" class="btn btn-secondary">Editorial Process</a>
    <a href="/methodology/" class="btn btn-secondary">Methodology</a>
    <a href="/contact/" class="btn btn-secondary">Contact & Corrections</a>
  </div>
</div>

<h2>Editorial Independence</h2>
<ul>
  <li>CommodityNode does <strong>not</strong> accept payment for favorable coverage of specific companies, commodities, or ETFs.</li>
  <li>Advertising and subscriptions support the business, but they do not determine what gets covered or how it is framed.</li>
  <li>Nothing on the site is personalized investment advice, and research tools are not recommendations to buy or sell securities.</li>
</ul>

<h2>Data Sources and Limits</h2>
<p>We combine public market data, filings, and domain-specific datasets to build our pages. Key source families include futures and ETF pricing, SEC filings, central-bank and macroeconomic publications, and commodity-specific reporting bodies such as USDA, IEA, and LME-linked datasets.</p>
<p>We also label limitations clearly. If a page depends on a proxy asset or an upstream feed becomes unstable because of rollovers, stale prints, or proxy distortions, we would rather show <em>less</em> than imply false certainty.</p>

<h2>Corrections and Review</h2>
<p>Material factual or numerical errors are corrected when verified. High-traffic pages, flagship commodity hubs, and monetized surfaces receive the most frequent QA and editorial review. If you spot a problem, email <a href="mailto:contact@commoditynode.com">contact@commoditynode.com</a> or use the <a href="/contact/">contact form</a>.</p>
<p>For a fuller explanation of how pages are reviewed and updated, see the <a href="/about/editorial-process/">Editorial Process</a>.</p>

<h2>Who Built This</h2>
<p>CommodityNode was built by a quantitative analyst and data engineer with experience in commodity research, financial data engineering, and market-structure analysis. The goal was to make commodity-to-equity ripple analysis available without requiring an institutional research stack.</p>
<p>That is why the product emphasizes traceable methodology, explicit caveats, and operational clarity over vague commentary. We would rather publish a narrower, more defensible claim than a broader, harder-to-verify one.</p>

<h2>Contact</h2>
<ul>
  <li><strong>General inquiries:</strong> <a href="mailto:contact@commoditynode.com">contact@commoditynode.com</a></li>
  <li><strong>Enterprise and team access:</strong> <a href="mailto:enterprise@commoditynode.com">enterprise@commoditynode.com</a></li>
  <li><strong>Research archive:</strong> <a href="/reports/">Browse Signal Reports</a></li>
  <li><strong>Methods and caveats:</strong> <a href="/methodology/">Read the Methodology</a></li>
</ul>

<div style="margin-top:40px;padding:28px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);text-align:center;">
  <p style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">Start with the highest-signal pages</p>
  <p style="color:var(--text2);margin-bottom:20px;">If you are new to CommodityNode, begin with a flagship commodity hub, then read the matching Signal Report.</p>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
    <a href="/commodities/gold/" class="btn btn-primary">Gold Impact Hub</a>
    <a href="/commodities/crude-oil/" class="btn btn-secondary">Crude Oil Impact Hub</a>
    <a href="/reports/" class="btn btn-secondary">Research Archive</a>
  </div>
</div>

</div>
</div>
</div>

{% include newsletter.html %}
