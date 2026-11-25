---
name: e2e-headed
description: Use when asked to run, watch or show the Playwright browser tests in a visible (headed) browser, for example to demo a feature or to see a failure happen.
argument-hint: '[slow-motion ms, default 600] [test filter]'
---

Run the browser tests so people can watch them.

Arguments: $ARGUMENTS. The first number is the slow-motion delay in ms (default `600`, `0` =
full speed). Any remaining text is a filter: a spec file name (for example `support-requests`)
or a test title passed to `-g`.

## 1. Put the mock API in a known state

- `curl -s http://localhost:4000/api/health`
- If it responds: `npm run mock:normal` and then `npm run mock:reset`.
- If it doesn't, that's fine. Playwright starts its own servers.

## 2. Make sure slow motion is supported

If `playwright.config.ts` doesn't contain `process.env.SLOWMO`, add this inside `use: { ... }`,
right after the `screenshot` line, and change nothing else. Don't commit (`/draft-pr` commits
it with the feature):

```ts
    // Optional slow motion for live demos: SLOWMO=600 npx playwright test --headed
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
```

## 3. Run headed

- Bash: `SLOWMO=<ms> npx playwright test [file filter] --headed [-g "<title filter>"]`
- PowerShell: `$env:SLOWMO=<ms>; npx playwright test [file filter] --headed [-g "<title filter>"]; Remove-Item Env:SLOWMO`

## 4. Report

- `N passed / M failed`, with each test name.
- If a test fails, show the failing assertion and the error-context path. Don't change code to
  make it pass. Suggest `/debug-bug <what failed>`.
- Start `npx playwright show-report` in the background (it keeps running) and say it opens in
  the browser.
- Next step: `/capture-evidence`
