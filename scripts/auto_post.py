#!/usr/bin/env python3
"""
CommodityNode Auto Post Generator
Usage: python3 scripts/auto_post.py [--dry-run] [--max 3] [--min-move 2.0] [--model gpt-4o-mini]
Cron:  0 10 * * * cd /home/phillip/.openclaw/workspace/commoditynode && python3 scripts/auto_post.py >> logs/auto_post.log 2>&1
"""

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PRICES_PATH = REPO_ROOT / "_data" / "prices.json"
POSTS_DIR = REPO_ROOT / "_posts"
LOG_DIR = REPO_ROOT / "logs"

TODAY = datetime.now().strftime("%Y-%m-%d")

# ---------------------------------------------------------------------------
# Category / tag mapping
# ---------------------------------------------------------------------------
COMMODITY_META = {
    "crude_oil":   {"categories": ["Energy", "Commodities"], "sector": "energy",   "slug": "crude-oil"},
    "gold":        {"categories": ["Precious", "Commodities"], "sector": "precious-metals", "slug": "gold"},
    "copper":      {"categories": ["Industrial Metals", "Commodities"], "sector": "industrial-metals", "slug": "copper"},
    "natural_gas": {"categories": ["Energy", "Commodities"], "sector": "energy",   "slug": "natural-gas"},
    "wheat":       {"categories": ["Agriculture", "Commodities"], "sector": "agriculture", "slug": "wheat"},
    "lithium":     {"categories": ["Battery", "Commodities"], "sector": "battery",  "slug": "lithium"},
    "silver":      {"categories": ["Precious", "Commodities"], "sector": "precious-metals", "slug": "silver"},
    "corn":        {"categories": ["Agriculture", "Commodities"], "sector": "agriculture", "slug": "corn"},
    "uranium":     {"categories": ["Energy", "Commodities"], "sector": "nuclear",   "slug": "uranium"},
    "aluminum":    {"categories": ["Industrial Metals", "Commodities"], "sector": "industrial-metals", "slug": "aluminum"},
    "coffee":      {"categories": ["Agriculture", "Commodities"], "sector": "agriculture", "slug": "coffee"},
    "lumber":      {"categories": ["Construction", "Commodities"], "sector": "construction", "slug": "lumber"},
    "palladium":   {"categories": ["Precious", "Commodities"], "sector": "precious-metals", "slug": "palladium"},
    "steel":       {"categories": ["Industrial Metals", "Commodities"], "sector": "industrial-metals", "slug": "steel"},
    "zinc":         {"categories": ["Industrial Metals"], "sector": "metals",      "slug": "zinc"},
    "tin":          {"categories": ["Industrial Metals"], "sector": "metals",      "slug": "tin"},
    "sugar":        {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "sugar"},
    "soybeans":     {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "soybeans"},
    "platinum":     {"categories": ["Precious Metals"],   "sector": "precious",    "slug": "platinum"},
    "nickel":       {"categories": ["Industrial Metals"], "sector": "metals",      "slug": "nickel"},
    "lng":          {"categories": ["Energy"],            "sector": "energy",      "slug": "lng"},
    "jet_fuel":     {"categories": ["Energy"],            "sector": "energy",      "slug": "jet-fuel"},
    "iron_ore":     {"categories": ["Industrial Metals"], "sector": "metals",      "slug": "iron-ore"},
    "diesel":       {"categories": ["Energy"],            "sector": "energy",      "slug": "diesel"},
    "cotton":       {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "cotton"},
    "cocoa":        {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "cocoa"},
    "cobalt":       {"categories": ["Battery Metals"],    "sector": "metals",      "slug": "cobalt"},
    "coal":         {"categories": ["Energy"],            "sector": "energy",      "slug": "coal"},
    "rice":         {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "rice"},
    "oats":         {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "oats"},
    "orange_juice": {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "orange-juice"},
    "soybean_oil":  {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "soybean-oil"},
    "soybean_meal": {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "soybean-meal"},
    "live_cattle":  {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "live-cattle"},
    "feeder_cattle":{"categories": ["Agriculture"],       "sector": "agriculture", "slug": "feeder-cattle"},
    "lean_hogs":    {"categories": ["Agriculture"],       "sector": "agriculture", "slug": "lean-hogs"},
    "potash":       {"categories": ["Agriculture", "Chemicals"], "sector": "agriculture", "slug": "potash"},
    "ammonia":      {"categories": ["Agriculture", "Chemicals"], "sector": "agriculture", "slug": "ammonia"},
    "manganese":    {"categories": ["Industrial Metals"], "sector": "metals",      "slug": "manganese"},
    "vanadium":     {"categories": ["Industrial Metals"], "sector": "metals",      "slug": "vanadium"},
    "graphite":     {"categories": ["Battery Metals"],    "sector": "metals",      "slug": "graphite"},
    "rare_earth":   {"categories": ["Battery Metals"],    "sector": "metals",      "slug": "rare-earth"},
    "rhodium":      {"categories": ["Precious Metals"],   "sector": "precious",    "slug": "rhodium"},
    "hydrogen":     {"categories": ["Energy"],            "sector": "energy",      "slug": "hydrogen"},
    "rubber":       {"categories": ["Agriculture", "Industrial"], "sector": "agriculture", "slug": "rubber"},
    "ethanol":      {"categories": ["Energy", "Agriculture"], "sector": "energy",  "slug": "ethanol"},
}

