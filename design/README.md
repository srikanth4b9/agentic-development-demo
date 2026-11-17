# Support Desk DS — design system

One design system, three synchronized representations:

| Layer         | Where                                         | What it holds                                                             |
| ------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| Tokens (data) | `design/tokens.json`                          | Colors, spacing, radius, type — source of truth                           |
| Code          | `src/styles/tokens.css`, `src/components/ui/` | CSS variables + React components                                          |
| Figma         | "Support Desk DS" variables + pages           | Variables (with `var(--…)` code syntax), text styles, components, screens |

Naming rule: Figma variable `color/primary` ⇔ CSS `var(--color-primary)`; `space/4` ⇔ `var(--space-4)`.
Each Figma component's description names the React component it maps to.

## Create the design system in your Figma file (one-time, ~1 minute)

Requires the **Figma desktop app** (development plugins don't run in the browser).

1. Open the file: `agentic-development-demo` (`https://www.figma.com/design/sqFCJjTRO3lJ2CdF3mMgkv/agentic-development-demo`).
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Select `design/figma-plugin/manifest.json` from this repo.
4. Run **Plugins → Development → Support Desk DS Builder**.
5. Result:
   - **Foundations** page — color swatches, spacing scale, radius, type specimens
   - **Components** page — Button (Primary/Secondary/Ghost), Badge (6 tones), Text Field (Default/Error),
     Select, Stat Card, Request Card, Empty State, Error State, Dialog / New Request
   - **Screens** page — Support Requests Dashboard, New Request Dialog, Dashboard — Empty, Dashboard — Error
   - Local variables → collection **Support Desk DS** (open the Variables panel to show it)
6. Right-click the **Support Requests Dashboard** frame → **Copy link to selection**. That URL (with
   `node-id=`) is what you paste into the Figma MCP prompt during the demo.

Re-running the plugin replaces the three pages and the variable collection; other pages are untouched.

> Deliberate gap: there is **no loading-state screen** in Figma. In the demo, the MCP mapping prompt
> asks Claude to list missing states — it should call this out.

## Connect Figma MCP to Claude Code

Already configured in `.mcp.json` (project scope). In Claude Code run `/mcp`, choose **figma**, and
authenticate in the browser. Verify with `claude mcp list` (should show `figma … ✓ Connected`).
Alternative: the claude.ai **Figma** connector — reconnect it in claude.ai → Settings → Connectors.
