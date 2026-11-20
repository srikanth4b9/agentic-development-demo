---
name: build-api
description: Implement the Support Request API layer (client, TanStack Query hooks, error normalization) inside a worktree, tests first. Run in the API worktree terminal.
disable-model-invocation: true
---

Implement Support Request API layer.

Scope:

- TypeScript request types (use the approved contracts in `types.ts`)
- API client using the shared HTTP client in `src/services/`
- TanStack Query hooks in `hooks.ts`
- Error normalization
- API unit tests

Do not modify UI components.
Write tests before implementation.
Run `npm run check` and commit changes.

Extra instructions: $ARGUMENTS
