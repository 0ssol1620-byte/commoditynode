'use strict';

var crypto = require('crypto');
var https = require('https');
var auth = require('./_auth');

/**
 * Verify Clerk JWT and return the user payload.
 * Uses Clerk's /v1/tokens/verify endpoint.
 */
function httpsRequest(options, body) {
  return new Promise(function (resolve, reject) {
    var req = https.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () { resolve({ statusCode: res.statusCode, body: data }); });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * Fetch Clerk user object by ID.
 */
async function getClerkUser(userId) {
  var clerkSecret = process.env.CLERK_SECRET_KEY || '';
  var result = await httpsRequest({
    hostname: 'api.clerk.com',
    path: '/v1/users/' + userId,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + clerkSecret }
  });
  if (result.statusCode !== 200) return null;
  return JSON.parse(result.body);
}

/**
 * Verify Clerk session token and return userId.
 * We call /v1/clients/verify with the session JWT.
 */
async function verifyClerkToken(token) {
  var clerkSecret = process.env.CLERK_SECRET_KEY || '';
  // Use Clerk's REST API to get the session info
  var result = await httpsRequest(
    {
      hostname: 'api.clerk.com',
      path: '/v1/sessions/verify',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + clerkSecret,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength('token=' + encodeURIComponent(token))
      }
    },
    'token=' + encodeURIComponent(token)
  );
  if (result.statusCode !== 200) return null;
  var session = JSON.parse(result.body);
  return session.user_id || null;
}

/**
 * Update Clerk user publicMetadata with new API key.
 */
async function saveApiKey(userId, apiKey) {
  var clerkSecret = process.env.CLERK_SECRET_KEY || '';
  var payload = JSON.stringify({ public_metadata: { api_key: apiKey } });
  var result = await httpsRequest(
    {
      hostname: 'api.clerk.com',
      path: '/v1/users/' + userId + '/metadata',
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + clerkSecret,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    },
    payload
  );
  if (result.statusCode !== 200) throw new Error('Clerk API error: ' + result.statusCode);
  return JSON.parse(result.body);
}

function generateApiKey() {
  return 'cn_live_' + crypto.randomBytes(16).toString('hex');
}

function maskKey(key) {
  if (!key || key.length < 12) return '***';
  return key.slice(0, 10) + '...' + key.slice(-4);
}

module.exports = async function handler(req, res) {
  if (auth.handleOptions(req, res)) return;
  auth.setCors(res);

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract Bearer token from Authorization header
  var authHeader = req.headers['authorization'] || '';
  var token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authorization: Bearer <clerk_token> required' });
  }

  // Verify token with Clerk
  var userId;
  try {
    userId = await verifyClerkToken(token);
  } catch (e) {
    return res.status(401).json({ error: 'Token verification failed', detail: e.message });
  }
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Fetch user to check plan
  var user;
  try {
    user = await getClerkUser(userId);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  var plan = (user.public_metadata && user.public_metadata.plan) || 'free';
  if (plan !== 'enterprise') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'API key management requires an Enterprise plan'
    });
  }

  var existingKey = (user.public_metadata && user.public_metadata.api_key) || null;

  // GET → return current key (masked)
  if (req.method === 'GET') {
    return res.status(200).json({
      has_key: !!existingKey,
      key_preview: existingKey ? maskKey(existingKey) : null,
      plan
    });
  }

  // POST → generate new key
  var newKey = generateApiKey();
  try {
    await saveApiKey(userId, newKey);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save API key', detail: e.message });
  }

  return res.status(200).json({
    key: newKey,
    message: 'New API key generated. Store it securely — it will not be shown again in full.',
    plan
  });
};
