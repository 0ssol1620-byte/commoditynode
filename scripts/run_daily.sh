#!/bin/bash
# Daily CommodityNode update script
# Cron: 0 9 * * * /home/phillip/.openclaw/workspace/commoditynode/scripts/run_daily.sh
#
# Runs the full daily pipeline: price update → post generation → OG images → git commit+push

set -euo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
cd /home/phillip/.openclaw/workspace/commoditynode

LOG_DIR="logs"
LOG_FILE="$LOG_DIR/daily_$(date +%Y-%m-%d).log"
mkdir -p "$LOG_DIR"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(date)] Starting daily update..."

# 1. Update prices from Yahoo Finance
echo "[$(date)] Step 1: Updating prices..."
python3 scripts/update_prices.py

# 2. Chronos-2 forecast (baseline + direction signals, runs daily)
echo "[$(date)] Step 2: Chronos-2 forecast + direction signals..."
python3 scripts/forecast_chronos2.py

# 3. AutoGluon LoRA fine-tune forecast (runs weekly on Mondays only)
DOW=$(date +%u)  # 1=Mon ... 7=Sun
if [ "$DOW" = "1" ]; then
  echo "[$(date)] Step 3: AutoGluon LoRA fine-tune (weekly)..."
  python3 scripts/forecast_autogluon_prod.py
else
  echo "[$(date)] Step 3: AutoGluon LoRA fine-tune (skipped — not Monday)"
fi

# 4. Generate posts for top movers
echo "[$(date)] Step 4: Generating posts for top movers..."
python3 scripts/auto_post.py --max 2 --no-commit --no-og

# 5. Generate OG images for new posts
echo "[$(date)] Step 5: Generating OG images..."
python3 scripts/generate_og_images.py

# 6. Commit and push
echo "[$(date)] Step 6: Committing and pushing..."
git add -A
if git diff --cached --quiet && git diff --quiet; then
  echo "Nothing to commit"
else
  git commit -m "auto: daily update $(date +%Y-%m-%d)"
  git push origin main
fi

echo "[$(date)] Daily update complete."
