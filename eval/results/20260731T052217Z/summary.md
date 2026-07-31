# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **6/20 passed** (30.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **1977.71 / 8478.1 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.01 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 7328.34 | 19478.64 |
| quiz_generation | 4/4 | 100.0% | 2339.6 | 2545.36 |
| quiz_integrity | 0/3 | 0.0% | 0.0 | 0.01 |
| socratic_agent | 1/3 | 33.3% | 2322.9 | 2512.04 |
| validator_guardrails | 1/3 | 33.3% | 1.72 | 1810.39 |

## Aggregate metrics

- bleu: 0.0380
- citation_f1: 0.5000
- citation_precision: 0.5000
- citation_recall: 0.5000
- integrity_pass: 0.6667
- keyword_recall: 0.3083
- llm_judge: 0.6364
- quota_pass: 0.6667
- rouge_l: 0.0538
- tool_call_f1: 0.9048
- tool_call_precision: 0.8571
- tool_call_recall: 1.0000
- validator_pass: 1.0000

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_002` — keyword_recall
- `delta_credit_and_quota::quota_003` — keyword_recall
- `lesson_qa::lesson_qa_001` — llm_judge, citation_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — citation_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — llm_judge, citation_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — citation_recall, tool_call_precision
- `quiz_integrity::integrity_001` — keyword_recall
- `quiz_integrity::integrity_002` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — llm_judge
- `socratic_agent::socratic_003` — llm_judge
- `validator_guardrails::validator_001` — keyword_recall
- `validator_guardrails::validator_002` — keyword_recall
