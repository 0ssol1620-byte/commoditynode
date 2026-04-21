import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

ROOT = Path(__file__).resolve().parents[1]


def test_reports_archive_title_and_filters_are_upgraded_for_accessibility_and_seo():
    reports = (ROOT / 'reports/index.html').read_text(encoding='utf-8')
    assert 'title: CommodityNode Signal Reports & Impact Maps' in reports
    assert '<h1>CommodityNode Signal Reports &amp; Impact Maps</h1>' in reports
    assert 'aria-label="Sort reports by recency or title"' in reports
    assert 'aria-label="Filter reports by recent publication window"' in reports


def test_pro_sales_page_is_connected_from_home_reports_and_pricing():
    home = (ROOT / 'index.html').read_text(encoding='utf-8')
    reports = (ROOT / 'reports/index.html').read_text(encoding='utf-8')
    pricing = (ROOT / 'pricing/index.html').read_text(encoding='utf-8')

    assert 'href="/pro/"' in home
    assert 'href="/pro/"' in reports
    assert 'href="/pro/"' in pricing


def test_commodity_layout_uses_consistent_unavailable_daily_change_copy():
    commodity_layout = (ROOT / '_layouts/commodity.html').read_text(encoding='utf-8')
    assert "changeEl.textContent = 'Daily change unavailable · delayed or proxy feed';" in commodity_layout
    assert "changeEl.title = 'This commodity uses a delayed, unstable, or proxy price feed right now. See methodology for details.';" in commodity_layout
