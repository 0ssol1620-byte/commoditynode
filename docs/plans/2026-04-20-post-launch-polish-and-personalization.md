# CommodityNode Post-Launch Polish and Personalization Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Close the highest-leverage post-launch gaps by adding saved-workflow personalization, stronger conversion proof, and mobile/UI polish across homepage-adjacent core pages.

**Architecture:** Reuse the existing local profile model in `assets/js/main.js` to power lightweight saved-workflow strips and dynamic recommendation text on pricing, simulator, commodity hubs, and report pages. Pair that with small, content-first HTML/CSS improvements on each page so the conversion path is clearer without changing the product promise.

**Tech Stack:** Jekyll/Liquid templates, vanilla JS, existing `CNProfile` localStorage model, static HTML/CSS.

---

### Task 1: Extend profile rendering helpers
- Add derived profile summary/recommendation helpers in `assets/js/main.js`
- Render new `data-profile-*` targets for events, recommendation copy, CTA labels, and freshness text
- Keep backwards compatibility with existing homepage profile surfaces

### Task 2: Add reusable saved-workflow strips to key templates
- Add personalized saved-workflow strip to `pricing/index.html`
- Add saved-workflow / next-step strip to `simulator/index.html`
- Add profile-aware next-step strip to `_layouts/commodity.html`
- Add profile-aware continuation strip to `_layouts/post.html`

### Task 3: Strengthen conversion proof and role relevance
- Improve pricing proof modules so they show clearer ROI / workflow-fit framing
- Add profile-aware recommendation copy on pricing and reports
- Make simulator watchlist messaging reflect the actual saved profile when present

### Task 4: Mobile/layout polish
- Add responsive stacking rules for the new strips and any remaining two-column quick-answer blocks touched during this pass
- Ensure buttons and CTA groups wrap cleanly on narrow screens

### Task 5: Validation and release
- Run syntax/parse checks
- Review `git diff --check`
- Commit only touched product files
- Push to `main`
- Verify live HTML/DOM markers and simulator datasets in browser
