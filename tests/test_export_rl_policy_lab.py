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
        assert len(payload['neural_policy'].get('frontier', [])) > 0
        assert 'walk_forward' in payload['neural_policy']
        assert 'replay_summary' in payload['neural_policy']
        assert 'hold_baseline' in payload['neural_policy']
        assert 'vs_hold_reward_uplift' in payload['neural_policy']
        assert 'selected_timesteps' in payload['neural_policy']
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
        assert 'action_entropy' in first_profile
        assert 'hold_share' in first_profile
        assert 'intervention_rate' in first_profile
        assert 'dominant_action_share' in first_profile
        assert 'regime_hit_rate' in first_profile
        assert 'regime_active_counts' in first_profile
        assert 'regime_balance_score' in first_profile
        assert 'non_hold_value_add' in first_profile
        performance = payload['neural_policy'].get('performance', {})
        assert ('tiers' in performance) or ('speedup_vs_cpu' in performance)
        first = payload['policy_frontier'][0]
        assert 'neural_action' in first
        assert 'neural_confidence' in first
