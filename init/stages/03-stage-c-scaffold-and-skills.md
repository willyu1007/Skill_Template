# Stage C - Scaffold + Skills (deterministic)

## Goal

Create a minimal scaffold and enable the right skill packs, then sync provider-native wrappers.

## Inputs

- Blueprint: `docs/project/project-blueprint.json`
- Repo skill SSOT: `.ai/skills/`
- Sync script: `.ai/scripts/sync-skills.js`

## Outputs

- Minimal scaffold directories (framework-agnostic, no overwrites)
- `.ai/skills/_meta/sync-manifest.json` updated (collection: `current`)
- `.codex/skills/` and/or `.claude/skills/` regenerated (wrappers)

## Steps

1. Dry-run scaffold (required):
2. Apply scaffold + manifest update + wrapper sync.
3. Optionally remove the `init/` kit after success.

## Verification

Dry-run scaffold:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js scaffold   --blueprint docs/project/project-blueprint.json   --repo-root .
```

Apply (writes changes):

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js apply   --blueprint docs/project/project-blueprint.json   --repo-root .   --providers both
```

Optional cleanup:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.js cleanup-init   --repo-root .   --apply   --i-understand
```

