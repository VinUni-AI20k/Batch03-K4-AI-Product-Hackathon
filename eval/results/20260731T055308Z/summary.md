# Agent Evaluation Report

- Adapter: `adapters.project_adapter`
- Cases: **6/20 passed** (30.0%)
- Quality bar: **80%** — FAIL
- Runtime errors: **0**
- Latency p50 / p95: **0.98 / 1887.27 ms**

## Performance by agent/module

| Suite | Passed | Pass rate | p50 ms | p95 ms |
|---|---:|---:|---:|---:|
| delta_credit_and_quota | 3/3 | 100.0% | 0.01 | 0.01 |
| lesson_qa | 0/4 | 0.0% | 1.18 | 2.39 |
| quiz_generation | 0/4 | 0.0% | 1.19 | 1.62 |
| quiz_integrity | 3/3 | 100.0% | 0.0 | 0.01 |
| socratic_agent | 0/3 | 0.0% | 0.97 | 0.99 |
| validator_guardrails | 0/3 | 0.0% | 1849.23 | 2533.98 |

## Aggregate metrics

- bleu: 0.0293
- citation_f1: 0.0000
- citation_precision: 0.0000
- citation_recall: 0.0000
- integrity_pass: 1.0000
- keyword_recall: 0.3000
- llm_judge: 0.0000
- quota_pass: 1.0000
- rouge_l: 0.0636
- tool_call_f1: 0.0000
- tool_call_precision: 0.0000
- tool_call_recall: 0.0000
- validator_pass: 0.3333

## Failed cases

- `lesson_qa::lesson_qa_001` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_002` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_003` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `lesson_qa::lesson_qa_004` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_001` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_002` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_003` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `quiz_generation::quiz_generation_004` — llm_judge, citation_recall, tool_call_recall, tool_call_precision
- `socratic_agent::socratic_001` — llm_judge, tool_call_recall, tool_call_precision
- `socratic_agent::socratic_002` — llm_judge, tool_call_recall, tool_call_precision
- `socratic_agent::socratic_003` — llm_judge, tool_call_recall, tool_call_precision
- `validator_guardrails::validator_001` — keyword_recall, tool_call_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_002` — keyword_recall, tool_call_recall, tool_call_precision, validator_pass
- `validator_guardrails::validator_003` — keyword_recall, tool_call_recall, tool_call_precision
