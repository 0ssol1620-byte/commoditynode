# CommodityNode Visual System

This document is the source-of-truth for chart taxonomy, motion rules,
3D scope, fallbacks, and color language. Every page on the site is
expected to follow it. If a new surface needs something outside this
system, update this file before shipping.

Last review: 2026-04-23 (top-tier masterplan P2).

---

## 1. Visual roles

Every visualization on the site belongs to exactly **one** of these four roles.
The role decides what library, motion budget, and fallback apply.

| Role | Purpose | Examples | Library |
|---|---|---|---|
| **Decision chart** | Fast judgement, single number or comparison | Range percentile, forecast fan, sector ribbon | Apache ECharts / custom SVG / Observable Plot |
| **Exploration chart** | Range/relationship inspection | Correlation heatmap, scenario scatter, small multiples | Apache ECharts |
| **Narrative visual** | Section-level storytelling that aids reading | Step ladder, explain diagram, mini timeline | CSS/SVG + Motion for React (future) |
| **Flagship 3D** | Brand signature, memorable demo layer | Home hero, commodity universe | Three.js (current) → React Three Fiber (future) |

Rules:
- Never put two Flagship 3D surfaces on the same route.
- Never put more than three major visualizations on a single page.
- Exploration charts must expose a data-provenance footer (source + updated_at + method).

---

## 2. Library assignments

These are the **only** libraries we reach for. Evaluate each proposal against this list;
reject additions unless the existing list can't meet the need.

| Library | When to use | When NOT to use |
|---|---|---|
| **ECharts** (preferred) | Heatmaps, sankey, treemap, graph, scatter, dynamic dashboards | Simple single-metric cards (use SVG) |
| **Observable Plot** | Report inline charts, explanatory comparisons, methodology figures | Heavy interactivity |
| **Custom SVG / Canvas** | Price-chart widget, decision meters, sparkline rails | General-purpose analytics |
| **Motion for React** | UI micro-interactions, card reorder, tab transitions | Narrative storytelling |
| **GSAP ScrollTrigger** | Flagship scrollytelling (home hero, methodology walkthrough, enterprise story) | Anything else — max 3 instances on the site |
| **Three.js / R3F** | Home hero universe, commodity universe showcase | Any non-flagship page |
| **deck.gl** | Real geographic data (disruption map, chokepoints, ports) | Decorative globes |

Version pinning: libraries land through `vendor-loader.html`'s conditional
loader, which only ships heavy deps on flagship pages.

---

## 3. Chart selection rules

When you need to visualize data, pick by intent:

| Intent | First choice | Second choice |
|---|---|---|
| Number comparison | Bar / dumbbell / ranked bars | Table |
| Time flow | Line / band / sparkline | Area |
| Distribution | Histogram / strip plot | Box plot |
| Relationship | Scatter + trend | Parallel coordinates |
| Network / flow | Force graph / sankey | Matrix |
| Spatial | Geo bubbles / route arcs | Choropleth (rare) |
| Sensitivity | Matrix / quadrant / ladder | Heatmap |
| Probability | Fan chart / probability band / scenario bars | Tornado |

Forbidden combinations:
- Three flagship visuals competing on one page.
- Mixing Motion ambient motion + Three.js scene + infinite scroll triggers
  inside a single section.
- Decorative motion inside report body (articles under `/reports/` or
  posts with `layout: post`).

---

## 4. Motion budget

| Interaction | Duration | Easing |
|---|---|---|
| Hover / selection | 150–250ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Layout change | 250–450ms | ease-out |
| Section reveal | 400–700ms | ease-out |
| Modal / panel | 220–320ms | ease-out |
| Scroll-linked flagship | ≤3 instances total | custom |

Tokens in `assets/css/tokens.css`:
- `--motion-fast`  = 160ms
- `--motion-base`  = 240ms
- `--motion-slow`  = 320ms

Never chain hover → expand → ambient loop on the same element.

---

## 5. `prefers-reduced-motion`

Implemented in `tokens.css` + `components.css`:

- All animations drop to 0.01ms.
- `#hero-canvas`, `#hero-impact-canvas`, `#universe-canvas`, and any
  element with `data-motion="ambient"` or `data-motion="parallax"` are hidden.
- `[data-scrolltrigger]` sections stop animating and keep static layout.

If a new visual needs reduced-motion treatment, tag it:
`data-motion="ambient"` / `data-motion="parallax"`.

---

## 6. Mobile rules

At `max-width: 720px`:
- `#hero-canvas` and `#hero-impact-canvas` are hidden — the hero must
  still read as a strong landing without ambient canvas.
- `#universe-canvas` collapses to a minimum-height placeholder; orbit
  info cards hide.
- Any `[data-viz="force-graph"]` is hidden; its sibling
  `[data-viz="force-graph-fallback"]` becomes visible and must carry
  the core information as a table or summary list.
- `[data-heavy-visual]` elements are hidden in favor of
  `[data-fallback="visual"]` siblings.

Charts that remain on mobile must:
- Be readable without hover (tap targets, inline legends).
- Degrade to a table when height collapses below ~200px.
- Keep axis labels at ≥11px.

---

## 7. Fallback discipline

Every interactive chart ships with one of the following fallbacks:

1. **Summary text block** — 1–2 sentences stating the punchline.
2. **Table** — accessible `<table>` with the same data.
3. **Static image** — only when JS or the data pipeline is unavailable.

Mark fallbacks with `[data-fallback="visual"]`. They are hidden when the
primary visual renders and shown when the page can't render the visual
(server-render, no-JS, reduced-motion, mobile narrow).

---

## 8. Color language

| Role | Token | Hex | Usage |
|---|---|---|---|
| Accent / live | `--accent` | `#22d3ee` | CTAs, live data, primary signals |
| Gold / reward | `--gold` | `#fbbf24` | Methodology, trust, premium |
| Red / warning | `--red` | `#f43f5e` | Disruptions, bearish |
| Green / positive | `--green` | `#10b981` | Bullish, confidence high |
| Purple / narrative | `--purple` | `#a855f7` | Enterprise, secondary emphasis |
| Muted | `--text2` / `--text3` | — | Body, footnotes |

Rules:
- Never use color as the only signal — always pair with text or shape.
- Never introduce a new accent color without updating tokens.css first.

---

## 9. Page budgets

| Page | Max major visuals | Max inline script KB | Flagship 3D? |
|---|---|---|---|
| `/` (home) | 3 | 40 | Yes (hero only, mobile fallback) |
| `/commodities/{slug}/` | 3 | 20 | No |
| `/reports/{slug}/` | 2 inline charts per 700w | 10 | No |
| `/pricing/`, `/pro/` | 1 | 10 | No |
| `/simulator/` | 3 (input, chart, attribution) | 40 | No |
| `/stress-test/` | 3 (inputs, waterfall, exposure) | 40 | No |
| `/intelligence-lab/` | 10 product cards, 1 flagship demo | 30 | No |

If a page needs more, remove something else. Budget is non-negotiable.

---

## 10. Change protocol

1. Propose the change in this file first — updating the tables above.
2. Add the new class/component to `assets/css/components.css` or a page
   stylesheet.
3. Ship the implementation with a screenshot + reduced-motion test +
   mobile test.
4. If the change adds a library, justify in §2.
