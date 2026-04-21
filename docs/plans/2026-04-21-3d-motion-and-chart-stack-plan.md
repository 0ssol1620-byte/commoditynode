# CommodityNode 3D / Motion / Chart Stack Plan

> **For Hermes:** Use this as the implementation map for flagship visual upgrades. Keep 3D constrained to brand-defining surfaces and use analytical charting for decision pages.

**Goal:** Apply a modern, product-grade visualization stack across CommodityNode so home feels flagship, labs feel premium, and analysis tools feel decisional rather than decorative.

**Architecture:** Split the site into three visual layers: (1) flagship 3D brand surfaces, (2) premium analytical decision surfaces, and (3) lightweight supporting charts. Use the right stack per layer instead of forcing one library everywhere.

**Recommended stack:**
- Flagship 3D: Three.js now, React Three Fiber later if/when selective React islands are introduced
- Motion choreography: Theatre.js for flagship sequences, GSAP for existing scroll/reveal continuity
- Analytical charts: Apache ECharts as the primary upgrade path
- Lightweight charts: Chart.js keep for sparklines / mini forecast cards
- Bespoke visuals: D3 only where ECharts cannot express the needed graph
- Bounded 3D prototypes: Spline for concepting only, not core product logic
- Static 3D model embeds: <model-viewer> only for specific asset-viewer use cases

---

## 1. Visualization system map

### Layer A — Flagship brand surfaces
**Purpose:** Make CommodityNode memorable and premium within 5 seconds.

**Pages:**
- `/` home hero
- flagship methodology / narrative section later
- selective enterprise hero if needed

**Stack:**
- Three.js
- Theatre.js
- existing GSAP only as glue, not the main animation brain

**What to build:**
- `Impact Constellation`
  - center = selected commodity shock
  - ring 1 = sectors / industries
  - ring 2 = companies / themes
  - semantic colors = positive / negative / uncertain
  - hover = one-line implication
  - click = drill into hub / report / lab

**Why:**
- 3D is most valuable when it acts as a spatial metaphor for shock propagation.
- This is the strongest fit between CommodityNode’s brand and a modern flagship scene.

---

### Layer B — Premium analytical decision surfaces
**Purpose:** Make users understand and act faster.

**Pages:**
- `/intelligence-lab/`
- `/simulator/`
- `/correlation/`
- `/intelligence-lab/rl-policy-lab/`

**Stack:**
- Apache ECharts as primary
- GSAP / Motion-style transitions only for panel changes and focus choreography
- D3 only for custom network / graph cases when ECharts graph is insufficient

**Why ECharts:**
- Strong for heatmaps, sankeys, treemaps, graphs, radar, scatter, ranked analytical panels
- Better fit than Chart.js for product-grade analytical tools
- Better production speed than raw D3 for most advanced analysis views

---

### Layer C — Lightweight support visuals
**Purpose:** Keep fast-loading previews and small cards simple.

**Pages/components:**
- commodity hub mini charts
- report thumbnails / mini sparkline cards
- pricing proof snippets
- homepage mini preview charts

**Stack:**
- Chart.js keep

**Rule:**
- If the user is not meant to interrogate the chart deeply, keep it lightweight.

---

## 2. Page-by-page implementation map

| Page | Primary visual goal | Recommended stack | What to build next |
|---|---|---|---|
| Home `/` | Brand-defining first impression | Three.js + Theatre.js + GSAP | Replace ambient-only canvas with `Impact Constellation` hero scene |
| Start `/start/` | Productized onboarding preview | Existing UI + small Chart.js / CSS motion | Keep 2D; add faster preview cards, no heavy 3D |
| Pricing `/pricing/` | Outcome clarity + product proof | Chart.js snippets only | Add compact proof visuals, avoid heavy 3D |
| Intelligence Lab `/intelligence-lab/` | Premium command center | ECharts + subtle motion | Category overview cards, recommendation order, richer compare panels |
| Simulator `/simulator/` | Decision-grade scenario analysis | ECharts | Heatmap + tornado + compare surface + ranked exposure table |
| Correlation `/correlation/` | Investigable matrix tool | ECharts | Brushable heatmap + pair drill-down + recent change summary |
| RL Policy Lab | Policy observability console | ECharts + existing custom field + GSAP polish | Regime map, reward stack, baseline compare, scenario delta surface |
| Commodity / Company hubs | Fast visual summary | Chart.js or small ECharts cards | Keep lightweight; no heavy 3D |
| Enterprise `/enterprise/` | Team-grade trust | 2D diagrams + optional bounded 3D accent | Workflow diagram, architecture, delivery surfaces |

