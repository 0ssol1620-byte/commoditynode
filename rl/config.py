from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal


ActionMode = Literal['discrete', 'continuous']
RewardMode = Literal['risk_adjusted_pnl']


@dataclass(frozen=True)
class ObservationConfig:
    context_length: int = 128
    forecast_horizon: int = 30
    include_forecast_spread: bool = True
    include_agreement: bool = True
    include_anomaly: bool = True
    include_event_flags: bool = True
    include_alpha_signals: bool = True
    include_direction_signal: bool = True
    include_position_state: bool = True


@dataclass(frozen=True)
class ActionConfig:
    mode: ActionMode = 'discrete'
    discrete_actions: tuple[str, ...] = (
        'reduce_risk',
        'hold',
        'add_continuation',
        'add_hedge',
        'relative_value_rotation',
    )
    max_position_abs: float = 1.0
    max_hedge_abs: float = 1.0


@dataclass(frozen=True)
class RewardConfig:
    mode: RewardMode = 'risk_adjusted_pnl'
    pnl_weight: float = 1.0
    turnover_penalty: float = 0.03
    drawdown_penalty: float = 0.08
    concentration_penalty: float = 0.01
    event_gap_penalty: float = 0.05
    abstain_bonus: float = 0.003
    expert_alignment_bonus: float = 0.12
    wrong_way_penalty: float = 0.06
    stale_hold_penalty: float = 0.14
    regime_opportunity_bonus: float = 0.11
    missed_regime_penalty: float = 0.13


@dataclass(frozen=True)
class TrainingConfig:
    seed: int = 42
    train_split: float = 0.7
    val_split: float = 0.15
    test_split: float = 0.15
    offline_algorithm: str = 'iql'
    online_algorithm: str = 'ppo'
    offline_steps: int = 5000
    online_steps: int = 2500
    learning_rate: float = 3e-4


@dataclass(frozen=True)
class RLExperimentConfig:
    name: str = 'commoditynode-rl-policy-lab'
    commodity_keys: tuple[str, ...] = (
        'crude_oil',
        'gold',
        'copper',
        'natural_gas',
        'wheat',
    )
    observation: ObservationConfig = field(default_factory=ObservationConfig)
    action: ActionConfig = field(default_factory=ActionConfig)
    reward: RewardConfig = field(default_factory=RewardConfig)
    training: TrainingConfig = field(default_factory=TrainingConfig)

    def validate(self) -> None:
        total = self.training.train_split + self.training.val_split + self.training.test_split
        if abs(total - 1.0) > 1e-9:
            raise ValueError('train/val/test split must sum to 1.0')
        if self.observation.context_length <= 0:
            raise ValueError('context_length must be positive')
        if self.observation.forecast_horizon <= 0:
            raise ValueError('forecast_horizon must be positive')
        if self.training.offline_algorithm not in {'iql', 'cql', 'bc'}:
            raise ValueError('unsupported offline algorithm')
        if self.training.online_algorithm not in {'ppo'}:
            raise ValueError('unsupported online algorithm')
        if not self.action.discrete_actions:
            raise ValueError('discrete_actions must not be empty')


def get_default_rl_config() -> RLExperimentConfig:
    config = RLExperimentConfig()
    config.validate()
    return config
