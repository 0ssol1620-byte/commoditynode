# CommodityNode Forecast Pipeline Runbook

This runbook captures the exact local workflow that now works for regenerating the live forecast artifacts used by CommodityNode.

## Artifacts

The simulator and commodity forecast panels consume these files:

- `assets/data/forecast.json`
- `assets/data/forecast-consensus.json`

`forecast.json` contains Chronos/fallback output plus `timesfm_forecast` blocks.
`forecast-consensus.json` contains:

- `models.chronos2`
- `models.timesfm`
- `consensus`
- `agreement`

## Working environment

Use the dedicated forecast virtual environment:

- path: `.venv-forecast`
- python: `.venv-forecast/bin/python`

This environment is intentionally separate from the Hermes agent venv because TimesFM + torch dependencies are heavier and version-sensitive.

## One-command run

From repo root:

```bash
bash scripts/run_forecast_pipeline.sh
```

What it does:

1. runs `scripts/forecast_chronos2.py`
2. runs `scripts/forecast_timesfm.py`
3. runs `scripts/merge_forecasts.py`
4. runs `scripts/qa_check.py`

## Optional flags

Skip TimesFM refresh:

```bash
SKIP_TIMESFM=1 bash scripts/run_forecast_pipeline.sh
```

Skip QA:

```bash
SKIP_QA=1 bash scripts/run_forecast_pipeline.sh
```

Use a different venv path:

```bash
VENV_DIR=/custom/path/.venv-forecast bash scripts/run_forecast_pipeline.sh
```

## First-time setup

If `.venv-forecast` does not exist yet:

```bash
python3 -m venv .venv-forecast
. .venv-forecast/bin/activate
pip install --upgrade pip setuptools wheel
pip install torch pandas numpy yfinance ta safetensors huggingface_hub
pip install git+https://github.com/google-research/timesfm.git
```

## Why the GitHub TimesFM install matters

Do not rely on the older PyPI `timesfm` package for this repo.

The working setup uses:

```bash
pip install git+https://github.com/google-research/timesfm.git
```

Reason:
- the older PyPI package exposed a different API
- it expected `torch_model.ckpt`
- the `google/timesfm-2.5-200m-pytorch` model repo used here provides `model.safetensors`
- the current GitHub version matches the repo's README/API and successfully loads the checkpoint

## Expected success signals

Successful `forecast_timesfm.py` output should look like:

- one block per commodity
- lines such as `✓ 30d: ... | 90d: ...`
- final success message for all 19 commodities

Successful merge should print JSON like:

```json
{
  "ok": true,
  "message": "Consensus forecast written"
}
```

Successful QA should end with:

```text
Errors: 0 | Warnings: 0
✅ All checks passed!
```

## Live verification checklist

After committing and pushing:

1. open simulator with cache busting
   - `https://commoditynode.com/simulator/?v=<commit>`
2. verify the compare strip shows distinct values for:
   - Consensus 90D
   - Chronos-2 90D
   - TimesFM 90D
3. confirm chart datasets are populated, not 1-point stubs
4. spot-check several commodity hubs, e.g.
   - `/commodities/crude-oil/`
   - `/commodities/gold/`
   - `/commodities/copper/`
   - `/commodities/uranium/`

## Known caveats

- `forecast_chronos2.py` can run in fallback mode if `chronos` is unavailable.
- Hugging Face downloads are unauthenticated unless `HF_TOKEN` is set; that can be slower.
- `.venv-forecast` is local environment state and should not be committed.
