import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from scripts.export_rl_policy_lab import build_export_payload


def test_export_payload_contains_frontier_and_replay():
    payload = build_export_payload()
    assert 'policy_frontier' in payload
    assert 'episode_replay' in payload
    assert len(payload['policy_frontier']) > 0
    assert len(payload['episode_replay']) > 0
    assert 'benchmark' in payload
    assert 'neural_policy' in payload
    assert isinstance(payload['neural_policy'], dict)
    if payload['neural_policy'].get('available'):
        assert payload['neural_policy']['report']['timesteps'] == 512
        assert len(payload['neural_policy'].get('frontier', [])) > 0
        assert 'walk_forward' in payload['neural_policy']
        assert 'replay_summary' in payload['neural_policy']
        performance = payload['neural_policy'].get('performance', {})
        assert ('tiers' in performance) or ('speedup_vs_cpu' in performance)
        first = payload['policy_frontier'][0]
        assert 'neural_action' in first
        assert 'neural_confidence' in first
