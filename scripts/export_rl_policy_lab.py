from __future__ import annotations

import json
import subprocess
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
from rl.neural_ppo import train_neural_ppo

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / 'assets' / 'data' / 'rl-policy-lab.json'


def _load_benchmark_artifact() -> dict | None:
    benchmark_path = ROOT / 'artifacts' / 'rl-policy-lab-neural-ppo-benchmark.json'
    if not benchmark_path.exists():
        return None
    try:
        return json.loads(benchmark_path.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        return None



def _current_commit_marker() -> str:
    try:
        sha = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT, text=True).strip()
        return f'{sha}+'
    except Exception:
        return 'unknown'



def _build_neural_payload(dataset, config) -> dict:
    try:
        import torch

        preferred_device = 'cuda' if torch.cuda.is_available() else 'cpu'
    except Exception:
        torch = None
        preferred_device = 'cpu'

    steps = list(dataset.train[:128] or dataset.train)
    if not steps:
        return {
            'available': False,
            'reason': 'dataset.train is empty',
        }

    try:
        neural_result = train_neural_ppo(
            steps,
            config=config,
            total_timesteps=512,
            device=preferred_device,
        )
    except Exception as exc:
        return {
            'available': False,
            'requested_device': preferred_device,
            'reason': str(exc),
        }

    frontier = []
    for commodity in config.commodity_keys:
        commodity_steps = [step for step in dataset.train if step.commodity == commodity]
        if not commodity_steps:
            continue
        sample = commodity_steps[-1]
        probs = neural_result.policy.action_probabilities(sample.observation)
        action = max(probs, key=probs.get)
        frontier.append({
            'commodity': commodity,
            'timestamp': sample.timestamp,
            'action': action,
            'confidence': round(float(probs[action]), 4),
            'probabilities': {name: round(float(value), 4) for name, value in probs.items()},
        })

    payload = {
        'available': True,
        'requested_device': preferred_device,
        'torch_cuda_available': bool(torch and torch.cuda.is_available()),
        'report': asdict(neural_result.report),
        'frontier': frontier,
    }
    benchmark = _load_benchmark_artifact()
    if benchmark:
        payload['performance'] = benchmark
    return payload



def build_export_payload() -> dict:
    config = get_default_rl_config()
    dataset = build_trajectory_dataset(config=config)
    offline_result = train_offline_policy(dataset, config)
    env = CommodityTradingEnv(list(dataset.test or dataset.val or dataset.train), config)
    ppo_result = fine_tune_with_ppo(env, offline_result=offline_result, config=config, episodes=4)
    benchmark = evaluate_rl_stack(dataset=dataset, config=config)
    neural_payload = _build_neural_payload(dataset=dataset, config=config)
    frontier = []
    for commodity in config.commodity_keys:
        commodity_steps = [step for step in dataset.train if step.commodity == commodity]
        if not commodity_steps:
            continue
        sample = commodity_steps[-1]
        offline_action, offline_conf = offline_result.model.decide(sample.observation)
        ppo_action, ppo_conf = ppo_result.model.decide(sample.observation)
        frontier_item = {
            'commodity': commodity,
            'timestamp': sample.timestamp,
            'offline_action': offline_action,
            'offline_confidence': round(offline_conf, 4),
            'ppo_action': ppo_action,
            'ppo_confidence': round(ppo_conf, 4),
            'observation': sample.observation,
        }
        if neural_payload.get('available'):
            neural_frontier = next((item for item in neural_payload.get('frontier', []) if item.get('commodity') == commodity), None)
            if neural_frontier:
                frontier_item['neural_action'] = neural_frontier.get('action')
                frontier_item['neural_confidence'] = neural_frontier.get('confidence')
                frontier_item['neural_probabilities'] = neural_frontier.get('probabilities')
        frontier.append(frontier_item)

    episode_replay = []
    eval_steps = list(dataset.test[:5] or dataset.val[:5] or dataset.train[:5])
    for step in eval_steps:
        offline_action, offline_conf = offline_result.model.decide(step.observation)
        ppo_action, ppo_conf = ppo_result.model.decide(step.observation)
        replay_item = {
            'commodity': step.commodity,
            'timestamp': step.timestamp,
            'target_return': round(step.target_return, 6),
            'expert_action': step.expert_action,
            'offline_action': offline_action,
            'offline_confidence': round(offline_conf, 4),
            'ppo_action': ppo_action,
            'ppo_confidence': round(ppo_conf, 4),
        }
        if neural_payload.get('available'):
            neural_decision = neural_payload.get('frontier', [])
            neural_entry = next((item for item in neural_decision if item.get('commodity') == step.commodity), None)
            if neural_entry:
                replay_item['neural_action'] = neural_entry.get('action')
                replay_item['neural_confidence'] = neural_entry.get('confidence')
        episode_replay.append(replay_item)

    return {
        'updated_from_commit': _current_commit_marker(),
        'config': asdict(config),
        'offline_report': asdict(offline_result.report),
        'ppo_report': asdict(ppo_result.report),
        'benchmark': asdict(benchmark),
        'neural_policy': neural_payload,
        'policy_frontier': frontier,
        'episode_replay': episode_replay,
    }


def main() -> None:
    payload = build_export_payload()
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2), encoding='utf-8')
    print(str(OUTPUT_PATH))


if __name__ == '__main__':
    main()
