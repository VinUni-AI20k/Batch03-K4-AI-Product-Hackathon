---
name: build-repo-lab-guide
description: Analyze a cloned teaching-lab repository and generate a time-boxed, learner-facing interactive single-file HTML or structured Markdown guide. Use when Codex must turn README files, docs, source code, tests, configs, and scripts into executable lab instructions for AI/backend learners; separate knowledge, instructions, expected code outcomes, and deliverables; infer sequential versus parallel phases; assign team roles; expose missing files and real input contracts; or provide OS-specific copyable commands and validation.
---

# Build Repo Lab Guide

Turn a cloned repository into a lab guide that a fresher AI engineer with some
backend experience can execute without guessing. Treat the repository as
evidence, not as already-correct instructional material.

## Resolve the request

1. Resolve the repository root with `git rev-parse --show-toplevel`. Use the
   user-supplied directory when it is not a Git checkout.
2. Honor an explicitly requested output format and output path.
3. Default to a standalone interactive HTML file when the user asks for an
   interactive guide. Default to Markdown for a text-only guide.
4. Default the audience to fresher AI engineers with basic backend, terminal,
   Git, JSON, and Python/JavaScript experience unless the user says otherwise.
5. Default to five learners only when team size is missing and role assignment
   is requested. Infer duration from repository evidence; do not invent a hard
   deadline.
6. Match the user's language. Prefer Vietnamese when the request or primary lab
   material is Vietnamese.
7. Treat a request for one local `.html` file as a file artifact. Do not deploy
   it unless the user explicitly asks to publish.

Ask one concise group of at most three questions only when answers would
materially change the guide:

- Which repository, branch, or commit is authoritative when the checkout is
  missing or ambiguous?
- What are the team size and hard timebox when neither can be inferred?
- Should the output be HTML or Markdown when the request is genuinely
  ambiguous?

Skip questions already answered by the user or repository. Continue with
explicitly labeled assumptions when ambiguity is low-impact.

## Audit the repository

Read applicable `AGENTS.md` files before changing anything. Preserve unrelated
user changes. Use `rg --files` and targeted reads; skip vendored, generated,
model, cache, and dependency directories.

Inspect, when present:

- `README*`, `docs/**/*`, assignment and scoring documents
- `requirements.txt`, `pyproject.toml`, `package.json`, lockfiles, `Makefile`
- `.env.example`, sample configs, fixtures, schemas, and test-case data
- source entrypoints and files named by the instructions
- `tests/`, `test/`, test config, and CI workflows
- submission checklists, rubrics, role plans, and timelines

Build an internal fact ledger before designing the guide:

| Fact type | Resolve from |
| --- | --- |
| Learning objective | lecture/lab docs plus actual code path |
| Setup and run command | manifest, scripts, CI, then docs |
| Automated test command | test config or CI; never infer from wording alone |
| Input contract | parser, loader, schema, fixture, and indexing code |
| Expected output | assertions or deterministic code; docs only when consistent |
| Existing deliverable | verified repository path |
| New deliverable | required path mentioned in docs but absent on disk |
| Timing and phases | timeline/checklist; record conflicts |
| Role ownership | files changed, dependency edges, and integration point |

Use this authority order for implementation facts:

1. Executable tests and assertions
2. Source code and data loaders
3. Manifests, scripts, and CI
4. README and teaching documents
5. Clearly labeled coach inference

Teaching intent may live only in documentation; preserve it while reporting
conflicts with executable behavior.

## Detect ambiguity and missing contracts

Check every path named as a required artifact. Distinguish:

- **Existing file to edit**
- **New file to create**
- **Local-only file that must not be committed**
- **Generated or optional artifact**

For every new file, provide all of:

1. Exact absolute path and repository-relative path
2. Purpose
3. Creation command for the selected operating system
4. Required format or schema
5. Minimal starter content when safe
6. Validation command
7. Expected validation output

Trace test input from the actual entrypoint. Record:

- file path and encoding
- container type such as JSON array or object
- required fields and types
- the exact items or indices consumed
- edge cases and error behavior

Never call a run command an automated test unless assertions or a test runner
support that claim. Label commands accurately as:

- Setup
- Smoke/demo run
- Automated test
- Contract validation
- Submission/security check

When no automated test exists, say so and add safe, read-only contract
validation commands where useful. Do not fabricate a hidden test suite.

Surface contradictions near the top of the guide. Examples include conflicting
durations, a required file absent from the tree, a README claiming all cases
run while source selects one case, or an expected result that code cannot
produce.

## Build the dependency plan

Model each task with:

- `inputs`
- `actions`
- `outputs`
- `owner`
- `consumers`
- `validation`
- `estimated_minutes`

Mark tasks **parallel** only when they have no unmet dependency and do not edit
the same file or integration surface. Mark tasks **sequential** when one
consumes another's output, multiple changes converge into one file, or a test,
review, or submission gate must follow integration.

Arrange phases vertically from top to bottom. Put a visible checkpoint between
phases. State exactly what must be true before the next phase starts.

For a five-person team, prefer these adaptable roles:

1. Product/Test Architect — test cases and problem definition
2. Tool/Data Engineer — tools, deterministic functions, or data layer
3. Prompt/Policy Engineer — prompts, contracts, or safeguards
4. Core Integrator — shared entrypoint and sequential integration
5. Observability/Reviewer — traces, evaluation, report, and final artifact

Rename roles to match the repository. Assign ownership by file, not by vague
activity. When a phase has fewer than five independent coding tasks, assign the
remaining learners to tests, report/evidence, review, refactoring, or
validation so each person can produce a useful commit.

