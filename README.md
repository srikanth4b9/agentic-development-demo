# Support Request Dashboard — AI-Powered Development demo

Live-demo repository for the knowledge sharing session **"AI-Powered Development: From Idea to
Delivery"**. One feature, a Support Request Dashboard, is built live with Claude Code, from a vague
business request to a reviewed pull request, using **Rules · Skills · MCP · Hooks · Subagents · Git
Worktrees**.

All data in this repository is dummy data. There are no real credentials or customer records.

## Tech stack

| Area         | Choice                                                  |
| ------------ | ------------------------------------------------------- |
| UI           | React 18 + TypeScript (strict) + Vite                   |
| Server state | TanStack Query                                          |
| Unit tests   | Vitest + Testing Library                                |
| Browser test | Playwright                                              |
| Mock API     | Express with in-memory data (`server/`), 24 seeded rows |
| Design       | Design tokens (`src/styles/tokens.css`) + Figma file    |

## Prerequisites

- Node.js 20+ and npm
- Git
- [Claude Code](https://code.claude.com/docs) (CLI, VS Code extension or desktop app)
- Optional: Figma account for the Figma MCP step, and the Superpowers plugin

## Quick start

```bash
npm install
npx playwright install chromium
npm run dev            # mock API on :4000, web app on :5173
npm run check          # typecheck + lint + unit tests
npm run test:e2e       # Playwright (starts the servers itself)
```

Open <http://localhost:5173>.

### Mock API modes

While `npm run dev` is running, switch how the API behaves to exercise every UI state:

```bash
npm run mock:slow      # delayed responses (loading state)
npm run mock:error     # 500 responses (error state)
npm run mock:empty     # no data (empty state)
npm run mock:normal    # back to normal
npm run mock:reset     # restore the 24 seeded requests
```

## Branches and tags

| Ref             | Purpose                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| `main`          | Demo baseline: shared UI, tokens, contracts, mock API, Claude configuration.   |
|                 | The dashboard feature is **not** built yet; it is built live.                  |
| `demo/complete` | Known-good finished feature, used as a fallback. Unit + Playwright tests pass. |
| `demo-baseline` | Tag marking the clean starting point of `main`.                                |

## AI configuration (version-controlled)

```
CLAUDE.md                              project-wide rules (stack, architecture, testing)
.claude/rules/frontend.md              rules scoped to src/**/*.{ts,tsx}
.claude/skills/                        slash commands (see below)
.claude/agents/code-reviewer.md        read-only reviewer subagent (Read, Grep, Glob)
.claude/hooks/format-file.mjs          PostToolUse: run Prettier after every Edit/Write
.claude/hooks/protect-files.mjs        PreToolUse: block edits to .env files
.claude/settings.json                  hooks + permission allowlist
.mcp.json                              Figma MCP server
design/                                tokens.json + Figma plugin that builds the design system
docs/requirements/                     the business request the demo starts from
```

Hooks are written in Node (not bash + jq) so they run unchanged on Windows, macOS and Linux.

### Slash commands

Long prompts are saved as project skills, so each step of the workflow is one command.

| Step            | Command                         | What it does                                                           |
| --------------- | ------------------------------- | ---------------------------------------------------------------------- |
| Requirements    | `/grill-me <requirements file>` | Questions the request, recommends defaults, writes acceptance criteria |
| Plan            | `/plan-feature`                 | Superpowers brainstorming + task-by-task plan, no code                 |
| Design          | `/figma-map <figma-frame-url>`  | Maps a Figma frame to existing components and tokens                   |
| Build (UI)      | `/build-ui`                     | UI layer in its own worktree, tests first _(typed only)_               |
| Build (API)     | `/build-api`                    | API client and TanStack Query hooks in its own worktree _(typed only)_ |
| Orchestrate     | `/deliver-feature`              | Plan → parallel build → tests → review → draft PR _(typed only)_       |
| Review          | `/evidence-review [path]`       | Severity-ranked review in the read-only `code-reviewer` subagent       |
| Parallel review | `/parallel-review [path]`       | Architecture, accessibility and testing reviews in parallel            |
| Feature review  | `/feature-review <folder>`      | Checklist review of a feature folder                                   |

Commands marked _typed only_ change and commit code, so Claude never starts them on its own.
The others also run automatically when you ask in plain words (for example, "review this before
the PR").

### Parallel work with worktrees

```bash
claude --worktree support-ui     # terminal 1, then: /build-ui
claude --worktree support-api    # terminal 2, then: /build-api
git worktree list                # terminal 3: show both checkouts
```

## Demo flow

1. **Clarify:** `/grill-me docs/requirements/support-request-dashboard.md`
2. **Plan and design:** `/plan-feature`, then `/figma-map <frame-url>`
3. **Build in parallel:** two worktrees, `/build-ui` and `/build-api`
4. **Automate checks:** hooks format every edit and block `.env` changes
5. **Verify:** `npm run check`, `npx playwright test --headed`, `npx playwright show-report`
6. **Review and deliver:** `/evidence-review`, then a draft PR for human review

## Resetting after a run

```bash
git switch main
git reset --hard demo-baseline
git clean -fd          # removes untracked files: commit or move anything you want to keep
git worktree prune
```

## Safety rules

- Never edit `.env` or `.env.*` files (a hook blocks it).
- Use only dummy data.
- Do not merge into `main` without human approval.
