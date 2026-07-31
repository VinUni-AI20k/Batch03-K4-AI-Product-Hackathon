# Agent Evaluation Report

- Adapter: `eval.adapters.project_adapter`
- Cases: **1/20 passed** (5.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **2087.64 / 7620.11 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 0/3 | 0.0% | 0.0 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 6579.3 | 10227.92 |
| quiz_generation | 1/4 | 25.0% | 2846.36 | 3875.7 |
| quiz_integrity | 0/3 | 0.0% | 0.0 | 0.0 |
| socratic_agent | 0/3 | 0.0% | 2685.13 | 3472.13 |
| validator_guardrails | 0/3 | 0.0% | 1840.59 | 1922.53 |

## Aggregate metrics

- bleu: 0.0386
- citation_f1: 0.5000
- citation_precision: 0.5000
- citation_recall: 0.5000
- integrity_pass: 0.6667
- keyword_recall: 0.2917
- quota_pass: 0.6667
- rouge_l: 0.0564
- tool_call_f1: 0.5595
- tool_call_precision: 0.6071
- tool_call_recall: 0.5714
- validator_pass: 0.3333

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall, quota_pass
- `delta_credit_and_quota::quota_002` — keyword_recall
- `delta_credit_and_quota::quota_003` — keyword_recall
- `lesson_qa::lesson_qa_001` — keyword_recall, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — keyword_recall, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — keyword_recall, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — keyword_recall, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_002` — keyword_recall
- `quiz_generation::quiz_generation_003` — keyword_recall
- `quiz_generation::quiz_generation_004` — keyword_recall
- `quiz_integrity::integrity_001` — keyword_recall
- `quiz_integrity::integrity_002` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_003` — keyword_recall
- `socratic_agent::socratic_001` — keyword_recall, tool_call_recall
- `socratic_agent::socratic_002` — keyword_recall, tool_call_recall
- `socratic_agent::socratic_003` — keyword_recall, tool_call_recall
- `validator_guardrails::validator_001` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_002` — keyword_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_003` — tool_call_recall, tool_call_precision
