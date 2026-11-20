---
name: evidence-review
description: Evidence-based code review of an implementation against requirements, architecture and coding standards, ranked by severity. Use when asked to review code, a feature, a branch or changes before a PR.
argument-hint: '[path or feature, defaults to current changes]'
context: fork
agent: code-reviewer
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git status:*), Bash(git log:*)
---

Review this implementation against requirements, architecture and coding standards.

Scope: $ARGUMENTS
If no scope is given, review the current changes (`git status` and `git diff`).

Context: requirements are in `docs/requirements/`, project standards in `CLAUDE.md` and
`.claude/rules/`, approved contracts in `src/features/*/types.ts`.

Severity order:

1. Security vulnerabilities and functional bugs
2. Missing requirements and edge cases
3. Performance / unnecessary re-renders
4. Duplicated logic or components
5. Accessibility issues
6. Missing or weak tests
7. Unnecessary CSS or token violations

For each finding: severity, file:line, impact, recommended fix.

Avoid speculation: report only what you verified in the code. Do not modify code.

## Output format

| #   | Severity | File:line | Finding | Impact | Recommended fix |
| --- | -------- | --------- | ------- | ------ | --------------- |

End with a one-line verdict: "Ready for PR" or "Changes required (N blocking)".
