#!/usr/bin/env python3
"""Split assets/data/chart-data.json into per-symbol slices.

Writes assets/data/chart-data/{symbol-slug}.json so price-chart.js can
load a small slice (one per commodity) instead of pulling the full
~640KB bundle. price-chart.js falls back to the full file for any
symbol that doesn't have a slice.
"""
from __future__ import annotations

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "data", "chart-data.json")
OUT_DIR = os.path.join(ROOT, "assets", "data", "chart-data")


def slugify(symbol: str) -> str:
    # CL=F -> cl. ZS=F -> zs. ZC=F -> zc.
    base = re.split(r"[=\.]", symbol, 1)[0]
    return base.lower()


def main() -> int:
    if not os.path.exists(SRC):
        print(f"[chart-slices] source missing: {SRC}")
        return 1
    with open(SRC, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        print("[chart-slices] unexpected top-level structure")
        return 1
    os.makedirs(OUT_DIR, exist_ok=True)
    written = 0
    total_bytes = 0
    for symbol, payload in data.items():
        slug = slugify(symbol)
        if not slug:
            continue
        slice_body = {"symbol": symbol, **payload} if isinstance(payload, dict) else {"symbol": symbol, "data": payload}
        out_path = os.path.join(OUT_DIR, f"{slug}.json")
        body = json.dumps(slice_body, ensure_ascii=False, separators=(",", ":"))
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(body)
        total_bytes += len(body)
        written += 1
    print(f"[chart-slices] wrote {written} slices to {OUT_DIR} ({total_bytes:,} bytes total)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
