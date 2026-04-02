#!/usr/bin/env python3
"""
CommodityNode QA Check Script
빌드 전 실행: python3 scripts/qa_check.py
"""
import os, json, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors = []
warnings = []

def check(condition, msg, level='error'):
    if not condition:
        (errors if level=='error' else warnings).append(msg)

# 1. prices.json 심볼 중복 체크
with open(os.path.join(BASE, 'assets/data/prices.json')) as f:
    prices = json.load(f)

symbols = [v.get('symbol') for v in prices.values()]
dupes = [s for s in symbols if symbols.count(s) > 1]
check(len(dupes) == 0, f'중복 심볼: {set(dupes)}')

# 2. forecast.json 키 체크
fc_path = os.path.join(BASE, 'assets/data/forecast.json')
if os.path.exists(fc_path):
    with open(fc_path) as f:
        forecast = json.load(f)
    for key, data in forecast.items():
        check('forecast' in data, f'forecast.json/{key}: forecast 키 없음')
        check('history' in data, f'forecast.json/{key}: history 키 없음')
        if 'forecast' in data:
            fc = data['forecast']
            check(len(fc.get('median',[])) == 90, f'forecast.json/{key}: median 길이 != 90')
            check(len(fc.get('p10',[])) == 90, f'forecast.json/{key}: p10 길이 != 90')
            check(len(fc.get('p90',[])) == 90, f'forecast.json/{key}: p90 길이 != 90')

# 3. _commodities/ description 누락 체크
comm_dir = os.path.join(BASE, '_commodities')
if os.path.exists(comm_dir):
    for fname in sorted(os.listdir(comm_dir)):
        if not fname.endswith('.md'): continue
        with open(os.path.join(comm_dir, fname)) as f:
            content = f.read()
        check('description:' in content, f'_commodities/{fname}: description 없음', 'warning')

# 4. 내부 운영 문서 공개 노출 체크
internal_docs = ['AUDIT_REPORT.md', 'CRON_SETUP.md', 'DEV_TODO.md', 
                 'FINAL_AUDIT.md', 'FINAL_CHECK.md', 'QUALITY_REPORT.md',
                 'ROADMAP.md', 'SEO_AUDIT.md']
for doc in internal_docs:
    check(not os.path.exists(os.path.join(BASE, doc)), 
          f'내부 문서 공개 노출: {doc}')

# 5. OG image 존재 체크
og_img = os.path.join(BASE, 'assets/images/og-default.png')
check(os.path.exists(og_img), 'og-default.png 없음', 'warning')

# 6. favicon 체크
check(os.path.exists(os.path.join(BASE, 'favicon.ico')), 'favicon.ico 없음', 'warning')
check(os.path.exists(os.path.join(BASE, 'favicon.png')), 'favicon.png 없음', 'warning')

# 결과 출력
print(f'\n=== CommodityNode QA Check ===')
print(f'Errors: {len(errors)} | Warnings: {len(warnings)}')
if errors:
    print('\n❌ ERRORS:')
    for e in errors: print(f'  {e}')
if warnings:
    print('\n⚠️  WARNINGS:')
    for w in warnings: print(f'  {w}')
if not errors and not warnings:
    print('✅ All checks passed!')

sys.exit(1 if errors else 0)
