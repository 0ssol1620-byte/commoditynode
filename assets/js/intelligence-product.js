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
    chart: null,
    rlCharts: {},
    rlField: { frame: 0, particles: [], resizeBound: false }
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

  function ensureRlChart(id, configObj){
    var canvas = $(id);
    if (!canvas || typeof Chart !== 'function') return;
    if (state.rlCharts[id]) state.rlCharts[id].destroy();
    state.rlCharts[id] = new Chart(canvas.getContext('2d'), configObj);
  }

  function clearRlCharts(){
    Object.keys(state.rlCharts).forEach(function(key){
      if (state.rlCharts[key]) state.rlCharts[key].destroy();
    });
    state.rlCharts = {};
  }

  function stopRlFieldAnimation(){
    if (state.rlField && state.rlField.frame) {
      cancelAnimationFrame(state.rlField.frame);
      state.rlField.frame = 0;
    }
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
        var upliftMetric = neuralPolicyMetric && neuralPolicyMetric.vs_hold_reward_uplift != null ? Number(neuralPolicyMetric.vs_hold_reward_uplift) : null;
        primary = neuralFrontierMetric ? { value: Math.round(Number(neuralFrontierMetric.confidence || 0) * 100) + '%', copy: 'Neural PPO confidence for ' + String(neuralFrontierMetric.action || 'hold').replace(/_/g, ' ') + '.' } : { value: buildPolicyScores(bundle)[0] ? buildPolicyScores(bundle)[0].score + '/100' : '—', copy: 'Current policy confidence score.' };
        secondary = walkForwardMetric ? { value: (Number(walkForwardMetric.vs_hold_reward_uplift || 0) >= 0 ? '+' : '') + Number(walkForwardMetric.vs_hold_reward_uplift || 0).toFixed(2), copy: 'Average walk-forward reward uplift versus a hold baseline.' } : { value: roleText, copy: profile.role ? 'Saved role shapes whether policy support should emphasize research discipline, capital protection, or operating response.' : 'Save a role so this policy layer stops acting like a generic demo and starts acting like a workflow tool.' };
        tertiary = replayMetric ? { value: upliftMetric == null ? Math.round(Number(replayMetric.win_rate || 0) * 100) + '%' : ((upliftMetric >= 0 ? '+' : '') + upliftMetric.toFixed(2)), copy: upliftMetric == null ? 'Replay win rate from the latest policy run.' : 'Replay reward uplift versus the hold baseline.' } : { value: alert && alert.enabled ? 'Enabled' : 'Off', copy: alert && alert.enabled ? 'Policy reminder is active for ' + titleize(state.selected) + '.' : 'Toggle the reminder to preserve this policy state for later review.' };
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

  function getSelectedProfile(neural){
    return safeArray(neural && neural.profile_selection).find(function(item){
      return String(item.device || '') === String(neural && neural.selected_device || '') && Number(item.timesteps || 0) === Number(neural && neural.selected_timesteps || 0) && Number(item.prior_weight || 0) === Number(neural && neural.selected_prior_weight || 0);
    }) || null;
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

  function setRlPanelsVisible(isVisible){
    var panel = $('intel-rl-premium-panels');
    var consolePanel = $('intel-rl-decision-console');
    if (panel) panel.hidden = !isVisible;
    if (consolePanel) consolePanel.hidden = !isVisible;
    if (!isVisible) {
      stopRlFieldAnimation();
      clearRlCharts();
      ['intel-rl-probability-pills', 'intel-rl-regime-pills', 'intel-rl-trace-pills', 'intel-rl-windows', 'intel-rl-timeline', 'intel-rl-trust-strip', 'intel-rl-decision-pills', 'intel-rl-why-panel', 'intel-rl-scenario-panel', 'intel-rl-audit-trail', 'intel-rl-baseline-table-body', 'intel-rl-field-meta', 'intel-rl-console-band', 'intel-rl-console-note', 'intel-rl-state-pills', 'intel-rl-governance-panel', 'intel-rl-regime-matrix'].forEach(function(id){
        if ($(id)) $(id).innerHTML = '';
      });
      ['intel-rl-node-reduce_risk','intel-rl-node-hold','intel-rl-node-add_continuation','intel-rl-node-add_hedge','intel-rl-node-relative_value_rotation'].forEach(function(id){
        var node = $(id);
        if (!node) return;
        node.classList.remove('active');
        var span = node.querySelector('span');
        if (span) span.textContent = '0%';
      });
      if ($('intel-rl-field-center-action')) $('intel-rl-field-center-action').textContent = 'Unavailable';
      if ($('intel-rl-field-center-copy')) $('intel-rl-field-center-copy').textContent = 'Probability-weighted field';
      if ($('intel-rl-decision-title')) $('intel-rl-decision-title').textContent = 'Recommendation unavailable';
      if ($('intel-rl-decision-copy')) $('intel-rl-decision-copy').textContent = 'RL decision data is unavailable for the current selection.';
    }
  }

  function fmtSigned(value, decimals){
    var num = Number(value || 0);
    var precision = decimals == null ? 2 : decimals;
    return (num >= 0 ? '+' : '') + num.toFixed(precision);
  }

  function fmtMetric(value, decimals, signed){
    if (value == null || value === '' || Number.isNaN(Number(value))) return '—';
    var precision = decimals == null ? 2 : decimals;
    var num = Number(value);
    if (signed) return (num >= 0 ? '+' : '') + num.toFixed(precision);
    return num.toFixed(precision);
  }

  function fmtConfidence(value){
    if (value == null || value === '' || Number.isNaN(Number(value))) return '—';
    return Math.round(Number(value) * 100) + '%';
  }

  function getTopActionFromCounts(counts){
    var entries = Object.entries(counts || {});
    if (!entries.length) return null;
    entries.sort(function(a, b){ return Number(b[1] || 0) - Number(a[1] || 0); });
    return entries[0][0];
  }

  function getRlToneStyles(tone){
    if (tone === 'better') return { badge: 'background:rgba(34,197,94,0.14);color:#86efac;border:1px solid rgba(34,197,94,0.24);', pill: 'background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.18);' };
    if (tone === 'worse') return { badge: 'background:rgba(248,113,113,0.14);color:#fca5a5;border:1px solid rgba(248,113,113,0.24);', pill: 'background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.18);' };
    return { badge: 'background:rgba(168,85,247,0.12);color:#c084fc;border:1px solid rgba(168,85,247,0.18);', pill: 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);' };
  }

  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getRlVerdict(replayUplift, walkUplift){
    var hasReplay = replayUplift != null && !Number.isNaN(Number(replayUplift));
    var hasWalk = walkUplift != null && !Number.isNaN(Number(walkUplift));
    var replay = hasReplay ? Number(replayUplift) : 0;
    var walk = hasWalk ? Number(walkUplift) : 0;
    if (hasReplay && hasWalk) {
      if (replay > 0.03 && walk > 0.15) return { label: 'Better', tone: 'better' };
      if (replay < -0.03 && walk < -0.05) return { label: 'Worse', tone: 'worse' };
      return { label: 'Unclear', tone: 'unclear' };
    }
    if (hasReplay) {
      if (replay > 0.03) return { label: 'Better vs hold', tone: 'better' };
      if (replay < -0.03) return { label: 'Worse vs hold', tone: 'worse' };
    }
    return { label: 'Unclear', tone: 'unclear' };
  }

  function getRlTrustFlags(neural, walkForward, replaySummary, neuralFrontier){
    if (!neural) return [];
    var commit = String(state.rlArtifacts && state.rlArtifacts.updated_from_commit || 'unknown');
    var hasConfidence = neuralFrontier && neuralFrontier.confidence != null || neural.report && neural.report.confidence != null;
    var confidence = hasConfidence ? Number(neuralFrontier && neuralFrontier.confidence != null ? neuralFrontier.confidence : neural.report && neural.report.confidence) : null;
    var hasReplayUplift = neural.vs_hold_reward_uplift != null;
    var replayUplift = hasReplayUplift ? Number(neural.vs_hold_reward_uplift) : null;
    var hasWalk = walkForward && walkForward.vs_hold_reward_uplift != null && walkForward.positive_window_rate != null;
    var walkUplift = hasWalk ? Number(walkForward.vs_hold_reward_uplift) : null;
    var positiveRate = hasWalk ? Number(walkForward.positive_window_rate) : null;
    var hasDiversity = replaySummary && replaySummary.action_diversity != null;
    var diversity = hasDiversity ? Number(replaySummary.action_diversity) : null;
    var hasBalance = replaySummary && replaySummary.regime_balance_score != null;
    var balance = hasBalance ? Number(replaySummary.regime_balance_score) : null;
    var dominantShare = replaySummary && replaySummary.dominant_action_share != null ? Number(replaySummary.dominant_action_share) : null;
    var nonHoldValueAdd = replaySummary && replaySummary.non_hold_value_add != null ? Number(replaySummary.non_hold_value_add) : null;
    var flags = [
      { label: 'Policy profile', value: 'Balanced export selection', tone: 'unclear' },
      { label: 'Freshness', value: commit, tone: 'unclear' },
      { label: 'Baseline edge', value: hasReplayUplift ? fmtSigned(replayUplift, 2) + ' replay uplift' : 'Unknown', tone: !hasReplayUplift ? 'unclear' : replayUplift >= 0 ? 'better' : 'worse' },
      { label: 'Walk-forward', value: hasWalk ? Math.round(positiveRate * 100) + '% positive windows · ' + fmtSigned(walkUplift, 2) : 'Unknown', tone: !hasWalk ? 'unclear' : positiveRate >= 0.67 ? 'better' : 'worse' },
      { label: 'Action diversity', value: hasDiversity ? Math.round(diversity * 100) + '% of action set' : 'Unknown', tone: !hasDiversity ? 'unclear' : diversity >= 0.6 ? 'better' : 'unclear' },
      { label: 'Regime balance', value: hasBalance ? Math.round(balance * 100) + '%' : 'Unknown', tone: !hasBalance ? 'unclear' : balance >= 0.45 ? 'better' : balance >= 0.28 ? 'unclear' : 'worse' },
      { label: 'Dominant action', value: dominantShare != null ? Math.round(dominantShare * 100) + '% share' : 'Unknown', tone: dominantShare == null ? 'unclear' : dominantShare <= 0.55 ? 'better' : dominantShare <= 0.75 ? 'unclear' : 'worse' },
      { label: 'Intervention edge', value: nonHoldValueAdd != null ? fmtSigned(nonHoldValueAdd, 2) + ' vs hold' : 'Unknown', tone: nonHoldValueAdd == null ? 'unclear' : nonHoldValueAdd >= 0 ? 'better' : 'worse' },
      { label: 'Action entropy', value: replaySummary && replaySummary.action_entropy != null ? Math.round(Number(replaySummary.action_entropy || 0) * 100) + '%' : 'Unknown', tone: replaySummary && replaySummary.action_entropy != null ? (Number(replaySummary.action_entropy || 0) >= 0.45 ? 'better' : 'unclear') : 'unclear' },
      { label: 'Confidence', value: fmtConfidence(confidence), tone: !hasConfidence ? 'unclear' : confidence >= 0.45 ? 'better' : confidence >= 0.3 ? 'unclear' : 'worse' }
    ];
    if (replaySummary && replaySummary.total_reward != null && Number(replaySummary.total_reward) < 0) {
      flags.push({ label: 'Warning', value: 'Replay total reward still negative', tone: 'worse' });
    }
    return flags;
  }

  function scoreScenarioActions(observation){
    var obs = observation || {};
    var forecast = Number(obs.forecast_return || 0);
    var agreement = Number(obs.agreement_score || 0.5);
    var anomaly = Number(obs.anomaly_score || 0);
    var eventRisk = Number(obs.event_risk || 0);
    var spread = Number(obs.model_spread || 0);
    var trend = Number(obs.trend_3 || 0);
    var volatility = Number(obs.volatility_5 || 0);
    var pressure = Number(obs.risk_pressure || 0);
    var scores = {
      reduce_risk: 0.22 + pressure * 0.55 + anomaly * 0.35 + Math.max(0, -forecast) * 12 + Math.max(0, -trend) * 10,
      hold: 0.16 + agreement * 0.12 + Math.max(0, 0.08 - volatility) * 1.5,
      add_continuation: 0.16 + Math.max(0, forecast) * 16 + Math.max(0, trend) * 14 + agreement * 0.18 - pressure * 0.2,
      add_hedge: 0.14 + eventRisk * 0.45 + volatility * 0.45 + Math.max(0, pressure - 0.2) * 0.3,
      relative_value_rotation: 0.14 + spread * 1.8 + volatility * 0.18 + Math.max(0, agreement - 0.45) * 0.12
    };
    var total = 0;
    Object.keys(scores).forEach(function(key){
      scores[key] = Math.max(0.01, Number(scores[key] || 0));
      total += scores[key];
    });
    Object.keys(scores).forEach(function(key){ scores[key] = scores[key] / total; });
    return scores;
  }

  function deriveRlDrivers(observation, action){
    var obs = observation || {};
    var currentAction = String(action || 'hold');
    var drivers = [
      { key: 'agreement_score', label: 'Consensus agreement', value: Number(obs.agreement_score || 0), positive: 'Higher agreement supports action conviction.', negative: 'Weak agreement reduces policy confidence.' },
      { key: 'anomaly_score', label: 'Anomaly pressure', value: Number(obs.anomaly_score || 0), positive: 'Anomaly pressure pushes the policy toward defense.', negative: 'Low anomaly pressure reduces the need for defensive action.' },
      { key: 'event_risk', label: 'Event risk', value: Number(obs.event_risk || 0), positive: 'Catalyst risk raises the value of protection and caution.', negative: 'Low event risk leaves more room for directional positioning.' },
      { key: 'model_spread', label: 'Model disagreement', value: Number(obs.model_spread || 0), positive: 'Model disagreement makes relative-value or defensive moves more attractive.', negative: 'Low disagreement supports a cleaner directional call.' },
      { key: 'trend_3', label: 'Short trend', value: Number(obs.trend_3 || 0), positive: 'Trend strength supports continuation when risk is contained.', negative: 'Weak or negative trend undercuts continuation.' },
      { key: 'volatility_5', label: 'Recent volatility', value: Number(obs.volatility_5 || 0), positive: 'High volatility increases hedging and defense value.', negative: 'Calmer conditions reduce urgency.' },
      { key: 'risk_pressure', label: 'Risk pressure', value: Number(obs.risk_pressure || 0), positive: 'Composite pressure is a strong signal to de-risk.', negative: 'Low pressure supports staying closer to baseline risk.' },
      { key: 'forecast_return', label: 'Forecast return', value: Number(obs.forecast_return || 0), positive: 'Positive forecast bias supports continuation.', negative: 'Negative forecast bias leans toward defense.' }
    ];

    function supportScore(item){
      var value = Number(item.value || 0);
      if (currentAction === 'reduce_risk') {
        if (item.key === 'anomaly_score' || item.key === 'event_risk' || item.key === 'risk_pressure' || item.key === 'volatility_5') return value;
        if (item.key === 'forecast_return' || item.key === 'trend_3') return Math.max(0, -value * 12);
        if (item.key === 'model_spread') return value * 0.7;
      }
      if (currentAction === 'add_hedge') {
        if (item.key === 'event_risk' || item.key === 'volatility_5') return value * 1.1;
        if (item.key === 'risk_pressure' || item.key === 'model_spread') return value * 0.8;
      }
      if (currentAction === 'add_continuation') {
        if (item.key === 'forecast_return' || item.key === 'trend_3') return Math.max(0, value * 12);
        if (item.key === 'agreement_score') return value * 0.8;
        if (item.key === 'risk_pressure') return Math.max(0, 1 - value) * 0.3;
      }
      if (currentAction === 'relative_value_rotation') {
        if (item.key === 'model_spread') return value * 1.2;
        if (item.key === 'agreement_score' || item.key === 'volatility_5') return value * 0.5;
      }
      if (currentAction === 'hold') {
        if (item.key === 'agreement_score') return value * 0.8;
        if (item.key === 'risk_pressure' || item.key === 'event_risk' || item.key === 'volatility_5') return Math.max(0, 0.5 - value);
      }
      return Math.abs(value) * 0.1;
    }

    drivers.forEach(function(item){
      item.support = supportScore(item);
      item.opposition = Math.abs(Number(item.value || 0)) - item.support;
    });

    return {
      positive: drivers.slice().sort(function(a, b){ return b.support - a.support; }).slice(0, 3),
      negative: drivers.slice().sort(function(a, b){ return b.opposition - a.opposition; }).slice(0, 3)
    };
  }

  function renderRlDecisionCard(frontier, neural, neuralFrontier, walkForward, replaySummary){
    if (!neuralFrontier || !neural) return;
    var verdict = getRlVerdict(neural.vs_hold_reward_uplift, walkForward && walkForward.vs_hold_reward_uplift);
    var toneStyles = getRlToneStyles(verdict.tone);
    if ($('intel-rl-decision-title')) $('intel-rl-decision-title').textContent = titleize(neuralFrontier.action || 'hold') + ' · ' + verdict.label;
    if ($('intel-rl-decision-copy')) $('intel-rl-decision-copy').textContent = 'The current policy favors ' + String(neuralFrontier.action || 'hold').replace(/_/g, ' ') + ' with ' + Math.round(Number(neuralFrontier.confidence || 0) * 100) + '% confidence. Replay uplift versus hold is ' + fmtSigned(neural.vs_hold_reward_uplift || 0, 2) + ', walk-forward uplift is ' + fmtSigned(walkForward && walkForward.vs_hold_reward_uplift || 0, 2) + ', and intervention rate is ' + (replaySummary ? Math.round(Number(replaySummary.intervention_rate || 0) * 100) : 0) + '%. Current regime balance is ' + (replaySummary && replaySummary.regime_balance_score != null ? Math.round(Number(replaySummary.regime_balance_score || 0) * 100) : 0) + '% with non-hold value add ' + (replaySummary && replaySummary.non_hold_value_add != null ? fmtSigned(replaySummary.non_hold_value_add, 2) : '—') + '.';
    var pills = [];
    pills.push('<div class="intel-rl-pill"><strong>Confidence</strong> ' + Math.round(Number(neuralFrontier.confidence || 0) * 100) + '%</div>');
    pills.push('<div class="intel-rl-pill" style="' + toneStyles.pill + '"><strong>Replay uplift</strong> ' + fmtSigned(neural.vs_hold_reward_uplift || 0, 2) + '</div>');
    pills.push('<div class="intel-rl-pill" style="' + getRlToneStyles((walkForward && walkForward.vs_hold_reward_uplift || 0) >= 0 ? 'better' : 'worse').pill + '"><strong>Walk uplift</strong> ' + fmtSigned(walkForward && walkForward.vs_hold_reward_uplift || 0, 2) + '</div>');
    pills.push('<div class="intel-rl-pill"><strong>Entropy</strong> ' + (replaySummary ? Math.round(Number(replaySummary.action_entropy || 0) * 100) : 0) + '%</div>');
    pills.push('<div class="intel-rl-pill"><strong>Intervention</strong> ' + (replaySummary ? Math.round(Number(replaySummary.intervention_rate || 0) * 100) : 0) + '%</div>');
    if (replaySummary && replaySummary.regime_balance_score != null) pills.push('<div class="intel-rl-pill"><strong>Regime balance</strong> ' + Math.round(Number(replaySummary.regime_balance_score || 0) * 100) + '%</div>');
    if (replaySummary && replaySummary.dominant_action_share != null) pills.push('<div class="intel-rl-pill"><strong>Dominant action</strong> ' + Math.round(Number(replaySummary.dominant_action_share || 0) * 100) + '%</div>');
    if (replaySummary && replaySummary.non_hold_value_add != null) pills.push('<div class="intel-rl-pill"><strong>Intervention edge</strong> ' + fmtSigned(replaySummary.non_hold_value_add || 0, 2) + '</div>');
    pills.push('<div class="intel-rl-pill" style="' + toneStyles.pill + '"><strong>Verdict</strong> ' + verdict.label + '</div>');
    if (frontier) pills.push('<div class="intel-rl-pill"><strong>Baseline</strong> ' + titleize(frontier.offline_action || 'hold') + '</div>');
    if (replaySummary) pills.push('<div class="intel-rl-pill"><strong>Replay win rate</strong> ' + fmtConfidence(replaySummary.win_rate) + '</div>');
    if ($('intel-rl-decision-pills')) $('intel-rl-decision-pills').innerHTML = pills.join('');
  }

  function renderRlTrustStrip(neural, walkForward, replaySummary, neuralFrontier){
    var target = $('intel-rl-trust-strip');
    if (!target || !neural) return;
    target.innerHTML = getRlTrustFlags(neural, walkForward, replaySummary, neuralFrontier).map(function(item){
      var toneStyles = getRlToneStyles(item.tone);
      return '<div class="intel-rl-pill" style="' + toneStyles.pill + '"><strong>' + escapeHtml(item.label) + '</strong> ' + escapeHtml(item.value) + '</div>';
    }).join('');
  }

  function renderRlBaselineTable(frontier, benchmark, neural, neuralFrontier, walkForward, replaySummary){
    var target = $('intel-rl-baseline-table-body');
    if (!target || !neural || !frontier || !neuralFrontier) return;
    var hold = neural.hold_baseline || {};
    var holdReward = Number(hold.total_reward || 0);
    var offlineBenchmark = benchmark && benchmark.offline ? benchmark.offline : null;
    var ppoBenchmark = benchmark && benchmark.ppo ? benchmark.ppo : null;
    var offlineReward = offlineBenchmark && offlineBenchmark.total_reward != null ? Number(offlineBenchmark.total_reward) : null;
    var ppoReward = ppoBenchmark && ppoBenchmark.total_reward != null ? Number(ppoBenchmark.total_reward) : null;
    var rows = [
      { name: 'Hold baseline', action: 'hold', confidence: 1, reward: holdReward, replayUplift: 0, walkUplift: 0, verdict: { label: 'Baseline', tone: 'unclear' } },
      { name: 'Offline policy', action: frontier.offline_action || getTopActionFromCounts(offlineBenchmark && offlineBenchmark.action_counts) || 'hold', confidence: frontier.offline_confidence != null ? frontier.offline_confidence : null, reward: offlineReward, replayUplift: offlineReward == null ? null : offlineReward - holdReward, walkUplift: null, verdict: getRlVerdict(offlineReward == null ? null : offlineReward - holdReward, null) },
      { name: 'PPO bootstrap', action: frontier.ppo_action || getTopActionFromCounts(ppoBenchmark && ppoBenchmark.action_counts) || 'hold', confidence: frontier.ppo_confidence != null ? frontier.ppo_confidence : null, reward: ppoReward, replayUplift: ppoReward == null ? null : ppoReward - holdReward, walkUplift: null, verdict: getRlVerdict(ppoReward == null ? null : ppoReward - holdReward, null) },
      { name: 'Neural PPO', action: neuralFrontier.action || 'hold', confidence: neuralFrontier.confidence || 0, reward: replaySummary && replaySummary.total_reward, replayUplift: neural.vs_hold_reward_uplift, walkUplift: walkForward && walkForward.vs_hold_reward_uplift, verdict: getRlVerdict(neural.vs_hold_reward_uplift, walkForward && walkForward.vs_hold_reward_uplift) }
    ];
    target.innerHTML = rows.map(function(row){
      var toneStyles = getRlToneStyles(row.verdict.tone);
      return '<tr>' +
        '<td>' + escapeHtml(row.name) + '</td>' +
        '<td>' + escapeHtml(titleize(row.action || 'hold')) + '</td>' +
        '<td>' + fmtConfidence(row.confidence) + '</td>' +
        '<td>' + fmtMetric(row.reward, 3, false) + '</td>' +
        '<td>' + fmtMetric(row.replayUplift, 2, true) + '</td>' +
        '<td>' + fmtMetric(row.walkUplift, 2, true) + '</td>' +
        '<td><span class="intel-price-badge" style="' + toneStyles.badge + '">' + escapeHtml(row.verdict.label) + '</span></td>' +
      '</tr>';
    }).join('');
  }

  function renderRlWhyPanel(frontier, neuralFrontier, replayItems){
    var target = $('intel-rl-why-panel');
    if (!target || !frontier || !neuralFrontier) return;
    var observation = frontier.observation || {};
    var drivers = deriveRlDrivers(observation, neuralFrontier.action);
    var sameCommodityAnalogs = safeArray(replayItems).filter(function(item){ return item.commodity === state.selected; });
    var analogs = sameCommodityAnalogs.filter(function(item){ return item.neural_action === neuralFrontier.action; }).slice(0, 3);
    if (!analogs.length) analogs = sameCommodityAnalogs.slice(0, 3);
    var topAction = titleize(neuralFrontier.action || 'hold');
    var reasonCopy = 'The policy favors ' + topAction + ' because ' + drivers.positive.slice(0, 2).map(function(item){ return item.label.toLowerCase(); }).join(' and ') + ' are currently outweighing a passive hold posture.';
    function renderDriver(item, mode){
      var score = mode === 'positive' ? Number(item.support || 0) : Number(item.opposition || 0);
      var copy = mode === 'positive' ? item.positive : item.negative;
      return '<div class="intel-rl-driver"><div class="intel-rl-driver-head"><strong>' + escapeHtml(item.label) + '</strong><span>' + fmtMetric(item.value, 2, false) + '</span></div><div class="intel-rl-driver-bar"><i style="width:' + Math.round(clamp(score * 100, 8, 100)) + '%;"></i></div><div class="intel-rl-driver-copy">' + escapeHtml(copy) + '</div></div>';
    }
    target.innerHTML = [
      '<div class="intel-insight-card"><div class="intel-insight-title">Reason code</div><div class="intel-insight-copy">' + escapeHtml(reasonCopy) + '</div></div>',
      '<div class="intel-rl-stack">' + drivers.positive.map(function(item){ return renderDriver(item, 'positive'); }).join('') + '</div>',
      '<div class="intel-rl-stack">' + drivers.negative.map(function(item){ return renderDriver(item, 'negative'); }).join('') + '</div>',
      '<div class="intel-insight-card"><div class="intel-insight-title">Historical analogs</div><div class="intel-insight-copy">' + (analogs.length ? analogs.map(function(item){ return escapeHtml((item.timestamp || 'n/a') + ' · ' + titleize(item.neural_action || 'hold') + ' · target ' + fmtPct(Number(item.target_return || 0) * 100) + ' · confidence ' + fmtConfidence(item.neural_confidence)); }).join('<br>') : 'No same-commodity analogs available in the latest replay sample.') + '</div></div>'
    ].join('');
  }

  function renderRlScenarioPanel(frontier, neuralFrontier){
    var target = $('intel-rl-scenario-panel');
    if (!target || !frontier) return;
    var observation = frontier.observation || {};
    var currentAction = String(neuralFrontier && neuralFrontier.action || frontier.neural_action || frontier.ppo_action || frontier.offline_action || 'hold');
    var currentConfidence = Number(neuralFrontier && neuralFrontier.confidence || frontier.neural_confidence || 0);
    var currentProbabilities = neuralFrontier && neuralFrontier.probabilities ? neuralFrontier.probabilities : scoreScenarioActions(observation);
    var baseState = {
      event_risk: Number(observation.event_risk || 0),
      volatility_5: Number(observation.volatility_5 || 0),
      agreement_score: Number(observation.agreement_score || 0.5),
      model_spread: Number(observation.model_spread || 0),
      trend_3: Number(observation.trend_3 || 0)
    };
    target.innerHTML = '' +
      '<div class="intel-workflow-grid">' +
        '<label class="intel-workflow-card">Event risk<input id="intel-rl-scenario-event" type="range" min="0" max="1" step="0.01" value="' + baseState.event_risk.toFixed(2) + '"><strong id="intel-rl-scenario-event-value">' + baseState.event_risk.toFixed(2) + '</strong></label>' +
        '<label class="intel-workflow-card">Volatility<input id="intel-rl-scenario-vol" type="range" min="0" max="1" step="0.01" value="' + baseState.volatility_5.toFixed(2) + '"><strong id="intel-rl-scenario-vol-value">' + baseState.volatility_5.toFixed(2) + '</strong></label>' +
        '<label class="intel-workflow-card">Agreement<input id="intel-rl-scenario-agreement" type="range" min="0" max="1" step="0.01" value="' + baseState.agreement_score.toFixed(2) + '"><strong id="intel-rl-scenario-agreement-value">' + baseState.agreement_score.toFixed(2) + '</strong></label>' +
        '<label class="intel-workflow-card">Disagreement<input id="intel-rl-scenario-spread" type="range" min="0" max="1" step="0.01" value="' + Math.min(1, baseState.model_spread).toFixed(2) + '"><strong id="intel-rl-scenario-spread-value">' + Math.min(1, baseState.model_spread).toFixed(2) + '</strong></label>' +
        '<label class="intel-workflow-card">Trend<input id="intel-rl-scenario-trend" type="range" min="-0.05" max="0.05" step="0.001" value="' + baseState.trend_3.toFixed(3) + '"><strong id="intel-rl-scenario-trend-value">' + baseState.trend_3.toFixed(3) + '</strong></label>' +
      '</div>' +
      '<div class="intel-actions" style="margin-top:12px;">' +
        '<button type="button" class="intel-btn intel-btn-ghost" data-rl-preset="supply_shock">Supply shock</button>' +
        '<button type="button" class="intel-btn intel-btn-ghost" data-rl-preset="demand_collapse">Demand collapse</button>' +
        '<button type="button" class="intel-btn intel-btn-ghost" data-rl-preset="volatility_spike">Volatility spike</button>' +
        '<button type="button" class="intel-btn intel-btn-ghost" data-rl-preset="consensus_recovery">Consensus recovery</button>' +
        '<button type="button" class="intel-btn intel-btn-ghost" data-rl-preset="risk_off">Risk-off regime</button>' +
      '</div>' +
      '<div class="intel-rl-pill-row" id="intel-rl-scenario-metrics" style="margin-top:12px;"></div>' +
      '<div class="intel-summary" id="intel-rl-scenario-result" style="margin-top:12px;">Scenario approximation is loading…</div>';

    function computeScenario(){
      var scenarioObs = Object.assign({}, observation);
      scenarioObs.event_risk = Number(($('intel-rl-scenario-event') || {}).value || baseState.event_risk);
      scenarioObs.volatility_5 = Number(($('intel-rl-scenario-vol') || {}).value || baseState.volatility_5);
      scenarioObs.agreement_score = Number(($('intel-rl-scenario-agreement') || {}).value || baseState.agreement_score);
      scenarioObs.model_spread = Number(($('intel-rl-scenario-spread') || {}).value || baseState.model_spread);
      scenarioObs.trend_3 = Number(($('intel-rl-scenario-trend') || {}).value || baseState.trend_3);
      scenarioObs.risk_pressure = Math.min(1, Number(scenarioObs.anomaly_score || 0) * 0.4 + scenarioObs.event_risk * 0.35 + scenarioObs.model_spread * 0.25 + Math.max(0, -scenarioObs.trend_3) * 4);
      var probabilities = scoreScenarioActions(scenarioObs);
      var ranked = Object.keys(probabilities).sort(function(a, b){ return probabilities[b] - probabilities[a]; });
      var action = ranked[0] || 'hold';
      var altAction = ranked[1] || 'hold';
      var result = $('intel-rl-scenario-result');
      var metrics = $('intel-rl-scenario-metrics');
      var referenceConfidence = action === currentAction ? currentConfidence : Number(currentProbabilities[action] || 0);
      var confidenceDelta = Number(probabilities[action] || 0) - referenceConfidence;
      var keepCurrent = action === currentAction;
      var eventDelta = Number(scenarioObs.event_risk || 0) - Number(baseState.event_risk || 0);
      var volDelta = Number(scenarioObs.volatility_5 || 0) - Number(baseState.volatility_5 || 0);
      var spreadDelta = Number(scenarioObs.model_spread || 0) - Number(baseState.model_spread || 0);
      var agreementDelta = Number(scenarioObs.agreement_score || 0) - Number(baseState.agreement_score || 0);
      var trendDelta = Number(scenarioObs.trend_3 || 0) - Number(baseState.trend_3 || 0);
      var strongestDriver = 'model disagreement';
      var driverMagnitude = Math.abs(spreadDelta);
      if (Math.abs(eventDelta) > driverMagnitude) { strongestDriver = 'event risk'; driverMagnitude = Math.abs(eventDelta); }
      if (Math.abs(volDelta) > driverMagnitude) { strongestDriver = 'volatility'; driverMagnitude = Math.abs(volDelta); }
      if (Math.abs(agreementDelta) > driverMagnitude) { strongestDriver = 'agreement'; driverMagnitude = Math.abs(agreementDelta); }
      if (Math.abs(trendDelta) > driverMagnitude) { strongestDriver = 'trend'; driverMagnitude = Math.abs(trendDelta); }
      var summary = 'Scenario approximation → ' + titleize(action) + ' (' + Math.round(Number(probabilities[action] || 0) * 100) + '% confidence). ';
      summary += keepCurrent ? 'This keeps the current recommendation intact' : 'This would flip the recommendation away from ' + titleize(currentAction);
      summary += ' · delta vs current signal ' + fmtSigned(confidenceDelta, 2) + '. ';
      summary += 'The strongest flip driver is ' + strongestDriver + ', while the top fallback is ' + titleize(altAction) + ' at ' + fmtConfidence(probabilities[altAction]) + '.';
      if (result) result.textContent = summary;
      if (metrics) {
        metrics.innerHTML = [
          '<div class="intel-rl-pill"><strong>Current</strong> ' + titleize(currentAction) + ' ' + fmtConfidence(currentConfidence) + '</div>',
          '<div class="intel-rl-pill"><strong>Scenario</strong> ' + titleize(action) + ' ' + fmtConfidence(probabilities[action]) + '</div>',
          '<div class="intel-rl-pill"><strong>Confidence delta</strong> ' + fmtSigned(confidenceDelta, 2) + '</div>',
          '<div class="intel-rl-pill"><strong>Flip status</strong> ' + (keepCurrent ? 'No flip' : 'Flip to ' + titleize(action)) + '</div>',
          '<div class="intel-rl-pill"><strong>Pressure delta</strong> ' + fmtSigned(Number(scenarioObs.risk_pressure || 0) - Number(observation.risk_pressure || 0), 2) + '</div>',
          '<div class="intel-rl-pill"><strong>Top alternative</strong> ' + titleize(altAction) + ' ' + fmtConfidence(probabilities[altAction]) + '</div>'
        ].join('');
      }
      ['event', 'vol', 'agreement', 'spread', 'trend'].forEach(function(key){
        var input = $('intel-rl-scenario-' + key);
        var out = $('intel-rl-scenario-' + key + '-value');
        if (input && out) out.textContent = Number(input.value || 0).toFixed(key === 'trend' ? 3 : 2);
      });
    }

    Array.prototype.slice.call(target.querySelectorAll('input[type="range"]')).forEach(function(input){
      input.addEventListener('input', computeScenario);
    });
    Array.prototype.slice.call(target.querySelectorAll('[data-rl-preset]')).forEach(function(button){
      button.addEventListener('click', function(){
        var preset = String(button.getAttribute('data-rl-preset') || '');
        if (preset === 'supply_shock') { $('intel-rl-scenario-event').value = 0.85; $('intel-rl-scenario-vol').value = 0.55; $('intel-rl-scenario-spread').value = 0.35; }
        if (preset === 'demand_collapse') { $('intel-rl-scenario-trend').value = -0.03; $('intel-rl-scenario-event').value = 0.6; $('intel-rl-scenario-agreement').value = 0.42; }
        if (preset === 'volatility_spike') { $('intel-rl-scenario-vol').value = 0.9; $('intel-rl-scenario-spread').value = 0.45; }
        if (preset === 'consensus_recovery') { $('intel-rl-scenario-agreement').value = 0.8; $('intel-rl-scenario-spread').value = 0.08; $('intel-rl-scenario-trend').value = 0.02; }
        if (preset === 'risk_off') { $('intel-rl-scenario-event').value = 0.7; $('intel-rl-scenario-vol').value = 0.6; $('intel-rl-scenario-trend').value = -0.015; }
        computeScenario();
      });
    });
    computeScenario();
  }

  function renderRlAuditTrail(frontier, neural, walkForward, replaySummary, replayItems){
    var target = $('intel-rl-audit-trail');
    if (!target || !neural) return;
    var events = [];
    var selectedProfile = getSelectedProfile(neural);
    events.push({ title: 'Policy artifact refreshed', copy: 'Commit ' + String(state.rlArtifacts && state.rlArtifacts.updated_from_commit || 'unknown') + ' selected the current balanced export profile after held-out replay and walk-forward scoring.' });
    if (selectedProfile) events.push({ title: 'Profile selection winner', copy: 'Selection score ' + fmtMetric(selectedProfile.score, 3, false) + ' with replay uplift ' + fmtSigned(selectedProfile.uplift_vs_hold || 0, 2) + ', walk uplift ' + fmtSigned(selectedProfile.walk_uplift_vs_hold || 0, 2) + ', regime balance ' + fmtConfidence(selectedProfile.regime_balance_score) + ', and dominant action share ' + fmtConfidence(selectedProfile.dominant_action_share) + '.' });
    if (frontier) events.push({ title: 'Recommendation issued', copy: titleize(state.selected) + ' was assigned ' + titleize(frontier.neural_action || frontier.ppo_action || 'hold') + ' at ' + Math.round(Number(frontier.neural_confidence || 0) * 100) + '% confidence.' });
    if (walkForward) events.push({ title: 'Walk-forward review', copy: 'Positive windows ' + Math.round(Number(walkForward.positive_window_rate || 0) * 100) + '% with uplift vs hold ' + fmtSigned(walkForward.vs_hold_reward_uplift || 0, 2) + '.' });
    if (replaySummary) events.push({ title: 'Replay outcome snapshot', copy: 'Replay final equity ' + Number(replaySummary.final_equity || 0).toFixed(3) + ' and action diversity ' + Math.round(Number(replaySummary.action_diversity || 0) * 100) + '%.' });
    if (replaySummary && Number(replaySummary.total_reward || 0) < 0) events.push({ title: 'Risk note', copy: 'Replay total reward remains negative, so this recommendation should be treated as decision support rather than direct execution.' });
    safeArray(replayItems).slice(0, 2).forEach(function(item, idx){
      events.push({ title: 'Replay evidence ' + (idx + 1), copy: titleize(item.commodity || state.selected) + ' · ' + (item.timestamp || 'n/a') + ' · neural ' + titleize(item.neural_action || 'hold') + ' · target ' + fmtPct(Number(item.target_return || 0) * 100) + '.' });
    });
    target.innerHTML = events.map(function(item, idx){
      return '<div class="intel-rl-step"><div class="intel-kicker">Event ' + (idx + 1) + '</div><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.copy) + '</span></div>';
    }).join('');
  }

  function renderRlObservabilityRadar(frontier, neuralFrontier, replaySummary){
    var analytics = window.CNPremiumAnalytics;
    if (!analytics || !frontier || !neuralFrontier) return;
    var observation = frontier.observation || {};
    var board = analytics.buildPolicyObservability({
      actions: Object.keys(neuralFrontier.probabilities || {}).map(function(key){ return { label: titleize(key), probability: neuralFrontier.probabilities[key] }; }),
      drivers: [
        { label:'Agreement', score: clamp((1 - Number(observation.disagreement_7 || 0)) * 100, 0, 100) },
        { label:'Event risk', score: clamp(Number(observation.event_risk || 0) * 100, 0, 100) },
        { label:'Volatility', score: clamp(Number(observation.volatility_20 || 0) * 100, 0, 100) },
        { label:'Trend', score: clamp(50 + Number(observation.trend_3 || 0) * 1000, 0, 100) }
      ],
      stateVector: [
        { label:'Agreement', value: clamp((1 - Number(observation.disagreement_7 || 0)) * 100, 0, 100) },
        { label:'Event risk', value: clamp(Number(observation.event_risk || 0) * 100, 0, 100) },
        { label:'Volatility', value: clamp(Number(observation.volatility_20 || 0) * 100, 0, 100) },
        { label:'Trend', value: clamp(50 + Number(observation.trend_3 || 0) * 1000, 0, 100) },
        { label:'Replay trust', value: clamp(50 + Number((replaySummary && replaySummary.vs_hold_reward_uplift) || 0) * 100, 0, 100) }
      ]
    });
    ensureRlChart('intel-rl-observability-chart', {
      type: 'radar',
      data: {
        labels: board.stateVector.map(function(item){ return item.label; }),
        datasets: [{
          label: 'Observability',
          data: board.stateVector.map(function(item){ return item.value; }),
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,0.18)',
          pointBackgroundColor: '#a855f7',
          borderWidth: 2
        }]
      },
      options: {
        scales: { r: { min:0, max:100, grid:{ color:'rgba(255,255,255,0.08)' }, angleLines:{ color:'rgba(255,255,255,0.08)' }, pointLabels:{ color:'#cbd5e1', font:{ size:11 } }, ticks:{ display:false }, suggestedMin:0, suggestedMax:100 } },
        plugins: { legend: { display:false } }
      }
    });
  }

  function renderRlObservabilityBoard(frontier, neural, neuralFrontier, walkForward, replaySummary){
    var band = $('intel-rl-console-band');
    var note = $('intel-rl-console-note');
    if (!band || !neuralFrontier || !neural) return;
    var verdict = getRlVerdict(neural.vs_hold_reward_uplift, walkForward && walkForward.vs_hold_reward_uplift);
    var selectedProfile = getSelectedProfile(neural);
    var observation = frontier && frontier.observation ? frontier.observation : {};
    var pressure = Number(observation.risk_pressure || 0);
    var agreement = Number(observation.agreement_score || 0);
    var eventRisk = Number(observation.event_risk || 0);
    var bandCards = [
      { label: 'Active action', value: titleize(neuralFrontier.action || 'hold'), copy: 'Live policy output for ' + titleize(state.selected) + '.' },
      { label: 'Confidence', value: fmtConfidence(neuralFrontier.confidence), copy: 'Current probability assigned to the active action.' },
      { label: 'Replay edge', value: fmtSigned(neural.vs_hold_reward_uplift || 0, 2), copy: 'Reward uplift versus a passive hold baseline.' },
      { label: 'Walk robustness', value: walkForward ? fmtConfidence(walkForward.positive_window_rate) : '—', copy: walkForward ? 'Positive unseen windows with walk uplift ' + fmtSigned(walkForward.vs_hold_reward_uplift || 0, 2) + '.' : 'Walk-forward report unavailable.' },
      { label: 'Risk pressure', value: Math.round(pressure * 100) + '%', copy: 'Composite defensive pressure from anomaly, event, spread, and trend.' },
      { label: 'Governance', value: selectedProfile ? fmtMetric(selectedProfile.score, 3, false) : verdict.label, copy: selectedProfile ? 'Selection score for ' + String(neural.selected_device || 'n/a') + ' · ' + String(neural.selected_timesteps || 'n/a') + ' steps.' : 'Profile selection details unavailable.' }
    ];
    band.innerHTML = bandCards.map(function(item){
      return '<div class="intel-rl-stat-card"><div class="intel-rl-stat-label">' + escapeHtml(item.label) + '</div><div class="intel-rl-stat-value">' + escapeHtml(item.value) + '</div><div class="intel-rl-stat-copy">' + escapeHtml(item.copy) + '</div></div>';
    }).join('');
    if (note) {
      note.innerHTML = '<strong>State note:</strong> Agreement is ' + fmtConfidence(agreement) + ', event risk is ' + fmtConfidence(eventRisk) + ', and the current baseline verdict is ' + escapeHtml(verdict.label) + '. This board is showing decision support observability only — not autonomous execution.';
    }
  }

  function renderRlStateVector(frontier, neuralFrontier){
    if (!frontier || !neuralFrontier) return;
    var observation = frontier.observation || {};
    var metrics = [
      { key: 'agreement_score', label: 'Agreement', value: clamp(Number(observation.agreement_score || 0) * 100, 0, 100), copy: 'Higher agreement supports directional conviction.' },
      { key: 'event_risk', label: 'Event risk', value: clamp(Number(observation.event_risk || 0) * 100, 0, 100), copy: 'Catalyst pressure raises hedge and defense value.' },
      { key: 'volatility_5', label: 'Volatility', value: clamp(Number(observation.volatility_5 || 0) * 100, 0, 100), copy: 'Short-horizon turbulence in the state.' },
      { key: 'model_spread', label: 'Disagreement', value: clamp(Number(observation.model_spread || 0) * 100, 0, 100), copy: 'Model spread pushes rotation or caution.' },
      { key: 'risk_pressure', label: 'Risk pressure', value: clamp(Number(observation.risk_pressure || 0) * 100, 0, 100), copy: 'Composite defensive pressure felt by the policy.' },
      { key: 'trend_3', label: 'Trend', value: clamp(50 + Number(observation.trend_3 || 0) * 1000, 0, 100), copy: 'Short trend normalized around neutral.' }
    ];
    ensureRlChart('intel-rl-state-chart', {
      type: 'bar',
      data: {
        labels: metrics.map(function(item){ return item.label; }),
        datasets: [{
          label: 'Normalized state weight',
          data: metrics.map(function(item){ return item.value; }),
          backgroundColor: ['rgba(34,211,238,0.65)','rgba(248,113,113,0.65)','rgba(251,191,36,0.65)','rgba(192,132,252,0.65)','rgba(59,130,246,0.65)','rgba(34,197,94,0.65)'],
          borderColor: ['#22d3ee','#f87171','#fbbf24','#c084fc','#3b82f6','#22c55e'],
          borderWidth: 1,
          borderRadius: 10
        }]
      },
      options: chartOptions(100)
    });
    var pills = $('intel-rl-state-pills');
    if (pills) {
      pills.innerHTML = metrics.map(function(item){
        return '<div class="intel-rl-pill"><strong>' + escapeHtml(item.label) + '</strong> ' + Math.round(item.value) + '%</div>';
      }).join('');
    }
  }

  function renderRlGovernancePanel(neural, walkForward, replaySummary){
    var target = $('intel-rl-governance-panel');
    if (!target || !neural) return;
    var selectedProfile = getSelectedProfile(neural);
    var cards = [];
    cards.push('<div class="intel-rl-governance-card"><strong>Selected export profile</strong><span>' + escapeHtml(String(neural.selected_device || 'n/a') + ' · ' + String(neural.selected_timesteps || 'n/a') + ' steps · prior weight ' + fmtMetric(neural.selected_prior_weight, 2, false)) + '</span></div>');
    if (selectedProfile) {
      cards.push('<div class="intel-rl-governance-card"><strong>Why it won</strong><span>Selection score ' + escapeHtml(fmtMetric(selectedProfile.score, 3, false)) + ' with replay uplift ' + escapeHtml(fmtSigned(selectedProfile.uplift_vs_hold || 0, 2)) + ', walk uplift ' + escapeHtml(fmtSigned(selectedProfile.walk_uplift_vs_hold || 0, 2)) + ', regime balance ' + escapeHtml(fmtConfidence(selectedProfile.regime_balance_score)) + ', and dominant action share ' + escapeHtml(fmtConfidence(selectedProfile.dominant_action_share)) + '.</span></div>');
    }
    cards.push('<div class="intel-rl-mini-grid">' + [
      { label: 'Walk uplift', value: walkForward ? fmtSigned(walkForward.vs_hold_reward_uplift || 0, 2) : '—', copy: 'Out-of-sample uplift versus hold.' },
      { label: 'Replay diversity', value: replaySummary ? fmtConfidence(replaySummary.action_diversity) : '—', copy: 'How much of the action set is used.' },
      { label: 'Dominant share', value: replaySummary ? fmtConfidence(replaySummary.dominant_action_share) : '—', copy: 'How concentrated the active policy is.' }
    ].map(function(item){
      return '<div class="intel-rl-mini-stat"><span class="label">' + escapeHtml(item.label) + '</span><span class="value">' + escapeHtml(item.value) + '</span><span class="copy">' + escapeHtml(item.copy) + '</span></div>';
    }).join('') + '</div>');
    target.innerHTML = cards.join('');
  }

  function renderRlRegimeMatrix(replaySummary){
    var target = $('intel-rl-regime-matrix');
    if (!target || !replaySummary) return;
    var keys = ['continuation', 'risk_off', 'hedge', 'rotation'];
    var hit = replaySummary.regime_hit_rate || {};
    var active = replaySummary.regime_active_counts || {};
    var actionValue = replaySummary.action_value_by_regime || {};
    target.innerHTML = keys.map(function(key){
      var values = actionValue[key] || {};
      var bestAction = Object.keys(values).sort(function(a, b){ return Number(values[b] || -999) - Number(values[a] || -999); })[0] || 'hold';
      var bestValue = values[bestAction] != null ? Number(values[bestAction]) : 0;
      var hitRate = Number(hit[key] || 0);
      var tone = hitRate >= 0.5 ? 'stable' : hitRate >= 0.25 ? 'mixed' : 'fragile';
      return '<div class="intel-rl-regime-cell"><div class="intel-kicker">' + escapeHtml(titleize(key)) + ' · ' + tone + '</div><strong>' + escapeHtml(titleize(bestAction)) + ' ' + fmtSigned(bestValue, 2) + '</strong><span>Hit rate ' + Math.round(hitRate * 100) + '% across ' + Number(active[key] || 0) + ' observed opportunities.</span><span>This is the highest-value action in the current replay decomposition for this regime.</span></div>';
    }).join('');
  }

  function renderRlProbabilitySurface(neuralFrontier){
    if (!neuralFrontier || !neuralFrontier.probabilities) return;
    var labels = Object.keys(neuralFrontier.probabilities).map(function(key){ return titleize(key); });
    var values = Object.keys(neuralFrontier.probabilities).map(function(key){ return Math.round(Number(neuralFrontier.probabilities[key] || 0) * 100); });
    ensureRlChart('intel-rl-action-chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Action probability',
          data: values,
          backgroundColor: ['rgba(250,204,21,0.72)','rgba(148,163,184,0.55)','rgba(34,197,94,0.55)','rgba(59,130,246,0.55)','rgba(192,132,252,0.55)'],
          borderColor: ['#facc15','#94a3b8','#22c55e','#3b82f6','#c084fc'],
          borderWidth: 1,
          borderRadius: 10
        }]
      },
      options: chartOptions(100)
    });
    var pills = $('intel-rl-probability-pills');
    if (pills) {
      pills.innerHTML = Object.keys(neuralFrontier.probabilities).sort(function(a, b){
        return Number(neuralFrontier.probabilities[b]) - Number(neuralFrontier.probabilities[a]);
      }).map(function(key){
        return '<div class="intel-rl-pill"><strong>' + titleize(key) + '</strong> ' + Math.round(Number(neuralFrontier.probabilities[key] || 0) * 100) + '%</div>';
      }).join('');
    }
  }

  function animateRlSurfaces(){
    if (!window.gsap || config.demoKind !== 'rl-policy-lab') return;
    var targets = [
      $('intel-rl-decision-console'),
      document.querySelector('.intel-rl-field-shell'),
      $('intel-rl-premium-panels')
    ].filter(Boolean);
    targets.forEach(function(node, idx){
      window.gsap.killTweensOf(node);
      window.gsap.fromTo(node, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: idx * 0.05 });
    });
    var pills = Array.prototype.slice.call(document.querySelectorAll('#intel-rl-decision-pills .intel-rl-pill, #intel-rl-trust-strip .intel-rl-pill, #intel-rl-field-meta .intel-rl-pill, #intel-rl-regime-pills .intel-rl-pill, #intel-rl-scenario-metrics .intel-rl-pill'));
    if (pills.length) {
      window.gsap.killTweensOf(pills);
      window.gsap.fromTo(pills, { opacity: 0, y: 10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', stagger: 0.03, delay: 0.12 });
    }
    var center = document.querySelector('.intel-rl-field-center');
    if (center) {
      window.gsap.killTweensOf(center);
      window.gsap.fromTo(center, { boxShadow: '0 0 0 rgba(34,211,238,0.0)', scale: 0.98 }, { boxShadow: '0 0 42px rgba(34,211,238,0.22)', scale: 1, duration: 0.8, ease: 'power2.out' });
    }
  }

  function renderRlPolicyField(neuralFrontier, replaySummary, walkForward){
    var wrap = $('intel-rl-field-wrap');
    var canvas = $('intel-rl-field-canvas');
    var meta = $('intel-rl-field-meta');
    if (!wrap || !canvas || !neuralFrontier) return;

    var context = canvas.getContext('2d');
    if (!context) return;
    stopRlFieldAnimation();

    var probabilities = neuralFrontier.probabilities || {};
    var actions = ['reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation'];
    var colors = {
      reduce_risk: 'rgba(248,113,113,1)',
      hold: 'rgba(148,163,184,1)',
      add_continuation: 'rgba(34,197,94,1)',
      add_hedge: 'rgba(56,189,248,1)',
      relative_value_rotation: 'rgba(192,132,252,1)'
    };

    function updateNodeLabels(){
      actions.forEach(function(action){
        var node = $('intel-rl-node-' + action);
        if (!node) return;
        var span = node.querySelector('span');
        if (span) span.textContent = Math.round(Number(probabilities[action] || 0) * 100) + '%';
        node.classList.toggle('active', action === neuralFrontier.action);
      });
      if ($('intel-rl-field-center-action')) $('intel-rl-field-center-action').textContent = titleize(neuralFrontier.action || 'hold');
      var entropyText = replaySummary && replaySummary.action_entropy != null ? Math.round(Number(replaySummary.action_entropy || 0) * 100) + '% entropy' : 'Probability-weighted field';
      if ($('intel-rl-field-center-copy')) $('intel-rl-field-center-copy').textContent = entropyText;
      if (meta) {
        var regime = replaySummary && replaySummary.regime_hit_rate ? replaySummary.regime_hit_rate : {};
        var activeCounts = replaySummary && replaySummary.regime_active_counts ? replaySummary.regime_active_counts : {};
        meta.innerHTML = [
          '<div class="intel-rl-pill"><strong>Intervention</strong> ' + (replaySummary ? Math.round(Number(replaySummary.intervention_rate || 0) * 100) + '%' : '—') + '</div>',
          '<div class="intel-rl-pill"><strong>Hold share</strong> ' + (replaySummary ? Math.round(Number(replaySummary.hold_share || 0) * 100) + '%' : '—') + '</div>',
          '<div class="intel-rl-pill"><strong>Risk-off hit</strong> ' + (regime.risk_off != null ? Math.round(Number(regime.risk_off || 0) * 100) + '%' : '—') + '</div>',
          '<div class="intel-rl-pill"><strong>Rotation hit</strong> ' + (regime.rotation != null ? Math.round(Number(regime.rotation || 0) * 100) + '%' : '—') + '</div>',
          '<div class="intel-rl-pill"><strong>Active regimes</strong> ' + Object.keys(activeCounts).map(function(key){ return Number(activeCounts[key] || 0); }).reduce(function(sum, value){ return sum + value; }, 0) + '</div>',
          '<div class="intel-rl-pill"><strong>Walk uplift</strong> ' + (walkForward && walkForward.vs_hold_reward_uplift != null ? fmtSigned(walkForward.vs_hold_reward_uplift, 2) : '—') + '</div>'
        ].join('');
      }
    }

    function getGeometry(){
      var rect = wrap.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(320 * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      var width = rect.width;
      var height = 320;
      return {
        width: width,
        height: height,
        center: { x: width * 0.5, y: height * 0.5 },
        anchors: {
          reduce_risk: { x: width * 0.16, y: height * 0.28 },
          hold: { x: width * 0.84, y: height * 0.28 },
          add_continuation: { x: width * 0.82, y: height * 0.78 },
          add_hedge: { x: width * 0.18, y: height * 0.78 },
          relative_value_rotation: { x: width * 0.5, y: height * 0.14 }
        }
      };
    }

    function rebuildParticles(){
      state.rlField.particles = [];
      actions.forEach(function(action){
        var count = Math.max(3, Math.round(6 + Number(probabilities[action] || 0) * 18));
        for (var i = 0; i < count; i++) {
          state.rlField.particles.push({
            action: action,
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.006 + Number(probabilities[action] || 0) * 0.01,
            size: 1.4 + Number(probabilities[action] || 0) * 4 + Math.random() * 1.4,
            alpha: 0.15 + Number(probabilities[action] || 0) * 0.7,
            phase: Math.random() * Math.PI * 2
          });
        }
      });
    }

    updateNodeLabels();
    rebuildParticles();
    if (!state.rlField.resizeBound) {
      window.addEventListener('resize', function(){
        if (config.demoKind === 'rl-policy-lab' && getNeuralFrontierForSelected()) {
          var neural = getNeuralPolicy();
          renderRlPolicyField(getNeuralFrontierForSelected(), neural && neural.replay_summary, neural && neural.walk_forward);
        }
      });
      state.rlField.resizeBound = true;
    }

    function drawFrame(){
      var geo = getGeometry();
      var width = geo.width;
      var height = geo.height;
      context.clearRect(0, 0, width, height);

      var ambient = context.createRadialGradient(geo.center.x, geo.center.y, 12, geo.center.x, geo.center.y, width * 0.5);
      ambient.addColorStop(0, 'rgba(34,211,238,0.14)');
      ambient.addColorStop(0.55, 'rgba(34,211,238,0.02)');
      ambient.addColorStop(1, 'rgba(2,6,23,0)');
      context.fillStyle = ambient;
      context.fillRect(0, 0, width, height);

      actions.forEach(function(action){
        var anchor = geo.anchors[action];
        var strength = Number(probabilities[action] || 0);
        var ctrl = { x: (anchor.x + geo.center.x) / 2, y: (anchor.y + geo.center.y) / 2 - (action === 'relative_value_rotation' ? 24 : 0) + (action === 'add_hedge' ? 18 : 0) - (action === 'hold' ? 12 : 0) };
        context.beginPath();
        context.moveTo(anchor.x, anchor.y);
        context.quadraticCurveTo(ctrl.x, ctrl.y, geo.center.x, geo.center.y);
        context.strokeStyle = 'rgba(255,255,255,' + (0.06 + strength * 0.22) + ')';
        context.lineWidth = 1 + strength * 3;
        context.stroke();

        context.beginPath();
        context.arc(anchor.x, anchor.y, 5 + strength * 10, 0, Math.PI * 2);
        context.fillStyle = colors[action].replace(',1)', ',' + (0.12 + strength * 0.18) + ')');
        context.fill();
      });

      state.rlField.particles.forEach(function(particle){
        particle.progress += particle.speed;
        if (particle.progress >= 1) particle.progress -= 1;
        var anchor = geo.anchors[particle.action];
        var ctrl = { x: (anchor.x + geo.center.x) / 2, y: (anchor.y + geo.center.y) / 2 - (particle.action === 'relative_value_rotation' ? 24 : 0) + (particle.action === 'add_hedge' ? 18 : 0) - (particle.action === 'hold' ? 12 : 0) };
        var t = particle.progress;
        var omt = 1 - t;
        var x = omt * omt * anchor.x + 2 * omt * t * ctrl.x + t * t * geo.center.x;
        var y = omt * omt * anchor.y + 2 * omt * t * ctrl.y + t * t * geo.center.y + Math.sin((t * Math.PI * 2) + particle.phase) * 2.5;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fillStyle = colors[particle.action].replace(',1)', ',' + particle.alpha + ')');
        context.fill();
      });

      context.beginPath();
      context.arc(geo.center.x, geo.center.y, 26 + Math.sin(Date.now() / 260) * 6, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(34,211,238,0.22)';
      context.lineWidth = 2;
      context.stroke();

      state.rlField.frame = requestAnimationFrame(drawFrame);
    }

    if (window.gsap) {
      window.gsap.fromTo('.intel-rl-field-node', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out' });
    }
    drawFrame();
  }

  function renderRlPolicyComparison(frontier, neuralFrontier){
    if (!frontier || !neuralFrontier) return;
    var actionOrder = ['reduce_risk', 'hold', 'add_continuation', 'add_hedge', 'relative_value_rotation'];
    var actionScores = {};
    actionOrder.forEach(function(action){ actionScores[action] = 0; });
    actionScores[String(frontier.offline_action || 'hold')] = Math.round(Number(frontier.offline_confidence || 0) * 100);
    var ppoScores = {};
    actionOrder.forEach(function(action){ ppoScores[action] = 0; });
    ppoScores[String(frontier.ppo_action || 'hold')] = Math.round(Number(frontier.ppo_confidence || 0) * 100);
    var neuralScores = {};
    actionOrder.forEach(function(action){ neuralScores[action] = Math.round(Number((neuralFrontier.probabilities || {})[action] || 0) * 100); });
    ensureRlChart('intel-rl-policy-compare-chart', {
      type: 'bar',
      data: {
        labels: actionOrder.map(function(action){ return titleize(action); }),
        datasets: [
          { label: 'Offline', data: actionOrder.map(function(action){ return actionScores[action]; }), backgroundColor: 'rgba(34,197,94,0.55)', borderColor: '#22c55e', borderRadius: 8, borderWidth: 1 },
          { label: 'PPO bootstrap', data: actionOrder.map(function(action){ return ppoScores[action]; }), backgroundColor: 'rgba(56,189,248,0.55)', borderColor: '#38bdf8', borderRadius: 8, borderWidth: 1 },
          { label: 'Neural PPO', data: actionOrder.map(function(action){ return neuralScores[action]; }), backgroundColor: 'rgba(250,204,21,0.62)', borderColor: '#facc15', borderRadius: 8, borderWidth: 1 }
        ]
      },
      options: multiChartOptions()
    });
  }

  function renderRlRegimeBalance(replaySummary){
    if (!replaySummary) return;
    var hit = replaySummary.regime_hit_rate || {};
    var active = replaySummary.regime_active_counts || {};
    var labels = ['Continuation', 'Risk-off', 'Hedge', 'Rotation'];
    var keys = ['continuation', 'risk_off', 'hedge', 'rotation'];
    ensureRlChart('intel-rl-regime-chart', {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Hit rate',
            data: keys.map(function(key){ return Math.round(Number(hit[key] || 0) * 100); }),
            backgroundColor: 'rgba(34,211,238,0.16)',
            borderColor: '#22d3ee',
            pointBackgroundColor: '#22d3ee',
            pointBorderColor: '#22d3ee',
            borderWidth: 2
          },
          {
            label: 'Opportunity count',
            data: keys.map(function(key){ return Number(active[key] || 0); }),
            backgroundColor: 'rgba(168,85,247,0.12)',
            borderColor: '#a855f7',
            pointBackgroundColor: '#c084fc',
            pointBorderColor: '#c084fc',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(148,163,184,0.12)' },
            grid: { color: 'rgba(148,163,184,0.12)' },
            pointLabels: { color: '#cbd5e1', font: { size: 11, weight: '600' } },
            ticks: { display: false },
            suggestedMin: 0
          }
        },
        plugins: {
          legend: { labels: { color: '#cbd5e1', boxWidth: 12 } }
        }
      }
    });
    var pills = $('intel-rl-regime-pills');
    if (pills) {
      var extras = [];
      if (replaySummary.regime_balance_score != null) extras.push('<div class="intel-rl-pill"><strong>Balance score</strong> ' + Math.round(Number(replaySummary.regime_balance_score || 0) * 100) + '%</div>');
      if (replaySummary.non_hold_value_add != null) extras.push('<div class="intel-rl-pill"><strong>Non-hold edge</strong> ' + fmtSigned(replaySummary.non_hold_value_add || 0, 2) + '</div>');
      keys.forEach(function(key){
        var actionValues = replaySummary.action_value_by_regime && replaySummary.action_value_by_regime[key] ? replaySummary.action_value_by_regime[key] : null;
        if (!actionValues) return;
        var bestAction = Object.keys(actionValues).sort(function(a, b){ return Number(actionValues[b] || -999) - Number(actionValues[a] || -999); })[0];
        if (!bestAction) return;
        extras.push('<div class="intel-rl-pill"><strong>' + titleize(key) + ' value</strong> ' + titleize(bestAction) + ' ' + fmtSigned(actionValues[bestAction] || 0, 2) + '</div>');
      });
      pills.innerHTML = keys.map(function(key){
        return '<div class="intel-rl-pill"><strong>' + titleize(key) + '</strong> ' + Math.round(Number(hit[key] || 0) * 100) + '% · ' + Number(active[key] || 0) + ' active</div>';
      }).concat(extras).join('');
    }
  }

  function renderRlWalkForward(walkForward){
    var target = $('intel-rl-windows');
    if (!target) return;
    var windows = safeArray(walkForward && walkForward.windows);
    target.innerHTML = windows.map(function(window){
      return '<div class="intel-rl-window"><div class="intel-kicker">Window ' + window.window_index + '</div><strong>' + String(window.dominant_action || 'hold').replace(/_/g, ' ') + '</strong><span>' + window.start_timestamp + ' → ' + window.end_timestamp + '</span><span>Reward ' + Number(window.total_reward || 0).toFixed(4) + ' · Equity ' + Number(window.final_equity || 0).toFixed(3) + '</span><span>Drawdown ' + Math.round(Number(window.max_drawdown || 0) * 100) + '% · Eval steps ' + window.eval_steps + '</span></div>';
    }).join('');
  }

  function renderRlEpisodeReplay(replayItems){
    var target = $('intel-rl-timeline');
    if (!target) return;
    target.innerHTML = safeArray(replayItems).slice(0, 5).map(function(item, idx){
      return '<div class="intel-rl-step"><div class="intel-kicker">Replay step ' + (idx + 1) + '</div><strong>' + titleize(item.commodity) + ' · ' + (item.timestamp || 'n/a') + '</strong><span>Expert ' + String(item.expert_action || 'hold').replace(/_/g, ' ') + ' · Offline ' + String(item.offline_action || 'hold').replace(/_/g, ' ') + ' · PPO ' + String(item.ppo_action || 'hold').replace(/_/g, ' ') + ' · Neural ' + String(item.neural_action || 'hold').replace(/_/g, ' ') + '</span><span>Target return ' + fmtPct(Number(item.target_return || 0) * 100) + ' · Neural confidence ' + Math.round(Number(item.neural_confidence || 0) * 100) + '%</span></div>';
    }).join('');
  }

  function renderRlRewardStack(replaySummary){
    if (!replaySummary || !replaySummary.reward_decomposition) return;
    var breakdown = replaySummary.reward_decomposition;
    ensureRlChart('intel-rl-reward-chart', {
      type: 'bar',
      data: {
        labels: ['PnL', 'Turnover', 'Drawdown', 'Concentration', 'Event gap', 'Expert align', 'Regime bonus', 'Missed regime', 'Stale hold'],
        datasets: [{
          label: 'Reward component',
          data: [
            Number(breakdown.pnl || 0),
            -Number(breakdown.turnover_cost || 0),
            -Number(breakdown.drawdown_cost || 0),
            -Number(breakdown.concentration_cost || 0),
            -Number(breakdown.event_gap_cost || 0),
            Number(breakdown.expert_alignment_bonus || 0),
            Number(breakdown.regime_opportunity_bonus || 0),
            -Number(breakdown.missed_regime_cost || 0),
            -Number(breakdown.stale_hold_cost || 0)
          ],
          backgroundColor: ['rgba(34,197,94,0.62)','rgba(244,63,94,0.62)','rgba(244,63,94,0.72)','rgba(251,146,60,0.72)','rgba(168,85,247,0.68)','rgba(34,211,238,0.62)','rgba(250,204,21,0.72)','rgba(239,68,68,0.52)','rgba(148,163,184,0.58)'],
          borderColor: ['#22c55e','#f43f5e','#f43f5e','#fb923c','#a855f7','#22d3ee','#facc15','#ef4444','#94a3b8'],
          borderWidth: 1,
          borderRadius: 10
        }]
      },
      options: multiChartOptions()
    });
  }

  function renderRlTracePills(frontier, neuralFrontier, walkForward, replaySummary){
    var target = $('intel-rl-trace-pills');
    if (!target) return;
    var pills = [];
    if (frontier) pills.push('<div class="intel-rl-pill">Offline ' + String(frontier.offline_action || 'hold').replace(/_/g, ' ') + ' · ' + Math.round(Number(frontier.offline_confidence || 0) * 100) + '%</div>');
    if (frontier) pills.push('<div class="intel-rl-pill">PPO ' + String(frontier.ppo_action || 'hold').replace(/_/g, ' ') + ' · ' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '%</div>');
    if (neuralFrontier) pills.push('<div class="intel-rl-pill">Neural ' + String(neuralFrontier.action || 'hold').replace(/_/g, ' ') + ' · ' + Math.round(Number(neuralFrontier.confidence || 0) * 100) + '%</div>');
    if (walkForward) pills.push('<div class="intel-rl-pill">Walk-forward ' + Math.round(Number(walkForward.positive_window_rate || 0) * 100) + '% positive windows</div>');
    if (walkForward && walkForward.vs_hold_reward_uplift != null) pills.push('<div class="intel-rl-pill">Walk uplift ' + (Number(walkForward.vs_hold_reward_uplift || 0) >= 0 ? '+' : '') + Number(walkForward.vs_hold_reward_uplift || 0).toFixed(2) + '</div>');
    if (replaySummary) pills.push('<div class="intel-rl-pill">Replay final equity ' + Number(replaySummary.final_equity || 0).toFixed(3) + '</div>');
    target.innerHTML = pills.join('');
  }

  function renderRlPremiumPanels(frontier, neural, neuralFrontier, walkForward, replaySummary, episodeReplay){
    setRlPanelsVisible(config.demoKind === 'rl-policy-lab' && !!neuralFrontier);
    if (config.demoKind !== 'rl-policy-lab' || !neuralFrontier) return;
    renderRlProbabilitySurface(neuralFrontier);
    renderRlPolicyComparison(frontier, neuralFrontier);
    renderRlStateVector(frontier, neuralFrontier);
    renderRlRegimeBalance(replaySummary);
    renderRlWalkForward(walkForward);
    renderRlGovernancePanel(neural, walkForward, replaySummary);
    renderRlEpisodeReplay(episodeReplay);
    renderRlRegimeMatrix(replaySummary);
    renderRlRewardStack(replaySummary);
    renderRlTracePills(frontier, neuralFrontier, walkForward, replaySummary);
  }

  function renderPolicyLab(bundle){
    var frontier = getRlFrontierForSelected();
    var benchmark = getRlBenchmark();
    var neural = getNeuralPolicy();
    var neuralFrontier = getNeuralFrontierForSelected();
    var walkForward = neural && neural.walk_forward ? neural.walk_forward : null;
    var replaySummary = neural && neural.replay_summary ? neural.replay_summary : null;
    var episodeReplay = safeArray(state.rlArtifacts && state.rlArtifacts.episode_replay);
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
      if (neural && neural.vs_hold_reward_uplift != null) {
        summaryText += ', replay uplift vs hold ' + (Number(neural.vs_hold_reward_uplift || 0) >= 0 ? '+' : '') + Number(neural.vs_hold_reward_uplift || 0).toFixed(2);
      }
      if (walkForward && walkForward.positive_window_rate != null) {
        summaryText += ', walk-forward hit rate ' + Math.round(Number(walkForward.positive_window_rate || 0) * 100) + '%';
      }
      if (walkForward && walkForward.vs_hold_reward_uplift != null) {
        summaryText += ', walk uplift ' + (Number(walkForward.vs_hold_reward_uplift || 0) >= 0 ? '+' : '') + Number(walkForward.vs_hold_reward_uplift || 0).toFixed(2);
      }
      summaryText += ').';
      renderSummary(summaryText);
      renderInsights([
        { title: 'Offline policy → ' + offlineAction.replace(/_/g, ' '), copy: 'Offline confidence ' + Math.round(Number(frontier.offline_confidence || 0) * 100) + '%.' },
        { title: 'PPO bootstrap → ' + ppoAction.replace(/_/g, ' '), copy: 'Bootstrap confidence ' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '%. Timestamp ' + (frontier.timestamp || 'n/a') + '.' },
        { title: 'Neural PPO → ' + neuralAction.replace(/_/g, ' '), copy: (neural && neural.report ? 'Mean reward ' + Number(neural.report.mean_reward_estimate || 0).toFixed(4) + ' · Final equity ' + Number((replaySummary || {}).final_equity || 0).toFixed(3) + ' · Replay uplift vs hold ' + (Number(neural.vs_hold_reward_uplift || 0) >= 0 ? '+' : '') + Number(neural.vs_hold_reward_uplift || 0).toFixed(4) + '.' : 'Neural report unavailable.') },
        { title: 'Walk-forward robustness', copy: walkForward ? ('Positive windows ' + Math.round(Number(walkForward.positive_window_rate || 0) * 100) + '% · Mean reward ' + Number(walkForward.mean_reward || 0).toFixed(4) + ' · Mean max drawdown ' + Number(walkForward.mean_max_drawdown || 0).toFixed(4) + ' · Uplift vs hold ' + (Number(walkForward.vs_hold_reward_uplift || 0) >= 0 ? '+' : '') + Number(walkForward.vs_hold_reward_uplift || 0).toFixed(4) + '.') : 'Walk-forward report unavailable.' },
        { title: 'Reward decomposition', copy: replaySummary ? ('PnL ' + Number((replaySummary.reward_decomposition || {}).pnl || 0).toFixed(4) + ' · Turnover -' + Number((replaySummary.reward_decomposition || {}).turnover_cost || 0).toFixed(4) + ' · Drawdown -' + Number((replaySummary.reward_decomposition || {}).drawdown_cost || 0).toFixed(4) + ' · Event gap -' + Number((replaySummary.reward_decomposition || {}).event_gap_cost || 0).toFixed(4) + '.') : 'Reward decomposition unavailable.' }
      ]);
      renderRlDecisionCard(frontier, neural, neuralFrontier, walkForward, replaySummary);
      renderRlTrustStrip(neural, walkForward, replaySummary, neuralFrontier);
      renderRlObservabilityBoard(frontier, neural, neuralFrontier, walkForward, replaySummary);
    renderRlObservabilityRadar(frontier, neuralFrontier, replaySummary);
      renderRlBaselineTable(frontier, benchmark, neural, neuralFrontier, walkForward, replaySummary);
      renderRlWhyPanel(frontier, neuralFrontier, episodeReplay);
      renderRlScenarioPanel(frontier, neuralFrontier);
      renderRlAuditTrail(frontier, neural, walkForward, replaySummary, episodeReplay);
      renderRlPolicyField(neuralFrontier, replaySummary, walkForward);
      renderRlPremiumPanels(frontier, neural, neuralFrontier, walkForward, replaySummary, episodeReplay);
      animateRlSurfaces();
      return;
    }

    if (frontier) {
      renderSummary('Real RL artifacts loaded. PPO action for ' + titleize(state.selected) + ': ' + String(frontier.ppo_action || 'hold').replace(/_/g, ' ') + ' (' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '% confidence).');
      renderInsights([
        { title: 'Offline policy → ' + String(frontier.offline_action || 'hold').replace(/_/g, ' '), copy: 'Offline confidence ' + Math.round(Number(frontier.offline_confidence || 0) * 100) + '%.' },
        { title: 'PPO fine-tuned → ' + String(frontier.ppo_action || 'hold').replace(/_/g, ' '), copy: 'PPO confidence ' + Math.round(Number(frontier.ppo_confidence || 0) * 100) + '%. Timestamp ' + (frontier.timestamp || 'n/a') + '.' },
        { title: 'Benchmark snapshot', copy: benchmark ? 'Offline reward ' + Number(benchmark.offline.mean_reward || 0).toFixed(4) + ' · PPO reward ' + Number(benchmark.ppo.mean_reward || 0).toFixed(4) + ' · Rule reward ' + Number(benchmark.rule_based.mean_reward || 0).toFixed(4) + '.' : 'Benchmark artifact not available.' }
      ]);
      renderRlPremiumPanels(frontier, null, null, null, null, episodeReplay);
      return;
    }
    renderSummary('RL Policy Lab should surface a policy frontier with baseline comparison, explanation, and auditability. The highest-scoring state/action pair is the current default.');
    renderInsights(items.map(function(item){
      return { title: item.state + ' · ' + item.score + '/100', copy: item.action };
    }));
    renderRlPremiumPanels(null, null, null, null, null, null);
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
    if (config.demoKind !== 'rl-policy-lab') setRlPanelsVisible(false);
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
