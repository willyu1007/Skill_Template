# Skill Specification (Codex + Claude Code)

## Purpose & scope

This document summarizes how to define, store, and use "Agent Skills" for:

- **OpenAI Codex**: `https://developers.openai.com/codex/skills/`
- **Claude Code**: `https://code.claude.com/docs/en/skills`

It focuses on the **on-disk format**, **discovery/activation**, and **compatibility differences** between the two systems.

## Core concepts

- A **Skill** is a self-contained capability described by instructions in a `SKILL.md` file.
- Skills support **progressive disclosure**:
  - At startup, the agent loads only each skill's `name` and `description`.
  - When invoked, the agent reads the full `SKILL.md` and any supporting files inside the skill directory.
- Skills can be activated:
  - **Explicitly** (e.g., selecting a skill by name in the prompt / UI), or
  - **Implicitly** (the agent decides to use a skill when the user request matches the skill's description).

## On-disk structure

### Directory layout (Codex)

Codex skills are folders that contain a required `SKILL.md` plus optional supporting directories:

```
my-skill/
  SKILL.md       # required: instructions + metadata
  scripts/       # optional: executable code
  references/    # optional: documentation
  assets/        # optional: templates/resources
```

### Directory layout (Claude Code)

Claude Code skills are folders that contain a required `SKILL.md` and may include any supporting files you reference from the skill (e.g., `reference.md`, `scripts/`, additional `.md` files).

## `SKILL.md` format (YAML frontmatter + Markdown body)

### Required fields (both)

`SKILL.md` MUST start with YAML frontmatter that defines:

- `name`: the skill identifier
- `description`: a short description that helps the agent select the skill

Example (Codex / minimal):

```yaml
---
name: skill-name
description: Description that helps Codex select the skill
metadata:
  short-description: Optional user-facing description
---
```

After the frontmatter, the file contains Markdown instructions (steps, constraints, examples).

### Tool restrictions (Claude Code)

Claude Code supports restricting tool access using `allowed-tools` in the frontmatter:

```yaml
---
name: safe-file-reader
description: Read files without making changes. Use when you need read-only file access.
allowed-tools: Read, Grep, Glob
---
```

Use `allowed-tools` when you want a skill to be explicitly limited (for example, a read-only skill that should not edit files).

## Skill locations & precedence

### Codex locations (scope + precedence)

Codex loads skills from multiple locations, and **higher-precedence scopes overwrite lower-precedence skills with the same `name`**:

1. Repo scope: `$CWD/.codex/skills`
2. Repo scope: `$CWD/../.codex/skills`
3. Repo scope: `$REPO_ROOT/.codex/skills`
4. User scope: `$CODEX_HOME/skills` (Mac/Linux default: `~/.codex/skills`)
5. Admin scope: `/etc/codex/skills`
6. System scope: bundled with Codex

### Claude Code locations

Claude Code skills can be stored in:

- **Personal**: `~/.claude/skills/<skill-name>/SKILL.md`
- **Project** (in a repo): `.claude/skills/<skill-name>/SKILL.md`

## Viewing / debugging skills

### Claude Code (CLI)

Common actions shown in the Claude Code docs:

- List personal skills: `ls ~/.claude/skills/`
- List project skills: `ls .claude/skills/`
- View a skill: `cat ~/.claude/skills/my-skill/SKILL.md`
- Debug (including YAML issues): `claude --debug`

### Codex

Codex supports explicit invocation via:

- Selecting skills (e.g., `/skills`), or
- Mentioning a skill by name (typing `$` and selecting a skill).

Codex also supports installing curated skills via the built-in `$skill-installer` skill.

## Authoring rules (MUST/SHOULD)

- Skills MUST use YAML frontmatter with at least `name` and `description`.
- Skills SHOULD follow progressive disclosure:
  - Keep `SKILL.md` concise and action-oriented.
  - Put deep reference material in separate files and link to them from `SKILL.md`.
- Skills SHOULD include small, concrete examples only when they improve correctness.
- If you use Claude Code `allowed-tools`, you MUST keep the instruction body consistent with the restriction (for example, don't instruct edits if write tools are not allowed).

## Verification (how to check)

- **Codex**:
  - Ensure the skill directory exists under one of the Codex skill roots (see "Codex locations").
  - Ensure `SKILL.md` begins with valid YAML frontmatter containing `name` and `description`.
- **Claude Code**:
  - Ensure the skill directory exists under `~/.claude/skills/` or `.claude/skills/`.
  - Run `claude --debug` to surface YAML parsing or loading errors.

## Template repo note (this repository)

This repository template keeps skills as SSOT under `.ai/skills/` and generates entry stubs under `.codex/skills/` and `.claude/skills/`.

- Do not edit `.codex/skills/` or `.claude/skills/` directly.
- Sync stubs from SSOT with: `node .ai/scripts/sync-skills.js`
