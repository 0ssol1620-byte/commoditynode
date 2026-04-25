from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding='utf-8')


def load_json(rel: str):
    return json.loads(read(rel))


def test_model_call_exporter_exists_for_repeatable_proof_data():
    exporter = read('scripts/export_model_call_proof.py')
    assert 'assets/data/model-call-snapshots.json' in exporter
    assert 'assets/data/model-call-outcomes.json' in exporter
    assert 'historical replay / walk-forward scoped, not a live trading guarantee' in exporter


def test_blueprint_automation_scripts_exist_for_forward_call_tracking():
    snapshot_builder = read('scripts/build_model_call_snapshots.py')
    outcome_tracker = read('scripts/update_model_call_outcomes.py')
    assert 'assets/data/model-call-snapshots.json' in snapshot_builder
    assert 'latest _posts' in snapshot_builder
    assert 'do not overwrite existing call IDs' in snapshot_builder
    assert 'assets/data/model-call-outcomes.json' in outcome_tracker
    assert 'assets/data/chart-data' in outcome_tracker
    assert 'pending horizons as null' in outcome_tracker


def test_model_call_snapshot_and_outcome_data_contract():
    snapshots = load_json('assets/data/model-call-snapshots.json')
    outcomes = load_json('assets/data/model-call-outcomes.json')
    catalysts = load_json('assets/data/news-catalysts.json')

    assert snapshots['schema_version'] == 1
    assert snapshots['positioning'] == 'live catalyst -> forecast range -> RL policy -> impact workflow -> timestamped proof'
    assert len(snapshots['calls']) >= 5
    required_call_keys = {
        'id', 'created_at', 'commodity', 'commodity_slug', 'source_report_url',
        'price_at_prediction', 'forecast_30d', 'forecast_90d', 'forecast_direction',
        'forecast_agreement', 'rl_action', 'rl_probability', 'rl_policy_scope',
        'news_catalysts', 'decision_implication', 'impact_targets', 'proof_label'
    }
    for call in snapshots['calls']:
        assert required_call_keys <= set(call)
        assert call['rl_policy_scope'] == 'historical replay / walk-forward scoped, not a live trading guarantee'
        assert 'guarantee' not in call['proof_label'].lower()
        assert call['source_report_url'].startswith('/')
        assert len(call['news_catalysts']) >= 2
        assert len(call['impact_targets']) >= 2
        assert call['forecast_30d'] is not None
        assert call['forecast_90d'] is not None

    assert outcomes['schema_version'] == 1
    assert len(outcomes['outcomes']) >= 5
    assert catalysts['schema_version'] == 1
    assert 'generated_at' in catalysts
    assert len(catalysts['catalysts']) >= 5
    for commodity, rows in catalysts['catalysts'].items():
        assert len(rows) >= 1
        for row in rows:
            assert {'headline', 'source', 'published_at', 'summary', 'model_reaction'} <= set(row)
            assert 'guarantee' not in row['model_reaction'].lower()
    required_outcome_keys = {
        'call_id', 'evaluated_at', 'actual_7d_return_pct', 'actual_14d_return_pct',
        'actual_30d_return_pct', 'direction_correct_7d', 'direction_correct_30d',
        'forecast_range_hit_30d', 'max_drawdown_pct', 'outcome_label', 'proof_copy'
    }
    call_ids = {call['id'] for call in snapshots['calls']}
    for outcome in outcomes['outcomes']:
        assert required_outcome_keys <= set(outcome)
        assert outcome['call_id'] in call_ids
        assert 'historical' in outcome['proof_copy'].lower() or 'replay' in outcome['proof_copy'].lower()
        call = next(c for c in snapshots['calls'] if c['id'] == outcome['call_id'])
        if call.get('status') == 'pending_outcome':
            assert outcome['actual_7d_return_pct'] is None
            assert outcome['actual_14d_return_pct'] is None
            assert outcome['actual_30d_return_pct'] is None
            assert outcome['direction_correct_7d'] is None
            assert outcome['direction_correct_30d'] is None
            assert outcome['forecast_range_hit_30d'] is None
            assert 'pending' in outcome['outcome_label'].lower()


def test_outcome_tracker_keeps_unreached_horizons_pending():
    tracker = read('scripts/update_model_call_outcomes.py')
    assert 'price_30 = latest_price(candles)' not in tracker
    assert 'pick_price_after(candles, call_dt, 30)' in tracker
    assert 'Pending horizons stay null' in tracker


def test_home_model_proof_json_rendering_is_url_safe():
    home = read('index.html')
    assert "path.indexOf('//') !== 0" in home
    assert 'appendText(document.createElement' in home
    model_proof_block = home.split('model-proof-command-center', 1)[1].split('</script>', 1)[0]
    assert '.innerHTML' not in model_proof_block

    expectations = {
        'index.html': [
            'model-proof-command-center',
            'News catalyst → forecast range → RL action → impact workflow',
            'data-cta="home_model_proof_open_reports"',
            '/assets/data/model-call-snapshots.json',
            '/assets/data/news-catalysts.json',
        ],
        'reports/index.html': [
            'archive-proof-shelf',
            'Recent model calls that played out',
            'archive_model_proof_open_call',
            '/assets/data/model-call-outcomes.json',
        ],
        '_layouts/post.html': [
            'report-model-readout',
            'Model Readout',
            'Forecast range',
            'RL policy action',
            'data-cta="report_model_readout_simulator"',
        ],
        '_layouts/commodity.html': [
            'commodity-model-reaction',
            'Current model reaction',
            'Forecast layer',
            'RL policy layer',
            'data-cta="commodity_model_reaction_simulator"',
        ],
        'simulator/index.html': [
            'sim-model-context',
            'Model call context',
            'Forecast → RL policy → stock-level translation',
            'data-cta="sim_model_context_pricing"',
            'getHistorySlice(d.history)',
            'Array.isArray(historySlice.prices)',
            'historySlice.prices.slice(-16)',
        ],
        'pricing/index.html': [
            'pricing-model-proof',
            'What Pro adds to the model workflow',
            'Replay-backed policy selection',
            'data-cta="pricing_model_proof_start_pro"',
        ],
        '_layouts/intelligence-product.html': [
            'rl-proof-archive',
            'Historical replay target-match',
            'not a live trading guarantee',
            'data-cta="rl_proof_archive_pricing"',
        ],
    }
    for rel, markers in expectations.items():
        body = read(rel)
        for marker in markers:
            assert marker in body, f'{marker} missing from {rel}'


def test_simulator_forecast_cone_uses_history_prices_array():
    simulator = read('simulator/index.html')
    assert 'getHistorySlice(d.history).slice' not in simulator
    assert 'var historySlice = d && d.history ? getHistorySlice(d.history) : null;' in simulator
    assert 'Array.isArray(historySlice.prices)' in simulator
    assert 'historySlice.prices.slice(-16)' in simulator


def test_model_proof_copy_avoids_unscoped_performance_claims():
    files = [
        'index.html', 'reports/index.html', '_layouts/post.html', '_layouts/commodity.html',
        'pricing/index.html', 'simulator/index.html', '_layouts/intelligence-product.html',
    ]
    banned = [
        'guaranteed profit',
        'guaranteed 90%',
        '91% live trading win rate',
        '90% future accuracy',
        'win 9 out of 10 trades',
    ]
    combined = '\n'.join(read(rel).lower() for rel in files)
    for phrase in banned:
        assert phrase not in combined
    assert 'historical replay' in combined
    assert 'walk-forward' in combined
