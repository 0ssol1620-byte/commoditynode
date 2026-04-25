from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def test_product_marketing_context_and_growth_plan_exist():
    context = read(".agents/product-marketing-context.md")
    plan = read("docs/plans/2026-04-25-marketingskills-development-plan.md")

    assert "news catalyst → forecast consensus → RL policy action → sector/stock impact → outcome proof → Pro upgrade" in context
    assert "Watchlist Risk Scan" in plan
    assert "Free: “prove relevance.”" in plan
    assert "Pro: “finish the decision workflow.”" in plan


def test_watchlist_risk_scan_page_converts_to_start_simulator_and_pricing():
    page = read("watchlist-risk-scan/index.html")

    assert "permalink: /watchlist-risk-scan/" in page
    assert "data-growth-surface=\"watchlist-risk-scan\"" in page
    assert "Get your first commodity watchlist risk scan" in page
    assert "id=\"risk-scan-watchlist\"" in page
    assert "id=\"risk-scan-preview\"" in page
    assert "data-cta=\"risk_scan_generate_preview\"" in page
    assert "data-cta=\"risk_scan_start_workflow\"" in page
    assert "data-cta=\"risk_scan_open_simulator\"" in page
    assert "data-cta=\"risk_scan_compare_pro\"" in page
    assert "window.CNProfile.addWatchlist" in page
    assert "window.CNTrack('watchlist_risk_scan_generated'" in page
    assert "not investment advice" in page.lower()


def test_pricing_uses_marketingskills_value_ladder_and_risk_scan_cta():
    pricing = read("pricing/index.html")

    assert "pricing-value-ladder" in pricing
    assert "Free proves relevance" in pricing
    assert "Pro finishes the decision workflow" in pricing
    assert "Enterprise operationalizes the workflow" in pricing
    assert "data-cta=\"pricing_try_watchlist_risk_scan\"" in pricing
    assert "/watchlist-risk-scan/" in pricing
    assert "checkout_start" in pricing
    assert "data-plan=\"pro_monthly\"" in pricing
    assert "data-plan=\"pro_annual\"" in pricing


def test_reusable_upgrade_component_markers_exist_for_paywall_cro():
    include = read("_includes/components/upgrade-moment.html")

    assert "data-upgrade-moment" in include
    assert "Value preview" in include
    assert "What Pro unlocks" in include
    assert "Continue free" in include
    assert "not a return guarantee" in include.lower()

    simulator = read("simulator/index.html")
    post = read("_layouts/post.html")
    commodity = read("_layouts/commodity.html")

    assert "components/upgrade-moment.html" in simulator
    assert "simulator_upgrade_after_preview" in simulator
    assert "components/upgrade-moment.html" in post
    assert "report_upgrade_model_readout" in post
    assert "components/upgrade-moment.html" in commodity
    assert "commodity_upgrade_company_impact" in commodity


def test_main_js_has_semantic_growth_tracking_for_new_funnel():
    main = read("assets/js/main.js")

    assert "window.CNTrack = function(eventName, props)" in main
    assert "checkout_start" in main
    assert "pricing_plan_selected" in main
    assert "lead_magnet_opened" in main
    assert "watchlist_risk_scan_generated" in main
    assert "target.closest('[data-checkout-plan]')" in main
    assert "target.closest('[data-lead-magnet]')" in main
