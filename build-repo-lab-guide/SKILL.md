---
name: build-repo-lab-guide
description: Analyze a cloned teaching-lab repository and generate a time-boxed learner guide as interactive standalone HTML or structured Markdown. Use when Codex must turn README files, docs, source code, tests, configs, and scripts into executable lab phases for fresher AI/backend engineers; separate knowledge, guidance, expected outcomes, and file deliverables; identify required new files and real input contracts; plan five-person collaboration and phase commits; or validate that a guide teaches without revealing implementation solutions or Git workflows.
---

# Build Repo Lab Guide

Turn a cloned repository into a lab coach that helps learners finish on time
without solving the implementation for them. Treat repository files as
evidence, not as already-correct teaching instructions.

## Apply the workflow

1. Resolve the repository root and the requested output path.
2. Read [references/repository-audit.md](references/repository-audit.md) and
   audit the repository before drafting instructions.
3. Read [references/instruction-boundary.md](references/instruction-boundary.md)
   and remove solution-level detail from learner instructions.
4. Build one normalized lab model that follows
   [references/lab-model-schema.md](references/lab-model-schema.md).
5. Read [references/team-workflow-patterns.md](references/team-workflow-patterns.md)
   and assign ownership, handoffs, integration gates, and suggested commits.
6. Read [references/workflow-graph-requirements.md](references/workflow-graph-requirements.md)
   and derive the mandatory Markdown end-to-end team workflow graph from the normalized model.
7. Read [references/rendering-contracts.md](references/rendering-contracts.md),
   then render the normalized model with `scripts/render_lab_guide.py`.
8. Validate both the model and artifact with
   `scripts/validate_lab_guide.py`. Fix every error before delivery.

Do not draft the final HTML or Markdown directly from scattered repository
notes. Normalize facts into the lab model first so both formats preserve the
same task boundaries and phase plan.

## Resolve defaults

- Honor user requirements over repository suggestions and skill defaults.
- Default to Vietnamese when the user or primary lab material is Vietnamese.
- Keep technical identifiers unchanged, but localize navigation, headings,
  badges, buttons, and explanatory labels consistently.
- Default to interactive standalone HTML. Generate Markdown only when the user
  explicitly requests it or needs a text-only export.
- Default to five learners when team size is absent and collaboration is
  required.
- Use repository-relative paths as the canonical learner-facing paths. Show
  `<REPO_ROOT>/path/to/file` only when extra location context is necessary.
  Never expose the audit machine's absolute path.
- Infer time only from repository evidence. Label coach estimates explicitly.
- Ask at most three concise questions only when repository identity, hard
  timebox, team size, or output format would materially change the result.

## Preserve the teaching boundary

Give exact setup commands, file locations, contracts, validation commands, and
observable outcomes. Do not give line numbers, patches, implementation
sequences, complete algorithms, or answer code.

For an existing source file, state:

- its repository-relative path;
- the responsibility or behavior to complete;
- the public interface that must remain compatible;
- the validation command and observable result.

For a required new file, state:

- the exact repository-relative path and whether the parent directory exists;
- the file's purpose and required format;
- the creation command for the selected operating system;
- the required interface, schema, or content sections;
- the validation command and expected output.

Provide a signature-only scaffold only when tests or public docs require an
exact symbol. Provide starter content only for environment/config boilerplate
that is not itself the learning objective.

## Keep Git outside the lab workflow

Do not teach repository submission, branching, merging, rebasing, pushing,
remote management, or conflict resolution. Do not emit commands such as
`git add`, `git commit`, `git push`, `git merge`, `git rebase`, or
`git remote add`.

The guide may include a suggested commit for each phase as planning metadata:

- concise commit message;
- owner;
- files included;
- checkpoint required before the commit.

Do not include Git commands. Treat local secret checks as setup/security only,
not as a submission tutorial.

## Plan collaboration

Classify every phase as `parallel`, `sequential`, or `mixed`.

For each phase, define:

- entry condition;
- file ownership;
- work that can proceed in parallel;
- shared files that have one writer;
- handoffs between roles;
- integration owner;
- validation checkpoint;
- suggested commit and included deliverable files.

Use task-level workflow only when a single phase is too complex for one clear
handoff plan. Never assign two learners to edit the same shared file
simultaneously.

## Render the guide

Create a UTF-8 normalized model file, normally `lab-model.json`, in the target
repository only when the user asks to keep the intermediate model. Otherwise
use a temporary model and deliver only the requested guide.

Render with:

```bash
python3 <SKILL_DIR>/scripts/render_lab_guide.py \
  --model <MODEL_JSON> \
  --format html \
  --output <REPO_ROOT>/lab-guide.html
```

For Markdown, change `--format html` to `--format markdown`.

HTML must remain a single offline file with inline CSS and JavaScript.
Markdown must render every phase as a table with exactly these four columns:

| Kiến thức | Hướng dẫn | Đầu ra kỳ vọng | Các file cần nộp |
| --- | --- | --- | --- |

Do not replace this table with four repeated subheadings.

Markdown must also render one end-to-end team workflow graph derived from the
normalized model. Do not add a duplicate graph field to the model.

## Validate

Run:

```bash
python3 <SKILL_DIR>/scripts/validate_lab_guide.py \
  --model <MODEL_JSON> \
  --artifact <OUTPUT_FILE>
```

The validator must reject:

- missing phase/task concepts;
- missing new-file contracts;
- audit-machine absolute paths;
- line-level or patch-style implementation guidance;
- forbidden Git workflow commands;
- phases without collaboration and suggested commit plans;
- English UI labels in a Vietnamese artifact;
- Markdown phases without the required four-column table;
- unresolved placeholders or files contradicted by repository evidence.

Also compile inline JavaScript with Node and exercise the HTML in a browser
when available. Label any check requiring unavailable credentials, paid APIs,
or external services as `Chưa chạy`, with the exact manual verification.

## Deliver

Lead with the generated file and summarize:

- output format and location;
- phase count, timebox, and team model;
- required new files;
- major repository ambiguities surfaced;
- checks that remain unexecuted.

Do not dump the full audit process into the response. Keep the evidence paths
inside the artifact for coach review.
