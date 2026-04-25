# CommodityNode MarketingSkills Development Plan

_Source framework: coreyhaines31/marketingskills — product-marketing-context, page-cro, copywriting, pricing-strategy, paywall-upgrade-cro, programmatic-seo, lead-magnets, analytics-tracking._

## Objective

Turn CommodityNode from a premium-looking commodity intelligence site into a stronger conversion engine:

**news catalyst → model readout → watchlist relevance → proof/outcome trust → Pro upgrade**

## MarketingSkills Principles Applied

### Product marketing context
- Keep one canonical `.agents/product-marketing-context.md` so future copy/CRO/SEO work starts from the same positioning.
- Position CommodityNode as a decision workflow, not a generic commodity data site.

### Page CRO
- Every major page needs one primary conversion goal.
- Above-the-fold must explain what CommodityNode does within 5 seconds.
- CTAs should be value-specific and repeated at decision points.
- Trust/proof should sit near claims and CTAs.

### Copywriting
- Clear > clever.
- Benefits > features.
- Specific proof > generic “AI-powered” claims.
- Use scoped evidence language: historical replay, research simulation, not investment advice.

### Pricing strategy
- Package around workflow completion, not raw feature lists.
- Free should let users experience partial value.
- Pro should unlock the missing step: full readout, watchlist translation, scenario depth, and proof history.

### Paywall upgrade CRO
- Ask for upgrade after value is visible.
- Upgrade screens should show what is locked, why it matters, and the next step.
- Avoid pressure; preserve trust with “continue free” escape routes.

### Programmatic SEO
- Scale pages only where each page has unique commodity/company/news/model data.
- Use proprietary/model-derived data as the differentiator.
- Avoid thin pages with swapped variables only.

### Lead magnets
- Create low-friction, high-perceived-value assets that naturally lead to Pro.
- Best fit: watchlist risk scan, weekly model-call digest, commodity shock checklist.

### Analytics tracking
- Track for decisions, not vanity metrics.
- Events should reveal which proof/CTA surfaces actually move users to `/start/`, `/pricing/`, checkout, or Pro gates.

## Immediate Development Backlog

### Phase 1 — Conversion architecture hardening

1. Add/maintain canonical product marketing context.
   - File: `.agents/product-marketing-context.md`
   - Status: created.

2. Add a sitewide CTA taxonomy check.
   - Goal: every primary conversion CTA has `data-cta` and can be measured.
   - Suggested events:
     - `cta_clicked`
     - `proof_card_opened`
     - `pricing_plan_selected`
     - `paywall_viewed`
     - `start_workflow_saved`
     - `checkout_clicked`

3. Strengthen pricing page around value ladder.
   - Free: “prove relevance.”
   - Pro: “finish the decision workflow.”
   - Enterprise: “operationalize across team/API.”

4. Add upgrade moments after value appears:
   - Simulator after scenario preview.
   - Report after model readout teaser.
   - Commodity/company pages after watchlist/company impact preview.
   - RL Policy Lab after proof archive teaser.

### Phase 2 — Lead magnet and email capture

1. Build `/watchlist-risk-scan/` landing page.
   - Offer: “Get your first commodity watchlist risk scan.”
   - Inputs: role, tickers, commodities, events.
   - Output: preview card + email capture / start workflow CTA.

2. Build “Weekly Model-Call Digest” opt-in.
   - Positioning: timestamped commodity calls + outcome updates.
   - Natural conversion: Pro unlocks full archive and company-level readout.

3. Add lead magnet CTAs to:
   - Homepage proof section.
   - Reports archive.
   - Commodity hubs.
   - Pricing FAQ.

### Phase 3 — pSEO with proprietary value

1. Improve company pages with unique model-derived data:
   - top commodity exposures
   - recent related catalysts
   - model-call proximity
   - scenario sensitivity teaser

2. Create comparison pages:
   - `/commoditynode-vs-tradingview/`
   - `/commoditynode-vs-generic-ai-market-summary/`
   - Expand with sharper proof/positioning and CTA paths.

3. Create intent pages:
   - “before OPEC oil playbook”
   - “before WASDE grains playbook”
   - “before Fed metals playbook”
   - Each page should lead to reports + simulator + Pro.

### Phase 4 — Measurement and experiment loop

1. Add event QA tests for high-value CTAs.
2. Add conversion funnel documentation.
3. Create A/B test candidates:
   - Homepage hero CTA copy.
   - Pricing annual anchor.
   - Simulator upgrade prompt.
   - Proof archive placement.

## Priority Implementation Candidates

### Candidate A: Pricing value-ladder rewrite
Fastest conversion impact. Make pricing less feature-list and more “what decision workflow do I unlock?”

### Candidate B: Watchlist Risk Scan lead magnet
Best bridge from public visitor to personalized value. Fits current `/start/` workflow and user data collection.

### Candidate C: Paywall/upgrade component system
Best Pro conversion infrastructure. Reusable across report, simulator, commodity, company, and intelligence pages.

### Candidate D: Analytics event hardening
Best way to know what is working. Ensures later CRO changes are measurable.

## Recommended Next Step

Start with **Candidate B + D**:

1. Implement a lightweight `/watchlist-risk-scan/` page using existing start workflow concepts.
2. Add measurable CTAs/events.
3. Route scan output to `/start/`, `/simulator/`, and `/pricing/`.
4. Validate with pytest + live browser QA.

Why: it creates a concrete acquisition/conversion asset, reuses existing CommodityNode mechanics, and gives future ads/SEO/social a clear offer.
