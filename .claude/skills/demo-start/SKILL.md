---
name: demo-start
description: Start a live demo run from the clean baseline — reset main to the demo-baseline tag, create the demo feature branch and prepare the mock API. Typed only.
argument-hint: '[branch name, defaults to feat/support-dashboard]'
disable-model-invocation: true
---

Prepare a clean starting point for the live demo.

Branch: $ARGUMENTS (if empty, use `feat/support-dashboard`).

## 1. Protect existing work (stop if it fails)

- Run `git status --short` and `git worktree list`.
- If there are uncommitted or untracked changes, list them and stop. Ask whether to stash them
  (`git stash -u -m "pre-demo wip"`) or keep them. Never discard work without a yes.
- Run `git tag --list demo-baseline`. If the tag is missing, stop and say so.
- If the demo branch already exists locally (`git branch --list <branch>`), stop and tell the
  user to run `/demo-reset` first.

## 2. Reset and branch

```bash
git switch main
git reset --hard demo-baseline
git switch -c <branch>
```

## 3. Prepare the mock API

- Check whether the API is running: `curl -s http://localhost:4000/api/health`.
- If it is running: `npm run mock:normal` and then `npm run mock:reset`.
- If it is not running, tell the user to run `npm run dev` in a separate terminal. Do not start
  it yourself.

## 4. Report

Keep it short:

- Branch and `git log --oneline -1`
- Mock API: running in normal mode with 24 requests, or "start `npm run dev`"
- The dashboard is not built yet (only the shared UI, contracts and mock API exist)
- Next step: `/grill-me docs/requirements/support-request-dashboard.md`
