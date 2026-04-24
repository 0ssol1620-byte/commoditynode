import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def test_score_profile_row_prefers_balanced_multi_regime_policy():
    from scripts.export_rl_policy_lab import score_profile_row

    concentrated = {
        'uplift_vs_hold': 5.9,
        'walk_uplift_vs_hold': 2.8,
        'action_diversity': 0.6,
        'action_entropy': 0.42,
        'walk_action_diversity': 0.6,
        'target_action_match_rate': 0.19,
        'target_action_distribution_gap': 0.55,
        'regime_hit_rate': {
            'continuation': 0.0,
            'hedge': 0.04,
            'risk_off': 0.86,
            'rotation': 0.58,
        },
        'regime_balance_score': 0.43,
        'intervention_rate': 1.0,
        'non_hold_value_add': 10.6,
        'hold_share': 0.0,
        'dominant_action_share': 0.66,
        'win_rate': 0.53,
    }
    balanced = {
        'uplift_vs_hold': 5.3,
        'walk_uplift_vs_hold': 2.5,
        'action_diversity': 1.0,
        'action_entropy': 0.74,
        'walk_action_diversity': 0.8,
        'target_action_match_rate': 0.52,
        'target_action_distribution_gap': 0.18,
        'regime_hit_rate': {
            'continuation': 0.28,
            'hedge': 0.17,
            'risk_off': 0.79,
            'rotation': 0.42,
        },
        'regime_balance_score': 0.62,
        'intervention_rate': 0.97,
        'non_hold_value_add': 9.5,
        'hold_share': 0.03,
        'dominant_action_share': 0.38,
        'win_rate': 0.51,
    }

    assert score_profile_row(balanced) > score_profile_row(concentrated)


def test_score_profile_row_rejects_single_action_collapse_even_with_high_uplift():
    from scripts.export_rl_policy_lab import score_profile_row

    single_action = {
        'uplift_vs_hold': 8.39,
        'walk_uplift_vs_hold': 2.0,
        'action_diversity': 0.2,
        'action_entropy': 0.0,
        'walk_action_diversity': 0.2,
        'target_action_match_rate': 0.39,
        'target_action_distribution_gap': 0.60,
        'regime_hit_rate': {
            'continuation': 0.0,
            'hedge': 0.0,
            'risk_off': 0.0,
            'rotation': 1.0,
        },
        'regime_balance_score': 0.16,
        'intervention_rate': 1.0,
        'non_hold_value_add': 16.9,
        'hold_share': 0.0,
        'dominant_action_share': 1.0,
        'win_rate': 0.40,
    }
    balanced = {
        'uplift_vs_hold': 4.8,
        'walk_uplift_vs_hold': 1.8,
        'action_diversity': 0.8,
        'action_entropy': 0.58,
        'walk_action_diversity': 0.67,
        'target_action_match_rate': 0.32,
        'target_action_distribution_gap': 0.28,
        'regime_hit_rate': {
            'continuation': 0.55,
            'hedge': 0.22,
            'risk_off': 0.41,
            'rotation': 0.29,
        },
        'regime_balance_score': 0.48,
        'intervention_rate': 1.0,
        'non_hold_value_add': 7.2,
        'hold_share': 0.0,
        'dominant_action_share': 0.54,
        'win_rate': 0.36,
    }

    assert score_profile_row(balanced) > score_profile_row(single_action)


