# Implementation Notes

## Notes

- Keep fixes minimal and local to the reported issues.
- Prefer clarifying nouns/paths over vague references.

## Changes

- Replaced frequent vague references (`this`/`it`) in a few skill docs/templates to satisfy `lint-docs` strict mode:
  - `.ai/skills/workflows/dev-docs/create-dev-docs-plan/SKILL.md`
  - `.ai/skills/workflows/planning/plan-maker/SKILL.md`
  - `.ai/skills/workflows/planning/plan-maker/templates/requirement.md`
  - `.ai/skills/workflows/skill-operation/generate-skills-from-knowledge/templates/skill-skeleton/SKILL.md`
  - `init/skills/initialize-project-from-requirements/SKILL.md`
- Normalized DB-sync task log path to use `dev-docs/active/<task>/...` (repo convention) instead of `dev/active/<task>/...`:
  - `.ai/skills/workflows/database/sync-db-schema-from-code/SKILL.md`
  - `.ai/skills/workflows/database/sync-db-schema-from-code/templates/schema-scope-config.md`
- Reduced vague-reference words in the skill skeleton generator templates (to avoid future strict doc-lint failures):
  - `.ai/skills/workflows/skill-operation/generate-skills-from-knowledge/scripts/init_skill.py`
- Addressed three doc issues reported by the user:
  - `.init-state.json` docs/templates now match the init pipeline implementation:
    - `init/skills/initialize-project-from-requirements/templates/init-state.schema.json`
    - `init/skills/initialize-project-from-requirements/templates/init-state.example.json`
    - `init/skills/initialize-project-from-requirements/SKILL.md`
  - generate-skills-from-knowledge commands now define relative-path working directory:
    - `.ai/skills/workflows/skill-operation/generate-skills-from-knowledge/SKILL.md`
  - agent_builder docs/templates/help output now use copy/paste-safe `agent-builder.js` commands (no `node .../agent-builder.js`):
    - `.ai/skills/workflows/agent/agent_builder/SKILL.md`
    - `.ai/skills/workflows/agent/agent_builder/examples/usage.md`
    - `.ai/skills/workflows/agent/agent_builder/templates/stage-e/verification-report.template.md`
    - `.ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js`
