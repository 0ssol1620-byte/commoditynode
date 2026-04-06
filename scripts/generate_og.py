#!/usr/bin/env python3
"""Generate OG images for commodities missing custom images."""

import math
import random
from PIL import Image, ImageDraw, ImageFont

# Fonts
FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"

W, H = 1200, 630
BG = (10, 10, 26)        # #0a0a1a
PANEL = (18, 18, 32)     # right panel
CYAN = (34, 211, 238)    # #22d3ee
BOTTOM_BAR = (8, 8, 18)

COMMODITIES = {
    "ammonia":       {"name": "Ammonia",        "color": (59, 130, 246)},   # blue
    "ethanol":       {"name": "Ethanol",        "color": (34, 197, 94)},    # green
    "feeder-cattle": {"name": "Feeder Cattle",  "color": (180, 83, 9)},     # amber-dark
    "graphite":      {"name": "Graphite",       "color": (148, 163, 184)},  # slate
    "lean-hogs":     {"name": "Lean Hogs",      "color": (239, 68, 68)},    # red
    "live-cattle":   {"name": "Live Cattle",    "color": (217, 119, 6)},    # amber
    "manganese":     {"name": "Manganese",      "color": (139, 92, 246)},   # violet
    "orange-juice":  {"name": "Orange Juice",   "color": (251, 146, 60)},   # orange
    "palm-oil":      {"name": "Palm Oil",       "color": (132, 204, 22)},   # lime
    "potash":        {"name": "Potash",         "color": (236, 72, 153)},   # pink
    "rare-earth":    {"name": "Rare Earth Elements", "color": (168, 85, 247)}, # purple
    "rhodium":       {"name": "Rhodium",        "color": (192, 192, 210)},  # silver
    "rubber":        {"name": "Rubber",         "color": (101, 163, 13)},   # green-dark
    "soybean-meal":  {"name": "Soybean Meal",   "color": (202, 138, 4)},    # yellow-dark
    "soybean-oil":   {"name": "Soybean Oil",    "color": (234, 179, 8)},    # yellow
}


def draw_network(draw, color, seed=42):
    """Draw a network graph on the right side."""
    rng = random.Random(seed)
    cx, cy = 900, 315
    nodes = []
    for _ in range(18):
        angle = rng.uniform(0, 2 * math.pi)
        dist = rng.uniform(40, 230)
        x = cx + dist * math.cos(angle)
        y = cy + dist * math.sin(angle)
        r = rng.randint(8, 28)
        nodes.append((x, y, r))

    # Draw edges
    line_color = (*color, 100)
    for i, (x1, y1, _) in enumerate(nodes):
        for j, (x2, y2, _) in enumerate(nodes):
            if i < j and rng.random() < 0.25:
                draw.line([(x1, y1), (x2, y2)], fill=(*color, 60), width=1)

    # Draw nodes
    for x, y, r in nodes:
        alpha = rng.randint(160, 240)
        node_color = (*color, alpha)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=node_color)
        # Inner dot
        ir = max(2, r // 3)
        draw.ellipse([x - ir, y - ir, x + ir, y + ir], fill=(255, 255, 255, 200))


def generate_og(slug, info, output_dir):
    """Generate a single OG image."""
    img = Image.new("RGBA", (W, H), BG)
    draw = ImageDraw.Draw(img)

    color = info["color"]
    name = info["name"]

    # Right panel background
    draw.rectangle([600, 0, W, H], fill=PANEL)

    # Gradient overlay on panel (subtle)
    for x in range(600, 680):
        alpha = int(255 * (680 - x) / 80)
        draw.line([(x, 0), (x, H)], fill=(*BG, alpha))

    # Network graph
    draw_network(draw, color, seed=hash(slug) % 10000)

    # Bottom bar
    draw.rectangle([0, H - 50, W, H], fill=BOTTOM_BAR)

    # CommodityNode text (top-left)
    try:
        font_brand = ImageFont.truetype(FONT_REG, 22)
    except Exception:
        font_brand = ImageFont.load_default()
    draw.text((60, 35), "CommodityNode", fill=CYAN, font=font_brand)

    # Accent color bar
    draw.rectangle([60, 75, 120, 95], fill=color)

    # Commodity name (large)
    try:
        font_title = ImageFont.truetype(FONT_BOLD, 72)
    except Exception:
        font_title = ImageFont.load_default()

    # Handle long names
    if len(name) > 14:
        try:
            font_title = ImageFont.truetype(FONT_BOLD, 56)
        except Exception:
            pass

    draw.text((60, 140), name, fill=(255, 255, 255), font=font_title)

    # Subtitle
    try:
        font_sub = ImageFont.truetype(FONT_BOLD, 26)
    except Exception:
        font_sub = ImageFont.load_default()
    y_sub = 240 if len(name) <= 14 else 220
    draw.text((60, y_sub), "Impact Map & Ripple Chain Analysis", fill=(255, 255, 255), font=font_sub)

    # Tagline
    try:
        font_tag = ImageFont.truetype(FONT_REG, 18)
    except Exception:
        font_tag = ImageFont.load_default()
    draw.text((60, y_sub + 50), "Where Raw Materials Meet Markets", fill=(180, 180, 200), font=font_tag)

    # Bottom bar text
    try:
        font_bottom = ImageFont.truetype(FONT_REG, 16)
    except Exception:
        font_bottom = ImageFont.load_default()
    draw.text((60, H - 35), "commoditynode.com", fill=CYAN, font=font_bottom)

    try:
        font_badge = ImageFont.truetype(FONT_BOLD, 16)
    except Exception:
        font_badge = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), "Signal Report", font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((W - 60 - tw, H - 35), "Signal Report", fill=CYAN, font=font_badge)

    # Convert to RGB and save
    rgb_img = Image.new("RGB", (W, H), BG)
    rgb_img.paste(img, mask=img.split()[3])
    outpath = f"{output_dir}/og-{slug}.png"
    rgb_img.save(outpath, "PNG", optimize=True)
    print(f"  Generated: {outpath}")
    return outpath


if __name__ == "__main__":
    import os
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "images")
    print(f"Output directory: {output_dir}")
    for slug, info in COMMODITIES.items():
        generate_og(slug, info, output_dir)
    print(f"\nDone! Generated {len(COMMODITIES)} OG images.")
