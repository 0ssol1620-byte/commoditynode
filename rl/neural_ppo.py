from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryStep
from .env import CommodityTradingEnv


@dataclass(frozen=True)
class NeuralPPOTrainingReport:
    timesteps: int
    final_action: str
    confidence: float
    mean_reward_estimate: float


class GymCommodityEnv(__import__('gymnasium').Env):
    metadata = {'render_modes': []}

    def __init__(self, steps: Sequence[RLTrajectoryStep], config: RLExperimentConfig | None = None):
        import gymnasium as gym
        import numpy as np

        super().__init__()
        self._np = np
        self.config = config or get_default_rl_config()
        self.base_env = CommodityTradingEnv(list(steps), self.config)
        sample_obs, _ = self.base_env.reset()
        self.feature_keys = tuple(sorted(k for k, v in sample_obs.items() if isinstance(v, (int, float))))
        self.action_names = self.config.action.discrete_actions
        self.observation_space = gym.spaces.Box(
            low=-1e6,
            high=1e6,
            shape=(len(self.feature_keys),),
            dtype=np.float32,
        )
        self.action_space = gym.spaces.Discrete(len(self.action_names))

    def _vectorize(self, observation: dict) -> 'self._np.ndarray':
        return self._np.asarray([float(observation.get(key, 0.0)) for key in self.feature_keys], dtype=self._np.float32)

    def reset(self, *, seed=None, options=None):
        observation, info = self.base_env.reset()
        return self._vectorize(observation), info

    def step(self, action_idx: int):
        action_name = self.action_names[int(action_idx)]
        result = self.base_env.step(action_name)
        observation = self._vectorize(result.observation)
        return observation, float(result.reward), bool(result.terminated), bool(result.truncated), result.info


@dataclass(frozen=True)
class NeuralPPODecision:
    action: str
    confidence: float


class NeuralPPOPolicy:
    def __init__(self, model, action_names: Sequence[str]):
        self.model = model
        self.action_names = tuple(action_names)

    def decide(self, observation_vector) -> NeuralPPODecision:
        import numpy as np
        import torch

        obs_tensor = torch.as_tensor(np.asarray(observation_vector, dtype=np.float32)).reshape(1, -1)
        distribution = self.model.policy.get_distribution(obs_tensor)
        probs = distribution.distribution.probs.detach().cpu().numpy()[0]
        action_idx = int(probs.argmax())
        return NeuralPPODecision(
            action=self.action_names[action_idx],
            confidence=float(probs[action_idx]),
        )


@dataclass(frozen=True)
class NeuralPPOTrainingResult:
    policy: NeuralPPOPolicy
    report: NeuralPPOTrainingReport


def train_neural_ppo(
    steps: Sequence[RLTrajectoryStep],
    config: RLExperimentConfig | None = None,
    total_timesteps: int = 256,
    learning_rate: float = 3e-4,
) -> NeuralPPOTrainingResult:
    from stable_baselines3 import PPO

    config = config or get_default_rl_config()
    env = GymCommodityEnv(steps, config)
    rollout_steps = 64 if len(steps) > 80 else 32 if len(steps) > 40 else max(16, len(steps) - 1)
    batch_size = 16 if rollout_steps % 16 == 0 else 8 if rollout_steps % 8 == 0 else rollout_steps
    model = PPO(
        'MlpPolicy',
        env,
        learning_rate=learning_rate,
        n_steps=rollout_steps,
        batch_size=batch_size,
        n_epochs=2,
        gamma=0.99,
        gae_lambda=0.95,
        clip_range=0.2,
        ent_coef=0.01,
        vf_coef=0.5,
        verbose=0,
        seed=config.training.seed,
    )
    model.learn(total_timesteps=total_timesteps, progress_bar=False)
    obs, _ = env.reset()
    decision = NeuralPPOPolicy(model, env.action_names).decide(obs)

    # quick deterministic roll-forward estimate
    obs, _ = env.reset()
    done = False
    total_reward = 0.0
    while not done:
        action, _state = model.predict(obs, deterministic=True)
        obs, reward, terminated, truncated, _info = env.step(action)
        total_reward += float(reward)
        done = bool(terminated or truncated)

    policy = NeuralPPOPolicy(model, env.action_names)
    report = NeuralPPOTrainingReport(
        timesteps=total_timesteps,
        final_action=decision.action,
        confidence=decision.confidence,
        mean_reward_estimate=total_reward / max(1, len(steps)),
    )
    return NeuralPPOTrainingResult(policy=policy, report=report)
