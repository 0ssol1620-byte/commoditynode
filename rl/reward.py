from __future__ import annotations


def compute_reward_breakdown(
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
    action_taken: str | None = None,
    expert_action: str | None = None,
    expert_alignment_bonus: float = 0.0,
    wrong_way_penalty: float = 0.0,
    stale_hold_penalty: float = 0.0,
    regime_target_action: str | None = None,
    regime_target_strength: float = 0.0,
    regime_opportunity_bonus: float = 0.0,
    missed_regime_penalty: float = 0.0,
) -> dict[str, float]:
    pnl = position_after * realized_return - hedge_after * max(realized_return, 0.0) * 0.5
    turnover = abs(position_after - position_before) + abs(hedge_after - hedge_before)
    drawdown = 0.0 if peak_equity <= 0 else max(0.0, (peak_equity - equity_after) / peak_equity)
    concentration = max(0.0, abs(position_after) - 0.7) + max(0.0, abs(hedge_after) - 0.7)
    event_gap = event_risk * max(0.0, abs(position_after) - abs(hedge_after))
    abstain = abstain_bonus if abs(position_after) < 1e-9 and abs(hedge_after) < 1e-9 else 0.0
    alignment_bonus = expert_alignment_bonus if action_taken and expert_action and action_taken == expert_action else 0.0
    wrong_way = 0.0
    stale_hold = 0.0
    opportunity_bonus = 0.0
    missed_regime = 0.0
    if action_taken == 'hold' and expert_action in {'add_continuation', 'add_hedge', 'reduce_risk'}:
        stale_hold = stale_hold_penalty * max(abs(realized_return) * 25.0, event_risk)
    if regime_target_action and regime_target_action != 'hold':
        if action_taken == regime_target_action:
            opportunity_bonus = regime_opportunity_bonus * max(0.0, regime_target_strength)
        elif action_taken == 'hold':
            missed_regime = missed_regime_penalty * max(0.0, regime_target_strength)
        elif action_taken != regime_target_action:
            wrong_way += wrong_way_penalty * 0.35 * max(0.0, regime_target_strength)
    if action_taken and expert_action and action_taken != expert_action:
        if expert_action == 'reduce_risk' and action_taken == 'add_continuation':
            wrong_way = wrong_way_penalty
        elif expert_action == 'add_continuation' and action_taken == 'reduce_risk':
            wrong_way = wrong_way_penalty * 0.75
        elif expert_action == 'add_hedge' and action_taken not in {'add_hedge', 'hold'}:
            wrong_way = wrong_way_penalty * 0.5
    return {
        'pnl': float(pnl_weight * pnl),
        'turnover_cost': float(turnover_penalty * turnover),
        'drawdown_cost': float(drawdown_penalty * drawdown),
        'concentration_cost': float(concentration_penalty * concentration),
        'event_gap_cost': float(event_gap_penalty * event_gap),
        'abstain_bonus': float(abstain),
        'expert_alignment_bonus': float(alignment_bonus),
        'wrong_way_cost': float(wrong_way),
        'stale_hold_cost': float(stale_hold),
        'regime_opportunity_bonus': float(opportunity_bonus),
        'missed_regime_cost': float(missed_regime),
    }



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
    action_taken: str | None = None,
    expert_action: str | None = None,
    expert_alignment_bonus: float = 0.0,
    wrong_way_penalty: float = 0.0,
    stale_hold_penalty: float = 0.0,
    regime_target_action: str | None = None,
    regime_target_strength: float = 0.0,
    regime_opportunity_bonus: float = 0.0,
    missed_regime_penalty: float = 0.0,
) -> float:
    breakdown = compute_reward_breakdown(
        realized_return=realized_return,
        position_before=position_before,
        position_after=position_after,
        hedge_before=hedge_before,
        hedge_after=hedge_after,
        peak_equity=peak_equity,
        equity_after=equity_after,
        pnl_weight=pnl_weight,
        turnover_penalty=turnover_penalty,
        drawdown_penalty=drawdown_penalty,
        concentration_penalty=concentration_penalty,
        event_gap_penalty=event_gap_penalty,
        event_risk=event_risk,
        abstain_bonus=abstain_bonus,
        action_taken=action_taken,
        expert_action=expert_action,
        expert_alignment_bonus=expert_alignment_bonus,
        wrong_way_penalty=wrong_way_penalty,
        stale_hold_penalty=stale_hold_penalty,
        regime_target_action=regime_target_action,
        regime_target_strength=regime_target_strength,
        regime_opportunity_bonus=regime_opportunity_bonus,
        missed_regime_penalty=missed_regime_penalty,
    )
    reward = (
        breakdown['pnl']
        - breakdown['turnover_cost']
        - breakdown['drawdown_cost']
        - breakdown['concentration_cost']
        - breakdown['event_gap_cost']
        + breakdown['abstain_bonus']
        + breakdown['expert_alignment_bonus']
        + breakdown['regime_opportunity_bonus']
        - breakdown['wrong_way_cost']
        - breakdown['stale_hold_cost']
        - breakdown['missed_regime_cost']
    )
    return float(reward)
