from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import math

from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryDataset, RLTrajectoryStep


ACTIONS = (
    'reduce_risk',
    'hold',
    'add_continuation',
    'add_hedge',
    'relative_value_rotation',
)


@dataclass(frozen=True)
class OfflinePolicyModel:
    action_scores: dict[str, float]
    action_counts: dict[str, int]
    total_steps: int

    def decide(self, observation: dict) -> tuple[str, float]:
        agreement = float(observation.get('agreement_score', 0.5))
        anomaly = float(observation.get('anomaly_score', 0.0))
        event_risk = float(observation.get('event_risk', 0.0))
        bullish = float(observation.get('direction_bullish', 0.0))
        bearish = float(observation.get('direction_bearish', 0.0))

        ranked = []
        for action in ACTIONS:
            score = float(self.action_scores.get(action, 0.0))
            if action == 'add_continuation':
                score += agreement * bullish - anomaly * 0.5
            elif action == 'reduce_risk':
                score += agreement * bearish + anomaly
            elif action == 'add_hedge':
                score += event_risk + anomaly * 0.25
            elif action == 'hold':
                score += (1.0 - agreement) * 0.35
            elif action == 'relative_value_rotation':
                score += abs(bullish - bearish) * 0.15 + event_risk * 0.15
            ranked.append((action, score))
        ranked.sort(key=lambda item: item[1], reverse=True)
        action, score = ranked[0]
        values = [item[1] for item in ranked]
        max_val = max(values)
        exp_sum = sum(math.exp(v - max_val) for v in values)
        confidence = math.exp(score - max_val) / exp_sum if exp_sum else 0.5
        return action, float(confidence)


@dataclass(frozen=True)
class OfflineTrainingReport:
    algorithm: str
    train_steps: int
    val_steps: int
    average_train_return: float
    average_val_return: float
    action_distribution: dict[str, int]


@dataclass(frozen=True)
class OfflineTrainingResult:
    model: OfflinePolicyModel
    report: OfflineTrainingReport


def _average_target_return(steps: Iterable[RLTrajectoryStep]) -> float:
    items = list(steps)
    if not items:
        return 0.0
    return float(sum(step.target_return for step in items) / len(items))


def train_offline_policy(
    dataset: RLTrajectoryDataset,
    config: RLExperimentConfig | None = None,
) -> OfflineTrainingResult:
    config = config or get_default_rl_config()
    action_scores = {action: 0.0 for action in ACTIONS}
    action_counts = {action: 0 for action in ACTIONS}
    for step in dataset.train:
        action_counts[step.expert_action] = action_counts.get(step.expert_action, 0) + 1
        weight = step.target_return
        if step.expert_action == 'reduce_risk' and step.target_return < 0:
            weight = abs(step.target_return)
        elif step.expert_action == 'add_hedge':
            weight = abs(step.target_return) * 0.7 + float(step.observation.get('event_risk', 0.0)) * 0.3
        else:
            weight = max(0.0, weight)
        action_scores[step.expert_action] = action_scores.get(step.expert_action, 0.0) + weight

    total_steps = len(dataset.train)
    if total_steps == 0:
        raise ValueError('dataset.train must not be empty')
    model = OfflinePolicyModel(
        action_scores=action_scores,
        action_counts=action_counts,
        total_steps=total_steps,
    )
    report = OfflineTrainingReport(
        algorithm=config.training.offline_algorithm,
        train_steps=len(dataset.train),
        val_steps=len(dataset.val),
        average_train_return=_average_target_return(dataset.train),
        average_val_return=_average_target_return(dataset.val),
        action_distribution=action_counts,
    )
    return OfflineTrainingResult(model=model, report=report)
