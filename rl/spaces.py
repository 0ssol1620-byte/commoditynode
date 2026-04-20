from __future__ import annotations

from dataclasses import dataclass

from .config import RLExperimentConfig


@dataclass(frozen=True)
class ObservationSpaceSpec:
    feature_count: int
    context_length: int


@dataclass(frozen=True)
class ActionSpaceSpec:
    mode: str
    size: int


BASE_FEATURES = 8
OPTIONAL_FEATURE_FLAGS = (
    'include_forecast_spread',
    'include_agreement',
    'include_anomaly',
    'include_event_flags',
    'include_alpha_signals',
    'include_direction_signal',
    'include_position_state',
)


def build_observation_space(config: RLExperimentConfig) -> ObservationSpaceSpec:
    feature_count = BASE_FEATURES
    for key in OPTIONAL_FEATURE_FLAGS:
        if getattr(config.observation, key):
            feature_count += 1
    return ObservationSpaceSpec(
        feature_count=feature_count,
        context_length=config.observation.context_length,
    )


def build_action_space(config: RLExperimentConfig) -> ActionSpaceSpec:
    if config.action.mode == 'discrete':
        return ActionSpaceSpec(mode='discrete', size=len(config.action.discrete_actions))
    return ActionSpaceSpec(mode='continuous', size=2)
