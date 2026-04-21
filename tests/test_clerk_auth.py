import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


ROOT = Path(__file__).resolve().parents[1]


def test_clerk_user_menu_only_renders_meter_badge_when_needed():
    js = (ROOT / 'assets/js/clerk-auth.js').read_text(encoding='utf-8')
    css = (ROOT / 'assets/css/clerk-auth.css').read_text(encoding='utf-8')

    assert 'function shouldShowMeterBadge(user)' in js
    assert "var meterBadgeHtml = shouldShowMeterBadge(user) ? '<div class=\"clerk-meter-badge\" id=\"clerk-meter-badge\"></div>' : '';" in js
    assert "var meterBadgeNavHtml = shouldShowMeterBadge(user) ? '<div class=\"clerk-meter-badge\" id=\"clerk-meter-badge-nav\"></div>' : '';" in js
    assert '.clerk-meter-badge:empty {' in css
    assert 'display: none;' in css
