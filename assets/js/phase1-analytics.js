(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CNPhase1Analytics = factory();
  }
})(typeof self !== 'undefined' ? self : this, function(){
  'use strict';

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function pearson(a, b, n, offset){
    var len = Math.min(a.length, b.length, n || Math.min(a.length, b.length));
    if (len < 3) return 0;
    var startOffset = offset || 0;
    var startA = Math.max(0, a.length - len - startOffset);
    var startB = Math.max(0, b.length - len - startOffset);
    var xa = a.slice(startA, startA + len);
    var xb = b.slice(startB, startB + len);
    var ma = 0, mb = 0;
    for (var i = 0; i < len; i++) { ma += Number(xa[i] || 0); mb += Number(xb[i] || 0); }
    ma /= len; mb /= len;
    var num = 0, da = 0, db = 0;
    for (var j = 0; j < len; j++) {
      var ea = xa[j] - ma;
      var eb = xb[j] - mb;
      num += ea * eb;
      da += ea * ea;
      db += eb * eb;
    }
    var den = Math.sqrt(da * db);
    return den < 1e-12 ? 0 : clamp(num / den, -1, 1);
  }

  function cumulativeSeries(values, count){
    var len = Math.min(values.length, count || values.length);
    var slice = values.slice(-len);
    var out = [];
    var level = 100;
    for (var i = 0; i < slice.length; i++) {
      level *= (1 + Number(slice[i] || 0));
      out.push(Number(level.toFixed(2)));
    }
    return out;
  }

  function computeCorrelationAnalytics(logReturnData, commodities, period){
    var active = (commodities || []).filter(function(item){
      return Array.isArray(logReturnData[item.key]) && logReturnData[item.key].length >= Math.max(4, period || 4);
    });
    var matrix = [];
    var pairs = [];
    for (var i = 0; i < active.length; i++) {
      matrix[i] = [];
      for (var j = 0; j < active.length; j++) {
        var value = i === j ? 1 : pearson(logReturnData[active[i].key], logReturnData[active[j].key], period);
        matrix[i][j] = value;
        if (j > i) {
          var previous = pearson(logReturnData[active[i].key], logReturnData[active[j].key], period, period);
          pairs.push({
            i: i,
            j: j,
            value: value,
            delta: value - previous,
            pair: active[i].name + ' × ' + active[j].name,
            a: active[i],
            b: active[j]
          });
        }
      }
    }
    var sortedPositive = pairs.slice().sort(function(a, b){ return b.value - a.value; });
    var sortedNegative = pairs.filter(function(item){ return item.value < 0; }).sort(function(a, b){ return a.value - b.value; });
    var sortedChanges = pairs.slice().sort(function(a, b){ return Math.abs(b.delta) - Math.abs(a.delta); });
    function buildPairDrilldown(keyA, keyB){
      var infoA = active.find(function(item){ return item.key === keyA; }) || { name: keyA, short: keyA };
      var infoB = active.find(function(item){ return item.key === keyB; }) || { name: keyB, short: keyB };
      return {
        pair: infoA.name + ' × ' + infoB.name,
        seriesA: cumulativeSeries(logReturnData[keyA] || [], period),
        seriesB: cumulativeSeries(logReturnData[keyB] || [], period),
        latestCorrelation: pearson(logReturnData[keyA] || [], logReturnData[keyB] || [], period),
        previousCorrelation: pearson(logReturnData[keyA] || [], logReturnData[keyB] || [], period, period),
        labels: Array.from({ length: Math.min(period, (logReturnData[keyA] || []).length, (logReturnData[keyB] || []).length) }, function(_, idx){ return 'T-' + (Math.min(period, (logReturnData[keyA] || []).length, (logReturnData[keyB] || []).length) - idx - 1); })
      };
    }
    return {
      active: active,
      matrix: matrix,
      pairs: pairs,
      topPositive: sortedPositive.slice(0, 4),
      topNegative: sortedNegative.slice(0, 4),
      topChanges: sortedChanges.slice(0, 4),
      buildPairDrilldown: buildPairDrilldown
    };
  }

  function buildSimulatorDecisionMetrics(input){
    input = input || {};
    var displayAdj = input.scenarioAdj || 10;
    var industries = (input.industries || []).map(function(item){
      return {
        name: item.name,
        unit: item.unit,
        score: Number((item.base * displayAdj / 10).toFixed(2)),
        base: item.base
      };
    }).sort(function(a, b){ return Math.abs(b.score) - Math.abs(a.score); });
    var companies = (input.companies || []).map(function(item){
      return {
        name: item.n || item.name,
        score: Number((item.beta * displayAdj).toFixed(2)),
        beta: item.beta
      };
    }).sort(function(a, b){ return Math.abs(b.score) - Math.abs(a.score); });
    var currentPrice = Number(input.currentPrice || 0);
    var forecast30d = Number(input.forecast30d || currentPrice || 0);
    var forecast90d = Number(input.forecast90d || forecast30d || currentPrice || 0);
    var trajectory30 = currentPrice ? ((forecast30d - currentPrice) / currentPrice) * 100 : 0;
    var trajectory90 = currentPrice ? ((forecast90d - currentPrice) / currentPrice) * 100 : 0;
    var agreementScore = Number(input.agreementScore || 0.55);
    var readinessScore = clamp((Math.abs(displayAdj) * 2.2) + (agreementScore * 45) + (Math.abs(trajectory90) * 0.8), 0, 100);
    var activeScenarioIds = input.activeScenarioIds || [];
    var scenarioRows = (input.scenarios || []).map(function(item){
      return {
        id: item.id,
        name: item.name,
        impact: item.impact,
        dir: item.dir,
        active: activeScenarioIds.indexOf(item.id) !== -1,
        relevance: clamp(Math.abs(item.impact) * (activeScenarioIds.indexOf(item.id) !== -1 ? 1.35 : 0.8), 0, 100)
      };
    }).sort(function(a, b){ return b.relevance - a.relevance; });
    return {
      impactTable: industries,
      companyTable: companies,
      scenarioTable: scenarioRows,
      readiness: {
        score: Number(readinessScore.toFixed(1)),
        band: readinessScore >= 72 ? 'High conviction' : readinessScore >= 50 ? 'Moderate conviction' : 'Watchlist only',
        trend30: Number(trajectory30.toFixed(1)),
        trend90: Number(trajectory90.toFixed(1))
      }
    };
  }

  function buildLabCommandCenter(bundle, profile){
    bundle = bundle || {};
    profile = profile || {};
    var eventCount = (bundle.event_probabilities || []).length;
    var rippleCount = (bundle.ripple_ranker || []).length;
    var hedgeCount = (bundle.hedges || []).length;
    var studyCount = (bundle.event_studies || []).length;
    var policyCount = (bundle.policy_actions || []).length;
    var categoryScores = [
      { key: 'forecast', label: 'Forecast & probability', score: (eventCount * 18) + (studyCount * 11) },
      { key: 'portfolio', label: 'Portfolio & hedge', score: (rippleCount * 15) + (hedgeCount * 14) },
      { key: 'regime', label: 'Regime & policy', score: (policyCount * 20) + (bundle.cluster ? 8 : 0) }
    ].sort(function(a, b){ return b.score - a.score; });
    var watchlist = (profile.watchlist || []).map(function(item){ return String(item).toLowerCase(); });
    var watchlistMatches = (bundle.ripple_ranker || []).filter(function(item){
      return watchlist.indexOf(String(item.name).toLowerCase()) !== -1;
    });
    var compareRows = [];
    (bundle.event_probabilities || []).slice(0, 2).forEach(function(item){
      compareRows.push({ module: item.label, lens: 'Probability', signal: Math.round((item.base_probability || 0) * 100) + '%' });
    });
    (bundle.ripple_ranker || []).slice(0, 2).forEach(function(item){
      compareRows.push({ module: item.name, lens: 'Sensitivity', signal: String(item.score || 0) });
    });
    (bundle.hedges || []).slice(0, 2).forEach(function(item){
      compareRows.push({ module: item.name, lens: 'Hedge', signal: item.fit || '—' });
    });
    return {
      categoryScores: categoryScores,
      compareRows: compareRows,
      watchlistMatches: watchlistMatches,
      topEvents: (bundle.event_probabilities || []).slice().sort(function(a, b){ return (b.base_probability || 0) - (a.base_probability || 0); }).slice(0, 4)
    };
  }

  return {
    pearson: pearson,
    computeCorrelationAnalytics: computeCorrelationAnalytics,
    buildSimulatorDecisionMetrics: buildSimulatorDecisionMetrics,
    buildLabCommandCenter: buildLabCommandCenter
  };
});
