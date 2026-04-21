# RL Performance + Visualization Upgrade Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Improve CommodityNode RL Policy Lab so the policy is judged on stronger regime-aware performance signals while the page itself feels more premium, animated, and product-grade.

**Architecture:** Keep the current offline + PPO + neural export pipeline, but add regime-aware evaluation metrics, stronger profile selection scoring, and export richer policy quality fields. On the frontend, keep Chart.js for analytical trust surfaces, add GSAP for premium motion choreography, and add a custom animated policy-field canvas so the page feels materially more alive without replatforming away from Jekyll/plain JS.

**Tech Stack:** Python RL pipeline (`rl/*.py`, `scripts/export_rl_policy_lab.py`), static JSON export (`assets/data/rl-policy-lab.json`), Jekyll layout (`_layouts/intelligence-product.html`), plain JS runtime (`assets/js/intelligence-product.js`), Chart.js, GSAP CDN.

---

## Implementation targets

1. Add regime-aware RL evaluation metrics
   - regime hit rates
   - hold share
   - action entropy/diversity
   - intervention rate
   - support export + UI use

2. Strengthen profile-selection logic
   - penalize hold-heavy collapse
   - reward regime accuracy and intervention quality
   - keep walk-forward/replay uplift central

3. Refresh export payload + live artifact
   - ensure `updated_from_commit` reflects current commit
   - surface new metrics in JSON

4. Add premium animated visualization layer
   - GSAP-driven reveal/choreography
   - animated policy field canvas linked to current action probabilities
   - animated count-up / confidence transitions

5. Live-QA RL Policy Lab
   - raw JSON
   - DOM markers
   - motion present
   - no JS errors

---

## Files expected to change

- Modify: `rl/neural_eval.py`
- Modify: `scripts/export_rl_policy_lab.py`
- Modify: `tests/test_rl_neural_eval.py`
- Modify: `tests/test_export_rl_policy_lab.py`
- Modify: `_layouts/intelligence-product.html`
- Modify: `assets/js/intelligence-product.js`
- Regenerate: `assets/data/rl-policy-lab.json`

---

## Verification

- `pytest tests/test_rl_neural_eval.py tests/test_export_rl_policy_lab.py -q`
- `python3 scripts/export_rl_policy_lab.py`
- `node --check assets/js/intelligence-product.js`
- live-check `/intelligence-lab/rl-policy-lab/`
