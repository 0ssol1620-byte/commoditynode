'use strict';

var fs = require('fs');
var path = require('path');
var auth = require('./_auth');

var RATE_LIMIT = 1000; // requests per day (tracked per key in-memory for now)
var rateCounts = {};

function getRateLimit(key) {
  var today = new Date().toISOString().slice(0, 10);
  if (!rateCounts[key] || rateCounts[key].date !== today) {
    rateCounts[key] = { date: today, count: 0 };
  }
  rateCounts[key].count++;
  return {
    limit: RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - rateCounts[key].count),
    used: rateCounts[key].count
  };
}

module.exports = async function handler(req, res) {
  if (auth.handleOptions(req, res)) return;
  auth.setCors(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var apiAuth = auth.validateApiKey(req);
  if (!apiAuth.valid) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required. Pass x-api-key header or ?api_key= query param.'
    });
  }

  var rl = getRateLimit(apiAuth.key);
  res.setHeader('X-RateLimit-Limit', rl.limit);
  res.setHeader('X-RateLimit-Remaining', rl.remaining);
  res.setHeader('X-RateLimit-Used', rl.used);

  if (rl.remaining === 0 && rl.used > rl.limit) {
    return res.status(429).json({ error: 'Rate limit exceeded', reset: 'midnight UTC' });
  }

  var type = req.query.type || 'chart';
  var symbol = req.query.symbol;
  var period = req.query.period || '3M';
  var updated = new Date().toISOString().slice(0, 10);

  // type=prices → prices.json
  if (type === 'prices') {
    var pricesPath = path.join(process.cwd(), 'assets', 'data', 'prices.json');
    try {
      var prices = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
      return res.status(200).json({
        type: 'prices',
        data: prices,
        meta: { source: 'CommodityNode', updated }
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load prices data' });
    }
  }

  // type=forecast → forecast.json
  if (type === 'forecast') {
    var forecastPath = path.join(process.cwd(), 'assets', 'data', 'forecast.json');
    try {
      var forecast = JSON.parse(fs.readFileSync(forecastPath, 'utf8'));
      if (symbol) {
        var item = forecast[symbol] || null;
        if (!item) return res.status(404).json({ error: 'Symbol not found in forecast data' });
        return res.status(200).json({
          symbol,
          type: 'forecast',
          data: item,
          meta: { source: 'CommodityNode', updated }
        });
      }
      return res.status(200).json({
        type: 'forecast',
        data: forecast,
        meta: { source: 'CommodityNode', updated }
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load forecast data' });
    }
  }

  // Default: chart-data.json by symbol and period
  if (!symbol) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'symbol query parameter is required for chart data'
    });
  }

  var chartPath = path.join(process.cwd(), 'assets', 'data', 'chart-data.json');
  try {
    var chartData = JSON.parse(fs.readFileSync(chartPath, 'utf8'));
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load chart data' });
  }

  var entry = chartData[symbol];
  if (!entry) {
    return res.status(404).json({ error: 'Symbol not found', symbol });
  }

  var periodData = entry[period];
  if (!periodData) {
    var available = Object.keys(entry).filter(function (k) { return k !== 'name'; });
    return res.status(404).json({
      error: 'Period not found',
      symbol,
      available
    });
  }

  return res.status(200).json({
    symbol,
    name: entry.name || symbol,
    period,
    candles: periodData.candles || [],
    meta: { source: 'CommodityNode', updated }
  });
};
