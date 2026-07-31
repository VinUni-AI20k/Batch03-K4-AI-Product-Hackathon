# Repository Audit

Audit the cloned repository before designing phases. Read applicable
`AGENTS.md` files first and preserve unrelated user changes.

## Inspect evidence

Use `rg --files` and targeted reads. Skip dependency, cache, model, generated,
and vendored directories unless the lab explicitly teaches them.

Inspect, when present:

- `README*`, assignment documents, rubrics, schedules, and `docs/`;
- `requirements.txt`, `pyproject.toml`, `package.json`, lockfiles, and
  `Makefile`;
- `.env.example`, sample configs, schemas, fixtures, and test-case data;
- source entrypoints, parsers, loaders, registries, and files named by docs;
- `tests/`, test configuration, graders, and CI workflows;
- required reports, diagrams, traces, and submission checklists.

Use this authority order for executable facts:

1. Tests and assertions.
2. Source code, parsers, and data loaders.
3. Manifests, scripts, and CI.
4. README and teaching documents.
5. Coach inference, clearly labeled.

Preserve teaching intent from documentation while surfacing conflicts with
executable behavior.

## Build the fact ledger

Record these facts before writing the normalized model:

| Fact | Evidence to resolve |
| --- | --- |
| Learning objective | lecture/lab docs plus the actual code path |
| Setup command | manifests, scripts, CI, then docs |
| Smoke/demo command | executable entrypoint without test assertions |
| Automated test | test runner or assertion-backed command |
| Input contract | parser, loader, schema, fixture, and indexing behavior |
| Expected outcome | assertions or deterministic code behavior |
| Existing file to edit | verified path already present in the tree |
| Required new file | required path absent from the tree |
| Local-only artifact | environment, secret, cache, generated data, or model |
| Phase timing | schedule/checklist plus explicit conflicts |
| Dependencies | producer/consumer relationships between tasks |
| Shared surface | entrypoint or file that must have one writer |

## Classify every file

Assign one status:

- `existing_edit`;
- `new_required`;
- `local_only`;
- `generated`;
- `optional`;
- `reference_only`.

Verify every named path against the repository. Do not invent a file because
it would make the guide cleaner.

For a required new file, resolve:

1. repository-relative path;
2. purpose;
3. parent directory status;
4. file format or schema;
5. required symbols or sections;
6. consumers;
7. validation command;
8. expected validation output.

Do not expose the audit machine's absolute path. Use `<REPO_ROOT>/...` only as
a portable display convention.

## Trace real inputs

Follow test or runtime input from entrypoint to consumer. Record:

- source path and encoding;
- container type;
- required fields and types;
- items or indices actually consumed;
- defaults and optional fields;
- edge cases and error behavior.

If docs say all test cases run but source selects one item, report that
contradiction prominently.

## Label command types

Use only accurate labels:

- `setup`;
- `smoke_demo`;
- `automated_test`;
- `contract_validation`;
- `manual_check`;
- `security_check`.

Never call a run command an automated test without a test runner or
assertions. Do not fabricate hidden tests.

## Inspect setup conflict risks

Record only risks relevant to successful local execution and team ownership:

- runtime and version;
- environment isolation;
- dependency manager and lockfile;
- local config copied from examples;
- port, database, cache, or vector-store collisions;
- secrets and generated files;
- shared files that require one writer;
- interfaces that must be agreed before parallel work.

Do not turn this section into Git branching, merging, pushing, or conflict
resolution instructions.

## Surface contradictions

Place high-impact contradictions before the phases:

- conflicting timeboxes;
- a required file missing from the tree;
- docs and test contracts disagreeing;
- a demo running fewer cases than claimed;
- an expected output the starter code cannot produce;
- a grader loading a different file from the one learners are told to edit.

State the evidence, learner impact, and guide decision. Do not silently repair
the repository unless the user explicitly asks.