# ---------------------------------------------------------------------------
# System prompt for GPT
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = (
    "You are a professional commodity markets analyst writing for CommodityNode.com, "
    "a platform that analyzes how commodity price movements ripple through industries and equities. "
    "Write in a factual, analytical tone. Use specific numbers and company names. "
    "No fluff, no generic statements."
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def load_prices() -> dict:
    with open(PRICES_PATH) as f:
        return json.load(f)


def top_movers(prices: dict, n: int = 3, min_move: float = 2.0) -> list[tuple[str, dict]]:
    """Return top N commodities sorted by abs(change_pct), filtered by min_move."""
    def safe_change(entry: dict) -> float:
        ch = entry.get("change_pct", 0)
        return abs(ch) if isinstance(ch, (int, float)) else 0.0

    ranked = sorted(prices.items(), key=lambda kv: safe_change(kv[1]), reverse=True)
    return [(k, v) for k, v in ranked if safe_change(v) >= min_move][:n]


def already_posted_today(commodity_key: str) -> bool:
    """Check if a post for this commodity was already created today."""
    slug = COMMODITY_META.get(commodity_key, {}).get("slug", commodity_key.replace("_", "-"))
    for f in POSTS_DIR.glob(f"{TODAY}-*.md"):
        name_lower = f.name.lower()
        if slug in name_lower or commodity_key.replace("_", "-") in name_lower:
            return True
    return False


def fetch_news_headlines(symbol: str, max_headlines: int = 5) -> list[str]:
    """Fetch recent news headlines via yfinance."""
    headlines = []
    try:
        import yfinance as yf
        ticker = yf.Ticker(symbol)
        news = ticker.news or []
        for item in news[:max_headlines]:
            title = item.get("title", "")
            if title:
                headlines.append(title)
    except Exception as e:
        log(f"  yfinance news fetch failed for {symbol}: {e}")
    return headlines


def generate_post_content(commodity_key: str, data: dict, headlines: list[str], model: str) -> dict | None:
    """Call OpenAI API to generate post title, excerpt, and markdown body.

    Returns dict with keys: title, excerpt, body, slug   or None on failure.
    """
    try:
        from openai import OpenAI
    except ImportError:
        log("ERROR: openai package not installed. Run: pip install openai")
        return None

    client = OpenAI()  # uses OPENAI_API_KEY env var

    name = data["name"]
    symbol = data["symbol"]
    price = data["price"]
    unit = data["unit"]
    change = data["change_pct"]
    high_52w = data["high_52w"]
    low_52w = data["low_52w"]
    direction = "up" if change > 0 else "down"
    direction_word = "surging" if change > 0 else "plunging" if change < -5 else ("rising" if change > 0 else "falling")

    news_block = "\n".join(f"- {h}" for h in headlines) if headlines else "No recent headlines available."

    user_prompt = f"""Write a Jekyll-compatible markdown post (NO front matter — I will add that) about {name} ({symbol}) moving {change:+.1f}% today.

Current price: {price} {unit}
Direction: {direction_word}
52-week range: {low_52w} – {high_52w} {unit}

Recent news context:
{news_block}

Requirements:
- 600–900 words
- Professional financial analysis style matching CommodityNode.com
- Structure with these sections (use ## headers):
  1. Opening paragraph with the price move and key context (no header needed)
  2. ## Why It Matters — fundamental drivers behind this move
  3. ## Industry Impact — which sectors and companies are affected, name specific tickers
  4. ## Winners & Losers — bullet list of companies/ETFs that benefit or suffer
  5. ## What to Watch — upcoming catalysts, data releases, technical levels
- Use specific numbers, percentages, company names, and ticker symbols
- Reference the 52-week range for context
- No generic filler — every sentence should carry information
- Do not include front matter or title — just the markdown body
- Do not wrap the output in code fences

Also provide on separate lines at the END of your response, clearly labeled:
POST_TITLE: <a compelling, specific title, max 80 chars, include the commodity name and key number>
POST_EXCERPT: <one-sentence excerpt, max 200 chars>
POST_SLUG: <lowercase-hyphenated slug for the filename, 3-6 words>"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        text = response.choices[0].message.content.strip()
    except Exception as e:
        log(f"  OpenAI API error: {e}")
        return None

    # Parse metadata from the end of the response
    title_match = re.search(r"POST_TITLE:\s*(.+)", text)
    excerpt_match = re.search(r"POST_EXCERPT:\s*(.+)", text)
    slug_match = re.search(r"POST_SLUG:\s*(.+)", text)

    if not title_match or not slug_match:
        log("  Failed to parse POST_TITLE / POST_SLUG from GPT response")
        return None

    title = title_match.group(1).strip().strip('"')
    excerpt = (excerpt_match.group(1).strip().strip('"') if excerpt_match
               else f"{name} moves {change:+.1f}% — here's what it means for markets.")
    slug = slug_match.group(1).strip().lower()
    slug = re.sub(r"[^a-z0-9-]", "", slug).strip("-")

    # Remove the metadata lines from the body
    body = re.sub(r"POST_TITLE:.*", "", text)
    body = re.sub(r"POST_EXCERPT:.*", "", body)
    body = re.sub(r"POST_SLUG:.*", "", body)
    body = body.strip()

    return {"title": title, "excerpt": excerpt, "body": body, "slug": slug}


def build_front_matter(commodity_key: str, data: dict, gen: dict) -> str:
    meta = COMMODITY_META.get(commodity_key, {
        "categories": ["Commodities"],
        "sector": "commodities",
        "slug": commodity_key.replace("_", "-"),
    })
    commodity_slug = meta["slug"]
    categories = json.dumps(meta["categories"])
    tags_list = [commodity_slug, meta["sector"], "analysis"]
    if data["symbol"] not in ("=F",):
        clean_sym = data["symbol"].replace("=F", "")
        if clean_sym and clean_sym not in tags_list:
            tags_list.append(clean_sym)
    tags = json.dumps(tags_list)

    direction = "bullish" if data["change_pct"] > 0 else "bearish"
    image_path = f"/assets/images/og/{gen['slug']}.png"

    return f"""---
layout: post
title: "{gen['title']}"
date: {TODAY}
categories: {categories}
tags: {tags}
excerpt: "{gen['excerpt']}"
commodity: {commodity_slug}
direction: {direction}
image: {image_path}
---"""


def write_post(commodity_key: str, data: dict, gen: dict) -> Path:
    front_matter = build_front_matter(commodity_key, data, gen)
    content = f"{front_matter}\n\n{gen['body']}\n"
    filename = f"{TODAY}-{gen['slug']}.md"
    filepath = POSTS_DIR / filename
    filepath.write_text(content, encoding="utf-8")
    return filepath


def generate_og_image(slug: str):
    """Run the existing OG image generator for a specific post slug."""
    og_script = REPO_ROOT / "scripts" / "generate_og_images.py"
    if not og_script.exists():
        log(f"  OG image script not found at {og_script}")
        return
    try:
        subprocess.run(
            [sys.executable, str(og_script)],
            cwd=str(REPO_ROOT),
            timeout=120,
            check=False,
        )
        log(f"  OG images regenerated")
    except Exception as e:
        log(f"  OG image generation failed: {e}")


def git_commit(files_created: list[str]):
    """Stage new posts and OG images, then commit."""
    try:
        subprocess.run(
            ["git", "add", "_posts/", "assets/images/og/"],
            cwd=str(REPO_ROOT),
            check=True,
        )
        msg = f"auto: generated {len(files_created)} post(s) for {TODAY}"
        subprocess.run(
            ["git", "commit", "-m", msg],
            cwd=str(REPO_ROOT),
            check=True,
        )
        log(f"  Committed: {msg}")
    except subprocess.CalledProcessError as e:
        log(f"  Git commit failed: {e}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="CommodityNode Auto Post Generator")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be generated without writing files")
    parser.add_argument("--max", type=int, default=3, help="Maximum posts to generate per run (default: 3)")
    parser.add_argument("--min-move", type=float, default=2.0, help="Minimum abs(change_pct) to trigger a post (default: 2.0)")
    parser.add_argument("--model", type=str, default="gpt-4o-mini", help="OpenAI model to use (default: gpt-4o-mini)")
    parser.add_argument("--no-og", action="store_true", help="Skip OG image generation")
    parser.add_argument("--no-commit", action="store_true", help="Skip git commit")
    args = parser.parse_args()

    log("=== CommodityNode Auto Post Generator ===")

    # Ensure logs directory exists
    LOG_DIR.mkdir(exist_ok=True)

    # Check for API key
    if not os.environ.get("OPENAI_API_KEY") and not args.dry_run:
        log("ERROR: OPENAI_API_KEY environment variable not set.")
        sys.exit(1)

    # Load prices
    if not PRICES_PATH.exists():
        log(f"ERROR: prices.json not found at {PRICES_PATH}")
        sys.exit(1)

    prices = load_prices()
    log(f"Loaded {len(prices)} commodities from prices.json")

    # Find top movers
    movers = top_movers(prices, n=args.max, min_move=args.min_move)
    if not movers:
        log(f"No commodities moved more than {args.min_move}%. Nothing to generate.")
        sys.exit(0)

    mover_labels = ["{} ({:+.1f}%)".format(k, v['change_pct']) for k, v in movers]
    log(f"Top movers: {', '.join(mover_labels)}")

    files_created = []

    for commodity_key, data in movers:
        log(f"\nProcessing: {data['name']} ({data['symbol']}) — {data['change_pct']:+.1f}%")

        # Check for existing post
        if already_posted_today(commodity_key):
            log(f"  Skipping — already posted today")
            continue

        if args.dry_run:
            log(f"  [DRY RUN] Would generate post for {data['name']}")
            continue

        # Fetch news context
        log(f"  Fetching news for {data['symbol']}...")
        headlines = fetch_news_headlines(data["symbol"])
        if headlines:
            log(f"  Got {len(headlines)} headlines")
        else:
            log(f"  No headlines found — proceeding without news context")

        # Generate post via OpenAI
        log(f"  Generating post via {args.model}...")
        gen = generate_post_content(commodity_key, data, headlines, args.model)
        if gen is None:
            log(f"  Failed to generate — skipping")
            continue

        # Write post
        filepath = write_post(commodity_key, data, gen)
        files_created.append(str(filepath))
        log(f"  Written: {filepath.name}")

    if not files_created:
        log("\nNo new posts created.")
        sys.exit(0)

    log(f"\nCreated {len(files_created)} post(s)")

    # Generate OG images
    if not args.no_og and files_created:
        log("Generating OG images...")
        generate_og_image(files_created[0])

    # Git commit
    if not args.no_commit and files_created:
        log("Committing to git...")
        git_commit(files_created)

    log("Done.")


if __name__ == "__main__":
    main()
