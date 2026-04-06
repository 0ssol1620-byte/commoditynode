#!/usr/bin/env python3
"""
Add data_type front matter field to all commodity files.
Inserts the field right after the symbol: line, or after sector: if no symbol line.
"""

import os
import re

COMMODITIES_DIR = "/home/phillip/.openclaw/workspace/commoditynode/_commodities"

# Classification maps based on commodity slug (filename without .md)
DIRECT_FUTURES = {
    "aluminum",       # ALI=F
    "cocoa",          # CC=F
    "coffee",         # KC=F
    "copper",         # HG=F
    "corn",           # ZC=F
    "cotton",         # CT=F
    "crude-oil",      # CL=F
    "diesel",         # HO=F
    "feeder-cattle",  # GF=F
    "gold",           # GC=F
    "lean-hogs",      # HE=F
    "live-cattle",    # LE=F
    "natural-gas",    # NG=F
    "oats",           # ZO=F
    "orange-juice",   # OJ=F
    "palladium",      # PA=F
    "platinum",       # PL=F
    "rice",           # ZR=F
    "silver",         # SI=F
    "soybean-meal",   # ZM=F
    "soybean-oil",    # ZL=F
    "soybeans",       # ZS=F
    "sugar",          # SB=F
    "wheat",          # ZW=F
    "zinc",           # ZNC=F
}

ANALYSIS_ONLY = {
    "chromium",
    "gallium",
    "germanium",
    "helium",
    "molybdenum",
    "silicon",
    "tin",
    "tungsten",
}

# Everything else is proxy (including jet-fuel and palm-oil despite =F symbols)


def classify(slug):
    if slug in ANALYSIS_ONLY:
        return "analysis_only"
    if slug in DIRECT_FUTURES:
        return "direct_futures"
    return "proxy"


def process_file(filepath, slug):
    data_type = classify(slug)
    insert_line = f'data_type: "{data_type}"\n'

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.splitlines(keepends=True)

    # Find the front matter block (between first two --- markers)
    fm_start = None
    fm_end = None
    for i, line in enumerate(lines):
        if line.strip() == "---":
            if fm_start is None:
                fm_start = i
            else:
                fm_end = i
                break

    if fm_start is None or fm_end is None:
        print(f"  WARNING: No front matter found in {slug}.md — skipping")
        return False

    # Check if data_type already exists
    for line in lines[fm_start:fm_end]:
        if line.startswith("data_type:"):
            print(f"  SKIP: {slug}.md already has data_type")
            return False

    # Find insertion point: after symbol: line, or after sector: line
    insert_after = None
    for i in range(fm_start + 1, fm_end):
        if lines[i].startswith("symbol:"):
            insert_after = i
            break

    if insert_after is None:
        # Fall back to after sector: line
        for i in range(fm_start + 1, fm_end):
            if lines[i].startswith("sector:"):
                insert_after = i
                break

    if insert_after is None:
        print(f"  WARNING: No symbol: or sector: line found in {slug}.md — inserting before closing ---")
        insert_after = fm_end - 1

    # Insert the data_type line after the target line
    lines.insert(insert_after + 1, insert_line)

    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(lines)

    print(f"  OK: {slug}.md -> {data_type}")
    return True


def main():
    files = sorted(f for f in os.listdir(COMMODITIES_DIR) if f.endswith(".md"))
    print(f"Found {len(files)} .md files\n")

    processed = 0
    skipped = 0
    for filename in files:
        slug = filename[:-3]  # strip .md
        filepath = os.path.join(COMMODITIES_DIR, filename)
        result = process_file(filepath, slug)
        if result:
            processed += 1
        else:
            skipped += 1

    print(f"\nDone. Processed: {processed}, Skipped: {skipped}")


if __name__ == "__main__":
    main()
