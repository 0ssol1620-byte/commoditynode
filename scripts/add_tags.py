#!/usr/bin/env python3
"""Add tags front matter field to commodity files that are missing it."""

import os
import re

COMMODITIES_DIR = "/home/phillip/.openclaw/workspace/commoditynode/_commodities"

SLUGS = [
    "aluminum", "antimony", "coal", "cobalt", "cocoa", "coffee", "cotton",
    "diesel", "indium", "iridium", "iron-ore", "jet-fuel", "lean-hogs",
    "lithium", "live-cattle", "lng", "lumber", "neon", "nickel", "palladium",
    "platinum", "silver", "soybean-oil", "soybeans", "steel", "sugar",
    "tin", "titanium", "uranium", "water", "zinc"
]

def add_tags_to_file(filepath, slug):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if tags already exists in front matter
    # Front matter is between the first two ---
    fm_match = re.match(r"^(---\n)(.*?)(---\n)", content, re.DOTALL)
    if not fm_match:
        print(f"  SKIP (no front matter): {filepath}")
        return False

    fm_open = fm_match.group(1)
    fm_body = fm_match.group(2)
    fm_close = fm_match.group(3)
    rest = content[fm_match.end():]

    if re.search(r"^tags:", fm_body, re.MULTILINE):
        print(f"  SKIP (tags exists): {os.path.basename(filepath)}")
        return False

    # Add tags after the last field in front matter (before closing ---)
    tags_line = f'tags: ["{slug}"]\n'
    new_fm_body = fm_body.rstrip("\n") + "\n" + tags_line
    new_content = fm_open + new_fm_body + fm_close + rest

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  ADDED tags: [{slug}] to {os.path.basename(filepath)}")
    return True

def main():
    added = 0
    skipped = 0
    missing = 0

    for slug in SLUGS:
        filepath = os.path.join(COMMODITIES_DIR, f"{slug}.md")
        if not os.path.exists(filepath):
            print(f"  MISSING file: {filepath}")
            missing += 1
            continue

        result = add_tags_to_file(filepath, slug)
        if result:
            added += 1
        else:
            skipped += 1

    print(f"\nDone: {added} added, {skipped} skipped, {missing} missing files.")

if __name__ == "__main__":
    main()
