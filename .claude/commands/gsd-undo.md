---
name: gsd-undo
description: "Safe git revert. Roll back phase or plan commits using the phase manifest with dependency checks."
argument-hint: "--last N | --phase NN | --plan NN-MM"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
requires: [phase]
---

<objective>
Safe git revert — roll back GSD phase or plan commits using the phase manifest, with dependency checks and a confirmation gate before execution.

Three modes:
- **--last N**: Show recent GSD commits for interactive selection
- **--phase NN**: Revert all commits for a phase (manifest + git log fallback)
- **--plan NN-MM**: Revert all commits for a specific plan
</objective>

<execution_context>
@/home/minhhieuano/2222/workspace/ai_in_action/Batch03-K4-AI-Product-Hackathon/.claude/gsd-core/workflows/undo.md
@/home/minhhieuano/2222/workspace/ai_in_action/Batch03-K4-AI-Product-Hackathon/.claude/gsd-core/references/ui-brand.md
@/home/minhhieuano/2222/workspace/ai_in_action/Batch03-K4-AI-Product-Hackathon/.claude/gsd-core/references/gate-prompts.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute end-to-end.
</process>
