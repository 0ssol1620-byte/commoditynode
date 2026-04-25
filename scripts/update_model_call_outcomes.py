#!/usr/bin/env python3
"""Update timestamped model-call outcomes from chart-data history.

Blueprint responsibilities covered here:
- read assets/data/model-call-snapshots.json
- compare call price with realized prices in assets/data/chart-data/*.json
- preserve pending horizons as null when enough days have not elapsed
- write assets/data/model-call-outcomes.json without claiming live trading performance
"""
from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_PATH = ROOT / "assets/data/model-call-snapshots.json"
OUTCOME_PATH = ROOT / "assets/data/model-call-outcomes.json"
CHART_DIR = ROOT / "assets/data/chart-data"
SCOPE = "Backtested/historical and timestamped outcome evidence. Not live trading performance or guaranteed future accuracy."

CHART_FILE_BY_COMMODITY = {
    "crude-oil": "cl.json",
    "gold": "gc.json",
    "silver": "si.json",
    "copper": "hg.json",
    "natural-gas": "ng.json",
    "wheat": "zw.json",
    "corn": "zc.json",
    "soybeans": "zs.json",
    "coffee": "kc.json",
    "cocoa": "cc.json",
    "cotton": "ct.json",
    "sugar": "sb.json",
    "orange-juice": "oj.json",
    "lumber": "lbr.json",
    "live-cattle": "le.json",
    "lean-hogs": "he.json",
    "platinum": "pl.json",
    "palladium": "pa.json",
    "uranium": "ux.json",
    "lithium": "li.json",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def dump_json(path: Path, payload: dict[str, Any]) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_dt(value: str) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def chart_candles(slug: str) -> list[dict[str, Any]]:
    path = CHART_DIR / CHART_FILE_BY_COMMODITY.get(slug, f"{slug}.json")
    data = load_json(path)
    candles = data.get("3M", {}).get("candles") or data.get("1M", {}).get("candles") or []
    return [c for c in candles if isinstance(c.get("x"), (int, float)) and isinstance(c.get("c"), (int, float))]


def pick_price_after(candles: list[dict[str, Any]], call_dt: datetime | None, horizon_days: int) -> float | None:
    if not candles or not call_dt:
        return None
    target_ms = call_dt.timestamp() * 1000 + horizon_days * 86400 * 1000
    eligible = [c for c in candles if c["x"] >= target_ms]
    if not eligible:
        return None
    return float(min(eligible, key=lambda c: c["x"])["c"])


def latest_price(candles: list[dict[str, Any]]) -> float | None:
    if not candles:
        return None
    return float(max(candles, key=lambda c: c["x"])["c"])


def pct_return(start: Any, end: Any) -> float | None:
    try:
        s = float(start)
        e = float(end)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(s) or s == 0 or not math.isfinite(e):
        return None
    return round((e - s) / s * 100, 4)


def direction_from_call(call: dict[str, Any]) -> int:
    direction = str(call.get("forecast_direction") or "").lower()
    if direction in {"bearish", "down", "negative"}:
        return -1
    if direction in {"bullish", "up", "positive"}:
        return 1
    return 0


def direction_correct(ret: float | None, call: dict[str, Any]) -> bool | None:
    if ret is None:
        return None
    expected = direction_from_call(call)
    if expected == 0:
        return None
    actual = 1 if ret > 0 else -1 if ret < 0 else 0
    return actual == expected


def forecast_range_hit(call: dict[str, Any], actual_price: float | None) -> bool | None:
    if actual_price is None:
        return None
    values = []
    for key in ("forecast_30d", "forecast_90d"):
        try:
            val = float(call.get(key))
            if math.isfinite(val):
                values.append(val)
        except (TypeError, ValueError):
            pass
    if not values:
        return None
    base = float(call.get("price_at_prediction") or values[0])
    lo = min(values + [base]) * 0.985
    hi = max(values + [base]) * 1.015
    return lo <= actual_price <= hi


def max_drawdown_pct(candles: list[dict[str, Any]], start_price: Any, call_dt: datetime | None) -> float | None:
    if not candles or not call_dt:
        return None
    try:
        s = float(start_price)
    except (TypeError, ValueError):
        return None
    if s <= 0:
        return None
    start_ms = call_dt.timestamp() * 1000
    after = [float(c["c"]) for c in candles if c["x"] >= start_ms]
    if not after:
        return None
    return round((min(after) - s) / s * 100, 4)


def outcome_for(call: dict[str, Any], now: str) -> dict[str, Any]:
    slug = call.get("commodity_slug", "")
    call_dt = parse_dt(call.get("created_at", ""))
    candles = chart_candles(slug)
    price_7 = pick_price_after(candles, call_dt, 7)
    price_14 = pick_price_after(candles, call_dt, 14)
    price_30 = pick_price_after(candles, call_dt, 30)
    ret_7 = pct_return(call.get("price_at_prediction"), price_7)
    ret_14 = pct_return(call.get("price_at_prediction"), price_14)
    ret_30 = pct_return(call.get("price_at_prediction"), price_30)
    return {
        "call_id": call.get("id"),
        "evaluated_at": now,
        "actual_7d_return_pct": ret_7,
        "actual_14d_return_pct": ret_14,
        "actual_30d_return_pct": ret_30,
        "direction_correct_7d": direction_correct(ret_7, call),
        "direction_correct_30d": direction_correct(ret_30, call),
        "forecast_range_hit_30d": forecast_range_hit(call, price_30),
        "max_drawdown_pct": max_drawdown_pct(candles, call.get("price_at_prediction"), call_dt),
        "outcome_label": "Historical/replay timestamped outcome" if ret_30 is not None else "Pending historical/replay outcome window",
        "proof_copy": f"Timestamped/replay-scoped outcome tracker for {call.get('commodity')}: forecast, RL policy, and downstream impact are recorded before outcome labeling. Pending horizons stay null until chart history is available.",
    }


def main() -> None:
    snapshots = load_json(SNAPSHOT_PATH)
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    outcomes = [outcome_for(call, now) for call in snapshots.get("calls", [])]
    payload = {"schema_version": 1, "generated_at": now, "scope": SCOPE, "outcomes": outcomes}
    dump_json(OUTCOME_PATH, payload)
    print(f"wrote {OUTCOME_PATH.relative_to(ROOT)} ({len(outcomes)} outcomes)")


if __name__ == "__main__":
    main()
