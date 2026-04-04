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
