#!/usr/bin/env python3
"""
CommodityNode Link QA Script
Usage: python3 scripts/qa_links.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_existing_pages():
    existing = set()
    for dirpath, dirnames, filenames in os.walk(ROOT):
        for fn in filenames:
            if fn.endswith('.html') or fn.endswith('.md'):
                rel = os.path.relpath(os.path.join(dirpath, fn), ROOT)
                # Convert to URL slug
                slug = rel.replace('\\', '/')
                existing.add(slug)
    return existing

def check_company_links():
    """Check commodity front matter company links against actual company pages"""
    companies_dir = os.path.join(ROOT, 'companies')
    if not os.path.exists(companies_dir):
        print("WARNING: companies/ directory not found")
        return []
    
    existing_companies = set()
    for fn in os.listdir(companies_dir):
        if fn.endswith('.html') and fn != 'index.html':
            existing_companies.add(fn[:-5])  # strip .html
    
    broken = []
    commodities_dir = os.path.join(ROOT, '_commodities')
    for fn in os.listdir(commodities_dir):
        if not fn.endswith('.md'):
            continue
        filepath = os.path.join(commodities_dir, fn)
        with open(filepath) as f:
            content = f.read()
        # Extract companies list from front matter
        m = re.search(r'^companies:\s*\[([^\]]+)\]', content, re.MULTILINE)
        if m:
            companies = [c.strip().strip('"').strip("'") for c in m.group(1).split(',')]
            for company in companies:
                if company and company.lower() not in existing_companies:
                    broken.append(f"{fn}: /companies/{company}/ -> NOT FOUND")
    return broken

def check_internal_hrefs():
    """Check all HTML files for broken internal /companies/ and /themes/ links"""
    broken = []
    companies_dir = os.path.join(ROOT, 'companies')
    themes_dir = os.path.join(ROOT, 'themes')
    
    existing_companies = set()
    if os.path.exists(companies_dir):
        for fn in os.listdir(companies_dir):
            if fn.endswith('.html') and fn != 'index.html':
                existing_companies.add(fn[:-5].lower())
    
    existing_themes = set()
    if os.path.exists(themes_dir):
        for fn in os.listdir(themes_dir):
            if fn.endswith('.html') and fn != 'index.html':
                existing_themes.add(fn[:-5].lower())
    
    scan_dirs = ['industries', 'themes', 'companies']
    for scan_dir in scan_dirs:
        scan_path = os.path.join(ROOT, scan_dir)
        if not os.path.exists(scan_path):
            continue
        for fn in os.listdir(scan_path):
            if not fn.endswith('.html'):
                continue
            filepath = os.path.join(scan_path, fn)
            with open(filepath) as f:
                content = f.read()
            # Check /companies/ links
            for m in re.finditer(r'href="/companies/([^/"]+)/"', content):
                slug = m.group(1).lower()
                if slug not in existing_companies:
                    broken.append(f"{scan_dir}/{fn}: /companies/{m.group(1)}/ -> NOT FOUND")
            # Check /themes/ links
            for m in re.finditer(r'href="/themes/([^/"]+)/"', content):
                slug = m.group(1).lower()
                if slug not in existing_themes:
                    broken.append(f"{scan_dir}/{fn}: /themes/{m.group(1)}/ -> NOT FOUND")
    return broken

def main():
    print("CommodityNode Link QA")
    print("=" * 50)
    
    print("\n[1] Checking commodity -> company links...")
    broken_companies = check_company_links()
    if broken_companies:
        print(f"  BROKEN: {len(broken_companies)} links")
        for b in broken_companies[:10]:
            print(f"    - {b}")
        if len(broken_companies) > 10:
            print(f"    ... and {len(broken_companies)-10} more")
    else:
        print("  OK: No broken company links in _commodities front matter")
    
    print("\n[2] Checking HTML internal links...")
    broken_html = check_internal_hrefs()
    if broken_html:
        print(f"  BROKEN: {len(broken_html)} links")
        for b in broken_html[:10]:
            print(f"    - {b}")
        if len(broken_html) > 10:
            print(f"    ... and {len(broken_html)-10} more")
    else:
        print("  OK: No broken internal href links found")
    
    total = len(broken_companies) + len(broken_html)
    print(f"\nTotal broken links: {total}")
    
    if total > 0:
        sys.exit(1)
    else:
        print("All checks passed!")
        sys.exit(0)

if __name__ == '__main__':
    main()
