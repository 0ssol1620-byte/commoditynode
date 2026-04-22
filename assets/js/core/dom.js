/*! CommodityNode core: small DOM helpers.
 * Shared helpers so pages don't reinvent querySelector wrappers.
 */
(function (global) {
  'use strict';
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(root, type, selector, handler, opts) {
    root.addEventListener(type, function (ev) {
      var el = ev.target.closest(selector);
      if (el && (root === document || root.contains(el))) handler(ev, el);
    }, opts || false);
  }
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }
  global.CNDom = { $: $, $$: $$, on: on, ready: ready };
})(window);
