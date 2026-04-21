import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.dataset import build_trajectory_dataset


def test_apply_regime_calibration_boosts_continuation_and_hedge_when_context_is_strong():
    from rl.neural_ppo import apply_regime_calibration

    base_probs = {
        'reduce_risk': 0.34,
        'hold': 0.12,
        'add_continuation': 0.18,
        'add_hedge': 0.12,
        'relative_value_rotation': 0.24,
    }

    continuation_obs = {
        'agreement_score': 0.78,
        'anomaly_score': 0.12,
        'event_risk': 0.08,
        'model_spread': 0.02,
        'trend_3': 0.0046,
        'forecast_return': 0.0049,
        'volatility_5': 0.03,
        'risk_pressure': 0.18,
        'direction_bullish': 1.0,
        'direction_bearish': 0.0,
    }
    continuation_probs = apply_regime_calibration(base_probs, continuation_obs)
    assert continuation_probs['add_continuation'] > base_probs['add_continuation']
    assert continuation_probs['add_continuation'] > continuation_probs['reduce_risk']

    hedge_obs = {
        'agreement_score': 0.51,
        'anomaly_score': 0.66,
        'event_risk': 0.74,
        'model_spread': 0.19,
        'trend_3': -0.0004,
        'forecast_return': 0.0015,
        'volatility_5': 0.24,
        'risk_pressure': 0.58,
        'direction_bullish': 0.0,
        'direction_bearish': 0.0,
    }
    hedge_probs = apply_regime_calibration(base_probs, hedge_obs)
    assert hedge_probs['add_hedge'] > base_probs['add_hedge']
    assert hedge_probs['add_hedge'] > hedge_probs['relative_value_rotation']


def test_train_neural_ppo_smoke():
    pytest = __import__('pytest')
    try:
        __import__('stable_baselines3')
        __import__('gymnasium')
        __import__('torch')
    except Exception as exc:
        pytest.skip(f'missing neural RL dependency: {exc}')

    from rl.neural_ppo import GymCommodityEnv, train_neural_ppo

    dataset = build_trajectory_dataset(commodity_keys=('crude_oil',))
    steps = list(dataset.train[:64])
    result = train_neural_ppo(steps, total_timesteps=128, prior_weight=0.0)
    assert result.report.timesteps == 128
    assert result.report.prior_weight == 0.0
    assert result.policy.prior_weight == 0.0
    assert result.report.final_action in ('reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation')
    assert 0.0 <= result.report.confidence <= 1.0

    env = GymCommodityEnv(steps)
    obs, info = env.reset()
    assert obs.shape[0] > 0
    assert info['commodity'] == 'crude_oil'
    assert len(env.action_masks()) == 5
    first_decision = result.policy.decide(obs)
    dict_decision = result.policy.decide(steps[0].observation)
    assert first_decision.action in ('reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation')
    assert dict_decision.action in ('reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation')
