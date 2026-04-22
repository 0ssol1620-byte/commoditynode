#!/usr/bin/env python3
"""Generate assets/data/home-forecast-summary.json.

Home surface only needs gold / copper / crude_oil with trimmed
history + forecast + consensus slices. Produces a file well under
100KB so the homepage avoids pulling the full 2MB forecast bundle.
"""
from __future__ import annotations

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "assets", "data")
OUTPUT = os.path.join(DATA_DIR, "home-forecast-summary.json")

HOME_COMMODITIES = ("gold", "copper", "crude_oil")
HIST_TAIL = 60          # home chart renders 45 but keep buffer
FCST_LEN = 90
ROUND = 4


def _round_list(arr, n=ROUND):
    if not isinstance(arr, list):
        return []
    out = []
    for v in arr:
        if v is None:
            out.append(None)
            continue
        try:
            out.append(round(float(v), n))
        except (TypeError, ValueError):
            out.append(None)
    return out


def _slice_forecast(block, length=FCST_LEN):
    if not isinstance(block, dict):
        return {}
    return {
        "dates": (block.get("dates") or [])[:length],
        "median": _round_list((block.get("median") or [])[:length]),
        "p10": _round_list((block.get("p10_extreme") or block.get("p10") or block.get("p25") or [])[:length]),
        "p90": _round_list((block.get("p90_extreme") or block.get("p90") or block.get("p75") or [])[:length]),
    }


def _slice_history(block, tail=HIST_TAIL):
    if not isinstance(block, dict):
        return {"dates": [], "prices": []}
    dates = (block.get("dates") or [])[-tail:]
    prices = _round_list((block.get("prices") or [])[-tail:])
    return {"dates": dates, "prices": prices}


def _num(v, fallback=None):
    try:
        return round(float(v), ROUND)
    except (TypeError, ValueError):
        return fallback


def build():
    forecast_path = os.path.join(DATA_DIR, "forecast.json")
    consensus_path = os.path.join(DATA_DIR, "forecast-consensus.json")
    if not os.path.exists(forecast_path):
        print(f"[skip] {forecast_path} missing", file=sys.stderr)
        return 1
    with open(forecast_path, "r", encoding="utf-8") as f:
        forecast = json.load(f)
    consensus = {}
    if os.path.exists(consensus_path):
        with open(consensus_path, "r", encoding="utf-8") as f:
            consensus = json.load(f)

    out = {
        "generated_at": max(
            (forecast.get(k, {}).get("updated_at") for k in HOME_COMMODITIES if forecast.get(k)),
            default="",
        ),
        "commodities": {},
    }

    for key in HOME_COMMODITIES:
        f = forecast.get(key) or {}
        c = consensus.get(key) or {}

        entry = {
            "name": f.get("name") or key,
            "unit": f.get("unit"),
            "symbol": f.get("symbol"),
            "model": f.get("model"),
            "current_price": _num(f.get("current_price")),
            "forecast_30d": _num(f.get("forecast_30d")),
            "forecast_90d": _num(f.get("forecast_90d")),
            "change_30d_pct": _num(f.get("change_30d_pct")),
            "change_90d_pct": _num(f.get("change_90d_pct")),
            "updated_at": f.get("updated_at") or c.get("updated_at"),
            "history": _slice_history(f.get("history")),
            "forecast": _slice_forecast(f.get("forecast")),
            "timesfm_forecast": _slice_forecast(f.get("timesfm_forecast")),
        }

        if c:
            cons_block = c.get("consensus") or {}
            agreement = c.get("agreement") or {}
            models = c.get("models") or {}
            chronos2 = models.get("chronos2") or {}
            timesfm = models.get("timesfm") or {}
            entry["consensus"] = {
                "status": cons_block.get("status"),
                "direction": cons_block.get("direction"),
                "confidence": _num(cons_block.get("confidence")),
                "forecast_30d": _num(cons_block.get("forecast_30d")),
                "forecast_90d": _num(cons_block.get("forecast_90d")),
                "dates": (cons_block.get("dates") or [])[:FCST_LEN],
                "median": _round_list((cons_block.get("median") or [])[:FCST_LEN]),
                "p10": _round_list((cons_block.get("p10") or [])[:FCST_LEN]),
                "p90": _round_list((cons_block.get("p90") or [])[:FCST_LEN]),
            }
            entry["agreement"] = {
                "level": agreement.get("level"),
                "score": _num(agreement.get("score")),
                "direction_match": bool(agreement.get("direction_match")),
            }
            entry["models"] = {
                "chronos2": {
                    "forecast_90d": _num(chronos2.get("forecast_90d")),
                    "change_90d_pct": _num(chronos2.get("change_90d_pct")),
                    "median": _round_list((chronos2.get("median") or [])[:FCST_LEN]),
                },
                "timesfm": {
                    "forecast_90d": _num(timesfm.get("forecast_90d")),
                    "change_90d_pct": _num(timesfm.get("change_90d_pct")),
                    "median": _round_list((timesfm.get("median") or [])[:FCST_LEN]),
                },
            }

        out["commodities"][key] = entry

    payload = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(payload)
    print(f"[ok] wrote {OUTPUT} ({len(payload):,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(build())
