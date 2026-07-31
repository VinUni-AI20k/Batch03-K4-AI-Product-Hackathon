# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **10/20 passed** (50.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **0.01 / 0.01 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 3/3 | 100.0% | 0.0 | 0.01 |
| lesson_qa | 1/4 | 25.0% | 0.01 | 0.01 |
| quiz_generation | 0/4 | 0.0% | 0.01 | 0.02 |
| quiz_integrity | 3/3 | 100.0% | 0.0 | 0.01 |
| socratic_agent | 0/3 | 0.0% | 0.01 | 0.01 |
| validator_guardrails | 3/3 | 100.0% | 0.0 | 0.01 |

## Aggregate metrics

- bleu: 0.0804
- citation_f1: 1.0000
- citation_precision: 1.0000
- citation_recall: 1.0000
- integrity_pass: 1.0000
- keyword_recall: 1.0000
- llm_judge: 0.0909
- quota_pass: 1.0000
- rouge_l: 0.1739
- tool_call_f1: 1.0000
- tool_call_precision: 1.0000
- tool_call_recall: 1.0000
- validator_pass: 1.0000

## Failed cases

- `lesson_qa::lesson_qa_001` — llm_judge
- `lesson_qa::lesson_qa_003` — llm_judge
- `lesson_qa::lesson_qa_004` — llm_judge
- `quiz_generation::quiz_generation_001` — llm_judge
- `quiz_generation::quiz_generation_002` — llm_judge
- `quiz_generation::quiz_generation_003` — llm_judge
- `quiz_generation::quiz_generation_004` — llm_judge
- `socratic_agent::socratic_001` — llm_judge
- `socratic_agent::socratic_002` — llm_judge
- `socratic_agent::socratic_003` — llm_judge
