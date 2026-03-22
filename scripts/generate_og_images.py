#!/usr/bin/env python3
"""Generate OG images for CommodityNode commodity hubs and posts."""
import os, math, random, glob, json, re, textwrap
from PIL import Image, ImageDraw, ImageFont

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.join(SCRIPT_DIR, '..')
OUTPUT_DIR = os.path.join(PROJECT_DIR, 'assets', 'images')
OG_POST_DIR = os.path.join(OUTPUT_DIR, 'og')
POSTS_DIR = os.path.join(PROJECT_DIR, '_posts')
PRICES_PATH = os.path.join(PROJECT_DIR, 'assets', 'data', 'prices.json')

COMMODITIES = {
    'crude-oil':    {'label': 'Crude Oil', 'ticker': 'WTI', 'color': (234, 88, 12),  'accent': (251, 146, 60)},
    'gold':         {'label': 'Gold',      'ticker': 'XAU', 'color': (202, 138, 4),   'accent': (251, 191, 36)},
    'copper':       {'label': 'Copper',    'ticker': 'HG',  'color': (185, 80, 0),    'accent': (234, 120, 40)},
    'natural-gas':  {'label': 'Natural Gas','ticker': 'NG', 'color': (14, 116, 144),  'accent': (34, 211, 238)},
    'wheat':        {'label': 'Wheat',     'ticker': 'ZW',  'color': (101, 163, 13),  'accent': (163, 230, 53)},
    'lithium':      {'label': 'Lithium',   'ticker': 'LI',  'color': (109, 40, 217),  'accent': (167, 139, 250)},
    'silver':       {'label': 'Silver',    'ticker': 'XAG', 'color': (71, 85, 105),   'accent': (148, 163, 184)},
    'steel':        {'label': 'Steel',     'ticker': 'HR',  'color': (51, 65, 85),    'accent': (100, 116, 139)},
    'corn':         {'label': 'Corn',      'ticker': 'ZC',  'color': (133, 77, 14),   'accent': (217, 119, 6)},
    'uranium':      {'label': 'Uranium',   'ticker': 'UX',  'color': (5, 150, 105),   'accent': (16, 185, 129)},
    'aluminum':     {'label': 'Aluminum',  'ticker': 'AL',  'color': (30, 64, 175),   'accent': (59, 130, 246)},
    'coffee':       {'label': 'Coffee',    'ticker': 'KC',  'color': (120, 53, 15),   'accent': (180, 83, 9)},
    'lumber':       {'label': 'Lumber',    'ticker': 'LB',  'color': (92, 61, 26),    'accent': (146, 96, 47)},
    'palladium':    {'label': 'Palladium', 'ticker': 'PA',  'color': (55, 65, 81),    'accent': (107, 114, 128)},
    'iron-ore':     {'label': 'Iron Ore',  'ticker': 'IO',  'color': (127, 29, 29),   'accent': (185, 28, 28)},
    'nickel':       {'label': 'Nickel',    'ticker': 'NI',  'color': (21, 94, 117),   'accent': (8, 145, 178)},
    'platinum':     {'label': 'Platinum',  'ticker': 'PL',  'color': (30, 41, 59),    'accent': (100, 116, 139)},
    'zinc':         {'label': 'Zinc',      'ticker': 'ZN',  'color': (15, 23, 42),    'accent': (71, 85, 105)},
    'tin':          {'label': 'Tin',       'ticker': 'SN',  'color': (30, 58, 138),   'accent': (37, 99, 235)},
    'cobalt':       {'label': 'Cobalt',    'ticker': 'CO',  'color': (49, 46, 129),   'accent': (79, 70, 229)},
    'soybeans':     {'label': 'Soybeans',  'ticker': 'ZS',  'color': (54, 83, 20),    'accent': (101, 163, 13)},
    'sugar':        {'label': 'Sugar',     'ticker': 'SB',  'color': (159, 122, 234), 'accent': (196, 181, 253)},
    'cocoa':        {'label': 'Cocoa',     'ticker': 'CC',  'color': (92, 45, 22),    'accent': (154, 78, 44)},
    'cotton':       {'label': 'Cotton',    'ticker': 'CT',  'color': (55, 48, 163),   'accent': (99, 102, 241)},
    'diesel':       {'label': 'Diesel',    'ticker': 'HO',  'color': (107, 33, 168),  'accent': (167, 139, 250)},
    'jet-fuel':     {'label': 'Jet Fuel',  'ticker': 'JF',  'color': (15, 118, 110),  'accent': (20, 184, 166)},
    'lng':          {'label': 'LNG',       'ticker': 'LNG', 'color': (3, 105, 161),   'accent': (14, 165, 233)},
    'coal':         {'label': 'Coal',      'ticker': 'MTF', 'color': (28, 25, 23),    'accent': (87, 83, 78)},
    'default':      {'label': 'Commodity', 'ticker': 'CMX', 'color': (8, 47, 73),     'accent': (34, 211, 238)},
}

