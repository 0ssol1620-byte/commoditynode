from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BaselineDecision:
    action: str
    confidence: float
    rationale: str


class NoTradePolicy:
    def decide(self, observation: dict) -> BaselineDecision:
        return BaselineDecision(action='hold', confidence=1.0, rationale='Capital preservation baseline.')


class RuleBasedPolicy:
    def decide(self, observation: dict) -> BaselineDecision:
        agreement = float(observation.get('agreement_score', 0.5))
        anomaly = float(observation.get('anomaly_score', 0.0))
        event_risk = float(observation.get('event_risk', 0.0))
        bullish = float(observation.get('direction_bullish', 0.0)) > 0.5
        bearish = float(observation.get('direction_bearish', 0.0)) > 0.5
        if anomaly >= 0.7:
            return BaselineDecision('reduce_risk', 0.8, 'High anomaly score.')
        if event_risk >= 0.55 and agreement < 0.55:
            return BaselineDecision('add_hedge', 0.72, 'Event risk exceeds agreement quality.')
        if bullish and agreement >= 0.6:
            return BaselineDecision('add_continuation', agreement, 'Bullish direction with acceptable agreement.')
        if bearish and agreement >= 0.6:
            return BaselineDecision('reduce_risk', agreement, 'Bearish direction with acceptable agreement.')
        return BaselineDecision('hold', 0.55, 'Insufficient edge over hold baseline.')


class DirectionalClassifierPolicy:
    def __init__(self, up_threshold: float = 0.6, down_threshold: float = 0.4):
        self.up_threshold = up_threshold
        self.down_threshold = down_threshold

    def decide(self, observation: dict) -> BaselineDecision:
        probability_up = float(observation.get('probability_up', 0.5))
        if probability_up >= self.up_threshold:
            return BaselineDecision('add_continuation', probability_up, 'Directional classifier favors upside.')
        if probability_up <= self.down_threshold:
            return BaselineDecision('reduce_risk', 1.0 - probability_up, 'Directional classifier favors downside.')
        return BaselineDecision('hold', 0.5, 'Directional classifier is not decisive.')
