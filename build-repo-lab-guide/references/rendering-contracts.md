# Rendering Contracts

Render HTML and Markdown from the same normalized lab model. Do not allow the
two formats to drift in phase count, tasks, paths, or deliverables.

## HTML contract

Use `assets/lab-guide-template.html` and replace only
`__LAB_MODEL_JSON__`. Produce one offline UTF-8 file with inline CSS and
JavaScript.

Include:

- title, audience, repository revision, timebox, and audit date;
- concise audit findings before the phases;
- setup commands selected by operating system;
- editable learner names for team roles;
- vertical phase navigation;
- `parallel`, `sequential`, and `mixed` badges localized for the output
  language;
- task checkboxes, progress, timer, focus mode, reset confirmation, and
  `localStorage`;
- four visible task panels;
- per-phase workflow, handoffs, shared files, checkpoint, and suggested
  commits;
- required-new-file summary;
- copy buttons for commands;
- print and responsive styles;
- repository evidence footer.

For Vietnamese, use these visible panel labels exactly:

1. `Kiến thức`
2. `Hướng dẫn`
3. `Đầu ra kỳ vọng`
4. `Các file cần nộp`

Do not use English UI labels such as `Knowledge`, `Instructions`,
`Expected outcome`, `Deliverables`, `Parallel`, `Sequential`, `Roles`,
`Definition of Done`, or `Step by step`.

Technical identifiers and established terms such as API, JSON, ReAct, prompt,
tool, and trace may remain when appropriate.

## Markdown contract

Use one section per phase. Start each phase with its time, mode, entry
condition, and checkpoint.

Render every task in the phase as one row in exactly this table:

| Kiến thức | Hướng dẫn | Đầu ra kỳ vọng | Các file cần nộp |
| --- | --- | --- | --- |

Do not use four repeated headings.

After the task table, render:

| Vai trò | Công việc | Bàn giao | Commit đề xuất |
| --- | --- | --- | --- |

Then list:

- shared files and their single writer;
- integration owner;
- checkpoint;
- files included in each suggested commit.

Keep commands in fenced blocks outside table cells when multiline commands are
needed. Reference them from the relevant guidance cell by a short label.

## Content rules

- Use repository-relative paths.
- Mark required files with `NEW FILE`.
- Mark local-only files with `LOCAL ONLY`.
- List only actual file artifacts in the deliverable column.
- Keep logs, oral explanations, scores, and URLs as evidence/checkpoints, not
  file deliverables.
- Keep instructions short and behavioral.
- Keep expected outcomes observable.
- Show one explicit validation command or manual validation checklist per task.
- Label inference as `Suy luận của coach`.
- Do not add a submission tutorial or Git-resolution appendix.

## Default output names

- HTML: `lab-guide.html`
- Markdown: `lab-guide.md`

Check for an existing target before writing. Do not silently overwrite an
unrelated file.
