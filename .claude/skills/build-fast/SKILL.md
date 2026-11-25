---
name: build-fast
description: Demo fast path for the build step — bring in the dashboard code built from the same plan in rehearsal (branch demo/complete), verify it and commit it. Typed only.
disable-model-invocation: true
---

Bring in the rehearsal build instead of running the full live build.

## 1. Check the workspace (stop if it fails)

- Run `git branch --show-current`. Stop if it is `main` or `demo/complete`.
- Run `git status --short`. If `src/` or `tests/` have uncommitted changes, list them and ask
  before overwriting.
- Confirm the fallback exists: `git rev-parse --verify demo/complete`.

## 2. Bring in the code

```bash
git checkout demo/complete -- src tests
git diff --cached --stat
```

Show the stat. It should be about 22 files in `src/` and `tests/e2e/`, including
`src/features/support-requests/` and `tests/e2e/support-requests.spec.ts`.

## 3. Verify

Run `npm run check` (typecheck, lint, unit tests). If anything fails, stop and report it. Do
not fix it silently.

## 4. Commit

```bash
git commit -m "feat(support-requests): dashboard built from the approved plan (rehearsal run)"
```

## 5. Report

- Files brought in (the stat) and the check results
- Say plainly that this code came from a rehearsal run of the same plan, not from this session
- Tell the user to refresh `http://localhost:5173/support-requests`
- Next step: `/e2e-headed`
