import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.config import get_default_rl_config
from rl.dataset import build_steps_for_commodity, build_trajectory_dataset


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
