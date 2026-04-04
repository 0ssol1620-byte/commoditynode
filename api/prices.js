'use strict';

var fs = require('fs');
var path = require('path');
var auth = require('./_auth');

module.exports = async function handler(req, res) {
  if (auth.handleOptions(req, res)) return;
  auth.setCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var dataPath = path.join(process.cwd(), 'assets', 'data', 'prices.json');
  var prices;
  try {
    prices = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load price data' });
  }

  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  var symbol = req.query.symbol;
  if (symbol) {
    // Find by symbol field in each commodity object
    var found = null;
    var keys = Object.keys(prices);
    for (var i = 0; i < keys.length; i++) {
      var item = prices[keys[i]];
      if (item.symbol === symbol || keys[i] === symbol) {
        found = item;
        break;
      }
    }
    if (!found) return res.status(404).json({ error: 'Symbol not found' });
    return res.status(200).json(found);
  }

  return res.status(200).json(prices);
};