W, H = 1200, 630

def make_node_pattern(draw, color, accent, seed=42):
    """Draw decorative node graph on right side."""
    rng = random.Random(seed)
    nodes = []
    for _ in range(18):
        x = rng.randint(750, 1150)
        y = rng.randint(60, 570)
        r = rng.randint(4, 18)
        nodes.append((x, y, r))
    
    # Draw connections
    for i, (x1, y1, r1) in enumerate(nodes):
        for j, (x2, y2, r2) in enumerate(nodes):
            if i >= j: continue
            dist = math.hypot(x2-x1, y2-y1)
            if dist < 200:
                alpha = int(60 * (1 - dist/200))
                draw.line([(x1, y1), (x2, y2)], fill=(*accent[:3], alpha), width=1)
    
    # Draw nodes
    for x, y, r in nodes:
        # outer glow
        for gr in range(r+8, r, -2):
            alpha = int(30 * (1 - (gr-r)/8))
            draw.ellipse([(x-gr, y-gr), (x+gr, y+gr)], fill=(*accent[:3], alpha))
        draw.ellipse([(x-r, y-r), (x+r, y+r)], fill=(*accent[:3], 180))
        draw.ellipse([(x-r//2, y-r//2), (x+r//2, y+r//2)], fill=(255,255,255,120))

def generate_og(key, info):
    img = Image.new('RGBA', (W, H), (5, 5, 8, 255))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    color = info['color']
    accent = info['accent']
    
    # Background gradient (left-heavy)
    for x in range(W):
        factor = max(0, 1 - x / 900)
        r = int(color[0] * factor * 0.4 + 5)
        g = int(color[1] * factor * 0.4 + 5)
        b = int(color[2] * factor * 0.4 + 8)
        for y in range(H):
            yfactor = 1 - abs(y - H//2) / (H//2) * 0.3
            draw.point((x, y), fill=(
                min(255, int(r * yfactor)),
                min(255, int(g * yfactor)),
                min(255, int(b * yfactor)),
                255
            ))
    
    # Top accent line
    draw.rectangle([(0, 0), (W, 4)], fill=(*accent, 255))
    
    # Node pattern on right
    make_node_pattern(draw, color, accent, seed=hash(key) % 1000)
    
    # Left overlay gradient for text readability
    for x in range(700):
        alpha = int(180 * (1 - x/700))
        draw.line([(x, 0), (x, H)], fill=(5, 5, 8, alpha))
    
    # Fonts - use default
    try:
        font_big = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_med = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        font_sm  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        font_xs  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except:
        font_big = font_med = font_sm = font_xs = ImageFont.load_default()
    
    # Brand name
    draw.text((48, 40), "CommodityNode", font=font_sm, fill=(*accent, 255))
    
    # Ticker badge
    badge_text = info['ticker']
    bbox = draw.textbbox((0,0), badge_text, font=font_sm)
    bw = bbox[2] - bbox[0] + 24
    bh = bbox[3] - bbox[1] + 12
    draw.rounded_rectangle([(48, 90), (48+bw, 90+bh)], radius=6, fill=(*accent, 40), outline=(*accent, 120))
    draw.text((48+12, 90+6), badge_text, font=font_sm, fill=(*accent, 255))
    
    # Main label
    label = info['label']
    draw.text((48, 160), label, font=font_big, fill=(255, 255, 255, 255))
    
    # Subtitle
    draw.text((48, 255), "Impact Map & Ripple Chain Analysis", font=font_med, fill=(180, 180, 200, 255))
    
    # Tag line
    draw.text((48, 320), "Where Raw Materials Meet Markets", font=font_xs, fill=(120, 120, 150, 255))
    
    # Bottom bar
    draw.rectangle([(0, H-60), (W, H)], fill=(10, 10, 18, 220))
    draw.text((48, H-40), "commoditynode.com", font=font_xs, fill=(80, 80, 100, 255))
    draw.text((W-200, H-40), "Signal Report", font=font_xs, fill=(*accent, 180))
    
    # Convert and save
    final = img.convert('RGB')
    out_path = os.path.join(OUTPUT_DIR, f'og-{key}.png')
    final.save(out_path, 'PNG', optimize=True)
    print(f"  ✓ og-{key}.png")

def parse_front_matter(filepath):
    """Extract YAML front matter from a Jekyll post."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).split('\n'):
        if ':' in line:
            key, val = line.split(':', 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            fm[key] = val
    return fm


def generate_post_og(slug, title, commodity_tag, price_data):
    """Generate a 1200x630 OG image for a post."""
    # Find commodity info for coloring
    tag_slug = commodity_tag.lower().replace(' ', '-') if commodity_tag else ''
    info = COMMODITIES.get(tag_slug, COMMODITIES['default'])
    color = info['color']
    accent = info['accent']

    img = Image.new('RGBA', (W, H), (5, 5, 8, 255))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Background gradient
    for x in range(W):
        factor = max(0, 1 - x / 900)
        r = int(color[0] * factor * 0.3 + 5)
        g = int(color[1] * factor * 0.3 + 5)
        b = int(color[2] * factor * 0.3 + 8)
        for y in range(H):
            yfactor = 1 - abs(y - H // 2) / (H // 2) * 0.3
            draw.point((x, y), fill=(
                min(255, int(r * yfactor)),
                min(255, int(g * yfactor)),
                min(255, int(b * yfactor)),
                255
            ))

    draw.rectangle([(0, 0), (W, 4)], fill=(*accent, 255))
    make_node_pattern(draw, color, accent, seed=hash(slug) % 1000)

    for x in range(700):
        alpha = int(180 * (1 - x / 700))
        draw.line([(x, 0), (x, H)], fill=(5, 5, 8, alpha))

    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44)
        font_med = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 30)
        font_sm = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
        font_xs = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except Exception:
        font_title = font_med = font_sm = font_xs = ImageFont.load_default()

    # Brand
    draw.text((48, 40), "CommodityNode", font=font_sm, fill=(*accent, 255))

    # Commodity badge
    if commodity_tag:
        badge = commodity_tag.upper()
        bbox = draw.textbbox((0, 0), badge, font=font_xs)
        bw = bbox[2] - bbox[0] + 24
        bh = bbox[3] - bbox[1] + 12
        draw.rounded_rectangle([(48, 85), (48 + bw, 85 + bh)], radius=6, fill=(*accent, 40), outline=(*accent, 120))
        draw.text((48 + 12, 85 + 6), badge, font=font_xs, fill=(*accent, 255))

    # Title (word-wrapped)
    wrapped = textwrap.wrap(title, width=32)
    y_pos = 140
    for line in wrapped[:3]:
        draw.text((48, y_pos), line, font=font_title, fill=(255, 255, 255, 255))
        y_pos += 52

    # Price data if available
    price_key = tag_slug.replace('-', '_')
    if price_data and price_key in price_data:
        p = price_data[price_key]
        price_str = f"${p['price']}"
        sign = '+' if p['change_pct'] >= 0 else ''
        change_str = f"{sign}{p['change_pct']}%"
        change_color = (16, 185, 129, 255) if p['change_pct'] >= 0 else (244, 63, 94, 255)
        draw.text((48, y_pos + 20), price_str, font=font_med, fill=(240, 240, 245, 255))
        bbox_p = draw.textbbox((0, 0), price_str, font=font_med)
        pw = bbox_p[2] - bbox_p[0]
        draw.text((48 + pw + 12, y_pos + 24), change_str, font=font_sm, fill=change_color)

    # Bottom bar
    draw.rectangle([(0, H - 60), (W, H)], fill=(10, 10, 18, 220))
    draw.text((48, H - 40), "commoditynode.com", font=font_xs, fill=(80, 80, 100, 255))
    draw.text((W - 200, H - 40), "Signal Report", font=font_xs, fill=(*accent, 180))

    final = img.convert('RGB')
    out_path = os.path.join(OG_POST_DIR, f'{slug}.png')
    final.save(out_path, 'PNG', optimize=True)
    print(f"  ✓ og/posts/{slug}.png")


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(OG_POST_DIR, exist_ok=True)

    # Load price data
    price_data = {}
    if os.path.exists(PRICES_PATH):
        with open(PRICES_PATH) as f:
            price_data = json.load(f)

    # Generate commodity hub OG images
    print(f"Generating {len(COMMODITIES)} commodity OG images...")
    for key, info in COMMODITIES.items():
        try:
            generate_og(key, info)
        except Exception as e:
            print(f"  ✗ {key}: {e}")

    # Generate post OG images
    posts = sorted(glob.glob(os.path.join(POSTS_DIR, '*.md')))
    print(f"\nGenerating {len(posts)} post OG images...")
    for post_path in posts:
        try:
            fm = parse_front_matter(post_path)
            title = fm.get('title', os.path.basename(post_path))
            # Derive slug from filename: YYYY-MM-DD-slug.md -> slug
            basename = os.path.basename(post_path).replace('.md', '')
            slug = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', basename)
            # Get commodity tag (first tag)
            tags_raw = fm.get('tags', '')
            commodity_tag = ''
            if tags_raw.startswith('['):
                tags = [t.strip().strip('"').strip("'") for t in tags_raw.strip('[]').split(',')]
                commodity_tag = tags[0] if tags else ''
            else:
                commodity_tag = tags_raw.split(',')[0].strip() if tags_raw else ''
            generate_post_og(slug, title, commodity_tag, price_data)
        except Exception as e:
            print(f"  ✗ {os.path.basename(post_path)}: {e}")

    print("\nDone!")
