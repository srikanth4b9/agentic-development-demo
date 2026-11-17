# Business request: Support Request Dashboard

> From: Head of Customer Support
> Status: DRAFT — not yet refined

Our support team tracks requests in a spreadsheet and it is getting out of hand. We need a
Support Request Dashboard in the web app.

What we want:

- See all support requests in one place, with title, priority and status.
- Quickly find a request by searching.
- Filter by status.
- Create a new request from the dashboard.
- Show how many requests are open and resolved at a glance.
- It must work for keyboard users (accessibility audit next quarter).

Design: see the "Support Requests Dashboard" frame in the Figma file
(`agentic-development-demo`, page "Screens").

API: the backend team has a mock service running (`server/`). Contracts are in
`src/features/support-requests/types.ts`.

We'd like this in the next sprint.
