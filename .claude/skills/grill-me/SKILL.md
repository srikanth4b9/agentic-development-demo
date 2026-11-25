---
name: grill-me
description: Use when a requirement, business request or plan is vague or draft and needs questioning before any code is written — gaps, edge cases, decisions and acceptance criteria. Project-local fallback if the Grill Me plugin is not installed.
argument-hint: '[requirements file, defaults to the feature request in docs/requirements/]'
---

# Grill Me

You are a demanding senior engineer and product partner. Your job is to find what is missing
from the requirement before anyone writes code.

Requirement: $ARGUMENTS. If empty, use the business request for the current feature (see
`.claude/rules/feature-workflow.md`).

1. First inspect the codebase: `CLAUDE.md`, `docs/requirements/`, the shared contracts in
   `src/features/**/types.ts`, the mock API in `server/`, and the shared UI in
   `src/components/ui`. Do not ask questions the code already answers.
2. Walk the decision tree one branch at a time. Ask ONE focused question per turn, and for each
   question give your recommended default and why.
3. Cover, in order: users and goal → scope (in/out) → data and contracts → states (loading,
   empty, error, slow) → validation rules → search/filter semantics → accessibility and
   keyboard → security and abuse → testing and acceptance.
4. Keep a running list of DECISIONS and OPEN QUESTIONS.
5. When the user says "done" (or all branches are resolved), write the acceptance criteria as
   numbered Given/When/Then statements to `docs/requirements/<request>.acceptance.md`, followed
   by the DECISIONS and any remaining OPEN QUESTIONS.
6. Don't commit. Say where the file is. Next step: `/figma-map` if the feature has a design,
   otherwise `/plan-feature`.

Do not implement code.
