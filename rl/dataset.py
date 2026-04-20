from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .config import RLExperimentConfig, get_default_rl_config
from .features import (
    agreement_to_score,
    compute_anomaly_score,
    compute_model_spread,
    event_risk_score,
    safe_pct_change,
)

ROOT = Path(__file__).resolve().parents[1]
FORECAST_PATH = ROOT / 'assets' / 'data' / 'forecast.json'
CONSENSUS_PATH = ROOT / 'assets' / 'data' / 'forecast-consensus.json'
INTELLIGENCE_PATH = ROOT / 'assets' / 'data' / 'intelligence-lab.json'


@dataclass(frozen=True)
class RLTrajectoryStep:
    commodity: str
    timestamp: str
    observation: dict[str, float]
    target_return: float
    expert_action: str
    metadata: dict[str, Any]


@dataclass(frozen=True)
class RLTrajectoryDataset:
    train: tuple[RLTrajectoryStep, ...]
    val: tuple[RLTrajectoryStep, ...]
    test: tuple[RLTrajectoryStep, ...]


def load_json(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding='utf-8'))


def choose_expert_action(direction: str, agreement_score: float, anomaly_score: float, event_risk: float) -> str:
    if anomaly_score >= 0.7:
        return 'reduce_risk'
    if event_risk >= 0.55 and agreement_score < 0.55:
        return 'add_hedge'
    if direction == 'bullish' and agreement_score >= 0.6:
        return 'add_continuation'
    if direction == 'bearish' and agreement_score >= 0.6:
        return 'reduce_risk'
    return 'hold'


def build_steps_for_commodity(
    commodity: str,
    forecast_entry: dict,
    consensus_entry: dict,
    intelligence_entry: dict,
    config: RLExperimentConfig | None = None,
) -> list[RLTrajectoryStep]:
    config = config or get_default_rl_config()
    consensus = consensus_entry.get('consensus', {})
    agreement = consensus_entry.get('agreement', {})
    models = consensus_entry.get('models', {})
    chronos = models.get('chronos2', {})
    timesfm = models.get('timesfm', {})
    direction_signal = forecast_entry.get('direction_signal', {})

    dates = consensus.get('dates') or chronos.get('dates') or timesfm.get('dates') or []
    median = consensus.get('median') or []
    chronos_median = chronos.get('median') or []
    timesfm_median = timesfm.get('median') or []
    if len(dates) < 2 or len(median) < 2:
        return []

    score = agreement_to_score(agreement)
    event_risk = event_risk_score(intelligence_entry.get('event_probabilities'))
    direction = str(consensus.get('direction') or direction_signal.get('label', 'neutral')).lower()
    if direction == 'up':
        direction = 'bullish'
    if direction == 'down':
        direction = 'bearish'

    steps: list[RLTrajectoryStep] = []
    for idx in range(1, len(dates)):
        current = float(median[idx - 1])
        nxt = float(median[idx])
        realized_return = safe_pct_change(nxt, current)
        chronos_value = float(chronos_median[idx]) if idx < len(chronos_median) else None
        timesfm_value = float(timesfm_median[idx]) if idx < len(timesfm_median) else None
        model_spread = compute_model_spread(nxt, chronos_value, timesfm_value)
        anomaly = compute_anomaly_score(direction, realized_return, score, model_spread)
        observation = {
            'forecast_return': realized_return,
            'agreement_score': score,
            'anomaly_score': anomaly,
            'event_risk': event_risk,
            'model_spread': model_spread,
            'direction_bullish': 1.0 if direction == 'bullish' else 0.0,
            'direction_bearish': 1.0 if direction == 'bearish' else 0.0,
            'ripple_max_score': float(max((item.get('score', 0) for item in intelligence_entry.get('ripple_ranker', [])), default=0.0)) / 100.0,
            'hedge_count': float(len(intelligence_entry.get('hedges', []))),
            'policy_action_count': float(len(intelligence_entry.get('policy_actions', []))),
        }
        metadata = {
            'current_price': current,
            'next_price': nxt,
            'direction': direction,
            'cluster': intelligence_entry.get('cluster', ''),
            'event_labels': [item.get('label', '') for item in intelligence_entry.get('event_probabilities', [])],
        }
        steps.append(
            RLTrajectoryStep(
                commodity=commodity,
                timestamp=str(dates[idx]),
                observation=observation,
                target_return=realized_return,
                expert_action=choose_expert_action(direction, score, anomaly, event_risk),
                metadata=metadata,
            )
        )
    return steps


def split_steps(steps: list[RLTrajectoryStep], train_split: float, val_split: float) -> RLTrajectoryDataset:
    total = len(steps)
    train_end = int(total * train_split)
    val_end = train_end + int(total * val_split)
    return RLTrajectoryDataset(
        train=tuple(steps[:train_end]),
        val=tuple(steps[train_end:val_end]),
        test=tuple(steps[val_end:]),
    )


def build_trajectory_dataset(
    commodity_keys: tuple[str, ...] | None = None,
    forecast_path: str | Path = FORECAST_PATH,
    consensus_path: str | Path = CONSENSUS_PATH,
    intelligence_path: str | Path = INTELLIGENCE_PATH,
    config: RLExperimentConfig | None = None,
) -> RLTrajectoryDataset:
    config = config or get_default_rl_config()
    forecast = load_json(forecast_path)
    consensus = load_json(consensus_path)
    intelligence = load_json(intelligence_path)
    keys = commodity_keys or config.commodity_keys
    all_steps: list[RLTrajectoryStep] = []
    for commodity in keys:
        if commodity not in forecast or commodity not in consensus or commodity not in intelligence:
            continue
        all_steps.extend(build_steps_for_commodity(commodity, forecast[commodity], consensus[commodity], intelligence[commodity], config))
    all_steps.sort(key=lambda step: (step.timestamp, step.commodity))
    return split_steps(all_steps, config.training.train_split, config.training.val_split)
