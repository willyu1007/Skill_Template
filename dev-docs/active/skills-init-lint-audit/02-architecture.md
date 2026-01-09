# Architecture Notes

## Lint gates

- `node .ai/scripts/lint-skills.cjs --strict`
  - Validates skill directory structure and `SKILL.md` metadata/sections under `.ai/skills/`.
- `node .ai/scripts/lint-docs.cjs --strict --path <dir>`
  - Validates Markdown encoding, EOL/newline, heading depth, vague references, and naming conventions within the given directory.

## Editing rules

- SSOT is `.ai/skills/`; do not hand-edit `.codex/skills/` or `.claude/skills/`.

