# Stage Checkpoints (Mandatory User Approval)

## Conclusions (read first)

- **EVERY stage transition requires explicit user approval.**
- AI MUST NOT proceed to the next stage without user saying "approved" / "continue" / "yes" or equivalent.
- This prevents runaway automation and ensures the user stays in control.

---

## Checkpoint A -> B: Requirements Complete

### When to Trigger

After ALL of these conditions are met:
1. All 4 Stage A docs exist under `init/stage-a-docs/`
2. `check-docs` passes (or `--strict` if required)
3. AI has completed the quality checklist self-review

### Prompt to User

```
## Stage A Completion Checkpoint

I have completed the requirements documents:
- requirements.md
- non-functional-requirements.md
- domain-glossary.md
- risk-open-questions.md

Validation results:
- check-docs: [PASS/FAIL]
- quality checklist: [complete]

### Please review

1. Review the 4 documents under `init/stage-a-docs/`
2. Confirm the content matches your expectations
3. Share any changes you want

### Confirm to proceed

If Stage A looks good, reply "continue" or "approved" and I will start Stage B.
If you need changes, tell me what to adjust.
```

### AI MUST

- Wait for explicit user approval
- If user requests changes, iterate until approved
- Once user approves, run:
  ```bash
  node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage A
  ```

---

## Checkpoint B -> C: Blueprint Complete

### When to Trigger

After ALL of these conditions are met:
1. `init/project-blueprint.json` exists
2. `validate` command passes
3. `suggest-packs` has been reviewed (user aware of recommended packs)
4. AI has completed the quality checklist self-review

### Prompt to User

```
## Stage B Completion Checkpoint

I have generated the project blueprint:
- init/project-blueprint.json

Validation results:
- validate: [PASS/FAIL]
- recommended packs: [workflows, backend, frontend, ...]
- current packs: [workflows, backend, frontend, ...]

### Blueprint summary

| Field | Value |
|------|-------|
| project.name | {{project.name}} |
| repo.layout | {{repo.layout}} |
| repo.language | {{repo.language}} |
| frontend enabled | {{capabilities.frontend.enabled}} |
| backend enabled | {{capabilities.backend.enabled}} |
| database enabled | {{capabilities.database.enabled}} |

### Please review

1. Review `init/project-blueprint.json`
2. Confirm skill pack selection matches the project
3. Share any changes you want

### Confirm to proceed

If Stage B looks good, reply "continue" or "approved" and I will start Stage C.
If you need changes, tell me what to adjust.
```

### AI MUST

- Wait for explicit user approval
- Show pack suggestions and let the user decide
- Once user approves, run:
  ```bash
  node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage B
  ```

---

## Checkpoint C: Scaffold Complete

### When to Trigger

After ALL of these conditions are met:
1. `scaffold --apply` has completed
2. Manifest updated
3. Wrappers synced
4. AI has completed the quality checklist self-review

### Prompt to User

```
## Stage C Completion Checkpoint

Initialization is complete.

### Created directory structure

{{scaffold_summary}}

### Enabled skill packs

{{enabled_packs}}

### Verification

- sync-manifest.json: updated
- Provider wrappers generated:
  - .codex/skills/: {{codex_skill_count}} skills
  - .claude/skills/: {{claude_skill_count}} skills

### Next steps

1. Archive docs (optional): to keep Stage A docs and blueprint in `docs/project/`, run:
   node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init --repo-root . --apply --i-understand --archive
2. Cleanup init (optional): removes the initialization kit after archiving
3. Start development: you can now use the enabled skills

### Confirm completion

If you confirm initialization is complete, reply "done".
If you want to clean up init, reply "cleanup init".
```

### AI MUST

- Wait for explicit user confirmation
- Once user confirms, run:
  ```bash
  node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage C
  ```
- Only run cleanup-init if the user explicitly requests it

---

## Emergency Stop

At any point, if the user says:
- "stop" / "cancel" / "abort"

AI MUST:
1. Immediately stop the current operation
2. Summarize what has been done
3. Explain what has NOT been done
4. Save current state to `init/.init-state.json`
5. Wait for user instructions

---

## State Recovery

If a session is interrupted, AI should:

1. Check for existing `init/.init-state.json`
2. If found, resume from the recorded state
3. Prompt the user: "Detected an incomplete init state. Resume from Stage [X]?"

**Note**: The state file is stored in `init/` and will be deleted when `cleanup-init` is run. This is intentional - the state is temporary working data, not a permanent record.
