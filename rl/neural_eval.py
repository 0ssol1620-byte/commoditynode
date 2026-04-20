from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Sequence

from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryDataset, RLTrajectoryStep
from .env import CommodityTradingEnv
from .neural_ppo import train_neural_ppo
from .reward import compute_reward_breakdown


@dataclass(frozen=True)
class PolicyReplaySummary:
    name: str
    total_reward: float
    mean_reward: float
    final_equity: float
    max_drawdown: float
    win_rate: float
    action_counts: dict[str, int]
    reward_decomposition: dict[str, float]


@dataclass(frozen=True)
class WalkForwardWindowResult:
    window_index: int
    train_steps: int
    eval_steps: int
    start_timestamp: str
    end_timestamp: str
    total_reward: float
    mean_reward: float
    final_equity: float
    max_drawdown: float
    dominant_action: str


@dataclass(frozen=True)
class WalkForwardEvaluation:
    windows: tuple[WalkForwardWindowResult, ...]
    mean_reward: float
    mean_final_equity: float
    mean_max_drawdown: float
    positive_window_rate: float


ActionChooser = Callable[[dict], str]


def replay_policy(
    name: str,
    steps: Sequence[RLTrajectoryStep],
    chooser: ActionChooser,
    config: RLExperimentConfig | None = None,
) -> PolicyReplaySummary:
    config = config or get_default_rl_config()
    env = CommodityTradingEnv(list(steps), config)
    obs, _ = env.reset()
    done = False
    total_reward = 0.0
    wins = 0
    count = 0
    action_counts: dict[str, int] = {}
    breakdown_totals = {
        'pnl': 0.0,
        'turnover_cost': 0.0,
        'drawdown_cost': 0.0,
        'concentration_cost': 0.0,
        'event_gap_cost': 0.0,
        'abstain_bonus': 0.0,
        'expert_alignment_bonus': 0.0,
        'wrong_way_cost': 0.0,
        'stale_hold_cost': 0.0,
    }
    peak_equity = env.state.peak_equity
    max_drawdown = 0.0
    while not done:
        before_position = env.state.position
        before_hedge = env.state.hedge
        before_equity = env.state.equity
        step = env.steps[env.state.step_index]
        action = chooser(obs)
        result = env.step(action)
        action_counts[result.info['action']] = action_counts.get(result.info['action'], 0) + 1
        breakdown = compute_reward_breakdown(
            realized_return=step.target_return,
            position_before=before_position,
            position_after=env.state.position,
            hedge_before=before_hedge,
            hedge_after=env.state.hedge,
            peak_equity=peak_equity,
            equity_after=before_equity,
            pnl_weight=config.reward.pnl_weight,
            turnover_penalty=config.reward.turnover_penalty,
            drawdown_penalty=config.reward.drawdown_penalty,
            concentration_penalty=config.reward.concentration_penalty,
            event_gap_penalty=config.reward.event_gap_penalty,
            event_risk=float(step.observation.get('event_risk', 0.0)),
            abstain_bonus=config.reward.abstain_bonus,
            action_taken=result.info['action'],
            expert_action=step.expert_action,
            expert_alignment_bonus=config.reward.expert_alignment_bonus,
            wrong_way_penalty=config.reward.wrong_way_penalty,
            stale_hold_penalty=config.reward.stale_hold_penalty,
        )
        for key in breakdown_totals:
            breakdown_totals[key] += float(breakdown[key])
        total_reward += float(result.reward)
        count += 1
        if result.reward > 0:
            wins += 1
        peak_equity = max(peak_equity, env.state.equity)
        if peak_equity > 0:
            max_drawdown = max(max_drawdown, max(0.0, (peak_equity - env.state.equity) / peak_equity))
        obs = result.observation
        done = bool(result.terminated or result.truncated)

    return PolicyReplaySummary(
        name=name,
        total_reward=total_reward,
        mean_reward=total_reward / max(1, count),
        final_equity=env.state.equity,
        max_drawdown=max_drawdown,
        win_rate=wins / max(1, count),
        action_counts=action_counts,
        reward_decomposition=breakdown_totals,
    )


def evaluate_neural_walk_forward(
    dataset: RLTrajectoryDataset,
    config: RLExperimentConfig | None = None,
    total_timesteps: int = 256,
    window_count: int = 3,
    eval_window_size: int = 24,
    min_train_steps: int = 72,
    device: str = 'auto',
) -> WalkForwardEvaluation:
    config = config or get_default_rl_config()
    all_steps = list(dataset.train + dataset.val + dataset.test)
    if len(all_steps) < (min_train_steps + eval_window_size):
        raise ValueError('not enough steps for walk-forward evaluation')

    available = len(all_steps) - min_train_steps - eval_window_size + 1
    if available <= 0:
        raise ValueError('walk-forward split unavailable')
    stride = max(1, available // max(1, window_count))
    windows: list[WalkForwardWindowResult] = []

    for idx in range(window_count):
        train_end = min_train_steps + idx * stride
        if train_end + eval_window_size > len(all_steps):
            train_end = len(all_steps) - eval_window_size
        train_steps = all_steps[max(0, train_end - 128):train_end]
        eval_steps = all_steps[train_end:train_end + eval_window_size]
        if len(train_steps) < 16 or len(eval_steps) < 8:
            continue
        neural_result = train_neural_ppo(
            train_steps,
            config=config,
            total_timesteps=total_timesteps,
            device=device,
        )
        replay = replay_policy(
            name=f'walk_forward_{idx + 1}',
            steps=eval_steps,
            chooser=lambda obs, policy=neural_result.policy: policy.decide(obs).action,
            config=config,
        )
        dominant_action = 'hold'
        if replay.action_counts:
            dominant_action = max(replay.action_counts, key=replay.action_counts.get)
        windows.append(
            WalkForwardWindowResult(
                window_index=idx + 1,
                train_steps=len(train_steps),
                eval_steps=len(eval_steps),
                start_timestamp=str(eval_steps[0].timestamp),
                end_timestamp=str(eval_steps[-1].timestamp),
                total_reward=replay.total_reward,
                mean_reward=replay.mean_reward,
                final_equity=replay.final_equity,
                max_drawdown=replay.max_drawdown,
                dominant_action=dominant_action,
            )
        )

    if not windows:
        raise ValueError('walk-forward evaluation produced no windows')

    return WalkForwardEvaluation(
        windows=tuple(windows),
        mean_reward=sum(window.mean_reward for window in windows) / len(windows),
        mean_final_equity=sum(window.final_equity for window in windows) / len(windows),
        mean_max_drawdown=sum(window.max_drawdown for window in windows) / len(windows),
        positive_window_rate=sum(1 for window in windows if window.total_reward > 0) / len(windows),
    )
