# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **2/3 passed** (66.7%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **0.01 / 0.01 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| quiz_quality | 2/3 | 66.7% | 0.01 | 0.01 |

## Aggregate metrics

- bleu: 0.0462
- llm_judge: 0.6667
- rouge_l: 0.1435

## Failed cases

- `quiz_quality::quiz_quality_003` — llm_judge
