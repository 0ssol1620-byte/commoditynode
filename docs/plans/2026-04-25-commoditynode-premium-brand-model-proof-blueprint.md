# CommodityNode Premium Brand + Model Proof Blueprint

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task after the user approves execution.

**Goal:** Upgrade CommodityNode into a top-tier, paid-grade commodity decision engine brand by connecting live news catalysts, time-series forecasts, RL policy actions, sector/stock impact, and timestamped proof of past model calls across the full website.

**Architecture:** Do not treat this as a single page redesign. Build a sitewide narrative and data system: (1) model-story layer, (2) model-call snapshot archive, (3) outcome tracker, (4) report/hub/pricing/homepage CRO surfaces, and (5) premium visual trust layer. The product promise is strong and conversion-oriented, but every claim must be timestamped, replay/historical scoped, and backed by site data so it feels institutional rather than scammy.

**Tech Stack:** Jekyll/Liquid, plain HTML/CSS/JS, existing static JSON data under `assets/data/`, existing forecast artifacts, `rl-policy-lab.json`, report posts under `_posts/`, commodity hubs under `_commodities/`, Python scripts for data refresh/outcome tracking, existing tests under `tests/`, Playwright/browser live QA.

---

## 0. North Star Positioning

### Master brand sentence

```text
CommodityNode turns live commodity catalysts into forecast ranges, RL policy actions, and stock-level decision workflows.
```

### More aggressive conversion sentence

```text
News tells you what changed. Forecasts estimate where the price path may go. RL policy decides which action is most defensible. CommodityNode connects all three before the market reprices the downstream names.
```

### Korean internal framing

```text
뉴스는 촉매를 만들고, 시계열 모델은 가격 경로를 계산하며, RL 정책은 그 상태에서 어떤 행동이 가장 방어 가능한지 선택한다. CommodityNode는 이 흐름을 섹터/종목 영향까지 연결하는 유료 의사결정 엔진이다.
```

### Product promise hierarchy

1. **Free:** Understand the move.
2. **Pro:** Finish the decision.
3. **Enterprise:** Operationalize the workflow across a desk.

### What we are not

- Not a generic commodity price site.
- Not a generic finance news site.
- Not a toy AI dashboard.
- Not a “guaranteed trading win-rate” product.

### What we are

- A commodity-to-position decision engine.
- A news + forecast + RL + impact workflow.
- A timestamped model-call archive that proves the process over time.

---

## 1. The Sitewide Story System

Every major CommodityNode surface should answer the same five questions:

```text
1. What changed in the market?              → News catalyst / price shock
2. Where may price go next?                 → Time-series forecast layer
3. What action is most defensible?          → RL policy layer
4. Who/what is exposed downstream?          → Sector/stock impact layer
5. Did the model's prior calls play out?    → Proof/outcome layer
```

This becomes the repeated product grammar across homepage, reports, hubs, simulator, pricing, and RL Policy Lab.

---

## 2. Claims Policy: Strong Marketing Without Dangerous Overclaiming

### Allowed strong claims

Use these aggressively:

```text
Timestamped model calls
Replay-backed policy selection
Walk-forward checked
Passive hold baseline comparison
Forecast agreement and disagreement
RL action layer
Historical replay hit rate
Policy target-match
Reward uplift vs hold
Regime-aware profile governance
```

### Disallowed claims

Do not use:

```text
91% live trading win rate
Guaranteed 90% accuracy
This predicts the market with certainty
Win 9 out of 10 trades
Autonomous profit engine
```

### Safer high-conversion alternatives

```text
91% replay target-match in the selected profile
100% positive walk-forward windows in the active replay profile
+10.88 reward uplift versus passive hold in replay
Selected by governance scoring, not hand-picked marketing output
Timestamped call later moved in the forecast direction
```

### Mandatory claim scope near proof numbers

For any `90%`, `91%`, `100%`, `+10.88`, `+3.98`, or similar proof number, place one of these nearby:

```text
Historical replay metric, not a live trading guarantee.
Backtest/replay only; excludes future regime shifts and live execution effects.
Timestamped model-call outcome; not financial advice.
```

This should be visually small but legible, not buried only in the footer.

---

## 3. Data Architecture Blueprint

### 3.1 Existing data sources to reuse

