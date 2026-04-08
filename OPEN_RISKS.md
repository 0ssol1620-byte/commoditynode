# OPEN_RISKS.md

## Remaining Risks

### 1. Simulator credibility is still content-heavy
- **Status:** Partially addressed, not fully resolved.
- **Issue:** The simulator now renders, but much of the impact layer is still based on static scenario/impact maps rather than fully data-driven live sensitivity output.
- **User impact:** Medium to high. It looks functional, but advanced users may expect a deeper quantitative engine.
- **Recommended next step:** Move scenario assumptions and company/industry sensitivity tables into structured data files with explicit provenance and refresh cadence.

### 2. Backtest results are stale relative to refreshed forecast data
- **Status:** Open.
- **Issue:** `assets/data/backtest_results.json` was not fully regenerated in this pass and may lag the refreshed forecast pipeline.
- **User impact:** Medium. Forecast pages can appear fresher than methodology/performance evidence.
- **Recommended next step:** Re-run the backtest pipeline, publish the new run timestamp, and surface it wherever forecast performance is referenced.

### 3. Hub quality remains uneven across long-tail commodities
- **Status:** Open.
- **Issue:** The spec target for fully tiered, fully even coverage is not yet complete. `ethylene` and `palm-oil` still need stronger related-report depth, and many hubs remain thin.
- **User impact:** Medium. Users on long-tail pages may still get a shallower experience than on flagship hubs.
- **Recommended next step:** Add tier labels or coverage notes and prioritize related-report expansion for 0-post and 1-post hubs.

### 4. Pricing / conversion surfaces need deeper outcome-oriented rewrite
- **Status:** Partially open.
- **Issue:** Core trust issues can be reduced, but full top-tier conversion polish requires a dedicated pass across landing, pricing, FAQ, and enterprise flows.
- **User impact:** Medium. Product trust is improved more by surface consistency than by final conversion copy quality.
- **Recommended next step:** Create a dedicated conversion landing page and reframe Free / Pro / Enterprise around workflows and outcomes.

### 5. Local build validation environment is incomplete
- **Status:** Open.
- **Issue:** Full Jekyll build validation is constrained when local Ruby/Bundler tooling is unavailable.
- **User impact:** Low to medium. Live deploy checks catch a lot, but pre-deploy assurance is weaker than ideal.
- **Recommended next step:** Restore local build tooling or add CI validation that runs Jekyll build plus link checks on every push.
