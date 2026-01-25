# Stage B - Blueprint

> Quick reference. For full command details, see `init/README.md`.

## Goal

Convert Stage A documents into `init/_work/project-blueprint.json`.

## Required Fields

| Field | Description |
|-------|-------------|
| `repo.layout` | `single` or `monorepo` |
| `repo.language` | Primary programming language |
| `capabilities.*` | Enabled features (frontend, backend, database) |
| `skills.packs` | At minimum include `workflows` |

## Definition of Done

- [ ] Blueprint passes `validate`
- [ ] All required fields are populated
- [ ] Tech stack fields match Stage A constraints
- [ ] `skills.packs` matches enabled capabilities
- [ ] `suggest-packs` reviewed (no unexpected warnings)
- [ ] User approved → `approve --stage B`
