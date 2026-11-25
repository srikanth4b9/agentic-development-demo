---
name: e2e-headed
description: Run the Playwright browser tests in a visible (headed) Chromium window, optionally in slow motion for a live audience, then open the HTML report. Use when asked to run or show the e2e tests headed.
argument-hint: '[slow-motion ms, default 600] [test filter]'
---

Run the browser tests so the audience can watch them.

Arguments: $ARGUMENTS. The first number is the slow-motion delay in ms (default `600`, `0` =
full speed). Any remaining text is a test filter passed to `-g`.

## 1. Make sure the mock API is in a known state

- `curl -s http://localhost:4000/api/health`
- If it responds: `npm run mock:normal` and then `npm run mock:reset`.
- If it doesn't, that's fine. Playwright starts its own servers.

## 2. Make sure slow motion is supported

Search `playwright.config.ts` for `process.env.SLOWMO`. If it is missing, add this inside
`use: { ... }`, right after the `screenshot` line, and change nothing else:

```ts
    // Optional slow motion for live demos: SLOWMO=600 npx playwright test --headed
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
```

Then commit it: `test(e2e): optional SLOWMO for headed demo runs`.

## 3. Run headed

- Bash: `SLOWMO=<ms> npx playwright test --headed [-g "<filter>"]`
- PowerShell: `$env:SLOWMO=<ms>; npx playwright test --headed; Remove-Item Env:SLOWMO`

## 4. Report and open the report

- Report the result as `N passed / M failed` with each test name.
- If a test fails, show the failing assertion and the error-context path. Do not change code to
  make it pass. Suggest `/debug-bug` instead.
- Start `npx playwright show-report` in the background (it keeps running and serves the report),
  and tell the user it opens in the browser.
- Next step: `/capture-evidence`
