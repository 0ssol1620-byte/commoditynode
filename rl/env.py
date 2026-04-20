from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryStep
from .features import action_mask
from .reward import compute_reward
from .types import RLStepResult


ACTION_DELTAS = {
    'reduce_risk': {'position': -0.5, 'hedge': 0.0},
    'hold': {'position': 0.0, 'hedge': 0.0},
    'add_continuation': {'position': 0.5, 'hedge': 0.0},
    'add_hedge': {'position': 0.0, 'hedge': 0.5},
    'relative_value_rotation': {'position': 0.25, 'hedge': 0.25},
}


@dataclass
class PortfolioState:
    step_index: int = 0
    position: float = 0.0
    hedge: float = 0.0
    equity: float = 1.0
    peak_equity: float = 1.0


class CommodityTradingEnv:
    def __init__(self, steps: list[RLTrajectoryStep], config: RLExperimentConfig | None = None):
        if not steps:
            raise ValueError('steps must not be empty')
        self.steps = steps
        self.config = config or get_default_rl_config()
        self.state = PortfolioState()

    def _current_step(self) -> RLTrajectoryStep:
        return self.steps[self.state.step_index]

    def _observation(self) -> dict[str, Any]:
        step = self._current_step()
        obs = dict(step.observation)
        obs['position'] = self.state.position
        obs['hedge'] = self.state.hedge
        obs['equity'] = self.state.equity
        obs['step_index'] = float(self.state.step_index)
        return obs

    def reset(self) -> tuple[dict[str, Any], dict[str, Any]]:
        self.state = PortfolioState()
        step = self._current_step()
        return self._observation(), {'commodity': step.commodity, 'timestamp': step.timestamp}

    def valid_action_mask(self) -> dict[str, bool]:
        return action_mask(self.state.position, self.state.hedge, self.config.action.max_position_abs)

    def action_mask_array(self):
        return [bool(self.valid_action_mask().get(action, False)) for action in self.config.action.discrete_actions]

    def step(self, action: str) -> RLStepResult:
        if action not in ACTION_DELTAS:
            raise ValueError(f'unknown action: {action}')
        mask = self.valid_action_mask()
        if not mask.get(action, False):
            action = 'hold'

        before_position = self.state.position
        before_hedge = self.state.hedge
        delta = ACTION_DELTAS[action]
        self.state.position = max(-self.config.action.max_position_abs, min(self.config.action.max_position_abs, self.state.position + delta['position']))
        self.state.hedge = max(-self.config.action.max_hedge_abs, min(self.config.action.max_hedge_abs, self.state.hedge + delta['hedge']))

        step = self._current_step()
        reward = compute_reward(
            realized_return=step.target_return,
            position_before=before_position,
            position_after=self.state.position,
            hedge_before=before_hedge,
            hedge_after=self.state.hedge,
            peak_equity=self.state.peak_equity,
            equity_after=self.state.equity,
            pnl_weight=self.config.reward.pnl_weight,
            turnover_penalty=self.config.reward.turnover_penalty,
            drawdown_penalty=self.config.reward.drawdown_penalty,
            concentration_penalty=self.config.reward.concentration_penalty,
            event_gap_penalty=self.config.reward.event_gap_penalty,
            event_risk=float(step.observation.get('event_risk', 0.0)),
            abstain_bonus=self.config.reward.abstain_bonus,
            action_taken=action,
            expert_action=step.expert_action,
            expert_alignment_bonus=self.config.reward.expert_alignment_bonus,
            wrong_way_penalty=self.config.reward.wrong_way_penalty,
            stale_hold_penalty=self.config.reward.stale_hold_penalty,
        )
        self.state.equity += reward
        self.state.peak_equity = max(self.state.peak_equity, self.state.equity)
        self.state.step_index += 1
        terminated = self.state.step_index >= len(self.steps)
        truncated = self.state.equity <= 0.25
        if terminated:
            observation = {
                'position': self.state.position,
                'hedge': self.state.hedge,
                'equity': self.state.equity,
                'done': 1.0,
            }
        else:
            observation = self._observation()
        info = {
            'action': action,
            'expert_action': step.expert_action,
            'timestamp': step.timestamp,
            'commodity': step.commodity,
            'equity': self.state.equity,
            'action_mask': self.valid_action_mask() if not terminated else {},
        }
        return RLStepResult(
            observation=observation,
            reward=reward,
            terminated=terminated,
            truncated=truncated,
            info=info,
        )
