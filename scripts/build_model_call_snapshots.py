#!/usr/bin/env python3
"""Build forward-call snapshots and catalyst map from latest _posts + model state.

Blueprint responsibilities covered here:
- read latest _posts with commodity_name metadata
- match each post to current price, forecast, and RL context
- write assets/data/model-call-snapshots.json
- write assets/data/news-catalysts.json
- do not overwrite existing call IDs unless the same-day pending call is refreshed
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_OUT = ROOT / "assets/data/model-call-snapshots.json"
CATALYST_OUT = ROOT / "assets/data/news-catalysts.json"
SCOPE = "historical replay / walk-forward scoped, not a live trading guarantee"
POSITIONING = "live catalyst -> forecast range -> RL policy -> impact workflow -> timestamped proof"

# Keep this explicit; post front matter is written for humans while JSON keys are API-facing.
COMMODITY_ALIASES = {
    "Crude Oil": "crude_oil",
    "Oil": "crude_oil",
    "Gold": "gold",
    "Copper": "copper",
    "Natural Gas": "natural_gas",
    "Wheat": "wheat",
    "Silver": "silver",
    "Cotton": "cotton",
    "Coffee": "coffee",
    "Cocoa": "cocoa",
    "Orange Juice": "orange_juice",
    "Lithium": "lithium",
    "Sugar": "sugar",
}
IMPACT_TARGETS = {
    "crude_oil": ["Airlines", "E&P producers", "Refiners"],
    "gold": ["Gold miners", "EM FX hedges", "Royalty names"],
    "copper": ["Miners", "Electrical equipment", "Homebuilders"],
    "natural_gas": ["Utilities", "Fertilizers", "LNG exporters"],
    "wheat": ["Packaged food", "Agriculture processors", "Restaurants"],
    "silver": ["Solar manufacturers", "Electronics", "Precious-metal miners"],
    "cotton": ["Textiles", "Apparel brands", "Retailers"],
    "coffee": ["Coffee chains", "Roasters", "Consumer staples"],
    "cocoa": ["Chocolate makers", "Confectionery", "Food staples"],
    "orange_juice": ["Beverage makers", "Grocery retail", "Agriculture processors"],
    "lithium": ["Battery makers", "EV OEMs", "Critical-mineral miners"],
    "sugar": ["Food staples", "Ethanol", "Packaged goods"],
}


def load_json(rel: str) -> dict[str, Any]:
    p = ROOT / rel
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def dump_json(path: Path, payload: dict[str, Any]) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_front_matter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm: dict[str, str] = {}
    for line in text[3:end].splitlines():
        if ":" not in line or line.lstrip().startswith("#"):
            continue
        key, val = line.split(":", 1)
        fm[key.strip()] = val.strip().strip('"').strip("'")
    return fm


def slug_from_url(url: str) -> str:
    return "/" + url.strip().strip("/") + "/"


def post_url(path: Path, fm: dict[str, str]) -> str:
    canonical = fm.get("canonical_url", "")
    if canonical.startswith("https://commoditynode.com/"):
        return slug_from_url(canonical.replace("https://commoditynode.com/", ""))
    return slug_from_url(re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem))


def commodity_key(fm: dict[str, str]) -> str | None:
    name = fm.get("commodity_name") or ""
    if name in COMMODITY_ALIASES:
        return COMMODITY_ALIASES[name]
    slug = name.lower().replace(" ", "_").replace("-", "_")
    return slug or None


def display_action(action: str) -> str:
    return {
        "reduce_risk": "Reduce Risk",
        "hold": "Hold / Wait",
        "add_continuation": "Add Continuation",
        "add_hedge": "Add Hedge",
        "relative_value_rotation": "Relative Value Rotation",
    }.get(action, action.replace("_", " ").title())


def rl_lookup(rl: dict[str, Any]) -> dict[str, dict[str, Any]]:
    frontier = rl.get("neural_policy", {}).get("frontier", [])
    return {row.get("commodity"): row for row in frontier if row.get("commodity")}


def consensus_for(key: str, consensus: dict[str, Any], fallback_direction: str | None = None) -> dict[str, Any]:
    entry = consensus.get(key, {})
    cons = entry.get("consensus", {})
    agreement = entry.get("agreement", {})
    models = entry.get("models", {})
    chronos = models.get("chronos2", {})
    timesfm = models.get("timesfm", {})
    return {
        "forecast_30d": cons.get("forecast_30d"),
        "forecast_90d": cons.get("forecast_90d"),
        "forecast_direction": cons.get("direction") or fallback_direction or "mixed",
        "forecast_agreement": {
            "level": agreement.get("level") or "pending",
            "score": agreement.get("score"),
        },
        "forecast_models": {
            "chronos2_90d": chronos.get("forecast_90d"),
            "timesfm_90d": timesfm.get("forecast_90d"),
        },
    }


def catalyst_rows(call: dict[str, Any], fm: dict[str, str]) -> list[dict[str, Any]]:
    title = fm.get("title") or f"{call['commodity']} model call"
    return [{
        "headline": title,
        "source": "CommodityNode editorial / manual news synthesis",
        "published_at": call["created_at"],
        "url": call["source_report_url"],
        "summary": fm.get("description") or call["decision_implication"],
        "model_reaction": f"{call['commodity']}: {call['forecast_direction']} forecast path with {call['rl_action']} RL action; research workflow signal, not investment advice.",
    }]


def build(limit: int = 8) -> tuple[dict[str, Any], dict[str, Any]]:
    prices = load_json("assets/data/prices.json")
    consensus = load_json("assets/data/forecast-consensus.json")
    rl = load_json("assets/data/rl-policy-lab.json")
    rls = rl_lookup(rl)
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    posts = sorted((ROOT / "_posts").glob("*.md"), key=lambda p: p.name, reverse=True)

    calls: list[dict[str, Any]] = []
    seen: set[str] = set()
    for post in posts:
        fm = parse_front_matter(post)
        key = commodity_key(fm)
        if not key or key in seen or key not in prices:
            continue
        forecast = consensus_for(key, consensus, fm.get("direction"))
        if forecast.get("forecast_30d") is None or forecast.get("forecast_90d") is None:
            # Do not present proxy/pending commodities as full forecast + RL model calls.
            continue
        seen.add(key)
        price = prices.get(key, {})
        rlrow = rls.get(key, {})
        created_at = price.get("updated_at") or now
        slug = key.replace("_", "-")
        source_url = post_url(post, fm)
        call_id = f"model-call-{created_at[:10]}-{slug}"
        # Same-day pending calls are refreshed, but stable call IDs prevent archive duplication.
        call = {
            "id": call_id,
            "created_at": created_at,
            "commodity": price.get("name") or fm.get("commodity_name") or slug.title(),
            "commodity_slug": slug,
            "source_report_url": source_url,
            "source_report_title": fm.get("title"),
            "price_at_prediction": price.get("price"),
            "price_unit": price.get("unit"),
            "price_change_pct_at_call": price.get("change_pct"),
            **forecast,
            "rl_action": display_action(rlrow.get("action", "hold")),
            "rl_probability": round(float(rlrow.get("confidence", 0.0)), 4),
            "rl_policy_scope": SCOPE,
            "model_stack": ["Chronos-2 forecast", "TimesFM forecast", "Neural PPO policy", "Behavior-prior blend 0.2", "Regime calibration"],
            "news_catalysts": [fm.get("title") or f"{price.get('name', slug)} catalyst", fm.get("description") or "Latest market data and model refresh"],
            "decision_implication": f"{price.get('name', slug)}: convert the latest catalyst into forecast range, RL policy action, and downstream impact workflow.",
            "impact_targets": IMPACT_TARGETS.get(key, ["Commodity hub", "Sector impact", "Watchlist exposure"]),
            "proof_label": "Replay-backed policy readout · timestamped model call",
            "status": "pending_outcome",
            "disclaimer": "Research workflow signal only; not investment advice and not a guarantee of future trading results.",
        }
        calls.append(call)
        if len(calls) >= limit:
            break

    neural = rl.get("neural_policy", {})
    latest_by_id = {c["id"]: c for c in calls}
    existing = load_json("assets/data/model-call-snapshots.json").get("calls", [])
    preserved = []
    for old in existing:
        old_id = old.get("id")
        if old_id in latest_by_id:
            continue
        if old.get("forecast_30d") is None or old.get("forecast_90d") is None:
            continue
        preserved.append(old)
    merged_calls = list(latest_by_id.values()) + preserved
    merged_calls = merged_calls[: max(limit, 12)]

    snapshots = {
        "schema_version": 1,
        "generated_at": now,
        "positioning": POSITIONING,
        "claim_scope": "All performance language is scoped to historical replay, walk-forward checks, or timestamped model-call outcome tracking.",
        "rl_summary": {
            "selected_timesteps": neural.get("selected_timesteps"),
            "selected_prior_weight": neural.get("selected_prior_weight"),
            "historical_replay_target_match_rate": neural.get("replay_summary", {}).get("target_action_match_rate"),
            "historical_replay_win_rate": neural.get("replay_summary", {}).get("win_rate"),
            "reward_uplift_vs_hold": neural.get("vs_hold_reward_uplift"),
            "walk_forward_positive_window_rate": neural.get("walk_forward", {}).get("positive_window_rate"),
        },
        "calls": merged_calls,
    }
    catalysts = {
        "schema_version": 1,
        "generated_at": now,
        "scope": "Latest catalyst summaries are editorial/model workflow context, not investment advice.",
        "catalysts": {c["commodity_slug"].replace("-", "_"): catalyst_rows(c, {"title": c.get("source_report_title") or c["commodity"], "description": c["news_catalysts"][-1]}) for c in merged_calls},
    }
    return snapshots, catalysts


def main() -> None:
    snapshots, catalysts = build()
    dump_json(SNAPSHOT_OUT, snapshots)
    dump_json(CATALYST_OUT, catalysts)
    print(f"wrote {SNAPSHOT_OUT.relative_to(ROOT)} ({len(snapshots['calls'])} calls)")
    print(f"wrote {CATALYST_OUT.relative_to(ROOT)} ({len(catalysts['catalysts'])} commodities)")


if __name__ == "__main__":
    main()
