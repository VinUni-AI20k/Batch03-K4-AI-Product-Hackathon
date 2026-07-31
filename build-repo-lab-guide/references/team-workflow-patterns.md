# Team Workflow Patterns

Plan collaboration around file ownership and handoffs. Prefer five roles when
the user requires five learners.

## Adaptable five-role model

1. **Product/Test Architect** — problem framing, input cases, acceptance
   criteria.
2. **Tool/Data Engineer** — deterministic tools, data contracts, fixtures.
3. **Prompt/Policy Engineer** — prompts, policies, safeguards, model-facing
   contracts.
4. **Core Integrator** — shared entrypoint and integration surface.
5. **Observability/Reviewer** — traces, evaluation, report, evidence, final
   review.

Rename roles to fit the repository. User-specified team size and roles override
repository suggestions.

## Parallel phase

Use when tasks have no unmet dependency and do not edit the same file.

1. Agree on shared interfaces.
2. Give each role exclusive file ownership.
3. Run task-level validation independently.
4. Hand outputs to the integration owner.
5. Run the phase checkpoint after integration.

## Sequential phase

Use when a task consumes another task's output or several changes converge on
one file.

1. Name the producer and required output.
2. Name the consumer and acceptance condition.
3. Keep one writer for the shared integration file.
4. Let other roles review tests, evidence, or contracts without editing the
   shared file.
5. Start the next phase only after the checkpoint passes.

## Mixed phase

Use when independent modules can proceed in parallel but integration must be
sequential:

```text
Agree contract
    ↓
Parallel file-owned work
    ↓
Independent validation
    ↓
Single-owner integration
    ↓
Team checkpoint
```

## Required phase collaboration fields

For every phase, define:

- `mode`;
- `entry_condition`;
- `parallel_work`;
- `shared_files`;
- `handoffs`;
- `integration_owner`;
- `checkpoint`;
- `suggested_commits`.

Use task-level collaboration only when one phase contains multiple independent
handoff chains.

Every task owner that produces a file must appear as the source of a handoff,
unless that role is also the phase integration owner. Do not leave a producer's
output implicit.

## Suggested commits

Treat commits as planning metadata, not Git instructions. Each suggested
commit contains:

- message;
- owner;
- included files;
- required checkpoint.

Prefer one verifiable capability per commit. Exclude local-only files. Do not
emit any Git command.

Example:

```yaml
suggested_commits:
  - message: "feat: define tool and test-data contracts"
    owner: "Tool/Data Engineer"
    files:
      - "src/tools.py"
      - "config/test_cases.json"
    checkpoint: "Tool and input-contract validation pass"
```

## Prevent team conflicts

- Assign one writer per shared file.
- Agree symbol names and input/output contracts before parallel work.
- Keep role-owned work in separate files where the repository allows it.
- Use the Integrator only after producer checkpoints pass.
- Assign idle learners to test design, evidence, review, refactoring, or
  reporting.
- Do not teach merge/rebase/conflict-resolution workflows in the learner guide.
