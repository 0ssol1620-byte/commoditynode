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
    assert 'Dominant action concentration' in script
