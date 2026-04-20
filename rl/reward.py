from __future__ import annotations


def compute_reward(
    realized_return: float,
    position_before: float,
    position_after: float,
    hedge_before: float,
    hedge_after: float,
    peak_equity: float,
    equity_after: float,
    *,
    pnl_weight: float = 1.0,
    turnover_penalty: float = 0.05,
    drawdown_penalty: float = 0.15,
    concentration_penalty: float = 0.08,
    event_gap_penalty: float = 0.07,
    event_risk: float = 0.0,
    abstain_bonus: float = 0.01,
) -> float:
    pnl = position_after * realized_return - hedge_after * max(realized_return, 0.0) * 0.5
    turnover = abs(position_after - position_before) + abs(hedge_after - hedge_before)
    drawdown = 0.0 if peak_equity <= 0 else max(0.0, (peak_equity - equity_after) / peak_equity)
    concentration = max(0.0, abs(position_after) - 0.7) + max(0.0, abs(hedge_after) - 0.7)
    event_gap = event_risk * max(0.0, abs(position_after) - abs(hedge_after))
    abstain = abstain_bonus if abs(position_after) < 1e-9 and abs(hedge_after) < 1e-9 else 0.0
    reward = (
        pnl_weight * pnl
        - turnover_penalty * turnover
        - drawdown_penalty * drawdown
        - concentration_penalty * concentration
        - event_gap_penalty * event_gap
        + abstain
    )
    return float(reward)
