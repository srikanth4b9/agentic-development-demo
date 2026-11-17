#!/usr/bin/env node
// PreToolUse hook (Edit|Write): block edits to protected .env files.
// Same logic as the bash + jq version on the slide; written in Node so it runs on Windows,
// macOS and Linux without jq. Exit code 2 = block the tool call and show stderr to Claude.
import { basename } from 'node:path';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

let filePath = '';
try {
  filePath = JSON.parse(raw)?.tool_input?.file_path ?? '';
} catch {
  process.exit(0); // not our concern — let Claude Code handle malformed input
}

const filename = basename(filePath);
if (filename === '.env' || filename.startsWith('.env.')) {
  console.error(`Blocked: ${filename} is a protected environment file. Ask a human to change it.`);
  process.exit(2);
}
process.exit(0);
