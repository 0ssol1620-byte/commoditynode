from __future__ import annotations

from dataclasses import dataclass

from .config import RLExperimentConfig, get_default_rl_config
from .env import CommodityTradingEnv
from .offline_train import ACTIONS, OfflinePolicyModel, OfflineTrainingResult, train_offline_policy


@dataclass(frozen=True)
class PPOTrainingReport:
    algorithm: str
    episodes: int
    mean_reward: float
    best_reward: float
    action_bias: dict[str, float]


@dataclass(frozen=True)
class PPOTrainingResult:
    model: OfflinePolicyModel
    report: PPOTrainingReport


def fine_tune_with_ppo(
    env: CommodityTradingEnv,
    offline_result: OfflineTrainingResult | None = None,
    config: RLExperimentConfig | None = None,
    episodes: int = 4,
) -> PPOTrainingResult:
    config = config or get_default_rl_config()
    if offline_result is None:
        steps = tuple(env.steps)
        split_idx = max(1, int(len(steps) * 0.8))
        from .dataset import RLTrajectoryDataset
        offline_result = train_offline_policy(RLTrajectoryDataset(train=steps[:split_idx], val=steps[split_idx:], test=()))

    action_scores = dict(offline_result.model.action_scores)
    episode_rewards: list[float] = []

    for _ in range(episodes):
        obs, _ = env.reset()
        done = False
        total_reward = 0.0
        while not done:
            mask = env.valid_action_mask()
            ranked = []
            for action in ACTIONS:
                score = action_scores.get(action, 0.0)
                if not mask.get(action, False):
                    score -= 1.0
                score += float(obs.get('agreement_score', 0.0)) * (0.2 if action == 'add_continuation' else 0.0)
                score += float(obs.get('anomaly_score', 0.0)) * (0.2 if action == 'reduce_risk' else 0.0)
                score += float(obs.get('event_risk', 0.0)) * (0.2 if action == 'add_hedge' else 0.0)
                ranked.append((action, score))
            ranked.sort(key=lambda item: item[1], reverse=True)
            action = ranked[0][0]
            result = env.step(action)
            total_reward += result.reward
            action_scores[action] = action_scores.get(action, 0.0) + result.reward * 0.25
            obs = result.observation
            done = result.terminated or result.truncated
        episode_rewards.append(total_reward)

    model = OfflinePolicyModel(
        action_scores=action_scores,
        action_counts=offline_result.model.action_counts,
        total_steps=offline_result.model.total_steps,
    )
    report = PPOTrainingReport(
        algorithm=config.training.online_algorithm,
        episodes=episodes,
        mean_reward=float(sum(episode_rewards) / len(episode_rewards)) if episode_rewards else 0.0,
        best_reward=float(max(episode_rewards)) if episode_rewards else 0.0,
        action_bias=action_scores,
    )
    return PPOTrainingResult(model=model, report=report)
