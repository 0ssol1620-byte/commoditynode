# CommodityNode Missing Events Implementation Spec

Goal: fill the current analytics gap between CTA clicks and true business outcomes.

Primary gaps identified from live QA:
1. signup_start / signup_complete are not yet verified end-to-end
2. checkout_start / checkout_complete are not yet verified end-to-end
3. onboarding save actions need semantic events beyond generic CTA clicks
4. simulator usage needs granular product interaction events
5. pricing FAQ usage should be measurable

Implementation priority:
P0 = revenue truth
P1 = onboarding truth
P2 = simulator usage truth
P3 = objection handling truth

--------------------------------------------------
P0. Revenue-truth events
--------------------------------------------------

Required events:
- signup_start
- signup_complete
- checkout_start
- checkout_complete

1) signup_start

Where to fire:
- assets/js/clerk-auth.js
- start/index.html

Definition:
- fire when user opens sign-up flow intentionally
- do not fire on page load
- do fire from /start/ continue button and any future direct signup triggers

Implementation approach:
A. Add a helper in assets/js/main.js or assets/js/clerk-auth.js:

function cnTrack(eventName, props) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, Object.assign({
      page_path: window.location.pathname
    }, props || {}));
  }
}

B. In start/index.html, inside the click handler for #start-open-signup:
- before calling Clerk.openSignUp(), fire:
  cnTrack('signup_start', {
    source: 'start_page',
    role: profile.role || '',
    saved_commodities: (profile.commodities || []).join(','),
    saved_watchlist_count: (profile.watchlist || []).length,
    saved_events: (profile.events || []).join(',')
  })

C. In assets/js/clerk-auth.js, for any fallback direct signup trigger:
- fire signup_start with source field

Recommended properties:
- source: start_page | header | pricing | modal_fallback
- role
- saved_commodities
- saved_watchlist_count
- saved_events

2) signup_complete

Where to fire:
- assets/js/clerk-auth.js

Definition:
- fire once when a previously anonymous user becomes authenticated after signup
- do not fire on every returning login

Implementation approach:
A. Use Clerk listener after load:
- when user exists and a session is established
- compare against local/session storage key to avoid duplicate fire

Suggested logic:
- if localStorage.getItem('cn_signup_started') exists
- and localStorage.getItem('cn_signup_complete_tracked') is not current session id/user id
- then fire signup_complete

Recommended event payload:
cnTrack('signup_complete', {
  source: localStorage.getItem('cn_signup_source') || 'unknown',
  role: profile.role || '',
  saved_commodities_count: (profile.commodities || []).length,
  saved_watchlist_count: (profile.watchlist || []).length,
  saved_events_count: (profile.events || []).length,
  plan_hint: (user.publicMetadata && user.publicMetadata.plan) || 'free'
})

Also set:
- localStorage.removeItem('cn_signup_started')
- localStorage.removeItem('cn_signup_source')

3) checkout_start

Where to fire:
- pricing/index.html
- any direct Pro CTA surface if present elsewhere later

Definition:
- fire immediately before navigating to LemonSqueezy checkout

Current affected CTA surfaces:
- pricing_start_pro
- cost section Start Pro CTA
- any future direct Pro buy link

Implementation approach:
A. Replace raw anchor navigation on major Pro CTAs with a tiny click wrapper:
- preventDefault
- fire checkout_start
- then window.location.href = checkout_url after a short timeout or requestIdleCallback

Recommended payload:
cnTrack('checkout_start', {
  source: 'pricing_page',
  billing_mode: currentBillingMode(),
  plan: 'pro',
  role: profile.role || '',
  saved_commodities_count: (profile.commodities || []).length,
  saved_watchlist_count: (profile.watchlist || []).length
})

Also recommended:
- include cta_label: pricing_start_pro | pricing_cost_section_start_pro | etc.

4) checkout_complete

Where to fire:
- best practice: backend/webhook or post-checkout return page

Preferred implementation:
A. LemonSqueezy webhook -> serverless endpoint
- on successful order/subscription creation
- forward normalized event into GA4 / data warehouse