- `assets/data/prices.json`
  - live/latest commodity prices and daily changes
- `assets/data/chart-data.json` and `assets/data/chart-data/*.json`
  - historical prices for outcome tracking
- `assets/data/forecast.json`
  - time-series forecast output
- `assets/data/forecast-consensus.json`
  - Chronos/TimesFM/consensus/agreement layer
- `assets/data/rl-policy-lab.json`
  - active RL profile, replay summary, walk-forward, policy frontier
- `_posts/*.md`
  - timestamped editorial reports and market catalysts
- `_commodities/*.md`
  - hub metadata and routing

### 3.2 New static artifact: model call snapshots

Create:

```text
assets/data/model-call-snapshots.json
```

Purpose:
Capture what CommodityNode believed at a point in time, before future outcome is known.

Suggested schema:

```json
{
  "generated_at": "2026-04-25T12:15:00+09:00",
  "version": 1,
  "calls": [
    {
      "id": "2026-04-25-crude-oil-opec-risk",
      "created_at": "2026-04-25T09:00:00+09:00",
      "commodity_key": "crude_oil",
      "commodity_name": "Crude Oil",
      "report_url": "/crude-oil-opec-supply-risk/",
      "price_at_call": 83.42,
      "price_unit": "$/barrel",
      "price_change_pct_at_call": 3.2,
      "news_catalysts": [
        "OPEC supply-risk headline",
        "refining margin split",
        "Middle East risk premium"
      ],
      "forecast": {
        "direction": "bullish",
        "forecast_30d": 86.9,
        "forecast_90d": 91.2,
        "agreement_level": "medium-high",
        "agreement_score": 0.72,
        "chronos2_90d": 90.5,
        "timesfm_90d": 92.0
      },
      "rl_policy": {
        "action": "Add Continuation",
        "probability": 0.31,
        "top_alternative": "Add Hedge",
        "top_alternative_probability": 0.30,
        "policy_entropy": 0.66,
        "profile_score": 10.948,
        "replay_target_match": 0.9118,
        "walk_positive_rate": 1.0
      },
      "impact": {
        "primary_sectors": ["Energy", "Airlines", "Refiners"],
        "watchlist_examples": ["XOM", "CVX", "DAL", "VLO"]
      },
      "status": "pending_outcome"
    }
  ]
}
```

### 3.3 New static artifact: model call outcomes

Create:

```text
assets/data/model-call-outcomes.json
```

Purpose:
Attach actual 7D/14D/30D outcomes to prior snapshots.

Suggested schema:

```json
{
  "generated_at": "2026-04-25T12:15:00+09:00",
  "version": 1,
  "outcomes": [
    {
      "call_id": "2026-04-12-gold-central-bank-bid",
      "commodity_key": "gold",
      "price_at_call": 2380.2,
      "actual": {
        "7d": {
          "price": 2428.1,
          "return_pct": 2.01,
          "direction_correct": true,
          "max_drawdown_pct": -0.8
        },
        "14d": {
          "price": 2494.4,
          "return_pct": 4.80,
          "direction_correct": true,
          "max_drawdown_pct": -1.2
        },
        "30d": null
      },
      "outcome_label": "Forecast direction confirmed",
      "proof_copy": "Gold moved +4.8% over 14D after a bullish forecast and Add Continuation policy call.",
      "claim_scope": "Timestamped model call; historical outcome, not a future guarantee."
    }
  ]
}
```

### 3.4 New script: snapshot generator

Create:

```text
scripts/build_model_call_snapshots.py
```

Inputs:

- `assets/data/prices.json`
- `assets/data/forecast-consensus.json`
- `assets/data/rl-policy-lab.json`
- latest `_posts/*.md`

Outputs:

- `assets/data/model-call-snapshots.json`

Responsibilities:

1. Select recent posts with `commodity_name`.
2. Match post commodity to price/forecast/RL context.
3. Extract post title, permalink, date, and catalyst summary.
4. Store timestamped model state.
5. Never overwrite an existing call ID unless explicitly refreshing same-day pending data.

### 3.5 New script: outcome tracker

Create:

```text
scripts/update_model_call_outcomes.py
```

Inputs:

- `assets/data/model-call-snapshots.json`
- `assets/data/chart-data/*.json`
- `assets/data/prices.json`

