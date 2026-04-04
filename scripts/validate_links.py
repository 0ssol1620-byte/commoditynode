#!/usr/bin/env python3
"""
CommodityNode Link Validation Script
Checks: commodity→company, commodity→theme, public href validity
"""
import os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors = []

# 1. Check commodity front matter company links
commodities_dir = os.path.join(BASE, '_commodities')
companies_dir = os.path.join(BASE, 'companies')
themes_dir = os.path.join(BASE, 'themes')

for fname in sorted(os.listdir(commodities_dir)):
    if not fname.endswith('.md'): continue
    fpath = os.path.join(commodities_dir, fname)
    with open(fpath) as f:
        content = f.read()
    
    # Check companies
    m = re.search(r'^companies:\s*\[([^\]]*)\]', content, re.MULTILINE)
    if m:
        companies = [c.strip().strip('"\'') for c in m.group(1).split(',') if c.strip()]
        for company in companies:
            slug = company.lower().replace(' ', '-').replace('.', '').replace('&', 'and')
            html_path = os.path.join(companies_dir, f"{slug}.html")
            if not os.path.exists(html_path):
                errors.append(f"BROKEN company link: {fname} → companies/{slug}.html")
    
    # Check themes  
    m = re.search(r'^themes:\s*\[([^\]]*)\]', content, re.MULTILINE)
    if m:
        themes = [t.strip().strip('"\'') for t in m.group(1).split(',') if t.strip()]
        for theme in themes:
            slug = theme.lower().replace(' ', '-')
            html_path = os.path.join(themes_dir, f"{slug}.html")
            if not os.path.exists(html_path):
                errors.append(f"BROKEN theme link: {fname} → themes/{slug}.html")

# 2. Check public hrefs in HTML files for /commodities/ links
html_dirs = [companies_dir, themes_dir, os.path.join(BASE, 'industries')]
for d in html_dirs:
    if not os.path.isdir(d): continue
    for fname in sorted(os.listdir(d)):
        if not fname.endswith('.html'): continue
        fpath = os.path.join(d, fname)
        with open(fpath) as f:
            html = f.read()
        for m in re.finditer(r'href="(/commodities/[^"]+/)"', html):
            href = m.group(1)
            slug = href.strip('/').split('/')[-1]
            md_path = os.path.join(commodities_dir, f"{slug}.md")
            if not os.path.exists(md_path):
                errors.append(f"BROKEN commodity href: {fname} → {href}")

if errors:
    print(f"❌ Found {len(errors)} broken links:")
    for e in errors[:20]:
        print(f"  {e}")
    if len(errors) > 20:
        print(f"  ... and {len(errors)-20} more")
    sys.exit(1)
else:
    print("✅ All commodity links valid")