If webhook infrastructure exists:
- implement in API route or serverless function
- emit checkout_complete with transaction metadata

Recommended payload:
- order_id
- customer_id or hashed email
- plan
- billing_mode
- amount
- currency
- source if passed through checkout custom data

If webhook is not yet available:
B. Create a thank-you/confirmed page and redirect after checkout
- e.g. /checkout/success/
- fire checkout_complete there
- still weaker than webhook, but useful as interim signal

--------------------------------------------------
P1. Onboarding-truth events
--------------------------------------------------

Required events:
- saved_role_selected
- saved_commodity_added
- saved_event_added
- saved_watchlist_added

Where to implement:
- assets/js/main.js
- start/index.html

Current state:
- only generic CTA events fire
- profile data does save locally

5) saved_role_selected

Fire when:
- user clicks any role button on /start/

Payload:
cnTrack('saved_role_selected', {
  role: selectedRole,
  source: 'start_page'
})

6) saved_commodity_added

Fire when:
- a commodity is added from /start/
- optionally also when added from simulator or commodity hub

Payload:
cnTrack('saved_commodity_added', {
  commodity: selectedCommodity,
  source: 'start_page' // or simulator / commodity_hub
})

7) saved_event_added

Fire when:
- OPEC / WASDE / Fed / Geopolitics added from /start/

Payload:
cnTrack('saved_event_added', {
  event_name: selectedEvent,
  source: 'start_page'
})

8) saved_watchlist_added

Fire when:
- watchlist is saved successfully from /start/
- optionally also when exposure names are saved from report/hub

Payload:
cnTrack('saved_watchlist_added', {
  source: 'start_page',
  count: values.length,
  names: values.slice(0, 10).join(',')
})

Note:
- if privacy concerns matter, send count only and not names
- recommended production-safe default: count only

--------------------------------------------------
P2. Simulator usage-truth events
--------------------------------------------------

Required events:
- simulator_select_commodity
- simulator_change_period
- simulator_preset_supply_cut
- simulator_preset_demand_surge
- simulator_preset_recession
- simulator_toggle_scenario
- simulator_copy_share_link
- simulator_scenario_run
- simulator_unlock_90d

Where to implement:
- simulator/index.html

9) simulator_select_commodity

Current function:
- selectCommodity(key)

Add:
cnTrack('simulator_select_commodity', {
  commodity: key,
  source: 'simulator_page'
})

Fire only when commodity changes.

10) simulator_change_period

Current function:
- setPeriod(p, btn)

Add:
cnTrack('simulator_change_period', {
  period: p,
  commodity: state.commodity
})

11) simulator preset events

Current function:
- applyPreset(type)

Add:
if (type === 'supply_cut') cnTrack('simulator_preset_supply_cut', { commodity: state.commodity })
if (type === 'demand_surge') cnTrack('simulator_preset_demand_surge', { commodity: state.commodity })
if (type === 'recession') cnTrack('simulator_preset_recession', { commodity: state.commodity })

12) simulator_toggle_scenario

Current function:
- toggleScenario(id, impact)

Add:
cnTrack('simulator_toggle_scenario', {
  commodity: state.commodity,
  scenario_id: id,
  active: !!state.scenarios[id]
})

13) simulator_copy_share_link

Current function:
- copySimulatorShareLink()

Add:
cnTrack('simulator_copy_share_link', {
  commodity: state.commodity,
  period: state.period,
  active_scenarios: Object.keys(state.scenarios || {}).join(',')
})

14) simulator_scenario_run

Definition:
- fire when scenario state materially changes and a re-render occurs

Best practical implementation:
- inside applyPreset()
- inside toggleScenario()

Payload:
cnTrack('simulator_scenario_run', {
  commodity: state.commodity,
  period: state.period,
  scenario_count: Object.keys(state.scenarios || {}).length,
  total_adjustment: calcScenarioAdjustment()
})

15) simulator_unlock_90d

Current visible link:
- Unlock 90-Day →

