# CommodityNode Intelligence Lab Master Plan

> For Hermes: use subagent-driven-development skill to implement this plan task-by-task.

Goal: turn the previously proposed monetizable ideas into a shipped, user-facing Intelligence Lab experience that introduces 10 premium decision-support products on top of CommodityNode’s existing forecast, hub, and simulator surfaces.

Architecture:
- Add one flagship hub page, `/intelligence-lab/`, that contains all 10 products as premium modules with live data-driven visualizations and product-level monetization framing.
- Reuse current live market data from `assets/data/prices.json` and `assets/data/forecast-consensus.json`, plus a new curated product metadata dataset for events, exposed names, hedge candidates, and policy actions.
- Integrate the new hub into the global nav, homepage, pricing, and simulator so the products are discoverable and commercially legible.

Products included:
1. Event Probability Studio
2. Ripple Ranker
3. Exposure Screener
4. Portfolio Stress Test
5. Hedge Optimizer
6. Forecast Explainability Studio
7. Regime Shift Detector
8. Anomaly Monitor
9. Event Study Library
10. RL Policy Lab

Core implementation tasks:
1. Create shared curated dataset for commodity events, exposed names, sectors, hedge candidates, event studies, and RL actions
2. Build `/intelligence-lab/` with hero, monetization framing, module nav, premium cards, and 10 interactive sections
3. Add reusable JS that loads prices + forecast-consensus and powers all module visualizations from a single commodity selector
4. Add nav entry under More + homepage discovery block + pricing upsell block + simulator CTA into Intelligence Lab
5. Validate HTML/JS, review, deploy, and live-QA markers for all modules

Validation:
- `node --check` for any new JS file or inline extracted script if needed
- HTML parse check for touched pages
- `git diff --check`
- browser/live QA on `/intelligence-lab/`, homepage, pricing, simulator
