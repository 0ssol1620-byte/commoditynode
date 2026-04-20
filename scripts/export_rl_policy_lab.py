from __future__ import annotations

import json
import sys
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from rl.config import get_default_rl_config
from rl.dataset import build_trajectory_dataset
from rl.eval import evaluate_rl_stack
from rl.offline_train import train_offline_policy
from rl.ppo_train import fine_tune_with_ppo
from rl.env import CommodityTradingEnv

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / 'assets' / 'data' / 'rl-policy-lab.json'


def build_export_payload() -> dict:
    config = get_default_rl_config()
    dataset = build_trajectory_dataset(config=config)
    offline_result = train_offline_policy(dataset, config)
    env = CommodityTradingEnv(list(dataset.test or dataset.val or dataset.train), config)
    ppo_result = fine_tune_with_ppo(env, offline_result=offline_result, config=config, episodes=4)
    benchmark = evaluate_rl_stack(dataset=dataset, config=config)
    frontier = []
    for commodity in config.commodity_keys:
        commodity_steps = [step for step in dataset.train if step.commodity == commodity]
        if not commodity_steps:
            continue
        sample = commodity_steps[-1]
        offline_action, offline_conf = offline_result.model.decide(sample.observation)
        ppo_action, ppo_conf = ppo_result.model.decide(sample.observation)
        frontier.append({
            'commodity': commodity,
            'timestamp': sample.timestamp,
            'offline_action': offline_action,
            'offline_confidence': round(offline_conf, 4),
            'ppo_action': ppo_action,
            'ppo_confidence': round(ppo_conf, 4),
            'observation': sample.observation,
        })

    episode_replay = []
    eval_steps = list(dataset.test[:5] or dataset.val[:5] or dataset.train[:5])
    for step in eval_steps:
        offline_action, offline_conf = offline_result.model.decide(step.observation)
        ppo_action, ppo_conf = ppo_result.model.decide(step.observation)
        episode_replay.append({
            'commodity': step.commodity,
            'timestamp': step.timestamp,
            'target_return': round(step.target_return, 6),
            'expert_action': step.expert_action,
            'offline_action': offline_action,
            'offline_confidence': round(offline_conf, 4),
            'ppo_action': ppo_action,
            'ppo_confidence': round(ppo_conf, 4),
        })

    return {
        'updated_from_commit': 'e7e7737+',
        'config': asdict(config),
        'offline_report': asdict(offline_result.report),
        'ppo_report': asdict(ppo_result.report),
        'benchmark': asdict(benchmark),
        'policy_frontier': frontier,
        'episode_replay': episode_replay,
    }


def main() -> None:
    payload = build_export_payload()
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2), encoding='utf-8')
    print(str(OUTPUT_PATH))


if __name__ == '__main__':
    main()
