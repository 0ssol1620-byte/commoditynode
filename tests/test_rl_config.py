import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.config import RLExperimentConfig, get_default_rl_config
from rl.spaces import build_action_space, build_observation_space


def test_default_rl_config_is_valid():
    config = get_default_rl_config()
    assert config.name == 'commoditynode-rl-policy-lab'
    assert config.training.offline_algorithm == 'iql'
    assert config.training.online_algorithm == 'ppo'


def test_split_validation_rejects_invalid_total():
    config = RLExperimentConfig(
        training=RLExperimentConfig().training.__class__(train_split=0.8, val_split=0.2, test_split=0.2)
    )
    try:
        config.validate()
    except ValueError as exc:
        assert 'sum to 1.0' in str(exc)
    else:
        raise AssertionError('expected ValueError')


def test_observation_space_has_positive_shape():
    spec = build_observation_space(get_default_rl_config())
    assert spec.context_length == 128
    assert spec.feature_count > 8


def test_action_space_matches_discrete_actions():
    spec = build_action_space(get_default_rl_config())
    assert spec.mode == 'discrete'
    assert spec.size == 5
