---
paths:
  - 'src/**/*.{ts,tsx}'
---

# Frontend Rules

- Use existing Button, Badge, Card, Dialog, Select and TextField components from
  `src/components/ui` — import them from the barrel (`src/components/ui`).
- Use design tokens (`var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--tone-*)`)
  for color and spacing. Never hard-code hex colors or pixel spacing in components.
- Prefer composition to giant components: one component per file, keep files under ~150 lines.
- Use semantic HTML and accessible labels (`<ul>/<li>` for lists, `<article>` for cards,
  real `<button>`s, every input labelled).
- Follow existing data-fetching patterns: components call query hooks; hooks call `api.ts`;
  no `fetch` inside components.
- Map domain values to badge tones in one place (e.g. status → tone), not inline in JSX.
