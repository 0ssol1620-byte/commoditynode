import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.dataset import RLTrajectoryStep
from rl.env import CommodityTradingEnv


def _make_steps():
    return [
        RLTrajectoryStep(
            commodity='crude_oil',
            timestamp='2026-04-20',
            observation={'agreement_score': 0.7, 'anomaly_score': 0.1, 'event_risk': 0.3, 'direction_bullish': 1.0, 'direction_bearish': 0.0},
            target_return=0.03,
            expert_action='add_continuation',
            metadata={'current_price': 80, 'next_price': 82},
        ),
        RLTrajectoryStep(
            commodity='crude_oil',
            timestamp='2026-04-21',
            observation={'agreement_score': 0.6, 'anomaly_score': 0.2, 'event_risk': 0.6, 'direction_bullish': 0.0, 'direction_bearish': 1.0},
            target_return=-0.02,
            expert_action='add_hedge',
            metadata={'current_price': 82, 'next_price': 80.4},
        ),
    ]


def test_env_reset_returns_observation_and_info():
    env = CommodityTradingEnv(_make_steps())
    obs, info = env.reset()
    assert info['commodity'] == 'crude_oil'
    assert obs['equity'] == 1.0
    assert obs['position'] == 0.0


def test_env_step_advances_and_returns_reward():
    env = CommodityTradingEnv(_make_steps())
    env.reset()
    result = env.step('add_continuation')
    assert isinstance(result.reward, float)
    assert result.info['action'] == 'add_continuation'
    assert result.terminated is False


def test_env_terminates_at_end_of_steps():
    env = CommodityTradingEnv(_make_steps())
    env.reset()
    env.step('hold')
    result = env.step('hold')
    assert result.terminated is True
    assert result.observation['done'] == 1.0


def test_env_repeated_interventions_do_not_silently_fallback_to_hold():
    env = CommodityTradingEnv(_make_steps())
    env.reset()
    first = env.step('add_hedge')
    assert first.info['action'] == 'add_hedge'
    assert first.observation['hedge'] > 0
    second = env.step('add_hedge')
    assert second.info['action'] == 'add_hedge'
