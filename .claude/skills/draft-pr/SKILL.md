---
name: draft-pr
description: Verify, commit and push the demo branch, then open a draft GitHub PR to main with test evidence, review findings and the docs/evidence screenshots embedded, and open it in the browser. Never merges. Typed only.
argument-hint: '[PR title, defaults to "feat: Support Request Dashboard"]'
disable-model-invocation: true
---

Open a draft pull request backed by evidence.

Title: $ARGUMENTS (if empty, use `feat: Support Request Dashboard`).

## 1. Preconditions (stop if any fails)

- `git branch --show-current` is not `main`.
- `gh auth status` succeeds.
- `docs/evidence/*.png` exists. If not, tell the user to run `/capture-evidence` first.

## 2. Verify

- Run `npm run check` and record the result.
- Run `npx playwright test` and record `N passed`. This also refreshes the evidence screenshots.
- If anything fails, stop and report it. Do not open a PR on red.

## 3. Commit and push

- Run `git status --short`. Stage only files that belong to this feature (`src/`, `tests/`,
  `docs/`, `playwright.config.ts`). If something else is changed, ask before including it.
  Never stage `.env` files.
- Commit if anything is staged (`chore: refresh evidence` if only screenshots changed).
- `git push -u origin <branch>`

## 4. Build the PR body

- `SHA=$(git rev-parse HEAD)` and `REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)`
- Write the body to a temporary file outside the repo (for example in the system temp
  directory), never to a tracked file. Sections:
  1. **Summary**: what the feature does, in 3–5 bullets
  2. **Acceptance criteria**: a checklist from `docs/requirements/*.acceptance.md` (if present)
  3. **How it was built**: Grill Me → Superpowers plan (`docs/plans/`) → Figma mapping → TDD
     build. Say honestly if `/build-fast` (rehearsal code) was used.
  4. **Test evidence**: check results and the Playwright pass count
  5. **Review findings**: from `/evidence-review` in this session, or "not run"
  6. **Screenshots**: one image per file in `docs/evidence/`, sorted, each with a heading:
     `![<state>](https://raw.githubusercontent.com/$REPO/$SHA/docs/evidence/<file>.png)`
  7. Final line: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## 5. Create or update the PR

- `gh pr view --json url` on the branch. If a PR already exists, update it with
  `gh pr edit --body-file <file>`.
- Otherwise run:
  `gh pr create --draft --base main --head <branch> --title "<title>" --body-file <file>`

## 6. Check the images, then open the PR

- For each screenshot URL, `curl -s -o /dev/null -w "%{http_code}" <url>` must return `200`.
  If one doesn't, check that the push succeeded and that the SHA matches.
- `gh pr view --web`
- Report the PR URL, the test counts and the number of screenshots embedded.

Never merge, never mark the PR ready for review, and never push to `main`.
