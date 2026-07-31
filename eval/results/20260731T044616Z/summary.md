# Agent Evaluation Report

- Adapter: `eval.adapters.project_adapter`
- Cases: **0/20 passed** (0.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **1976.16 / 9716.95 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.01 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 7877.36 | 13105.27 |
| quiz_generation | 0/4 | 0.0% | 2610.11 | 3980.18 |
| quiz_integrity | 0/3 | 0.0% | 0.01 | 0.01 |
| socratic_agent | 0/3 | 0.0% | 2233.77 | 2253.01 |
| validator_guardrails | 0/3 | 0.0% | 11.68 | 1611.25 |

## Aggregate metrics

- bleu: 0.0385
- citation_f1: 0.5000
- citation_precision: 0.5000
- citation_recall: 0.5000
- integrity_pass: 0.6667
- keyword_recall: 0.2917
- quota_pass: 0.6667
- rouge_l: 0.0512
- tool_call_f1: 0.6286
- tool_call_precision: 0.5952
- tool_call_recall: 0.7143
- validator_pass: 0.3333

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_002` — keyword_recall
- `delta_credit_and_quota::quota_003` — keyword_recall
- `lesson_qa::lesson_qa_001` — rouge_l, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — rouge_l, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — rouge_l, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — rouge_l, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_001` — rouge_l
- `quiz_generation::quiz_generation_002` — rouge_l
- `quiz_generation::quiz_generation_003` — rouge_l
- `quiz_generation::quiz_generation_004` — rouge_l
- `quiz_integrity::integrity_001` — keyword_recall
- `quiz_integrity::integrity_002` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — rouge_l
- `socratic_agent::socratic_002` — rouge_l
- `socratic_agent::socratic_003` — rouge_l
- `validator_guardrails::validator_001` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_002` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_003` — tool_call_precision
