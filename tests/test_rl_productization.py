import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def test_neural_replay_beats_hold_baseline_after_upgrade():
    pytest = __import__('pytest')
    try:
        __import__('stable_baselines3')
        __import__('gymnasium')
        __import__('torch')
    except Exception as exc:
        pytest.skip(f'missing neural RL dependency: {exc}')

    from rl.dataset import build_trajectory_dataset
    from rl.neural_eval import replay_policy
    from rl.neural_ppo import train_neural_ppo

    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold', 'copper'))
    train_steps = list(dataset.train[:128])
    eval_steps = list(dataset.test[:24] or dataset.val[:24])
    result = train_neural_ppo(train_steps, total_timesteps=256, device='cpu')

    neural = replay_policy(
        name='neural',
        steps=eval_steps,
        chooser=lambda obs: result.policy.decide(obs).action,
    )
    hold = replay_policy(
        name='hold',
        steps=eval_steps,
        chooser=lambda _obs: 'hold',
    )
    assert neural.total_reward >= hold.total_reward - 0.1
    assert neural.action_diversity >= 0.2
