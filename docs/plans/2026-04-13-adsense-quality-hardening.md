# AdSense Low-Value Content Hardening Plan

> For Hermes: implement directly in the CommodityNode repo, then run QA and an independent review before shipping.

Goal: remove site-quality signals that can trigger AdSense low-value-content rejections and strengthen trust, originality, editorial transparency, and completion across live pages.

Architecture: focus on high-leverage surfaces first — About, Contact, Privacy, Terms, shared layouts, and CTA/link hygiene — because these affect sitewide trust signals. Then strengthen article and commodity templates so every important page clearly shows publisher identity, methodology, review standards, and correction paths.

Tech stack: Jekyll, Liquid templates, static HTML/Markdown pages, shared CSS/JS layouts.

---

## Tasks
1. Audit sitewide trust and completion issues: duplicate sections, placeholder links, mixed contact identities, hardcoded personal email/admin logic.
2. Rewrite About into a unique, non-duplicative trust page with links to editorial standards and review process.
3. Expand Contact, Privacy, and Terms into consistent publisher-grade legal/trust pages using official domain emails only.
4. Add/strengthen supporting trust pages for editorial standards and review workflow.
5. Patch shared layouts (default/simple/post/commodity) to surface methodology, corrections, publisher identity, and valid CTA fallbacks.
6. Remove hardcoded personal-email admin logic and replace with metadata-based role checks.
7. Run QA, diff review, independent code review, and prepare for deployment.
