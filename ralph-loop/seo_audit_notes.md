# Ralph SEO Audit Notes

## First Detailed Pass

### Strengths
- Tier-1 pages return 200 and have populated title, meta description, canonical, and H1.
- Pricing, reports, methodology, about, and flagship commodity hubs expose strong trust and positioning language.
- Internal doc exposure is blocked.
- Flagship trust/practical sections are live.

### Improvement Candidates
1. **Homepage title duplication feel**
   - Current title: `CommodityNode — Commodity Price Impact Maps | CommodityNode`
   - Feels brand-redundant and slightly generic.
   - Candidate direction: sharper non-redundant title focused on commodity intelligence / impact maps.

2. **Missing explicit robots meta on Tier-1 pages**
   - Not necessarily broken, but useful to track so noindex regressions are easier to spot.
   - Could standardize explicit `index, follow` on key templates/pages if desired.

3. **AI-search discoverability surface on homepage**
   - `llms.txt` exists on site but homepage does not visibly route users/bots toward machine-readable surfaces.
   - Could add stronger internal link to methodology / pricing.txt / reports in a machine-readable or research transparency block.

4. **SEO audit layer should include repo + live metadata checks**
   - Current audit is strong on trust blocks, but should also score title/meta/canonical quality and detect weak/duplicative patterns.

### Recommended Next Ralph SEO Expansions
- Add `metadata_quality` checks to full audit.
- Add homepage title refinement as a bounded manual improvement batch.
- Add AI SEO checks for llms.txt presence, key research links, and citation-friendly blocks.
