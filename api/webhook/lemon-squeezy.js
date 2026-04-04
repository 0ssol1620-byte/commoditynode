'use strict';

var crypto = require('crypto');
var https = require('https');
var auth = require('../_auth');

/**
 * Verify Lemon Squeezy HMAC-SHA256 signature.
 * Header: X-Signature  (hex digest)
 */
function verifySignature(rawBody, signature) {
  var secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
  if (!secret) return false;
  var expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch (_) {
    return false;
  }
}

/**
 * Collect raw request body as a Buffer.
 */
function rawBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    req.on('data', function (chunk) { chunks.push(chunk); });
    req.on('end', function () { resolve(Buffer.concat(chunks)); });
    req.on('error', reject);
  });
}

/**
 * Make an HTTPS request, returns { statusCode, body }
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
 * Update Clerk user publicMetadata.plan via Clerk API.
 */
async function setClerkUserPlan(userId, plan) {
  var clerkSecret = process.env.CLERK_SECRET_KEY || '';
  if (!clerkSecret) throw new Error('CLERK_SECRET_KEY not configured');

  var payload = JSON.stringify({ public_metadata: { plan } });
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

  if (result.statusCode !== 200) {
    throw new Error('Clerk API error ' + result.statusCode + ': ' + result.body);
  }
  return JSON.parse(result.body);
}

/**
 * Find Clerk user by email, returns userId or null.
 */
async function findClerkUserByEmail(email) {
  var clerkSecret = process.env.CLERK_SECRET_KEY || '';
  var result = await httpsRequest({
    hostname: 'api.clerk.com',
    path: '/v1/users?email_address=' + encodeURIComponent(email),
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + clerkSecret }
  });

  if (result.statusCode !== 200) return null;
  var users = JSON.parse(result.body);
  return users.length > 0 ? users[0].id : null;
}

module.exports = async function handler(req, res) {
  if (auth.handleOptions(req, res)) return;
  auth.setCors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read raw body for signature verification
  var body;
  try {
    body = await rawBody(req);
  } catch (e) {
    return res.status(400).json({ error: 'Failed to read request body' });
  }

  var signature = req.headers['x-signature'] || '';
  if (!verifySignature(body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  var event;
  try {
    event = JSON.parse(body.toString('utf8'));
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  var eventName = event.meta && event.meta.event_name;
  var customData = (event.meta && event.meta.custom_data) || {};
  var attributes = (event.data && event.data.attributes) || {};

  console.log('[webhook/lemon-squeezy] event:', eventName);

  // Resolve clerk user ID
  var clerkUserId = customData.clerk_user_id || null;
  if (!clerkUserId) {
    // Fall back to email lookup
    var email = attributes.user_email || attributes.email || null;
    if (email) {
      try { clerkUserId = await findClerkUserByEmail(email); } catch (_) {}
    }
  }

  if (!clerkUserId) {
    console.warn('[webhook/lemon-squeezy] Could not resolve clerk_user_id for event:', eventName);
    // Still return 200 to prevent Lemon Squeezy retries for non-recoverable cases
    return res.status(200).json({ received: true, warning: 'user not found' });
  }

  try {
    if (eventName === 'subscription_created' || eventName === 'order_created') {
      await setClerkUserPlan(clerkUserId, 'pro');
      console.log('[webhook/lemon-squeezy] Set plan=pro for user:', clerkUserId);
    } else if (eventName === 'subscription_cancelled') {
      await setClerkUserPlan(clerkUserId, 'free');
      console.log('[webhook/lemon-squeezy] Set plan=free for user:', clerkUserId);
    } else if (eventName === 'subscription_updated') {
      // status active → pro, else free
      var status = attributes.status || 'active';
      var plan = (status === 'active' || status === 'on_trial') ? 'pro' : 'free';
      await setClerkUserPlan(clerkUserId, plan);
      console.log('[webhook/lemon-squeezy] Updated plan=' + plan + ' for user:', clerkUserId);
    } else {
      console.log('[webhook/lemon-squeezy] Unhandled event:', eventName);
    }
  } catch (e) {
    console.error('[webhook/lemon-squeezy] Error processing event:', e.message);
    return res.status(500).json({ error: 'Failed to process webhook', detail: e.message });
  }

  return res.status(200).json({ received: true, event: eventName });
};
