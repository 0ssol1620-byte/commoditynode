from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_rl_policy_lab_surface_copy_emphasizes_decision_quality_over_infra_meta():
    layout = (ROOT / '_layouts/intelligence-product.html').read_text(encoding='utf-8')
    script = (ROOT / 'assets/js/intelligence-product.js').read_text(encoding='utf-8')

    assert 'intel-rl-observability-chart' in layout
    assert 'Selection score for ' not in script
    assert 'Selected export profile' not in script
    assert 'steps · prior weight' not in script

    assert 'Positive windows' in script
    assert 'Target match' in script
    assert 'Distribution gap' in script


def test_rl_policy_lab_ships_referenced_premium_3d_policy_manifold():
    page = (ROOT / 'intelligence-lab/rl-policy-lab/index.html').read_text(encoding='utf-8')
    layout = (ROOT / '_layouts/intelligence-product.html').read_text(encoding='utf-8')
    script = (ROOT / 'assets/js/intelligence-product.js').read_text(encoding='utf-8')

    assert 'universe: true' in page
    assert 'Policy state manifold' in layout
    assert 'intel-rl-manifold-canvas' in layout
    assert 'intel-rl-manifold-webgl-badge' in layout
    assert 'data-rl-reference="wandb-tensorboard-gymnasium-threejs"' in layout
    assert 'renderRlPolicyManifold' in script
    assert 'renderRlPolicyManifoldWebGL' in script
    assert 'THREE.WebGLRenderer' in script
    assert 'OrbitControls' in script
    assert 'policyManifold' in script
    assert 'state-space replay' in script
    assert 'Action probability simplex' in script
    assert 'Dominant action concentration' in script
