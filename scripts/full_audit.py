#!/usr/bin/env python3
import json
import subprocess
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC_PATH = ROOT / "ralph-loop" / "audit_spec.json"
ISSUES_PATH = ROOT / "ralph-loop" / "issues.json"


def fetch(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "CommodityNode-Full-Audit"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode("utf-8", "ignore")
        return resp.status, body


def run_command(command: str, allowed_patterns=None):
    proc = subprocess.run(command, cwd=ROOT, shell=True, capture_output=True, text=True)
    stdout = proc.stdout[-4000:]
    stderr = proc.stderr[-2000:]
    ok = proc.returncode == 0
    ignored_matches = []

    if not ok and allowed_patterns:
        combined = (proc.stdout or "") + "\n" + (proc.stderr or "")
        lines = [line for line in combined.splitlines() if line.strip()]
        unexpected = []
        for line in lines:
            normalized = line.strip()
            if any(pattern in normalized for pattern in allowed_patterns):
                ignored_matches.append(line)
            elif (
                "Errors:" in normalized
                or "Warnings:" in normalized
                or "❌ ERRORS:" in normalized
                or "⚠️  WARNINGS:" in normalized
                or "=== CommodityNode QA Check ===" in normalized
            ):
                continue
            else:
                unexpected.append(line)
        if not unexpected:
            ok = True
            stdout = "\n".join(ignored_matches)[-4000:]
            stderr = ""

    return {
        "ok": ok,
        "code": proc.returncode,
        "stdout": stdout,
        "stderr": stderr,
        "ignored_matches": ignored_matches[-100:]
    }


def issue(check_id, severity, title, evidence, fix_hint):
    return {
        "id": f"{check_id}:{abs(hash(title)) % 1000000}",
        "check_id": check_id,
        "severity": severity,
        "title": title,
        "evidence": evidence,
        "fix_hint": fix_hint,
        "status": "open"
    }


def main():
    spec = json.loads(SPEC_PATH.read_text())
    issues = []
    results = []

    for check in spec.get("checks", []):
        ctype = check["type"]
        cid = check["id"]
        severity = check.get("severity", "medium")

        if ctype in {"live_url_contains", "live_url_status"}:
            for item in check.get("urls", []):
                url = item["url"]
                expected = item.get("status", 200)
                contains = item.get("contains", [])
                try:
                    status, body = fetch(url)
                    missing = [x for x in contains if x not in body]
                    ok = status == expected and not missing
                    results.append({"check_id": cid, "url": url, "ok": ok, "status": status, "missing": missing})
                    if not ok:
                        issues.append(issue(
                            cid,
                            severity,
                            f"Unexpected live result for {url}",
                            {"status": status, "expected": expected, "missing": missing},
                            "Review recent content/deploy changes and restore the required live surface."
                        ))
                except urllib.error.HTTPError as e:
                    ok = e.code == expected
                    results.append({"check_id": cid, "url": url, "ok": ok, "status": e.code, "missing": contains})
                    if not ok:
                        issues.append(issue(
                            cid,
                            severity,
                            f"Unexpected HTTP status for {url}",
                            {"status": e.code, "expected": expected},
                            "Review publication/exclude rules and live deployment state."
                        ))
                except Exception as e:
                    results.append({"check_id": cid, "url": url, "ok": False, "status": "error", "error": str(e)})
                    issues.append(issue(
                        cid,
                        severity,
                        f"Audit fetch failed for {url}",
                        {"error": str(e)},
                        "Retry the audit and inspect network/runtime conditions."
                    ))

        elif ctype == "command":
            payload = run_command(check["command"], check.get("allowed_patterns"))
            payload["command"] = check["command"]
            results.append({"check_id": cid, **payload})
            if not payload["ok"]:
                issues.append(issue(
                    cid,
                    severity,
                    f"Command audit failed: {check['command']}",
                    {"code": payload["code"], "stdout": payload["stdout"], "stderr": payload["stderr"]},
                    "Inspect the failing QA output, apply a bounded fix batch, and rerun the audit."
                ))

        elif ctype == "file_contains":
            file_path = ROOT / check["file"]
            if not file_path.exists():
                results.append({"check_id": cid, "file": check["file"], "ok": False, "missing_file": True})
                issues.append(issue(
                    cid,
                    severity,
                    f"Required file missing: {check['file']}",
                    {"file": check["file"]},
                    "Restore the missing file or update the audit spec if the path changed."
                ))
                continue
            content = file_path.read_text()
            missing = [x for x in check.get("contains", []) if x not in content]
            ok = not missing
            results.append({"check_id": cid, "file": check["file"], "ok": ok, "missing": missing})
            if not ok:
                issues.append(issue(
                    cid,
                    severity,
                    f"Required repo markers missing in {check['file']}",
                    {"file": check['file'], "missing": missing},
                    "Restore the expected trust or transparency block in the source file."
                ))

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ok": len(issues) == 0,
        "issue_count": len(issues),
        "issues": issues,
        "results": results
    }
    ISSUES_PATH.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0 if not issues else 1


if __name__ == "__main__":
    raise SystemExit(main())
