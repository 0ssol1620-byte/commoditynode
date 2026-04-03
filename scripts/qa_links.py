#!/usr/bin/env python3
"""
CommodityNode Link QA Script
Checks:
1. HTML internal links in industries/, themes/ for broken /companies/ and /themes/ hrefs
2. Commodity front matter: companies that are neither a known page slug nor in company_slugs.yml mapping
Usage: python3 scripts/qa_links.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_company_slugs():
    """Load _data/company_slugs.yml mapping"""
    path = os.path.join(ROOT, '_data', 'company_slugs.yml')
    mapping = {}
    if not os.path.exists(path):
        return mapping
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                parts = line.split(':', 1)
                if len(parts) == 2:
                    ticker = parts[0].strip()
                    slug = parts[1].strip()
                    mapping[ticker.upper()] = slug
    return mapping

def get_existing_companies():
    companies_dir = os.path.join(ROOT, 'companies')
    existing = set()
    if os.path.exists(companies_dir):
        for fn in os.listdir(companies_dir):
            if fn.endswith('.html') and fn != 'index.html':
                existing.add(fn[:-5].lower())
    return existing

def get_existing_themes():
    themes_dir = os.path.join(ROOT, 'themes')
    existing = set()
    if os.path.exists(themes_dir):
        for fn in os.listdir(themes_dir):
            if fn.endswith('.html') and fn != 'index.html':
                existing.add(fn[:-5].lower())
    return existing

def check_commodity_companies():
    """Check commodity front matter companies — warns about tickers with NO mapping AND no page"""
    slug_mapping = load_company_slugs()
    existing_companies = get_existing_companies()
    
    broken = []
    no_page_but_mapped = []
    commodities_dir = os.path.join(ROOT, '_commodities')
    
    for fn in sorted(os.listdir(commodities_dir)):
        if not fn.endswith('.md'):
            continue
        filepath = os.path.join(commodities_dir, fn)
        with open(filepath) as f:
            content = f.read()
        m = re.search(r'^companies:\s*\[([^\]]+)\]', content, re.MULTILINE)
        if not m:
            continue
        companies = [c.strip().strip('"').strip("'") for c in m.group(1).split(',')]
        for co in companies:
            if not co:
                continue
            co_upper = co.upper()
            co_lower = co.lower()
            if co_lower in existing_companies:
                continue  # direct slug match
            if co_upper in slug_mapping:
                mapped_slug = slug_mapping[co_upper].lower()
                if mapped_slug in existing_companies:
                    continue  # mapped to existing page → OK
                else:
                    no_page_but_mapped.append(f"{fn}: {co} → mapped to '{mapped_slug}' but page missing")
            else:
                broken.append(f"{fn}: {co} → no mapping, no page (renders as plain badge)")
    return broken, no_page_but_mapped

def check_html_internal_links():
    """Check rendered HTML for broken /companies/ and /themes/ hrefs"""
    existing_companies = get_existing_companies()
    existing_themes = get_existing_themes()
    
    broken = []
    scan_dirs = ['industries', 'themes', 'companies']
    for scan_dir in scan_dirs:
        scan_path = os.path.join(ROOT, scan_dir)
        if not os.path.exists(scan_path):
            continue
        for fn in sorted(os.listdir(scan_path)):
            if not fn.endswith('.html'):
                continue
            filepath = os.path.join(scan_path, fn)
            with open(filepath) as f:
                content = f.read()
            for m in re.finditer(r'href="/companies/([^/"]+)/"', content):
                slug = m.group(1).lower()
                if slug not in existing_companies:
                    broken.append(f"{scan_dir}/{fn}: /companies/{m.group(1)}/")
            for m in re.finditer(r'href="/themes/([^/"]+)/"', content):
                slug = m.group(1).lower()
                if slug not in existing_themes:
                    broken.append(f"{scan_dir}/{fn}: /themes/{m.group(1)}/")
    return broken

def main():
    print("CommodityNode Link QA")
    print("=" * 60)
    
    print("\n[1] HTML internal links (industries/, themes/, companies/)...")
    broken_html = check_html_internal_links()
    if broken_html:
        print(f"  ❌ BROKEN: {len(broken_html)} links")
        for b in broken_html[:15]:
            print(f"    - {b}")
    else:
        print("  ✅ OK: No broken internal href links found")
    
    print("\n[2] Commodity front matter company refs...")
    unmapped, missing_page = check_commodity_companies()
    if missing_page:
        print(f"  ⚠️  MAPPED but page missing: {len(missing_page)}")
        for b in missing_page[:5]:
            print(f"    - {b}")
    if unmapped:
        print(f"  ℹ️  No mapping (plain badge in UI): {len(unmapped)} tickers")
        for b in unmapped[:5]:
            print(f"    - {b}")
        if len(unmapped) > 5:
            print(f"    ... and {len(unmapped)-5} more (all render as plain text badges, not broken links)")
    if not missing_page and not unmapped:
        print("  ✅ OK: All company refs handled")
    
    print("\n" + "=" * 60)
    critical_issues = len(broken_html) + len(missing_page)
    print(f"Critical broken links: {critical_issues}")
    if unmapped:
        print(f"Non-critical (plain badges, no 404): {len(unmapped)} tickers without company pages")
    
    if critical_issues > 0:
        print("\n❌ FAIL: Critical issues found")
        sys.exit(1)
    else:
        print("\n✅ PASS: No critical link issues")
        sys.exit(0)

if __name__ == '__main__':
    main()
