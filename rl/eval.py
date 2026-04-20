from __future__ import annotations

from dataclasses import dataclass

from .baselines import DirectionalClassifierPolicy, NoTradePolicy, RuleBasedPolicy
from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryDataset, RLTrajectoryStep, build_trajectory_dataset
from .env import CommodityTradingEnv
from .offline_train import OfflinePolicyModel, OfflineTrainingResult, train_offline_policy
from .ppo_train import PPOTrainingResult, fine_tune_with_ppo


@dataclass(frozen=True)
class PolicyEvalSummary:
    name: str
    mean_reward: float
    total_reward: float
    steps: int
    action_counts: dict[str, int]


@dataclass(frozen=True)
class RLBenchmarkResult:
    offline: PolicyEvalSummary
    ppo: PolicyEvalSummary
    rule_based: PolicyEvalSummary
    no_trade: PolicyEvalSummary
    directional: PolicyEvalSummary


def _run_policy(name: str, steps: tuple[RLTrajectoryStep, ...], chooser) -> PolicyEvalSummary:
    env = CommodityTradingEnv(list(steps))
    obs, _ = env.reset()
    done = False
    total_reward = 0.0
    action_counts: dict[str, int] = {}
    count = 0
    while not done:
        action = chooser(obs)
        action_counts[action] = action_counts.get(action, 0) + 1
        result = env.step(action)
        total_reward += result.reward
        count += 1
        obs = result.observation
        done = result.terminated or result.truncated
    return PolicyEvalSummary(
        name=name,
        mean_reward=(total_reward / count) if count else 0.0,
        total_reward=total_reward,
        steps=count,
        action_counts=action_counts,
    )


def evaluate_rl_stack(
    dataset: RLTrajectoryDataset | None = None,
    config: RLExperimentConfig | None = None,
) -> RLBenchmarkResult:
    config = config or get_default_rl_config()
    dataset = dataset or build_trajectory_dataset(config=config)
    eval_steps = dataset.test or dataset.val or dataset.train
    offline_result = train_offline_policy(dataset, config)
    offline_env = CommodityTradingEnv(list(eval_steps), config)
    ppo_result = fine_tune_with_ppo(offline_env, offline_result=offline_result, config=config, episodes=4)

    offline_summary = _run_policy('offline', eval_steps, lambda obs: offline_result.model.decide(obs)[0])
    ppo_summary = _run_policy('ppo', eval_steps, lambda obs: ppo_result.model.decide(obs)[0])
    rule_policy = RuleBasedPolicy()
    no_trade_policy = NoTradePolicy()
    directional_policy = DirectionalClassifierPolicy()
    rule_summary = _run_policy('rule_based', eval_steps, lambda obs: rule_policy.decide(obs).action)
    no_trade_summary = _run_policy('no_trade', eval_steps, lambda obs: no_trade_policy.decide(obs).action)
    directional_summary = _run_policy('directional', eval_steps, lambda obs: directional_policy.decide({'probability_up': float(obs.get('agreement_score', 0.5))}).action)
    return RLBenchmarkResult(
        offline=offline_summary,
        ppo=ppo_summary,
        rule_based=rule_summary,
        no_trade=no_trade_summary,
        directional=directional_summary,
    )
