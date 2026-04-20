import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.dataset import build_trajectory_dataset


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
    result = train_neural_ppo(steps, total_timesteps=128)
    assert result.report.timesteps == 128
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
