# CommodityNode Marketing / SEO / CRO Audit

Date: 2026-04-13
Frameworks used:
- marketingskills/seo-audit
- marketingskills/ai-seo
- marketingskills/page-cro
- marketingskills/copy-editing
- Hermes dogfood QA workflow

## Scope
- Sitewide automated recon via sitemap + metadata crawl
- Live manual review of representative templates
  - Homepage
  - Pricing page
  - Research Archive
  - Commodity hub (Natural Gas, Copper)
  - Signal report page
  - 404 page
- Robots / llms / pricing machine-readable files
- Analytics implementation presence in codebase

## Executive Summary
CommodityNode is strong on topical authority, freshness, structured commodity coverage, internal linking, and AI-crawler accessibility. The biggest remaining gaps are not technical breakage but conversion clarity and information architecture:

1. Homepage tries to explain too much at once and needs a clearer primary value proposition.
2. Pricing page is credible but too text-dense, with weak instant plan differentiation.
3. Research Archive lacks on-page search and stronger discovery controls.
4. 404 page recovers traffic but underuses the moment for intent routing and signup.
5. AI-SEO fundamentals are good (robots + llms.txt + topical depth), but more extractable, answer-style copy and stronger structured summaries would improve citation likelihood.

## What is already strong
- robots.txt explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, anthropic-ai, Google-Extended
- llms.txt exists and is substantive
- pricing.txt exists and is substantive
- sitemap is live and clean
- no duplicate URLs found in sitemap after remediation
- metadata coverage is high
- internal linking is strong across hubs, reports, industries, companies, themes
- content freshness signals are visible sitewide
- live pricing / forecast / signals create strong perceived authority
- GA4 is installed via `_includes/google-analytics.html`
- newsletter signup is present and live via Mailchimp form

## P0 / P1 Findings

### P1-1 Homepage: hero value proposition is still too abstract
Visible issue:
- Headline is differentiated but conceptual: "The Commodity Impact Map For Markets, Supply Chains & Equities"
- Product depth is obvious, but immediate job-to-be-done clarity is weaker than it should be.

Why it matters:
- New visitors may not instantly understand whether this is a dashboard, research product, monitoring tool, or portfolio-risk platform.

Recommendation:
- Rewrite hero to answer in plain language:
  - what it is
  - who it is for
  - what decision it helps make
- Keep one dominant CTA above the fold.

### P1-2 Homepage: information density is too high
Visible issue:
- Too many equally weighted modules compete for attention: hero, guided-entry cards, live previews, AI forecast module, newsletter, universe map, signals, etc.

Why it matters:
- Product depth is impressive, but first-time comprehension likely suffers.

Recommendation:
- Compress or defer some mid-page modules.
- Introduce a clearer story arc:
  1. what it is
  2. why it matters
  3. how it works
  4. proof
  5. CTA

### P1-3 Pricing page: plan differentiation is not instant enough
Visible issue:
- Pricing page is persuasive but text-heavy.
- Free vs Pro vs Enterprise differences require too much reading.
- CTA language varies across the page.

Why it matters:
- Pricing pages need to answer "which plan is for me?" very quickly.

Recommendation:
- Add a short scannable comparison row above the cards.
- Standardize CTA naming.
- Reduce copy inside plan cards.
- Move strongest trust / ROI argument closer to Pro card.

### P1-4 Research Archive: no visible search on an archive-heavy page
Visible issue:
- The archive has filters and pagination but no visible search box.

Why it matters:
- High-intent users likely want to find a commodity, company, or theme quickly.

Recommendation:
- Add archive search with keyword matching across title, tags, commodity, company.
- Optionally add sort options: newest, most read, energy, metals, agriculture, bullish, bearish.

### P1-5 404 page: low conversion / weak recovery routing
Visible issue:
- 404 page only routes to Home and Browse Commodities in the main body.
- No search, no recommended content, no contextual signup prompt.

Why it matters:
- Lost visitors often have high intent. This is a missed recapture opportunity.

Recommendation:
- Add:
  - search box
  - trending commodities
  - latest reports
  - signup CTA
  - likely alternatives (Reports / Signals / Industries / Companies)