Outputs:

- `assets/data/model-call-outcomes.json`

Responsibilities:

1. For every call older than 7/14/30 days, find actual price after each horizon.
2. Calculate return pct.
3. Calculate direction correctness based on forecast direction.
4. Calculate max adverse move / drawdown after call.
5. Attach outcome labels.
6. Keep pending horizons as `null`.

### 3.6 New optional data artifact: catalyst map

Create later if needed:

```text
assets/data/news-catalysts.json
```

Purpose:
Normalize latest news catalysts by commodity so homepage/hubs/reports can reuse them.

Suggested schema:

```json
{
  "generated_at": "2026-04-25T12:15:00+09:00",
  "catalysts": {
    "crude_oil": [
      {
        "headline": "OPEC supply-risk premium returns to crude",
        "source": "Reuters / RSS / manual",
        "published_at": "2026-04-25T08:00:00+09:00",
        "url": "https://...",
        "summary": "Supply risk lifted front-month crude while refinery margins stayed split.",
        "model_reaction": "Forecast path firmed; RL kept continuation and hedge nearly tied."
      }
    ]
  }
}
```

---

## 4. Site Surface Blueprint

## 4.1 Homepage

### Goal
Make a new visitor understand in one scroll that CommodityNode is a premium decision engine, not a data directory.

### New homepage narrative block

Add directly after the live-intelligence / actionable setup area:

```text
From catalyst to policy action
News explains what changed. Forecasts estimate where the path may go. RL policy decides which action is most defensible. CommodityNode connects the full chain.
```

### Three-layer card stack

```text
1. Forecast the path
30D/90D ranges, model agreement, forecast split, and trend direction.

2. Rank the policy action
RL policy converts volatility, event risk, spreads, and model disagreement into hold, hedge, reduce, continue, or rotate.

3. Translate the exposure
Scenario tools map commodity shocks into sectors, stocks, and watchlist risk.
```

### Proof block

Add:

```text
Recent model calls that played out
```

Card example:

```text
Gold
Bullish forecast + Add Continuation
Outcome: +4.8% after 14D
Status: Direction confirmed
Scope: Timestamped historical call, not a guarantee.
```

### CTA copy

Primary CTA:

```text
See today’s model calls
```

Secondary CTA:

```text
Run a live scenario
```

### Files likely to change

- `index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/data/model-call-outcomes.json`

### Acceptance criteria

- Homepage states the `news → forecast → RL → impact` workflow clearly.
- It surfaces at least 2–3 proof cards from `model-call-outcomes.json` when available.
- If proof data is unavailable, it shows a high-quality pending state, not fake examples.
- CTA labels match actual destinations.

---

## 4.2 Reports Archive `/reports/`

### Goal
Turn the archive into a live model-call decision shelf.

### Add top bands

1. `Today's live catalysts`
2. `Biggest forecast/model split right now`
3. `Recent calls with outcomes`

### Report card upgrade

Each report card should show:

```text
Commodity move
News catalyst
Forecast readout
RL action
Pro workflow CTA
```

Example:

```text
Natural Gas -5.4%
Catalyst: storage/weather repricing
Forecast: 30D bearish, 90D split
RL: Add Hedge over Reduce Risk
CTA: Model the gas shock
```

### Files likely to change

- `reports/index.html`
- `assets/css/style.css`
- `assets/js/main.js`

### Acceptance criteria

- Reports page feels current and model-driven, not chronological only.
- It creates direct paths to report, hub, simulator, and pricing.
- It uses live JSON data where possible.

---

## 4.3 Report Detail Template `_layouts/post.html`

### Goal
Make every news/report page become a conversion workflow.

### Add `Model Readout` block near top

Suggested structure:

```html
<section class="post-model-readout">
  <p class="eyebrow">CommodityNode model readout</p>
  <h2>News catalyst → forecast path → RL policy action</h2>
  <div class="model-readout-grid">
    <article>
      <span>News catalyst</span>
      <strong>{{ catalyst summary }}</strong>
    </article>
    <article>
      <span>Forecast layer</span>
      <strong>30D {{ direction }} · agreement {{ level }}</strong>
    </article>
    <article>
      <span>RL policy</span>
      <strong>{{ action }} · top alternative {{ alternative }}</strong>
    </article>
    <article>
      <span>Decision implication</span>
      <strong>Use Pro to translate this setup into named exposure.</strong>
    </article>
  </div>
</section>
```

