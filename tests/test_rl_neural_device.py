import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def test_train_neural_ppo_accepts_explicit_device():
    pytest = __import__('pytest')
    try:
        import torch
        __import__('stable_baselines3')
        __import__('gymnasium')
    except Exception as exc:
        pytest.skip(f'missing neural RL dependency: {exc}')

    from rl.dataset import build_trajectory_dataset
    from rl.neural_ppo import train_neural_ppo

    dataset = build_trajectory_dataset(commodity_keys=('crude_oil',))
    steps = list(dataset.train[:48])
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    result = train_neural_ppo(steps, total_timesteps=64, device=device)
    assert result.report.timesteps == 64
    assert result.report.final_action in ('reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation')
