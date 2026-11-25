---
name: parallel-review
description: Use when asked for a parallel, multi-angle or thorough review — architecture, accessibility and testing reviewed independently and merged into one report.
argument-hint: '[path or feature, defaults to the current feature]'
---

Launch three independent read-only investigations of: $ARGUMENTS
(If no scope is given, use `src/features/<feature>` for the current feature branch, see
`.claude/rules/feature-workflow.md`, falling back to `src/features/support-requests`.)

Agent A — Architecture Review:
Find duplicated logic and incorrect boundaries.

Agent B — Accessibility Review:
Check form semantics, accessible names and keyboard behavior.

Agent C — Testing Review:
Identify missing unit and Playwright scenarios.

Run them concurrently as subagents (use the `code-reviewer` agent type, read-only).
Do not modify code. Return only grounded findings with file paths and lines.
Combine them into one severity-ranked report with a one-line verdict.
