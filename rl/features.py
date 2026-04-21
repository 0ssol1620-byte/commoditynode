from __future__ import annotations

from typing import Iterable


def safe_pct_change(current: float, previous: float) -> float:
    if previous in (0, None):
        return 0.0
    return (float(current) - float(previous)) / float(previous)


def agreement_to_score(agreement: dict | None) -> float:
    if not agreement:
        return 0.5
    score = agreement.get('score')
    if score is None:
        level = str(agreement.get('level', 'moderate')).lower()
        return {'high': 0.75, 'moderate': 0.55, 'low': 0.35}.get(level, 0.5)
    return max(0.0, min(1.0, float(score)))


def event_risk_score(event_probabilities: Iterable[dict] | None) -> float:
    items = list(event_probabilities or [])
    if not items:
        return 0.0
    probs = [float(item.get('base_probability', 0.0)) for item in items]
    return max(0.0, min(1.0, max(probs)))


def compute_model_spread(consensus_value: float, chronos_value: float | None, timesfm_value: float | None) -> float:
    values = [float(consensus_value)]
    if chronos_value is not None:
        values.append(float(chronos_value))
    if timesfm_value is not None:
        values.append(float(timesfm_value))
    if not values:
        return 0.0
    mean_value = sum(values) / len(values)
    if mean_value == 0:
        return 0.0
    return (max(values) - min(values)) / abs(mean_value)


def compute_anomaly_score(direction: str, realized_return: float, agreement_score: float, model_spread: float) -> float:
    mismatch = 0.0
    if direction == 'bullish' and realized_return < 0:
        mismatch = abs(realized_return)
    elif direction == 'bearish' and realized_return > 0:
        mismatch = abs(realized_return)
    raw = mismatch * 8.0 + (1.0 - agreement_score) * 0.6 + model_spread * 2.5
    return max(0.0, min(1.0, raw))


def action_mask(position: float, hedge: float, max_abs: float = 1.0) -> dict[str, bool]:
    return {
        'reduce_risk': True,
        'hold': True,
        'add_continuation': True,
        'add_hedge': True,
        'relative_value_rotation': True,
    }
