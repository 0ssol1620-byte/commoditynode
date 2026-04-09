# CommodityNode Ralph Loop Goals

## Mission
Continuously improve CommodityNode through short autonomous build, verify, and repair loops until all defined success criteria pass.

## Loop Scope
This loop is for bounded, verifiable website improvement work, not open-ended ideation.

## Primary Objectives
1. Keep GitHub Pages deployment healthy.
2. Keep Tier-1 pages live, current, and trustworthy.
3. Catch regressions in SEO/indexability/trust surfaces before they linger.
4. Surface unresolved issues with explicit notes instead of silent failure.

## Tier-1 Pages
- /
- /about/
- /contact/
- /methodology/
- /pricing/
- /reports/
- /commodities/gold/
- /commodities/crude-oil/
- /commodities/copper/
- /commodities/natural-gas/
- /commodities/lithium/
- /commodities/wheat/
- /pricing.txt

## Hard Success Criteria
The loop may stop only when all of these are true:
- Git working tree is clean except for explicitly ignored artifacts.
- Local checks complete without critical failure.
- Core site config/build rules are not obviously broken.
- Tier-1 pages return expected status codes and contain required trust/conversion markers.
- No internal operational docs are accidentally being published.
- Any newly introduced issue is written to `ralph-loop/progress.md`.

## Soft Improvement Targets
Work on these only after hard success criteria pass:
- Better internal linking on flagship hubs
- Better trust framing on key money pages
- Better noindex/sitemap hygiene
- Better stale-data detection and disclosure
- Better conversion clarity on pricing/reports/pro surfaces

## Stop Conditions
Stop the loop when one of the following occurs:
- All hard success criteria pass and no prioritized tasks remain.
- The same failure repeats 3 times without meaningful new evidence.
- The loop needs user approval for an external or risky action.
- The loop reaches the configured max iterations.
