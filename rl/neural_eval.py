from __future__ import annotations

from dataclasses import dataclass
import math
from typing import Callable, Sequence

from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryDataset, RLTrajectoryStep
from .env import CommodityTradingEnv
from .neural_ppo import train_neural_ppo
from .regimes import infer_regime_profile, infer_regime_targets
from .reward import compute_reward, compute_reward_breakdown


@dataclass(frozen=True)
class PolicyReplaySummary:
    name: str
    total_reward: float
    mean_reward: float
    final_equity: float
    max_drawdown: float
    win_rate: float
    action_counts: dict[str, int]
    action_diversity: float
    action_entropy: float
    hold_share: float
    intervention_rate: float
    dominant_action_share: float
    regime_hit_rate: dict[str, float]
    regime_active_counts: dict[str, int]
    regime_confusion_matrix: dict[str, dict[str, int]]
    regime_balance_score: float
    action_value_by_regime: dict[str, dict[str, float]]
    non_hold_value_add: float
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
    vs_hold_reward_uplift: float
    mean_action_diversity: float


ActionChooser = Callable[[dict], str]


def _regime_targets(observation: dict, direction: str | None = None) -> dict[str, tuple[bool, str, float]]:
    return infer_regime_targets(observation, direction=direction)


def _normalized_entropy(action_counts: dict[str, int], action_count: int) -> float:
    total = sum(max(0, int(v)) for v in action_counts.values())
    if total <= 0 or action_count <= 1:
        return 0.0
    entropy = 0.0
    for value in action_counts.values():
        if value <= 0:
            continue
        p = value / total
        entropy -= p * math.log(p)
    return entropy / math.log(action_count)


def _dominant_action_share(action_counts: dict[str, int]) -> float:
    total = sum(max(0, int(v)) for v in action_counts.values())
    if total <= 0:
        return 1.0
    return max(action_counts.values()) / total