---

## 3. Library decision rules

### Use Three.js when:
- the scene is the brand moment
- spatial metaphor helps users understand relationships
- the user should remember the experience after leaving the page

### Use Theatre.js when:
- camera choreography matters
- multiple scene states need art-directed sequencing
- the flagship section should feel like motion design, not just animation

### Use ECharts when:
- the page is fundamentally analytical
- users need filters, comparisons, tooltips, toggles, linked views
- the chart should answer “what changed / what matters / what next?”

### Use Chart.js when:
- the chart is a supporting visual, not the product
- performance and simplicity matter more than deep interaction

### Use D3 only when:
- you need a custom graph / network / annotation system ECharts can’t express cleanly
- the team accepts higher maintenance cost for a distinctive payoff

### Use Spline only when:
- you need fast concepting or client-side prototyping for a hero scene
- the scene is mostly artistic / presentational

### Use <model-viewer> only when:
- there is a single specific 3D object to inspect
- the page is closer to asset viewing than data visualization

---

## 4. Best-fit references by pattern

### Pattern 1 — Flagship shock field
**Reference type:** cinematic 3D hero with meaningful hover/drilldown
**Stack:** Three.js + Theatre.js
**CommodityNode equivalent:** home hero `Impact Constellation`

### Pattern 2 — Analytical premium dashboard
**Reference type:** high-end observability / experimentation / quant surfaces
**Stack:** ECharts
**CommodityNode equivalent:** Intelligence Lab, Correlation, Simulator

### Pattern 3 — Regime / policy observability surface
**Reference type:** model monitoring + explainability console
**Stack:** ECharts + existing custom field layer
**CommodityNode equivalent:** RL Policy Lab

### Pattern 4 — Editorial scrollytelling explainer
**Reference type:** animated methodology / scenario explainer
**Stack:** GSAP + Theatre.js + selective charts
**CommodityNode equivalent:** methodology / flagship report longform

---

## 5. Practical execution order

### Phase 1 — Analytical stack upgrade first
1. Introduce ECharts on `/correlation/`
2. Upgrade `/simulator/` core decision visuals with ECharts
3. Upgrade `/intelligence-lab/` module comparison / categorization visuals

**Reason:** This yields the fastest user-perceived product upgrade.

### Phase 2 — Flagship 3D hero
4. Replace the current home ambient scene with a true `Impact Constellation`
5. Add Theatre.js-driven hero sequencing
6. Keep fallback poster / reduced-motion static mode

### Phase 3 — RL premium observability
7. Upgrade RL panels into a clearer regime / audit / baseline console
8. Use ECharts where it improves clarity over current custom/Chart.js panels

### Phase 4 — Methodology / narrative polish
9. Add one scrollytelling section only where it pays off most
10. Avoid spreading cinematic motion across the whole site

---

## 6. Non-negotiable constraints

- Do not put heavy 3D on every page.
- Do not let 3D compete with analytical clarity.
- Do not use neon / Web3-style spectacle as the default tone.
- Every flagship visual must answer a product question, not just look advanced.
- Every advanced chart must support mobile simplification and reduced-motion handling.

---

## 7. Immediate next build recommendation

**If implementing right now, do this order:**
1. ECharts migration on `/correlation/`
2. ECharts decision surface upgrade on `/simulator/`
3. Home hero `Impact Constellation` spec and prototype in Three.js
4. Theatre.js choreography pass for hero only

This gives CommodityNode the best balance of modern trend alignment, premium feel, and real product value.
