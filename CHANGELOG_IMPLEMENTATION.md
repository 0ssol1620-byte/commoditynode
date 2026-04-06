# CommodityNode Implementation Changelog
Generated: 2026-04-06

---

## Phase 0: SEO Overhaul

Commits targeting search visibility, schema markup, and technical SEO correctness.

- `ecf4d9b` **seo: comprehensive SEO overhaul — security, schema, content, GEO**
  - Organization schema, FAQPage schema, Article schema on hub pages
  - CSP headers, IndexNow integration, canonical tag audit
  - GEO/AEO optimization (HowTo schema, SpeakableSpec, QAPage)
  - Author bio and `last-updated` metadata added site-wide

- `c0e8a7d` **seo: iteration 2 fixes — CSP, IndexNow, FAQPage quality, title/image cleanup**
  - CSP policy tightened; IndexNow key file deployed
  - FAQPage schema improved with question-phrased H2s
  - OG image and meta title cleanup across 15+ commodity pages

- `973e3aa` **seo: iteration 3 fixes — title lengths, Person schema, impact table visibility**
  - Title length normalized across commodity hub pages
  - Person schema added for author attribution
  - Impact table visibility fix (was hidden on mobile)

- `5e3b943` **seo: deslop — remove redundant filler sentence in Impact Map Summary**
  - Removed AI-generated filler detected in commodity summary blocks

- `72d751d` **seo: iteration 4 fixes — loader bug, tag links, schema, canonicals, titles**
  - JS loader race condition fixed (spinner timeout → 1500ms)
  - Tag page links corrected for Jekyll 3.x compatibility
  - Dataset schema enriched with `variableMeasured` and `temporalCoverage`

- `8531645` **seo: iteration 4b — Dataset enrichment, SoftwareApplication offers, minor fixes**
  - SoftwareApplication schema added to simulator page
  - Offers node added for Pro pricing schema

- `0a86f23` **seo: iteration 5 — remaining title/tag/schema/liquid fixes**
  - 5 remaining commodity titles corrected for length
  - Liquid syntax compatibility fix for Jekyll 3.x `where_exp`
  - Final schema validation pass

- `604e603` **fix: frontend UI audit — CSS fixes, standfirst spacing, chart heights, perf**
  - Standfirst paragraph spacing normalized
  - Chart container heights made responsive
  - Three.js conditional load to avoid blocking render

- `a91c91c` **fix: add server-side 301 redirects (silver-solar, /tags/) for proper indexing**
  - vercel.json updated with 301 redirects for legacy URLs
  - `/tags/` → individual tag pages

- `d0fbe05` **seo: generate 15 custom OG images for commodities using fallback/wrong images**
  - OG images generated for: aluminum, ammonia, chromium, cobalt, coal, cotton, ethanol, feeder-cattle, graphite, lean-hogs, live-cattle, lumber, oats, orange-juice, rice

---

## Phase 1: Structure

Data type classification, front matter schema standardization, and tag coverage.

- `600bcb0` **feat: Phase 1 — commodity data type classification, badges, tags**
  - 62 commodities classified into `data_type` categories: `direct_futures`, `proxy`, `index_proxy`, `otc_estimate`
  - `data_type` badges added to commodity hub pages (visual indicator of data quality)
  - Tags added to 31 commodities that lacked the `tags` front matter field
  - Front matter schema documented: required fields `title`, `description`, `symbol`, `sector`, `data_type`, `companies`, `etfs`, `substitutes`, `themes`, `tags`, `image`

---

## Phase 2: Hub Quality

KPI fallback system and coverage expansion for zero-data commodities.

