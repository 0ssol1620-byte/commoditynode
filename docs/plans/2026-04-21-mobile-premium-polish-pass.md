# CommodityNode Mobile Premium Polish Pass

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Upgrade homepage, Pricing, Intelligence Lab, and RL Policy Lab for mobile so the premium surfaces stay readable, tappable, and conversion-focused on small screens.

**Architecture:** Keep the current Jekyll + vanilla CSS/HTML structure, but add page-specific responsive overrides where density is highest. Focus on hierarchy, spacing, CTA sizing, table overflow handling, horizontal chip rows, and trust-panel readability rather than changing product structure.

**Tech Stack:** Jekyll, HTML, inline page CSS, `assets/css/style.css`, browser QA, JS syntax checks.

---

### Task 1: Audit mobile risk hotspots
- Review homepage hero, pricing hero, Intelligence Lab toolbar/compare table, and RL Policy Lab decision console for crowding, overflow, and touch-target risk.
- Confirm the main issues are spacing, stacked card order, table overflow, dense pill rows, and CTA sizing.

### Task 2: Add homepage mobile polish
- Tighten `assets/css/style.css` for hero trust strip, hero answer cards, product shelf, micro-links, and guided cards.
- Ensure CTA buttons go full-width earlier and card spacing stays premium on small screens.

### Task 3: Add Pricing mobile polish
- Expand the existing mobile media query in `pricing/index.html`.
- Improve hero actions, social proof strip, compare rows, saved workflow strip, proof cards, and lower CTA clusters so they stack cleanly without cramped text.

### Task 4: Add Intelligence Lab mobile polish
- In `intelligence-lab/index.html`, improve hero shell spacing, KPI grid, anchor row behavior, row cards, compare table overflow, and module CTA sizing.

### Task 5: Add RL Policy Lab mobile polish
- In `_layouts/intelligence-product.html`, improve hero CTA stacking, workflow strip, demo select width, RL pill rows, baseline table overflow, chart heights, field canvas area, and multi-panel evidence sections.

### Task 6: Validate and deploy
- Run `git diff --check`
- Run HTML parse checks for edited pages
- Run `node --check assets/js/main.js assets/js/intelligence-lab.js assets/js/intelligence-product.js`
- Browser-QA the four key pages after push with cache-busting.
