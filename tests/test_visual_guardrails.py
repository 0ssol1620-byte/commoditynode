from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_rl_policy_field_uses_premium_action_space_surface_not_node_diagram():
    layout = (ROOT / "_layouts/intelligence-product.html").read_text(encoding="utf-8")
    js = (ROOT / "assets/js/intelligence-product.js").read_text(encoding="utf-8")

    assert 'data-visual="action-space-surface"' in layout
    assert 'intel-rl-surface-legend' in layout
    assert 'intel-rl-field-node' not in layout
    assert 'function drawActionSpaceSurface' in js
    assert 'function drawActionFlowParticles' in js

    field_start = js.index('function renderRlPolicyField')
    field_end = js.index('function renderRlPolicyManifoldWebGL')
    field_body = js[field_start:field_end]
    assert 'quadraticCurveTo' not in field_body
    assert 'geo.anchors' not in field_body
    assert 'createLinearGradient' in field_body
    assert 'Policy frontier' in field_body


def test_rl_policy_field_mobile_layout_keeps_legend_outside_canvas_and_shortens_labels():
    layout = (ROOT / "_layouts/intelligence-product.html").read_text(encoding="utf-8")
    js = (ROOT / "assets/js/intelligence-product.js").read_text(encoding="utf-8")

    mobile_css = layout[layout.index('@media (max-width: 768px) {'):layout.index('@media (max-width: 560px) {')]
    assert '.intel-rl-field-overlay--surface {' in mobile_css
    assert 'height: 300px;' in mobile_css
    assert 'bottom: auto;' in mobile_css
    assert '.intel-rl-surface-legend {' in mobile_css
    assert 'top: 312px;' in mobile_css
    assert 'bottom: auto;' in mobile_css
    assert 'grid-template-columns: 1fr;' in mobile_css
    assert 'min-height: 456px;' in mobile_css
    assert 'overflow: visible;' in mobile_css

    field_start = js.index('function renderRlPolicyField')
    field_end = js.index('function renderRlPolicyManifoldWebGL')
    field_body = js[field_start:field_end]
    assert 'compactLabels' in field_body
    assert 'clampLabelX' in field_body
    assert "relative_value_rotation: 'Rotation'" in field_body


def test_homepage_impact_sankey_is_premium_and_not_inline_toy_chart():
    home = (ROOT / "index.html").read_text(encoding="utf-8")

    assert 'class="home-impact-sankey-card"' in home
    assert 'data-visual="premium-impact-sankey"' in home
    assert 'id="home-impact-sankey-legend"' in home
    assert 'nodeAlign: \'right\'' in home
    assert 'layoutIterations: 96' in home
    assert 'draggable: false' in home
    assert 'edgeLabel' in home
    assert 'levels:' in home

    old_inline = '<section style="padding:22px;border-radius:22px;border:1px solid rgba(34,211,238,0.14);background:linear-gradient(135deg,rgba(34,211,238,0.07),rgba(168,85,247,0.05));backdrop-filter:blur(12px);">'
    assert old_inline not in home


def test_homepage_shock_rail_prevents_long_commodity_chip_clipping():
    css = (ROOT / "assets/css/style.css").read_text(encoding="utf-8")

    assert '.hero-shock-name {' in css
    shock_name = css[css.index('.hero-shock-name {'):css.index('.hero-shock-val {')]
    assert 'max-inline-size' in shock_name
    assert 'overflow-wrap: anywhere' in shock_name
    assert 'line-clamp' in shock_name or '-webkit-line-clamp' in shock_name

    shock_pill = css[css.index('.hero-shock-pill {'):css.index('.hero-shock-pill:hover')]
    assert 'max-width' in shock_pill
    assert 'min-height' in shock_pill


def test_hero_active_propagation_has_premium_depth_guardrails():
    css = (ROOT / "assets/css/style.css").read_text(encoding="utf-8")
    js = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")

    assert '.hero-impact-card::before' in css
    assert '.hero-impact-card::after' in css
    assert 'drawImpactRibbons' in js
    assert 'drawImpactHaloGrid' in js
    assert 'drawImpactNodeLabel' in js
