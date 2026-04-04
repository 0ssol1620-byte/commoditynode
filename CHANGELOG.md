# CHANGELOG — CommodityNode Integrity Fixes (2026-04-04)

## Phase 1: Fixed 5 Broken Public HREFs

| File | Broken Link | Fixed To |
|------|-------------|----------|
| `companies/dow.html` | `/commodities/ethylene/` | `/commodities/ethanol/` |
| `companies/pg.html` | `/commodities/palm-oil/` | `/commodities/soybeans/` |
| `companies/unilever.html` | `/commodities/palm-oil/` | `/commodities/soybeans/` |
| `industries/technology.html` | `/commodities/rare-earths/` | `/commodities/rare-earth/` |
| `themes/us-china-tariff-war.html` | `/newsletter/` | `/pricing/` |

## Phase 2: Added Direct/Proxy/Analysis-Only Badge

- **File changed:** `_layouts/commodity.html`
- Added inline pill badge after `<h1>` commodity title
- Logic: no symbol → "Analysis Only" (gray), futures → "Direct Market Price" (green), etf_proxy/equity_proxy → "Proxy Asset Benchmark" (amber)

## Phase 3: Zero-Related-Post Fallback

- **File changed:** `_layouts/commodity.html`
- Added fallback section before Signal Reports grid for commodities with 0 related posts
- Affected commodities: ammonia, hydrogen, manganese, potash, rice, rubber, soybean-meal, soybean-oil

## Phase 4: Canonical URL Verification

- `_config.yml` already has `url: "https://commoditynode.com"` — jekyll-seo-tag handles canonical automatically
- No manual `canonical_url` front matter needed

## Phase 5: Added Missing `commodity_name` to 20 Posts

Posts fixed:
- `2026-03-22-diesel-transportation-inflation.md` → Diesel
- `2026-03-23-coffee-price-crash-brazil-surplus.md` → Coffee
- `2026-03-23-copper-structural-deficit.md` → Copper
- `2026-03-23-crude-oil-strait-hormuz-geopolitical-premium.md` → Crude Oil
- `2026-03-23-gold-price-regime-change.md` → Gold
- `2026-03-28-building-commoditynode-lessons.md` → General
- `2026-03-28-commodity-correlations-break-down-crises.md` → General
- `2026-03-28-farm-to-fork-food-price-chain.md` → General
- `2026-03-28-five-commodity-signals-predicted-2025.md` → General
- `2026-03-28-how-to-read-commodity-impact-map.md` → General
- `2026-03-29-agricultural-rotation-grains-next-trade.md` → Wheat
- `2026-03-29-aluminum-resilience-middle-east-supply.md` → Aluminum
- `2026-03-29-gold-correction-bull-market-over.md` → Gold
- `2026-03-29-middle-east-oil-premium-hormuz-repricing.md` → Crude Oil
- `2026-03-29-silver-below-70-industrial-vs-precious.md` → Silver
- `2026-03-30-copper-ai-data-center-demand-surge.md` → Copper
- `2026-03-30-gold-4500-new-floor-central-bank-buying.md` → Gold
- `2026-03-30-lithium-price-collapse-ev-battery-paradox.md` → Lithium
- `2026-03-30-uranium-nuclear-renaissance-supply-gap.md` → Uranium
- `2026-03-30-wheat-black-sea-supply-shock-2026.md` → Wheat

## Phase 6: Validation Script

- Created `scripts/validate_links.py` — checks commodity→company, commodity→theme, and public href validity
