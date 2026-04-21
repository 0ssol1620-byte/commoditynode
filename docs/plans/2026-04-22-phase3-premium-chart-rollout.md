# CommodityNode Phase 1–3 Premium Chart Rollout Implementation Plan

> **For Hermes:** Execute directly in repo with TDD-minded verification. Prioritize premium analytical clarity over decorative motion.

**Goal:** Implement the full premium chart/motion stack across CommodityNode flagship pages through Phase 3: KPI spark walls, Sankey, heatmaps, forecast cones, scenario tornadoes, network graphs, radial exposure, event timelines, RL observability, and scroll-driven narrative blocks.

**Architecture:** Add one shared analytics helper for reusable transforms and page bootstrapping. Wire page-specific sections only where they materially improve scanning and trust: home, pricing, correlation, simulator, commodity hubs, and RL Policy Lab. Keep homepage flagship motion cosmic, internal pages decision-grade, and commodity/local graphs premium 2D.

**Files expected to change:**
- `assets/js/premium-analytics.js` (new shared helper)
- `index.html`
- `pricing/index.html`
- `correlation/index.html`
- `simulator/index.html`
- `_layouts/commodity.html`
- `_layouts/intelligence-product.html`
- `tests/test_premium_analytics.py` (new)
- `tests/test_premium_page_markers.py` (new)

**Verification:**
1. `node --check` on touched JS
2. Focused pytest for new helper + marker coverage
3. Browser QA on `/`, `/pricing/`, `/correlation/`, `/simulator/`, one commodity hub, and `/intelligence-lab/rl-policy-lab/`
4. Browser console clean on edited pages
5. Push and live cache-busted verification
