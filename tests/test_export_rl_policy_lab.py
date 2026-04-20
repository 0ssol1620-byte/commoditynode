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