def _regime_balance_score(
    action_counts: dict[str, int],
    regime_hit_rate: dict[str, float],
    regime_active_counts: dict[str, int],
    action_names: Sequence[str],
) -> float:
    active_hits = [float(regime_hit_rate[key]) for key, count in regime_active_counts.items() if count > 0]
    hit_component = sum(active_hits) / len(active_hits) if active_hits else 0.0
    non_hold_actions = [name for name in action_names if name != 'hold']
    non_hold_counts = [max(0, int(action_counts.get(name, 0))) for name in non_hold_actions]
    non_hold_total = sum(non_hold_counts)
    if non_hold_total <= 0:
        concentration_component = 0.0
        coverage_component = 0.0
    else:
        dominant_non_hold = max(non_hold_counts) / non_hold_total
        concentration_component = 1.0 - dominant_non_hold
        coverage_component = sum(1 for value in non_hold_counts if value > 0) / max(1, len(non_hold_counts))
    return max(0.0, min(1.0, hit_component * 0.45 + concentration_component * 0.35 + coverage_component * 0.2))


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
        'regime_opportunity_bonus': 0.0,
        'missed_regime_cost': 0.0,
    }
    regime_hits = {
        'continuation': {'hit': 0, 'total': 0},
        'risk_off': {'hit': 0, 'total': 0},
        'hedge': {'hit': 0, 'total': 0},
        'rotation': {'hit': 0, 'total': 0},
    }
    regime_confusion = {
        regime: {action: 0 for action in config.action.discrete_actions}
        for regime in ('continuation', 'risk_off', 'hedge', 'rotation')
    }
    regime_action_reward_sums = {
        regime: {action: 0.0 for action in config.action.discrete_actions}
        for regime in ('continuation', 'risk_off', 'hedge', 'rotation')
    }
    regime_action_reward_counts = {
        regime: {action: 0 for action in config.action.discrete_actions}
        for regime in ('continuation', 'risk_off', 'hedge', 'rotation')
    }
    non_hold_value_add = 0.0
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
        regime_profile = infer_regime_profile(step.observation, direction=step.metadata.get('direction'))
        hold_counterfactual = compute_reward(
            realized_return=step.target_return,
            position_before=before_position,
            position_after=before_position,
            hedge_before=before_hedge,
            hedge_after=before_hedge,
            peak_equity=peak_equity,
            equity_after=before_equity,
            pnl_weight=config.reward.pnl_weight,
            turnover_penalty=config.reward.turnover_penalty,
            drawdown_penalty=config.reward.drawdown_penalty,
            concentration_penalty=config.reward.concentration_penalty,
            event_gap_penalty=config.reward.event_gap_penalty,
            event_risk=float(step.observation.get('event_risk', 0.0)),
            abstain_bonus=config.reward.abstain_bonus,
            action_taken='hold',
            expert_action=step.expert_action,
            expert_alignment_bonus=config.reward.expert_alignment_bonus,
            wrong_way_penalty=config.reward.wrong_way_penalty,
            stale_hold_penalty=config.reward.stale_hold_penalty,
            regime_target_action=regime_profile.target_action,
            regime_target_strength=regime_profile.target_strength,
            regime_opportunity_bonus=config.reward.regime_opportunity_bonus,
            missed_regime_penalty=config.reward.missed_regime_penalty,
        )
        for regime_name, (is_active, target_action, _strength) in _regime_targets(step.observation, direction=step.metadata.get('direction')).items():
            if not is_active:
                continue
            regime_hits[regime_name]['total'] += 1
            regime_confusion[regime_name][result.info['action']] += 1
            regime_action_reward_sums[regime_name][result.info['action']] += float(result.reward)
            regime_action_reward_counts[regime_name][result.info['action']] += 1
            if result.info['action'] == target_action:
                regime_hits[regime_name]['hit'] += 1
        if result.info['action'] != 'hold':
            non_hold_value_add += float(result.reward - hold_counterfactual)
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
            regime_target_action=regime_profile.target_action,
            regime_target_strength=regime_profile.target_strength,
            regime_opportunity_bonus=config.reward.regime_opportunity_bonus,
            missed_regime_penalty=config.reward.missed_regime_penalty,
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

    hold_count = action_counts.get('hold', 0)
    total_actions = max(1, count)
    regime_hit_rate = {}
    regime_active_counts = {}
    for key, values in regime_hits.items():
        regime_active_counts[key] = int(values['total'])
        regime_hit_rate[key] = 0.0 if values['total'] == 0 else values['hit'] / values['total']
    action_value_by_regime = {}
    for regime, rewards in regime_action_reward_sums.items():
        action_value_by_regime[regime] = {}
        for action_name, reward_sum in rewards.items():
            reward_count = int(regime_action_reward_counts[regime][action_name])
            action_value_by_regime[regime][action_name] = 0.0 if reward_count == 0 else reward_sum / reward_count
    dominant_action_share = _dominant_action_share(action_counts)
    regime_balance_score = _regime_balance_score(action_counts, regime_hit_rate, regime_active_counts, config.action.discrete_actions)

    return PolicyReplaySummary(
        name=name,
        total_reward=total_reward,
        mean_reward=total_reward / max(1, count),
        final_equity=env.state.equity,
        max_drawdown=max_drawdown,
        win_rate=wins / max(1, count),
        action_counts=action_counts,
        action_diversity=sum(1 for value in action_counts.values() if value > 0) / max(1, len(config.action.discrete_actions)),
        action_entropy=_normalized_entropy(action_counts, len(config.action.discrete_actions)),
        hold_share=hold_count / total_actions,
        intervention_rate=1.0 - (hold_count / total_actions),
        dominant_action_share=dominant_action_share,
        regime_hit_rate=regime_hit_rate,
        regime_active_counts=regime_active_counts,
        regime_confusion_matrix=regime_confusion,
        regime_balance_score=regime_balance_score,
        action_value_by_regime=action_value_by_regime,
        non_hold_value_add=non_hold_value_add,
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
    hold_rewards: list[float] = []
    action_diversities: list[float] = []

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
        hold_replay = replay_policy(
            name=f'walk_forward_hold_{idx + 1}',
            steps=eval_steps,
            chooser=lambda _obs: 'hold',
            config=config,
        )
        hold_rewards.append(hold_replay.total_reward)
        action_diversities.append(replay.action_diversity)
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
        vs_hold_reward_uplift=(sum(window.total_reward for window in windows) - sum(hold_rewards)) / len(windows),
        mean_action_diversity=sum(action_diversities) / max(1, len(action_diversities)),
    )
