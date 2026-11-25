---
name: demo-reset
description: Clean up after a demo run or rehearsal — close the demo PR, remove demo worktrees and branches, and reset main to the demo-baseline tag. Destructive. Typed only.
argument-hint: '[branch name, defaults to feat/support-dashboard]'
disable-model-invocation: true
---

Put the repo back to the clean demo baseline.

Branch: $ARGUMENTS (if empty, use `feat/support-dashboard`).

## 1. Show what will be removed, then ask once

Collect and show:

- Open PRs from the branch: `gh pr list --head <branch> --state open`
- Worktrees: `git worktree list`
- Local demo branches: `git branch --list "<branch>" "worktree-*" "support-*"`
- Uncommitted work: `git status --short`
- Untracked files that clean would delete: `git clean -nd`

Ask the user to confirm in one question. If they decline, stop.

## 2. Clean up (only after a yes)

1. For each open demo PR: `gh pr close <N> --delete-branch`
2. For each worktree other than the main checkout: `git worktree remove --force <path>`, then
   `git worktree prune`
3. `git switch main` and `git reset --hard demo-baseline`
4. Delete the local demo branches: `git branch -D <branch>` (and the worktree branches listed)
5. `git clean -fd` (it never removes ignored files such as `.env`)
6. If the mock API is running (`curl -s http://localhost:4000/api/health`):
   `npm run mock:normal` and `npm run mock:reset`

Never delete `main`, `demo/complete` or the `demo-baseline` tag.

## 3. Report

- `git status` (clean) and `git log --oneline -1` (matches `demo-baseline`)
- What was closed and what was deleted
- Reminder: if work was stashed before the demo, run `git switch demo/complete` and then `git stash pop`
