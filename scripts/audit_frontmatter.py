#!/usr/bin/env python3
"""Audit front matter fields in all commodity .md files."""

import os
import yaml

COMMODITIES_DIR = "/home/phillip/.openclaw/workspace/commoditynode/_commodities"
REQUIRED_FIELDS = ["sector", "companies", "etfs", "substitutes", "tags", "themes"]


def parse_frontmatter(filepath):
    """Extract YAML front matter from a markdown file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if not content.startswith("---"):
        return None

    # Find closing ---
    end = content.find("\n---", 3)
    if end == -1:
        return None

    yaml_text = content[3:end]
    try:
        return yaml.safe_load(yaml_text)
    except yaml.YAMLError:
        return None


def main():
    files = sorted(
        f for f in os.listdir(COMMODITIES_DIR) if f.endswith(".md")
    )

    missing = {field: [] for field in REQUIRED_FIELDS}
    all_present = []
    has_missing = []
    parse_errors = []

    for filename in files:
        slug = filename[:-3]  # strip .md
        filepath = os.path.join(COMMODITIES_DIR, filename)
        fm = parse_frontmatter(filepath)

        if fm is None:
            parse_errors.append(slug)
            for field in REQUIRED_FIELDS:
                missing[field].append(slug)
            has_missing.append(slug)
            continue

        file_missing = False
        for field in REQUIRED_FIELDS:
            if field not in fm or fm[field] is None:
                missing[field].append(slug)
                file_missing = True

        if file_missing:
            has_missing.append(slug)
        else:
            all_present.append(slug)

    print("=== Front Matter Audit ===")
    print(f"Total files: {len(files)}")
    print(f"Files with all required fields: {len(all_present)}")
    print(f"Files missing fields: {len(has_missing)}")

    if parse_errors:
        print(f"\nParse errors (no valid front matter): {parse_errors}")

    print()
    for field in REQUIRED_FIELDS:
        slugs = missing[field]
        if slugs:
            print(f"Missing '{field}' ({len(slugs)}): {slugs}")
        else:
            print(f"Missing '{field}' (0): []")


if __name__ == "__main__":
    main()
