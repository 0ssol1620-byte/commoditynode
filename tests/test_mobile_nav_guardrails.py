from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_mobile_nav_uses_tablet_breakpoint_and_fixed_sheet():
    css = (ROOT / 'assets/css/style.css').read_text(encoding='utf-8')

    assert '@media (max-width: 960px)' in css
    assert '.main-nav {' in css
    assert 'position: fixed;' in css
    assert 'max-height: calc(100dvh - 80px);' in css
    assert 'overflow-y: auto;' in css
    assert '.nav-dropdown-menu {' in css
    assert 'box-shadow: none;' in css


def test_nav_dropdowns_close_on_mobile_scroll_and_resize():
    include = (ROOT / '_includes/nav-dropdowns.html').read_text(encoding='utf-8')

    assert "window.matchMedia('(max-width: 960px)')" in include
    assert 'function closeAllDropdowns' in include
    assert "window.addEventListener('scroll'" in include
    assert "window.addEventListener('resize'" in include
    assert "dropdown.classList.remove('open')" in include
