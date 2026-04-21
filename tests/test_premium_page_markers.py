from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_premium_visual_markers_exist_on_flagship_pages():
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    pricing = (ROOT / "pricing/index.html").read_text(encoding="utf-8")
    correlation = (ROOT / "correlation/index.html").read_text(encoding="utf-8")
    simulator = (ROOT / "simulator/index.html").read_text(encoding="utf-8")
    commodity = (ROOT / "_layouts/commodity.html").read_text(encoding="utf-8")
    intelligence_layout = (ROOT / "_layouts/intelligence-product.html").read_text(encoding="utf-8")

    assert 'id="home-kpi-spark-wall"' in home
    assert 'id="home-impact-sankey-chart"' in home

    assert 'id="pricing-story-chart"' in pricing
    assert 'id="pricing-story-steps"' in pricing

    assert 'id="corr-network-chart"' in correlation

    assert 'id="sim-forecast-cone-chart"' in simulator
    assert 'id="sim-event-timeline-chart"' in simulator

    assert 'id="commodity-exposure-wheel-chart"' in commodity
    assert 'id="commodity-event-timeline-chart"' in commodity

    assert 'id="intel-rl-observability-chart"' in intelligence_layout
