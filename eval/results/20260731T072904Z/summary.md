# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **1/2 passed** (50.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **0.01 / 0.01 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| quiz_quality | 1/2 | 50.0% | 0.01 | 0.01 |

## Aggregate metrics

- bleu: 0.0433
- llm_judge: 0.5000
- rouge_l: 0.1421

## Failed cases

- `quiz_quality::quiz_quality_002` — llm_judge
