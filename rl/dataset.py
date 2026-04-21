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
from .regimes import infer_regime_profile

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


def choose_expert_action(observation: dict[str, float], direction: str) -> str:
    profile = infer_regime_profile(observation, direction=direction)
    return profile.target_action


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
        trend_3 = float(sum(safe_pct_change(float(median[j]), float(median[j - 1])) for j in range(max(1, idx - 2), idx + 1)) / max(1, min(3, idx)))
        volatility_5 = float(min(1.0, sum(abs(safe_pct_change(float(median[j]), float(median[j - 1]))) for j in range(max(1, idx - 4), idx + 1)) / max(1, min(5, idx)) * 20.0))
        forecast_magnitude = min(1.0, abs(realized_return) * 25.0)
        agreement_event_mix = float(score * (1.0 - event_risk))
        risk_pressure = float(min(1.0, anomaly * 0.5 + event_risk * 0.3 + model_spread * 0.2))
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
            'forecast_magnitude': forecast_magnitude,
            'trend_3': trend_3,
            'volatility_5': volatility_5,
            'agreement_event_mix': agreement_event_mix,
            'risk_pressure': risk_pressure,
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
                expert_action=choose_expert_action(observation, direction),
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
