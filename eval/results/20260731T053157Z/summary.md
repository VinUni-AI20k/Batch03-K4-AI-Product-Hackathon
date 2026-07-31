# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **9/20 passed** (45.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **1**
- Latency p50 / p95: **1493.53 / 10656.55 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 2/3 | 66.7% | 0.01 | 0.02 |
| lesson_qa | 0/4 | 0.0% | 9269.2 | 10724.32 |
| quiz_generation | 4/4 | 100.0% | 2424.34 | 2912.71 |
| quiz_integrity | 0/3 | 0.0% | 0.02 | 0.02 |
| socratic_agent | 0/3 | 0.0% | 1538.16 | 6304.86 |
| validator_guardrails | 3/3 | 100.0% | 1.3 | 1304.14 |

## Aggregate metrics

- bleu: 0.1869
- citation_f1: 0.5000
- citation_precision: 0.5000
- citation_recall: 0.5000
- integrity_pass: 0.3333
- keyword_recall: 0.6583
- llm_judge: 0.4545
- quota_pass: 1.0000
- rouge_l: 0.2767
- tool_call_f1: 0.8452
- tool_call_precision: 0.8095
- tool_call_recall: 0.9286
- validator_pass: 1.0000

## Failed cases

- `delta_credit_and_quota::quota_001` — keyword_recall
- `lesson_qa::lesson_qa_001` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — citation_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — llm_judge, citation_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — llm_judge, citation_recall, tool_call_precision
- `quiz_integrity::integrity_001` — keyword_recall, integrity_pass
- `quiz_integrity::integrity_002` — keyword_recall
- `quiz_integrity::integrity_003` — keyword_recall, integrity_pass
- `socratic_agent::socratic_001` — llm_judge
- `socratic_agent::socratic_002` — llm_judge
- `socratic_agent::socratic_003` — llm_judge
