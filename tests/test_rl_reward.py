import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def test_reward_breakdown_matches_total_reward():
    from rl.reward import compute_reward, compute_reward_breakdown

    kwargs = dict(
        realized_return=0.05,
        position_before=0.0,
        position_after=0.5,
        hedge_before=0.0,
        hedge_after=0.25,
        peak_equity=1.0,
        equity_after=0.97,
        pnl_weight=1.0,
        turnover_penalty=0.05,
        drawdown_penalty=0.15,
        concentration_penalty=0.08,
        event_gap_penalty=0.07,
        event_risk=0.3,
        abstain_bonus=0.01,
        action_taken='reduce_risk',
        expert_action='reduce_risk',
        expert_alignment_bonus=0.03,
        wrong_way_penalty=0.035,
    )
    breakdown = compute_reward_breakdown(**kwargs)
    total = compute_reward(**kwargs)
    recomposed = (
        breakdown['pnl']
        - breakdown['turnover_cost']
        - breakdown['drawdown_cost']
        - breakdown['concentration_cost']
        - breakdown['event_gap_cost']
        + breakdown['abstain_bonus']
        + breakdown['expert_alignment_bonus']
        - breakdown['wrong_way_cost']
    )
    assert abs(total - recomposed) < 1e-9
    assert breakdown['turnover_cost'] > 0
    assert breakdown['expert_alignment_bonus'] == 0.03
