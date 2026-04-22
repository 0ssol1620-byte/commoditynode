#!/usr/bin/env python3
"""Mirror _data/pricing.yml into assets/data/pricing-manifest.json.

Keeps a single source-of-truth for pricing copy: Liquid templates read
_data/pricing.yml, and any client-side JS (paywall blur, price alert,
enterprise form, promo banners) reads /assets/data/pricing-manifest.json.
"""
from __future__ import annotations

import json
import os
import sys

try:
    import yaml
except ImportError:
    sys.stderr.write("[pricing-manifest] PyYAML is required. Install with: pip install pyyaml\n")
    raise

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_data", "pricing.yml")
DST = os.path.join(ROOT, "assets", "data", "pricing-manifest.json")


def resolve_refs(data, root):
    if isinstance(data, dict):
        out = {}
        for k, v in data.items():
            if k.endswith("_ref") and isinstance(v, str):
                target_key = k[:-4]
                out[target_key] = _deref(v, root)
            else:
                out[k] = resolve_refs(v, root)
        return out
    if isinstance(data, list):
        return [resolve_refs(x, root) for x in data]
    return data


def _deref(path, root):
    cur = root
    for part in path.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def main():
    if not os.path.exists(SRC):
        sys.stderr.write(f"[pricing-manifest] missing: {SRC}\n")
        return 1
    with open(SRC, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    resolved = resolve_refs(data, data)
    os.makedirs(os.path.dirname(DST), exist_ok=True)
    payload = json.dumps(resolved, ensure_ascii=False, separators=(",", ":"))
    with open(DST, "w", encoding="utf-8") as f:
        f.write(payload)
    print(f"[ok] wrote {DST} ({len(payload):,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
