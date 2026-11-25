---
name: capture-evidence
description: Use when a PR or review needs screenshots or visual proof of a feature's UI states (data, dialogs, validation, empty, error), produced by a real Playwright run.
argument-hint: '[feature] [slow-motion ms, default 300]'
---

Produce evidence screenshots from a real, passing browser test. Arguments: $ARGUMENTS
(feature, defaulting to the current feature, then an optional slow-motion delay). Names and
paths: `.claude/rules/feature-workflow.md`.

## 1. Make sure the evidence spec exists: `tests/e2e/<feature>.evidence.spec.ts`

- **`support-requests`:** if the spec is missing, copy
  `.claude/skills/capture-evidence/support-requests.evidence.spec.ts.template` to that path
  unchanged.
- **Any other feature:** write the spec using that template as the pattern. Include one test per
  user-visible state in the acceptance criteria (data, every dialog, validation errors, empty,
  error, the result of the main action). Copy these parts of the pattern:
  - reset the mock data in `beforeEach` and `afterEach`, and switch to error mode with
    `POST /api/__mock` only inside the error test
  - an `open…` helper that waits for real data before anything else
  - wait for the state to be visible before every screenshot
  - full-page shots, except viewport shots (`fullPage = false`) for dialogs
  - files saved as `docs/evidence/<feature>/NN-<state>.png`

## 2. Run it headed

- Bash: `SLOWMO=<ms> npx playwright test <feature>.evidence --headed`
- PowerShell: `$env:SLOWMO=<ms>; npx playwright test <feature>.evidence --headed; Remove-Item Env:SLOWMO`

If a test fails because the UI's labels or text differ from the spec, read the components and
fix the locators to match the real UI. Never delete a state or weaken an assertion to make a
test pass. If the UI really is broken, stop and report it.

## 3. Check the images

Open each PNG in `docs/evidence/<feature>/` and confirm it shows the state in its name. Re-run
if one doesn't.

## 4. Report

A table of file → state → confirmed. Don't commit (`/draft-pr` does). Next step:
`/evidence-review`, then `/draft-pr`.
