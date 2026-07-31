# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **7/20 passed** (35.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **2080.68 / 12684.6 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.01 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 10341.77 | 14260.61 |
| quiz_generation | 4/4 | 100.0% | 3063.98 | 3266.46 |
| quiz_integrity | 0/3 | 0.0% | 0.0 | 0.01 |
| socratic_agent | 2/3 | 66.7% | 2051.89 | 2158.05 |
| validator_guardrails | 1/3 | 33.3% | 2.23 | 1898.75 |

## Aggregate metrics

- bleu: 0.0397
- citation_f1: 0.5000
- citation_precision: 0.5000
- citation_recall: 0.5000
- integrity_pass: 0.6667
- keyword_recall: 0.3083
- llm_judge: 0.7273
- quota_pass: 0.6667
- rouge_l: 0.0512
- tool_call_f1: 0.7143
- tool_call_precision: 0.7143
- tool_call_recall: 0.7143
- validator_pass: 1.0000

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_002` — keyword_recall
- `delta_credit_and_quota::quota_003` — keyword_recall
- `lesson_qa::lesson_qa_001` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — citation_recall, tool_call_recall, tool_call_precision
- `quiz_integrity::integrity_001` — keyword_recall
- `quiz_integrity::integrity_002` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — llm_judge
- `validator_guardrails::validator_001` — keyword_recall
- `validator_guardrails::validator_002` — keyword_recall
