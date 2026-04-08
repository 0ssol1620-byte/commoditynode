# CommodityNode Validation Report
Generated: 2026-04-08

---

## 0. Master Spec Audit Snapshot (2026-04-08)

### Repo and live checks completed
- Verified representative live pages across home, browse, pricing, signals, simulator, methodology, and flagship commodity hubs
- Confirmed repo coverage counts and centralized public-facing count rendering
- Identified and fixed commodity hub live KPI regression caused by slug-to-data-key mismatch and `price` vs `current_price` field mismatch
- Logged unresolved product-level risks separately in `OPEN_RISKS.md`

### Key findings
| Area | Result |
|------|--------|
| Public coverage counts | Fixed in repo, now sourced from `_config.yml` |
| Representative hub live KPI logic | Fixed in repo |
| Data type disclosure | Present on commodity hubs and methodology |
| Home placeholder copy | Reduced in repo |
| Simulator availability | Live simulator renders and forecast stats are present |
| Long-tail hub parity | Still uneven, tracked as open risk |
| Backtest freshness parity | Still open risk |

### Honest status
This project is materially improved and the most serious live trust defects were fixed. Remaining gaps are concentrated in a smaller set of rollover-sensitive or structurally weak price feeds, not broad site-wide display failures.

### Follow-up refinement outcome (2026-04-09)
- Added rollover-aware daily change recovery for energy futures
- Restored live homepage WTI and natural gas change rendering
- Removed misleading `0.0%` / `Data check` style fallback from live home output when recoverable data exists
- Preserved `Daily change unavailable` only for feeds that remain genuinely unreliable under current heuristics

### Remaining intentionally conservative cases
- Rice (`ZR=F`) — detected scale break / unit discontinuity
- Zinc (`ZNC=F`) — frozen series / unreliable day-over-day basis
- Lean Hogs (`HE=F`) — high-jump contract behavior not yet safely normalized
- Nickel / Tin (`JJN`) — proxy feed limitations

---

## 1. Front Matter Validation

**Script:** `scripts/validate_frontmatter.py`
**Run:** `python3 scripts/validate_frontmatter.py`

### Summary

| Metric | Count |
|--------|-------|
| Total files | 62 |
| PASS (all fields, no warnings) | 34 |
| PASS with warnings (title length) | 7 |
| FAIL (missing required fields) | 21 |

**Exit code: 1 (failures present)**

### Passed Files (34 clean)

aluminum, cobalt, cocoa, coffee, corn, crude-oil, ethanol, ethylene, feeder-cattle, gold, graphite, iron-ore, jet-fuel, lean-hogs, lithium, live-cattle, manganese, neon, nickel, palladium, palm-oil, phosphate, platinum, potash, rhodium, rice, silver, soybean-oil, soybeans, steel, uranium, vanadium, wheat, zinc

### Passed with Warnings (7 — title length outside 50-70 char ideal)

| File | Title Length | Title |
|------|-------------|-------|
| ammonia | 48 | "Ammonia Price Impact: Fertilizers, Stocks & ETFs" |
| antimony | 49 | "Antimony Price Impact: Defense & Flame Retardants" |
| copper | 47 | "Copper Price Impact: EVs, Mining & Construction" |
| gallium | 48 | "Gallium Price Impact: Semiconductors & 5G Supply" |
| rare-earth | 71 | "Rare Earth Elements Price Impact: Tech Supply Chain & Critical Minerals" |
| soybean-meal | 71 | "Soybean Meal Price Impact: Livestock Feed, Crush Margins & Agribusiness" |
| water | 77 | "Water Price Impact: Agriculture, Climate Risk, Utilities & Scarcity Economics" |

### Failed Files (21 — missing required fields)

| File | Missing Fields |
|------|---------------|
| chromium | symbol |
| coal | companies |
| cotton | companies |
| diesel | companies |
| gallium | symbol, companies |
| germanium | symbol |
| helium | symbol |
| hydrogen | companies |
| indium | companies |
| lng | companies |
| lumber | companies |
| molybdenum | symbol |
| natural-gas | companies |
| oats | themes |
| orange-juice | themes |
| rubber | companies |
| silicon | symbol, companies |
| sugar | companies |
| tin | symbol, companies |
| titanium | companies |
| tungsten | symbol |

Additionally, files with title length warnings (outside 50-70 chars):

| File | Chars | Direction |
|------|-------|-----------|
| germanium | 77 | too long |
| helium | 73 | too long |
| iridium | 74 | too long |
| molybdenum | 78 | too long |
| titanium | 71 | too long |
| tungsten | 73 | too long |

### Root Cause

21 failures are concentrated in two categories:

1. **Missing `symbol`** (8 files): Commodities without a tradeable futures ticker (gallium, germanium, helium, molybdenum, silicon, tin, tungsten, chromium) — these are OTC/estimated prices with no standard exchange symbol. Field should either be populated with a proxy symbol or the schema updated to mark `symbol` as optional for `data_type: otc_estimate`.

2. **Missing `companies`** (15 files): Commodities where no direct-exposure company hub page has been created yet. The field is present as an empty list `[]` in most cases, which the validator treats as empty.

---

## 2. Link Validation

**Script:** `scripts/validate_links.py`
**Run:** `python3 scripts/validate_links.py`

### Summary

| Check | Result |
|-------|--------|
| Liquid company hrefs in commodity.html layout | 3 found (dynamic, verified via front matter) |
| Liquid theme hrefs in commodity.html layout | 2 found (dynamic, verified via front matter) |
| companies[] ticker → companies/*.html | PASS |
| themes[] slug → themes/*.html | PASS |
| /commodities/ hrefs in companies/ and themes/ HTML | PASS |
| Total commodity files checked | 62 |

**Exit code: 0 — All links valid**

### Detail

All `companies[]` ticker values in commodity front matter resolve to existing pages under `companies/`. All `themes[]` values resolve to existing pages under `themes/`. No broken `/commodities/` hrefs were found in company or theme hub HTML files.

---

## 3. Recommended Actions

### High Priority

1. Populate `symbol` for 8 OTC commodities or update schema to allow `null` for `data_type: otc_estimate`
2. Add `companies[]` entries for 15 commodities that list none — or explicitly set to `[]` and document as intentional

### Medium Priority

3. Extend 5 titles that are under 50 chars (ammonia, antimony, copper, gallium) by adding a differentiating qualifier
4. Shorten 6 titles over 70 chars (germanium, helium, iridium, molybdenum, titanium, tungsten, water) for SEO

### Low Priority

5. Add `themes` to oats and orange-juice (currently empty)
