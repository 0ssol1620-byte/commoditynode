#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from rl.config import get_default_rl_config
from rl.dataset import build_trajectory_dataset
from rl.neural_ppo import train_neural_ppo

OUTPUT = ROOT / 'artifacts' / 'rl-policy-lab-neural-ppo-benchmark.json'


BENCHMARK_TIERS = (
    {'name': 'smoke', 'step_count': 128, 'timesteps': 512},
    {'name': 'extended', 'step_count': 192, 'timesteps': 1024},
)


def run_case(device: str, steps, config, total_timesteps: int):
    started = time.perf_counter()
    result = train_neural_ppo(steps, config=config, total_timesteps=total_timesteps, device=device)
    elapsed = time.perf_counter() - started
    return {
        'device': device,
        'seconds': elapsed,
        'timesteps': total_timesteps,
        'final_action': result.report.final_action,
        'confidence': result.report.confidence,
        'mean_reward_estimate': result.report.mean_reward_estimate,
    }


def main() -> None:
    config = get_default_rl_config()
    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold', 'copper'), config=config)
    all_steps = list(dataset.train)
    tiers = {}
    for tier in BENCHMARK_TIERS:
        steps = all_steps[:tier['step_count']]
        cpu = run_case('cpu', steps, config, total_timesteps=tier['timesteps'])
        gpu = run_case('cuda', steps, config, total_timesteps=tier['timesteps'])
        tiers[tier['name']] = {
            'step_count': tier['step_count'],
            'cpu': cpu,
            'gpu': gpu,
            'speedup_vs_cpu': cpu['seconds'] / gpu['seconds'] if gpu['seconds'] else None,
        }

    smoke = tiers['smoke']
    payload = {
        'cpu': smoke['cpu'],
        'gpu': smoke['gpu'],
        'speedup_vs_cpu': smoke['speedup_vs_cpu'],
        'tiers': tiers,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2), encoding='utf-8')
    print(str(OUTPUT))
    print(json.dumps(payload, indent=2))


if __name__ == '__main__':
    main()
