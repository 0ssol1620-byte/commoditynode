import os
import sys
from collections import Counter

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def test_expert_dataset_has_action_diversity():
    from rl.dataset import build_trajectory_dataset

    dataset = build_trajectory_dataset()
    counts = Counter(step.expert_action for step in (dataset.train + dataset.val + dataset.test))
    assert len(counts) >= 4
    assert counts['hold'] > 0
    assert counts['reduce_risk'] > 0
    assert counts['add_continuation'] > 0
    assert counts['relative_value_rotation'] > 0
