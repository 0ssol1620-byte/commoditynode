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
    assert 0.0 <= replay.dominant_action_share <= 1.0
    assert set(replay.regime_hit_rate.keys()) == {'continuation', 'risk_off', 'hedge', 'rotation'}
    assert set(replay.regime_active_counts.keys()) == {'continuation', 'risk_off', 'hedge', 'rotation'}
    assert set(replay.regime_confusion_matrix.keys()) == {'continuation', 'risk_off', 'hedge', 'rotation'}
    assert 0.0 <= replay.regime_balance_score <= 1.0
    assert isinstance(replay.non_hold_value_add, float)
    assert set(replay.action_value_by_regime.keys()) == {'continuation', 'risk_off', 'hedge', 'rotation'}
    assert 0.0 <= replay.target_action_match_rate <= 1.0
    assert 0.0 <= replay.target_action_distribution_gap <= 1.0

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


def test_regime_balance_respects_target_action_when_secondary_risk_regimes_overlap():
    from rl.dataset import RLTrajectoryStep
    from rl.neural_eval import replay_policy

    overlapping_continuation_obs = {
        'agreement_score': 0.8163,
        'anomaly_score': 0.5294,
        'event_risk': 0.31,
        'model_spread': 0.0161,
        'trend_3': -0.0169,
        'forecast_return': -0.0474,
        'volatility_5': 0.216,
        'risk_pressure': 0.3609,
        'direction_bullish': 1.0,
        'direction_bearish': 0.0,
    }
    steps = tuple(
        RLTrajectoryStep(
            commodity='natural_gas',
            timestamp=f'2026-08-{idx + 1:02d}',
            observation=overlapping_continuation_obs,
            target_return=0.002,
            expert_action='add_continuation',
            metadata={'direction': 'bullish'},
        )
        for idx in range(8)
    )

    replay = replay_policy(
        name='overlap_target_match',
        steps=steps,
        chooser=lambda _obs: 'add_continuation',
    )

    assert replay.target_action_match_rate == 1.0
    assert replay.regime_hit_rate['risk_off'] == 0.0
    assert replay.regime_hit_rate['hedge'] == 0.0
    assert replay.regime_balance_score >= 0.55