def test_score_profile_row_penalizes_low_match_and_weak_regime_coverage_even_with_uplift():
    from scripts.export_rl_policy_lab import score_profile_row

    flashy_but_weak = {
        'uplift_vs_hold': 2.2,
        'walk_uplift_vs_hold': 1.7,
        'action_diversity': 0.6,
        'action_entropy': 0.45,
        'walk_action_diversity': 0.4,
        'target_action_match_rate': 0.20,
        'target_action_distribution_gap': 0.46,
        'regime_hit_rate': {
            'continuation': 0.82,
            'hedge': 0.08,
            'risk_off': 0.04,
            'rotation': 0.05,
        },
        'regime_balance_score': 0.31,
        'intervention_rate': 1.0,
        'non_hold_value_add': 5.6,
        'hold_share': 0.0,
        'dominant_action_share': 0.58,
        'win_rate': 0.21,
    }
    steadier = {
        'uplift_vs_hold': 1.2,
        'walk_uplift_vs_hold': 1.4,
        'action_diversity': 0.8,
        'action_entropy': 0.62,
        'walk_action_diversity': 0.67,
        'target_action_match_rate': 0.46,
        'target_action_distribution_gap': 0.19,
        'regime_hit_rate': {
            'continuation': 0.49,
            'hedge': 0.33,
            'risk_off': 0.28,
            'rotation': 0.27,
        },
        'regime_balance_score': 0.61,
        'intervention_rate': 0.92,
        'non_hold_value_add': 4.1,
        'hold_share': 0.08,
        'dominant_action_share': 0.36,
        'win_rate': 0.43,
    }

    assert score_profile_row(steadier) > score_profile_row(flashy_but_weak)


def test_profile_selection_runs_walk_forward_only_for_shortlisted_profiles(monkeypatch):
    from types import SimpleNamespace
    import rl.neural_eval as neural_eval
    import rl.neural_ppo as neural_ppo
    from rl.config import get_default_rl_config
    from scripts.export_rl_policy_lab import _select_policy_profile

    calls = {'train': 0, 'walk': 0}
    config = get_default_rl_config()
    steps = [SimpleNamespace(observation={}, target_return=0.0, expert_action='hold') for _ in range(12)]
    dataset = SimpleNamespace(train=tuple(steps), val=tuple(steps[:3]), test=tuple(steps[:4]))

    class FakePolicy:
        def decide(self, _obs):
            return SimpleNamespace(action='add_continuation')

    def fake_train(*_args, **kwargs):
        calls['train'] += 1
        return SimpleNamespace(policy=FakePolicy(), report=SimpleNamespace(timesteps=kwargs.get('total_timesteps', 0)))

    def fake_replay(*_args, **_kwargs):
        idx = calls['train']
        return SimpleNamespace(
            total_reward=float(idx),
            action_diversity=0.8,
            action_entropy=0.7,
            hold_share=0.05,
            intervention_rate=0.95,
            dominant_action_share=0.4,
            regime_hit_rate={'continuation': 0.6, 'risk_off': 0.4, 'hedge': 0.3, 'rotation': 0.3},
            regime_active_counts={},
            regime_balance_score=0.65,
            non_hold_value_add=1.0,
            target_action_match_rate=0.5,
            target_action_distribution_gap=0.2,
            win_rate=0.55,
        )

    def fake_walk(*_args, **_kwargs):
        calls['walk'] += 1
        return SimpleNamespace(
            vs_hold_reward_uplift=1.0,
            positive_window_rate=1.0,
            mean_action_diversity=0.8,
        )

    monkeypatch.setattr(neural_ppo, 'train_neural_ppo', fake_train)
    monkeypatch.setattr(neural_eval, 'replay_policy', fake_replay)
    monkeypatch.setattr(neural_eval, 'evaluate_neural_walk_forward', fake_walk)

    _profile, diagnostics = _select_policy_profile(dataset, config, preferred_device='cuda')

    assert len(diagnostics) > calls['walk']
    assert calls['walk'] <= 4
    assert any(row.get('walk_evaluated') for row in diagnostics)


