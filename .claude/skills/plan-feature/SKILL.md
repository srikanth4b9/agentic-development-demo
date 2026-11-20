---
name: plan-feature
description: Turn approved requirements into a design and a task-by-task implementation plan using Superpowers brainstorming and writing-plans. No code. Use after requirements are agreed.
argument-hint: '[requirements file, defaults to docs/requirements/]'
---

Use Superpowers brainstorming based on our approved requirements
($ARGUMENTS; if empty, use `docs/requirements/`). Propose architecture, reusable components, API contracts,
data flow, loading/error/empty states, accessibility, testing and trade-offs. Do not code.
Present the design for approval.

Then use Superpowers writing-plans to create a task-by-task plan. For every task include:
objective, acceptance criteria, expected files, dependencies, tests, commands and done
criteria. Mark only independent tasks as parallel.
Do not begin implementation until approved.
