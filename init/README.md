# Project Initialization (3-stage, verifiable)

## Conclusions (read first)

- This repo template initializes projects using a **3-stage, file-based pipeline**:
  1) **Stage A - Requirements**: produce high-quality requirement docs under `docs/project/`
  2) **Stage B - Blueprint**: derive a machine-readable blueprint at `docs/project/project-blueprint.json`
  3) **Stage C - Scaffold + Skills**: create a minimal scaffold, update skill pack selection in `.ai/skills/_meta/sync-manifest.json`, then sync provider wrappers via `node .ai/scripts/sync-skills.js`
- Stage A is **verifiable** via a project-local script (`check-docs`).
- Skill SSOT remains `.ai/skills/`. Provider-native wrappers (`.codex/skills/`, `.claude/skills/`) are **generated** and MUST NOT be edited directly.

## Quick start

### Option 1: AI-assisted (recommended)

1. Ask your LLM to follow `init/AGENTS.md`.
2. Review and commit:
   - Stage A docs under `docs/project/`
   - Stage B blueprint at `docs/project/project-blueprint.json`
3. Run Stage C automation (dry-run scaffold first, then apply):

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js scaffold   --blueprint docs/project/project-blueprint.json   --repo-root .

node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js apply   --blueprint docs/project/project-blueprint.json   --repo-root .   --providers codex,claude   --require-stage-a
```

### Option 2: Manual (human-driven)

1. Create Stage A docs using templates:
   - `init/skills/initialize-project-from-requirements/templates/requirements.template.md`
   - `init/skills/initialize-project-from-requirements/templates/non-functional-requirements.template.md`
   - `init/skills/initialize-project-from-requirements/templates/domain-glossary.template.md`
   - `init/skills/initialize-project-from-requirements/templates/risk-open-questions.template.md`

2. Validate Stage A:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js check-docs --docs-root docs/project
```

3. Create `docs/project/project-blueprint.json` from:
   - `init/skills/initialize-project-from-requirements/templates/project-blueprint.example.json`

4. Validate Stage B:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js validate   --blueprint docs/project/project-blueprint.json
```

5. Apply Stage C:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js apply   --blueprint docs/project/project-blueprint.json   --repo-root .   --providers both
```

## Optional cleanup (remove init kit)

After initialization succeeds, you may remove the bootstrap kit:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js cleanup-init   --repo-root .   --apply   --i-understand
```

This is guarded by the marker file: `init/.init-kit`.

## Where to read next

- AI-driven workflow: `init/AGENTS.md`
- Deep details and rubrics: `init/reference.md`
- Stage checklists: `init/stages/`
- Skill implementation: `init/skills/initialize-project-from-requirements/`

