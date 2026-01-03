# AI Assistant Instructions

This is an **AI-Friendly Repository Template** - a starter kit for creating LLM-optimized codebases.

## Project Type

Template repository. Users clone this to start new AI-friendly projects.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `init/` | **Start here** - Initialization instructions |
| `.ai/` | Skills, scripts, LLM governance (see `.ai/AGENTS.md`) |
| `dev/` | Working documentation for complex tasks |

## Routing

| Task Type | Entry Point |
|-----------|-------------|
| **First time / Project setup** | `init/AGENTS.md` |
| **Skill authoring / maintenance** | `.ai/AGENTS.md` |
| **LLM engineering** | `.ai/llm/AGENTS.md` |
| **Complex task documentation** | `dev/AGENTS.md` |

## Global Rules

- For complex tasks (multi-module, multi-session, >2 hours), create task docs under `dev/active/`
- On context reset for ongoing work, read `dev/active/<task-name>/00-overview.md` first
- Follow progressive disclosure pattern

## Need More?

- **Skill/Workflow operations**: See `.ai/AGENTS.md`
- **LLM engineering tasks**: See `.ai/llm/AGENTS.md`
