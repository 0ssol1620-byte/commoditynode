from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping, Sequence

from .config import RLExperimentConfig, get_default_rl_config
from .dataset import RLTrajectoryStep
from .env import CommodityTradingEnv


class BehaviorCloningPrior:
    def __init__(self, model, action_names: Sequence[str], feature_keys: Sequence[str], device: str):
        self.model = model
        self.action_names = tuple(action_names)
        self.feature_keys = tuple(feature_keys)
        self.device = device

    def action_probabilities(self, observation) -> dict[str, float]:
        import numpy as np
        import torch

        if isinstance(observation, Mapping):
            obs_vector = np.asarray([float(observation.get(key, 0.0)) for key in self.feature_keys], dtype=np.float32)
        else:
            obs_vector = np.asarray(observation, dtype=np.float32)
        obs_tensor = torch.as_tensor(obs_vector, device=self.device).reshape(1, -1)
        with torch.no_grad():
            logits = self.model(obs_tensor)
            probs = torch.softmax(logits, dim=-1).detach().cpu().numpy()[0]
        return {action: float(probs[idx]) for idx, action in enumerate(self.action_names)}


def train_behavior_cloning_prior(
    steps: Sequence[RLTrajectoryStep],
    feature_keys: Sequence[str],
    action_names: Sequence[str],
    device: str = 'cpu',
    epochs: int = 120,
    learning_rate: float = 1e-3,
    seed: int = 42,
):
    import numpy as np
    import torch

    if not steps:
        return None

    torch.manual_seed(int(seed))
    if device == 'cuda' and torch.cuda.is_available():
        torch.cuda.manual_seed_all(int(seed))

    action_to_idx = {action: idx for idx, action in enumerate(action_names)}
    x = np.asarray(
        [[float(step.observation.get(key, 0.0)) for key in feature_keys] for step in steps],
        dtype=np.float32,
    )
    y = np.asarray([action_to_idx.get(step.expert_action, action_to_idx['hold']) for step in steps], dtype=np.int64)
    class_counts = np.bincount(y, minlength=len(action_names)).astype(np.float32)
    class_weights = np.where(class_counts > 0, len(y) / np.maximum(class_counts, 1.0), 0.0)
    if class_weights.sum() > 0:
        class_weights = class_weights / class_weights.sum() * len(action_names)
    model = torch.nn.Sequential(
        torch.nn.Linear(len(feature_keys), 128),
        torch.nn.ReLU(),
        torch.nn.Linear(128, 128),
        torch.nn.ReLU(),
        torch.nn.Linear(128, len(action_names)),
    ).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    criterion = torch.nn.CrossEntropyLoss(weight=torch.as_tensor(class_weights, device=device, dtype=torch.float32))
    features = torch.as_tensor(x, device=device)
    labels = torch.as_tensor(y, device=device)
    model.train()
    for _ in range(max(1, epochs)):
        optimizer.zero_grad(set_to_none=True)
        logits = model(features)
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()
    model.eval()
    return BehaviorCloningPrior(model, action_names, feature_keys, device)


