#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ISSUES_PATH = ROOT / "ralph-loop" / "issues.json"
REPORT_PATH = ROOT / "ralph-loop" / "autofix_report.json"
CATALOG_PATH = ROOT / "ralph-loop" / "remediation_catalog.json"
PLAYBOOKS_PATH = ROOT / "ralph-loop" / "playbooks.json"
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


def load_catalog():
    if not CATALOG_PATH.exists():
        return {"safe_patterns": []}
    return json.loads(CATALOG_PATH.read_text())


def load_playbooks():
    if not PLAYBOOKS_PATH.exists():
        return {"playbooks": []}
    return json.loads(PLAYBOOKS_PATH.read_text())


def classify_issue(issue, catalog):
    title = issue.get("title", "")
    check_id = issue.get("check_id", "")
    for item in catalog.get("safe_patterns", []):
        matches = item.get("matches", [])
        if any(m == check_id or m in title for m in matches):
            return item.get("handler", "manual_review_required")
    return "manual_review_required"


def match_playbook(issue, playbooks):
    title = issue.get("title", "")
    evidence = issue.get("evidence", {})
    for pb in playbooks.get("playbooks", []):
        markers = pb.get("required_markers", [])
        if all(marker in title or marker in str(evidence) for marker in markers[:1]):
            return pb
        if any(url in title for url in pb.get("trigger_urls", [])):
            return pb
    return None


def main():
    if not ISSUES_PATH.exists():
        payload = {"ok": True, "applied": [], "message": "No issues.json found"}
        REPORT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 0

    issues_doc = json.loads(ISSUES_PATH.read_text())
    issues = issues_doc.get("issues", [])
    catalog = load_catalog()
    playbooks = load_playbooks()
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
        handler = classify_issue(issue, catalog)
        if handler == "ensure_config_excludes":
            skipped.append({
                "issue_id": issue.get("id"),
                "title": issue.get("title"),
                "reason": "Config exclude safeguard already evaluated in this run"
            })
        elif handler == "playbook_restore_required":
            playbook = match_playbook(issue, playbooks)
            skipped.append({
                "issue_id": issue.get("id"),
                "title": issue.get("title"),
                "reason": "Playbook matched, but restore remains human-reviewed for now",
                "playbook": playbook,
            })
        else:
            skipped.append({
                "issue_id": issue.get("id"),
                "title": issue.get("title"),
                "reason": f"Handler {handler} requires manual review or future routine"
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
