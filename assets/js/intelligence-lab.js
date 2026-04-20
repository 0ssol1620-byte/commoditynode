(function(){
  'use strict';

  var state = {
    selected: 'crude_oil',
    prices: {},
    consensus: {},
    curated: {},
    charts: {}
  };

  function $(id){ return document.getElementById(id); }
  function fmtPct(v){
    if (v == null || Number.isNaN(Number(v))) return '—';
    var n = Number(v);
    return (n > 0 ? '+' : '') + n.toFixed(1) + '%';
  }
  function fmtPrice(value, unit){
    if (value == null || Number.isNaN(Number(value))) return '—';
    var n = Number(value);
    var u = String(unit || '').toLowerCase();
    if (u.indexOf('cents') !== -1) return n.toFixed(1) + '¢';
    if (u.indexOf('$/') !== -1 || u.indexOf('$') !== -1) {
      if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
      return '$' + n.toFixed(n < 10 ? 3 : 2);
    }
    return n.toFixed(2);
  }
  function titleize(value){
    return String(value || '').replace(/_/g, ' ').replace(/\b\w/g, function(m){ return m.toUpperCase(); });
  }
  function safeArray(value){ return Array.isArray(value) ? value : []; }

  function getCommodityBundle(key){
    return {
      price: state.prices[key] || {},
      forecast: state.consensus[key] || {},
      curated: state.curated[key] || {}
    };
  }

  function getAgreement(bundle){
    var agreement = (bundle.forecast && bundle.forecast.agreement) || {};
    return {
      level: agreement.level || 'moderate',
      score: Number(agreement.score || 0.55),
      gap30: Number(agreement.median_gap_day_30_pct || 0),
      gap90: Number(agreement.median_gap_day_90_pct || 0)
    };
  }

  function getConsensus(bundle){
    return (bundle.forecast && bundle.forecast.consensus) || {};
  }

  function getLiveChange(bundle){
    var priceChange = bundle.price.change_pct;
    if (priceChange != null && !Number.isNaN(Number(priceChange))) return Number(priceChange);
    return null;
  }

  function getSetupChange(bundle){
    var consensus = getConsensus(bundle);
    return Number(consensus.forecast_30d && consensus.current_price ? ((consensus.forecast_30d - consensus.current_price) / consensus.current_price) * 100 : 0);
  }

  function getPrimaryChange(bundle){
    var liveChange = getLiveChange(bundle);
    return liveChange != null ? liveChange : getSetupChange(bundle);
  }

  function getDirection(bundle){
    var consensus = getConsensus(bundle);
    var change = getPrimaryChange(bundle);
    return consensus.direction || (change >= 0 ? 'bullish' : 'bearish');
  }

  function computeEventProbabilities(bundle){
    var change = Math.abs(getPrimaryChange(bundle));
    var agreement = getAgreement(bundle);
    return safeArray(bundle.curated.event_probabilities).map(function(item){
      var adjusted = item.base_probability + Math.min(change / 100, 0.12) + (agreement.score - 0.5) * 0.15;
      adjusted = Math.max(0.08, Math.min(0.74, adjusted));
      return Object.assign({}, item, { probability: adjusted });
    }).sort(function(a,b){ return b.probability - a.probability; });
  }

  function computeRegime(bundle){
    var change = getPrimaryChange(bundle);
    var agreement = getAgreement(bundle);
    var direction = getDirection(bundle);
    var absChange = Math.abs(change);
    var regime = 'Balanced';
    var signal = 'Wait for confirmation';
    if (direction === 'bullish' && agreement.score >= 0.65 && absChange >= 2) {
      regime = 'Trend Extension';
      signal = 'Models and tape are aligned enough to prioritize continuation screens.';
    } else if (direction === 'bearish' && agreement.score >= 0.65 && absChange >= 2) {
      regime = 'De-risk / Downtrend';
      signal = 'Prioritize downside beneficiaries, hedges, and capital preservation.';
    } else if (agreement.score < 0.55 && absChange >= 2) {
      regime = 'Narrative Conflict';
      signal = 'The tape is moving faster than model agreement. Size smaller and rely on scenario work.';
    } else if (absChange < 1.5 && agreement.score < 0.55) {
      regime = 'Compression';
      signal = 'Little directional edge. Watch for anomaly or catalyst breakout.';
    }
    return { regime: regime, signal: signal, volatility: absChange >= 4 ? 'High' : absChange >= 2 ? 'Medium' : 'Low' };
  }

  function computeAnomaly(bundle){
    var change = getPrimaryChange(bundle);
    var consensus = getConsensus(bundle);
    var agreement = getAgreement(bundle);
    var anomaly = Math.min(99, Math.round(Math.abs(change) * 7 + (1 - agreement.score) * 35 + (agreement.gap30 || 0) * 1.7));
    var mismatch = (change < 0 && consensus.direction === 'bullish') || (change > 0 && consensus.direction === 'bearish');
    return {
      score: anomaly,
      label: anomaly >= 70 ? 'High anomaly' : anomaly >= 45 ? 'Moderate anomaly' : 'Routine move',
      summary: mismatch ? 'Spot move and model direction are misaligned. Treat this as a review trigger, not a blind trend signal.' : 'Tape and model direction are not heavily conflicted. Focus more on exposure ranking than anomaly response.'
    };
  }

  function ensureChart(id, config){
    var canvas = $(id);
    if (!canvas || typeof Chart !== 'function') return null;
    if (state.charts[id]) {
      state.charts[id].destroy();
    }
    state.charts[id] = new Chart(canvas.getContext('2d'), config);
    return state.charts[id];
  }

  function renderHero(bundle){
    var price = bundle.price;
    var consensus = getConsensus(bundle);
    var agreement = getAgreement(bundle);
    var liveChange = getLiveChange(bundle);
    $("lab-selected-name").textContent = price.name || titleize(state.selected);
    $("lab-selected-price").textContent = fmtPrice(price.price || consensus.current_price, price.unit || consensus.unit);
    $("lab-selected-change").textContent = liveChange == null ? 'Unavailable' : fmtPct(liveChange);
    $("lab-selected-change").className = 'lab-hero-change ' + (liveChange == null ? '' : (liveChange >= 0 ? 'up' : 'down'));
    $("lab-selected-30d").textContent = fmtPrice(consensus.forecast_30d, price.unit || consensus.unit);
    $("lab-selected-90d").textContent = fmtPrice(consensus.forecast_90d, price.unit || consensus.unit);
    $("lab-selected-agreement").textContent = agreement.level + ' · ' + Math.round(agreement.score * 100) + '%';
    $("lab-selected-cluster").textContent = bundle.curated.cluster || 'Commodity intelligence';
  }

  function renderEventStudio(bundle){
    var events = computeEventProbabilities(bundle);
    $("event-probability-list").innerHTML = events.map(function(item){
      return '<div class="lab-row-card">'
        + '<div><div class="lab-row-title">' + item.label + '</div><div class="lab-row-sub">Bull case: ' + item.bull_case + '</div><div class="lab-row-sub">Risk if wrong: ' + item.bear_case + '</div></div>'
        + '<div class="lab-row-metric">' + Math.round(item.probability * 100) + '%</div>'
        + '</div>';
    }).join('');
    ensureChart('event-probability-chart', {
      type: 'bar',
      data: {
        labels: events.map(function(item){ return item.label; }),
        datasets: [{
          label: 'Probability',
          data: events.map(function(item){ return Math.round(item.probability * 100); }),
          backgroundColor: 'rgba(34,211,238,0.6)',
          borderColor: '#22d3ee',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          x: { ticks: { color: '#cbd5e1', maxRotation: 0, minRotation: 0 }, grid: { display: false } }
        }
      }
    });
  }

  function renderRippleRanker(bundle){
    var items = safeArray(bundle.curated.ripple_ranker);
    $("ripple-ranker-list").innerHTML = items.map(function(item, idx){
      return '<div class="lab-rank-item"><span class="lab-rank-num">' + (idx + 1) + '</span><div><div class="lab-row-title">' + item.name + '</div><div class="lab-row-sub">' + item.reason + '</div></div><div class="lab-row-metric">' + item.score + '</div></div>';
    }).join('');
  }

  function renderExposureScreener(bundle){
    var profile = window.CNProfile && window.CNProfile.get ? window.CNProfile.get() : { watchlist: [] };
    var saved = safeArray(profile.watchlist).map(function(v){ return String(v).toLowerCase(); });
    var items = safeArray(bundle.curated.ripple_ranker);
    var matches = items.filter(function(item){ return saved.indexOf(String(item.name).toLowerCase()) !== -1; });
    var useItems = matches.length ? matches : items.slice(0, 3);
    $("exposure-screener-copy").textContent = matches.length ? 'Saved watchlist overlap found. These are the names already colliding with the current commodity state.' : 'No saved watchlist overlap yet. Use the top exposed names below as the first-pass screen.';
    $("exposure-screener-list").innerHTML = useItems.map(function(item){
      return '<div class="lab-mini-card"><div class="lab-row-title">' + item.name + '</div><div class="lab-row-sub">' + item.reason + '</div><div class="lab-chip">' + item.type + '</div></div>';
    }).join('');
  }

  function renderStressTest(bundle){
    var items = safeArray(bundle.curated.ripple_ranker).slice(0, 4);
    var change = getPrimaryChange(bundle);
    var rows = items.map(function(item, idx){
      var weight = [0.32, 0.28, 0.22, 0.18][idx] || 0.15;
      var pnl = (item.score / 100) * weight * change;
      return Object.assign({}, item, { weight: weight, pnl: pnl });
    });
    $("stress-test-list").innerHTML = rows.map(function(row){
      return '<div class="lab-row-card"><div><div class="lab-row-title">' + row.name + '</div><div class="lab-row-sub">Weight ' + Math.round(row.weight * 100) + '% · sensitivity score ' + row.score + '</div></div><div class="lab-row-metric ' + (row.pnl >= 0 ? 'up' : 'down') + '">' + fmtPct(row.pnl) + '</div></div>';
    }).join('');
  }

  function renderHedgeOptimizer(bundle){
    var agreement = getAgreement(bundle);
    var items = safeArray(bundle.curated.hedges).map(function(item, idx){
      return Object.assign({}, item, { coverage: Math.max(52, Math.min(92, Math.round(agreement.score * 100 + 12 - idx * 6))) });
    });
    $("hedge-optimizer-list").innerHTML = items.map(function(item){
      return '<div class="lab-row-card"><div><div class="lab-row-title">' + item.name + '</div><div class="lab-row-sub">' + item.fit + '</div></div><div class="lab-row-metric">' + item.coverage + '/100</div></div>';
    }).join('');
  }

  function renderExplainability(bundle){
    var forecast = bundle.forecast || {};
    var consensus = getConsensus(bundle);
    var chronos = forecast.models && forecast.models.chronos2 ? forecast.models.chronos2 : {};
    var timesfm = forecast.models && forecast.models.timesfm ? forecast.models.timesfm : {};
    var agreement = getAgreement(bundle);
    $("explainability-copy").innerHTML = 'Agreement score <strong>' + Math.round(agreement.score * 100) + '%</strong>. Day-30 model gap <strong>' + agreement.gap30.toFixed(1) + '%</strong>. Use this to decide whether the forecast is decision-grade or only narrative-grade.';
    var labels = safeArray(consensus.dates).slice(0, 20).map(function(d){ return d.slice(5); });
    ensureChart('forecast-explainability-chart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Consensus', data: safeArray(consensus.median).slice(0, 20), borderColor: '#5eead4', backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 2, tension: 0.25 },
          { label: 'Chronos-2', data: safeArray(chronos.median).slice(0, 20), borderColor: '#c084fc', borderDash: [5,4], borderWidth: 2, tension: 0.25 },
          { label: 'TimesFM 2.5', data: safeArray(timesfm.median).slice(0, 20), borderColor: '#fbbf24', borderDash: [4,4], borderWidth: 2, tension: 0.25 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#cbd5e1' } } },
        scales: {
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
      }
    });
  }

  function renderRegime(bundle){
    var regime = computeRegime(bundle);
    $("regime-detector-badge").textContent = regime.regime;
    $("regime-detector-vol").textContent = regime.volatility;
    $("regime-detector-copy").textContent = regime.signal;
  }

  function renderAnomaly(bundle){
    var anomaly = computeAnomaly(bundle);
    $("anomaly-monitor-score").textContent = anomaly.score;
    $("anomaly-monitor-label").textContent = anomaly.label;
    $("anomaly-monitor-copy").textContent = anomaly.summary;
  }

  function renderEventStudies(bundle){
    $("event-study-list").innerHTML = safeArray(bundle.curated.event_studies).map(function(item){
      return '<div class="lab-mini-card"><div class="lab-row-title">' + item.event + '</div><div class="lab-row-sub">Window ' + item.window + '</div><p class="lab-card-copy">' + item.pattern + '</p></div>';
    }).join('');
  }

  function renderPolicyLab(bundle){
    var regime = computeRegime(bundle);
    var agreement = getAgreement(bundle);
    var items = safeArray(bundle.curated.policy_actions);
    var chosen = items[0] || { state: 'Default', action: 'Keep risk small until a stronger state emerges.' };
    if (agreement.score < 0.55 && items[1]) chosen = items[1];
    if (regime.volatility === 'High' && items[2]) chosen = items[2];
    $("policy-lab-recommendation").innerHTML = '<strong>' + chosen.state + '</strong><br>' + chosen.action;
    $("policy-lab-grid").innerHTML = items.map(function(item){
      var active = item.state === chosen.state ? ' active' : '';
      return '<div class="lab-policy-card' + active + '"><div class="lab-row-title">' + item.state + '</div><div class="lab-row-sub">' + item.action + '</div></div>';
    }).join('');
  }

  function getRecommendedProducts(profile) {
    profile = profile || (window.CNProfile && window.CNProfile.get ? window.CNProfile.get() : { role: '', watchlist: [], commodities: [] });
    var role = String(profile.role || '').toLowerCase();
    var map = {
      investor: [
        { title: 'Ripple Ranker', href: '/intelligence-lab/ripple-ranker/', why: 'Best if you want stock and sector names first.' },
        { title: 'Portfolio Stress Test', href: '/intelligence-lab/portfolio-stress-test/', why: 'Useful when a commodity move can change what you do with actual positions.' },
        { title: 'Forecast Explainability Studio', href: '/intelligence-lab/forecast-explainability-studio/', why: 'Good for deciding whether the model deserves trust before you size risk.' }
      ],
      analyst: [
        { title: 'Event Probability Studio', href: '/intelligence-lab/event-probability-studio/', why: 'Best for catalyst prep and scenario framing before writing the note.' },
        { title: 'Ripple Ranker', href: '/intelligence-lab/ripple-ranker/', why: 'Turns commodity tape into named downstream impact quickly.' },
        { title: 'Event Study Library', href: '/intelligence-lab/event-study-library/', why: 'Lets you anchor research in historical analogs.' }
      ],
      operator: [
        { title: 'Exposure Screener', href: '/intelligence-lab/exposure-screener/', why: 'Best for supplier, budget, and watchlist overlap workflows.' },
        { title: 'Hedge Optimizer', href: '/intelligence-lab/hedge-optimizer/', why: 'Useful when you need a cleaner risk-mitigation path than headline guesswork.' },
        { title: 'Regime Shift Detector', href: '/intelligence-lab/regime-shift-detector/', why: 'Helps you decide whether the move is noise, trend, or a real state change.' }
      ]
    };
    var fallback = [
      { title: 'Event Probability Studio', href: '/intelligence-lab/event-probability-studio/', why: 'The cleanest entry point if you are still learning the product stack.' },
      { title: 'Ripple Ranker', href: '/intelligence-lab/ripple-ranker/', why: 'A fast answer to which names and sectors actually matter.' },
      { title: 'RL Policy Lab', href: '/intelligence-lab/rl-policy-lab/', why: 'The premium trust-first view for users who want policy support, not hype.' }
    ];
    var list = map[role] || fallback;
    if ((profile.watchlist || []).length && list.every(function(item){ return item.title !== 'Exposure Screener'; })) {
      list = [{ title: 'Exposure Screener', href: '/intelligence-lab/exposure-screener/', why: 'You already saved a watchlist, so this product becomes immediately more valuable.' }].concat(list).slice(0, 3);
    }
    return list;
  }

  function renderRecommendations() {
    var grid = $('lab-recommendation-grid');
    var copy = $('lab-recommendation-copy');
    if (!grid) return;
    var profile = window.CNProfile && window.CNProfile.get ? window.CNProfile.get() : { role: '', watchlist: [], commodities: [] };
    var recs = getRecommendedProducts(profile);
    if (copy) {
      copy.textContent = profile.role ? 'Based on your saved role and workflow, these are the strongest next Intelligence Lab products to open.' : 'Save your role and watchlist so CommodityNode can push you into the most relevant Intelligence Lab products first.';
    }
    grid.innerHTML = recs.map(function(item, idx){
      return '<a class="lab-rec-card" href="' + item.href + '" data-cta="lab_recommended_product_' + (idx + 1) + '" style="text-decoration:none;">'
        + '<div class="lab-card-kicker">Recommended product</div>'
        + '<div class="lab-row-title">' + item.title + '</div>'
        + '<div class="lab-row-sub">' + item.why + '</div>'
        + '</a>';
    }).join('');
  }

  function renderAll(){
    var bundle = getCommodityBundle(state.selected);
    renderHero(bundle);
    renderEventStudio(bundle);
    renderRippleRanker(bundle);
    renderExposureScreener(bundle);
    renderStressTest(bundle);
    renderHedgeOptimizer(bundle);
    renderExplainability(bundle);
    renderRegime(bundle);
    renderAnomaly(bundle);
    renderEventStudies(bundle);
    renderPolicyLab(bundle);
    renderRecommendations();
  }

  function fillSelector(){
    var select = $('intelligence-lab-selector');
    if (!select) return;
    var keys = Object.keys(state.curated).filter(function(key){ return state.prices[key] || state.consensus[key]; });
    select.innerHTML = keys.map(function(key){
      return '<option value="' + key + '">' + titleize(key) + '</option>';
    }).join('');
    if (keys.indexOf(state.selected) === -1 && keys.length) state.selected = keys[0];
    select.value = state.selected;
    select.addEventListener('change', function(){
      state.selected = this.value;
      if (window.CNTrack) window.CNTrack('intelligence_lab_select_commodity', { commodity: state.selected });
      renderAll();
    });
  }

  function initTabs(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-lab-anchor]'), function(btn){
      btn.addEventListener('click', function(){
        var anchor = btn.getAttribute('data-lab-anchor');
        if (window.CNTrack) window.CNTrack('intelligence_lab_jump_module', { module: anchor });
        var target = document.getElementById(anchor);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    document.addEventListener('click', function(event){
      var link = event.target.closest('a[href*="/intelligence-lab/"]');
      if (!link) return;
      if (window.CNTrack) window.CNTrack('intelligence_lab_open_product_page', { href: link.getAttribute('href') || '' });
    });
  }

  function fetchJson(url){
    return fetch(url).then(function(r){
      if (!r.ok) throw new Error('Failed to load ' + url + ' (' + r.status + ')');
      return r.json();
    });
  }

  function init(){
    Promise.allSettled([
      fetchJson('/assets/data/prices.json'),
      fetchJson('/assets/data/forecast-consensus.json'),
      fetchJson('/assets/data/intelligence-lab.json')
    ]).then(function(results){
      var priceResult = results[0];
      var consensusResult = results[1];
      var curatedResult = results[2];
      state.prices = priceResult.status === 'fulfilled' ? (priceResult.value || {}) : {};
      state.consensus = consensusResult.status === 'fulfilled' ? (consensusResult.value || {}) : {};
      state.curated = curatedResult.status === 'fulfilled' ? (curatedResult.value || {}) : {};
      if (!Object.keys(state.curated).length) {
        var shell = $('intelligence-lab-shell');
        if (shell) shell.innerHTML = '<div class="lab-error">Intelligence Lab metadata failed to load. Please retry. ' + (curatedResult.reason && curatedResult.reason.message ? curatedResult.reason.message : '') + '</div>';
        return;
      }
      fillSelector();
      initTabs();
      renderAll();
      if (priceResult.status !== 'fulfilled' || consensusResult.status !== 'fulfilled') {
        var callout = document.querySelector('.lab-callout');
        if (callout) {
          callout.insertAdjacentHTML('beforeend', '<p style="margin-top:12px;color:#fbbf24;line-height:1.7;">Some live datasets are temporarily unavailable, so a few modules are running in fallback mode.</p>');
        }
      }
    }).catch(function(err){
      var shell = $('intelligence-lab-shell');
      if (shell) shell.innerHTML = '<div class="lab-error">Intelligence Lab failed to initialize. Please retry. ' + (err && err.message ? err.message : '') + '</div>';
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
