# Plan

## Acceptance criteria

- `node .ai/scripts/lint-skills.cjs --strict` passes.
- `node .ai/scripts/lint-docs.cjs --strict --path .ai/skills` passes.
- `node .ai/scripts/lint-docs.cjs --strict --path init/skills` passes.
- Any remaining non-lint issues (semantic ambiguity / logical gaps) are documented as actionable TODOs.

## Steps

1. Run strict linters and capture output.
2. Triage findings by category (skill metadata, doc structure, naming, encoding/EOL, vague references).
3. Apply minimal edits to SSOT docs/skills to remove blockers and ambiguity.
4. Re-run strict linters until clean.

