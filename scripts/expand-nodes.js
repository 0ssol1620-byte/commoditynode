#!/usr/bin/env node
/**
 * expand-nodes.js
 *
 * Reads all .md posts, adds `direction` to front matter, and expands
 * COMMODITY_DATA nodes to a minimum of 15 (not counting center) with
 * at least 4 levels.
 *
 * Usage:  node scripts/expand-nodes.js
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', '_posts');

// ─── Node banks per commodity category ───────────────────────────────────────

const NODE_BANKS = {
  energy: {
    L1: [
      { id: "uso", label: "USO Oil Fund", type: "etf", impact: 7.5, correlation: 0.88, sector: "ETF" },
      { id: "cop", label: "ConocoPhillips (COP)", type: "producer", impact: 7.8, correlation: 0.84, sector: "Oil Producer" }
    ],
    L2: [
      { id: "cat_e", label: "Caterpillar (CAT)", type: "supplier", impact: 3.5, correlation: 0.45, sector: "Heavy Equipment" },
      { id: "bkr", label: "Baker Hughes (BKR)", type: "supplier", impact: 10.5, correlation: 0.86, sector: "Oilfield Services" }
    ],
    L3: [
      { id: "solar_sub", label: "Solar/Wind Substitute", type: "substitute", impact: 2.5, correlation: -0.35, sector: "Renewables" },
      { id: "mideast", label: "Middle East Risk", type: "regional", impact: 5.0, correlation: 0.55, sector: "Geopolitics" },
      { id: "usd_fx", label: "USD/DXY Index", type: "macro", impact: -3.0, correlation: -0.58, sector: "Currency" }
    ],
    L4: [
      { id: "opec_policy", label: "OPEC+ Policy", type: "policy", impact: 6.0, sector: "Supply Policy" },
      { id: "cpi_macro", label: "CPI Inflation", type: "macro", impact: -2.0, sector: "Macro" },
      { id: "freight_idx", label: "Baltic Dry Index", type: "macro", impact: 3.5, correlation: 0.42, sector: "Shipping" }
    ]
  },
  precious_metals: {
    L1: [
      { id: "gld", label: "GLD Gold ETF", type: "etf", impact: 9.5, correlation: 0.99, sector: "ETF" },
      { id: "slv", label: "SLV Silver ETF", type: "etf", impact: 11.0, correlation: 0.95, sector: "ETF" }
    ],
    L2: [
      { id: "rgld", label: "Royal Gold (RGLD)", type: "producer", impact: 12.0, correlation: 0.82, sector: "Royalty Streaming" },
      { id: "jewelry", label: "Jewelry Retail", type: "consumer", impact: -3.0, correlation: -0.38, sector: "Luxury Retail" }
    ],
    L3: [
      { id: "central_bank", label: "Central Bank Buying", type: "macro", impact: 4.0, correlation: 0.48, sector: "Monetary Policy" },
      { id: "crypto_sub", label: "Bitcoin (BTC)", type: "substitute", impact: -2.0, correlation: -0.22, sector: "Digital Assets" },
      { id: "em_demand", label: "EM Demand (India/China)", type: "regional", impact: 3.5, correlation: 0.40, sector: "Emerging Markets" }
    ],
    L4: [
      { id: "real_rates", label: "Real Interest Rates", type: "macro", impact: -5.0, correlation: -0.72, sector: "Rates" },
      { id: "fed_policy", label: "Fed Policy", type: "policy", impact: -4.0, sector: "Monetary Policy" },
      { id: "geopolitical", label: "Geopolitical Risk", type: "macro", impact: 3.0, correlation: 0.35, sector: "Risk Premium" }
    ]
  },
  base_metals: {
    L1: [
      { id: "copx_etf", label: "COPX Mining ETF", type: "etf", impact: 12.0, correlation: 0.88, sector: "ETF" },
      { id: "bhp", label: "BHP Group (BHP)", type: "producer", impact: 7.0, correlation: 0.72, sector: "Diversified Mining" }
    ],
    L2: [
      { id: "construction", label: "Construction Sector", type: "consumer", impact: -4.0, correlation: -0.52, sector: "Construction" },
      { id: "auto_mfg", label: "Auto Manufacturing", type: "consumer", impact: -3.5, correlation: -0.48, sector: "Automotive" }
    ],
    L3: [
      { id: "china_demand", label: "China PMI", type: "regional", impact: 5.0, correlation: 0.62, sector: "China" },
      { id: "recycling", label: "Scrap/Recycling", type: "substitute", impact: -2.0, correlation: -0.30, sector: "Recycling" },
      { id: "lme_inv", label: "LME Inventory", type: "macro", impact: -3.5, correlation: -0.55, sector: "Supply" }
    ],
    L4: [
      { id: "infra_spend", label: "Infrastructure Bill", type: "policy", impact: 4.0, sector: "Fiscal Policy" },
      { id: "trade_tariff", label: "Trade Tariffs", type: "policy", impact: 3.0, sector: "Trade Policy" },
      { id: "usd_metal", label: "USD Strength", type: "macro", impact: -3.0, correlation: -0.52, sector: "Currency" }
    ]
  },
  battery: {
    L1: [
      { id: "lit_etf", label: "LIT Battery ETF", type: "etf", impact: 8.5, correlation: 0.82, sector: "ETF" },
      { id: "tsla", label: "Tesla (TSLA)", type: "consumer", impact: -5.0, correlation: -0.55, sector: "EV Maker" }
    ],
    L2: [
      { id: "battery_cell", label: "CATL/Battery Cells", type: "processor", impact: -4.5, correlation: -0.52, sector: "Battery Mfg" },
      { id: "panasonic", label: "Panasonic (PCRFY)", type: "processor", impact: -3.5, correlation: -0.45, sector: "Battery Mfg" }
    ],
    L3: [
      { id: "na_ion", label: "Sodium-ion Battery", type: "substitute", impact: -2.5, correlation: -0.28, sector: "Alt Battery" },
      { id: "drc_supply", label: "DRC Supply Risk", type: "regional", impact: 4.5, correlation: 0.42, sector: "Africa" },
      { id: "ev_mandate", label: "EV Mandate Policy", type: "policy", impact: 3.0, sector: "Regulation" }
    ],
    L4: [
      { id: "grid_storage", label: "Grid Storage Demand", type: "macro", impact: 3.0, sector: "Energy Storage" },
      { id: "china_refining", label: "China Refining Share", type: "regional", impact: 4.0, correlation: 0.48, sector: "China" },
      { id: "ira_subsidy", label: "IRA Subsidies", type: "policy", impact: 2.5, sector: "US Policy" }
    ]
  },
  agriculture: {
    L1: [
      { id: "dba_etf", label: "DBA Agri ETF", type: "etf", impact: 6.0, correlation: 0.75, sector: "ETF" },
      { id: "adm", label: "ADM (ADM)", type: "processor", impact: 4.5, correlation: 0.55, sector: "Agri Processing" }
    ],
    L2: [
      { id: "fertilizer", label: "CF Industries (CF)", type: "supplier", impact: 5.0, correlation: 0.58, sector: "Fertilizer" },
      { id: "food_mfg", label: "General Mills (GIS)", type: "consumer", impact: -3.0, correlation: -0.42, sector: "Food Mfg" }
    ],
    L3: [
      { id: "weather", label: "La Nina/El Nino", type: "macro", impact: 4.0, correlation: 0.38, sector: "Weather" },
      { id: "brazil_supply", label: "Brazil Harvest", type: "regional", impact: -4.5, correlation: -0.50, sector: "South America" },
      { id: "alt_crop", label: "Crop Substitution", type: "substitute", impact: -2.0, correlation: -0.25, sector: "Agriculture" }
    ],
    L4: [
      { id: "food_cpi", label: "Food CPI", type: "macro", impact: -2.0, sector: "Inflation" },
      { id: "export_ban", label: "Export Restrictions", type: "policy", impact: 5.0, sector: "Trade Policy" },
      { id: "biofuel_mandate", label: "Biofuel Mandates", type: "policy", impact: 3.0, sector: "Energy Policy" }
    ]
  },
  uranium: {
    L1: [
      { id: "ura_etf", label: "URA Uranium ETF", type: "etf", impact: 14.0, correlation: 0.90, sector: "ETF" },
      { id: "cco", label: "Cameco (CCJ)", type: "producer", impact: 16.0, correlation: 0.88, sector: "Uranium Mining" }
    ],
    L2: [
      { id: "nee", label: "NextEra (NEE)", type: "consumer", impact: 2.0, correlation: 0.25, sector: "Utilities" },
      { id: "smr", label: "NuScale Power (SMR)", type: "consumer", impact: 8.0, correlation: 0.65, sector: "SMR Technology" }
    ],
    L3: [
      { id: "kazakh_supply", label: "Kazakhstan Supply", type: "regional", impact: -5.0, correlation: -0.55, sector: "Central Asia" },
      { id: "nat_gas_sub", label: "Natural Gas (Sub)", type: "substitute", impact: -2.5, correlation: -0.32, sector: "Energy" },
      { id: "nrc_reg", label: "NRC Regulation", type: "policy", impact: 3.0, sector: "Regulation" }
    ],
    L4: [
      { id: "climate_policy", label: "Climate Policy", type: "policy", impact: 4.0, sector: "Climate" },
      { id: "energy_security", label: "Energy Security", type: "macro", impact: 3.5, sector: "Geopolitics" },
      { id: "decom_cost", label: "Decommission Cost", type: "macro", impact: -1.5, sector: "Operations" }
    ]
  }
};

// ─── Commodity ID → category mapping ─────────────────────────────────────────

function classifyCategory(commodityId, commodityName, fileName) {
  const id = (commodityId || '').toLowerCase();
  const name = (commodityName || '').toLowerCase();
  const file = (fileName || '').toLowerCase();

  // Energy
  if (/crude|oil|natgas|natural.gas|diesel|jet.fuel|lng|coal|energy.sector|chemicals|utilities/.test(id) ||
      /crude|oil|diesel|jet fuel|lng|coal|natural gas/.test(name) ||
      /crude|oil|diesel|jet.fuel|lng|coal|natural.gas|energy.sector|chemical|utilities/.test(file)) {
    return 'energy';
  }
  // Uranium
  if (/uranium/.test(id) || /uranium/.test(name) || /uranium|nuclear/.test(file)) {
    return 'uranium';
  }
  // Precious metals
  if (/^gold|^silver|^platinum|^palladium/.test(id) ||
      /gold|silver|platinum|palladium/.test(name) ||
      /gold|silver|platinum|palladium/.test(file)) {
    return 'precious_metals';
  }
  // Battery metals
  if (/lithium|cobalt|rare.earth|battery/.test(id) ||
      /lithium|cobalt|rare earth/.test(name) ||
      /lithium|cobalt|rare.earth|battery/.test(file)) {
    return 'battery';
  }
  // Agriculture
  if (/wheat|corn|soy|coffee|sugar|cocoa|cotton|lumber|agriculture|ag.sector|fertilizer|consumer.staples/.test(id) ||
      /wheat|corn|soy|coffee|sugar|cocoa|cotton|lumber|agriculture|fertilizer/.test(name) ||
      /wheat|corn|soy|coffee|sugar|cocoa|cotton|lumber|agriculture|fertilizer|consumer.staples/.test(file)) {
    return 'agriculture';
  }
  // Base metals
  if (/copper|aluminum|steel|iron.ore|iron_ore|zinc|tin|nickel|metals.sector|construction|defense.metals|tech.metals/.test(id) ||
      /copper|aluminum|steel|iron ore|zinc|tin|nickel|metals|titanium/.test(name) ||
      /copper|aluminum|steel|iron.ore|zinc|tin|nickel|mining.sector/.test(file)) {
    return 'base_metals';
  }

  // Default: try name-based
  console.log(`  [WARN] Could not classify: id="${commodityId}" name="${commodityName}" file="${fileName}" → defaulting to base_metals`);
  return 'base_metals';
}

// ─── Determine direction ─────────────────────────────────────────────────────

function determineDirection(title, fileName, commodityName, category) {
  const t = (title || '').toLowerCase();
  const f = (fileName || '').toLowerCase();

  // ETF comparison posts → bullish (check first before bearish signals)
  if (/etf.*comparison|vs[.\s]|versus|\bvs\b/.test(t) || /-vs-/.test(f)) return 'bullish';

  // Bullish: producer/miner/company focused (check before bearish)
  if (/cameco|newmont|freeport|exxon|albemarle|rio.tinto|nucor|mosaic|deere|hershey|tesla/.test(f)) return 'bullish';

  // ETF-focused posts → bullish
  if (/etf/.test(f) && !/sensitivity/.test(t)) return 'bullish';

  // Bearish: consumer/cost/sensitivity focused titles
  if (/consumer.*staples|passthrough|food.*price.*impact|pay the price/.test(t)) return 'bearish';
  if (/sensitiv/.test(t) && !/comparison|\bvs\b/.test(t)) return 'bearish';

  // Bearish: airline/jet-fuel/transportation-cost/diesel posts
  if (/delta.*air.*jet.fuel|jet.fuel.*airline|airline.*profitability|airline.*fuel/.test(f)) return 'bearish';
  if (/jets-etf/.test(f)) return 'bearish';
  if (/diesel.*transport/.test(f)) return 'bearish';
  if (/transportation.*sector.*fuel/.test(f)) return 'bearish';

  // Bearish: flour/wheat consumer chain, steel-construction-auto (consumer-cost angle)
  if (/wheat.*flour.*consumer|consumer.*staples/.test(f)) return 'bearish';
  if (/steel.*price.*construction.*auto/.test(f)) return 'bearish';
  if (/chemical.*sector.*feedstock/.test(f)) return 'bearish';

  // Bearish: lithium-ev-supply-chain (consumer-cost focused, not miner)
  if (/lithium.*ev.*supply.*chain/.test(f) && !/albemarle|battery.*auto/.test(f)) return 'bearish';

  // Bearish: mining-sector-multi-metal-sensitivity
  if (/mining.*sector.*multi.*metal.*sensitivity/.test(f)) return 'bearish';

  // Bearish: alcoa smelting energy (energy cost focus)
  if (/alcoa.*smelting.*energy/.test(f)) return 'bearish';

  // Bearish: oil-airlines-travel ripple chain (cost impact on travel)
  if (/oil.*airlines.*travel.*ripple/.test(f)) return 'bearish';

  // Bearish: starbucks coffee price sensitivity (consumer/cost focused)
  if (/starbucks.*coffee.*price.*sensitivity/.test(f)) return 'bearish';

  // Sector analysis with "impact" or "losers" → bearish
  if (/sector/.test(f)) {
    if (/impact|losers|cost/.test(t)) return 'bearish';
    return 'bullish';
  }

  // Event/signal posts
  if (/surge|breaks|hits|resurgence|rally/.test(t)) return 'bullish';
  if (/crash|plunge|collapse/.test(t)) return 'bearish';

  // Default
  return 'bullish';
}

// ─── Parse front matter ──────────────────────────────────────────────────────

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { raw: '', body: content, fields: {} };
  const raw = match[1];
  const body = content.slice(match[0].length);

  // Extract commodity_name (handles both quoted and unquoted)
  const nameMatch = raw.match(/commodity_name:\s*['"]?([^'"\n]+)['"]?/);
  const titleMatch = raw.match(/title:\s*['"]?(.*?)['"]?\s*$/m);
  return {
    raw,
    body,
    commodityName: nameMatch ? nameMatch[1].trim() : '',
    title: titleMatch ? titleMatch[1].trim() : ''
  };
}

// ─── Add direction to front matter ───────────────────────────────────────────

function addDirectionToFrontMatter(content, direction) {
  // Insert direction after commodity_name line, or after reading_time, or before ---
  return content.replace(/^(---\n)([\s\S]*?)\n(---)/, (match, open, body, close) => {
    if (body.includes('direction:')) {
      // Replace existing direction value
      const updated = body.replace(/^direction:\s*.+$/m, `direction: ${direction}`);
      return open + updated + '\n' + close;
    }

    // Try to insert after commodity_name line
    const lines = body.split('\n');
    let insertIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^commodity_name:/)) {
        insertIdx = i + 1;
        break;
      }
    }
    if (insertIdx === -1) {
      // Insert after reading_time or at the end
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^reading_time:/)) {
          insertIdx = i + 1;
          break;
        }
      }
    }
    if (insertIdx === -1) insertIdx = lines.length;

    lines.splice(insertIdx, 0, `direction: ${direction}`);
    return open + lines.join('\n') + '\n' + close;
  });
}

// ─── Extract and parse COMMODITY_DATA from script block ──────────────────────

function extractCommodityData(content) {
  // Find the <script> block containing window.COMMODITY_DATA
  const scriptMatch = content.match(/<script>\s*\n\s*window\.COMMODITY_DATA\s*=\s*(\{[\s\S]*?\});\s*\n\s*<\/script>/);
  if (!scriptMatch) return null;

  const fullMatch = scriptMatch[0];
  const dataStr = scriptMatch[1];

  // Parse the JS object - convert it to valid JSON first
  let jsonStr = dataStr
    // Remove trailing commas before } or ]
    .replace(/,\s*([}\]])/g, '$1')
    // Quote unquoted keys (handles keys like id:, label:, etc.)
    .replace(/(\s)(\w+)\s*:/g, '$1"$2":')
    // Fix start of object keys
    .replace(/^\{(\w+)\s*:/gm, '{"$1":')
    // Fix array start keys
    .replace(/\[(\w+)\s*:/g, '["$1":');

  // Better approach: use a more robust JS-to-JSON conversion
  // The data uses JS object notation where keys aren't quoted
  // Let's use eval safely
  let data;
  try {
    // Attempt JSON.parse
    data = JSON.parse(jsonStr);
  } catch (e) {
    // Fall back to Function constructor for JS object literals
    try {
      data = (new Function('return (' + dataStr + ')'))();
    } catch (e2) {
      console.log(`  [ERROR] Could not parse COMMODITY_DATA: ${e2.message}`);
      return null;
    }
  }

  return { data, fullMatch };
}

// ─── Collect all existing node IDs from data ─────────────────────────────────

function collectExistingIds(data) {
  const ids = new Set();
  if (data.commodity && data.commodity.id) ids.add(data.commodity.id);
  for (const level of data.levels) {
    for (const node of level.nodes) {
      ids.add(node.id);
    }
  }
  return ids;
}

// ─── Count total nodes (not counting center) ────────────────────────────────

function countNodes(data) {
  let total = 0;
  for (const level of data.levels) {
    total += level.nodes.length;
  }
  return total;
}

// ─── Get a reference parentId from a level ───────────────────────────────────

function getParentIdFromLevel(data, levelIdx) {
  if (levelIdx < 0 || levelIdx >= data.levels.length) return null;
  const nodes = data.levels[levelIdx].nodes;
  if (nodes.length === 0) return null;
  // Pick a node that looks like a valid parent (prefer "positive"/"producer"/"etf" types)
  const preferred = nodes.find(n => ['positive', 'producer', 'etf', 'processor'].includes(n.type));
  return preferred ? preferred.id : nodes[0].id;
}

// ─── Serialize COMMODITY_DATA back to JS object notation ─────────────────────

function serializeCommodityData(data) {
  const indent = '  ';

  function serializeValue(val) {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'string') return JSON.stringify(val);
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return String(val);
    return JSON.stringify(val);
  }

  function serializeNode(node) {
    const parts = [];
    // Maintain consistent key order
    const keyOrder = ['id', 'label', 'type', 'impact', 'correlation', 'marketCap', 'sector', 'parentId'];
    for (const key of keyOrder) {
      if (node[key] !== undefined) {
        parts.push(`${key}: ${serializeValue(node[key])}`);
      }
    }
    // Any extra keys
    for (const key of Object.keys(node)) {
      if (!keyOrder.includes(key)) {
        parts.push(`${key}: ${serializeValue(node[key])}`);
      }
    }
    return `{ ${parts.join(', ')} }`;
  }

  let out = '{\n';
  // Commodity center
  const c = data.commodity;
  const cParts = [];
  for (const key of Object.keys(c)) {
    cParts.push(`${key}: ${serializeValue(c[key])}`);
  }
  out += `${indent}commodity: { ${cParts.join(', ')} },\n`;

  // Levels
  out += `${indent}levels: [\n`;
  for (let li = 0; li < data.levels.length; li++) {
    const level = data.levels[li];
    out += `${indent}${indent}{ nodes: [\n`;
    for (let ni = 0; ni < level.nodes.length; ni++) {
      const comma = ni < level.nodes.length - 1 ? ',' : '';
      out += `${indent}${indent}${indent}${serializeNode(level.nodes[ni])}${comma}\n`;
    }
    const levelComma = li < data.levels.length - 1 ? ',' : '';
    out += `${indent}${indent}]}${levelComma}\n`;
  }
  out += `${indent}]\n`;
  out += '}';
  return out;
}

// ─── Main processing ─────────────────────────────────────────────────────────

function processFile(filePath) {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Parse front matter
  const fm = parseFrontMatter(content);

  // Extract COMMODITY_DATA
  const extracted = extractCommodityData(content);
  if (!extracted) {
    console.log(`SKIP: ${fileName} (no COMMODITY_DATA found)`);
    return;
  }

  const { data, fullMatch } = extracted;
  const commodityId = data.commodity ? data.commodity.id : '';
  const commodityName = fm.commodityName || '';

  // Classify category
  const category = classifyCategory(commodityId, commodityName, fileName);

  // Determine direction
  const direction = determineDirection(fm.title, fileName, commodityName, category);

  // Count existing nodes
  const existingCount = countNodes(data);
  const existingIds = collectExistingIds(data);

  // Get the node bank for this category
  const bank = NODE_BANKS[category];

  // Ensure at least 4 levels exist
  while (data.levels.length < 4) {
    data.levels.push({ nodes: [] });
  }

  // Determine minimum counts per level: L1≥3, L2≥3, L3≥3, L4≥2
  const minPerLevel = [3, 3, 3, 2];
  const TARGET_MIN = 15;
  const TARGET_MAX = 25;

  let nodesAdded = 0;

  // Only add nodes if below target minimum
  if (existingCount < TARGET_MIN) {
    // For each level, add nodes from the bank if needed
    const levelKeys = ['L1', 'L2', 'L3', 'L4'];

    for (let li = 0; li < 4; li++) {
      const levelKey = levelKeys[li];
      const bankNodes = bank[levelKey] || [];
      const currentCount = data.levels[li].nodes.length;
      const minNeeded = minPerLevel[li];
      const deficit = Math.max(0, minNeeded - currentCount);

      // Also add extras if total is still below target
      const totalNow = countNodes(data);
      const totalDeficit = TARGET_MIN - totalNow;

      const toAdd = Math.max(deficit, Math.min(bankNodes.length, Math.ceil(totalDeficit / (4 - li))));

      for (let bi = 0; bi < bankNodes.length && (countNodes(data) < TARGET_MAX); bi++) {
        const candidate = { ...bankNodes[bi] };

        // Skip if ID already exists
        if (existingIds.has(candidate.id)) continue;

        // If this is L2+ and no parentId, assign one from previous level
        if (li > 0 && !candidate.parentId) {
          const parentId = getParentIdFromLevel(data, li - 1);
          if (parentId) candidate.parentId = parentId;
        }

        // Check if we still need nodes at this level or overall
        if (data.levels[li].nodes.length >= minNeeded && countNodes(data) >= TARGET_MIN) break;

        data.levels[li].nodes.push(candidate);
        existingIds.add(candidate.id);
        nodesAdded++;
      }
    }

    // If still under target, do another pass adding remaining bank nodes
    if (countNodes(data) < TARGET_MIN) {
      const levelKeys = ['L1', 'L2', 'L3', 'L4'];
      for (let li = 0; li < 4 && countNodes(data) < TARGET_MIN; li++) {
        const levelKey = levelKeys[li];
        const bankNodes = bank[levelKey] || [];
        for (let bi = 0; bi < bankNodes.length && countNodes(data) < TARGET_MIN; bi++) {
          const candidate = { ...bankNodes[bi] };
          if (existingIds.has(candidate.id)) continue;

          if (li > 0 && !candidate.parentId) {
            const parentId = getParentIdFromLevel(data, li - 1);
            if (parentId) candidate.parentId = parentId;
          }

          data.levels[li].nodes.push(candidate);
          existingIds.add(candidate.id);
          nodesAdded++;
        }
      }
    }
  }

  const newCount = countNodes(data);

  // Rebuild COMMODITY_DATA string
  const newDataStr = serializeCommodityData(data);
  const newScriptBlock = `<script>\nwindow.COMMODITY_DATA = ${newDataStr};\n</script>`;

  // Replace in content
  content = content.replace(fullMatch, newScriptBlock);

  // Add direction to front matter
  content = addDirectionToFrontMatter(content, direction);

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');

  if (nodesAdded > 0) {
    console.log(`Expanding: ${fileName} (${existingCount} → ${newCount} nodes) [${category}] direction=${direction}`);
  } else {
    console.log(`OK: ${fileName} (${existingCount} nodes, no expansion needed) [${category}] direction=${direction}`);
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} posts in ${POSTS_DIR}\n`);

  let expanded = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const extracted = extractCommodityData(content);
      if (extracted) {
        const before = countNodes(extracted.data);
        processFile(filePath);
        // Re-read to check
        const after = extractCommodityData(fs.readFileSync(filePath, 'utf-8'));
        if (after && countNodes(after.data) > before) expanded++;
        else skipped++;
      } else {
        console.log(`SKIP: ${file} (no COMMODITY_DATA)`);
        skipped++;
      }
    } catch (err) {
      console.log(`ERROR: ${file} - ${err.message}`);
    }
  }

  console.log(`\nDone! Expanded: ${expanded}, Unchanged: ${skipped}, Total: ${files.length}`);
}

main();
