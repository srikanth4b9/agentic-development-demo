# Feature workflow (skills)

Every feature goes through the same slash commands. Each command ends by naming the next one.

```
/start-feature <feature>     branch + business-request stub
/grill-me                    acceptance criteria
/figma-map <frame-url>       design → components and tokens (skip if there's no design)
/plan-feature                design + task plan (Superpowers)
/deliver-feature             TDD build (or /build-ui + /build-api in two worktrees)
/e2e-headed                  Playwright in a visible browser
/capture-evidence            screenshots of every UI state
/evidence-review             read-only review
/draft-pr                    draft PR with test evidence and screenshots
```

## Names

- `<feature>`: kebab-case feature name, for example `agent-assignment`. Resolve it in this order:
  1. the command's argument
  2. the current branch `feat/<feature>`, or a worktree branch named `<feature>-ui` / `<feature>-api`
  3. on `main` or a `demo/*` branch only: the demo feature `support-requests`
  4. otherwise ask
- `<request>`: the business request file name without `.md`. Resolve it in this order:
  1. a `docs/requirements/*.md` file passed to the command
  2. `docs/requirements/<feature>.md` if it exists
  3. for `support-requests`: `support-request-dashboard`
  4. otherwise ask

## Paths

| Artifact            | Path                                                             |
| ------------------- | ---------------------------------------------------------------- |
| Branch              | `feat/<feature>`                                                 |
| Business request    | `docs/requirements/<request>.md`                                 |
| Acceptance criteria | `docs/requirements/<request>.acceptance.md`                      |
| Figma mapping       | `docs/design/<request>.figma-map.md`                             |
| Plan                | `docs/plans/<request>.plan.md`                                   |
| Feature code        | `src/features/<feature>/`, or the existing folder the plan names |
| Mock API routes     | `server/index.mjs`                                               |
| Browser tests       | `tests/e2e/<feature>.spec.ts`                                    |
| Evidence spec       | `tests/e2e/<feature>.evidence.spec.ts`                           |
| Screenshots         | `docs/evidence/<feature>/NN-<state>.png`                         |

A feature that extends an existing one (for example, assigning an agent from the request card)
keeps its code in the existing folder. The plan says which folder. Branch, docs, tests and
evidence still use `<feature>`.

## Parallel build in worktrees

1. Commit the feature docs on `feat/<feature>` first. Worktrees only see committed files.
2. `claude --worktree <feature>-ui` → `/build-ui <feature>`, and
   `claude --worktree <feature>-api` → `/build-api <feature>`.
3. When both are done, in the main checkout on `feat/<feature>`: merge both worktree branches,
   run `npm run check` and `npx playwright test`, then continue with `/e2e-headed`.

## Commit rules

- Commands Claude may start on its own (`grill-me`, `figma-map`, `plan-feature`, `e2e-headed`,
  `capture-evidence` and the reviews) write files but never commit.
- Typed-only commands (`start-feature`, `deliver-feature`, `build-ui`, `build-api`, `draft-pr`,
  `debug-bug`, `build-fast` and the `demo-*` commands) may commit, never on `main`.
- Never merge into `main`. A human approves every PR.
