# CommodityNode Event Tracking QA Checklist

Goal: verify that the new conversion and onboarding surfaces emit the right analytics events in the right places.

How to use:
1. Open the page.
2. Trigger the action.
3. Confirm the expected `data-cta` / event label fires.
4. Record pass/fail.

Assumption:
- Frontend click tracking uses `gtag('event', 'cta_click', { event_label: <data-cta>, page_path: ... })`
- Signup / checkout completion events may require separate backend or checkout instrumentation.

## 1. Header / global navigation

### Homepage header
Page:
- `/`

Checks:
- Click header Start Free
  - Expected destination: `/start/`
  - Expected event_label: `header_start_free`
- Click header Sign In
  - Expected behavior: Clerk sign-in modal opens
  - Expected event_label: `header_sign_in`

### Mobile header
Pages:
- `/`
- `/pricing/`
- `/simulator/`

Checks:
- Click mobile Start Free
  - Expected destination: `/start/`
  - Expected event_label: `header_start_free_mobile`
- Click mobile Sign In
  - Expected behavior: Clerk sign-in modal opens
  - Expected event_label: `header_sign_in_mobile`

## 2. Homepage

Page:
- `/`

Checks:
- Click Open today’s reports
  - event_label: `home_open_todays_reports`
- Click Go straight to simulator
  - event_label: `home_go_straight_simulator`
- Click actionable setup primary CTA
  - event_label: `home_actionable_setup_open`
- Click actionable setup hub CTA
  - event_label: `home_actionable_setup_hub`
- Click Build my workflow
  - event_label: `home_build_workflow`
- Click Compare Free vs Pro
  - event_label: `home_compare_free_pro`
- Click Self-directed investors card
  - event_label: `home_role_investor`
- Click Equity analysts card
  - event_label: `home_role_analyst`
- Click Operators/procurement card
  - event_label: `home_role_operator`
- Click Energy workflow card
  - event_label: `home_energy_workflow`
- Click Battery materials workflow card
  - event_label: `home_battery_workflow`
- Click Agriculture workflow card
  - event_label: `home_agri_workflow`

## 3. Start / onboarding page

Page:
- `/start/`

Checks:
- Click Continue with free account
  - event_label: `start_open_signup`
  - expected behavior: signup flow opens
- Click Compare Free vs Pro
  - event_label: `start_compare_plans`
- Click Save watchlist
  - event_label: `start_save_watchlist`
- Click Open simulator
  - event_label: `start_open_simulator`
- Click Open live setups
  - event_label: `start_open_reports`

Recommended additional instrumentation to add if missing:
- role selected
  - `saved_role_selected`
- commodity added
  - `saved_commodity_added`
- event added
  - `saved_event_added`
- watchlist saved
  - `saved_watchlist_added`
- signup completed
  - `signup_complete`

## 4. Reports archive

Page:
- `/reports/`

Checks:
- Click Open live setup in Best current setup
  - event_label: `archive_best_current_setup`
- Click Model this move in Best current setup
  - event_label: `archive_best_current_setup_simulator`
- Click See Pro workflow
  - event_label: `archive_pro_workflow_context`
- Click Best event setup card
  - event_label: `archive_best_event_setup`
- Click WASDE playbook card
  - event_label: `archive_wasde_playbook`
- Click Fed playbook card
  - event_label: `archive_fed_playbook`
- Click search input and type
  - event_label: `archive_search_input`
- Click Open live signals
  - event_label: `archive_open_signals`
- Click Jump to commodity hubs
  - event_label: `archive_jump_hubs`
- Click See Pro workflow in shortcuts
  - event_label: `archive_see_pricing`

## 5. Report detail page

Representative page:
- `/lithium-breaks-lower-even-as-models-stay-higher/`

Checks:
- Click Open live hub
  - event_label: `report_open_live_hub`
- Click Model the move
  - event_label: `report_model_the_move`
- Click See how Pro finishes the workflow
  - event_label: `report_pro_finishes_workflow`
- Click Save commodity workflow
  - event_label: `report_save_commodity_workflow`
- Click Save named exposure
  - event_label: `report_save_watchlist_preview`

Recommended additional instrumentation:
- if user clicks sign up free text CTA
  - add explicit `report_start_free`

## 6. Commodity hub

Representative page:
- `/commodities/lithium/`

