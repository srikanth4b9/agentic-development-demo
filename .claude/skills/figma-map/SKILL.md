---
name: figma-map
description: Use when given a Figma URL, or when asked to compare a design with the codebase or check which existing components and tokens a design needs, before writing UI code.
argument-hint: '[figma-frame-url]'
---

Using the connected Figma MCP server, inspect this design: $ARGUMENTS

If no URL was given, use the Figma link in the current feature's business request
(`docs/requirements/<request>.md`, see `.claude/rules/feature-workflow.md`). For the
`support-requests` demo feature only, the frame is
https://www.figma.com/design/oIG0rPi3QaEvt0qCeKFCgC/?node-id=7-32. If there's still no real
link (a placeholder like `<link>` doesn't count), say there's no design for this feature and
stop. Never map another feature's frame.

Compare the design with our existing React components in `src/components/ui` and the tokens in
`src/styles/tokens.css`. Identify reusable UI, design tokens, layout, responsive behavior,
and missing states (loading, empty, error).

Create a mapping table: Figma element → existing component or token → gap or deviation. List
the missing states separately.

Save the table to `docs/design/<request>.figma-map.md`. Don't commit. Do not write code. Next
step: `/plan-feature` (it uses this mapping), or `/deliver-feature` if a plan is already approved.
