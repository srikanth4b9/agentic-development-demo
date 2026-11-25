---
name: deliver-feature
description: Orchestrate an approved feature end to end with Superpowers workflows — plan, parallel build in worktrees, tests first, review, and a draft PR. Use only after requirements and design are approved.
disable-model-invocation: true
argument-hint: '[feature name, defaults to Support Request Dashboard]'
---

We have approved requirements and design for: $ARGUMENTS
(If no feature is named, it is the Support Request Dashboard.)

Use the installed Superpowers workflows to:

1. Review the design and create a task plan.
2. Identify truly independent tasks.
3. Use worktree isolation where appropriate.
4. Follow project rules and shared components.
5. Write tests before implementation.
6. Integrate and verify completed work.
7. Run an independent code-review subagent (`/evidence-review`).
8. Summarize changes and test evidence.
9. Stop before pushing or opening a PR. Tell the user to run `/e2e-headed`,
   `/capture-evidence` and then `/draft-pr`.

Stop for approval at key decisions.
Do not claim success until checks pass. Do not merge into `main`.
