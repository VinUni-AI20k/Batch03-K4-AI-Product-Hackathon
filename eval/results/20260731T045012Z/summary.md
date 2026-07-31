# Agent Evaluation Report

- Adapter: `eval.adapters.project_adapter`
- Cases: **6/20 passed** (30.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **2146.28 / 8737.9 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.01 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 7322.5 | 13825.44 |
| quiz_generation | 4/4 | 100.0% | 2578.99 | 2912.12 |
| quiz_integrity | 0/3 | 0.0% | 0.0 | 0.01 |
| socratic_agent | 2/3 | 66.7% | 2169.52 | 2379.98 |
| validator_guardrails | 0/3 | 0.0% | 1.73 | 1771.31 |

## Aggregate metrics

- bleu: 0.0389
- citation_f1: 0.5000
- citation_precision: 0.5000
- citation_recall: 0.5000
- integrity_pass: 0.6667
- keyword_recall: 0.2917
- llm_judge: 0.7273
- quota_pass: 0.6667
- rouge_l: 0.0505
- tool_call_f1: 0.6286
- tool_call_precision: 0.5952
- tool_call_recall: 0.7143
- validator_pass: 0.3333

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
- `socratic_agent::socratic_002` — llm_judge
- `validator_guardrails::validator_001` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_002` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_003` — tool_call_precision
