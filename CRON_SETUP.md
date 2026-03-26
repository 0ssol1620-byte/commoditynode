---
sitemap: false
---

# CommodityNode Automated Daily Updates

## Prerequisites

1. **Python dependencies:**
   ```bash
   pip install yfinance openai Pillow
   ```

2. **Environment variable:**
   ```bash
   export OPENAI_API_KEY="sk-..."
   ```
   For cron, add it to your shell profile (`~/.bashrc` or `~/.zshrc`) or set it directly in the crontab.

## Quick Test

Run the full pipeline manually to verify everything works:

```bash
cd /home/phillip/.openclaw/workspace/commoditynode

# Test individual scripts
python3 scripts/update_prices.py
python3 scripts/auto_post.py --dry-run
python3 scripts/auto_post.py --max 1 --no-commit

# Test the full daily script
bash scripts/run_daily.sh
```

## Cron Setup

```bash
# Open the cron editor
crontab -e

# Add this line (runs at 9 AM daily, after US pre-market opens):
0 9 * * * OPENAI_API_KEY="sk-..." /home/phillip/.openclaw/workspace/commoditynode/scripts/run_daily.sh

# Or if your API key is in ~/.bashrc:
0 9 * * * bash -lc '/home/phillip/.openclaw/workspace/commoditynode/scripts/run_daily.sh'
```

### Alternative schedules

```
0 9 * * 1-5    # Weekdays only (commodity markets are closed on weekends)
0 10 * * *     # 10 AM daily
0 9,16 * * 1-5 # Twice daily: 9 AM and 4 PM on weekdays
```

## Log Files

Logs are written to the `logs/` directory:

- **Daily pipeline:** `logs/daily_YYYY-MM-DD.log`
- **Auto post (standalone):** `logs/auto_post.log` (if run via cron with `>> logs/auto_post.log 2>&1`)

View recent logs:
```bash
tail -50 logs/daily_$(date +%Y-%m-%d).log
```

## Script Reference

| Script | Purpose | Flags |
|--------|---------|-------|
| `scripts/update_prices.py` | Fetch latest prices from Yahoo Finance | — |
| `scripts/auto_post.py` | Generate posts for top commodity movers | `--dry-run`, `--max N`, `--min-move N`, `--model MODEL`, `--no-og`, `--no-commit` |
| `scripts/generate_og_images.py` | Generate Open Graph images for posts | — |
| `scripts/run_daily.sh` | Full pipeline (all of the above + git push) | — |

## Troubleshooting

- **No posts generated:** Check that commodities moved more than 2% (adjustable with `--min-move`). Run `python3 scripts/auto_post.py --dry-run` to see current movers.
- **OpenAI errors:** Verify `OPENAI_API_KEY` is set and has credits. Try `--model gpt-4o-mini` for lower cost.
- **OG image errors:** Ensure Pillow is installed (`pip install Pillow`). The script uses DejaVuSans fonts (falls back to defaults).
- **Git push fails:** Check SSH keys or HTTPS credentials for the remote.
