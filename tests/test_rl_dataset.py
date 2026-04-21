import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.config import get_default_rl_config
from rl.dataset import build_steps_for_commodity, build_trajectory_dataset
from rl.regimes import infer_regime_profile


def _sample_bundle():
    root = Path(__file__).resolve().parents[1]
    forecast = json.loads((root / 'assets/data/forecast.json').read_text(encoding='utf-8'))
    consensus = json.loads((root / 'assets/data/forecast-consensus.json').read_text(encoding='utf-8'))
    intelligence = json.loads((root / 'assets/data/intelligence-lab.json').read_text(encoding='utf-8'))
    return forecast['crude_oil'], consensus['crude_oil'], intelligence['crude_oil']


def test_build_steps_for_commodity_emits_rl_steps():
    forecast_entry, consensus_entry, intelligence_entry = _sample_bundle()
    steps = build_steps_for_commodity('crude_oil', forecast_entry, consensus_entry, intelligence_entry)
    assert len(steps) > 50
    first = steps[0]
    assert first.commodity == 'crude_oil'
    assert 'agreement_score' in first.observation
    assert first.expert_action in {'reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation'}


def test_build_trajectory_dataset_splits_steps():
    dataset = build_trajectory_dataset(commodity_keys=('crude_oil', 'gold'), config=get_default_rl_config())
    total = len(dataset.train) + len(dataset.val) + len(dataset.test)
    assert total > 100
    assert len(dataset.train) > len(dataset.val) > 0
    assert len(dataset.test) > 0


def test_dataset_steps_include_model_spread_and_anomaly():
    forecast_entry, consensus_entry, intelligence_entry = _sample_bundle()
    steps = build_steps_for_commodity('crude_oil', forecast_entry, consensus_entry, intelligence_entry)
    sample = steps[5]
    assert 'model_spread' in sample.observation
    assert 'anomaly_score' in sample.observation
    assert 0.0 <= sample.observation['agreement_score'] <= 1.0


def test_dataset_contains_live_regime_coverage():
    dataset = build_trajectory_dataset(config=get_default_rl_config())
    counts = {'continuation': 0, 'risk_off': 0, 'hedge': 0, 'rotation': 0}
    for step in dataset.train + dataset.val + dataset.test:
        profile = infer_regime_profile(step.observation, direction=step.metadata.get('direction'))
        for key, is_active in profile.active.items():
            counts[key] += 1 if is_active else 0
    assert counts['continuation'] > 0
    assert counts['risk_off'] > 0
    assert counts['hedge'] > 0
    assert counts['rotation'] > 0


def test_regime_profile_prefers_continuation_and_hedge_when_signal_is_dominant():
    continuation_profile = infer_regime_profile(
        {
            'agreement_score': 0.78,
            'anomaly_score': 0.12,
            'event_risk': 0.08,
            'model_spread': 0.02,
            'trend_3': 0.0046,
            'forecast_return': 0.0049,
            'volatility_5': 0.03,
            'risk_pressure': 0.18,
        },
        direction='bullish',
    )
    assert continuation_profile.target_action == 'add_continuation'

    hedge_profile = infer_regime_profile(
        {
            'agreement_score': 0.51,
            'anomaly_score': 0.66,
            'event_risk': 0.74,
            'model_spread': 0.19,
            'trend_3': -0.0004,
            'forecast_return': 0.0015,
            'volatility_5': 0.24,
            'risk_pressure': 0.58,
        },
        direction='neutral',
    )
    assert hedge_profile.target_action == 'add_hedge'
