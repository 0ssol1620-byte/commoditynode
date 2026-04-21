import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

ROOT = Path(__file__).resolve().parents[1]


def test_pricing_title_and_secondary_saved_workflow_links_use_pro_surface():
    pricing = (ROOT / 'pricing/index.html').read_text(encoding='utf-8')
    simulator = (ROOT / 'simulator/index.html').read_text(encoding='utf-8')
    commodity = (ROOT / '_layouts/commodity.html').read_text(encoding='utf-8')
    main_js = (ROOT / 'assets/js/main.js').read_text(encoding='utf-8')

    assert 'title: CommodityNode Pricing — Finish the commodity decision workflow' in pricing
    assert 'href="/pro/" class="pricing-btn pricing-btn-ghost" data-profile-secondary-link' in pricing
    assert 'href="/pro/" class="btn btn-secondary" data-profile-secondary-link' in simulator
    assert 'href="/pro/" class="btn btn-secondary" data-profile-secondary-link' not in commodity  # commodity secondary stays simulator
    assert "{ href: '/pro/', label: 'See Pro workflow' }" in main_js
