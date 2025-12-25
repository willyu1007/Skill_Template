# Initialization Reference (3-stage pipeline)

## Conclusions (read first)

- Stage A produces **human-readable SSOT** for intent under `docs/project/`.
- Stage B produces **machine-readable SSOT** for automation: `docs/project/project-blueprint.json`.
- Stage C is deterministic:
  - scaffold directories based on `repo.layout` and enabled capabilities
  - update `.ai/skills/_meta/sync-manifest.json` (collection: `current`)
  - regenerate provider wrappers by running `node .ai/scripts/sync-skills.js`
- The init kit is bootstrap-only. You may remove `init/` after success (guarded by `init/.init-kit`).

## 1. Definitions

- **Stage A (Requirements)**: docs defining scope, users, acceptance criteria, constraints, and non-goals.
- **Stage B (Blueprint)**: JSON decisions that drive scaffolding and skill selection deterministically.
- **Stage C (Scaffold + Skills)**: creates minimal directories, selects packs, and syncs wrappers.

## 2. Stage A - High-quality requirements (DoD rubric)

A requirements set is considered “ready for blueprinting” when:

1. **Executable**
   - Each MUST requirement implies work and is testable.
   - Each top user journey has acceptance criteria.
2. **Unambiguous**
   - Key terms are defined in `docs/project/domain-glossary.md`.
   - No hidden assumptions; assumptions are explicit.
3. **Bounded**
   - Out-of-scope (OUT) is explicit.
4. **Constraints are stated**
   - NFRs include measurable targets or explicit TBD items.
5. **Open questions are consolidated**
   - All TBD decisions are in `docs/project/risk-open-questions.md` with owner/options/decision due.

### Verification

Run:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js check-docs --docs-root docs/project
```

Use strict mode when you need a hard gate:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js check-docs --docs-root docs/project --strict
```

## 3. Stage B - Blueprint (machine-readable)

### Why a blueprint exists

- It is an interface between human intent (Stage A) and deterministic automation (Stage C).
- It must stay minimal: encode only decisions needed to scaffold and select packs.

### Mapping (high level)

See the detailed “requirements → blueprint mapping guide” in:
- `init/skills/initialize-project-from-requirements/reference.md`

### Verification

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js validate   --blueprint docs/project/project-blueprint.json
```

### Pack reconciliation

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js suggest-packs   --blueprint docs/project/project-blueprint.json   --repo-root .
```

## 4. Stage C - Scaffold + Skills

### Scaffold principles

- Scaffold MUST be minimal and framework-agnostic.
- Scaffold MUST NOT overwrite existing files.
- Scaffold creates directories and small placeholder `README.md` files only.

### Manifest (pack selection)

The blueprint declares packs in:

- `docs/project/project-blueprint.json` → `skills.packs`

Stage C maps packs to prefixes in:

- `.ai/skills/_meta/sync-manifest.json` → `collections.current.includePrefixes`

Then wrappers are regenerated:

```bash
node .ai/scripts/sync-skills.js --scope current --providers both
```

## 5. Cleanup (optional)

After initialization succeeds, you may remove the init kit:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js cleanup-init   --repo-root .   --apply   --i-understand
```

This is guarded by `init/.init-kit`.

