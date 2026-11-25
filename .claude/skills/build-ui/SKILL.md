---
name: build-ui
description: Use when building only the UI layer of a planned feature in its own worktree, in parallel with /build-api. Typed only.
argument-hint: '[feature] [extra instructions]'
disable-model-invocation: true
---

Implement the UI layer of a planned feature. Arguments: $ARGUMENTS (first word =
`<feature>` in kebab-case; the rest = extra instructions). Names and paths:
`.claude/rules/feature-workflow.md`.

## 0. Check the workspace (stop if it fails)

- `git worktree list` and `git branch --show-current`: you should be in a worktree
  (`claude --worktree <feature>-ui`), not on `main`.
- `docs/plans/<request>.plan.md` must exist here. If it doesn't, the docs weren't committed
  before the worktree was created. Tell the user to commit them on `feat/<feature>` and recreate
  the worktree.

## 1. Build

The plan names the feature folder (a new `src/features/<feature>/` or an existing one).

Scope: the tasks tagged **UI** in the plan.

- Use shared components from `src/components/ui`, the approved contracts and, if it exists, the
  Figma mapping. Cover every state in the acceptance criteria (loading, empty, error, success).
- Write tests first (Testing Library, next to the code).
- Don't modify `api.ts`, `hooks.ts`, `src/services/` or `server/`. If the API isn't there yet,
  code against the hook names in the plan and mock them in tests.
- Run `npm run check` and commit with `feat(<feature>): …` messages.

## 2. Report

What's done, what's waiting on `/build-api`, and the merge step: when both worktrees are done, merge
`<feature>-ui` and `<feature>-api` into `feat/<feature>` in the main checkout, run
`npm run check` and `npx playwright test`, then `/e2e-headed`.
