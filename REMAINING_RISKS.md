# Remaining Risks — CommodityNode

## Known Issues Not Fixed

1. **Dow → Ethanol mapping is approximate.** Dow's primary commodity exposure is ethylene/polyethylene, which doesn't exist as a commodity page. Mapped to ethanol as closest available. Consider creating an `ethylene.md` commodity page.

2. **P&G / Unilever → Soybeans is a proxy.** Palm oil is their actual primary commodity. No `palm-oil.md` exists. Soybeans is the closest substitute. Consider adding a palm oil commodity page.

3. **5 "General" posts have `commodity_name: "General"`.** These are editorial/educational posts not tied to a specific commodity (e.g., "Building CommodityNode", "How to Read an Impact Map"). They don't map cleanly to any single commodity.

4. **Commodity front matter link validation** only covers `companies` and `themes` arrays. It doesn't check inline markdown links within commodity body content.

5. **No `/reports/` page verified.** The zero-post fallback links to `/reports/` — ensure this page exists.

6. **96 posts missing `canonical_url`** — confirmed NOT a real issue since jekyll-seo-tag auto-generates canonical from `url` + `page.url`. But if SEO plugin config changes, this could resurface.
