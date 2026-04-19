# CommodityNode Post-Launch CRO Priorities

Goal: maximize paid conversion from the newly launched onboarding, workflow, report, hub, simulator, and pricing surfaces.

## North-star questions
1. Which entry pages create the most pricing intent?
2. Which surfaces create the most workflow completion intent?
3. Where do users drop before signup or checkout?
4. Which role/use-case pages create the highest quality visitors?
5. Does /start/ improve free-account and eventual Pro conversion versus direct modal signup?

## Priority 0 — instrumentation verification

### Must verify immediately
- `header_start_free`
- `header_start_free_mobile`
- `home_build_workflow`
- `home_compare_free_pro`
- `home_role_investor`
- `home_role_analyst`
- `home_role_operator`
- `home_energy_workflow`
- `home_battery_workflow`
- `home_agri_workflow`
- `home_actionable_setup_open`
- `home_actionable_setup_hub`
- `archive_best_current_setup`
- `archive_best_event_setup`
- `archive_wasde_playbook`
- `archive_fed_playbook`
- `report_open_live_hub`
- `report_model_the_move`
- `report_pro_finishes_workflow`
- `report_save_commodity_workflow`
- `report_save_watchlist_preview`
- `commodity_save_workflow`
- `commodity_save_exposed_names`
- `simulator_unlock_full_workflow`
- `simulator_save_current_workflow`
- `simulator_build_watchlist`
- `pricing_start_free_hero`
- `pricing_start_free`
- `pricing_start_pro`
- `pricing_build_workflow`
- `pricing_compare_tradingview`
- `pricing_compare_finance_news`
- `pricing_open_opec_playbook`
- `start_open_signup`
- `start_save_watchlist`
- `start_open_simulator`
- `start_open_reports`

### Add next if not already captured by backend/checkout
- `signup_start`
- `signup_complete`
- `checkout_start`
- `checkout_complete`
- `saved_role_selected`
- `saved_commodity_added`
- `saved_event_added`
- `saved_watchlist_added`
- `simulator_scenario_run`

## Priority 1 — measure funnel health for 7 days

### Core funnel cuts
1. Homepage → `/start/`
2. Homepage → `/simulator/`
3. Report → hub
4. Report → pricing
5. Commodity hub → simulator
6. Commodity hub → save workflow
7. Simulator → pricing
8. Pricing → checkout
9. `/start/` → signup start
10. `/start/` → simulator or reports

### Segment by landing source
- homepage
- report page
- commodity hub
- simulator
- pricing
- comparison page
- event playbook
- role/use-case page

### Segment by content cluster
- energy
- battery materials
- agriculture
- precious metals
- industrial metals

## Priority 2 — identify the strongest money pages

Rank by:
1. pricing clicks per 100 visits
2. signup starts per 100 visits
3. checkout starts per 100 visits
4. workflow-save actions per 100 visits
5. simulator usage per 100 visits

Expected likely winners:
- simulator
- live report pages with strong current moves
- event playbooks
- comparison pages with high buying intent

## Priority 3 — copy tests with highest upside

### Test set A — homepage CTA framing
Variant A:
- Build my workflow
Variant B:
- Start free and build my workflow
Variant C:
- See today’s setup and build my workflow

### Test set B — simulator upgrade framing
Variant A:
- Unlock the full decision workflow
Variant B:
- Unlock stock-level winners and losers
Variant C:
- Finish the decision before the repricing

### Test set C — pricing hero framing
Variant A:
- Intelligence that pays for itself
Variant B:
- Finish the decision before the repricing
Variant C:
- Turn commodity moves into decisions worth acting on

## Priority 4 — product hooks that improve retention and eventual paid conversion

Implement next in this order:
1. Visible saved-state confirmation on homepage, hub, and simulator
2. Lightweight “your saved workflow” strip on pricing and reports
3. Saved scenario presets per commodity
4. Email capture / account follow-up tied to saved workflow
5. Daily or weekly “your relevant setups” digest
6. Alert creation hooks for saved commodities and watchlist names

## Priority 5 — decision rules after first data window

### If `/start/` has high traffic but low signup start
- simplify onboarding copy
- add stronger “why this helps” proof above the fold
- reduce cognitive load in step sequence

### If reports drive pricing better than homepage
- route more homepage traffic into reports
- add more “best current setup” modules
- add more report-level named exposure teasers

### If simulator drives high pricing clicks but low checkout starts
- pricing message may still be too abstract
- add more simulator-to-pricing outcome proof
- show one clearer Pro example above checkout CTA

### If comparison pages attract traffic but weak conversion
- pages may be too SEO-oriented and not enough product-demo oriented
- add stronger “try the actual workflow now” blocks higher on page

## Executive summary

Immediate next move:
- verify event tracking and checkout events
- observe funnel for at least 7 days
- rank top entry pages by pricing intent and signup quality
- test simulator and pricing copy first
- build retention hooks only after the strongest conversion entry paths are confirmed