At every integration gate:

1. Finish parallel file-owned tasks.
2. Pull or merge the inputs.
3. Let one integrator update the shared entrypoint.
4. Run validation.
5. Let the whole team inspect the evidence.
6. Start the next phase only after the checkpoint passes.

## Write every task with four separate concepts

Render these four concepts simultaneously for every task. Never mix them:

### 1. Knowledge

- State what the learner must understand in no more than three short lines.
- Explain why the task exists, not how to type commands.
- Use one concrete example when it materially improves understanding.

### 2. Instructions

- Use short imperative steps.
- Name the exact file to open or create.
- Show the absolute path first and repository-relative path for Git context.
- Provide copyable commands separately from prose.
- Explain how to run or validate the change.
- Do not assume the learner knows an unstated file location or format.

### 3. Expected outcome

- Begin with one very short sentence describing the observable result.
- Show the expected terminal output, file shape, trace, HTTP response, UI
  behavior, or assertion.
- Separate code behavior from learning material.
- Label inferred outcomes as `Coach inference`.

### 4. Deliverables

- List only files, reports, links, traces, or other submission artifacts.
- Do not repeat instructions.
- Mark new files explicitly with `NEW FILE`.
- Mark local-only files explicitly with `DO NOT COMMIT`.

## Generate commands

Provide operating-system variants when syntax differs:

- Windows PowerShell
- macOS
- Linux

Prefer commands already used by manifests, scripts, tests, or CI. Keep
commands directly copyable and show the expected output immediately nearby.

Never expose, echo, or commit secrets. Prefer a mock, local, or zero-key path
for the first smoke test. Clearly identify `.env`, credentials, large models,
and caches as local-only when applicable.

Avoid destructive commands. Do not add packages, alter application code, or
repair the lab unless the user asks; generating the guide authorizes analysis
and the guide artifact, not unrelated repository changes.

## HTML output contract

Generate one standalone UTF-8 `.html` file with inline CSS and JavaScript. Do
not require a framework, build step, CDN, external font, image, or network
request. External repository links are allowed.

Write this standalone artifact directly. Do not invoke Sites, a site lifecycle,
a frontend initializer, a package manager, or deployment tooling unless the
user explicitly requests a hosted site or the repository already contains
`.openai/hosting.json`.

Keep all lab-specific content in one clearly marked `LAB_CONFIG` object. Keep
the renderer generic so a later skill run can replace data without rewriting
the interaction code.

Include:

- Title, audience, repository, branch/commit, total time, and source audit date
- Top-level jumps for Setup, Step by step, Roles, Validation, and New files
- OS selector that updates command blocks
- Team-role cards with editable learner names
- Vertical phases with time, parallel/sequential badges, and checkpoints
- Four visible task panels: Knowledge, Instructions, Expected outcome,
  Deliverables
- Copy buttons for every command
- Overall countdown or timebox control
- Task checkboxes and progress indicator
- `localStorage` persistence
- Focus mode that hides completed work
- Reset confirmation and print-friendly styling
- Responsive desktop/mobile layout
- Keyboard-accessible controls, visible focus, semantic headings, and labels
- A final Definition of Done and submission/security checklist
- A source footer listing repository files used

Place contradictions and missing-contract findings in a compact audit section
before the phases. Do not bury them in footnotes.

Use a restrained, professional visual system. Ensure sufficient contrast and
make the four task concepts visually distinct. Keep content readable without
decorative imagery.

Default the filename to `lab-guide.html` in the repository root unless the user
specifies another target. Check for an existing target before writing; do not
overwrite an unrelated file silently.

## Markdown output contract

Generate one UTF-8 `.md` file with the same semantics as HTML. Include:

1. Metadata and assumptions
2. Repository audit and contradictions
3. Setup per operating system
4. Five-role ownership table when applicable
5. Critical path and phase checkpoints
6. Each task with four explicit subheadings:
   `Knowledge`, `Instructions`, `Expected outcome`, `Deliverables`
7. Copyable fenced commands followed by expected output
8. Validation cheat sheet
9. Definition of Done and submission checklist
10. Repository source paths used

Default the filename to `lab-guide.md` in the repository root unless the user
specifies another target. Use checkboxes for progress and concise tables for
roles or exact mappings.

## Validate the artifact

Before delivery:

1. Confirm every named source and deliverable path against the repository.
2. Confirm every new file has creation, format, validation, and expected output.
3. Confirm every phase has a dependency label and checkpoint.
4. Confirm every task contains all four required concepts.
5. Confirm commands match the selected OS and are clearly labeled.
6. Confirm smoke, validation, and automated tests are not conflated.
7. Confirm secrets are never displayed or staged.
8. Confirm the output file exists and is non-empty.

For HTML:

- Compile inline JavaScript with Node when available.
- Check that required navigation targets, `LAB_CONFIG`, task checkboxes, copy
  controls, progress, OS switching, and responsive styles are present.
- Open and exercise the file in an available browser when practical.
- Verify the page remains usable without network access.

For Markdown:

- Check heading order, code fences, links, tables, and checklist rendering.
- Search for unresolved placeholders such as `TODO`, `TBD`, or invented paths.

Fix validation failures before delivery. If repository behavior cannot be
verified without paid APIs, credentials, destructive actions, or unavailable
services, label that portion `Not executed` and state the exact manual check.

## Deliver

Lead with the created file. Briefly summarize:

- output format and location
- number of phases and team model
- important repository contradictions resolved
- assumptions or checks that remain unverified

Do not dump the full audit process. Keep source-path evidence in the artifact
so another coach can review the conclusions.
