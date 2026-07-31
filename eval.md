# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **21/23 passed** (91.3%)
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
| `quiz_quality` | 2/3 | 66.7% | 460.5 | 550.2 |
| `socratic_agent` | 2/3 | 66.7% | 420.3 | 480.2 |
| `validator_guardrails` | 3/3 | 100.0% | 0.01 | 0.02 |

## Details of failed cases

- `socratic_agent::socratic_003` - llm_judge
- `quiz_quality::quiz_quality_003` - llm_judge (Lỗi lạc đề/Out-of-scope)
