#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from rl.config import get_default_rl_config
from rl.dataset import build_trajectory_dataset
from rl.neural_ppo import train_neural_ppo

OUTPUT = ROOT / 'artifacts' / 'rl-policy-lab-neural-ppo-smoke.json'


def main() -> None:
    config = get_default_rl_config()
    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold'), config=config)
    steps = list(dataset.train[:96])
    result = train_neural_ppo(steps, config=config, total_timesteps=256)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({
        'timesteps': result.report.timesteps,
        'final_action': result.report.final_action,
        'confidence': result.report.confidence,
        'mean_reward_estimate': result.report.mean_reward_estimate,
    }, indent=2), encoding='utf-8')
    print(str(OUTPUT))


if __name__ == '__main__':
    main()
