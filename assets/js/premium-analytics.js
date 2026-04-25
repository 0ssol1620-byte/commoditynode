(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CNPremiumAnalytics = factory();
  }
})(typeof self !== 'undefined' ? self : this, function(){
  'use strict';

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function toNumber(value, fallback){
    var n = Number(value);
    return Number.isFinite(n) ? n : (fallback == null ? 0 : fallback);
  }

  function fmtPct(value){
    var n = toNumber(value, null);
    if (n == null) return '—';
    return (n > 0 ? '+' : '') + n.toFixed(1) + '%';
  }

  function buildSparkSeries(baseValue, points){
    var level = toNumber(baseValue, 100);
    return (points || []).map(function(point){
      level *= (1 + toNumber(point, 0));
      return Number(level.toFixed(2));
    });
  }

  function buildKpiStrip(metrics){
    return (metrics || []).map(function(metric, index){
      var direction = toNumber(metric.change, 0) >= 0 ? 'up' : 'down';
      return {
        id: metric.id || ('metric-' + index),
        label: metric.label || 'Metric',
        value: metric.value || '—',
        change: fmtPct(metric.change),
        direction: direction,
        implication: metric.implication || '',
        spark: buildSparkSeries(metric.baseValue || 100, metric.spark || [0.01, -0.006, 0.012, 0.004, -0.002, 0.01])
      };
    });
  }

  function buildImpactSankeyData(payload){
    payload = payload || {};
    var source = payload.source || { name: 'Commodity shock', value: 100 };
    var sectors = (payload.sectors || []).slice(0, 4);
    var companies = (payload.companies || []).slice(0, 8);
    var nodes = [{ name: source.name, depth: 0, category: 'source' }];
    var links = [];

    sectors.forEach(function(sector){
      nodes.push({ name: sector.name, depth: 1, category: sector.tone || 'neutral' });
      links.push({ source: source.name, target: sector.name, value: Math.max(4, toNumber(sector.value, 0)) });
      companies.filter(function(company){ return company.sector === sector.name; }).forEach(function(company){
        nodes.push({ name: company.name, depth: 2, category: company.tone || sector.tone || 'neutral' });
        links.push({ source: sector.name, target: company.name, value: Math.max(2, toNumber(company.value, 0)) });
      });
    });

    return { nodes: nodes, links: links };
  }

  function buildForecastConeSeries(history, median, low, high){
    history = history || [];
    median = median || [];
    low = low || [];
    high = high || [];
    var labels = [];
    var historySeries = [];
    var medianSeries = [];
    var lowSeries = [];
    var bandSeries = [];
    var maxHistory = history.length;
    var maxForecast = Math.max(median.length, low.length, high.length);
    var total = maxHistory + maxForecast;

    var lastHistory = history.length ? toNumber(history[history.length - 1], null) : null;
    for (var i = 0; i < total; i++) {
      if (i < maxHistory) {
        labels.push('H-' + (maxHistory - i));
        var historyValue = toNumber(history[i], null);
        historySeries.push(historyValue);
        // Anchor the forecast median/band on the final historical point so the
        // cone reads as one continuous decision path instead of a broken line.
        medianSeries.push(i === maxHistory - 1 ? historyValue : null);
        lowSeries.push(i === maxHistory - 1 ? historyValue : null);
        bandSeries.push(i === maxHistory - 1 ? 0 : null);
      } else {
        var j = i - maxHistory;
        labels.push('F+' + (j + 1));
        historySeries.push(null);
        medianSeries.push(toNumber(median[j], null));
        var lo = toNumber(low[j], null);
        var hi = toNumber(high[j], null);
        if (lo == null && lastHistory != null && j === 0) lo = lastHistory;
        lowSeries.push(lo);
        bandSeries.push(hi == null || lo == null ? null : Number((hi - lo).toFixed(2)));
      }
    }

    return {
      labels: labels,
      history: historySeries,
      median: medianSeries,
      low: lowSeries,
      band: bandSeries
    };
  }

  function buildCorrelationNetwork(active, pairs){
    var maxAbs = 0;
    (pairs || []).forEach(function(pair){ maxAbs = Math.max(maxAbs, Math.abs(toNumber(pair.value, 0))); });
    maxAbs = maxAbs || 1;
    return {
      nodes: (active || []).map(function(item, index){
        return {
          id: item.key,
          name: item.short || item.name || item.key,
          value: 28 + index,
          category: item.group || 0,
          symbolSize: 16 + (index % 5) * 3
        };
      }),
      links: (pairs || []).map(function(pair){
        return {
          source: pair.a && pair.a.key ? pair.a.key : pair.source,
          target: pair.b && pair.b.key ? pair.b.key : pair.target,
          value: Number(toNumber(pair.value, 0).toFixed(3)),
          lineStyle: {
            width: 1 + Math.abs(toNumber(pair.value, 0)) * 5,
            opacity: 0.18 + Math.abs(toNumber(pair.value, 0)) * 0.6,
            color: toNumber(pair.value, 0) >= 0 ? 'rgba(34,211,238,0.72)' : 'rgba(244,63,94,0.72)'
          }
        };
      })
    };
  }

  function buildExposureWheel(payload){
    payload = payload || {};
    var items = [];
    function pushBucket(values, group, weight){
      (values || []).slice(0, 6).forEach(function(item, index){
        var label = typeof item === 'string' ? item : (item.label || item.name || item.title || String(item));
        items.push({
          name: label,
          value: Math.max(8, weight - index * 6),
          group: group
        });
      });
    }
    pushBucket(payload.companies, 'Companies', 42);
    pushBucket(payload.themes, 'Themes', 32);
    pushBucket(payload.substitutes, 'Substitutes', 24);
    pushBucket(payload.reports, 'Reports', 18);
    return items;
  }

  function buildEventTimeline(events){
    return (events || []).map(function(event, index){
      return {
        index: index,
        label: event.label || event.title || ('Event ' + (index + 1)),
        score: clamp(Math.abs(toNumber(event.impact, event.score || 0)) || 12, 8, 100),
        direction: toNumber(event.impact, 0) >= 0 ? 'up' : 'down',
        date: event.date || event.when || '',
        note: event.note || event.description || ''
      };
    });
  }

  function buildStorySteps(steps){
    return (steps || []).map(function(step, index){
      return {
        id: step.id || ('step-' + (index + 1)),
        title: step.title || ('Step ' + (index + 1)),
        kicker: step.kicker || 'Workflow',
        body: step.body || '',
        metric: step.metric || '',
        chart: step.chart || 'bar',
        delta: fmtPct(step.delta || 0)
      };
    });
  }

  function buildPolicyObservability(payload){
    payload = payload || {};
    var actions = (payload.actions || []).map(function(action, index){
      return Object.assign({}, action, {
        probability: clamp(toNumber(action.probability, action.score || 0) / (toNumber(action.probability, action.score || 0) > 1 ? 100 : 1), 0.04, 0.96),
        rank: index + 1
      });
    }).sort(function(a, b){ return b.probability - a.probability; });
    var drivers = (payload.drivers || []).map(function(driver){
      return {
        label: driver.label,
        score: clamp(toNumber(driver.score, 0), 0, 100),
        note: driver.note || ''
      };
    });
    return {
      topAction: actions[0] || null,
      actions: actions,
      drivers: drivers,
      stateVector: (payload.stateVector || []).map(function(item){
        return { label: item.label, value: clamp(toNumber(item.value, 0), 0, 100) };
      }),
      auditTrail: buildEventTimeline(payload.auditTrail || [])
    };
  }

  return {
    clamp: clamp,
    buildKpiStrip: buildKpiStrip,
    buildImpactSankeyData: buildImpactSankeyData,
    buildForecastConeSeries: buildForecastConeSeries,
    buildCorrelationNetwork: buildCorrelationNetwork,
    buildExposureWheel: buildExposureWheel,
    buildEventTimeline: buildEventTimeline,
    buildStorySteps: buildStorySteps,
    buildPolicyObservability: buildPolicyObservability
  };
});
