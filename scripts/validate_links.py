#!/usr/bin/env python3
"""
CommodityNode Link Validation Script
Checks:
  1. Liquid company links in _layouts/commodity.html point to existing files
  2. companies[] tickers in commodity front matter have matching companies/*.html
  3. themes[] slugs in commodity front matter have matching themes/*.html
"""
import os
import re
import sys
import yaml

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMMODITIES_DIR = os.path.join(BASE, '_commodities')
COMPANIES_DIR = os.path.join(BASE, 'companies')
THEMES_DIR = os.path.join(BASE, 'themes')
LAYOUTS_DIR = os.path.join(BASE, '_layouts')

errors = []
warnings = []


def parse_frontmatter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.startswith('---'):
        return None
    end = content.find('\n---', 3)
    if end == -1:
        return None
    try:
        return yaml.safe_load(content[3:end])
    except yaml.YAMLError:
        return None


def ticker_to_slug(ticker):
    """Convert a ticker symbol to a company page slug (lowercase)."""
    return ticker.lower().strip().strip('"\'')


def theme_to_slug(theme):
    """Convert a theme name to a slug."""
    return theme.lower().strip().strip('"\'').replace(' ', '-')


# ── 1. Check Liquid company/theme variable references in commodity.html ────────
layout_path = os.path.join(LAYOUTS_DIR, 'commodity.html')
if os.path.exists(layout_path):
    with open(layout_path, 'r', encoding='utf-8') as f:
        layout_html = f.read()

    # Find Liquid for-loops iterating over companies or themes
    # e.g. {% for company in page.companies %} ... /companies/{{ company | downcase }}
    company_href_pattern = re.compile(
        r'/companies/\{\{[^}]+\}\}', re.IGNORECASE
    )
    theme_href_pattern = re.compile(
        r'/themes/\{\{[^}]+\}\}', re.IGNORECASE
    )

    company_refs = company_href_pattern.findall(layout_html)
    theme_refs = theme_href_pattern.findall(layout_html)

    if company_refs:
        print(f'  Layout commodity.html: {len(company_refs)} Liquid company href(s) found (dynamic — checked via front matter below)')
    else:
        warnings.append('Layout commodity.html: No Liquid company href patterns found — layout may not link companies')

    if theme_refs:
        print(f'  Layout commodity.html: {len(theme_refs)} Liquid theme href(s) found (dynamic — checked via front matter below)')
    else:
        warnings.append('Layout commodity.html: No Liquid theme href patterns found — layout may not link themes')
else:
    warnings.append(f'Layout not found: {layout_path}')

print()

# ── 2. Check companies[] and themes[] in every commodity front matter ──────────
files = sorted(f for f in os.listdir(COMMODITIES_DIR) if f.endswith('.md'))

for fname in files:
    fpath = os.path.join(COMMODITIES_DIR, fname)
    fm = parse_frontmatter(fpath)
    if fm is None:
        warnings.append(f'{fname}: Could not parse front matter — skipping link checks')
        continue

    # Check companies
    companies = fm.get('companies', []) or []
    if isinstance(companies, str):
        companies = [companies]
    for ticker in companies:
        slug = ticker_to_slug(str(ticker))
        html_path = os.path.join(COMPANIES_DIR, f'{slug}.html')
        if not os.path.exists(html_path):
            errors.append(f'BROKEN company link: {fname} → companies/{slug}.html (ticker: {ticker})')

    # Check themes
    themes = fm.get('themes', []) or []
    if isinstance(themes, str):
        themes = [themes]
    for theme in themes:
        slug = theme_to_slug(str(theme))
        html_path = os.path.join(THEMES_DIR, f'{slug}.html')
        if not os.path.exists(html_path):
            errors.append(f'BROKEN theme link: {fname} → themes/{slug}.html (theme: "{theme}")')

# ── 3. Check /commodities/ hrefs in companies/ and themes/ HTML ───────────────
for subdir, label in [(COMPANIES_DIR, 'companies'), (THEMES_DIR, 'themes')]:
    if not os.path.isdir(subdir):
        continue
    for fname in sorted(os.listdir(subdir)):
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(subdir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            html = f.read()
        for m in re.finditer(r'href="(/commodities/([^/"]+)/)"', html):
            slug = m.group(2)
            md_path = os.path.join(COMMODITIES_DIR, f'{slug}.md')
            if not os.path.exists(md_path):
                errors.append(f'BROKEN commodity href: {label}/{fname} → /commodities/{slug}/')

# ── Report ─────────────────────────────────────────────────────────────────────
if warnings:
    print(f'Warnings ({len(warnings)}):')
    for w in warnings:
        print(f'  [warn] {w}')
    print()

if errors:
    print(f'FAILED — {len(errors)} broken link(s):')
    for e in errors:
        print(f'  {e}')
    sys.exit(1)
else:
    print(f'PASS — All commodity links valid ({len(files)} files checked)')
    sys.exit(0)
