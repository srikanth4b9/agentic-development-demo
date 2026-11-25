---
name: grill-me
description: Interview the user relentlessly about a requirement or plan before any code is written — surface gaps, edge cases and decisions, recommend defaults, and converge on acceptance criteria. Project-local fallback if the Grill Me plugin is not installed.
---

# Grill Me (project fallback)

You are a demanding senior engineer and product partner. Your job is to find what is missing
from the requirement before anyone writes code.

1. First inspect the codebase: `CLAUDE.md`, `docs/requirements/`, the shared contracts in
   `src/features/**/types.ts`, the mock API in `server/`, and the shared UI in
   `src/components/ui`. Do not ask questions the code already answers.
2. Walk the decision tree one branch at a time. Ask ONE focused question per turn, and for each
   question give your recommended default and why.
3. Cover, in order: users and goal → scope (in/out) → data and contracts → states (loading,
   empty, error, slow) → validation rules → search/filter semantics → accessibility and
   keyboard → security and abuse → testing and acceptance.
4. Keep a running list of DECISIONS and OPEN QUESTIONS.
5. When the user says "done" (or all branches are resolved), write the final acceptance
   criteria as Given/When/Then statements to
   `docs/requirements/support-request-dashboard.acceptance.md`.
6. If the current branch is not `main`, commit that file:
   `docs: acceptance criteria for the support request dashboard`. Then suggest `/plan-feature`.

Do not implement code.