Add data-cta if not already
- data-cta="simulator_unlock_90d"

Also add semantic event:
cnTrack('simulator_unlock_90d', {
  commodity: state.commodity,
  period: state.period
})

--------------------------------------------------
P3. Pricing objection-truth events
--------------------------------------------------

Required events:
- pricing_faq_expand_tradingview
- pricing_faq_expand_news
- pricing_faq_expand_pro_useful
- pricing_toggle_monthly
- pricing_toggle_annual
- pricing_cost_section_start_pro

Where to implement:
- pricing/index.html

16) FAQ expand events

Implementation:
- add data-faq-key attributes on details blocks
- listen for toggle event
- if details.open === true, fire one event

Example keys:
- tradingview_diff
- news_diff
- pro_useful
- free_vs_pro
n
Example payload:
cnTrack('pricing_faq_expand', {
  faq_key: 'tradingview_diff'
})

If explicit event names preferred:
- pricing_faq_expand_tradingview
- pricing_faq_expand_news
- pricing_faq_expand_pro_useful

17) Billing toggle events

Current function:
- setBilling(mode, btn)

Add:
if (mode === 'annual') cnTrack('pricing_toggle_annual', { page_path: window.location.pathname })
if (mode === 'monthly') cnTrack('pricing_toggle_monthly', { page_path: window.location.pathname })

18) Cost section Start Pro CTA

Current CTA in pricing page cost section should get:
- data-cta="pricing_cost_section_start_pro"
- semantic checkout_start payload should include cta_label

--------------------------------------------------
Shared helper recommendation
--------------------------------------------------

Best implementation move:
- centralize tracking helper in assets/js/main.js
- expose as window.CNTrack

Recommended helper:

window.CNTrack = function(eventName, props) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, Object.assign({
    page_path: window.location.pathname,
    page_title: document.title
  }, props || {}));
};

Then all pages use:
- window.CNTrack('signup_start', {...})
- window.CNTrack('saved_role_selected', {...})
- etc.

This keeps event naming consistent.

--------------------------------------------------
Files to modify
--------------------------------------------------

1. assets/js/main.js
- add shared CNTrack helper
- optionally add profile helper event wrappers

2. assets/js/clerk-auth.js
- track signup_start fallback flows
- track signup_complete on auth state transition

3. start/index.html
- track onboarding semantic events
- persist signup_start metadata before opening Clerk sign-up

4. simulator/index.html
- track simulator granular usage events
- add simulator_unlock_90d semantic tracking

5. pricing/index.html
- track billing toggle events
- track FAQ expand events
- track checkout_start on actual Pro CTAs
- add pricing_cost_section_start_pro

6. optional backend / webhook endpoint
- track checkout_complete robustly from LemonSqueezy webhook

--------------------------------------------------
Verification checklist after implementation
--------------------------------------------------

Must pass:
- signup_start fires from /start/
- signup_complete fires once after successful signup
- checkout_start fires on Pro checkout click
- checkout_complete visible in analytics from webhook or success page
- saved_role_selected fires with role payload
- saved_commodity_added fires with commodity payload
- saved_event_added fires with event payload
- saved_watchlist_added fires with count payload
- simulator_select_commodity fires on commodity change
- simulator_change_period fires on 3M/6M/1Y switch
- simulator_scenario_run fires on preset/toggle actions
- pricing_faq_expand events fire on relevant objections

--------------------------------------------------
Recommended implementation order
--------------------------------------------------

1. assets/js/main.js
- add CNTrack helper

2. start/index.html
- add onboarding semantic events
- add signup_start metadata persistence

3. assets/js/clerk-auth.js
- add signup_complete logic

4. pricing/index.html
- add checkout_start + FAQ + billing toggle events

5. simulator/index.html
- add granular simulator events

6. webhook / success-page path
- add checkout_complete

Final outcome:
- clear visibility into the full path from landing page → onboarding → usage → pricing → checkout
- ability to distinguish curiosity clicks from real product activation and revenue intent
