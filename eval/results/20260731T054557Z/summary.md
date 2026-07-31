# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **8/20 passed** (40.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **0.0 / 0.01 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 1/3 | 33.3% | 0.0 | 0.01 |
| lesson_qa | 4/4 | 100.0% | 0.01 | 0.01 |
| quiz_generation | 0/4 | 0.0% | 0.01 | 0.01 |
| quiz_integrity | 2/3 | 66.7% | 0.0 | 0.0 |
| socratic_agent | 1/3 | 33.3% | 0.0 | 0.01 |
| validator_guardrails | 0/3 | 0.0% | 0.0 | 0.01 |

## Aggregate metrics

- bleu: 1.0000
- citation_f1: 1.0000
- citation_precision: 1.0000
- citation_recall: 1.0000
- integrity_pass: 1.0000
- keyword_recall: 0.7167
- llm_judge: 0.4545
- quota_pass: 1.0000
- rouge_l: 1.0000
- tool_call_f1: 1.0000
- tool_call_precision: 1.0000
- tool_call_recall: 1.0000
- validator_pass: 1.0000

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall
- `delta_credit_and_quota::quota_002` — keyword_recall
- `quiz_generation::quiz_generation_001` — llm_judge
- `quiz_generation::quiz_generation_002` — llm_judge
- `quiz_generation::quiz_generation_003` — llm_judge
- `quiz_generation::quiz_generation_004` — llm_judge
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — llm_judge
- `socratic_agent::socratic_003` — llm_judge
- `validator_guardrails::validator_001` — keyword_recall
- `validator_guardrails::validator_002` — keyword_recall
- `validator_guardrails::validator_003` — keyword_recall
