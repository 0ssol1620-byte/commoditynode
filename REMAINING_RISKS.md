# Remaining Risks — CommodityNode

## Known Issues Not Fixed

1. **Dow → Ethanol mapping is approximate.** Dow's primary commodity exposure is ethylene/polyethylene, which doesn't exist as a commodity page. Mapped to ethanol as closest available. Consider creating an `ethylene.md` commodity page.

2. **P&G / Unilever → Soybeans is a proxy.** Palm oil is their actual primary commodity. No `palm-oil.md` exists. Soybeans is the closest substitute. Consider adding a palm oil commodity page.

3. **5 "General" posts have `commodity_name: "General"`.** These are editorial/educational posts not tied to a specific commodity (e.g., "Building CommodityNode", "How to Read an Impact Map"). They don't map cleanly to any single commodity.

4. **Commodity front matter link validation** only covers `companies` and `themes` arrays. It doesn't check inline markdown links within commodity body content.

5. **No `/reports/` page verified.** The zero-post fallback links to `/reports/` — ensure this page exists.

6. **96 posts missing `canonical_url`** — confirmed NOT a real issue since jekyll-seo-tag auto-generates canonical from `url` + `page.url`. But if SEO plugin config changes, this could resurface.

## Session: 2026-04-04 Content Phase

7. **8 zero-related-post commodities now have signal reports:** ammonia, hydrogen, manganese, potash, rice, rubber, soybean-meal, soybean-oil. Each has one post with `commodity_name` front matter matching the commodity slug. These posts use `og-default.png` or closest available OG image — custom OG images for these commodities should be created.

8. **3 short posts expanded:** copper-structural-deficit (was 551 words), diesel-transportation-inflation (was 749 words), coffee-price-crash-brazil-surplus (was 777 words). All now include Market Context, Key Risk Factors, and What to Watch sections.

9. **Simulator CTA added to 5 recent posts** (2026-04-04 batch) linking to `/simulator/`. Also present in all 8 new signal report posts.

10. **`/reports/` page confirmed existing** — no action needed.

11. **Missing OG images for new commodities:** ammonia, hydrogen, manganese, potash, rice, rubber, soybean-meal, soybean-oil all lack dedicated `og-{commodity}.png` files. Using `og-default.png`, `og-natural-gas.png`, `og-soybeans.png`, or `og-wheat.png` as proxies.
