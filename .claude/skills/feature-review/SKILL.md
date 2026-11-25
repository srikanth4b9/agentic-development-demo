---
name: feature-review
description: Use when asked to review a feature folder (for example src/features/support-requests) against a checklist of correctness, states, accessibility and test coverage.
---

# Feature Review

1. Read the requirements, acceptance criteria and plan for the feature (paths in
   `.claude/rules/feature-workflow.md`).
2. Inspect the implementation and its tests in the requested folder, plus the shared UI it uses.
3. Find functional, performance, accessibility and error-handling issues. Check specifically:
   - loading, empty and error states are all reachable and rendered
   - form validation matches the limits in the contracts (for example `LIMITS` in `types.ts`) and server errors are surfaced per field
   - keyboard access: dialogs close with Escape and return focus; all controls are labelled
   - no `fetch` in components; server state only via TanStack Query hooks
   - design tokens used instead of raw colors or pixel values
4. Rank findings by severity: Critical, High, Medium, Low.
5. For every finding cite the file path and line, the user impact, and a suggested fix.
6. Do not modify code. Report only findings you verified by reading the code.

## Output format

| #   | Severity | File:line | Finding | Impact | Suggested fix |
| --- | -------- | --------- | ------- | ------ | ------------- |

End with a one-line verdict: "Ready for PR" or "Changes required (N blocking)".