### Add `Track this call` block

```text
This report generated a timestamped model snapshot. CommodityNode will compare the call against the 7D, 14D, and 30D price path when outcomes are available.
```

If outcome exists:

```text
Outcome update
Forecast direction: confirmed
Actual 14D move: +4.8%
RL action: positive versus passive hold in replay context
```

### CTA copy

```text
Open live hub
Model this move
See how Pro finishes the workflow
```

### Files likely to change

- `_layouts/post.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `tests/test_post_model_readout.py` or existing relevant tests

### Acceptance criteria

- Every report clearly includes news catalyst, forecast layer, RL layer, and decision implication.
- Past reports with outcomes show proof; fresh reports show pending tracking.
- No fake outcome is shown before data exists.

---

## 4.4 Commodity Hub Template `_layouts/commodity.html`

### Goal
Make hubs feel like live commodity command centers.

### Add `Latest catalyst + model reaction` card

```text
Latest catalyst
{{ newest related report/catalyst }}

Model reaction
Forecast stack: {{ 30D/90D direction and agreement }}
RL policy: {{ action }} with {{ top alternative }} as the closest competitor

Decision implication
{{ one sentence tying the commodity move to sectors/stocks }}
```

### Add `Model stack` strip

```text
Forecast layer
RL policy layer
Impact layer
Proof layer
```

### Add proof carousel

```text
Past calls for this commodity
```

### Files likely to change

- `_layouts/commodity.html`
- `assets/css/style.css`
- `assets/js/main.js`
- possibly `_data/commodity_map.yml` or a new data map if matching is needed

### Acceptance criteria

- Hub pages show forecast + RL action + catalyst context without requiring the user to understand the whole site.
- Analysis-only hubs do not falsely claim live prices.
- Live/proxy hubs show live price/forecast context honestly.

---

## 4.5 Simulator `/simulator/`

### Goal
Make simulator the natural paid conversion step after a model call.

### New framing

```text
Forecast tells you the path. RL tells you the policy. Simulator shows who is exposed.
```

### Add model-call context strip

If user arrives from a report/hub with a commodity param:

```text
You are modeling: Crude Oil
Current catalyst: OPEC supply-risk premium
Forecast: bullish 30D, medium agreement
RL action: Add Continuation, with Add Hedge close behind
```

### Pro boundary copy

```text
Free shows the move, forecast direction, and sector pressure.
Pro unlocks named winners, losers, watchlist overlap, and deeper scenario conviction.
```

### Files likely to change

- `simulator/index.html`
- `assets/js/main.js`
- `assets/css/style.css`

### Acceptance criteria

- Simulator connects directly to model-call context.
- Pro wall explains the missing decision layer, not generic access.
- Mobile layout remains one-column and premium.

---

## 4.6 Pricing `/pricing/`

### Goal
Close users on the idea that Pro completes the decision workflow.

### Add premium proof block before plan comparison

```text
What changes when the move really matters
Free shows the commodity setup. Pro finishes the decision.
```

Cards:

```text
Free reveals
Live move, market narrative, public forecast stack.

Pro clarifies
RL policy context, deeper scenario workflow, named stock exposure, watchlist overlap.

Concrete example
Oil shock → airlines under pressure → E&Ps benefit → refiners split. Pro shows the named exposure before the repricing is obvious.
```

### Add model proof strip

```text
The model layer is not just a chart
Selected RL profile: +10.88 reward uplift vs hold in replay
Walk-forward windows: 100% positive in selected profile
Target-match: 91% replay metric
Scope: historical replay, not live-trading guarantee
```

### Files likely to change

- `pricing/index.html`
- `assets/css/style.css`

### Acceptance criteria

- Pricing explains why to pay now.
- It does not overstate what anonymous users cannot already see.
- It anchors Pro to named exposure, deeper scenarios, and model proof.

---

## 4.7 RL Policy Lab

### Goal
Turn RL Policy Lab into the technical proof page for the model layer.

### Add `How the active policy was selected` section

Explain:

```text
1. PPO policy learns action probabilities.
2. Behavior-prior blending stabilizes actions against expert/target policy structure.
3. Regime calibration adjusts probabilities under continuation, hedge, rotation, and risk-off states.
4. Replay and walk-forward evaluation reject one-action collapse.
5. Governance scoring selects the active export.
```

### Add `Proof archive` section

```text
Historical replay proof
- Replay target-match: 91%
- Passive hold baseline: 30%
- Reward uplift vs hold: +10.88
- Max drawdown: 1.27%

