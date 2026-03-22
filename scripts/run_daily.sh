#!/bin/bash
# Daily CommodityNode update script
# Cron: 0 9 * * * /home/phillip/.openclaw/workspace/commoditynode/scripts/run_daily.sh
#
# Runs the full daily pipeline: price update → post generation → OG images → git commit+push

set -e
cd /home/phillip/.openclaw/workspace/commoditynode

LOG_DIR="logs"
LOG_FILE="$LOG_DIR/daily_$(date +%Y-%m-%d).log"
mkdir -p "$LOG_DIR"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(date)] Starting daily update..."

# 1. Update prices from Yahoo Finance
echo "[$(date)] Step 1: Updating prices..."
python3 scripts/update_prices.py

# 2. Generate posts for top movers
echo "[$(date)] Step 2: Generating posts for top movers..."
python3 scripts/auto_post.py --max 2 --no-commit --no-og

# 3. Generate OG images for new posts
echo "[$(date)] Step 3: Generating OG images..."
python3 scripts/generate_og_images.py

# 4. Commit and push
echo "[$(date)] Step 4: Committing and pushing..."
git add -A
git commit -m "auto: daily update $(date +%Y-%m-%d)" || echo "Nothing to commit"
git push origin main

echo "[$(date)] Daily update complete."
