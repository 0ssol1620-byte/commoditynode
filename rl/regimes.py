from __future__ import annotations

from dataclasses import dataclass


REGIME_ACTIONS = {
    'continuation': 'add_continuation',
    'risk_off': 'reduce_risk',
    'hedge': 'add_hedge',
    'rotation': 'relative_value_rotation',
}


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, float(value)))


@dataclass(frozen=True)
class RegimeProfile:
    strengths: dict[str, float]
    active: dict[str, bool]
    target_action: str
    target_strength: float


def infer_regime_profile(observation: dict, direction: str | None = None) -> RegimeProfile:
    agreement = float(observation.get('agreement_score', 0.5) or 0.5)
    anomaly = float(observation.get('anomaly_score', 0.0) or 0.0)
    event_risk = float(observation.get('event_risk', 0.0) or 0.0)
    spread = float(observation.get('model_spread', 0.0) or 0.0)
    trend = float(observation.get('trend_3', 0.0) or 0.0)
    forecast_return = float(observation.get('forecast_return', 0.0) or 0.0)
    volatility = float(observation.get('volatility_5', 0.0) or 0.0)
    risk_pressure = float(observation.get('risk_pressure', 0.0) or 0.0)
    direction = str(direction or '').lower()

    bullish_bias = 0.08 if direction == 'bullish' else 0.0
    bearish_bias = 0.08 if direction == 'bearish' else 0.0

    continuation = _clamp(
        max(0.0, (agreement - 0.545) / 0.065) * 0.28
        + max(0.0, trend / 0.003) * 0.3
        + max(0.0, forecast_return / 0.004) * 0.24
        + max(0.0, (0.085 - spread) / 0.085) * 0.1
        + max(0.0, (0.38 - risk_pressure) / 0.18) * 0.08
        + bullish_bias
    )
    risk_off = _clamp(
        max(0.0, (risk_pressure - 0.31) / 0.24) * 0.36
        + max(0.0, (anomaly - 0.42) / 0.4) * 0.28
        + max(0.0, (-trend) / 0.004) * 0.16
        + max(0.0, (-forecast_return) / 0.005) * 0.12
        + max(0.0, (spread - 0.095) / 0.14) * 0.08
        + bearish_bias
    )
    hedge = _clamp(
        max(0.0, (event_risk - 0.295) / 0.04) * 0.32
        + max(0.0, (volatility - 0.055) / 0.16) * 0.28
        + max(0.0, (spread - 0.06) / 0.12) * 0.16
        + max(0.0, (anomaly - 0.35) / 0.45) * 0.12
        + max(0.0, abs(forecast_return) / 0.006) * 0.12
    )
    rotation = _clamp(
        max(0.0, (spread - 0.06) / 0.14) * 0.42
        + max(0.0, (0.595 - agreement) / 0.07) * 0.12
        + max(0.0, (0.0022 - abs(trend)) / 0.0022) * 0.22
        + max(0.0, (0.0025 - abs(forecast_return)) / 0.0025) * 0.14
        + max(0.0, (0.42 - risk_pressure) / 0.18) * 0.1
    )

    strengths = {
        'continuation': continuation,
        'risk_off': risk_off,
        'hedge': hedge,
        'rotation': rotation,
    }
    active = {
        'continuation': continuation >= 0.36,
        'risk_off': risk_off >= 0.35,
        'hedge': hedge >= 0.38,
        'rotation': rotation >= 0.34,
    }

    ordered = sorted(strengths.items(), key=lambda item: item[1], reverse=True)
    top_name, top_strength = ordered[0]
    if top_strength < 0.3:
        target_action = 'hold'
        top_strength = 0.0
    elif hedge >= 0.66 and event_risk >= 0.42 and hedge >= risk_off - 0.03:
        target_action = 'add_hedge'
        top_strength = hedge
    elif continuation >= 0.58 and continuation >= max(risk_off, hedge) - 0.05:
        target_action = 'add_continuation'
        top_strength = continuation
    elif risk_off >= 0.52 and risk_off >= continuation + 0.02:
        target_action = 'reduce_risk'
        top_strength = risk_off
    elif hedge >= 0.54 and hedge >= max(continuation, risk_off) - 0.01:
        target_action = 'add_hedge'
        top_strength = hedge
    elif continuation >= 0.5 and continuation >= rotation - 0.02:
        target_action = 'add_continuation'
        top_strength = continuation
    elif rotation >= 0.48 and spread >= 0.055:
        target_action = 'relative_value_rotation'
        top_strength = rotation
    elif top_name == 'rotation' and spread < 0.055:
        target_action = 'hold'
        top_strength = 0.0
    else:
        target_action = REGIME_ACTIONS[top_name]

    return RegimeProfile(
        strengths=strengths,
        active=active,
        target_action=target_action,
        target_strength=top_strength,
    )


def infer_regime_targets(observation: dict, direction: str | None = None) -> dict[str, tuple[bool, str, float]]:
    profile = infer_regime_profile(observation, direction=direction)
    return {
        name: (profile.active[name], REGIME_ACTIONS[name], profile.strengths[name])
        for name in REGIME_ACTIONS
    }
