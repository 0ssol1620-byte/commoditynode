#!/usr/bin/env python3
"""Fix all broken company and theme references in commodity front matter."""
import os, re

BASE = '/home/phillip/.openclaw/workspace/commoditynode'
commodities_dir = os.path.join(BASE, '_commodities')
companies_dir = os.path.join(BASE, 'companies')
themes_dir = os.path.join(BASE, 'themes')

# Get existing slugs
existing_companies = set()
for f in os.listdir(companies_dir):
    if f.endswith('.html') and f != 'index.html':
        existing_companies.add(f.replace('.html',''))

existing_themes = set()
for f in os.listdir(themes_dir):
    if f.endswith('.html') and f != 'index.html':
        existing_themes.add(f.replace('.html',''))

# Theme remapping: broken theme name → existing theme slug
THEME_MAP = {
    "Green Hydrogen": "clean-energy",
    "Fertilizer Crisis": "food-security",
    "Critical Minerals": "rare-earth",
    "Defense Supply Chain": "defense-rearming",
    "Infrastructure Spending": "infrastructure-boom",
    "Stainless Steel Demand": None,  # no match, remove
    "South Africa Energy Crisis": "emerging-markets",
    "Renewable Fuels": "carbon-transition",
    "Corn Demand": "food-inflation",
    "Cattle Cycle": None,
    "Drought Impact": "food-security",
    "China Export Controls": "us-china-tariff-war",
    "CHIPS Act": "supply-chain-disruption",
    "5G Rollout": None,
    "Defense Optics": "defense-rearming",
    "Fiber Broadband Expansion": None,
    "EV Battery Supply Chain": "battery-metals",
    "US Federal Helium Reserve Depletion": None,
    "Semiconductor Fab Expansion": "supply-chain-disruption",
    "MRI Demand Growth": None,
    "Clean Energy Transition": "clean-energy",
    "Industrial Decarbonization": "carbon-transition",
    "Display Technology": None,
    "Solar Energy": "clean-energy",
    "Chinese Demand": "emerging-markets",
    "ASF Disease Risk": None,
    "Protein Demand": "food-security",
    "Steel Production": "infrastructure-boom",
    "EV Batteries": "battery-metals",
    "Oil & Gas Capex Cycle": None,
    "Copper Mine By-Product": None,
    "Semiconductor Supply Chain": "supply-chain-disruption",
    "Health Food Trends": None,
    "Plant-Based": None,
    "Citrus Greening Disease": None,
    "Florida Agriculture": None,
    "Morocco Reserve Dominance": "geopolitical-risk",
    "Population Growth": "food-security",
    "EV Motors": "ev-transition",
    "China Dominance": "us-china-tariff-war",
    "Auto Emissions": "carbon-transition",
    "PGM Supply Deficit": "supply-chain-disruption",
    "Asian Demand": "emerging-markets",
    "Auto Industry": "ev-transition",
    "Southeast Asian Agriculture": "emerging-markets",
    "Solar Energy Transition": "clean-energy",
    "Semiconductor Expansion": "ai-power-demand",
    "China Polysilicon Dominance": "us-china-tariff-war",
    "Animal Feed": "food-security",
    "Crush Spread": None,
    "Renewable Diesel": "carbon-transition",
    "Aerospace Supply Chain": "defense-rearming",
    "Defense Reshoring": "defense-rearming",
    "China Supply Dominance": "us-china-tariff-war",
    "Defense Spending": "defense-rearming",
    "Industrial Reshoring": "deglobalization",
    "Grid-Scale Energy Storage": "clean-energy",
    "Steel Alloys": "infrastructure-boom",
    "Climate Change": "water-scarcity",
    "Resource Scarcity": "water-scarcity",
}

# Reverse lookup: theme slug → display name
THEME_SLUG_TO_NAME = {
    "agritech": "Agritech",
    "ai-power-demand": "AI Power Demand",
    "battery-metals": "Battery Metals",
    "carbon-transition": "Carbon Transition",
    "circular-economy": "Circular Economy",
    "clean-energy": "Clean Energy",
    "defense-rearming": "Defense Rearming",
    "deglobalization": "Deglobalization",
    "emerging-markets": "Emerging Markets",
    "ev-transition": "EV Transition",
    "food-inflation": "Food Inflation",
    "food-security": "Food Security",
    "geopolitical-risk": "Geopolitical Risk",
    "inflation-hedge": "Inflation Hedge",
    "infrastructure-boom": "Infrastructure Boom",
    "nuclear-renaissance": "Nuclear Renaissance",
    "rare-earth": "Rare Earth",
    "space-economy": "Space Economy",
    "supply-chain-disruption": "Supply Chain Disruption",
    "trump-tariffs": "Trump Tariffs",
    "us-china-tariff-war": "US-China Tariff War",
    "water-scarcity": "Water Scarcity",
}

def slug_for_company(name):
    return name.lower().replace(' ', '-').replace('.', '').replace('&', 'and')

def slug_for_theme(name):
    return name.lower().replace(' ', '-')

fixes_company_removed = 0
fixes_theme_remapped = 0
fixes_theme_removed = 0
files_modified = 0

for fname in sorted(os.listdir(commodities_dir)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(commodities_dir, fname)
    with open(fpath) as f:
        content = f.read()
    
    original = content
    
    # Fix companies: remove ones without matching pages
    m = re.search(r'^(companies:\s*\[)([^\]]*)(\])', content, re.MULTILINE)
    if m:
        companies = [c.strip().strip('"\'') for c in m.group(2).split(',') if c.strip()]
        valid = []
        for company in companies:
            slug = slug_for_company(company)
            if slug in existing_companies:
                valid.append(company)
            else:
                fixes_company_removed += 1
                print(f"  REMOVE company {company} from {fname}")
        new_list = ', '.join(f'"{c}"' for c in valid)
        content = content[:m.start()] + f'companies: [{new_list}]' + content[m.end():]
    
    # Fix themes: remap or remove
    m = re.search(r'^(themes:\s*\[)([^\]]*)(\])', content, re.MULTILINE)
    if m:
        themes = [t.strip().strip('"\'') for t in m.group(2).split(',') if t.strip()]
        valid = []
        seen_slugs = set()
        for theme in themes:
            slug = slug_for_theme(theme)
            if slug in existing_themes:
                if slug not in seen_slugs:
                    valid.append(theme)
                    seen_slugs.add(slug)
            elif theme in THEME_MAP:
                new_slug = THEME_MAP[theme]
                if new_slug and new_slug not in seen_slugs:
                    new_name = THEME_SLUG_TO_NAME.get(new_slug, theme)
                    valid.append(new_name)
                    seen_slugs.add(new_slug)
                    fixes_theme_remapped += 1
                    print(f"  REMAP theme '{theme}' → '{new_name}' in {fname}")
                else:
                    fixes_theme_removed += 1
                    print(f"  REMOVE theme '{theme}' from {fname}")
            else:
                fixes_theme_removed += 1
                print(f"  REMOVE theme '{theme}' from {fname}")
        new_list = ', '.join(f'"{t}"' for t in valid)
        content = content[:m.start()] + f'themes: [{new_list}]' + content[m.end():]
    
    if content != original:
        with open(fpath, 'w') as f:
            f.write(content)
        files_modified += 1

print(f"\n=== SUMMARY ===")
print(f"Files modified: {files_modified}")
print(f"Companies removed: {fixes_company_removed}")
print(f"Themes remapped: {fixes_theme_remapped}")
print(f"Themes removed: {fixes_theme_removed}")
print(f"Total fixes: {fixes_company_removed + fixes_theme_remapped + fixes_theme_removed}")
