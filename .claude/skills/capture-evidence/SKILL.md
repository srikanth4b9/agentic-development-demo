---
name: capture-evidence
description: Capture real screenshots of every Support Request Dashboard UI state with Playwright (dashboard, dialog, validation, filtered empty, error, created) into docs/evidence/ as PR evidence. Use when asked for screenshots or visual evidence.
argument-hint: '[slow-motion ms, default 300]'
---

Produce PR evidence screenshots from a real, passing browser test.

## 1. Make sure the evidence spec exists

- If `tests/e2e/evidence.spec.ts` does not exist, copy
  `.claude/skills/capture-evidence/evidence.spec.ts.template` to that path unchanged.
- The spec resets the mock data before each test and switches the API to error mode for the
  error shot (then back to normal). It writes these files:

| File                        | State                                          |
| --------------------------- | ---------------------------------------------- |
| `01-dashboard.png`          | Dashboard with the 24 seeded requests          |
| `02-new-request-dialog.png` | New Request dialog open (viewport shot)        |
| `03-validation-errors.png`  | Dialog after an invalid submit (viewport shot) |
| `04-filtered-empty.png`     | Search with no matches                         |
| `05-error-state.png`        | API error with the "Try again" action          |
| `06-request-created.png`    | New request at the top, total 25               |

## 2. Run it headed

- Bash: `SLOWMO=<ms> npx playwright test evidence --headed` (ms from the arguments, default 300)
- PowerShell: `$env:SLOWMO=<ms>; npx playwright test evidence --headed; Remove-Item Env:SLOWMO`

If a test fails because the UI uses different labels or text than the spec expects, read the
components and adapt the locators to the real UI. Never delete a state or weaken an assertion
to make it pass. If the UI is genuinely broken, stop and report it.

## 3. Check the images

- List `docs/evidence/` with file sizes.
- Open each PNG and confirm it shows the state named in the table above. Re-run if one doesn't.

## 4. Commit

```bash
git add tests/e2e/evidence.spec.ts docs/evidence
git commit -m "test(e2e): capture UI state screenshots as PR evidence"
```

## 5. Report

A short table of file → state → confirmed. Next step: `/evidence-review`, then `/draft-pr`.
