# Pitfalls

## Do-not-repeat summary

- Keep templates and schemas aligned with the executable pipeline scripts; treat the script output shape as SSOT.
- Avoid copy/paste-hostile command placeholders like `node .../file.js` in docs and CLI help output.
- When docs use relative paths, define the working directory explicitly.

## Resolved pitfalls

### Pitfall: Init state schema/example drift

- Symptom: `init-state.schema.json` / `init-state.example.json` describe fields that the pipeline does not create (or disagree on field names/types).
- Root cause: templates drifted from `createInitialState()` in `init-pipeline.cjs`.
- Fix: aligned schema and example with `init-pipeline.cjs` and removed doc references to non-existent state fields.
- Prevention: update schema/example whenever the pipeline state shape changes; keep doc references grounded in actual keys.

### Pitfall: `node .../agent-builder.js` placeholder copy/paste risk

- Symptom: users copy commands literally and get “module not found” because `.../` is not a path.
- Root cause: placeholder path used for brevity in docs/templates/help output.
- Fix: replaced placeholders with full repo-relative path.
- Prevention: use a canonical command string that is safe to paste from repo root.

### Pitfall: Relative-path commands without working-directory contract

- Symptom: commands like `python ./scripts/skillgen.py ...` fail when run from repo root.
- Root cause: docs used relative paths but did not define the working directory.
- Fix: declared working directory in the skill doc.
- Prevention: add a short “working directory” section whenever relative paths appear in commands.
