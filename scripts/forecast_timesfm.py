#!/usr/bin/env python3
"""
Scaffold for TimesFM 2.5 forecasting on CommodityNode.

This file intentionally starts as a safe integration scaffold so the project can
standardize artifact paths and schema before full model execution is wired in.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "assets" / "data" / "forecast-timesfm.json"

COMMODITIES = [
    "crude_oil", "gold", "copper", "natural_gas", "silver", "wheat",
    "corn", "soybeans", "coffee", "sugar", "cocoa", "cotton",
    "orange_juice", "lumber", "platinum", "palladium", "aluminum",
    "uranium", "lithium",
]


def build_stub() -> dict:
    now = datetime.now(timezone.utc).isoformat()
    payload = {}
    for key in COMMODITIES:
        payload[key] = {
            "model": "timesfm-2.5",
            "status": "scaffold",
            "updated_at": now,
            "horizon_days": 90,
            "notes": "TimesFM integration scaffold only. Full inference not wired yet.",
            "current_price": None,
            "direction": None,
            "confidence": None,
            "dates": [],
            "median": [],
            "p10": [],
            "p90": [],
        }
    return payload


def main() -> int:
    payload = build_stub()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2) + "\n")
    print(json.dumps({
        "ok": True,
        "message": "TimesFM scaffold artifact written",
        "path": str(OUTPUT_PATH),
        "commodities": len(payload),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