def test_neural_payload_degrades_gracefully_when_neural_dependencies_are_missing(tmp_path, monkeypatch):
    from rl.config import get_default_rl_config
    from rl.dataset import build_trajectory_dataset
    import scripts.export_rl_policy_lab as export_module

    config = get_default_rl_config()
    dataset = build_trajectory_dataset(config=config)
    existing_export = tmp_path / 'rl-policy-lab.json'
    existing_export.write_text(
        json.dumps({
            'neural_policy': {
                'available': True,
                'selected_device': 'cuda',
                'frontier': [{'commodity': 'gold', 'action': 'add_hedge'}],
            }
        }),
        encoding='utf-8',
    )
    monkeypatch.setattr(export_module, 'OUTPUT_PATH', existing_export)
    monkeypatch.setattr(
        export_module,
        '_select_policy_profile',
        lambda *_args, **_kwargs: (_ for _ in ()).throw(ModuleNotFoundError("No module named 'torch'", name='torch')),
    )

    payload = export_module._build_neural_payload(dataset, config)

    assert payload['available'] is True
    assert payload['selected_device'] == 'cuda'
    assert payload['preserved_from_existing_export'] is True
    assert 'missing neural RL dependency' in payload['preservation_reason']


def test_export_payload_contains_frontier_and_replay():
    pytest = __import__('pytest')
    try:
        __import__('stable_baselines3')
        __import__('gymnasium')
        __import__('torch')
    except Exception as exc:
        pytest.skip(f'missing neural RL dependency: {exc}')

    from scripts.export_rl_policy_lab import build_export_payload

    payload = build_export_payload()
    assert 'policy_frontier' in payload
    assert 'episode_replay' in payload
    assert len(payload['policy_frontier']) > 0
    assert len(payload['episode_replay']) > 0
    assert 'benchmark' in payload
    assert 'neural_policy' in payload
    assert isinstance(payload['neural_policy'], dict)
    if payload['neural_policy'].get('available'):
        assert payload['neural_policy']['report']['timesteps'] in {1024, 2048}
        assert payload['neural_policy']['report']['prior_weight'] in {0.0, 0.2, 0.35, 0.5}
        assert len(payload['neural_policy'].get('frontier', [])) > 0
        assert 'walk_forward' in payload['neural_policy']
        assert 'replay_summary' in payload['neural_policy']
        assert 'hold_baseline' in payload['neural_policy']
        assert 'vs_hold_reward_uplift' in payload['neural_policy']
        assert 'selected_timesteps' in payload['neural_policy']
        assert 'selected_prior_weight' in payload['neural_policy']
        assert 'profile_selection' in payload['neural_policy']
        assert 'action_diversity' in payload['neural_policy']['replay_summary']
        assert 'action_entropy' in payload['neural_policy']['replay_summary']
        assert 'hold_share' in payload['neural_policy']['replay_summary']
        assert 'intervention_rate' in payload['neural_policy']['replay_summary']
        assert 'dominant_action_share' in payload['neural_policy']['replay_summary']
        assert 'regime_hit_rate' in payload['neural_policy']['replay_summary']
        assert 'regime_active_counts' in payload['neural_policy']['replay_summary']
        assert 'regime_confusion_matrix' in payload['neural_policy']['replay_summary']
        assert 'regime_balance_score' in payload['neural_policy']['replay_summary']
        assert 'action_value_by_regime' in payload['neural_policy']['replay_summary']
        assert 'non_hold_value_add' in payload['neural_policy']['replay_summary']
        assert 'target_action_match_rate' in payload['neural_policy']['replay_summary']
        assert 'target_action_distribution_gap' in payload['neural_policy']['replay_summary']
        assert 'vs_hold_reward_uplift' in payload['neural_policy']['walk_forward']
        first_profile = payload['neural_policy']['profile_selection'][0]
        assert 'prior_weight' in first_profile
        assert 'action_entropy' in first_profile
        assert 'hold_share' in first_profile
        assert 'intervention_rate' in first_profile
        assert 'dominant_action_share' in first_profile
        assert 'regime_hit_rate' in first_profile
        assert 'regime_active_counts' in first_profile
        assert 'regime_balance_score' in first_profile
        assert 'non_hold_value_add' in first_profile
        performance = payload['neural_policy'].get('performance', {})
        if performance:
            assert ('tiers' in performance) or ('speedup_vs_cpu' in performance)
        first = payload['policy_frontier'][0]
        assert 'neural_action' in first
        assert 'neural_confidence' in first
