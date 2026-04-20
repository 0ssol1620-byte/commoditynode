import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from rl.baselines import DirectionalClassifierPolicy, NoTradePolicy, RuleBasedPolicy


def test_no_trade_policy_always_holds():
    decision = NoTradePolicy().decide({})
    assert decision.action == 'hold'
    assert decision.confidence == 1.0


def test_rule_policy_hedges_high_event_low_agreement():
    obs = {'agreement_score': 0.4, 'anomaly_score': 0.2, 'event_risk': 0.8, 'direction_bullish': 1.0, 'direction_bearish': 0.0}
    decision = RuleBasedPolicy().decide(obs)
    assert decision.action == 'add_hedge'


def test_rule_policy_reduces_risk_on_high_anomaly():
    obs = {'agreement_score': 0.7, 'anomaly_score': 0.9, 'event_risk': 0.2, 'direction_bullish': 1.0, 'direction_bearish': 0.0}
    decision = RuleBasedPolicy().decide(obs)
    assert decision.action == 'reduce_risk'


def test_directional_classifier_policy_uses_thresholds():
    policy = DirectionalClassifierPolicy(up_threshold=0.6, down_threshold=0.4)
    assert policy.decide({'probability_up': 0.7}).action == 'add_continuation'
    assert policy.decide({'probability_up': 0.3}).action == 'reduce_risk'
    assert policy.decide({'probability_up': 0.5}).action == 'hold'
