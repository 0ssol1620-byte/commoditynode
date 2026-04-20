# CommodityNode RL Policy Lab — Real RL System Plan

> For Hermes: Use subagent-driven-development skill to implement this plan task-by-task.

Goal: Replace the current heuristic RL Policy Lab with a real high-performance reinforcement-learning stack that learns commodity-sensitive decision policies from historical data plus a simulator, then exposes policy frontier / episode replay / reward decomposition to the site.

Architecture:
- Do not ship PPO-only. For this domain, the highest-quality path is offline-first RL: build a trading/risk environment from existing forecast + alpha-signal + backtest data, train strong offline policies first (IQL/CQL style), then fine-tune with PPO in a constrained simulator.
- Use the existing CommodityNode forecast and signal stack as the observation backbone: prices, model agreement, anomaly score, event probabilities, alpha signals, direction classifier, and ripple/exposure features.
- Split the system into 4 layers: dataset builder, environment, trainer, and web-facing artifact exporter.

Grounded repo facts:
- Current repo already has forecasting/backtest assets:
  - scripts/backtest_forecast.py
  - scripts/alpha_signals.py
  - scripts/direction_classifier.py
  - scripts/timesfm_sota_train.py
  - assets/data/forecast.json
  - assets/data/forecast-consensus.json
- Current live RL Policy Lab is heuristic only.
- Current environment on this machine:
  - Python 3.11.15
  - no nvidia-smi available
  - torch / stable_baselines3 / gymnasium / ray / tianshou not installed in the default python

Recommended algorithm stack:
1. Offline policy learning baseline:
   - IQL or CQL for robust offline learning from historical trajectories
2. Online fine-tune in constrained simulator:
   - PPO with clipped objectives, action masking, and heavy risk penalties
3. Comparative baselines:
   - rule policy
   - supervised directional policy
   - PPO-from-scratch
   - offline-policy-only
   - offline-policy + PPO fine-tune

Reward design:
- Primary:
  - risk-adjusted pnl
- Penalties:
  - turnover
  - drawdown
  - volatility overshoot
  - inventory / exposure concentration
  - event-gap risk before scheduled catalysts
- Auxiliary shaping:
  - direction alignment
  - hedge efficiency
  - regime consistency

Action space:
- Continuous or discretized portfolio/risk actions:
  - reduce risk
  - hold
  - add continuation exposure
  - add hedge
  - relative-value rotation
  - size scalar / hedge ratio

Observation space:
- price path windows
- forecast consensus path
- Chronos-2 / TimesFM spread features
- agreement score
- anomaly score
- alpha signal features from scripts/alpha_signals.py
- direction classifier output
- regime/event state
- exposure/ripple features

Training artifacts to export for web product:
- policy frontier by state
- recommended action + confidence
- reward decomposition
- episode replay snippets
- regret vs baseline
- fallback / abstain probability

---

### Task 1: Create RL package skeleton
Objective: Add a clean package for real RL training and evaluation.

Files:
- Create: rl/__init__.py
- Create: rl/config.py
- Create: rl/spaces.py
- Create: rl/types.py
- Create: tests/test_rl_config.py

Step 1: Write failing tests for config defaults and basic schema.
Step 2: Implement minimal typed config for observation/action/reward settings.
Step 3: Verify tests pass.

### Task 2: Build trajectory dataset assembler
Objective: Turn existing CommodityNode signals/forecasts into trajectory data for RL.

Files:
- Create: rl/dataset.py
- Create: rl/features.py
- Create: tests/test_rl_dataset.py
- Read from existing:
  - scripts/backtest_forecast.py
  - scripts/alpha_signals.py
  - scripts/direction_classifier.py

Requirements:
- Use commodity windows and aligned feature tensors.
- Export train/val/test trajectory splits.
- Include event/regime/anomaly features.

### Task 3: Build a real environment
Objective: Implement a gym-style environment for commodity decision policies.

Files:
- Create: rl/env.py
- Create: rl/reward.py
- Create: tests/test_rl_env.py

Requirements:
- reset / step interface
- transaction costs
- drawdown tracking
- position and hedge state
- action masking for invalid transitions
- deterministic replay mode for evaluation

### Task 4: Add baseline agents
Objective: Create non-RL baselines to benchmark RL honestly.

Files:
- Create: rl/baselines.py
- Create: tests/test_rl_baselines.py

Requirements:
- rule-based policy
- supervised directional policy wrapper
- no-trade policy

### Task 5: Add offline RL trainer
Objective: Implement offline-first policy training.

Files:
- Create: rl/offline_train.py
- Create: rl/models.py
- Create: tests/test_rl_offline_train.py

Requirements:
- initial implementation can use behavior cloning + advantage-weighted updates
- structure code so IQL/CQL variants can be swapped in
- save checkpoints and evaluation metrics

### Task 6: Add PPO fine-tuning trainer
Objective: Fine-tune the best offline policy in the simulator with PPO.

Files:
- Create: rl/ppo_train.py
- Create: tests/test_rl_ppo_train.py

Requirements:
- clipped PPO objective
- entropy bonus
- gradient clipping
- action constraints / masking
- early stopping on unstable reward or drawdown blowout

### Task 7: Add evaluation harness
Objective: Benchmark all policies and output product-ready metrics.

Files:
- Create: rl/eval.py
- Create: rl/report.py
- Create: tests/test_rl_eval.py

Metrics:
- pnl
- sharpe-ish reward
- max drawdown
- turnover
- win rate
- regret vs best baseline
- abstain rate
- event-window performance

### Task 8: Export web-facing artifacts
Objective: Convert trained policy outputs into JSON that the site can render.

Files:
- Create: scripts/export_rl_policy_lab.py
- Create: assets/data/rl-policy-lab.json
- Create: tests/test_export_rl_policy_lab.py

Requirements:
- export policy frontier
- reward decomposition
- episode replay
- recommended action per commodity/state
- confidence + fallback state

### Task 9: Wire real RL artifacts into site
Objective: Replace heuristic-only RL Policy Lab rendering with real exported RL artifacts.

Files:
- Modify: assets/js/intelligence-product.js
- Modify: intelligence-lab/rl-policy-lab/index.html

Requirements:
- prefer real RL artifact JSON if present
- preserve existing UI shell
- expose “trained policy / offline policy / PPO fine-tuned” comparisons

### Task 10: Training/runtime scripts and docs
Objective: Make the RL pipeline executable and reproducible.

Files:
- Create: scripts/run_rl_policy_lab_pipeline.sh
- Create: docs/experiments/YYYY-MM-DD-rl-policy-lab-benchmark.md

Requirements:
- install instructions
- CPU-safe smoke test mode
- full training mode
- artifact locations
- benchmark summary

Verification commands (target state):
- pytest tests/test_rl_config.py tests/test_rl_dataset.py tests/test_rl_env.py tests/test_rl_baselines.py tests/test_rl_offline_train.py tests/test_rl_ppo_train.py tests/test_rl_eval.py tests/test_export_rl_policy_lab.py -q
- python3 scripts/export_rl_policy_lab.py
- python3 -m rl.eval

Notes:
- “Latest RL model” here should mean latest strong system design, not hype naming. For this repo, the best product/performance path is offline RL + PPO refinement, not raw PPO-first.
- If GPU remains unavailable, implement CPU smoke tests first and keep full training behind an environment gate.
