---
name: build-ui
description: Implement the Support Request Dashboard UI layer inside a worktree, tests first. Run in the UI worktree terminal.
disable-model-invocation: true
---

Implement Support Request Dashboard UI.

Scope:

- Request cards and status badges
- Search and status filters
- Responsive layout
- Loading and empty-state components

Use shared components from `src/components/ui` and the approved contracts in
`src/features/support-requests/types.ts`.
Write relevant tests first.
Do not modify API or service files (`api.ts`, `hooks.ts`, `src/services/`).
Run `npm run check` and commit changes.

Extra instructions: $ARGUMENTS
