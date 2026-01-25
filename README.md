# AI-Friendly Repository Template

A starter kit for creating LLM-optimized codebases with Single Source of Truth (SSOT) architecture.

## Quick Start

| For | Action |
|-----|--------|
| **AI Assistants** | Read `init/AGENTS.md` -> Initialize project |
| **Humans** | Read `init/README.md` -> Follow quick start |

## What's Inside

```
init/                      # Bootstrap init kit
|-- README.md              # Human guide (commands + flow)
|-- AGENTS.md              # LLM init instructions
|-- _tools/                # Pipeline + templates + checklists
|   `-- init.mjs            # Command shortcut
|-- _work/                 # Stage A/B workspace + runtime state
|   `-- AGENTS.md          # Workspace rules (LLM)
|-- START-HERE.md          # Generated on start (LLM intake; do not hand-edit outside LLM blocks)
`-- INIT-BOARD.md          # Generated on start (routing + progress; do not edit)

.ai/skills/                # SSOT for skills (incl. workflows)
.ai/scripts/               # Sync scripts
.ai/llm-config/            # LLM governance entry + registries (providers/profiles/prompts/config)

dev-docs/                  # Development documentation
|-- AGENTS.md              # Dev docs workflow + decision gate
|-- active/                # Active tasks
`-- archive/               # Completed tasks

.codex/skills/             # Codex skill entry stubs
.claude/skills/            # Claude skill entry stubs
```

## Skill Entry Points

- Canonical skills live in `.ai/skills/`
- `.codex/skills/` and `.claude/skills/` contain stubs that point back to SSOT
- Refresh stubs with `node .ai/scripts/sync-skills.mjs --scope current --providers both --mode reset --yes`

## Documentation

- [Initialization Guide](init/README.md)
- [Dev Docs Pattern](dev-docs/AGENTS.md)
- [Documentation Guidelines](.ai/skills/standards/documentation-guidelines/SKILL.md)
- [Naming Conventions](.ai/skills/standards/naming-conventions/SKILL.md)
