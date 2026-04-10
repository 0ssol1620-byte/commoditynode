# TimesFM 2.5 Integration Plan for CommodityNode

## Goal
Add a second foundation-model forecasting track alongside Chronos-2, then surface a premium consensus forecast on CommodityNode commodity hubs.

## Why add TimesFM 2.5
- Chronos-2 is already live and useful, but a second model improves robustness.
- TimesFM 2.5 adds long context support, quantile forecasting, and a lighter inference profile than earlier TimesFM versions.
- Two-model comparison enables:
  - consensus forecasting
  - model disagreement scoring
  - confidence framing that looks materially more premium than a single-model path

## Recommended rollout
### Phase 1 — Backend scaffolding
1. Keep existing `assets/data/forecast.json` as the public/default forecast artifact for backward compatibility.
2. Introduce model-specific artifacts:
   - `assets/data/forecast-chronos2.json`
   - `assets/data/forecast-timesfm.json`
3. Introduce a consensus artifact:
   - `assets/data/forecast-consensus.json`
4. Add a merger script that produces consensus + disagreement metadata.

### Phase 2 — UI exposure
For flagship hubs, show:
- Consensus median path (primary)
- Consensus band (primary uncertainty zone)
- Chronos-2 path (secondary line)
- TimesFM 2.5 path (secondary line)
- Agreement badge: High / Moderate / Divergent
- Expandable model diagnostics section

### Phase 3 — Editorial framing
Each forecast panel should explain:
- Consensus is the default decision layer
- Individual models are available for inspection
- Divergence is a signal of uncertainty, not a bug

## Forecast artifact design
### `forecast-chronos2.json`
Chronos-only output, close to current schema.

### `forecast-timesfm.json`
TimesFM-only output, same shape as Chronos where possible.

### `forecast-consensus.json`
Suggested schema per commodity:

```json
{
  "crude_oil": {
    "updated_at": "2026-04-10T05:00:58.778599+00:00",
    "horizon_days": 90,
    "models": {
      "chronos2": {
        "direction": "bullish",
        "confidence": 0.58,
        "current_price": 98.35,
        "median": [],
        "p10": [],
        "p90": []
      },
      "timesfm": {
        "direction": "bullish",
        "confidence": 0.64,
        "current_price": 98.35,
        "median": [],
        "p10": [],
        "p90": []
      }
    },
    "consensus": {
      "direction": "bullish",
      "confidence": 0.61,
      "median": [],
      "p10": [],
      "p90": []
    },
    "agreement": {
      "level": "high",
      "score": 0.84,
      "direction_match": true,
      "median_gap_day_30_pct": 1.2,
      "median_gap_day_90_pct": 2.6
    }
  }
}
```

## Consensus logic (recommended)
### Median path
- Base case: average the two model medians pointwise.

### Band logic
- Conservative approach: use the wider band of the two models pointwise.
- If TimesFM quantiles are unavailable at first, derive a provisional band from forecast spread + recent realized volatility.

### Direction logic
- If both models agree on direction: use shared direction.
- If they disagree:
  - mark consensus direction as `mixed` or `neutral`
  - lower confidence
  - elevate disagreement badge

### Agreement score
Start simple:
- 1 minus normalized median gap
- bonus for direction match
- penalty for band overlap weakness

## UI recommendation
### Main panel
- Thick cyan line: Consensus median
- Soft cyan/blue band: Consensus uncertainty zone
- Purple dashed line: Chronos-2
- Amber dashed line: TimesFM 2.5

### Supporting chips
- Consensus: Bullish +5.8%
- Chronos-2: Bullish +6.5%
- TimesFM: Bullish +5.2%
- Agreement: High

### Premium microcopy
- `Consensus forecast`
- `Model agreement: High`
- `Two-model view reduces single-model overconfidence`

## Implementation notes
- Do not replace the current live forecast consumer all at once.
- First generate model-specific artifacts and consensus artifact.
- Then update frontend to prefer consensus where present.
- Keep the old `forecast.json` as fallback until the new path is fully verified.

## Ralph implications
Ralph should later check:
- forecast-consensus artifact exists
- both model artifacts exist
- flagship hubs expose agreement badge
- consensus panel renders on live pages

## Next coding tasks
1. Add `scripts/forecast_timesfm.py`
2. Add `scripts/merge_forecasts.py`
3. Add new JSON outputs under `assets/data/`
4. Update commodity frontend JS to read consensus first
5. Add audit checks for new forecast surfaces
