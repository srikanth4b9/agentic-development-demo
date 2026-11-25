---
name: build-api
description: Use when building only the API layer of a planned feature (API client, TanStack Query hooks, error handling) in its own worktree, in parallel with /build-ui. Typed only.
argument-hint: '[feature] [extra instructions]'
disable-model-invocation: true
---

Implement the API layer of a planned feature. Arguments: $ARGUMENTS (first word =
`<feature>` in kebab-case; the rest = extra instructions). Names and paths:
`.claude/rules/feature-workflow.md`.

## 0. Check the workspace (stop if it fails)

- `git worktree list` and `git branch --show-current`: you should be in a worktree
  (`claude --worktree <feature>-api`), not on `main`.
- `docs/plans/<request>.plan.md` must exist here. If it doesn't, the docs weren't committed
  before the worktree was created. Tell the user to commit them on `feat/<feature>` and recreate
  the worktree.

## 1. Build

The plan names the feature folder (a new `src/features/<feature>/` or an existing one).

Scope: the tasks tagged **API** in the plan, typically:

- API functions in the feature folder's `api.ts`, using the shared HTTP client in `src/services/`
- TanStack Query hooks in `hooks.ts`, using the hook names from the plan
- New or changed mock API routes in `server/index.mjs` (in-memory, dummy data only)
- Error normalization
- Unit tests for the API functions and the client

Use the approved contracts in `types.ts`. If they need to change, stop and call it out. Don't
modify UI components. Write tests first. Run `npm run check` and commit with
`feat(<feature>): …` messages.

## 2. Report

What's done, the hooks you exported (so `/build-ui` can use them), and the merge step: when both worktrees are done, merge
`<feature>-ui` and `<feature>-api` into `feat/<feature>` in the main checkout, run
`npm run check` and `npx playwright test`, then `/e2e-headed`.
