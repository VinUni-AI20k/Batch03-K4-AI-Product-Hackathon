# CP3 evaluation

`cases.json` contains 25 Vietnamese service-usage questions. Each case records the input, expected behavior, source, scenario types, and machine-checkable assertions. Exactly 10 cases are de-identified observations from group self-testing. The set covers:

- grounded procedure lookup;
- unsupported requests;
- ambiguous requests;
- disallowed actions;
- high-consequence deadline questions;
- form routing for birth registration, residence (`CT01`), and construction permits.
- no-inference behavior and switching forms after a user correction.

Review artifacts:

- `golden-set.md` - human-readable index of all 25 cases;
- `prompt-analysis.md` - scope and risk analysis of the four runtime prompts;
- `form_answers.md` - concise Vietnamese text ready to paste into the CP3 form.

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
real. The unchanged 25-case set produced 18/25 on the baseline run, 24/25 after
the first system improvement, 25/25 after the safety fix, and 25/25 again after
adding controlled submission simulation. Historical artifacts
are stored under `runs/`; `report.md` and `results.jsonl` contain the latest run.
