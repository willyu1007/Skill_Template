# Initialization Instructions (LLM)

You are initializing a new project using the repository template.

> For command reference and parameter details, see `init/README.md`.

## Conclusions (read first)

- You MUST use the init entry docs (created after language is set):
  - Intake doc: `init/START-HERE.md` (LLM-maintained blocks).
  - INIT-BOARD: `init/INIT-BOARD.md` (LLM-owned; the pipeline updates only the `MACHINE_SNAPSHOT` block).
  - When the user provides new information, immediately record it into the LLM blocks in `init/START-HERE.md`.
- Language gate (required before entry docs are created):
  - Ask the user to choose one working language (free-form string).
  - Run:
    - `node init/_tools/init.mjs start --repo-root .`
    - `node init/_tools/init.mjs set-language --language "<your language>" --repo-root .`
- You MUST follow a **3-stage, file-based** pipeline:
  - **Stage A**: write requirement docs under `init/_work/stage-a-docs/`
  - **Stage B**: write blueprint at `init/_work/project-blueprint.json`
  - **Stage C**: scaffold + skill packs + wrapper sync
- You MUST keep changes **verifiable**: each stage ends with a validation command.
- You MUST NOT edit `.codex/skills/` or `.claude/skills/` directly (SSOT is `.ai/skills/`).
- You MUST NOT create dev-docs task bundles during initialization.

## Inputs to collect

Use `init/_tools/skills/initialize-project-from-requirements/templates/conversation-prompts.md` as your question bank.

**Required inputs:**

- working language (free-form string)
- one-line project purpose
- primary user roles
- in-scope MUST / out-of-scope OUT
- user journeys with acceptance criteria
- constraints (compliance/security/platform/deadlines)
- tech stack (language, package manager, frameworks)
- repo layout (`single` vs `monorepo`)
- quality expectations (testing/CI)
- whether to keep `agent-builder` workflow

If the user cannot decide, record TBD in `init/_work/stage-a-docs/risk-open-questions.md`.

## Stage A - Requirements

**Output:** `init/_work/stage-a-docs/` (4 docs)

**Process:**
1. Ask user to choose one working language
2. Run `start` to create templates
3. Run `set-language` to write `state.language` and create `init/START-HERE.md` + `init/INIT-BOARD.md`
4. Interview user using conversation prompts
5. Write docs from templates
6. Validate: `check-docs`
7. Get user approval -> `approve --stage A`

## Stage B - Blueprint

**Output:** `init/_work/project-blueprint.json`

**Process:**
1. Convert Stage A into blueprint JSON
2. Validate: `validate`
3. Review packs: `suggest-packs`
4. Get user approval -> `approve --stage B`

## Stage C - Scaffold + Skills

**Process:**
1. Dry-run: `scaffold`
2. Apply: `apply --providers both --require-stage-a`
3. Review skill retention -> `review-skill-retention`
4. Verify root docs (`README.md`, `AGENTS.md`) are project-specific
5. Get user approval -> `approve --stage C`
6. Optional: `cleanup-init --apply --i-understand --archive`

If user opts out of `agent-builder`, add `--skip-agent-builder --i-understand` to apply.

## Skill Retention Review (required before Stage C approval)

After `apply` completes:

1. Generate a skill table from `.ai/skills/` (use `skill-retention-table.template.md`)
2. Ask user which skills to remove
3. Dry-run deletion: `node .ai/scripts/delete-skills.mjs --skills "a,b" --dry-run`
4. Apply with `--yes` after confirmation
5. Mark complete: `review-skill-retention`

## Troubleshooting

**EPERM writing `.codex/skills`:** Rerun `apply` with escalated filesystem permissions.

## Quick command reference

| Stage | Validate | Approve |
|-------|----------|---------|
| A | `check-docs` | `approve --stage A` |
| B | `validate` | `approve --stage B` |
| C | `apply --providers both` | `approve --stage C` |

All commands use: `node init/_tools/init.mjs <cmd>`

Canonical script path: `init/_tools/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs`
