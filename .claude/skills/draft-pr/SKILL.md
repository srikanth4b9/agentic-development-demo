---
name: draft-pr
description: Use when a feature branch is built and verified and needs a draft pull request with test evidence and screenshots for human review. Typed only.
argument-hint: '[PR title]'
disable-model-invocation: true
---

Open a draft pull request backed by evidence. Title: $ARGUMENTS (if empty, use
`feat(<feature>): <one-line summary from the plan or request>`). Names and paths:
`.claude/rules/feature-workflow.md`.

## 1. Preconditions (stop if any fails)

- The current branch is not `main`. Work out `<feature>` from `feat/<feature>`.
- `gh auth status` succeeds.
- If `docs/evidence/<feature>/` has no PNGs, say so and suggest `/capture-evidence`. If the user
  wants to continue anyway, the PR goes out without screenshots.

## 2. Verify

- Run `npm run check` and record the result.
- Run `npx playwright test` and record `N passed`. This also refreshes the screenshots.
- If anything fails, stop and report it. Never open a PR on red.

## 3. Commit and push

- Run `git status --short`. Stage the files that belong to this feature (`src/`, `tests/`,
  `docs/`, `playwright.config.ts`). If anything else changed, ask before including it. Never
  stage `.env` files.
- Commit what's staged with a conventional message, for example
  `test(<feature>): evidence screenshots` or `docs(<feature>): plan and acceptance criteria`.
- `git push -u origin feat/<feature>`

## 4. Write the PR body

- `SHA=$(git rev-parse HEAD)` and `REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)`
- Write the body to a temporary file outside the repo, never to a tracked file. Sections:
  1. **Summary**: what the feature does, in 3–5 bullets
  2. **Acceptance criteria**: a checklist from `docs/requirements/<request>.acceptance.md`
  3. **How it was built**: which steps ran (requirements interview, plan, Figma mapping, TDD
     build). Say honestly if `/build-fast` (rehearsal code) was used.
  4. **Test evidence**: check results and the Playwright pass count
  5. **Review findings**: from `/evidence-review` in this session, or "not run"
  6. **Screenshots**: one image per PNG in `docs/evidence/<feature>/`, sorted, each with a heading:
     `![<state>](https://raw.githubusercontent.com/$REPO/$SHA/docs/evidence/<feature>/<file>.png)`
  7. Final line: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## 5. Create or update the PR

- `gh pr view --json url`: if a PR already exists for the branch, update it with
  `gh pr edit --body-file <file>`.
- Otherwise: `gh pr create --draft --base main --head feat/<feature> --title "<title>" --body-file <file>`

## 6. Check, open and report

- Every screenshot URL must return `200` (`curl -s -o /dev/null -w "%{http_code}" <url>`). If
  one doesn't, check that the push succeeded and that the SHA matches.
- `gh pr view --web`
- Report the PR URL, the test counts and the number of screenshots.

Never merge, never mark the PR ready for review, and never push to `main`.
