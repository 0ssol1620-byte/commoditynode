#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHRONOS_PATH = ROOT / "assets" / "data" / "forecast.json"
OUTPUT_PATH = ROOT / "assets" / "data" / "forecast-consensus.json"


def avg(a, b):
    if a is None:
        return b
    if b is None:
        return a
    return (a + b) / 2.0


def avg_lists(a, b):
    out = []
    n = max(len(a), len(b))
    for i in range(n):
        av = a[i] if i < len(a) else None
        bv = b[i] if i < len(b) else None
        out.append(avg(av, bv))
    return out


def wider_low(a, b):
    out = []
    n = max(len(a), len(b))
    for i in range(n):
        vals = [v for v in [(a[i] if i < len(a) else None), (b[i] if i < len(b) else None)] if v is not None]
        out.append(min(vals) if vals else None)
    return out


def wider_high(a, b):
    out = []
    n = max(len(a), len(b))
    for i in range(n):
        vals = [v for v in [(a[i] if i < len(a) else None), (b[i] if i < len(b) else None)] if v is not None]
        out.append(max(vals) if vals else None)
    return out


def agreement_level(score: float) -> str:
    if score >= 0.8:
        return "high"
    if score >= 0.55:
        return "moderate"
    return "divergent"


def normalize_chronos(entry: dict | None) -> dict:
    entry = entry or {}
    fc = entry.get("forecast") or {}
    sig = entry.get("direction_signal") or {}
    return {
        "name": entry.get("name"),
        "unit": entry.get("unit"),
        "symbol": entry.get("symbol"),
        "current_price": entry.get("current_price"),
        "forecast_30d": entry.get("forecast_30d"),
        "forecast_90d": entry.get("forecast_90d"),
        "change_30d_pct": entry.get("change_30d_pct"),
        "change_90d_pct": entry.get("change_90d_pct"),
        "direction": (sig.get("label") or "").lower() if sig.get("label") else None,
        "confidence": sig.get("confidence"),
        "model": entry.get("model", "amazon/chronos-2"),
        "dates": fc.get("dates") or [],
        "median": fc.get("median") or [],
        "p10": fc.get("p10_extreme") or fc.get("p10") or fc.get("p25") or [],
        "p90": fc.get("p90_extreme") or fc.get("p90") or fc.get("p75") or [],
        "raw": entry,
    }


def normalize_timesfm(entry: dict | None, chronos_current_price=None) -> dict:
    tf = (entry or {}).get("timesfm_forecast") or {}
    median = tf.get("median") or []
    current = (entry or {}).get("current_price") or chronos_current_price
    forecast_30d = median[29] if len(median) > 29 else None
    forecast_90d = median[89] if len(median) > 89 else None
    change_30d = ((forecast_30d - current) / current * 100) if current and forecast_30d is not None else None
    change_90d = ((forecast_90d - current) / current * 100) if current and forecast_90d is not None else None
    direction = None
    if change_90d is not None:
        if abs(change_90d) < 0.3:
            direction = "neutral"
        else:
            direction = "bullish" if change_90d > 0 else "bearish"
    confidence = None
    p10 = tf.get("p10") or []
    p90 = tf.get("p90") or []
    if current and forecast_90d is not None and len(p10) > 89 and len(p90) > 89:
        lo = p10[89]
        hi = p90[89]
        band = abs(hi - lo)
        confidence = max(0.25, min(0.9, 1 - (band / max(abs(current), 1e-9)) * 0.5))
    return {
        "name": (entry or {}).get("name"),
        "unit": (entry or {}).get("unit"),
        "symbol": (entry or {}).get("symbol"),
        "current_price": current,
        "forecast_30d": forecast_30d,
        "forecast_90d": forecast_90d,
        "change_30d_pct": round(change_30d, 2) if change_30d is not None else None,
        "change_90d_pct": round(change_90d, 2) if change_90d is not None else None,
        "direction": direction,
        "confidence": round(confidence, 4) if confidence is not None else None,
        "model": tf.get("model", "google/timesfm-2.5-200m-pytorch"),
        "dates": tf.get("dates") or [],
        "median": median,
        "p10": p10,
        "p90": p90,
        "raw": tf,
    }


def merge_one(key: str, entry: dict | None) -> dict:
    entry = entry or {}
    chronos = normalize_chronos(entry)
    timesfm = normalize_timesfm(entry, chronos_current_price=chronos.get("current_price"))

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

    c_med = chronos.get("median") or []
    t_med = timesfm.get("median") or []
    c_p10 = chronos.get("p10") or []
    t_p10 = timesfm.get("p10") or []
    c_p90 = chronos.get("p90") or []
    t_p90 = timesfm.get("p90") or []

    consensus_median = avg_lists(c_med, t_med) if c_med and t_med else (c_med or t_med)
    consensus_p10 = wider_low(c_p10, t_p10) if c_p10 and t_p10 else (c_p10 or t_p10)
    consensus_p90 = wider_high(c_p90, t_p90) if c_p90 and t_p90 else (c_p90 or t_p90)
    consensus_dates = chronos.get("dates") or timesfm.get("dates") or []
    current_price = chronos.get("current_price") or timesfm.get("current_price")

    gap30 = None
    gap90 = None
    if chronos.get("forecast_30d") is not None and timesfm.get("forecast_30d") is not None and current_price:
        gap30 = abs(chronos["forecast_30d"] - timesfm["forecast_30d"]) / current_price * 100
    if chronos.get("forecast_90d") is not None and timesfm.get("forecast_90d") is not None and current_price:
        gap90 = abs(chronos["forecast_90d"] - timesfm["forecast_90d"]) / current_price * 100

    return {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "horizon_days": 90,
        "models": {
            "chronos2": chronos,
            "timesfm": timesfm,
        },
        "consensus": {
            "direction": consensus_direction,
            "confidence": round(merged_conf, 4) if merged_conf is not None else None,
            "current_price": current_price,
            "dates": consensus_dates,
            "median": consensus_median,
            "p10": consensus_p10,
            "p90": consensus_p90,
            "forecast_30d": consensus_median[29] if len(consensus_median) > 29 else None,
            "forecast_90d": consensus_median[89] if len(consensus_median) > 89 else None,
            "status": "ready"
        },
        "agreement": {
            "level": agreement_level(score),
            "score": round(score, 4),
            "direction_match": direction_match,
            "median_gap_day_30_pct": round(gap30, 2) if gap30 is not None else None,
            "median_gap_day_90_pct": round(gap90, 2) if gap90 is not None else None,
        }
    }


def main() -> int:
    chronos = json.loads(CHRONOS_PATH.read_text()) if CHRONOS_PATH.exists() else {}
    keys = sorted(chronos.keys())
    merged = {key: merge_one(key, chronos.get(key)) for key in keys}

    OUTPUT_PATH.write_text(json.dumps(merged, indent=2) + "\n")
    print(json.dumps({
        "ok": True,
        "message": "Consensus forecast written",
        "path": str(OUTPUT_PATH),
        "commodities": len(merged),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
