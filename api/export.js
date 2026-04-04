'use strict';

var fs = require('fs');
var path = require('path');
var auth = require('./_auth');

function candlesToCsv(candles) {
  var lines = ['date,open,high,low,close,volume'];
  for (var i = 0; i < candles.length; i++) {
    var c = candles[i];
    var date = new Date(c.x).toISOString().slice(0, 10);
    lines.push([date, c.o, c.h, c.l, c.c, c.v !== undefined ? c.v : ''].join(','));
  }
  return lines.join('\n');
}

module.exports = async function handler(req, res) {
  if (auth.handleOptions(req, res)) return;
  auth.setCors(req, res);

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

  var symbol = req.query.symbol;
  var period = req.query.period || '1Y';
  var format = (req.query.format || 'csv').toLowerCase();

  if (!symbol) {
    return res.status(400).json({ error: 'symbol query parameter is required' });
  }

  if (format !== 'csv' && format !== 'json') {
    return res.status(400).json({ error: 'format must be csv or json' });
  }

  var chartPath = path.join(process.cwd(), 'assets', 'data', 'chart-data.json');
  var chartData;
  try {
    chartData = JSON.parse(fs.readFileSync(chartPath, 'utf8'));
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
    return res.status(404).json({ error: 'Period not found', symbol, available });
  }

  var candles = periodData.candles || [];
  var safeName = symbol.replace(/[^a-zA-Z0-9_-]/g, '_');
  var filename = 'commoditynode_' + safeName + '_' + period;

  if (format === 'csv') {
    var csv = candlesToCsv(candles);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '.csv"');
    return res.status(200).send(csv);
  }

  // JSON format
  var payload = {
    symbol,
    name: entry.name || symbol,
    period,
    candles,
    meta: {
      source: 'CommodityNode',
      exported: new Date().toISOString().slice(0, 10),
      fields: 'x(timestamp_ms),o(open),h(high),l(low),c(close),v(volume)'
    }
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '.json"');
  return res.status(200).json(payload);
};
