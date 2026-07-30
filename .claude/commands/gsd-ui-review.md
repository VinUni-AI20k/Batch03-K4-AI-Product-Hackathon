---
name: gsd-ui-review
description: Retroactive 6-pillar visual audit of implemented frontend code
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Agent
  - AskUserQuestion
requires: [phase]
---
<objective>
Conduct a retroactive 6-pillar visual audit. Produces UI-REVIEW.md with
graded assessment (1-4 per pillar). Works on any project.
Output: {phase_num}-UI-REVIEW.md
</objective>

<execution_context>
@/home/minhhieuano/2222/workspace/ai_in_action/Batch03-K4-AI-Product-Hackathon/.claude/gsd-core/workflows/ui-review.md
@/home/minhhieuano/2222/workspace/ai_in_action/Batch03-K4-AI-Product-Hackathon/.claude/gsd-core/references/ui-brand.md
</execution_context>

<context>
Phase: $ARGUMENTS — optional, defaults to last completed phase.
</context>

<process>
Execute end-to-end.
Preserve all workflow gates.
</process>
