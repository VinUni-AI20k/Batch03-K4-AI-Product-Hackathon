# Markdown End-to-End Team Workflow Graph Requirements

Every rendered Markdown lab guide must contain one end-to-end team workflow
graph. The renderer derives it from the normalized lab model; authors do not
add a separate graph object or duplicate collaboration facts.

## Source of truth

Build the graph only from `roles`, `phases[].tasks`,
`phases[].collaboration`, `phases[].checkpoint`, and
`definition_of_done`. Do not invent a role, task, handoff, file owner, or
checkpoint. A role ID referenced by a task, handoff, shared file, or
integration owner must exist in `roles`.

## Required flow

```text
Start -> phase entry condition -> task-owner work -> declared handoffs
      -> integration owner -> phase checkpoint -> next phase -> completion criteria
```

For every phase, render one node for its entry condition, every task, the
integration owner, and its checkpoint. Render every declared handoff as a
labeled edge. A phase without declared handoffs still connects each task to
the integration owner. Use the declared task order for sequential task lanes;
use parallel lanes for `parallel` and `mixed` phases.

## Markdown artifact contract

- Render `## Luồng làm việc nhóm đầu-cuối` for Vietnamese or
  `## End-to-end team workflow` for English before the phase sections.
- Render exactly one fenced `mermaid` block after that heading.
- Generate Mermaid from the internal derived graph, not from a model field.
- Use stable node IDs derived from phase, task, and role IDs. Quote labels,
  escape quotes, and replace label line breaks with `<br/>`.
- Labels use the guide language. Technical IDs and repository paths may remain
  unchanged.

## Validation

Reject a model when a graph source role reference cannot resolve to a declared
role. Reject a Markdown artifact that lacks the graph heading or does not have
exactly one Mermaid block.
