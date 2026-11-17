# Support Request Dashboard — AI-Powered Development demo

Live-demo repository for **"AI-Powered Development: From Idea to Delivery"**
(Rules · Skills · MCP · Hooks · Subagents · Git Worktrees).

Stack: React 18 + TypeScript + Vite · TanStack Query · Vitest + Testing Library · Playwright ·
Express mock API with in-memory data.

## Quick start

```bash
npm install
npx playwright install chromium
npm run dev            # API on :4000, web on :5173
npm run check          # typecheck + lint + unit tests
npm run test:e2e       # Playwright (starts servers itself)
```

Mock API controls (while `npm run dev` runs): `npm run mock:slow | mock:error | mock:empty | mock:normal | mock:reset`.

## Branches

| Branch          | Purpose                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `main`          | Demo baseline: shared UI, tokens, contracts, mock API, Claude config. Feature NOT built. |
| `demo/complete` | Known-good finished feature (fallback). 21 unit + 7 Playwright tests passing.            |

## AI configuration (version-controlled)

```
CLAUDE.md                              project-wide rules
.claude/rules/frontend.md              rules scoped to src/**/*.{ts,tsx}
.claude/skills/feature-review/         /feature-review skill
.claude/skills/grill-me/               /grill-me fallback skill (if plugin not installed)
.claude/agents/code-reviewer.md        read-only reviewer subagent
.claude/hooks/protect-files.mjs        PreToolUse: block .env edits
.claude/hooks/format-file.mjs          PostToolUse: Prettier after Edit/Write
.claude/settings.json                  hooks + permissions
.mcp.json                              Figma MCP server
design/                                tokens.json + Figma plugin that builds the design system
docs/requirements/                     the (deliberately vague) business request
```

Hooks are written in Node (not bash + jq) so they run unchanged on Windows, macOS and Linux.