- `1cb484d` **feat: Phase 2-3 — KPI fallbacks, coverage expansion, simulator UX**
  - KPI fallback system: commodity hubs without live price data now display last-known values with staleness indicator
  - Coverage expanded: `ethylene.md` created (world's most-produced organic chemical, DOW proxy)
  - Coverage expanded: `palm-oil.md` created (RSPO, Wilmar, food inflation theme)
  - Simulator UX: preset shock scenarios added (supply shock, demand surge, geopolitical disruption)
  - Simulator default commodity set to Crude Oil on load
  - Copy improvements across simulator page

---

## Phase 3: Product

Simulator UX improvements, pricing page redesign, Pro landing page.

- `01e191d` **feat: Phase 3 — Pricing outcome redesign + Pro landing page**
  - Pricing page rewritten from feature-based to outcome-based framing
  - Pro landing page (`/pro/`) created with full feature breakdown, trust signals, and Lemon Squeezy CTA
  - Simulator copy refined: preset shock labels made concrete ("China export ban", "OPEC+ cut")
  - Default commodity on simulator changed from none → Crude Oil for immediate engagement

- `1cb484d` (also covers Phase 3 simulator work — see Phase 2 above)

Earlier product infrastructure:
- `9228ee8` **feat(phase1): Pro gating + teaser upsell flow** — Pro gate on API and CSV export; teaser content visible to free users
- `b8c4cc8` **feat(phase2): Vercel Serverless Functions** — API endpoints, CSV export, Lemon Squeezy webhook, API key management UI

---

## Phase 4: Conversion

CTA flow optimization, trust snippets, newsletter contextualization.

- `00326cf` **feat: conversion flow upgrade — simulator onboarding, signal track record, pricing use case, enterprise page, newsletter, about trust, nav enterprise link**
  - Simulator onboarding tooltip added for new visitors
  - Signal track record section added to homepage
  - Pricing page: use-case framing ("For commodity traders", "For supply chain teams")
  - Enterprise page (`/enterprise/`) created
  - Newsletter signup contextualized with data preview CTA
  - About page updated with trust signals (methodology transparency, data sources)

- `b716bbe` **feat: connect Lemon Squeezy checkout URLs to all Pro CTA buttons**
  - All Pro upgrade buttons wired to live Lemon Squeezy checkout

- `3705b15` **feat: add weekly digest email template** — Dark-theme email with signals, events, and Pro CTA for subscriber nurture

---

## Phase 5: QA

Validation scripts, documentation, link integrity audits.

- `95f4188` **fix: Phase 1-6 integrity fixes — broken hrefs, direct/proxy badges, zero-post fallbacks, commodity_name, validation script**
  - 127 broken internal links fixed across company and theme hub pages
  - `commodity_name` front matter corrected on 8 signal report posts
  - Zero-post fallback UI added to commodity hubs with no related posts

- `2ac0f1e` **fix: final QA pass — remaining 4 og-default images replaced, all checks green**
  - Last 4 commodities using `og-default.png` given appropriate fallback OG images
  - All `qa_check.py` assertions green

- `09fe17a` **fix: qa_links.py improved — distinguish critical broken HTML links from non-critical plain badges**
  - Script now separates critical href errors from cosmetic badge mismatches

- `bde0ed8` **fix: 160 slug fixes, pricing outcome rewrite, simulator copy, /reports/ verified**
  - 160 slug normalization fixes across company hub pages
  - `/reports/` page existence verified

- `e84a0f9` **feat: 8 new signal reports for zero-coverage commodities, post CTAs, /reports/ page**
  - Signal report posts created for: ammonia, hydrogen, manganese, potash, rice, rubber, soybean-meal, soybean-oil
  - Simulator CTA added to all 8 new posts and 5 recent 2026-04-04 posts

- **2026-04-06 (this session):**
  - `scripts/validate_frontmatter.py` — new schema validator for all 62 commodity files
  - `scripts/validate_links.py` — updated link validator (companies, themes, layout Liquid refs)
  - `CHANGELOG_IMPLEMENTATION.md` — this file
  - `VALIDATION_REPORT.md` — validation run results
  - `REMAINING_RISKS.md` — known limitations and deferred work

---

## Company Hub Expansion

- `2b2e505` / `9ddc1d3` **feat: 20 + 19 new company hub pages**
  - Added: SBSW, GLNCY, IMPUY, VALE, TSN, SCCO, CTVA, NTR, SQM, PEP, CLF, PAAS, MP, ANGPY, AWK, UEC, MDLZ, INGR, XYL, JBSAY, ALB, AMD, ASML, BHP, BP, BUNGE, CF, CCJ, and more
  - Total company hubs: 74 pages

## Content & Signal Reports

- `6b60b8b` **feat: April 2026 news content** — 4 signal reports + 2 new themes + `theme_slugs`
- `7b88170` / `9716e48` **feat: content completeness** — 9 additional signal report posts covering wheat, natural gas, lithium, palladium, cobalt, tin, sugar, and cotton markets
- `305595d` / `2827f1e` / `12b268b` — Reddit/social content package for community seeding

## Forecasting & ML Pipeline

- `894af2c` **feat: Chronos-2 quantile direction signal** — replaced GradBoost with principled Chronos-2 quantile bands
- `4b56df4` **feat: AutoGluon Chronos-Bolt-Small LoRA fine-tune** production pipeline
- `f83d761` **feat: covariates** — futures spread + calendar events in 4-model backtest
- `a395f20` **data: regenerate forecast.json** — Chronos-2 quantile direction signals for 19 commodities
- `0c5626d` **feat: weekly resampling** in direction classifier (4-week labels for 30-day prediction)
