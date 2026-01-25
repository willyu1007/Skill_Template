# Stage Checkpoints (Mandatory User Approval)

## Conclusions (read first)

- **EVERY stage transition requires explicit user approval.**
- AI MUST NOT proceed to the next stage without user saying "approved" / "continue" / "yes" or equivalent.
- This prevents runaway automation and ensures the user stays in control.

---

## Checkpoint A -> B: Requirements Complete

### When to Trigger

After ALL of these conditions are met:
1. All 4 Stage A docs exist under `init/_work/stage-a-docs/`
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

1. Review the 4 documents under `init/_work/stage-a-docs/`
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
  node init/_tools/init.mjs approve --stage A
  ```

---

## Checkpoint B -> C: Blueprint Complete

### When to Trigger

After ALL of these conditions are met:
1. `init/_work/project-blueprint.json` exists
2. `validate` command passes
3. `suggest-packs` has been reviewed (user aware of recommended packs)
4. AI has completed the quality checklist self-review

### Prompt to User

```
## Stage B Completion Checkpoint

I have generated the project blueprint:
- init/_work/project-blueprint.json

Validation results:
- validate: [PASS/FAIL]
- recommended packs: [workflows, standards, backend, frontend, testing, ...]
- current packs: [workflows, standards, backend, frontend, testing, ...]

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

1. Review `init/_work/project-blueprint.json`
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
  node init/_tools/init.mjs approve --stage B
  ```

---

## Checkpoint C: Scaffold Complete

### When to Trigger

After ALL of these conditions are met:
1. `apply` command has completed (scaffold + configs + manifest + wrappers)
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

### Root docs updated (IMPORTANT)

`README.md` and `AGENTS.md` have been updated from the blueprint:

| File | Updated sections |
|------|------------------|
| `README.md` | Title, description, tech stack, project structure |
| `AGENTS.md` | Project Type, Tech Stack, Key Directories |

**Please verify:**
- [ ] `AGENTS.md` → "Project Type" shows your project name and description (NOT "Template repository")
- [ ] `AGENTS.md` → "Tech Stack" matches your blueprint choices
- [ ] `README.md` → Title and description are project-specific

If any section still shows template placeholder content, run:
```bash
node init/_tools/init.mjs update-root-docs --apply
```

### Next steps

1. Review skill retention (keep vs prune). If you want changes, list skills to remove and we will prune them.
2. Mark retention review complete (required before Stage C approval):
   node init/_tools/init.mjs review-skill-retention --repo-root .
3. (If needed) Regenerate root docs:
   node init/_tools/init.mjs update-root-docs --apply
4. Archive + remove init kit (optional): to keep Stage A docs and blueprint in `docs/project/overview/`, run:
   node init/_tools/init.mjs cleanup-init --repo-root . --apply --i-understand --archive
5. Start development: you can now use the enabled skills

### Confirm completion

Reply with one of:
- "regen docs" - Re-generate root README.md + AGENTS.md from the blueprint
- "cleanup init" - Archive docs and remove the init kit
- "done" - Complete initialization without further changes
```

### AI MUST

- Wait for explicit user confirmation
- If user says "regen docs":
  1. Run `node init/_tools/init.mjs update-root-docs --apply`
  2. Ask the user to review `README.md` and `AGENTS.md`
- Before Stage C approval, run:
  ```bash
  node init/_tools/init.mjs review-skill-retention --repo-root .
  ```
- Once user confirms, run:
  ```bash
  node init/_tools/init.mjs approve --stage C
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
4. Save current state to `init/_work/.init-state.json`
5. Wait for user instructions

---

## State Recovery

If a session is interrupted, AI should:

1. Check for existing `init/_work/.init-state.json`
2. If found, resume from the recorded state
3. Prompt the user: "Detected an incomplete init state. Resume from Stage [X]?"

**Note**: The state file is stored in `init/_work/` and will be deleted when `cleanup-init` is run. This is intentional - the state is temporary working data, not a permanent record.
