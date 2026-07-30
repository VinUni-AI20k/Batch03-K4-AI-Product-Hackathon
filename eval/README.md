# CP3 evaluation

`cases.json` contains 20 Vietnamese service-usage questions. The set covers:

- grounded procedure lookup;
- unsupported requests;
- ambiguous requests;
- disallowed actions;
- high-consequence deadline questions;
- form routing for birth registration, residence (`CT01`), and construction permits.

Run it from the repository root with the temporary evaluation environment:

```powershell
$venv = 'C:\Users\ADMIN\.codex\visualizations\2026\07\30\019fb255-bd61-74b0-8f6e-06009a16b57c\sp-dvc-eval-venv'
& "$venv\Scripts\python.exe" eval\run_eval.py
```

Generated artifacts:

- `report.md` — short report suitable for review;
- `report.json` — machine-readable score and scenario counts;
- `results.jsonl` — every question, full answer, SSE events, metadata, and pass/fail reason;
- `run.log` — execution log without API credentials.

The runner exercises the real FastAPI SSE endpoint. It disables only the optional
PostgreSQL-backed embedding retrieval because Docker/PostgreSQL is unavailable in
the local environment; the local procedure snapshot and form-routing paths remain
real. The first-run score must be reviewed against the raw rows before being used
as a final claim in the CP3 form.
