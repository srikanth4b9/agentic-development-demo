---
name: deliver-feature
description: Use when requirements and a plan are approved and the feature should be built end to end with tests first. Typed only.
disable-model-invocation: true
argument-hint: '[feature, defaults to the current feature branch]'
---

Build the approved feature: $ARGUMENTS. Use the names and paths in
`.claude/rules/feature-workflow.md`. Inputs: `docs/plans/<request>.plan.md`, the acceptance
criteria and, if present, the Figma mapping. If there is no approved plan, stop and suggest
`/plan-feature`.

Use the installed Superpowers workflows to:

1. Check you're on `feat/<feature>`, not `main`. Commit any uncommitted feature docs
   (request, acceptance criteria, plan, Figma mapping): `docs: <feature> requirements and plan`.
2. Review the plan (feature folder, contract and mock API changes) and identify truly
   independent tasks.
3. Use worktree isolation where appropriate (subagents per independent task).
4. Follow project rules and reuse shared components and tokens.
5. Write tests before implementation (superpowers:test-driven-development): a failing test
   first, then the code. Unit tests next to the code, browser tests in
   `tests/e2e/<feature>.spec.ts`.
6. Integrate, then run `npm run check` and `npx playwright test`.
7. Run an independent code review (`/evidence-review src/features/<feature>`) and fix
   confirmed bug-level findings.
8. Commit in small steps with conventional messages.
9. Summarize the changes and the test evidence. Stop before pushing or opening a PR. Next steps:
   `/e2e-headed`, `/capture-evidence`, then `/draft-pr`.

Stop for approval at key decisions.
Do not claim success until checks pass. Do not merge into `main`.