@dataclass(frozen=True)
class NeuralPPOTrainingReport:
    timesteps: int
    final_action: str
    confidence: float
    mean_reward_estimate: float
    device_used: str


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

    def action_masks(self):
        return self._np.asarray(self.base_env.action_mask_array(), dtype=bool)

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
    def __init__(self, model, action_names: Sequence[str], feature_keys: Sequence[str], prior_policy: BehaviorCloningPrior | None = None, prior_weight: float = 0.65):
        self.model = model
        self.action_names = tuple(action_names)
        self.feature_keys = tuple(feature_keys)
        self.prior_policy = prior_policy
        self.prior_weight = float(max(0.0, min(1.0, prior_weight)))

    def _coerce_observation(self, observation):
        import numpy as np

        if isinstance(observation, Mapping):
            return np.asarray([float(observation.get(key, 0.0)) for key in self.feature_keys], dtype=np.float32)
        return np.asarray(observation, dtype=np.float32)

    def action_probabilities(self, observation) -> dict[str, float]:
        import torch

        device = getattr(self.model, 'device', 'cpu')
        obs_vector = self._coerce_observation(observation)
        obs_tensor = torch.as_tensor(obs_vector, device=device).reshape(1, -1)
        distribution = self.model.policy.get_distribution(obs_tensor)
        ppo_probs = distribution.distribution.probs.detach().cpu().numpy()[0]
        probs = {action: float(ppo_probs[idx]) for idx, action in enumerate(self.action_names)}
        if self.prior_policy is not None and self.prior_weight > 0.0:
            prior_probs = self.prior_policy.action_probabilities(observation)
            blended = {}
            for action in self.action_names:
                blended[action] = (1.0 - self.prior_weight) * probs.get(action, 0.0) + self.prior_weight * prior_probs.get(action, 0.0)
            total = sum(blended.values()) or 1.0
            probs = {action: float(value / total) for action, value in blended.items()}
        return probs

    def decide(self, observation) -> NeuralPPODecision:
        probs = self.action_probabilities(observation)
        action = max(probs, key=probs.get)
        return NeuralPPODecision(
            action=action,
            confidence=float(probs[action]),
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
    device: str = 'auto',
) -> NeuralPPOTrainingResult:
    import random
    import numpy as np
    import torch

    policy_kwargs = {'net_arch': {'pi': [128, 128], 'vf': [128, 128]}}
    try:
        from sb3_contrib import MaskablePPO as PPOImpl
        algorithm_name = 'maskable_ppo'
    except Exception:
        from stable_baselines3 import PPO as PPOImpl
        algorithm_name = 'ppo'

    config = config or get_default_rl_config()
    random.seed(config.training.seed)
    np.random.seed(config.training.seed)
    torch.manual_seed(config.training.seed)
    if device == 'cuda' and torch.cuda.is_available():
        torch.cuda.manual_seed_all(config.training.seed)
    env = GymCommodityEnv(steps, config)
    bc_prior = train_behavior_cloning_prior(
        steps,
        feature_keys=env.feature_keys,
        action_names=env.action_names,
        device='cuda' if device == 'cuda' else 'cpu',
        epochs=160 if len(steps) > 160 else 120,
        seed=config.training.seed,
    )
    rollout_steps = 256 if len(steps) > 256 else 128 if len(steps) > 160 else 64 if len(steps) > 80 else 32 if len(steps) > 40 else max(16, len(steps) - 1)
    batch_size = 64 if rollout_steps % 64 == 0 else 32 if rollout_steps % 32 == 0 else 16 if rollout_steps % 16 == 0 else 8 if rollout_steps % 8 == 0 else rollout_steps
    model = PPOImpl(
        'MlpPolicy',
        env,
        learning_rate=learning_rate,
        n_steps=rollout_steps,
        batch_size=batch_size,
        n_epochs=10,
        gamma=0.997,
        gae_lambda=0.98,
        clip_range=0.2,
        ent_coef=0.01,
        vf_coef=0.75,
        max_grad_norm=0.5,
        policy_kwargs=policy_kwargs,
        verbose=0,
        seed=config.training.seed,
        device=device,
    )
    model.learn(total_timesteps=total_timesteps, progress_bar=False)
    obs, _ = env.reset()
    decision = NeuralPPOPolicy(model, env.action_names, env.feature_keys, prior_policy=bc_prior).decide(obs)

    obs, _ = env.reset()
    done = False
    total_reward = 0.0
    while not done:
        predict_kwargs = {'deterministic': True}
        if hasattr(env, 'action_masks') and algorithm_name == 'maskable_ppo':
            predict_kwargs['action_masks'] = env.action_masks()
        action, _state = model.predict(obs, **predict_kwargs)
        obs, reward, terminated, truncated, _info = env.step(action)
        total_reward += float(reward)
        done = bool(terminated or truncated)

    policy = NeuralPPOPolicy(model, env.action_names, env.feature_keys, prior_policy=bc_prior)
    report = NeuralPPOTrainingReport(
        timesteps=total_timesteps,
        final_action=decision.action,
        confidence=decision.confidence,
        mean_reward_estimate=total_reward / max(1, len(steps)),
        device_used=str(getattr(model, 'device', device)),
    )
    return NeuralPPOTrainingResult(policy=policy, report=report)
