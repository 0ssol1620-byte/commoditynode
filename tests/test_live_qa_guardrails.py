from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def _front_matter_value(text: str, key: str):
    match = re.search(rf"^{re.escape(key)}:\s*['\"]?([^'\"\n]+)['\"]?\s*$", text, re.M)
    return match.group(1).strip() if match else None


def _symbol_slug(symbol: str) -> str:
    return re.split(r"[=.]", symbol)[0].lower()


def test_all_commodity_symbols_have_chart_slice_or_known_placeholder():
    """Commodity hub pages should not request missing /chart-data/{symbol}.json files live."""
    missing = []
    for page in (ROOT / "_commodities").glob("*.md"):
        text = page.read_text(encoding="utf-8")
        symbol = _front_matter_value(text, "symbol")
        if not symbol:
            continue
        chart_slice = ROOT / "assets" / "data" / "chart-data" / f"{_symbol_slug(symbol)}.json"
        if not chart_slice.exists():
            missing.append(f"{page.name}:{symbol}->{chart_slice.name}")
    assert not missing, "Missing chart slices/placeholders: " + ", ".join(sorted(missing))


def test_intelligence_product_mobile_css_uses_device_width_fallbacks():
    """Mobile emulation can widen layout viewport when desktop-only cards force min-content width."""
    layout = (ROOT / "_layouts" / "intelligence-product.html").read_text(encoding="utf-8")
    assert ".intel-product-shell, .intel-product-shell * { box-sizing: border-box; min-width: 0; max-width: 100%; }" in layout
    assert "@media (max-width: 980px), (max-device-width: 980px)" in layout
    assert "@media (max-width: 768px), (max-device-width: 768px)" in layout
    assert "@media (max-width: 560px), (max-device-width: 560px)" in layout
