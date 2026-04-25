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

/**
 * Verify a Clerk session JWT from the Authorization header.
 *
 * Returns { userId, sub, ... } on success, throws on failure.
 *
 * We call Clerk's /v1/sessions/<id>/verify endpoint for hard server-side
 * verification. This is the trust boundary that gates Pro/Enterprise
 * entitlement — localStorage and publicMetadata on the frontend are
 * considered UI hints only. (blueprint §10.2.4)
 */
var https = require('https');

function httpsJson(options, body) {
  return new Promise(function (resolve, reject) {
    var req = https.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try { resolve({ statusCode: res.statusCode, body: data ? JSON.parse(data) : null }); }
        catch (_) { resolve({ statusCode: res.statusCode, body: null }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function extractBearer(req) {
  var header = (req && req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  if (header.indexOf('Bearer ') !== 0) return '';
  return header.slice('Bearer '.length).trim();
}

async function verifyRequest(req) {
  var token = extractBearer(req);
  if (!token) throw new Error('No bearer token');

  var clerkSecret = process.env.CLERK_SECRET_KEY || '';
  if (!clerkSecret) throw new Error('CLERK_SECRET_KEY not configured');

  var parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  var payload;
  try {
    var json = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    payload = JSON.parse(json);
  } catch (_) {
    throw new Error('Cannot decode token payload');
  }
  if (!payload || !payload.sub) throw new Error('Missing sub claim');

  var sessionId = payload.sid || payload.session_id || null;
  if (!sessionId) {
    throw new Error('Missing Clerk session claim');
  }

  var verify = await httpsJson({
    hostname: 'api.clerk.com',
    path: '/v1/sessions/' + encodeURIComponent(sessionId) + '/verify',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + clerkSecret,
      'Content-Type': 'application/json',
      'Content-Length': 2
    }
  }, '{}');
  if (verify.statusCode !== 200) throw new Error('Session verify failed');
  var verified = verify.body || {};
  if (verified.user_id && verified.user_id !== payload.sub) {
    throw new Error('Session user mismatch');
  }
  return { userId: payload.sub, sub: payload.sub, session_id: sessionId, payload: payload, clerk_session: verified };
}

module.exports = { setCors, handleOptions, validateApiKey, verifyRequest };
