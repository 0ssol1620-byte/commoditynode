#!/usr/bin/env python3
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "ralph-loop" / "verify_spec.json"


def fetch(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "CommodityNode-Ralph-Verify"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode("utf-8", "ignore")
        return resp.status, body


def main():
    spec = json.loads(CONFIG.read_text())
    failures = []
    results = []

    for check in spec.get("checks", []):
        url = check["url"]
        expected = check.get("status", 200)
        contains = check.get("contains", [])
        not_contains = check.get("not_contains", [])
        try:
            status, body = fetch(url)
            ok = status == expected
            missing = [x for x in contains if x not in body]
            present_bad = [x for x in not_contains if x in body]
            if missing or present_bad:
                ok = False
            results.append({
                "url": url,
                "status": status,
                "ok": ok,
                "missing": missing,
                "present_bad": present_bad,
            })
            if not ok:
                failures.append(results[-1])
        except urllib.error.HTTPError as e:
            result = {"url": url, "status": e.code, "ok": e.code == expected, "missing": contains, "present_bad": []}
            results.append(result)
            if not result["ok"]:
                failures.append(result)
        except Exception as e:
            result = {"url": url, "status": "error", "ok": False, "error": str(e), "missing": contains, "present_bad": []}
            results.append(result)
            failures.append(result)

    print(json.dumps({"ok": not failures, "results": results, "failures": failures}, indent=2))
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
