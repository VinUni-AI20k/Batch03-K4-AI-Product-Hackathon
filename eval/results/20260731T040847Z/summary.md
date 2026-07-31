# Agent Evaluation Report

- Adapter: `eval.adapters.mock_vlearn_adapter`
- Cases: **1/20 passed** (5.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **0.0 / 0.01 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.01 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 0.0 | 0.0 |
| quiz_generation | 0/4 | 0.0% | 0.0 | 0.01 |
| quiz_integrity | 0/3 | 0.0% | 0.0 | 0.0 |
| socratic_agent | 0/3 | 0.0% | 0.0 | 0.0 |
| validator_guardrails | 1/3 | 33.3% | 0.0 | 0.0 |

## Aggregate metrics

- bleu: 0.0603
- citation_f1: 0.0000
- citation_precision: 0.0000
- citation_recall: 0.0000
- integrity_pass: 0.6667
- keyword_recall: 0.2750
- quota_pass: 0.6667
- rouge_l: 0.0759
- tool_call_f1: 0.9524
- tool_call_precision: 0.9286
- tool_call_recall: 1.0000
- validator_pass: 0.3333

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_002` — keyword_recall
- `delta_credit_and_quota::quota_003` — keyword_recall
- `lesson_qa::lesson_qa_001` — keyword_recall, citation_recall
- `lesson_qa::lesson_qa_002` — keyword_recall, citation_recall
- `lesson_qa::lesson_qa_003` — citation_recall
- `lesson_qa::lesson_qa_004` — keyword_recall, citation_recall
- `quiz_generation::quiz_generation_001` — keyword_recall, citation_recall
- `quiz_generation::quiz_generation_002` — keyword_recall, citation_recall
- `quiz_generation::quiz_generation_003` — keyword_recall, citation_recall
- `quiz_generation::quiz_generation_004` — keyword_recall, citation_recall
- `quiz_integrity::integrity_001` — keyword_recall
- `quiz_integrity::integrity_002` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — keyword_recall
- `socratic_agent::socratic_002` — keyword_recall
- `socratic_agent::socratic_003` — keyword_recall
- `validator_guardrails::validator_001` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_002` — keyword_recall, tool_call_precision, validator_pass
