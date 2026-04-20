import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.dataset import build_trajectory_dataset
from rl.env import CommodityTradingEnv
from rl.offline_train import train_offline_policy
from rl.ppo_train import fine_tune_with_ppo


def test_fine_tune_with_ppo_returns_report():
    dataset = build_trajectory_dataset(commodity_keys=('crude_oil',))
    offline = train_offline_policy(dataset)
    env = CommodityTradingEnv(list(dataset.test or dataset.val or dataset.train))
    result = fine_tune_with_ppo(env, offline_result=offline, episodes=3)
    assert result.report.episodes == 3
    assert result.report.algorithm == 'ppo'
    action, confidence = result.model.decide((dataset.test or dataset.val or dataset.train)[0].observation)
    assert isinstance(action, str)
    assert 0.0 <= confidence <= 1.0
