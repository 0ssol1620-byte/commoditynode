# CommodityNode Ralph Loop Runbook

## Purpose
Run bounded autonomous improvement loops for CommodityNode without wasting cycles on vague open-ended churn.

## Loop Pattern
1. Read `ralph-loop/GOALS.md`
2. Read `ralph-loop/TASKS.json`
3. Read the newest entries in `ralph-loop/progress.md`
4. Pick the highest-priority pending or failed task
5. Make one focused improvement batch
6. Run verification
7. Record evidence in `ralph-loop/progress.md`
8. Commit if the batch is valid
9. Repeat until stop condition is met

## Required Verification
Use this command after each batch:

```bash
python3 scripts/ralph_verify.py
```

## Automated Runner
Use this command to execute the current Ralph loop state machine:

```bash
python3 scripts/run_ralph_loop.py
```

What it does:
- loads task state from `ralph-loop/TASKS.json`
- picks the highest-priority pending task
- runs full audit plus verification
- writes structured issue output to `ralph-loop/issues.json`
- updates task status
- appends evidence to `ralph-loop/progress.md`
- emits OpenClaw events for start, per-task progress, failure, and completion

Notification behavior:
- default: notifications enabled
- disable per run with `RALPH_NOTIFY=0 python3 scripts/run_ralph_loop.py`
- intended use: wake the main assistant session so it can proactively report to Telegram

Current limitation:
- this runner now performs full audit + verification + issue capture, but it is still not a self-editing coder
- it is meant to drive and record repeated QA/improvement cycles safely before auto-fix routines are added

## Good Task Types
- Fix broken deployment/build issues
- Repair Tier-1 page trust/conversion regressions
- Tighten noindex/sitemap hygiene
- Fix live-data integrity disclosures

## Bad Task Types
- Endless style polishing with no acceptance criteria
- Large speculative redesigns without measurement
- Publishing external actions without approval
- Bulk content generation without validation

## Suggested Agent Prompt
Use this when running a coding agent or ACP session:

```text
You are running the CommodityNode Ralph loop.

Rules:
- Read ralph-loop/GOALS.md, ralph-loop/TASKS.json, and ralph-loop/progress.md first.
- Pick the highest-priority task not marked completed.
- Make one bounded improvement batch.
- Run verification with: python3 scripts/ralph_verify.py
- If verification fails, use the evidence to guide the next iteration.
- Append a concise entry to ralph-loop/progress.md.
- Commit only when the batch is coherent.
- Stop when all hard success criteria pass, you hit max iterations, or you need user approval.
```

## Human Oversight
Pause and ask before:
- External publishing beyond existing site deploy flow
- Risky deletions
- Credential/config changes
- Expensive API-heavy regeneration runs
