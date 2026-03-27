# DEV_TODO — Full-Site QA Report (2026-03-28)

## Puppeteer Test Results (10 Pages)

| # | Page | URL | HTTP | Graph | Sidebar | Newsletter |
|---|------|-----|------|-------|---------|------------|
| 1 | Home | / | ✅ 200 | N/A | no sidebar | ✅ found |
| 2 | Commodities Index | /commodities/ | ✅ 200 | N/A | no sidebar | ✅ found |
| 3 | Crude Oil | /commodities/crude-oil/ | ✅ 200 | ✅ rendered (3 children) | ⚠️ see note | ✅ found |
| 4 | Gold | /commodities/gold/ | ✅ 200 | ✅ rendered (3 children) | ⚠️ see note | ✅ found |
| 5 | Gallium | /commodities/gallium/ | ✅ 200 | ✅ rendered (3 children) | ⚠️ see note | ✅ found |
| 6 | **Antimony (NEW)** | /commodities/antimony/ | ✅ 200 | ✅ rendered (3 children) | ⚠️ see note | ✅ found |
| 7 | **Neon (NEW)** | /commodities/neon/ | ✅ 200 | ✅ rendered (3 children) | ⚠️ see note | ✅ found |
| 8 | **Water (NEW)** | /commodities/water/ | ✅ 200 | ✅ rendered (3 children) | ⚠️ see note | ✅ found |
| 9 | Reports | /reports/ | ✅ 200 | N/A | no sidebar | ✅ found |
| 10 | About | /about/ | ✅ 200 | N/A | no sidebar | ✅ found |

### Summary
- **HTTP 200:** 10/10 ✅
- **Graph rendering:** 6/6 commodity pages render graphs correctly ✅
- **Newsletter form:** 10/10 pages have newsletter form ✅
- **Sidebar overlap:** All commodity pages show sidebar left:976, main right:1280 — this is the **existing desktop sidebar layout** (sidebar inside main container). This is consistent across ALL commodity pages (old and new), not a regression.

## Update Summary
- **60 commodities** (6 new: antimony, indium, neon, iridium, titanium, water)
- **105 signal reports** (3 new: antimony defense, neon semiconductor, water climate)
- **Universe 3D map** updated with 6 new entries
- **Prices data** updated in both `assets/data/prices.json` and `_data/prices.json`
- **Commodities index** updated with new entries in correct categories
- **Homepage** updated: "60 commodities", "7000+ Impact Nodes"

## Known Pre-existing Issues (not regressions)
- Sidebar "overlap" on commodity pages is by design (sticky TOC at right)
- No `og-*.png` images created for new commodities (need OG image generation)
