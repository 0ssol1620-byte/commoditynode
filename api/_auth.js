'use strict';

/**
 * Shared auth/CORS helpers for CommodityNode API functions
 */

function setCors(req, res) {
  // Restrict CORS to known origins (upgrade to Redis-backed allowlist for production)
  var allowedOrigins = [
    'https://commoditynode.com',
    'https://www.commoditynode.com',
    'http://localhost:4000',
    'http://localhost:3000'
  ];
  var origin = req && req.headers && req.headers.origin;
  if (allowedOrigins.indexOf(origin) >= 0) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, Authorization');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(req, res);
    res.status(204).end();
    return true;
  }
  return false;
}

/**
 * Validate enterprise API key from header or query param.
 * Returns { valid, key } — key is the matched key string.
 */
function validateApiKey(req) {
  var key = req.headers['x-api-key'] || req.query.api_key || '';
  if (!key) return { valid: false };

  var raw = process.env.ENTERPRISE_API_KEYS || '';
  var keys = raw.split(',').map(function (k) { return k.trim(); }).filter(Boolean);

  if (keys.length === 0) return { valid: false }; // no keys configured
  if (keys.indexOf(key) >= 0) return { valid: true, key: key };
  return { valid: false };
}

module.exports = { setCors, handleOptions, validateApiKey };
