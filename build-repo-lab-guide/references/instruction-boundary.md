# Instruction Boundary

Teach the contract and the verification path. Do not reveal the implementation
that learners are expected to discover.

## Allowed detail

Include:

- exact setup and dependency commands;
- exact repository-relative file paths;
- whether a file exists or must be created;
- purpose, responsibility, and public interface;
- input/output types and schemas confirmed by evidence;
- constraints that tests explicitly require;
- validation commands and observable outcomes;
- environment/config boilerplate unrelated to the learning objective;
- signature-only scaffolds when an exact symbol is required.

## Forbidden detail

Do not include:

- line numbers or instructions to replace specific lines;
- unified diffs, patches, or before/after source blocks;
- complete solution functions, classes, algorithms, or prompts;
- internal implementation sequences such as exact SDK calls when learners are
  expected to design them;
- exact exception structure, loop structure, or helper sequence unless it is
  itself a published interface contract;
- answers to reflection, analysis, diagram, or design tasks;
- Git submission, branching, merging, rebasing, pushing, remote management, or
  conflict-resolution instructions.

## Decide the right abstraction

| Situation | Give learners | Do not give |
| --- | --- | --- |
| Environment setup | copyable commands and expected result | application solution code |
| Existing source file | path, responsibility, interface, validation | line edits or patch |
| Required new source file | exact path, format, required symbols, validation | completed implementation |
| Required config file | path, schema, safe starter values | secrets |
| Required design/report | path, required sections, rubric | finished answer |
| Public test contract | required names, inputs, outputs | implementation chosen only to satisfy the test |

## Existing-file instruction pattern

Use this shape:

> Hoàn thiện trách nhiệm `<behavior>` trong `relative/path.py`. Giữ nguyên
> interface `<public symbol>` vì `<consumer/test>` sử dụng nó. Tự chọn cách
> triển khai. Chạy `<validation command>`; kết quả đạt là `<observable result>`.

Avoid this shape:

> Trong hàm X, import Y, tạo Z, gọi method A với B/C, bọc trong try/except rồi
> trả dictionary gồm năm key.

## New-file instruction pattern

State:

1. `NEW FILE · relative/path`;
2. purpose;
3. creation command;
4. required format;
5. required symbols or sections;
6. consumers;
7. validation;
8. expected result.

If the artifact is the learning objective, do not provide its completed
content. For example, give required nodes and decision criteria for a flowchart
but do not provide the final Mermaid diagram.

## Code-block policy

Allow code blocks for:

- shell commands;
- expected terminal output;
- schemas and signature-only scaffolds;
- safe environment/config examples.

Reject implementation code that completes the learner's core task. When a
code example is necessary to explain a data shape, use the smallest neutral
example and label it as an example, not the expected answer.

## Language policy

Use one primary human language throughout the UI and prose. Keep identifiers
and established technical terms when translation would reduce precision.
Explain a technical term briefly at first use when the audience may not know
it.

For Vietnamese output, localize interface labels:

- `Knowledge` → `Kiến thức`;
- `Instructions` → `Hướng dẫn`;
- `Expected outcome` → `Đầu ra kỳ vọng`;
- `Deliverables` → `Các file cần nộp`;
- `Roles` → `Vai trò`;
- `Parallel` → `Song song`;
- `Sequential` → `Tuần tự`;
- `Checkpoint` → `Điều kiện chuyển phase`;
- `Definition of Done` → `Điều kiện hoàn thành`.
