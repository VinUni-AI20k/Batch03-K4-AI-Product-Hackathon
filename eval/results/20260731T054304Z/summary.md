# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **0/20 passed** (0.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **20**
- Latency p50 / p95: **0.56 / 3320.91 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.31 | 1.02 |
| lesson_qa | 0/4 | 0.0% | 0.83 | 0.88 |
| quiz_generation | 0/4 | 0.0% | 0.43 | 0.46 |
| quiz_integrity | 0/3 | 0.0% | 0.23 | 0.39 |
| socratic_agent | 0/3 | 0.0% | 0.7 | 1.16 |
| validator_guardrails | 0/3 | 0.0% | 3320.71 | 3324.38 |

## Aggregate metrics

- bleu: 0.0000
- citation_f1: 0.0000
- citation_precision: 0.0000
- citation_recall: 0.0000
- integrity_pass: 0.6667
- keyword_recall: 0.0000
- llm_judge: 0.0000
- quota_pass: 0.0000
- rouge_l: 0.0000
- tool_call_f1: 0.0000
- tool_call_precision: 0.0000
- tool_call_recall: 0.0000
- validator_pass: 0.3333

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_002` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_003` — keyword_recall, quota_pass
- `lesson_qa::lesson_qa_001` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_001` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_002` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_003` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_004` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_integrity::integrity_001` — keyword_recall
- `quiz_integrity::integrity_002` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — llm_judge, tool_call_recall, tool_call_precision
- `socratic_agent::socratic_002` — llm_judge, tool_call_recall, tool_call_precision
- `socratic_agent::socratic_003` — llm_judge, tool_call_recall, tool_call_precision
- `validator_guardrails::validator_001` — keyword_recall, tool_call_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_002` — keyword_recall, tool_call_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_003` — keyword_recall, tool_call_recall, tool_call_precision