Recent timestamped calls
- show 3 cards from model-call outcomes
```

### Add stronger definitions

Replace/clarify:

```text
confidence 31%
```

With:

```text
Top action probability 31%
Top-2 margin +1%
Normalized policy uncertainty 66%
```

### Files likely to change

- `intelligence-lab/rl-policy-lab/index.html`
- `_layouts/intelligence-product.html`
- `assets/js/intelligence-product.js`
- `assets/css/style.css`
- `tests/test_visual_guardrails.py`
- `tests/test_premium_page_markers.py`

### Acceptance criteria

- RL page makes the model look high-end and credible.
- It clarifies PPO/prior/calibration/governance without becoming too academic.
- It uses proof numbers with correct scope.

---

## 5. Visual Design Direction

### Reference mix

Use a blend of:

- **Linear:** dark premium surfaces, restraint, sharp information hierarchy.
- **Vercel:** flagship black/white precision, product launch clarity.
- **Stripe:** gradient energy and conversion storytelling.
- **Sentry/Kraken:** data-dense but readable dashboard proof surfaces.

### Visual principles

1. **Premium dark command surfaces**
   - deep navy/black background
   - thin borders
   - glass/metal cards
   - subtle cyan/green/purple highlights

2. **Model layer as product theater**
   - moving fields, proof cards, model paths
   - avoid cheap neon clutter
   - each animation must explain a decision concept

3. **Proof must look institutional**
   - timestamp labels
   - small scope disclaimers
   - benchmark comparisons
   - sample size/horizon labels

4. **CRO surfaces should be calm and decisive**
   - clear CTA hierarchy
   - one main next action per section
   - no generic “learn more” where a workflow CTA is possible

### Reusable design components

Create or standardize classes for:

```text
.cn-model-readout
.cn-model-layer-card
.cn-proof-card
.cn-proof-strip
.cn-catalyst-card
.cn-forecast-chip
.cn-rl-action-chip
.cn-outcome-badge
.cn-scope-note
.cn-workflow-cta-panel
```

Prefer adding reusable classes over more inline styles.

---

## 6. Implementation Plan

## Phase 1 — Strategy + Data Foundation

### Task 1: Add this blueprint document

**Objective:** Save the strategy for execution.

**Files:**
- Create: `docs/plans/2026-04-25-commoditynode-premium-brand-model-proof-blueprint.md`

**Verification:**
- File exists and has the master positioning, data architecture, and phased implementation.

---

### Task 2: Add tests for model-call artifact schema

**Objective:** Define the expected shape before implementing scripts.

**Files:**
- Create: `tests/test_model_call_artifacts.py`

**Test cases:**

- `model-call-snapshots.json` contains `generated_at`, `version`, `calls`.
- Each call has `id`, `created_at`, `commodity_key`, `price_at_call`, `forecast`, `rl_policy`, and `status`.
- `model-call-outcomes.json` contains `outcomes` with horizon keys `7d`, `14d`, `30d` where available.
- No outcome with `direction_correct` exists unless actual price data is present.

**Run:**

```bash
python -m pytest tests/test_model_call_artifacts.py -q
```

**Expected:** FAIL initially if artifacts do not exist.

---

### Task 3: Build initial snapshot generator

**Objective:** Generate model-call snapshots from latest reports and current model data.

**Files:**
- Create: `scripts/build_model_call_snapshots.py`
- Generate: `assets/data/model-call-snapshots.json`

**Implementation requirements:**

- Read latest posts.
- Match `commodity_name` to forecast and price data.
- Pull active RL profile summary from `rl-policy-lab.json`.
- Create stable call IDs from date + commodity + slug.
- Preserve existing calls if already present.

**Run:**

```bash
python scripts/build_model_call_snapshots.py
python -m pytest tests/test_model_call_artifacts.py -q
```

---

### Task 4: Build outcome tracker

**Objective:** Attach 7D/14D/30D actual results to historical snapshots.

**Files:**
- Create: `scripts/update_model_call_outcomes.py`
- Generate: `assets/data/model-call-outcomes.json`

**Implementation requirements:**

- Find actual price from chart-data by date/horizon.
- Calculate return pct.
- Determine direction correctness.
- Leave pending horizons as `null`.
- Add `claim_scope` field.

**Run:**

```bash
python scripts/update_model_call_outcomes.py
python -m pytest tests/test_model_call_artifacts.py -q
```

---

## Phase 2 — Report/Hub Model Readout Layer

### Task 5: Add report model readout markup

**Objective:** Make every report show news → forecast → RL → implication.

**Files:**
- Modify: `_layouts/post.html`
- Modify: `assets/css/style.css`
- Test: create/update `tests/test_post_model_readout.py`

**Acceptance markers:**

```text
CommodityNode model readout
News catalyst
Forecast layer
RL policy
Track this call
```

**Run:**

```bash
python -m pytest tests/test_post_model_readout.py -q
```

---

### Task 6: Add hub latest catalyst + model reaction card

**Objective:** Make commodity hubs communicate model intelligence quickly.

**Files:**
- Modify: `_layouts/commodity.html`
- Modify: `assets/css/style.css`
- Modify: `assets/js/main.js` if dynamic data injection is needed
- Test: create/update `tests/test_commodity_model_readout.py`

**Acceptance markers:**

```text
Latest catalyst
Model reaction
Forecast stack
RL policy
Past calls for this commodity
```

---

## Phase 3 — Homepage + Reports Proof Surfaces

### Task 7: Add homepage `From catalyst to policy action` section

**Objective:** Make the homepage brand story instantly understandable.

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`
- Modify: `assets/js/main.js`
- Test: create/update `tests/test_homepage_model_story.py`

