# Project Standards — Support Desk

Support Request Dashboard demo app. React 18 + TypeScript + Vite, TanStack Query for server
state, Vitest + Testing Library for unit tests, Playwright for browser tests, and an Express
mock API (`server/`) with in-memory data.

## Architecture

- Use React with TypeScript (strict mode). No unjustified `any`.
- Follow feature-based folders: `src/features/<feature>/` holds that feature's types, API
  functions, query hooks, components and tests.
- Reuse existing shared UI components from `src/components/ui` (Button, Badge, Card, TextField,
  TextArea, Select, Dialog, LoadingState, EmptyState, ErrorState). Do not create duplicates.
- Use TanStack Query for all server state. UI components never call `fetch` directly; they use
  hooks from the feature's `hooks.ts`, which call functions in `api.ts`, which use the shared
  HTTP client in `src/services/`.
- Contracts in `src/features/support-requests/types.ts` are approved and shared. Do not change
  them without calling it out explicitly.
- Avoid unnecessary custom CSS. Use design tokens from `src/styles/tokens.css` and layout
  primitives from `src/styles/base.css`.

## Quality & Testing

- Handle loading, error and empty states for every server-backed view.
- Follow accessibility best practices: semantic HTML, labelled controls, keyboard support,
  visible focus.
- Write or update tests with every change: unit tests next to the code (`*.test.ts(x)`),
  browser tests in `tests/e2e/`.
- Before claiming work is done, run: `npm run typecheck`, `npm run lint`, `npm test`
  (and `npm run test:e2e` for user-visible behavior).

## Commands

- `npm run dev` — mock API (port 4000) + Vite (port 5173)
- `npm run check` — typecheck + lint + unit tests
- `npm run test:e2e` — Playwright (starts servers automatically)
- `npm run mock:error | mock:slow | mock:empty | mock:normal | mock:reset` — switch mock API mode

## Safety

- Never edit `.env` or `.env.*` files (a hook blocks it).
- Use only dummy data. Do not merge into `main` without human approval.
