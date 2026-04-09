#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TASKS_PATH = ROOT / "ralph-loop" / "TASKS.json"
PROGRESS_PATH = ROOT / "ralph-loop" / "progress.md"
GOALS_PATH = ROOT / "ralph-loop" / "GOALS.md"
VERIFY_CMD = [sys.executable, str(ROOT / "scripts" / "ralph_verify.py")]
FULL_AUDIT_CMD = [sys.executable, str(ROOT / "scripts" / "full_audit.py")]
AUTOFIX_CMD = [sys.executable, str(ROOT / "scripts" / "ralph_autofix.py")]
NOTIFY_ENABLED = os.environ.get("RALPH_NOTIFY", "1") != "0"


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


def run_full_audit():
    proc = subprocess.run(FULL_AUDIT_CMD, cwd=ROOT, capture_output=True, text=True)
    try:
        payload = json.loads(proc.stdout)
    except Exception:
        payload = {"ok": False, "raw": proc.stdout, "stderr": proc.stderr}
    return proc.returncode == 0, payload


def run_autofix():
    proc = subprocess.run(AUTOFIX_CMD, cwd=ROOT, capture_output=True, text=True)
    try:
        payload = json.loads(proc.stdout)
    except Exception:
        payload = {"ok": False, "raw": proc.stdout, "stderr": proc.stderr}
    return proc.returncode == 0, payload


def notify(event_type, text):
    if not NOTIFY_ENABLED:
        return
    cmd = [
        "openclaw", "system", "event",
        "--text", f"[ralph:{event_type}] {text}",
        "--mode", "now"
    ]
    subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


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

    notify("start", "CommodityNode Ralph loop started")

    for _ in range(max_iterations):
        iteration += 1
        task = select_task(data.get("tasks", []))
        if not task:
            notify("complete", "CommodityNode Ralph loop finished, no pending tasks remain")
            print(json.dumps({"ok": True, "message": "No pending tasks remain.", "summary": summary}, indent=2))
            return 0

        task["status"] = "in_progress"
        save_tasks(data)
        notify("task", f"Running task {task['id']}: {task['goal']}")

        audit_ok, audit_payload = run_full_audit()
        autofix_payload = None
        if not audit_ok:
            notify("autofix", f"Attempting safe auto-fix routines for task {task['id']}")
            _, autofix_payload = run_autofix()
            audit_ok, audit_payload = run_full_audit()
        verify_ok, verify_payload = run_verify()
        ok = audit_ok and verify_ok
        payload = {"audit": audit_payload, "autofix": autofix_payload, "verify": verify_payload}
        timestamp = datetime.now(timezone.utc).isoformat()

        if task["type"] == "verification":
            if ok:
                task["status"] = "completed"
                result = "Audit and verification passed"
                next_step = "Advance to next pending task"
            else:
                task["status"] = "failed"
                result = "Audit or verification failed"
                next_step = "Investigate issues.json and apply a bounded fix batch"
        else:
            if ok:
                task["status"] = "completed"
                result = "Baseline audit and verification passed for improvement task"
                next_step = "Manually define the next improvement batch for this goal"
            else:
                task["status"] = "failed"
                result = "Baseline audit or verification failed before improvement batch"
                next_step = "Fix blocking issues first using ralph-loop/issues.json"

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
            notify("failed", f"CommodityNode Ralph loop stopped on task {task['id']} with audit/verification failures")
            print(json.dumps({"ok": False, "message": "Loop stopped on failed audit or verification.", "summary": summary, "failures": payload}, indent=2))
            return 1

    notify("complete", "CommodityNode Ralph loop reached max iterations")
    print(json.dumps({"ok": True, "message": "Loop reached max iterations.", "summary": summary}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
