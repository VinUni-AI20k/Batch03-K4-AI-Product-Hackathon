# Agent Evaluation Report

- Adapter: `eval.adapters.mock_vlearn_adapter`
- Cases: **20/20 passed** (100.0%)
- Quality bar: **80%** — PASS
- Runtime errors: **0**
- Latency p50 / p95: **0.01 / 0.01 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 3/3 | 100.0% | 0.01 | 0.01 |
| lesson_qa | 4/4 | 100.0% | 0.01 | 0.01 |
| quiz_generation | 4/4 | 100.0% | 0.01 | 0.01 |
| quiz_integrity | 3/3 | 100.0% | 0.01 | 0.01 |
| socratic_agent | 3/3 | 100.0% | 0.01 | 0.01 |
| validator_guardrails | 3/3 | 100.0% | 0.01 | 0.01 |

## Aggregate metrics

- bleu: 0.7571
- citation_f1: 1.0000
- citation_precision: 1.0000
- citation_recall: 1.0000
- integrity_pass: 1.0000
- keyword_recall: 1.0000
- quota_pass: 1.0000
- rouge_l: 0.8642
- tool_call_f1: 1.0000
- tool_call_precision: 1.0000
- tool_call_recall: 1.0000
- validator_pass: 1.0000

## Failed cases

- None
