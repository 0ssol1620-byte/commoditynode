import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def test_neural_walk_forward_and_replay():
    pytest = __import__('pytest')
    try:
        __import__('stable_baselines3')
        __import__('gymnasium')
        __import__('torch')
    except Exception as exc:
        pytest.skip(f'missing neural RL dependency: {exc}')

    from rl.dataset import build_trajectory_dataset
    from rl.neural_eval import evaluate_neural_walk_forward, replay_policy
    from rl.neural_ppo import train_neural_ppo

    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold', 'copper'))
    steps = list(dataset.train[:96])
    result = train_neural_ppo(steps, total_timesteps=96, device='cpu')
    replay = replay_policy(
        name='neural',
        steps=list(dataset.test[:24] or dataset.val[:24]),
        chooser=lambda obs: result.policy.decide(obs).action,
    )
    assert replay.final_equity > 0
    assert 'pnl' in replay.reward_decomposition
    assert 0.0 <= replay.action_diversity <= 1.0
    assert 0.0 <= replay.action_entropy <= 1.0
    assert 0.0 <= replay.hold_share <= 1.0
    assert 0.0 <= replay.intervention_rate <= 1.0
    assert set(replay.regime_hit_rate.keys()) == {'continuation', 'risk_off', 'hedge', 'rotation'}

    walk = evaluate_neural_walk_forward(
        dataset,
        total_timesteps=96,
        window_count=2,
        eval_window_size=12,
        min_train_steps=48,
        device='cpu',
    )
    assert len(walk.windows) == 2
    assert 0.0 <= walk.positive_window_rate <= 1.0
    assert isinstance(walk.vs_hold_reward_uplift, float)
    assert 0.0 <= walk.mean_action_diversity <= 1.0