**Acceptance markers:**

```text
From catalyst to policy action
Forecast the path
Rank the policy action
Translate the exposure
Recent model calls that played out
```

---

### Task 8: Add reports archive model-call shelf

**Objective:** Make `/reports/` a live decision shelf.

**Files:**
- Modify: `reports/index.html`
- Modify: `assets/css/style.css`
- Modify: `assets/js/main.js`
- Test: create/update `tests/test_reports_model_shelf.py`

**Acceptance markers:**

```text
Today's live catalysts
Biggest forecast/model split right now
Recent calls with outcomes
```

---

## Phase 4 — Simulator + Pricing Conversion Layer

### Task 9: Add model-call context to simulator

**Objective:** Make simulator feel like the next step after a report/hub.

**Files:**
- Modify: `simulator/index.html`
- Modify: `assets/css/style.css`
- Modify: `assets/js/main.js`
- Test: create/update `tests/test_simulator_model_context.py`

**Acceptance markers:**

```text
Forecast tells you the path
RL tells you the policy
Simulator shows who is exposed
Free shows the move
Pro unlocks named winners
```

---

### Task 10: Add pricing proof + model layer section

**Objective:** Close paid conversion with model proof and concrete Pro value.

**Files:**
- Modify: `pricing/index.html`
- Modify: `assets/css/style.css`
- Test: create/update `tests/test_pricing_model_proof.py`

**Acceptance markers:**

```text
What changes when the move really matters
Free shows the commodity setup
Pro finishes the decision
The model layer is not just a chart
```

---

## Phase 5 — RL Policy Lab Trust Upgrade

### Task 11: Add active-policy selection explainer

**Objective:** Explain PPO + prior + calibration + governance in a conversion-friendly way.

**Files:**
- Modify: `intelligence-lab/rl-policy-lab/index.html`
- Modify: `_layouts/intelligence-product.html`
- Modify: `assets/css/style.css`
- Test: create/update `tests/test_rl_policy_lab_model_explainer.py`

**Acceptance markers:**

```text
How the active policy was selected
PPO policy
Behavior-prior blending
Regime calibration
Governance scoring
```

---

### Task 12: Add proof archive to RL Policy Lab

**Objective:** Make RL page the deepest proof page.

**Files:**
- Modify: `_layouts/intelligence-product.html`
- Modify: `assets/js/intelligence-product.js`
- Modify: `assets/css/style.css`
- Test: create/update `tests/test_rl_policy_lab_model_explainer.py`

