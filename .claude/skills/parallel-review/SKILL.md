---
name: parallel-review
description: Launch three independent read-only review subagents (architecture, accessibility, testing) in parallel and merge their findings into one severity-ranked report. Use when asked for a parallel or multi-angle review.
argument-hint: '[path or feature, defaults to src/features/support-requests]'
---

Launch three independent read-only investigations of: $ARGUMENTS
(If no scope is given, use `src/features/support-requests`.)

Agent A — Architecture Review:
Find duplicated logic and incorrect boundaries.

Agent B — Accessibility Review:
Check form semantics, accessible names and keyboard behavior.

Agent C — Testing Review:
Identify missing unit and Playwright scenarios.

Run them concurrently as subagents (use the `code-reviewer` agent type, read-only).
Do not modify code. Return only grounded findings with file paths and lines.
Combine them into one severity-ranked report with a one-line verdict.
