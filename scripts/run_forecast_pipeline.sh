#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="${VENV_DIR:-$ROOT_DIR/.venv-forecast}"
PYTHON_BIN="${PYTHON_BIN:-$VENV_DIR/bin/python}"
SKIP_TIMESFM="${SKIP_TIMESFM:-0}"
SKIP_QA="${SKIP_QA:-0}"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  printf '\n[ERROR] %s\n' "$*" >&2
  exit 1
}

require_file() {
  [[ -f "$1" ]] || fail "Missing required file: $1"
}

log "CommodityNode forecast pipeline starting"
log "Root: $ROOT_DIR"
log "Venv: $VENV_DIR"

require_file "$ROOT_DIR/scripts/forecast_chronos2.py"
require_file "$ROOT_DIR/scripts/forecast_timesfm.py"
require_file "$ROOT_DIR/scripts/merge_forecasts.py"
require_file "$ROOT_DIR/scripts/qa_check.py"

if [[ ! -x "$PYTHON_BIN" ]]; then
  fail "Python not found in forecast venv: $PYTHON_BIN"
fi

cd "$ROOT_DIR"

log "Using Python: $PYTHON_BIN"
"$PYTHON_BIN" -V

log "Step 1/4 — Chronos-2 / fallback forecast refresh"
"$PYTHON_BIN" scripts/forecast_chronos2.py

if [[ "$SKIP_TIMESFM" != "1" ]]; then
  log "Step 2/4 — TimesFM 2.5 forecast refresh"
  "$PYTHON_BIN" scripts/forecast_timesfm.py
else
  log "Step 2/4 — TimesFM skipped because SKIP_TIMESFM=1"
fi

log "Step 3/4 — Consensus merge"
"$PYTHON_BIN" scripts/merge_forecasts.py

if [[ "$SKIP_QA" != "1" ]]; then
  log "Step 4/4 — QA check"
  python3 scripts/qa_check.py
else
  log "Step 4/4 — QA skipped because SKIP_QA=1"
fi

log "Forecast pipeline finished successfully"
log "Artifacts updated:"
printf '  - %s\n' \
  "$ROOT_DIR/assets/data/forecast.json" \
  "$ROOT_DIR/assets/data/forecast-consensus.json"
