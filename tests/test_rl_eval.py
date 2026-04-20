import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.dataset import build_trajectory_dataset
from rl.eval import evaluate_rl_stack


def test_evaluate_rl_stack_returns_named_summaries():
    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold'))
    result = evaluate_rl_stack(dataset=dataset)
    assert result.offline.name == 'offline'
    assert result.ppo.name == 'ppo'
    assert result.rule_based.steps > 0
    assert isinstance(result.no_trade.total_reward, float)
