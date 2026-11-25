---
name: start-feature
description: Use when starting work on a new feature from scratch — creates the feature branch from an up-to-date main and a business-request stub to fill in. Typed only.
argument-hint: '<feature> [existing requirements file]'
disable-model-invocation: true
---

Start a new feature: $ARGUMENTS

Follow the names and paths in `.claude/rules/feature-workflow.md`.

## 1. Work out the names

- `<feature>`: the first argument as kebab-case (for example `agent-assignment`). If it's
  missing, ask for it.
- `<request>`: the stem of the requirements file if one was given, otherwise `<feature>` (so
  the request is `docs/requirements/<feature>.md`).

## 2. Check the workspace (stop if it fails)

- `git status --short`: if there are uncommitted changes, list them and ask whether to stash
  them or stop. Never discard work.
- `git branch --list feat/<feature>`: if the branch exists, ask whether to switch to it instead.

## 3. Branch from an up-to-date main

```bash
git fetch origin
git switch -c feat/<feature> origin/main
```

## 4. Make sure a business request exists

If `docs/requirements/<request>.md` doesn't exist, create it with these sections so the
developer or product owner can fill them in:

```markdown
# Business request: <Feature name>

> From: <who asked>
> Status: DRAFT — not yet refined

## Problem

## What we want

-

## Design

Figma frame: <link>

## API

Contracts: new types, or changes to existing ones in `src/features/*/types.ts`, to be agreed
and called out explicitly.
```

Commit it: `docs: business request for <feature>`.

## 5. Report

- Branch, request file (new or existing)
- Next step: fill in the request (if it's a stub) and add the Figma link if there is one, then
  `/grill-me docs/requirements/<request>.md`