Checks:
- Click Follow this commodity
  - event_label: `commodity_save_workflow`
- Click Save exposed names
  - event_label: `commodity_save_exposed_names`

Recommended additions if not already present:
- Open Scenario Simulator CTA from hub
  - `commodity_open_simulator`
- Unlock Pro CTA from hub
  - `commodity_open_pricing`
- Related report click
  - `commodity_open_report`

## 7. Simulator

Page:
- `/simulator/`

Checks:
- Click Unlock the full decision workflow
  - event_label: `simulator_unlock_full_workflow`
- Click Save this workflow
  - event_label: `simulator_save_current_workflow`
- Click Build watchlist
  - event_label: `simulator_build_watchlist`

Recommended additional instrumentation to add:
- scenario preset click
  - `simulator_preset_supply_cut`
  - `simulator_preset_demand_surge`
  - `simulator_preset_recession`
- geopolitical toggle on/off
  - `simulator_toggle_scenario`
- share link click
  - `simulator_copy_share_link`
- commodity selected
  - `simulator_select_commodity`
- period changed
  - `simulator_change_period`
- scenario actually run / changed
  - `simulator_scenario_run`
- 90-day unlock click
  - `simulator_unlock_90d`

## 8. Pricing

Page:
- `/pricing/`

Checks:
- Click hero Start Free
  - event_label: `pricing_start_free_hero`
  - expected destination: `/start/`
- Click plan Start Free
  - event_label: `pricing_start_free`
  - expected destination/behavior: onboarding flow
- Click Start Pro
  - event_label: `pricing_start_pro`
  - expected destination: LemonSqueezy checkout
- Click Talk to Sales
  - event_label: `pricing_talk_sales`
- Click Compare TradingView
  - event_label: `pricing_compare_tradingview`
- Click Compare finance news
  - event_label: `pricing_compare_finance_news`
- Click OPEC playbook
  - event_label: `pricing_open_opec_playbook`
- Click Build my workflow
  - event_label: `pricing_build_workflow`

Recommended additions:
- FAQ expand events
  - `pricing_faq_expand_<slug>`
- annual billing toggle
  - `pricing_toggle_annual`
- monthly billing toggle
  - `pricing_toggle_monthly`
- cost-of-missing CTA
  - `pricing_cost_section_start_pro`

## 9. Use-case / workflow / comparison pages

Pages:
- `/for-self-directed-investors/`
- `/for-equity-analysts/`
- `/for-operators-and-procurement/`
- `/energy-workflow/`
- `/battery-materials-workflow/`
- `/agriculture-margin-workflow/`
- `/before-wasde-grains-playbook/`
- `/before-fed-metals-playbook/`
- `/commoditynode-vs-generic-ai-market-summary/`
- `/commoditynode-vs-bloomberg-self-directed/`

Minimum checks:
- primary CTA click
- secondary CTA click
- Build my workflow click
- See Pro workflow click

Recommended naming convention:
- `usecase_<slug>_primary_cta`
- `usecase_<slug>_secondary_cta`
- `usecase_<slug>_build_workflow`
- `usecase_<slug>_open_pricing`

## 10. Conversion completion events

These must be confirmed outside simple frontend click QA if they come from backend / checkout tools.

Required events:
- `signup_start`
- `signup_complete`
- `checkout_start`
- `checkout_complete`

Verification method:
- complete a test signup
- start a checkout session
- confirm events appear in GA4 / analytics debug view / warehouse logs

## 11. Pass/fail sheet template

Use this format per check:
- Page:
- Action:
- Expected event_label:
- Expected destination/behavior:
- Actual result:
- Pass/Fail:
- Notes:

## 12. Highest-priority QA run order

Run in this order:
1. Header Start Free
2. Homepage Build my workflow
3. `/start/` Continue with free account
4. Homepage → simulator
5. Report → hub
6. Hub → save workflow
7. Simulator → pricing
8. Pricing → Start Pro
9. Pricing → Start Free
10. signup_start / signup_complete / checkout_start / checkout_complete verification

## 13. Success criteria

Tracking is ready when:
- every major CTA has a deterministic event label
- start-free routes are consistent
- pricing CTAs reach the right destination
- simulator upgrade actions are tracked
- report/hub workflow-save actions are tracked
- signup and checkout completion can be reconciled against click data
