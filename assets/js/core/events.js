/*! CommodityNode core: analytics event emit helpers.
 * Thin wrapper over the global CNEvents taxonomy so modules can
 * fire events without re-implementing gtag/dataLayer integration.
 */
(function (global) {
  'use strict';
  function send(name, params) {
    if (global.CNEvents && typeof global.CNEvents.send === 'function') {
      return global.CNEvents.send(name, params || {});
    }
    try { if (global.gtag) global.gtag('event', name, params || {}); } catch (_) {}
    try { if (global.dataLayer) global.dataLayer.push(Object.assign({ event: name }, params || {})); } catch (_) {}
  }
  global.CNEmit = send;
})(window);
