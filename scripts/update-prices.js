#!/usr/bin/env node
// update-prices.js — Fetch live prices & chart data from Yahoo Finance
// Usage: node scripts/update-prices.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const PRICES_PATH = path.join(__dirname, '..', 'assets', 'data', 'prices.json');
const CHART_PATH  = path.join(__dirname, '..', 'assets', 'data', 'chart-data.json');
const DATA_PRICES_PATH = path.join(__dirname, '..', '_data', 'prices.json');

const SYMBOLS = {
  crude_oil:     { symbol: 'CL=F',  name: 'Crude Oil',          unit: '$/barrel' },
  gold:          { symbol: 'GC=F',  name: 'Gold',               unit: '$/oz' },
  copper:        { symbol: 'HG=F',  name: 'Copper',             unit: '$/lb' },
  natural_gas:   { symbol: 'NG=F',  name: 'Natural Gas',        unit: '$/MMBtu' },
  silver:        { symbol: 'SI=F',  name: 'Silver',             unit: '$/oz' },
  wheat:         { symbol: 'ZW=F',  name: 'Wheat',              unit: 'cents/bushel' },
  corn:          { symbol: 'ZC=F',  name: 'Corn',               unit: 'cents/bushel' },
  coffee:        { symbol: 'KC=F',  name: 'Coffee',             unit: 'cents/lb' },
  palladium:     { symbol: 'PA=F',  name: 'Palladium',          unit: '$/oz' },
  rice:          { symbol: 'ZR=F',  name: 'Rough Rice',         unit: '$/cwt' },
  soybeans:      { symbol: 'ZS=F',  name: 'Soybeans',           unit: 'cents/bushel' },
  sugar:         { symbol: 'SB=F',  name: 'Sugar',              unit: 'cents/lb' },
  cocoa:         { symbol: 'CC=F',  name: 'Cocoa',              unit: '$/tonne' },
  cotton:        { symbol: 'CT=F',  name: 'Cotton',             unit: 'cents/lb' },
  oats:          { symbol: 'ZO=F',  name: 'Oats',               unit: 'cents/bushel' },
  soybean_meal:  { symbol: 'ZM=F',  name: 'Soybean Meal',       unit: '$/ton' },
  soybean_oil:   { symbol: 'ZL=F',  name: 'Soybean Oil',        unit: 'cents/lb' },
  aluminum:      { symbol: 'ALI=F', name: 'Aluminum',           unit: '$/tonne' },
  nickel:        { symbol: 'NIC=F', name: 'Nickel',             unit: '$/tonne' },
  platinum:      { symbol: 'PL=F',  name: 'Platinum',           unit: '$/oz' },
  lumber:        { symbol: 'LBS=F', name: 'Lumber',             unit: '$/1000 bd ft' },
  diesel:        { symbol: 'HO=F',  name: 'Diesel (Heating Oil)', unit: '$/gallon' },
  lean_hogs:     { symbol: 'HE=F',  name: 'Lean Hogs',          unit: 'cents/lb' },
  feeder_cattle: { symbol: 'GF=F',  name: 'Feeder Cattle',      unit: 'cents/lb' },
  live_cattle:   { symbol: 'LE=F',  name: 'Live Cattle',        unit: 'cents/lb' },
  cobalt:        { symbol: 'GLNCY', name: 'Cobalt (Glencore proxy)', unit: '$/share' },
  lithium:       { symbol: 'LTHM',  name: 'Lithium (proxy)',    unit: '$/share' },
  uranium:       { symbol: 'URA',   name: 'Uranium (ETF)',      unit: '$/share' },
  steel:         { symbol: 'SLX',   name: 'Steel (ETF)',        unit: '$/share' },
  iron_ore:      { symbol: 'VALE',  name: 'Iron Ore (VALE proxy)', unit: '$/share' },
  coal:          { symbol: 'BTU',   name: 'Coal (BTU proxy)',   unit: '$/share' },
  hydrogen:      { symbol: 'PLUG',  name: 'Hydrogen (PLUG proxy)', unit: '$/share' },
};

