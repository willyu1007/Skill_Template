# Init Workspace Instructions (LLM)

`init/_work/` is the **workspace** for the 3-stage init pipeline.

It contains Stage A/B **SSOT artifacts** plus a temporary runtime state file used to drive `init/INIT-BOARD.md`.

## What belongs here

| Path | Owner | Purpose | Commit |
|------|-------|---------|--------|
| `stage-a-docs/` | Human + LLM | Stage A requirements (human-readable SSOT) | Yes |
| `project-blueprint.json` | Human + LLM | Stage B blueprint (machine-readable SSOT) | Yes |
| `.init-state.json` | Pipeline | Runtime progress state (drives board) | No (gitignored) |

## Rules (MUST)

- Keep paths stable: `stage-a-docs/`, `project-blueprint.json`, `.init-state.json`.
- Store raw materials (images, PDFs, links) in `init/START-HERE.md` under the LLM blocks, not under `init/_work/`.
- Do not hand-edit `init/_work/.init-state.json`. Use `node init/_tools/init.mjs` commands to update the state.
- Keep required headings in Stage A docs. The validator expects the template headings to exist.

## Verification commands

- Stage A docs: `node init/_tools/init.mjs check-docs`
- Stage B blueprint: `node init/_tools/init.mjs validate`
- Stage C apply: `node init/_tools/init.mjs apply --providers both --require-stage-a`

## Cleanup (optional)

Archive Stage A/B SSOT into `docs/project/overview/` and remove the init kit:

- `node init/_tools/init.mjs cleanup-init --apply --i-understand --archive`
