# Debug Mode — Terminal Evidence Collection (Terminal Hook)

## Purpose
Reduce manual copy/paste by collecting IDE terminal output (when available) and extracting **minimal, deterministic evidence** for analysis.

This reference describes:
- how to probe tool availability,
- how to choose terminals,
- how to progressively expand collection,
- how to extract evidence with strict budgets,
- how to fall back when automatic collection fails.

## Non-goals
- Do not add or require new MCP servers.
- Do not paste raw/full terminal tails into chat or journal.
- Do not store terminal collection attempt metadata in `.ai/.tmp/<task_id>/journal.md` (only keep outcome + short excerpts per existing journal policy).

## Terminology
- `terminal_key`: the identifier used to fetch output. Use the value returned by `list_terminals()` that can be passed to `get_terminal_output(...)`.
  - Prefer a stable unique id when present (e.g., `terminal.id`).
  - Otherwise use `terminal.name` and ensure the name is unique (rename terminals if needed).
  - Note: the tool parameter may be called `terminal_name`, but `get_terminal_output(...)` accepts the `terminal_key` value (name or id).
- `run_id`: the debug iteration id. The run_id may appear in logs as:
  - `[DBG:<run_id>]` (preferred), or
  - structured variants like `run_id=<run_id>` / `"run_id":"<run_id>"`.

## Budgets (MUST)
- Terminal fetch (progressive): `lines = 200 → 500 → 1000 → 2000` (max 2000).
- Evidence shown in chat (post-extraction): **<= 150 lines OR <= 8KB** (whichever limit hits first).
- Journal excerpts remain governed by `reference/journal_policy.md` and `templates/journal_entry_templates.md` (short, redacted).

## Tool availability probe
1) Attempt to call `list_terminals()`.
2) If the tool does not exist or the call fails, follow **Fallback B** (manual paste).

## Terminal selection
### Default: scan terminals (terminal-level)
If you do not have a reliable terminal hint:
1) Enumerate terminals via `list_terminals()`.
2) For each terminal, fetch `lines=200`.
3) Mark a terminal as a candidate if its output contains:
   - a run_id marker (see “Run-id hit windows”), or
   - a failure signal (see “Failure block extraction”).

### If no candidates are found
Increase `lines` progressively (500→1000→2000) and rescan candidates.

### If candidates still not found
Follow **Fallback A** (progressive disclosure: ask for terminal selection hints before asking for pasted logs).

### Terminal name collisions (SHOULD handle)
If you only have terminal names and multiple terminals share the same name:
- Ask the user to rename terminals to unique names (e.g., `backend`, `frontend`, `worker`) and re-run collection.
- Prefer terminal ids when available.

## Evidence extraction (deterministic rules)
### Run-id hit windows (preferred)
If the run_id appears in any supported marker form, treat the matching line as a hit:
- `[DBG:<run_id>]`
- `run_id=<run_id>` (optionally quoted / spaced)
- `"run_id":"<run_id>"` (JSON-ish logs; spacing variants allowed)

Then:
- For each hit line, extract a context window:
  - `before = 3` lines
  - `after = 15` lines
- Merge overlapping/adjacent windows.
- Keep only merged windows, then enforce the evidence budget (<=150 lines or <=8KB).

### Failure block extraction (fallback)
If no run_id hits, attempt to extract a failure block from the tail:
- Default failure signals (extend as needed):
  - `FAIL`, `ERROR`, `Exception`, `Traceback`, `panic`, `Unhandled`, `AssertionError`
- Strategy:
  1) Scan from the end backward to find the **most recent** failure signal.
  2) Extract starting at that signal line forward until:
     - stacktrace ends (blank line + prompt, or clear end marker), or
     - the evidence budget is reached.
- Keep only one block (the most recent, most complete one).

### ANSI / noise (SHOULD)
Terminal output may include ANSI control characters. Prefer to strip or ignore them when extracting evidence, but do not over-engineer: correctness of extraction and budget enforcement matters more.

## Fallback logic (progressive disclosure)
### Fallback B — Terminal Hook unavailable
**Trigger**
- `list_terminals()` is missing or errors.

**Behavior**
Ask the user to paste the smallest possible excerpt:
1) First ask for logs filtered by the run_id marker plus a little context:
   - preferred: `[DBG:<run_id>]`
   - if structured logs: `run_id=<run_id>` or `"run_id":"<run_id>"`
2) If still insufficient, ask for the failure block/stacktrace excerpt.

### Fallback A — Terminal Hook available but collection didn’t find usable evidence
**Trigger**
- Tools work, but after `lines<=2000` you still have no run_id marker hits and no useful failure block.

**Behavior**
Escalate in small steps:
1) Ask the user to reproduce once more, then reply `DONE` immediately (do not clear/close the terminal).
2) If still failing, ask the user for a terminal selection hint (preferred over logs):
   - which terminal tab/name shows the output,
   - what command was run in that terminal.
3) Only as a last resort, ask for pasted logs using the same minimal format as Fallback B.

## What to show in-chat (minimized)
- Prefer 1-2 short excerpts that directly support/deny hypotheses.
- Do not paste the raw tail. Always paste **post-extraction** evidence only.
- If you need to explain why a fallback was triggered, do so in 1 line without dumping metadata.

## Optional helper script (deterministic)
Optional: `scripts/collect_evidence.cjs` is a deterministic extractor (stdin JSON -> stdout JSON). The script does not call MCP tools and is safe to remove; the workflow still works using the rules above.