## P2 Findings

### P2-1 Metadata quality still uneven on long tail pages
Automated recon showed:
- many commodity titles remain >65 chars once brand suffix is included
- several pages have short meta descriptions (<120 chars)
- several posts have long meta descriptions (>160 chars)

Why it matters:
- Not a blocker, but inconsistent SERP presentation and CTR drag.

Recommendation:
- Enforce page-type title/meta ranges by template:
  - commodity: title target 45-55 before brand suffix
  - reports: 50-60 before suffix
  - meta descriptions: 135-155 target

### P2-2 Archive cards need stronger click hierarchy
Visible issue:
- Research Archive cards are useful but visually similar.
- "Open Signal Report" link is somewhat understated.

Recommendation:
- Increase visual emphasis on report title and CTA.
- Consider making the whole card clickable.

### P2-3 Homepage AI-SEO opportunity: more extractable summary blocks
Visible issue:
- Homepage is visually strong, but answer-extraction copy is less explicit than ideal.

Recommendation:
- Add plain-language summary blocks such as:
  - What is CommodityNode?
  - Who is it for?
  - What can you do with it?
  - Why is it different?
- Use short, citable 40-60 word blocks.

### P2-4 Pricing page: trust signals could be surfaced higher
Visible issue:
- Trust exists, but recognizable proof is not prominent enough in the first comparison zone.

Recommendation:
- Add stronger proof near pricing cards:
  - number of reports
  - number of hubs
  - update frequency
  - user archetypes / use cases
  - maybe recognizable source/process credibility markers

### P2-5 Some section URLs look low-value / internal-plan-like
Automated crawl showed odd public URLs such as `/TIMESFM_INTEGRATION_PLAN` and similar utility-ish pages in sitemap output.

Recommendation:
- Review all non-core top-level URLs for noindex / removal / redirect.
- Keep public sitemap focused on pages with actual search intent value.

## AI-SEO Specific Notes

### Current strengths
- AI bots allowed
- llms.txt and pricing.txt present
- strong entity/topic coverage around commodities, companies, industries, themes
- topical authority and freshness are visible
- machine-readable artifacts exist

### Biggest AI-SEO opportunities
1. More answer-style intros on key pages
2. More comparison blocks and FAQ-style extraction blocks on hubs
3. Stronger schema consistency checks on article / collection / product-like pages
4. More third-party citation strategy over time (Reddit, media mentions, industry references)

## Analytics / Measurement Notes
Found:
- GA4 measurement ID in `_config.yml`
- gtag include present
- newsletter form present via Mailchimp

Open question / likely gap:
- Not yet verified that key events are tracked beyond pageview:
  - hub clicks
  - simulator CTA clicks
  - pricing CTA clicks
  - newsletter signup success
  - report open clicks

Recommendation:
- Audit event taxonomy next and instrument key funnel events.

## Highest-Leverage Next Actions

### Batch A — Conversion / UX
1. Rewrite homepage hero + tighten CTA hierarchy
2. Add search to Research Archive
3. Upgrade 404 page with search + recommendations + signup prompt
4. Simplify pricing card comparison and CTA wording

### Batch B — AI-SEO / On-page SEO
5. Normalize remaining title/meta lengths by template
6. Add more extractable answer blocks to homepage and key hubs
7. Audit schema coverage with rendered-page detection, not just static fetch
8. Review low-value public URLs for noindex/remove decisions

### Batch C — Measurement
9. Add GA4 events for pricing clicks, simulator clicks, report opens, newsletter success
10. Map homepage -> archive -> hub -> pricing funnel

## Recommended execution order
1. Homepage hero / CTA rewrite
2. Research Archive search + better discovery
3. Pricing page simplification
4. 404 recovery upgrade
5. Analytics event instrumentation
6. Schema and AI-SEO sweep

## Notes
This audit intentionally focused on visible/sitewide marketing, SEO, AI-search, and CRO issues rather than purely technical bugs. The site is already strong enough to support growth; the biggest gains now come from reducing cognitive load and making high-intent paths easier to follow.