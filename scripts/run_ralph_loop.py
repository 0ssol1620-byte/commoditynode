#!/usr/bin/env python3
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TASKS_PATH = ROOT / "ralph-loop" / "TASKS.json"
PROGRESS_PATH = ROOT / "ralph-loop" / "progress.md"
GOALS_PATH = ROOT / "ralph-loop" / "GOALS.md"
VERIFY_CMD = [sys.executable, str(ROOT / "scripts" / "ralph_verify.py")]


def load_tasks():
    return json.loads(TASKS_PATH.read_text())


def save_tasks(data):
    TASKS_PATH.write_text(json.dumps(data, indent=2) + "\n")


def run_verify():
    proc = subprocess.run(VERIFY_CMD, cwd=ROOT, capture_output=True, text=True)
    try:
        payload = json.loads(proc.stdout)
    except Exception:
        payload = {"ok": False, "raw": proc.stdout, "stderr": proc.stderr}
    return proc.returncode == 0, payload


def append_progress(iteration, goal, change, evidence, result, next_step):
    current = PROGRESS_PATH.read_text()
    entry = (
        f"### Iteration {iteration}\n"
        f"- Goal: {goal}\n"
        f"- Change: {change}\n"
        f"- Evidence: {evidence}\n"
        f"- Result: {result}\n"
        f"- Next: {next_step}\n\n"
    )
    marker = "## Template\n"
    if marker in current:
        updated = current.replace(marker, entry + marker, 1)
    else:
        updated = current + "\n" + entry
    PROGRESS_PATH.write_text(updated)


def select_task(tasks):
    candidates = [t for t in tasks if t.get("status") in {"pending", "failed", "in_progress"}]
    candidates.sort(key=lambda t: (t.get("priority", 999), t.get("id", "zzz")))
    return candidates[0] if candidates else None


def main():
    data = load_tasks()
    max_iterations = data.get("max_iterations", 5)
    iteration = 0
    summary = []

    for _ in range(max_iterations):
        iteration += 1
        task = select_task(data.get("tasks", []))
        if not task:
            print(json.dumps({"ok": True, "message": "No pending tasks remain.", "summary": summary}, indent=2))
            return 0

        task["status"] = "in_progress"
        save_tasks(data)

        ok, payload = run_verify()
        timestamp = datetime.now(timezone.utc).isoformat()

        if task["type"] == "verification":
            if ok:
                task["status"] = "completed"
                result = "Verification passed"
                next_step = "Advance to next pending task"
            else:
                task["status"] = "failed"
                result = "Verification failed"
                next_step = "Investigate failures and apply a bounded fix batch"
        else:
            if ok:
                task["status"] = "completed"
                result = "Baseline verification passed for improvement task"
                next_step = "Manually define the next improvement batch for this goal"
            else:
                task["status"] = "failed"
                result = "Baseline verification failed before improvement batch"
                next_step = "Fix blocking verification issues first"

        task["last_run_at"] = timestamp
        task["last_result"] = result
        save_tasks(data)

        evidence = json.dumps(payload, ensure_ascii=False)[:800]
        append_progress(
            iteration=iteration + 1,
            goal=task["goal"],
            change="Executed automated Ralph verification runner against current task state.",
            evidence=evidence,
            result=result,
            next_step=next_step,
        )
        summary.append({"task": task["id"], "status": task["status"], "result": result})

        if not ok:
            print(json.dumps({"ok": False, "message": "Loop stopped on failed verification.", "summary": summary, "failures": payload.get("failures", [])}, indent=2))
            return 1

    print(json.dumps({"ok": True, "message": "Loop reached max iterations.", "summary": summary}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
