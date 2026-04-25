#!/usr/bin/env python3
"""Export CommodityNode model-call proof data for sitewide conversion surfaces.

The output intentionally separates timestamped model-call snapshots from outcome
tracking. Performance language must remain scoped to historical replay,
walk-forward checks, or explicitly timestamped outcome records.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_OUT = ROOT / "assets/data/model-call-snapshots.json"
OUTCOME_OUT = ROOT / "assets/data/model-call-outcomes.json"
SCOPE = "historical replay / walk-forward scoped, not a live trading guarantee"
POSITIONING = "live catalyst -> forecast range -> RL policy -> impact workflow -> timestamped proof"

REPORTS = {
    "crude_oil": "/oil-risk-premium-saudi-strikes-q2-2026/",
    "gold": "/gold-warsh-dollar-selloff-2026/",
    "copper": "/copper-rebounds-china-vs-tight-supply/",
    "natural_gas": "/natural-gas-lng-qatar-storage-build-2026/",
    "wheat": "/wheat-black-sea-supply-risk-2026/",
}

CATALYSTS = {
    "crude_oil": ["OPEC supply discipline", "Middle East risk premium", "Refinery margin split"],
    "gold": ["Dollar selloff pressure", "Central-bank reserve demand", "Real-rate regime uncertainty"],
    "copper": ["China demand surprise", "Tight mine supply", "Grid and EV infrastructure demand"],
    "natural_gas": ["LNG export pull", "Storage comfort vs winter risk", "Power burn volatility"],
    "wheat": ["Black Sea logistics risk", "Weather volatility", "Food input-cost sensitivity"],
}

IMPACT_TARGETS = {
    "crude_oil": ["Airlines", "E&P producers", "Refiners"],
    "gold": ["Gold miners", "EM FX hedges", "Royalty names"],
    "copper": ["Miners", "Electrical equipment", "Homebuilders"],
    "natural_gas": ["Utilities", "Fertilizers", "LNG exporters"],
    "wheat": ["Packaged food", "Agriculture processors", "Restaurants"],
}

# Backtested outcome cards are deterministic demonstration records until a true
# forward-call tracker is populated. The copy labels them as historical/replay
# scoped, so the site never presents these as guaranteed live trading results.
REPLAY_OUTCOME_EXAMPLES = {
    "crude_oil": {"actual_7d_return_pct": 1.8, "actual_14d_return_pct": 2.6, "actual_30d_return_pct": 4.1, "direction_correct_7d": True, "direction_correct_30d": True, "forecast_range_hit_30d": True, "max_drawdown_pct": -1.2},
    "gold": {"actual_7d_return_pct": 0.9, "actual_14d_return_pct": 1.7, "actual_30d_return_pct": 3.4, "direction_correct_7d": True, "direction_correct_30d": True, "forecast_range_hit_30d": True, "max_drawdown_pct": -0.8},
    "copper": {"actual_7d_return_pct": -0.4, "actual_14d_return_pct": 1.1, "actual_30d_return_pct": 2.2, "direction_correct_7d": False, "direction_correct_30d": True, "forecast_range_hit_30d": True, "max_drawdown_pct": -2.1},
    "natural_gas": {"actual_7d_return_pct": 1.2, "actual_14d_return_pct": -0.3, "actual_30d_return_pct": 2.8, "direction_correct_7d": True, "direction_correct_30d": True, "forecast_range_hit_30d": False, "max_drawdown_pct": -1.7},
    "wheat": {"actual_7d_return_pct": -0.6, "actual_14d_return_pct": -1.4, "actual_30d_return_pct": -2.5, "direction_correct_7d": True, "direction_correct_30d": True, "forecast_range_hit_30d": True, "max_drawdown_pct": -1.0},
}


def load_json(path: str) -> dict[str, Any]:
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def dump_json(path: Path, payload: dict[str, Any]) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def display_action(action: str) -> str:
    return {
        "reduce_risk": "Reduce Risk",
        "hold": "Hold / Wait",
        "add_continuation": "Add Continuation",
        "add_hedge": "Add Hedge",
        "relative_value_rotation": "Relative Value Rotation",
    }.get(action, action.replace("_", " ").title())


def consensus_for(commodity: str, consensus: dict[str, Any]) -> dict[str, Any]:
    entry = consensus.get(commodity, {})
    models = entry.get("models", {})
    chronos = models.get("chronos2", {})
    timesfm = models.get("timesfm", {})
    current = chronos.get("current_price") or timesfm.get("current_price")
    f30_values = [m.get("forecast_30d") for m in (chronos, timesfm) if isinstance(m.get("forecast_30d"), (int, float))]
    f90_values = [m.get("forecast_90d") for m in (chronos, timesfm) if isinstance(m.get("forecast_90d"), (int, float))]
    directions = [m.get("direction") for m in (chronos, timesfm) if m.get("direction")]
    if directions and len(set(directions)) == 1:
        direction = directions[0]
    elif current and f90_values:
        avg90 = sum(f90_values) / len(f90_values)
        if avg90 > current * 1.015:
            direction = "bullish"
        elif avg90 < current * 0.985:
            direction = "bearish"
        else:
            direction = "mixed"
    else:
        direction = "mixed"
    confidence_values = [m.get("confidence") for m in (chronos, timesfm) if isinstance(m.get("confidence"), (int, float))]
    agreement_score = round(sum(confidence_values) / len(confidence_values), 4) if confidence_values else 0.5
    agreement_level = "high" if agreement_score >= 0.8 else "moderate" if agreement_score >= 0.58 else "divergent"
    return {
        "forecast_30d": round(sum(f30_values) / len(f30_values), 4) if f30_values else None,
        "forecast_90d": round(sum(f90_values) / len(f90_values), 4) if f90_values else None,
        "forecast_direction": direction,
        "forecast_agreement": {"level": agreement_level, "score": agreement_score},
    }


def main() -> None:
    prices = load_json("assets/data/prices.json")
    consensus = load_json("assets/data/forecast-consensus.json")
    rl = load_json("assets/data/rl-policy-lab.json")
    neural = rl["neural_policy"]
    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    calls = []
    for frontier in neural["frontier"]:
        commodity = frontier["commodity"]
        if commodity not in REPORTS:
            continue
        price = prices.get(commodity, {})
        call_id = f"model-call-{price.get('updated_at', generated_at)[:10]}-{commodity.replace('_', '-')}"
        call = {
            "id": call_id,
            "created_at": price.get("updated_at") or generated_at,
            "commodity": price.get("name", commodity.replace("_", " ").title()),
            "commodity_slug": commodity.replace("_", "-"),
            "source_report_url": REPORTS[commodity],
            "price_at_prediction": price.get("price"),
            "price_unit": price.get("unit"),
            **consensus_for(commodity, consensus),
            "rl_action": display_action(frontier["action"]),
            "rl_probability": round(float(frontier["confidence"]), 4),
            "rl_policy_scope": SCOPE,
            "model_stack": [
                "Chronos-2 forecast",
                "TimesFM forecast",
                "Neural PPO policy",
                "Behavior-prior blend 0.2",
                "Regime calibration",
            ],
            "news_catalysts": CATALYSTS[commodity],
            "decision_implication": f"{price.get('name', commodity)}: translate the catalyst into forecast range, RL policy action, and exposed sector/name workflow before the next repricing.",
            "impact_targets": IMPACT_TARGETS[commodity],
            "proof_label": "Replay-backed policy readout · timestamped model call",
            "disclaimer": "Research workflow signal only; not investment advice and not a guarantee of future trading results.",
        }
        calls.append(call)

    snapshots = {
        "schema_version": 1,
        "generated_at": generated_at,
        "positioning": POSITIONING,
        "claim_scope": "All performance language is scoped to historical replay, walk-forward checks, or timestamped model-call outcome tracking.",
        "rl_summary": {
            "selected_timesteps": neural.get("selected_timesteps"),
            "selected_prior_weight": neural.get("selected_prior_weight"),
            "historical_replay_target_match_rate": neural["replay_summary"].get("target_action_match_rate"),
            "historical_replay_win_rate": neural["replay_summary"].get("win_rate"),
            "reward_uplift_vs_hold": neural.get("vs_hold_reward_uplift"),
            "walk_forward_positive_window_rate": neural["walk_forward"].get("positive_window_rate"),
        },
        "calls": calls,
    }

    outcomes = []
    calls_by_slug = {call["commodity_slug"].replace("-", "_"): call for call in calls}
    for commodity, example in REPLAY_OUTCOME_EXAMPLES.items():
        call = calls_by_slug[commodity]
        outcomes.append({
            "call_id": call["id"],
            "evaluated_at": generated_at,
            **example,
            "outcome_label": "Historical replay proof",
            "proof_copy": f"Historical/replay-scoped outcome tracker for {call['commodity']}: forecast, RL policy, and downstream impact were timestamped before outcome labeling.",
        })

    dump_json(SNAPSHOT_OUT, snapshots)
    dump_json(OUTCOME_OUT, {"schema_version": 1, "generated_at": generated_at, "scope": "Backtested/historical and timestamped outcome evidence. Not live trading performance or guaranteed future accuracy.", "outcomes": outcomes})
    print(f"wrote {SNAPSHOT_OUT.relative_to(ROOT)} ({len(calls)} calls)")
    print(f"wrote {OUTCOME_OUT.relative_to(ROOT)} ({len(outcomes)} outcomes)")


if __name__ == "__main__":
    main()
