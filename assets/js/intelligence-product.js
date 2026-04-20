(function(){
  'use strict';

  var configEl = document.getElementById('intel-product-config');
  if (!configEl) return;

  var config = {};
  try {
    config = JSON.parse(configEl.textContent || '{}');
  } catch (err) {
    console.error('Failed to parse intelligence product config', err);
    return;
  }

  var state = {
    selected: config.defaultCommodity || 'crude_oil',
    prices: {},
    consensus: {},
    curated: {},
    rlArtifacts: {},
    chart: null
  };

  var STORAGE_KEYS = {
    workspaces: 'CN_INTEL_LAB_WORKSPACES',
    alerts: 'CN_INTEL_LAB_ALERTS'
  };

  function $(id){ return document.getElementById(id); }
  function safeArray(value){ return Array.isArray(value) ? value : []; }
  function titleize(value){ return String(value || '').replace(/_/g, ' ').replace(/\b\w/g, function(m){ return m.toUpperCase(); }); }
  function clamp(value, min, max){ return Math.max(min, Math.min(max, value)); }
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
  function formatRelative(ts){
    if (!ts) return 'Not saved yet';
    var delta = Date.now() - Number(ts);
    if (!Number.isFinite(delta) || delta < 0) return 'Just now';
    var minutes = Math.round(delta / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return minutes + 'm ago';
    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.round(hours / 24);
    return days + 'd ago';
  }

  function getProfile(){
    return window.CNProfile && window.CNProfile.get ? window.CNProfile.get() : { role: '', commodities: [], watchlist: [], events: [] };
  }

  function getBundle(key){
    return {
      price: state.prices[key] || {},
      forecast: state.consensus[key] || {},
      curated: state.curated[key] || {},
      rl: state.rlArtifacts || {}
    };
  }

  function getConsensus(bundle){
    return (bundle.forecast && bundle.forecast.consensus) || {};
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

  function getLiveChange(bundle){
    var priceChange = bundle.price.change_pct;
    if (priceChange != null && !Number.isNaN(Number(priceChange))) return Number(priceChange);
    return null;
  }

  function getSetupChange(bundle){
    var consensus = getConsensus(bundle);
    if (!consensus.current_price || !consensus.forecast_30d) return 0;
    return ((consensus.forecast_30d - consensus.current_price) / consensus.current_price) * 100;
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
    return safeArray(bundle.curated.event_probabilities).map(function(item, idx){
      var adjusted = Number(item.base_probability || 0.18) + Math.min(change / 100, 0.12) + (agreement.score - 0.5) * 0.15 - idx * 0.01;
      adjusted = clamp(adjusted, 0.08, 0.82);
      return Object.assign({}, item, { probability: adjusted });
    }).sort(function(a, b){ return b.probability - a.probability; });
  }

  function computeRegime(bundle){
    var change = getPrimaryChange(bundle);
    var agreement = getAgreement(bundle);
    var direction = getDirection(bundle);
    var absChange = Math.abs(change);
    var regime = 'Balanced';
    var signal = 'Wait for confirmation before increasing conviction.';
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
    return {
      regime: regime,
      signal: signal,
      volatility: absChange >= 4 ? 'High' : absChange >= 2 ? 'Medium' : 'Low',
      absChange: absChange
    };
  }

  function computeAnomaly(bundle){
    var change = getPrimaryChange(bundle);
    var consensus = getConsensus(bundle);
    var agreement = getAgreement(bundle);
    var anomaly = clamp(Math.round(Math.abs(change) * 7 + (1 - agreement.score) * 35 + (agreement.gap30 || 0) * 1.7), 8, 99);
    var mismatch = (change < 0 && consensus.direction === 'bullish') || (change > 0 && consensus.direction === 'bearish');
    return {
      score: anomaly,
      label: anomaly >= 70 ? 'High anomaly' : anomaly >= 45 ? 'Moderate anomaly' : 'Routine move',
      summary: mismatch ? 'Spot move and model direction are misaligned. Treat this as a review trigger, not a blind trend signal.' : 'Tape and model direction are not heavily conflicted. Focus more on exposure ranking than anomaly response.'
    };
  }

  function buildStressRows(bundle){
    var items = safeArray(bundle.curated.ripple_ranker).slice(0, 4);
    var change = getPrimaryChange(bundle);
    return items.map(function(item, idx){
      var weight = [0.32, 0.28, 0.22, 0.18][idx] || 0.15;
      var sensitivity = item.score / 100;
      return {
        name: item.name,
        base: sensitivity * weight * change,
        downside: sensitivity * weight * (change - 4),
        upside: sensitivity * weight * (change + 4)
      };
    });
  }

  function buildHedgeScores(bundle){
    var agreement = getAgreement(bundle);
    return safeArray(bundle.curated.hedges).map(function(item, idx){
      return Object.assign({}, item, {
        coverage: clamp(Math.round(agreement.score * 100 + 14 - idx * 8), 40, 95)
      });
    });
  }

  function buildPolicyScores(bundle){
    var agreement = getAgreement(bundle);
    var regime = computeRegime(bundle);
    return safeArray(bundle.curated.policy_actions).map(function(item, idx){
      var score = clamp(Math.round(agreement.score * 100 + (regime.absChange * 4) - idx * 8), 38, 96);
      return Object.assign({}, item, { score: score });
    });
  }

  function readStore(key){
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (err) {
      return {};
    }
  }

  function writeStore(key, value){
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('Failed to persist intelligence product state', err);
      return false;
    }
  }

  function scopedKey(commodity){
    return config.slug + '::' + String(commodity || state.selected || config.defaultCommodity || 'default');
  }

  function getScopedEntry(storeKey, commodity){
    return readStore(storeKey)[scopedKey(commodity)] || null;
  }

  function getLatestScopedEntry(storeKey){
    var prefix = config.slug + '::';
    var store = readStore(storeKey);
    var latest = null;
    Object.keys(store).forEach(function(key){
      if (key.indexOf(prefix) !== 0) return;
      var value = store[key];
      if (!latest || Number(value.savedAt || value.updatedAt || 0) > Number(latest.savedAt || latest.updatedAt || 0)) {
        latest = value;
      }
    });
    return latest;
  }

  function saveScopedEntry(storeKey, commodity, payload){
    var store = readStore(storeKey);
    store[scopedKey(commodity)] = payload;
    return writeStore(storeKey, store);
  }

  function getWorkspace(commodity){
    return getScopedEntry(STORAGE_KEYS.workspaces, commodity);
  }

  function getAlert(commodity){
    return getScopedEntry(STORAGE_KEYS.alerts, commodity);
  }

  function getLatestWorkspace(){
    return getLatestScopedEntry(STORAGE_KEYS.workspaces);
  }

  function getLatestAlert(){
    return getLatestScopedEntry(STORAGE_KEYS.alerts);
  }

  function setWorkspace(workspace){
    return saveScopedEntry(STORAGE_KEYS.workspaces, workspace && workspace.commodity, workspace);
  }

  function setAlert(alert){
    return saveScopedEntry(STORAGE_KEYS.alerts, alert && alert.commodity, alert);
  }

  function ensureChart(configObj){
    var canvas = $('intel-demo-chart');
    if (!canvas || typeof Chart !== 'function') return;
    if (state.chart) state.chart.destroy();
    state.chart = new Chart(canvas.getContext('2d'), configObj);
  }

  function metricPayload(bundle, profile){
    var agreement = getAgreement(bundle);
    var anomaly = computeAnomaly(bundle);
    var events = computeEventProbabilities(bundle);
    var overlaps = safeArray(bundle.curated.ripple_ranker).filter(function(item){
      return safeArray(profile.watchlist).map(function(v){ return String(v).toLowerCase(); }).indexOf(String(item.name).toLowerCase()) !== -1;
    });
    var alert = getAlert(state.selected);
    var workspace = getWorkspace(state.selected);
    var bestEvent = events[0];
    var roleText = profile.role ? titleize(profile.role) : 'No role';
    var commodityCount = safeArray(profile.commodities).length;
    var watchlistCount = safeArray(profile.watchlist).length;
    var eventCount = safeArray(profile.events).length;
    var primary = { value: Math.round(agreement.score * 100) + '%', copy: 'Model agreement is ' + agreement.level + ' for the current setup.' };
    var secondary = { value: overlaps.length ? overlaps.length + 'x' : '0x', copy: overlaps.length ? 'Saved watchlist names are already colliding with this setup.' : 'No direct watchlist overlap saved yet.' };
    var tertiary = { value: alert && alert.enabled ? 'Live' : 'Standby', copy: alert && alert.enabled ? config.alertLabel + ' is enabled for ' + titleize(state.selected) + '.' : 'Alerting is not enabled for this module yet.' };

    switch (config.demoKind) {
      case 'event-probability':
        primary = { value: bestEvent ? Math.round(bestEvent.probability * 100) + '%' : '—', copy: bestEvent ? 'Top catalyst: ' + bestEvent.label + '.' : 'No catalyst data loaded.' };
        secondary = { value: eventCount + ' saved', copy: eventCount ? 'You already have event playbooks saved inside CommodityNode.' : 'Save an event workflow to turn this module into a daily prep surface.' };
        tertiary = { value: alert && alert.enabled ? 'Armed' : 'Off', copy: alert && alert.enabled ? 'Catalyst alert is active for ' + titleize(state.selected) + '.' : 'Use local alert memory to mark this catalyst board as active.' };
        break;
      case 'ripple-ranker':
        primary = { value: safeArray(bundle.curated.ripple_ranker)[0] ? safeArray(bundle.curated.ripple_ranker)[0].score + '/100' : '—', copy: 'Top downstream sensitivity score in the current stack.' };
        secondary = { value: overlaps.length ? overlaps.length + ' names' : '0 names', copy: overlaps.length ? 'Saved watchlist overlap makes this page immediately actionable.' : 'Add a watchlist to make the ranking personal instead of generic.' };
        tertiary = { value: workspace ? 'Saved' : 'Unsaved', copy: workspace ? 'The current ' + titleize(state.selected) + ' ranking workspace is saved in this browser.' : 'Save a workspace to preserve the current ranking context.' };
        break;
      case 'exposure-screener':
        primary = { value: overlaps.length ? overlaps.length + ' matches' : '0 matches', copy: overlaps.length ? 'Exact watchlist matches were found for the current commodity move.' : 'No exact watchlist match yet; the screen is using top exposures instead.' };
        secondary = { value: watchlistCount + ' names', copy: watchlistCount ? 'Saved watchlist depth determines how strong this product becomes.' : 'You need saved watchlist names for full screener value.' };
        tertiary = { value: alert && alert.enabled ? 'Tracked' : 'Idle', copy: alert && alert.enabled ? 'Exposure alert is active for the selected commodity.' : 'Toggle alerts to revisit the same overlap state faster.' };
        break;
      case 'portfolio-stress-test':
        primary = { value: buildStressRows(bundle)[0] ? fmtPct(buildStressRows(bundle)[0].base) : '—', copy: 'Base-case P/L translation for the highest sensitivity position.' };
        secondary = { value: commodityCount + ' tracked', copy: commodityCount ? 'Saved commodities tell CommodityNode which stress cases deserve repeat attention.' : 'Save tracked commodities so stress work becomes part of your workflow instead of a one-off demo.' };
        tertiary = { value: workspace ? formatRelative(workspace.savedAt) : 'Unsaved', copy: workspace ? 'Stress workbook for ' + titleize(state.selected) + ' saved in this browser.' : 'Save this stress case if you want to revisit the same commodity scenario.' };
        break;
      case 'hedge-optimizer':
        primary = { value: buildHedgeScores(bundle)[0] ? buildHedgeScores(bundle)[0].coverage + '/100' : '—', copy: 'Best current hedge fit score.' };
        secondary = { value: roleText, copy: profile.role ? 'Saved role helps frame whether this page should behave like defense, participation, or monitoring.' : 'Save a role so hedge recommendations can be framed around how you actually use CommodityNode.' };
        tertiary = { value: alert && alert.enabled ? 'Ready' : 'Standby', copy: alert && alert.enabled ? 'Hedge reminder is active for ' + titleize(state.selected) + '.' : 'Enable the local reminder to revisit hedge fit before the next catalyst.' };
        break;
      case 'forecast-explainability':
        primary = { value: Math.round(agreement.score * 100) + '%', copy: 'Model agreement score across the public stack.' };
        secondary = { value: agreement.gap30.toFixed(1) + '%', copy: 'Day-30 gap between model medians.' };
        tertiary = { value: commodityCount ? commodityCount + ' tracked' : anomaly.label, copy: commodityCount ? 'Tracked commodities make it easier to decide which explainability pages deserve repeat review.' : 'Explainability is most useful when anomaly risk is elevated and no saved workflow exists yet.' };
        break;
      case 'regime-shift-detector':
        primary = { value: computeRegime(bundle).regime, copy: computeRegime(bundle).signal };
        secondary = { value: roleText, copy: profile.role ? 'Role-aware workflows matter because regime changes mean different things to investors, analysts, and operators.' : 'Save a role so regime alerts can be framed around your real workflow.' };
        tertiary = { value: alert && alert.enabled ? 'Pinned' : 'Watching', copy: alert && alert.enabled ? 'This regime state is pinned for ' + titleize(state.selected) + ' via local alert memory.' : 'Toggle alerts to keep this regime state pinned in your browser.' };
        break;
      case 'anomaly-monitor':
        primary = { value: computeAnomaly(bundle).score + '/99', copy: computeAnomaly(bundle).label };
        secondary = { value: watchlistCount + ' names', copy: watchlistCount ? 'Watchlist depth matters because anomaly review is strongest when it points to positions you already care about.' : 'Add a watchlist so anomaly review points at names you actually follow.' };
        tertiary = { value: alert && alert.enabled ? 'Escalated' : 'Normal', copy: alert && alert.enabled ? 'Local anomaly escalation is active for this commodity.' : 'Enable local escalation if you want this anomaly state to stay sticky.' };
        break;
      case 'event-study-library':
        primary = { value: safeArray(bundle.curated.event_studies).length + ' windows', copy: 'Historical analog windows available for the current commodity.' };
        secondary = { value: eventCount ? eventCount + ' linked' : '0 linked', copy: eventCount ? 'Your saved event playbooks can be paired with these analog studies.' : 'Save event playbooks to make this history layer more operational.' };
        tertiary = { value: workspace ? 'Saved' : 'Unsaved', copy: workspace ? 'Historical context for ' + titleize(state.selected) + ' is saved locally for reopening later.' : 'Save the workspace to keep this analog set attached to the commodity.' };
        break;
      case 'rl-policy-lab':
        var neuralFrontierMetric = getNeuralFrontierForSelected();
        var neuralPolicyMetric = getNeuralPolicy();
        var walkForwardMetric = neuralPolicyMetric && neuralPolicyMetric.walk_forward ? neuralPolicyMetric.walk_forward : null;
        var replayMetric = neuralPolicyMetric && neuralPolicyMetric.replay_summary ? neuralPolicyMetric.replay_summary : null;
        primary = neuralFrontierMetric ? { value: Math.round(Number(neuralFrontierMetric.confidence || 0) * 100) + '%', copy: 'Neural PPO confidence for ' + String(neuralFrontierMetric.action || 'hold').replace(/_/g, ' ') + '.' } : { value: buildPolicyScores(bundle)[0] ? buildPolicyScores(bundle)[0].score + '/100' : '—', copy: 'Current policy confidence score.' };
        secondary = walkForwardMetric ? { value: Math.round(Number(walkForwardMetric.positive_window_rate || 0) * 100) + '%', copy: 'Walk-forward hit rate across held-out windows.' } : { value: roleText, copy: profile.role ? 'Saved role shapes whether policy support should emphasize research discipline, capital protection, or operating response.' : 'Save a role so this policy layer stops acting like a generic demo and starts acting like a workflow tool.' };
        tertiary = replayMetric ? { value: Math.round(Number(replayMetric.win_rate || 0) * 100) + '%', copy: 'Replay win rate from the latest policy run.' } : { value: alert && alert.enabled ? 'Enabled' : 'Off', copy: alert && alert.enabled ? 'Policy reminder is active for ' + titleize(state.selected) + '.' : 'Toggle the reminder to preserve this policy state for later review.' };
        break;
    }

    return { primary: primary, secondary: secondary, tertiary: tertiary };
  }

  function setMetric(idPrefix, payload){
    $(idPrefix).textContent = payload.value;
    $(idPrefix + '-copy').textContent = payload.copy;
  }

  function renderInsights(items){
    var target = $('intel-demo-insights');
    if (!target) return;
    target.innerHTML = items.map(function(item){
      return '<div class="intel-insight-card"><div class="intel-insight-title">' + item.title + '</div><div class="intel-insight-copy">' + item.copy + '</div></div>';
    }).join('');
  }

  function renderSummary(text){
    $('intel-demo-summary').textContent = text;
  }

  function renderEventProbability(bundle){
    var events = computeEventProbabilities(bundle);
    ensureChart({
      type: 'bar',
      data: {
        labels: events.map(function(item){ return item.label; }),
        datasets: [{
          label: 'Probability',
          data: events.map(function(item){ return Math.round(item.probability * 100); }),
          backgroundColor: 'rgba(34,211,238,0.62)',
          borderColor: '#22d3ee',
          borderRadius: 10,
          borderWidth: 1
        }]
      },
      options: chartOptions(100)
    });
    renderSummary('Top catalyst for ' + titleize(state.selected) + ': ' + (events[0] ? events[0].label + ' at ' + Math.round(events[0].probability * 100) + '% probability.' : 'No catalyst data available.'));
    renderInsights(events.slice(0, 3).map(function(item){
      return { title: item.label, copy: 'Bull case: ' + item.bull_case + ' · Risk if wrong: ' + item.bear_case };
    }));
  }

  function renderRippleRanker(bundle){
    var items = safeArray(bundle.curated.ripple_ranker).slice(0, 4);
    ensureChart({
      type: 'bar',
      data: {
        labels: items.map(function(item){ return item.name; }),
        datasets: [{
          label: 'Sensitivity score',
          data: items.map(function(item){ return item.score; }),
          backgroundColor: 'rgba(192,132,252,0.62)',
          borderColor: '#c084fc',
          borderRadius: 10,
          borderWidth: 1
        }]
      },
      options: chartOptions(100)
    });
    renderSummary('The current tape says downstream attention should begin with ' + (items[0] ? items[0].name : 'the top-ranked name') + ', then move down the chain.');
    renderInsights(items.map(function(item){
      return { title: item.name + ' · ' + item.score + '/100', copy: item.reason };
    }));
  }

  function renderExposureScreener(bundle, profile){
    var watchlist = safeArray(profile.watchlist).map(function(item){ return String(item).toLowerCase(); });
    var items = safeArray(bundle.curated.ripple_ranker);
    var matches = items.filter(function(item){ return watchlist.indexOf(String(item.name).toLowerCase()) !== -1; });
    var useItems = matches.length ? matches : items.slice(0, 4);
    ensureChart({
      type: 'bar',
      data: {
        labels: useItems.map(function(item){ return item.name; }),
        datasets: [{
          label: 'Overlap score',
          data: useItems.map(function(item, idx){ return matches.length ? 88 - idx * 8 : item.score; }),
          backgroundColor: 'rgba(16,185,129,0.6)',
          borderColor: '#10b981',
          borderRadius: 10,
          borderWidth: 1
        }]
      },
      options: chartOptions(100)
    });
    renderSummary(matches.length ? 'Saved watchlist overlap found for ' + titleize(state.selected) + '. This product is now in decision mode.' : 'No direct watchlist overlap yet. The screener is highlighting the highest-sensitivity names to seed your workflow.');
    renderInsights(useItems.map(function(item){
      return { title: item.name, copy: matches.length ? 'Saved watchlist match · ' + item.reason : 'Suggested screen seed · ' + item.reason };
    }));
  }

  function renderStressTest(bundle){
    var rows = buildStressRows(bundle);
    ensureChart({
      type: 'bar',
      data: {
        labels: rows.map(function(item){ return item.name; }),
        datasets: [
          { label: 'Downside', data: rows.map(function(item){ return item.downside; }), backgroundColor: 'rgba(244,63,94,0.55)', borderColor: '#f43f5e', borderRadius: 8, borderWidth: 1 },
          { label: 'Base', data: rows.map(function(item){ return item.base; }), backgroundColor: 'rgba(34,211,238,0.55)', borderColor: '#22d3ee', borderRadius: 8, borderWidth: 1 },
          { label: 'Upside', data: rows.map(function(item){ return item.upside; }), backgroundColor: 'rgba(16,185,129,0.55)', borderColor: '#10b981', borderRadius: 8, borderWidth: 1 }
        ]
      },
      options: multiChartOptions()
    });
    renderSummary('Stress ladders are easier to defend than vague conviction. Start with the highest-sensitivity position, then decide whether the move changes portfolio behavior.');
    renderInsights(rows.map(function(item){
      return { title: item.name, copy: 'Base ' + fmtPct(item.base) + ' · Downside ' + fmtPct(item.downside) + ' · Upside ' + fmtPct(item.upside) };
    }));
  }

  function renderHedgeOptimizer(bundle){
    var items = buildHedgeScores(bundle);
    ensureChart({
      type: 'bar',
      data: {
        labels: items.map(function(item){ return item.name; }),
        datasets: [{ label: 'Hedge fit', data: items.map(function(item){ return item.coverage; }), backgroundColor: 'rgba(251,191,36,0.62)', borderColor: '#fbbf24', borderRadius: 10, borderWidth: 1 }]
      },
      options: chartOptions(100)
    });
    renderSummary('The right hedge is the one that fits the current regime and exposure map, not the loudest directional trade.');
    renderInsights(items.map(function(item){
      return { title: item.name + ' · ' + item.coverage + '/100', copy: item.fit };
    }));
  }

  function renderExplainability(bundle){
    var forecast = bundle.forecast || {};
    var consensus = getConsensus(bundle);
    var chronos = forecast.models && forecast.models.chronos2 ? forecast.models.chronos2 : {};
    var timesfm = forecast.models && forecast.models.timesfm ? forecast.models.timesfm : {};
    var labels = safeArray(consensus.dates).slice(0, 20).map(function(d){ return d.slice(5); });
    ensureChart({
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Consensus', data: safeArray(consensus.median).slice(0, 20), borderColor: '#5eead4', backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 2, tension: 0.25 },
          { label: 'Chronos-2', data: safeArray(chronos.median).slice(0, 20), borderColor: '#c084fc', borderDash: [5,4], borderWidth: 2, tension: 0.25 },
          { label: 'TimesFM 2.5', data: safeArray(timesfm.median).slice(0, 20), borderColor: '#fbbf24', borderDash: [4,4], borderWidth: 2, tension: 0.25 }
        ]
      },
      options: lineOptions()
    });
    renderSummary('Explainability decides whether this forecast should drive action, stay narrative-only, or trigger more caution.');
    var agreement = getAgreement(bundle);
    renderInsights([
      { title: 'Agreement score · ' + Math.round(agreement.score * 100) + '%', copy: 'Higher agreement means the stack is easier to trust operationally.' },
      { title: 'Day-30 gap · ' + agreement.gap30.toFixed(1) + '%', copy: 'A wide gap means the model family is arguing with itself.' },
      { title: 'Direction · ' + getDirection(bundle), copy: 'Direction matters less than whether the supporting models actually converge.' }
    ]);
  }

  function renderRegime(bundle){
    var regime = computeRegime(bundle);
    ensureChart({
      type: 'radar',
      data: {
        labels: ['Trend', 'Agreement', 'Volatility', 'Catalyst risk', 'Anomaly risk'],
        datasets: [{
          label: 'State profile',
          data: [clamp(Math.abs(getPrimaryChange(bundle)) * 12, 12, 92), Math.round(getAgreement(bundle).score * 100), regime.volatility === 'High' ? 88 : regime.volatility === 'Medium' ? 66 : 38, Math.round((computeEventProbabilities(bundle)[0] ? computeEventProbabilities(bundle)[0].probability : 0.18) * 100), computeAnomaly(bundle).score],
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,0.18)',
          borderWidth: 2,
          pointBackgroundColor: '#22d3ee'
        }]
      },
      options: radarOptions()
    });
    renderSummary(regime.regime + ' is the current state for ' + titleize(state.selected) + '. ' + regime.signal);
    renderInsights([
      { title: 'Regime label', copy: regime.regime },
      { title: 'Volatility', copy: regime.volatility + ' — use this to size conviction.' },
      { title: 'Decision note', copy: regime.signal }
    ]);
  }

  function renderAnomaly(bundle){
    var anomaly = computeAnomaly(bundle);
    ensureChart({
      type: 'doughnut',
      data: {
        labels: ['Anomaly', 'Normal'],
        datasets: [{ data: [anomaly.score, 100 - anomaly.score], backgroundColor: ['rgba(244,63,94,0.72)', 'rgba(148,163,184,0.18)'], borderColor: ['#f43f5e', 'rgba(148,163,184,0.22)'], borderWidth: 1 }]
      },
      options: doughnutOptions()
    });
    renderSummary('Anomaly score for ' + titleize(state.selected) + ': ' + anomaly.score + '. Use it as a review trigger when spot action and the model story stop matching.');
    renderInsights([
      { title: anomaly.label, copy: anomaly.summary },
      { title: 'Model direction', copy: getDirection(bundle) },
      { title: 'Primary move', copy: fmtPct(getPrimaryChange(bundle)) }
    ]);
  }

  function renderEventStudy(bundle){
    var items = safeArray(bundle.curated.event_studies);
    ensureChart({
      type: 'bar',
      data: {
        labels: items.map(function(item){ return item.event; }),
        datasets: [{
          label: 'Reaction confidence',
          data: items.map(function(item, idx){ return clamp(Math.round(58 + Math.abs(getPrimaryChange(bundle)) * 4 + idx * 7), 45, 94); }),
          backgroundColor: 'rgba(59,130,246,0.62)',
          borderColor: '#3b82f6',
          borderRadius: 10,
          borderWidth: 1
        }]
      },
      options: chartOptions(100)
    });
    renderSummary('Historical analogs are strongest when they are tied to a repeatable catalyst window, not used as a generic story-telling device.');
    renderInsights(items.map(function(item){
      return { title: item.event + ' · ' + item.window, copy: item.pattern };
    }));
  }

  function getRlFrontierForSelected(){
    var items = safeArray(state.rlArtifacts.policy_frontier);
    for (var i = 0; i < items.length; i++) {
      if (items[i].commodity === state.selected) return items[i];
    }
    return null;
  }

  function getRlBenchmark(){
    return state.rlArtifacts && state.rlArtifacts.benchmark ? state.rlArtifacts.benchmark : null;
  }

  function getNeuralPolicy(){
    return state.rlArtifacts && state.rlArtifacts.neural_policy ? state.rlArtifacts.neural_policy : null;
  }

  function getNeuralFrontierForSelected(){
    var neural = getNeuralPolicy();
    var items = safeArray(neural && neural.frontier);
    for (var i = 0; i < items.length; i++) {
      if (items[i].commodity === state.selected) return items[i];
    }
    return null;
  }

  function getNeuralPerformance(){
    var neural = getNeuralPolicy();
    return neural && neural.performance ? neural.performance : null;
  }

  function getPolicyStateIndex(items, actionName){
    var action = String(actionName || '').toLowerCase();
    if (!action) return -1;
    var scoring = items.map(function(item, idx){
      var haystack = (String(item.state || '') + ' ' + String(item.action || '')).toLowerCase();
      var score = 0;
      if (action === 'reduce_risk') {
        if (haystack.indexOf('reduce') !== -1 || haystack.indexOf('trim') !== -1 || haystack.indexOf('wait') !== -1 || haystack.indexOf('bear') !== -1) score += 3;
      } else if (action === 'hold') {
        if (haystack.indexOf('wait') !== -1 || haystack.indexOf('low agreement') !== -1) score += 3;
      } else if (action === 'add_continuation') {
        if (haystack.indexOf('trend') !== -1 || haystack.indexOf('continuation') !== -1 || haystack.indexOf('accumulate') !== -1 || haystack.indexOf('favor miner beta') !== -1) score += 3;
      } else if (action === 'add_hedge') {
        if (haystack.indexOf('hedge') !== -1 || haystack.indexOf('options') !== -1 || haystack.indexOf('protect') !== -1) score += 3;
      } else if (action === 'relative_value_rotation') {
        if (haystack.indexOf('relative value') !== -1 || haystack.indexOf('relative-value') !== -1 || haystack.indexOf('rotation') !== -1) score += 3;
      }
      if (action.replace(/_/g, ' ') && haystack.indexOf(action.replace(/_/g, ' ')) !== -1) score += 4;
      return { idx: idx, score: score };
    }).sort(function(a, b){ return b.score - a.score; });
    return scoring.length ? scoring[0].idx : -1;
  }

  function renderPolicyLab(bundle){
    var frontier = getRlFrontierForSelected();
    var benchmark = getRlBenchmark();
    var neural = getNeuralPolicy();
    var neuralFrontier = getNeuralFrontierForSelected();
    var neuralPerformance = getNeuralPerformance();
    var walkForward = neural && neural.walk_forward ? neural.walk_forward : null;
    var replaySummary = neural && neural.replay_summary ? neural.replay_summary : null;
    var items = buildPolicyScores(bundle);
    var actionLabels = items.map(function(item){ return item.state; });
    var offlineAction = frontier ? String(frontier.offline_action || 'hold') : '';
    var ppoAction = frontier ? String(frontier.ppo_action || 'hold') : '';
    var neuralAction = neuralFrontier ? String(neuralFrontier.action || 'hold') : '';
    var chartData = {
      labels: actionLabels,
      datasets: [{
        label: 'Heuristic prior',
        data: items.map(function(item){ return item.score; }),
        backgroundColor: 'rgba(168,85,247,0.32)',
        borderColor: 'rgba(168,85,247,0.95)',
        borderRadius: 10,
        borderWidth: 1
      }]
    };

    if (frontier) {
      var offlineIndex = getPolicyStateIndex(items, offlineAction);
      var ppoIndex = getPolicyStateIndex(items, ppoAction);
      chartData.datasets.push({
        label: 'Offline policy',
        data: items.map(function(_item, idx){
          return idx === offlineIndex ? Math.round(Number(frontier.offline_confidence || 0) * 100) : 0;
        }),
        backgroundColor: 'rgba(34,197,94,0.58)',
        borderColor: '#22c55e',
        borderRadius: 10,
        borderWidth: 1
      });
      chartData.datasets.push({
        label: 'PPO bootstrap',
        data: items.map(function(_item, idx){
          return idx === ppoIndex ? Math.round(Number(frontier.ppo_confidence || 0) * 100) : 0;
        }),
        backgroundColor: 'rgba(56,189,248,0.58)',
        borderColor: '#38bdf8',
        borderRadius: 10,
        borderWidth: 1
      });
    }

    if (neuralFrontier) {
      var neuralIndex = getPolicyStateIndex(items, neuralAction);
      chartData.datasets.push({
        label: 'Neural PPO',
        data: items.map(function(_item, idx){
          return idx === neuralIndex ? Math.round(Number(neuralFrontier.confidence || 0) * 100) : 0;
        }),
        backgroundColor: 'rgba(250,204,21,0.62)',
        borderColor: '#facc15',
        borderRadius: 10,
        borderWidth: 1
      });
    }

    ensureChart({
      type: 'bar',
      data: chartData,
      options: multiChartOptions()
    });

    if (frontier && neuralFrontier) {
      var summaryText = 'Neural PPO decision for ' + titleize(state.selected) + ': ' + neuralAction.replace(/_/g, ' ') + ' (' + Math.round(Number(neuralFrontier.confidence || 0) * 100) + '% confidence';
      if (walkForward && walkForward.positive_window_rate != null) {
        summaryText += ', walk-forward hit rate ' + Math.round(Number(walkForward.positive_window_rate || 0) * 100) + '%';
      }
      if (replaySummary && replaySummary.win_rate != null) {
        summaryText += ', replay win rate ' + Math.round(Number(replaySummary.win_rate || 0) * 100) + '%';
      }
      summaryText += ').';
      renderSummary(summaryText);
      renderInsights([
        { title: 'Offline policy → ' + offlineAction.replace(/_/g, ' '), copy: 'Offline confidence ' + Math.round(Number(frontier.offline_confidence || 0) * 100) + '%.' },
        { title: 'PPO bootstrap → ' + ppoAction.replace(/_/g, ' '), copy: 'Bootstrap confidence ' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '%. Timestamp ' + (frontier.timestamp || 'n/a') + '.' },
        { title: 'Neural PPO → ' + neuralAction.replace(/_/g, ' '), copy: (neural && neural.report ? 'Timesteps ' + Number(neural.report.timesteps || 0) + ' · Mean reward ' + Number(neural.report.mean_reward_estimate || 0).toFixed(4) + ' · Final equity ' + Number((replaySummary || {}).final_equity || 0).toFixed(3) + '.' : 'Neural report unavailable.') },
        { title: 'Walk-forward robustness', copy: walkForward ? ('Positive windows ' + Math.round(Number(walkForward.positive_window_rate || 0) * 100) + '% · Mean reward ' + Number(walkForward.mean_reward || 0).toFixed(4) + ' · Mean max drawdown ' + Number(walkForward.mean_max_drawdown || 0).toFixed(4) + '.') : 'Walk-forward report unavailable.' },
        { title: 'Reward decomposition', copy: replaySummary ? ('PnL ' + Number((replaySummary.reward_decomposition || {}).pnl || 0).toFixed(4) + ' · Turnover -' + Number((replaySummary.reward_decomposition || {}).turnover_cost || 0).toFixed(4) + ' · Drawdown -' + Number((replaySummary.reward_decomposition || {}).drawdown_cost || 0).toFixed(4) + ' · Event gap -' + Number((replaySummary.reward_decomposition || {}).event_gap_cost || 0).toFixed(4) + '.') : 'Reward decomposition unavailable.' }
      ]);
      return;
    }

    if (frontier) {
      renderSummary('Real RL artifacts loaded. PPO action for ' + titleize(state.selected) + ': ' + String(frontier.ppo_action || 'hold').replace(/_/g, ' ') + ' (' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '% confidence).');
      renderInsights([
        { title: 'Offline policy → ' + String(frontier.offline_action || 'hold').replace(/_/g, ' '), copy: 'Offline confidence ' + Math.round(Number(frontier.offline_confidence || 0) * 100) + '%.' },
        { title: 'PPO fine-tuned → ' + String(frontier.ppo_action || 'hold').replace(/_/g, ' '), copy: 'PPO confidence ' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '%. Timestamp ' + (frontier.timestamp || 'n/a') + '.' },
        { title: 'Benchmark snapshot', copy: benchmark ? 'Offline reward ' + Number(benchmark.offline.mean_reward || 0).toFixed(4) + ' · PPO reward ' + Number(benchmark.ppo.mean_reward || 0).toFixed(4) + ' · Rule reward ' + Number(benchmark.rule_based.mean_reward || 0).toFixed(4) + '.' : 'Benchmark artifact not available.' }
      ]);
      return;
    }
    renderSummary('RL Policy Lab should feel like a policy frontier, not a fake autopilot. The highest-scoring state/action pair is your current default.');
    renderInsights(items.map(function(item){
      return { title: item.state + ' · ' + item.score + '/100', copy: item.action };
    }));
  }

  function chartOptions(max){
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, suggestedMax: max || 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        x: { ticks: { color: '#cbd5e1', maxRotation: 0, minRotation: 0 }, grid: { display: false } }
      }
    };
  }

  function multiChartOptions(){
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: {
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        x: { ticks: { color: '#cbd5e1', maxRotation: 0, minRotation: 0 }, grid: { display: false } }
      }
    };
  }

  function lineOptions(){
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: {
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
      }
    };
  }

  function radarOptions(){
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          grid: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: '#cbd5e1' },
          ticks: { display: false, maxTicksLimit: 4, backdropColor: 'transparent' },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    };
  }

  function doughnutOptions(){
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: { legend: { labels: { color: '#cbd5e1' } } }
    };
  }

  function renderWorkspaceMeta(bundle, profile){
    var workspace = getWorkspace(state.selected);
    var alert = getAlert(state.selected);
    var latestWorkspace = getLatestWorkspace();
    var latestAlert = getLatestAlert();
    var workspaceStatus = $('intel-workspace-status');
    var alertStatus = $('intel-alert-status');
    var meta = $('intel-workspace-meta');
    workspaceStatus.textContent = workspace ? 'Workspace saved · ' + formatRelative(workspace.savedAt) : 'Workspace not saved for ' + titleize(state.selected);
    alertStatus.textContent = alert && alert.enabled ? 'Alert active · ' + config.alertLabel : 'Alert inactive';
    alertStatus.className = 'intel-status-pill' + ((alert && alert.enabled) ? '' : ' off');
    if (workspace) {
      meta.textContent = 'Saved commodity: ' + titleize(workspace.commodity) + ' · role: ' + (profile.role ? titleize(profile.role) : 'Not set') + ' · watchlist: ' + safeArray(profile.watchlist).length + ' names.';
    } else if (latestWorkspace) {
      meta.textContent = 'Latest saved workspace in this module: ' + titleize(latestWorkspace.commodity) + ' · ' + formatRelative(latestWorkspace.savedAt) + '. Switch back if you want to reopen it.';
    } else if (latestAlert && latestAlert.enabled) {
      meta.textContent = 'An alert is active for ' + titleize(latestAlert.commodity) + '. Save a workspace for this commodity if you want faster reopen behavior.';
    } else {
      meta.textContent = 'Saved workspaces stay in this browser and reopen the same module + commodity combination when available.';
    }
    var toggle = $('intel-toggle-alert');
    if (toggle) toggle.textContent = alert && alert.enabled ? 'Disable alert' : 'Enable alert';
  }

  function buildExportBrief(bundle, profile){
    var price = bundle.price;
    var consensus = getConsensus(bundle);
    var agreement = getAgreement(bundle);
    var anomaly = computeAnomaly(bundle);
    var regime = computeRegime(bundle);
    var insightNodes = Array.prototype.slice.call(document.querySelectorAll('#intel-demo-insights .intel-insight-card'));
    var insights = insightNodes.slice(0, 3).map(function(node){
      return '- ' + node.querySelector('.intel-insight-title').textContent + ': ' + node.querySelector('.intel-insight-copy').textContent;
    });
    return [
      config.title + ' brief',
      'Commodity: ' + titleize(state.selected),
      'Price: ' + fmtPrice(price.price || consensus.current_price, price.unit || consensus.unit),
      'Primary move: ' + fmtPct(getPrimaryChange(bundle)),
      'Direction: ' + getDirection(bundle),
      'Agreement: ' + Math.round(agreement.score * 100) + '% (' + agreement.level + ')',
      'Regime: ' + regime.regime + ' / ' + regime.volatility,
      'Anomaly: ' + anomaly.score + ' (' + anomaly.label + ')',
      'Saved role: ' + (profile.role ? titleize(profile.role) : 'Not set'),
      'Saved watchlist count: ' + safeArray(profile.watchlist).length,
      '',
      'Top notes:',
      insights.length ? insights.join('\n') : '- No synthesized notes were available at export time.'
    ].join('\n');
  }

  function downloadBrief(text){
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var href = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = href;
    a.download = config.slug + '-' + state.selected + '-brief.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      URL.revokeObjectURL(href);
      a.remove();
    }, 0);
  }

  function renderAll(){
    var bundle = getBundle(state.selected);
    var profile = getProfile();
    switch (config.demoKind) {
      case 'event-probability': renderEventProbability(bundle); break;
      case 'ripple-ranker': renderRippleRanker(bundle); break;
      case 'exposure-screener': renderExposureScreener(bundle, profile); break;
      case 'portfolio-stress-test': renderStressTest(bundle); break;
      case 'hedge-optimizer': renderHedgeOptimizer(bundle); break;
      case 'forecast-explainability': renderExplainability(bundle); break;
      case 'regime-shift-detector': renderRegime(bundle); break;
      case 'anomaly-monitor': renderAnomaly(bundle); break;
      case 'event-study-library': renderEventStudy(bundle); break;
      case 'rl-policy-lab': renderPolicyLab(bundle); break;
      default: renderRippleRanker(bundle);
    }
    var metrics = metricPayload(bundle, profile);
    setMetric('intel-metric-primary', metrics.primary);
    setMetric('intel-metric-secondary', metrics.secondary);
    setMetric('intel-metric-tertiary', metrics.tertiary);
    renderWorkspaceMeta(bundle, profile);
  }

  function restoreSavedState(){
    var latestWorkspace = getLatestWorkspace();
    if (latestWorkspace && latestWorkspace.commodity && (state.curated[latestWorkspace.commodity] || state.prices[latestWorkspace.commodity] || state.consensus[latestWorkspace.commodity])) {
      state.selected = latestWorkspace.commodity;
      return;
    }
    var latestAlert = getLatestAlert();
    if (latestAlert && latestAlert.enabled && latestAlert.commodity && (state.curated[latestAlert.commodity] || state.prices[latestAlert.commodity] || state.consensus[latestAlert.commodity])) {
      state.selected = latestAlert.commodity;
    }
  }

  function fillSelector(){
    var select = $('intel-demo-commodity');
    if (!select) return;
    var keys = Object.keys(state.curated).filter(function(key){ return state.prices[key] || state.consensus[key]; });
    if (!keys.length) keys = Object.keys(state.curated);
    if (keys.indexOf(state.selected) === -1 && keys.length) state.selected = keys[0];
    select.innerHTML = keys.map(function(key){ return '<option value="' + key + '">' + titleize(key) + '</option>'; }).join('');
    select.value = state.selected;
    select.addEventListener('change', function(){
      state.selected = this.value;
      if (window.CNTrack) window.CNTrack('intelligence_product_select_commodity', { product: config.slug, commodity: state.selected });
      renderAll();
    });
  }

  function bindActions(){
    var saveBtn = $('intel-save-workspace');
    var exportBtn = $('intel-export-brief');
    var alertBtn = $('intel-toggle-alert');

    if (saveBtn) {
      saveBtn.addEventListener('click', function(){
        var profile = getProfile();
        var saved = setWorkspace({
          commodity: state.selected,
          savedAt: Date.now(),
          role: profile.role || '',
          watchlistCount: safeArray(profile.watchlist).length,
          title: config.title
        });
        renderAll();
        if (!saved && $('intel-workspace-meta')) {
          $('intel-workspace-meta').textContent = 'This browser blocked local workspace saving. Export the brief instead if you need a portable snapshot.';
        }
        if (saved && window.CNTrack) window.CNTrack('intelligence_product_save_workspace', { product: config.slug, commodity: state.selected });
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', function(){
        var bundle = getBundle(state.selected);
        var profile = getProfile();
        downloadBrief(buildExportBrief(bundle, profile));
        if (window.CNTrack) window.CNTrack('intelligence_product_export_brief', { product: config.slug, commodity: state.selected });
      });
    }

    if (alertBtn) {
      alertBtn.addEventListener('click', function(){
        var current = getAlert(state.selected);
        var enabled = !(current && current.enabled);
        var saved = setAlert({ enabled: enabled, commodity: state.selected, updatedAt: Date.now(), label: config.alertLabel });
        renderAll();
        if (!saved && $('intel-workspace-meta')) {
          $('intel-workspace-meta').textContent = 'This browser blocked local alert saving. Workspace export still works even without browser storage.';
        }
        if (saved && window.CNTrack) window.CNTrack('intelligence_product_toggle_alert', { product: config.slug, commodity: state.selected, enabled: enabled });
      });
    }

    document.addEventListener('cn:profile-updated', function(){
      renderAll();
    });
  }

  function fetchJson(url){
    return fetch(url).then(function(response){
      if (!response.ok) throw new Error('Failed to load ' + url + ' (' + response.status + ')');
      return response.json();
    });
  }

  function init(){
    Promise.allSettled([
      fetchJson('/assets/data/prices.json'),
      fetchJson('/assets/data/forecast-consensus.json'),
      fetchJson('/assets/data/intelligence-lab.json'),
      fetchJson('/assets/data/rl-policy-lab.json')
    ]).then(function(results){
      state.prices = results[0].status === 'fulfilled' ? (results[0].value || {}) : {};
      state.consensus = results[1].status === 'fulfilled' ? (results[1].value || {}) : {};
      state.curated = results[2].status === 'fulfilled' ? (results[2].value || {}) : {};
      state.rlArtifacts = results[3].status === 'fulfilled' ? (results[3].value || {}) : {};
      if (!Object.keys(state.curated).length) {
        renderSummary('Demo data is temporarily unavailable. Please retry.');
        return;
      }
      restoreSavedState();
      fillSelector();
      bindActions();
      renderAll();
      if (results[0].status !== 'fulfilled' || results[1].status !== 'fulfilled') {
        $('intel-workspace-meta').textContent = 'Some live datasets are temporarily unavailable, so this page is running in fallback mode.';
      }
    }).catch(function(err){
      renderSummary('The interactive demo failed to initialize. ' + (err && err.message ? err.message : 'Please retry.'));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
