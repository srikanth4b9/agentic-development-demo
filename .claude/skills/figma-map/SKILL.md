---
name: figma-map
description: Map a Figma frame to existing React components and design tokens before writing code. Use when given a Figma URL or asked to compare a design with the codebase.
argument-hint: '<figma-frame-url>'
---

Using the connected Figma MCP server, inspect this design: $ARGUMENTS

Compare it with our existing React components in `src/components/ui` and the tokens in
`src/styles/tokens.css`. Identify reusable UI, design tokens, layout, responsive behavior,
and missing states (loading, empty, error).

Create a mapping table: Figma element → existing component or token → gap or deviation.
Do not write code yet.
