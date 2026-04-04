# QA Report — CommodityNode Integrity Fixes

## Before/After Metrics

| Metric | Before | After |
|--------|--------|-------|
| Broken public HREFs | 5 | 0 |
| Commodity badge (Direct/Proxy/Analysis) | Not shown | ✅ All commodity hubs |
| Zero-post commodities with no fallback UI | 8 | 0 (fallback section added) |
| Posts missing `canonical_url` | 96 | 0 (handled by jekyll-seo-tag + correct `url` in _config.yml) |
| Posts missing `commodity_name` | 20 | 0 |
| Validation script | None | `scripts/validate_links.py` |

## Verification

- All 5 broken links now point to existing commodity pages or valid site pages
- `_config.yml` url field confirmed: `url: "https://commoditynode.com"`
- Badge logic uses Liquid conditionals based on `page.symbol` and `page.proxy_type`
- Zero-post fallback renders a clean "in development" message with link to `/reports/`

## Session: 2026-04-04 Content Phase

### Changes Made

| Action | Count | Details |
|--------|-------|---------|
| New signal report posts | 8 | ammonia, hydrogen, manganese, potash, rice, rubber, soybean-meal, soybean-oil |
| Short posts expanded | 3 | copper-structural-deficit, diesel-transportation-inflation, coffee-price-crash-brazil-surplus |
| Simulator CTA added | 5 | gold-warsh, copper-drc, indium, iran-hormuz, trump-tariffs (2026-04-04 posts) |
| `/reports/` page | — | Already existed, no action needed |

### New Posts Created
- `2026-04-04-ammonia-market-analysis.md` — Natural gas cost dynamics, fertilizer margins
- `2026-04-04-hydrogen-market-analysis.md` — Green hydrogen infrastructure buildout delays
- `2026-04-04-manganese-market-analysis.md` — EV battery chemistry shift, steel demand floor
- `2026-04-04-potash-market-analysis.md` — Sanctions-reshaped trade flows, BHP Jansen
- `2026-04-04-rice-market-analysis.md` — India export restrictions, El Niño risk
- `2026-04-04-rubber-market-analysis.md` — Aging plantations, auto sector recovery
- `2026-04-04-soybean-meal-market-analysis.md` — US-China trade war crush margin pressure
- `2026-04-04-soybean-oil-market-analysis.md` — Renewable diesel retreat, trade war dynamics

### Verification
- All 8 new posts have valid front matter with `commodity_name`, `direction`, `sensitivity`, `confidence`
- All 8 new posts include Scenario Simulator CTA
- 3 expanded posts now have Market Context, Key Risk Factors, and What to Watch sections
- Zero-related-post commodity count reduced from 8 to 0