**Acceptance markers:**

```text
Historical replay proof
Recent timestamped calls
Replay target-match
Passive hold baseline
Reward uplift vs hold
```

---

## Phase 6 — Tracking, QA, and Deployment

### Task 13: Add semantic CTA tracking

**Objective:** Track model-story conversion clicks accurately.

**Files:**
- Modify: `assets/js/main.js`

**Events:**

```text
model_readout_cta_click
proof_card_cta_click
model_call_outcome_click
simulator_from_model_call_click
pricing_model_proof_click
```

Preserve the existing generic `[data-cta]` tracking.

---

### Task 14: Full local verification

**Commands:**

```bash
node --check assets/js/main.js
node --check assets/js/intelligence-product.js
python -m pytest -q
```

If Python scripts are touched:

```bash
python scripts/build_model_call_snapshots.py
python scripts/update_model_call_outcomes.py
python -m pytest tests/test_model_call_artifacts.py -q
```

---

### Task 15: Live deployment verification

**Procedure:**

1. Stage only relevant files.
2. Run secret scan on staged diff.
3. Commit/push.
4. Poll GitHub Pages deployment for success.
5. Verify bare live URLs, not only cache-busted URLs.
6. Browser QA representative pages:
   - `/`
   - `/reports/`
   - one latest report URL
   - one commodity hub
   - `/simulator/`
   - `/pricing/`
   - `/intelligence-lab/rl-policy-lab/`
7. Capture desktop and mobile screenshots for changed surfaces.
8. Check console errors.

---

## 7. Success Metrics

### Brand-quality metrics

- Homepage explains the full decision engine in under 10 seconds.
- Reports feel like model-backed decision artifacts, not blog posts.
- RL page feels credible and premium, not toy-like.
- Pricing makes Pro feel like decision completion, not feature unlock.

### Conversion metrics to track

- Clicks from proof cards to pricing.
- Clicks from report model readout to simulator.
- Clicks from hub model reaction to simulator.
- Clicks from simulator Pro boundary to checkout/pricing.
- Signup starts from model-readout surfaces.

### Trust metrics

- No major proof number appears without claim scope.
- No fake outcome cards.
- No 90%/91% language framed as live trading guarantee.
- Every proof card has timestamp/horizon/commodity/source.

---

## 8. Risks and Guardrails

### Risk 1: The site becomes too hype-heavy

Mitigation:
- Keep proof cards timestamped.
- Use historical/replay scope notes.
- Show uncertainty and model disagreement.

### Risk 2: Outcome tracking looks cherry-picked

Mitigation:
- Use a consistent rule for which calls enter the archive.
- Show pending, correct, mixed, and wrong outcomes honestly.
- Add filters by commodity/horizon.

### Risk 3: Static JSON gets stale

Mitigation:
- Integrate snapshot/outcome scripts into refresh workflow.
- Show `generated_at` and freshness labels.

### Risk 4: UI becomes cluttered

Mitigation:
- Reusable components.
- One primary CTA per section.
- Use compact proof strips instead of giant repeated blocks.

### Risk 5: Legal/compliance trust issue

Mitigation:
- Avoid guaranteed performance claims.
- Use “decision support,” “historical replay,” “timestamped call,” and “not financial advice” language.

---

## 9. Recommended Execution Order

Fastest route to visible premium uplift:

```text
1. Data foundation: model-call snapshots + outcomes
2. Report template model readout
3. Homepage story + proof cards
4. Pricing proof block
5. Commodity hub model reaction
6. Simulator model-call context
7. RL Policy Lab proof archive
8. Tracking and full QA polish
```

Why this order:

- Reports are the strongest search-entry conversion point.
- Homepage controls brand perception.
- Pricing needs proof before asking for money.
- Hubs and simulator deepen workflow value.
- RL page becomes the technical proof destination once the whole site story exists.

---

## 10. Immediate Next Action

Before implementation, run a quick audit to identify:

1. Which latest reports have enough price/forecast data for initial snapshots.
2. Which commodities have enough historical chart data for 7D/14D/30D proof.
3. Which proof examples are strongest and safest to feature first.
4. Whether current report front matter has enough `commodity_name` coverage.

Then implement Phase 1 with tests first.
