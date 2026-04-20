from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class RLStepResult:
    observation: Any
    reward: float
    terminated: bool
    truncated: bool
    info: dict[str, Any]


@dataclass(frozen=True)
class PolicyDecision:
    action: str
    score: float
    confidence: float
    metadata: dict[str, Any]
