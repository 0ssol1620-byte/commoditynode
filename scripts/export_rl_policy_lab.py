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
from rl.neural_eval import evaluate_neural_walk_forward, replay_policy

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



def _select_policy_profile(dataset, config, preferred_device: str) -> tuple[dict, list[dict]]:
    candidate_devices = ['cpu']
    if preferred_device == 'cuda':
        candidate_devices.append('cuda')
    candidate_timesteps = [1024, 2048]

    train_steps = list(dataset.train)
    eval_steps = list(dataset.val or dataset.test or dataset.train)
    diagnostics: list[dict] = []
    best_profile = {'device': candidate_devices[0], 'timesteps': candidate_timesteps[0]}
    best_score = float('-inf')
    for device in candidate_devices:
        for timesteps in candidate_timesteps:
            result = train_neural_ppo(
                train_steps,
                config=config,
                total_timesteps=timesteps,
                device=device,
            )
            replay = replay_policy(
                name=f'profile_select_{device}_{timesteps}',
                steps=eval_steps,
                chooser=lambda obs, policy=result.policy: policy.decide(obs).action,
                config=config,
            )
            walk = evaluate_neural_walk_forward(
                dataset=dataset,
                config=config,
                total_timesteps=timesteps,
                window_count=3,
                eval_window_size=24,
                min_train_steps=96,
                device=device,
            )
            hold = replay_policy(
                name=f'profile_select_hold_{device}_{timesteps}',
                steps=eval_steps,
                chooser=lambda _obs: 'hold',
                config=config,
            )
            uplift = float(replay.total_reward - hold.total_reward)
            regime_scores = replay.regime_hit_rate or {}
            continuation_hit = float(regime_scores.get('continuation', 0.0))
            risk_off_hit = float(regime_scores.get('risk_off', 0.0))
            hedge_hit = float(regime_scores.get('hedge', 0.0))
            rotation_hit = float(regime_scores.get('rotation', 0.0))
            regime_quality = (continuation_hit + risk_off_hit + hedge_hit + rotation_hit) / 4.0
            score = (
                uplift * 0.9
                + float(walk.vs_hold_reward_uplift) * 0.9
                + replay.action_diversity * 0.18
                + float(replay.action_entropy) * 0.12
                + float(walk.mean_action_diversity) * 0.08
                + regime_quality * 0.25
                + replay.intervention_rate * 0.05
                - replay.hold_share * 0.12
                + replay.win_rate * 0.04
            )
            row = {
                'device': device,
                'timesteps': timesteps,
                'score': float(score),
                'reward': float(replay.total_reward),
                'hold_reward': float(hold.total_reward),
                'uplift_vs_hold': uplift,
                'walk_uplift_vs_hold': float(walk.vs_hold_reward_uplift),
                'walk_positive_rate': float(walk.positive_window_rate),
                'action_diversity': float(replay.action_diversity),
                'action_entropy': float(replay.action_entropy),
                'hold_share': float(replay.hold_share),
                'intervention_rate': float(replay.intervention_rate),
                'regime_hit_rate': replay.regime_hit_rate,
                'walk_action_diversity': float(walk.mean_action_diversity),
                'win_rate': float(replay.win_rate),
            }
            diagnostics.append(row)
            if score > best_score:
                best_score = score
                best_profile = {'device': device, 'timesteps': timesteps}
    return best_profile, diagnostics


def _build_neural_payload(dataset, config) -> dict:
    try:
        import torch

        preferred_device = 'cuda' if torch.cuda.is_available() else 'cpu'
    except Exception:
        torch = None
        preferred_device = 'cpu'

    steps = list(dataset.train)
    if not steps:
        return {
            'available': False,
            'reason': 'dataset.train is empty',
        }

    selected_profile, selection_diagnostics = _select_policy_profile(dataset=dataset, config=config, preferred_device=preferred_device)
    selected_device = selected_profile['device']
    selected_timesteps = int(selected_profile['timesteps'])

    try:
        neural_result = train_neural_ppo(
            steps,
            config=config,
            total_timesteps=selected_timesteps,
            device=selected_device,
        )
    except Exception as exc:
        return {
            'available': False,
            'requested_device': preferred_device,
            'reason': str(exc),
        }

    hold_replay = replay_policy(
        name='hold_baseline',
        steps=list(dataset.test or dataset.val or dataset.train),
        chooser=lambda _obs: 'hold',
        config=config,
    )
    replay = replay_policy(
        name='neural_policy',
        steps=list(dataset.test or dataset.val or dataset.train),
        chooser=lambda obs, policy=neural_result.policy: policy.decide(obs).action,
        config=config,
    )
    walk_forward = evaluate_neural_walk_forward(
        dataset=dataset,
        config=config,
        total_timesteps=selected_timesteps,
        window_count=3,
        eval_window_size=24,
        min_train_steps=96,
        device=selected_device,
    )

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
        'selected_device': selected_device,
        'selected_timesteps': selected_timesteps,
        'profile_selection': selection_diagnostics,
        'torch_cuda_available': bool(torch and torch.cuda.is_available()),
        'report': asdict(neural_result.report),
        'frontier': frontier,
        'replay_summary': asdict(replay),
        'hold_baseline': asdict(hold_replay),
        'walk_forward': asdict(walk_forward),
        'vs_hold_reward_uplift': float(replay.total_reward - hold_replay.total_reward),
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
