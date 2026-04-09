#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ISSUES_PATH = ROOT / "ralph-loop" / "issues.json"
REPORT_PATH = ROOT / "ralph-loop" / "autofix_report.json"
CONFIG_PATH = ROOT / "_config.yml"

INTERNAL_DOCS = [
    "SEO-AUDIT-2026-04-04.md",
    "ADSENSE_REVIEW_CHECKLIST.md",
    "GSC_RESUBMISSION_PRIORITY.md",
    "CHANGELOG.md",
    "CHANGELOG_IMPLEMENTATION.md"
]


def ensure_excludes(config_text: str):
    changed = False
    for doc in INTERNAL_DOCS:
        line = f"  - {doc}"
        if line not in config_text:
            anchor = "  - SEO_AUDIT.md\n"
            if anchor in config_text:
                config_text = config_text.replace(anchor, anchor + line + "\n", 1)
                changed = True
            else:
                exclude_anchor = "exclude:\n"
                if exclude_anchor in config_text:
                    config_text = config_text.replace(exclude_anchor, exclude_anchor + line + "\n", 1)
                    changed = True
    return config_text, changed


def main():
    if not ISSUES_PATH.exists():
        payload = {"ok": True, "applied": [], "message": "No issues.json found"}
        REPORT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 0

    issues_doc = json.loads(ISSUES_PATH.read_text())
    issues = issues_doc.get("issues", [])
    applied = []
    skipped = []

    config_text = CONFIG_PATH.read_text()
    new_config, changed = ensure_excludes(config_text)
    if changed:
        CONFIG_PATH.write_text(new_config)
        applied.append({
            "fix": "ensure-internal-doc-excludes",
            "file": str(CONFIG_PATH.relative_to(ROOT)),
            "details": INTERNAL_DOCS,
        })

    for issue in issues:
        skipped.append({
            "issue_id": issue.get("id"),
            "title": issue.get("title"),
            "reason": "No safe auto-fix routine registered yet"
        })

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ok": True,
        "applied": applied,
        "skipped": skipped,
        "changed": bool(applied)
    }
    REPORT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
