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


def test_premium_analytics_builds_sankey_forecast_network_and_policy_outputs():
    script = r'''
const analytics = require('./assets/js/premium-analytics.js');
const sankey = analytics.buildImpactSankeyData({
  source: { name: 'Crude Oil Shock', value: 100 },
  sectors: [
    { name: 'Airlines', value: 30, tone: 'negative' },
    { name: 'Energy', value: 40, tone: 'positive' }
  ],
  companies: [
    { name: 'DAL', sector: 'Airlines', value: 12, tone: 'negative' },
    { name: 'XOM', sector: 'Energy', value: 14, tone: 'positive' }
  ]
});
const cone = analytics.buildForecastConeSeries([70, 71, 72], [74, 75], [72, 73], [76, 78]);
const network = analytics.buildCorrelationNetwork(
  [{ key: 'CL', short: 'Oil' }, { key: 'GC', short: 'Gold' }],
  [{ a: { key: 'CL' }, b: { key: 'GC' }, value: -0.42 }]
);
const wheel = analytics.buildExposureWheel({
  companies: ['XOM', 'CVX'],
  themes: ['Inflation'],
  substitutes: ['Natural Gas'],
  reports: [{ title: 'Oil risk premium' }]
});
const policy = analytics.buildPolicyObservability({
  actions: [
    { label: 'Reduce risk', probability: 0.61 },
    { label: 'Hold', probability: 0.25 },
    { label: 'Add hedge', probability: 0.14 }
  ],
  drivers: [{ label: 'Volatility', score: 81 }, { label: 'Agreement', score: 58 }],
  stateVector: [{ label: 'Volatility', value: 81 }, { label: 'Event risk', value: 64 }],
  auditTrail: [{ label: 'OPEC repricing', impact: 22, date: '2026-04-22' }]
});
console.log(JSON.stringify({
  sankeyNodes: sankey.nodes.length,
  sankeyLinks: sankey.links.length,
  forecastLabels: cone.labels.length,
  networkLinks: network.links.length,
  exposureItems: wheel.length,
  topAction: policy.topAction.label,
  auditEvents: policy.auditTrail.length
}));
'''
    output = run_node(script)
    assert output["sankeyNodes"] == 5
    assert output["sankeyLinks"] == 4
    assert output["forecastLabels"] == 5
    assert output["networkLinks"] == 1
    assert output["exposureItems"] >= 4
    assert output["topAction"] == "Reduce risk"
    assert output["auditEvents"] == 1
