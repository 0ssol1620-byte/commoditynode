import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.dataset import build_trajectory_dataset
from rl.offline_train import train_offline_policy


def test_train_offline_policy_returns_model_and_report():
    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold'))
    result = train_offline_policy(dataset)
    assert result.report.train_steps == len(dataset.train)
    assert result.model.total_steps == len(dataset.train)
    action, confidence = result.model.decide(dataset.test[0].observation)
    assert action in result.model.action_scores
    assert 0.0 <= confidence <= 1.0
