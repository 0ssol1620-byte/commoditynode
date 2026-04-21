# CommodityNode RL Performance Upgrade Pass

> **For Hermes:** Use test-driven-development skill. No RL performance code change without a failing test first.

**Goal:** Lift RL Policy Lab from a UI-credible console to a materially stronger paid-grade policy engine by improving held-out decision quality, not just presentation.

**Architecture:** The current biggest issue is not missing metrics but the inference path: the exported policy is chosen from PPO models whose final browser-facing policy is blended with a fixed behavior-cloning prior. Live diagnostics show the fixed prior can overpower PPO and collapse the selected policy into continuation-heavy behavior even when raw PPO replay is materially better. The first upgrade pass should make prior blending selectable, score profiles across prior weights, and keep user-facing export focused on decision quality.

**Tech Stack:** Python RL stack (`rl/*.py`, `scripts/export_rl_policy_lab.py`), pytest, SB3/MaskablePPO, static JSON export.

---

## Root-cause findings

1. **Expert prior is healthier than before, but export behavior still collapses.**
   - Current expert distribution across all 445 steps:
     - rotation 172
     - continuation 130
     - reduce_risk 77
     - hedge 37
     - hold 29
2. **Exported selected profile is not selling-level yet.**
   - replay total reward: `-0.7626`
   - win rate: `20.8%`
   - target action match: `20.8%`
   - dominant action share: `70.8%`
   - regime balance: `42.1%`
3. **Critical failure mode found:** raw PPO and blended policy diverge sharply.
   - raw PPO replay on test: all-rotation, reward `+4.67`, target-match `47.1%`
   - blended policy replay on test: continuation-heavy, reward `-0.76`, target-match `20.8%`
4. **Conclusion:** fixed `prior_weight=0.5` is too rigid for export selection. The export pipeline must score prior-weight variants instead of assuming the blended policy is always superior.

---

## Task 1: Add failing tests for selectable prior blending

**Objective:** Force the codebase to support non-default prior blending and export that choice.

**Files:**
- Modify: `tests/test_rl_neural_ppo.py`
- Modify: `tests/test_export_rl_policy_lab.py`

### Step 1: Add a test that `train_neural_ppo(..., prior_weight=0.0)` preserves that setting

Expected assertions:
- `result.policy.prior_weight == 0.0`
- `result.report.prior_weight == 0.0`

### Step 2: Add an export test asserting the neural payload includes:
- `selected_prior_weight`
- each `profile_selection` row includes `prior_weight`

### Step 3: Run targeted tests and confirm they fail

```bash
.venv-rl/bin/python -m pytest tests/test_rl_neural_ppo.py tests/test_export_rl_policy_lab.py -q
```

---

## Task 2: Implement prior-weight-aware neural training and export selection

**Objective:** Let export profile selection compare raw PPO vs blended PPO variants instead of hardcoding a single BC blend.

**Files:**
- Modify: `rl/neural_ppo.py`
- Modify: `scripts/export_rl_policy_lab.py`

### Implementation notes
- Add `prior_weight` argument to `train_neural_ppo()`.
- Add `prior_weight` to `NeuralPPOTrainingReport`.
- Return `NeuralPPOPolicy(... prior_weight=<requested>)`.
- Extend `_select_policy_profile(...)` candidate grid with prior weights, e.g.:
  - `0.0`
  - `0.2`
  - `0.35`
  - `0.5`
- Include `prior_weight` in diagnostics rows and selected profile.
- Use the selected `prior_weight` in the final exported neural training run.
- Export `selected_prior_weight` in `neural_policy` JSON.

### Verification

```bash
.venv-rl/bin/python -m pytest tests/test_rl_neural_ppo.py tests/test_export_rl_policy_lab.py -q
```

---

## Task 3: Re-run RL evaluation and verify real metric lift

**Objective:** Confirm the selector now chooses materially better decision quality.

**Files:**
- Modify/generated: `assets/data/rl-policy-lab.json`

### Run

```bash
.venv-rl/bin/python scripts/export_rl_policy_lab.py
```

### Compare before vs after on:
- replay total reward
- replay uplift vs hold
- win rate
- target action match rate
- target action distribution gap
- dominant action share
- regime balance score
- regime hit rates

**Success bar for this pass:**
- selected prior weight is not hardcoded at the old default unless it truly wins
- replay total reward improves materially from the prior exported baseline
- target-action alignment improves
- exported action concentration worsens less or improves

---

## Task 4: Regression test full RL stack

**Objective:** Ensure the upgrade doesn’t break the RL pipeline.

**Files:**
- Existing tests only

### Run

```bash
.venv-rl/bin/python -m pytest tests/test_rl_dataset.py tests/test_rl_neural_ppo.py tests/test_rl_neural_eval.py tests/test_export_rl_policy_lab.py -q
node --check assets/js/intelligence-product.js
```

---

## Commit plan

1. `test: require configurable rl prior-weight export`
2. `feat: sweep rl prior weights in export selection`
3. `chore: refresh rl policy artifact after prior-weight tuning`
