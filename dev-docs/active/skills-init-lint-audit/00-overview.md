# Overview

## Goal

- Systematically review `.ai/skills/` and `init/skills/` for blockers, bugs, illogical steps, and ambiguous semantics.
- Enforce strict lint gates via:
  - `node .ai/scripts/lint-skills.cjs --strict`
  - `node .ai/scripts/lint-docs.cjs --strict --path .ai/skills`
  - `node .ai/scripts/lint-docs.cjs --strict --path init/skills`

## Non-goals

- Redesign init pipeline behavior.
- Modify generated stubs under `.codex/` / `.claude/` by hand.

## Scope

- In-scope: `.ai/skills/**`, `init/skills/**`
- Out-of-scope: runtime code generation beyond what the linters require

## Status

- Status: in_progress
- Owner: user + assistant

