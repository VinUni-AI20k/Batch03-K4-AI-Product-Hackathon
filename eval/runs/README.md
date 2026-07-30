# CP3 run history

All three runs used the same `eval/cases.json` file with SHA-256:

`D44F8C83AF13BAF04E8AEB0CEA907EF327813ABB9B56CD67DE39D572132E3DFD`

| Run | Score | System state | Quality bar |
|---|---:|---|---|
| `run-01` | 18/25 (72%) | Baseline | Not met |
| `run-02` | 24/25 (96%) | Retrieval, uncertainty disclosure and authority safety boundary added | Met |
| `run-03` | 25/25 (100%) | Safety phrase matching fixed to use word boundaries | Met |

Each directory contains `report.json`, `report.md`, `results.jsonl` and `run.log`. Run 04 verifies that the unchanged golden set remains 25/25 after adding controlled submission simulation. The root `eval/report.*`, `eval/results.jsonl` and `eval/run.log` are the latest run.
