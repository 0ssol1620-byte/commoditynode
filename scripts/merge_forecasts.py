#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHRONOS_PATH = ROOT / "assets" / "data" / "forecast.json"
TIMESFM_PATH = ROOT / "assets" / "data" / "forecast-timesfm.json"
OUTPUT_PATH = ROOT / "assets" / "data" / "forecast-consensus.json"


def avg(a, b):
    if a is None:
        return b
    if b is None:
        return a
    return (a + b) / 2.0


def agreement_level(score: float) -> str:
    if score >= 0.8:
        return "high"
    if score >= 0.55:
        return "moderate"
    return "divergent"


def merge_one(key: str, chronos: dict | None, timesfm: dict | None) -> dict:
    chronos = chronos or {}
    timesfm = timesfm or {}

    c_dir = chronos.get("direction")
    t_dir = timesfm.get("direction")
    direction_match = bool(c_dir and t_dir and c_dir == t_dir)

    c_conf = chronos.get("confidence")
    t_conf = timesfm.get("confidence")
    merged_conf = avg(c_conf, t_conf)

    if c_dir and t_dir:
        consensus_direction = c_dir if c_dir == t_dir else "mixed"
    else:
        consensus_direction = c_dir or t_dir

    score = 0.85 if direction_match else 0.45
    if merged_conf is not None:
        score = min(0.95, max(0.2, avg(score, merged_conf)))

    return {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "horizon_days": chronos.get("horizon_days") or timesfm.get("horizon_days") or 90,
        "models": {
            "chronos2": chronos,
            "timesfm": timesfm,
        },
        "consensus": {
            "direction": consensus_direction,
            "confidence": merged_conf,
            "current_price": chronos.get("current_price") or timesfm.get("current_price"),
            "dates": chronos.get("dates") or timesfm.get("dates") or [],
            "median": chronos.get("median") or [],
            "p10": chronos.get("p10") or [],
            "p90": chronos.get("p90") or [],
            "status": "consensus_scaffold"
        },
        "agreement": {
            "level": agreement_level(score),
            "score": round(score, 4),
            "direction_match": direction_match,
        }
    }


def main() -> int:
    chronos = json.loads(CHRONOS_PATH.read_text()) if CHRONOS_PATH.exists() else {}
    timesfm = json.loads(TIMESFM_PATH.read_text()) if TIMESFM_PATH.exists() else {}

    keys = sorted(set(chronos.keys()) | set(timesfm.keys()))
    merged = {key: merge_one(key, chronos.get(key), timesfm.get(key)) for key in keys}

    OUTPUT_PATH.write_text(json.dumps(merged, indent=2) + "\n")
    print(json.dumps({
        "ok": True,
        "message": "Consensus forecast scaffold written",
        "path": str(OUTPUT_PATH),
        "commodities": len(merged),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
