---
name: gsd-audit-uat
description: Cross-phase audit of all outstanding UAT and verification items
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---
<objective>
Scan all phases for pending, skipped, blocked, and human_needed UAT items. Cross-reference against codebase to detect stale documentation. Produce prioritized human test plan.
</objective>

<execution_context>
@/home/minhhieuano/2222/workspace/ai_in_action/Batch03-K4-AI-Product-Hackathon/.claude/gsd-core/workflows/audit-uat.md
</execution_context>

<context>
Core planning files are loaded in-workflow via CLI.

**Scope:**
Glob: .planning/phases/*/*-UAT.md
Glob: .planning/phases/*/*-VERIFICATION.md
</context>
