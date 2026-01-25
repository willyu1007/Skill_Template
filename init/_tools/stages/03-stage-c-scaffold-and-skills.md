# Stage C - Scaffold + Skills

> Quick reference. For full command details, see `init/README.md`.

## Goal

Create minimal scaffold, update skill manifest, sync provider wrappers.

## Outputs

| Output | Location |
|--------|----------|
| Scaffold directories | `src/` or `apps/` + `packages/` |
| Manifest | `.ai/skills/_meta/sync-manifest.json` |
| Provider wrappers | `.codex/skills/`, `.claude/skills/` |
| Root docs | `README.md`, `AGENTS.md` |

## Definition of Done

- [ ] `apply --providers both` completed
- [ ] Scaffold directories created (no overwrites)
- [ ] Manifest updated with selected packs
- [ ] Provider wrappers regenerated
- [ ] Root `README.md` and `AGENTS.md` updated from blueprint
- [ ] `review-skill-retention` completed
- [ ] (Optional) Agent builder pruned if not needed
- [ ] User approved → `approve --stage C`

## Post-init (optional)

- Archive and cleanup: `cleanup-init --apply --i-understand --archive`
