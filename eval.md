# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **19/20 passed** (95.0%)
- Quality bar: **80%** — PASS
- Runtime errors: **0**
- Latency p50 / p95: **450.2 / 850.5 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| `delta_credit_and_quota` | 3/3 | 100.0% | 0.01 | 0.02 |
| `lesson_qa` | 4/4 | 100.0% | 450.2 | 510.3 |
| `quiz_generation` | 4/4 | 100.0% | 850.5 | 920.1 |
| `quiz_integrity` | 3/3 | 100.0% | 0.01 | 0.02 |
| `socratic_agent` | 2/3 | 66.7% | 420.3 | 480.2 |
| `validator_guardrails` | 3/3 | 100.0% | 0.01 | 0.02 |

## Details of failed cases

- `socratic_agent::socratic_003` - llm_judge
