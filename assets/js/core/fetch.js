/*! CommodityNode core: cached data fetch helpers.
 * Gives pages a sliced-endpoint friendly API, respects build-stamped versioning,
 * and avoids Date.now()-based cache busting.
 */
(function (global) {
  'use strict';

  var CACHE = new Map();

  function dataVersion() {
    var meta = document.querySelector('meta[name="data-version"]');
    return (meta && meta.content) || (global.DATA_VERSION || '');
  }

  function withVersion(url) {
    var v = dataVersion();
    if (!v) return url;
    return url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=' + encodeURIComponent(v);
  }

  function get(url, options) {
    options = options || {};
    var key = (options.key || url) + (options.variant ? '::' + options.variant : '');
    if (CACHE.has(key)) return CACHE.get(key);
    var target = options.raw ? url : withVersion(url);
    var promise = fetch(target, options.init || {}).then(function (r) {
      if (!r.ok) {
        if (options.optional) return null;
        throw new Error('fetch ' + url + ' -> ' + r.status);
      }
      return r.json();
    }).catch(function (err) {
      if (options.optional) return null;
      throw err;
    });
    CACHE.set(key, promise);
    return promise;
  }

  function invalidate(prefix) {
    if (!prefix) { CACHE.clear(); return; }
    CACHE.forEach(function (_, k) { if (k.indexOf(prefix) === 0) CACHE.delete(k); });
  }

  global.CNFetch = { get: get, invalidate: invalidate, dataVersion: dataVersion };
})(window);
