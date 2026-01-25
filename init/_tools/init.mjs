#!/usr/bin/env node
/**
 * init/_tools/init.mjs - Shortcut entry point for the init pipeline.
 *
 * Usage:
 *   node init/_tools/init.mjs <command> [options]
 *
 * This is a convenience wrapper for:
 *   node init/_tools/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs
 *
 * Examples:
 *   node init/_tools/init.mjs start
 *   node init/_tools/init.mjs check-docs
 *   node init/_tools/init.mjs apply --providers both
 *   node init/_tools/init.mjs cleanup-init --apply --i-understand --archive
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pipelineScript = path.join(
  __dirname,
  'skills',
  'initialize-project-from-requirements',
  'scripts',
  'init-pipeline.mjs'
);

const args = process.argv.slice(2);

const child = spawn('node', [pipelineScript, ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
