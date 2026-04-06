#!/usr/bin/env python3
"""Validate front matter schema for all commodity files."""
import os
import sys
import yaml

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMMODITIES_DIR = os.path.join(BASE, '_commodities')

REQUIRED = [
    'title', 'description', 'symbol', 'sector', 'data_type',
    'companies', 'etfs', 'substitutes', 'themes', 'tags', 'image'
]

TITLE_MIN = 50
TITLE_MAX = 70
DESC_MAX = 160


def parse_frontmatter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.startswith('---'):
        return None, 'No front matter opening ---'
    end = content.find('\n---', 3)
    if end == -1:
        return None, 'No front matter closing ---'
    yaml_text = content[3:end]
    try:
        return yaml.safe_load(yaml_text), None
    except yaml.YAMLError as e:
        return None, f'YAML parse error: {e}'


def validate_file(filepath):
    filename = os.path.basename(filepath)
    slug = filename[:-3]
    issues = []
    warnings = []

    fm, err = parse_frontmatter(filepath)
    if fm is None:
        return slug, False, [f'PARSE ERROR: {err}'], []

    # Required field checks
    for field in REQUIRED:
        if field not in fm or fm[field] is None:
            issues.append(f'Missing required field: {field}')
        elif isinstance(fm[field], (list, str)) and not fm[field]:
            issues.append(f'Empty required field: {field}')

    # Title length check
    title = fm.get('title', '')
    if title:
        tlen = len(title)
        if tlen < TITLE_MIN or tlen > TITLE_MAX:
            warnings.append(
                f'Title length {tlen} chars (ideal {TITLE_MIN}-{TITLE_MAX}): "{title}"'
            )

    # Description length check
    desc = fm.get('description', '')
    if desc:
        dlen = len(desc)
        if dlen > DESC_MAX:
            issues.append(
                f'Description too long: {dlen} chars (max {DESC_MAX}): "{desc[:80]}..."'
            )

    passed = len(issues) == 0
    return slug, passed, issues, warnings


def main():
    files = sorted(f for f in os.listdir(COMMODITIES_DIR) if f.endswith('.md'))
    if not files:
        print('No commodity files found.')
        sys.exit(1)

    total = len(files)
    passed_count = 0
    failed_count = 0
    warn_count = 0

    print(f'Validating {total} commodity files...\n')

    for fname in files:
        fpath = os.path.join(COMMODITIES_DIR, fname)
        slug, passed, issues, warnings = validate_file(fpath)

        if passed and not warnings:
            status = 'PASS'
            passed_count += 1
            print(f'  PASS  {slug}')
        elif passed and warnings:
            status = 'WARN'
            passed_count += 1
            warn_count += 1
            print(f'  WARN  {slug}')
            for w in warnings:
                print(f'          [warn] {w}')
        else:
            status = 'FAIL'
            failed_count += 1
            print(f'  FAIL  {slug}')
            for issue in issues:
                print(f'          [error] {issue}')
            for w in warnings:
                print(f'          [warn] {w}')

    print()
    print('=' * 60)
    print(f'Results: {passed_count}/{total} passed, {failed_count} failed, {warn_count} with warnings')
    print('=' * 60)

    if failed_count > 0:
        print(f'\nFAILED: {failed_count} file(s) have missing or invalid required fields.')
        sys.exit(1)
    else:
        print('\nAll required fields present across all commodity files.')
        sys.exit(0)


if __name__ == '__main__':
    main()