// Period configs: Yahoo range & interval, plus how many candles to keep
const PERIODS = {
  '1M':  { range: '1mo',  interval: '1d'  },
  '3M':  { range: '3mo',  interval: '1d'  },
  '1Y':  { range: '1y',   interval: '1wk' },
  '5Y':  { range: '5y',   interval: '1mo' },
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchSymbol(symbol, range, interval) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
  const json = await fetchJSON(url);
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error('No data');
  return result;
}

async function updatePrices() {
  console.log('=== CommodityNode Price Updater ===\n');

  // Load existing data
  let prices = {};
  let chartData = {};
  try { prices = JSON.parse(fs.readFileSync(PRICES_PATH, 'utf8')); } catch {}
  try { chartData = JSON.parse(fs.readFileSync(CHART_PATH, 'utf8')); } catch {}

  const now = new Date().toISOString();
  let updated = 0, failed = 0;

  for (const [key, info] of Object.entries(SYMBOLS)) {
    const { symbol, name, unit } = info;
    console.log(`  Fetching ${name} (${symbol})...`);

    try {
      // Fetch 1Y data for price info
      const result = await fetchSymbol(symbol, '1y', '1d');
      const meta = result.meta;
      const timestamps = result.timestamp;
      const quote = result.indicators?.quote?.[0];

      if (!timestamps || !quote) throw new Error('Missing quote data');

      // Current price
      const price = meta.regularMarketPrice ?? quote.close[quote.close.length - 1];
      const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? quote.close[quote.close.length - 2];
      const changePct = prevClose ? +((price - prevClose) / prevClose * 100).toFixed(2) : 0;

      // 52-week high/low from the daily data
      const closes = quote.close.filter(v => v != null);
      const highs  = quote.high.filter(v => v != null);
      const lows   = quote.low.filter(v => v != null);
      const high52 = Math.max(...highs);
      const low52  = Math.min(...lows);

      // 이상값 필터: 일간 변동률 ±25% 초과 시 기존값 유지
      const safePct = (Math.abs(changePct) > 25 && prices[key])
        ? prices[key].change_pct
        : changePct;

      prices[key] = {
        symbol, name, unit,
        price: +price.toFixed(2),
        change_pct: safePct,
        high_52w: +high52.toFixed(2),
        low_52w: +low52.toFixed(2),
        updated_at: now,
      };

      // Build chart candles for each period
      chartData[symbol] = { name };

      for (const [period, cfg] of Object.entries(PERIODS)) {
        try {
          const pResult = await fetchSymbol(symbol, cfg.range, cfg.interval);
          const pTs = pResult.timestamp;
          const pQ  = pResult.indicators?.quote?.[0];
          if (!pTs || !pQ) continue;

          const candles = [];
          for (let i = 0; i < pTs.length; i++) {
            if (pQ.open[i] == null || pQ.close[i] == null) continue;
            candles.push({
              x: pTs[i] * 1000,
              o: +pQ.open[i].toFixed(2),
              h: +pQ.high[i].toFixed(2),
              l: +pQ.low[i].toFixed(2),
              c: +pQ.close[i].toFixed(2),
              v: Math.round(pQ.volume?.[i] || 0),
            });
          }
          chartData[symbol][period] = { candles };
        } catch (e) {
          console.log(`    [WARN] Chart ${period}: ${e.message}`);
        }
        await sleep(300);
      }

      updated++;
      console.log(`    OK — $${price.toFixed(2)} (${changePct >= 0 ? '+' : ''}${changePct}%)`);
    } catch (e) {
      failed++;
      console.log(`    [SKIP] ${e.message} — keeping existing data`);
    }

    // Rate limiting
    await sleep(500);
  }

  // Write files
  fs.writeFileSync(PRICES_PATH, JSON.stringify(prices, null, 2) + '\n');
  fs.writeFileSync(CHART_PATH, JSON.stringify(chartData) + '\n');
  fs.writeFileSync(DATA_PRICES_PATH, JSON.stringify(prices, null, 2) + '\n'); // Jekyll _data sync

  console.log(`\nDone: ${updated} updated, ${failed} failed`);
  console.log(`  prices.json: ${Object.keys(prices).length} commodities`);
  console.log(`  chart-data.json: ${Object.keys(chartData).length} symbols`);
}

updatePrices().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
