import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


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
        assert 'regime_hit_rate' in payload['neural_policy']['replay_summary']
        assert 'vs_hold_reward_uplift' in payload['neural_policy']['walk_forward']
        first_profile = payload['neural_policy']['profile_selection'][0]
        assert 'action_entropy' in first_profile
        assert 'hold_share' in first_profile
        assert 'intervention_rate' in first_profile
        assert 'regime_hit_rate' in first_profile
        performance = payload['neural_policy'].get('performance', {})
        assert ('tiers' in performance) or ('speedup_vs_cpu' in performance)
        first = payload['policy_frontier'][0]
        assert 'neural_action' in first
        assert 'neural_confidence' in first
