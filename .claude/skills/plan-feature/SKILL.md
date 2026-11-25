---
name: plan-feature
description: Use when requirements or acceptance criteria are agreed and the next step is a design and a task-by-task implementation plan, before any code is written.
argument-hint: '[requirements or acceptance file, defaults to the current feature]'
---

Plan the feature from: $ARGUMENTS. If empty, use `docs/requirements/<request>.acceptance.md`
for the current feature (see `.claude/rules/feature-workflow.md`), and the business request
next to it. If `docs/design/<request>.figma-map.md` exists, use it too.

## 1. Design (Superpowers brainstorming)

Use Superpowers brainstorming. Say which feature folder the code goes in (a new
`src/features/<feature>/` or an existing folder it extends), and whether any approved contract
in `src/features/*/types.ts` or mock API route in `server/index.mjs` must change. Call out
contract changes explicitly. Propose the architecture, reusable components from
`src/components/ui`, API contracts, data flow, loading/error/empty states, accessibility,
testing and trade-offs. Follow `CLAUDE.md` (feature folder, `api.ts` → `hooks.ts` →
components). Do not code. Present the design and wait for approval.

## 2. Plan (Superpowers writing-plans)

Use Superpowers writing-plans to create a task-by-task plan. For every task include the
objective, acceptance criteria (by number), expected files, dependencies, tests, commands and
done criteria. Tag each task **UI** or **API** so `/build-ui` and `/build-api` can pick theirs.
Mark only truly independent tasks as parallel.

## 3. Save

When the plan is approved, save it to `docs/plans/<request>.plan.md`. Don't commit. Next step:
`/deliver-feature`, or `/build-ui` + `/build-api` in two worktrees (see the rule file).

Superpowers skills save and commit their own spec and plan files by default. Override that
here: save only `docs/plans/<request>.plan.md`, and don't commit.

Do not begin implementation.
