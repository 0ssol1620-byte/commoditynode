import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run_node(script: str):
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_phase1_analytics_module_computes_correlation_changes_and_drilldown():
    script = r'''
const analytics = require('./assets/js/phase1-analytics.js');
const commodities = [
  { key: 'A', name: 'Alpha', short: 'A' },
  { key: 'B', name: 'Beta', short: 'B' },
  { key: 'C', name: 'Gamma', short: 'C' }
];
const logReturns = {
  A: [0.02, 0.01, 0.03, 0.02, -0.01, 0.01, 0.03, 0.02],
  B: [0.018, 0.012, 0.028, 0.024, -0.008, 0.012, 0.029, 0.021],
  C: [-0.01, 0.012, -0.02, 0.005, 0.011, -0.009, 0.008, -0.004]
};
const result = analytics.computeCorrelationAnalytics(logReturns, commodities, 4);
console.log(JSON.stringify({
  matrixSize: result.matrix.length,
  strongestPositive: result.topPositive[0].pair,
  strongestChangePair: result.topChanges[0].pair,
  drilldownPoints: result.buildPairDrilldown('A', 'B').seriesA.length
}));
'''
    output = run_node(script)
    assert output["matrixSize"] == 3
    assert output["strongestPositive"] == "Alpha × Beta"
    assert output["strongestChangePair"] in {"Alpha × Gamma", "Beta × Gamma", "Alpha × Beta"}
    assert output["drilldownPoints"] == 4


def test_phase1_analytics_module_builds_simulator_and_lab_summaries():
    script = r'''
const analytics = require('./assets/js/phase1-analytics.js');
const simulator = analytics.buildSimulatorDecisionMetrics({
  commodity: 'crude_oil',
  scenarioAdj: 15,
  industries: [
    { name: 'Airlines', base: -1.2, unit: 'margin %' },
    { name: 'Energy', base: 1.8, unit: 'revenue %' },
    { name: 'Chemicals', base: -0.7, unit: 'margin %' }
  ],
  companies: [
    { n: 'XOM', beta: 0.9 },
    { n: 'DAL', beta: -1.1 },
    { n: 'CVX', beta: 0.8 }
  ],
  scenarios: [
    { id: 'iran', name: 'Hormuz', impact: 18, dir: 'up' },
    { id: 'opec', name: 'OPEC cut', impact: 8, dir: 'up' },
    { id: 'demand', name: 'Demand slowdown', impact: -12, dir: 'down' }
  ],
  activeScenarioIds: ['iran'],
  agreementScore: 0.72,
  currentPrice: 72,
  forecast30d: 79,
  forecast90d: 84
});
const lab = analytics.buildLabCommandCenter({
  cluster: 'Energy',
  event_probabilities: [
    { label: 'OPEC cut', base_probability: 0.28 },
    { label: 'Demand slowdown', base_probability: 0.22 }
  ],
  ripple_ranker: [
    { name: 'XOM', score: 92, type: 'company' },
    { name: 'DAL', score: 81, type: 'company' }
  ],
  hedges: [
    { name: 'XLE', fit: 'Oil beta hedge' },
    { name: 'Airline underweight', fit: 'Cost hedge' }
  ],
  event_studies: [{ event: 'OPEC surprise' }],
  policy_actions: [{ state: 'bull', action: 'Stay long' }]
}, { role: 'investor', watchlist: ['XOM'] });
console.log(JSON.stringify({
  topIndustry: simulator.impactTable[0].name,
  readinessBand: simulator.readiness.band,
  compareRows: lab.compareRows.length,
  topCategory: lab.categoryScores[0].label,
  watchlistCount: lab.watchlistMatches.length
}));
'''
    output = run_node(script)
    assert output["topIndustry"] == "Energy"
    assert output["readinessBand"] in {"High conviction", "Moderate conviction"}
    assert output["compareRows"] >= 4
    assert output["topCategory"]
    assert output["watchlistCount"] == 1


def test_phase1_pages_include_echarts_analytical_surfaces():
    correlation = (ROOT / 'correlation/index.html').read_text(encoding='utf-8')
    simulator = (ROOT / 'simulator/index.html').read_text(encoding='utf-8')
    lab = (ROOT / 'intelligence-lab/index.html').read_text(encoding='utf-8')

    assert 'echarts.min.js' in correlation
    assert 'id="corr-heatmap-chart"' in correlation
    assert 'id="corr-drilldown-chart"' in correlation

    assert 'echarts.min.js' in simulator
    assert 'id="sim-impact-tornado-chart"' in simulator
    assert 'id="sim-scenario-compare-chart"' in simulator
    assert 'id="sim-decision-gauge-chart"' in simulator

    assert 'echarts.min.js' in lab
    assert 'id="lab-command-chart"' in lab
    assert 'id="lab-compare-chart"' in lab
    assert 'id="lab-category-chart"' in lab
