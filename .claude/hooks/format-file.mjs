#!/usr/bin/env node
// PostToolUse hook (Edit|Write): run Prettier on the file Claude just changed.
// Uses the Prettier API from the project's node_modules (no jq / npx needed, works on Windows).
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as prettier from 'prettier';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

let filePath = '';
try {
  filePath = JSON.parse(raw)?.tool_input?.file_path ?? '';
} catch {
  process.exit(0);
}
if (!filePath || !existsSync(filePath)) process.exit(0);

const ignorePath = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), '.prettierignore');
const info = await prettier.getFileInfo(filePath, { ignorePath });
if (info.ignored || !info.inferredParser) process.exit(0); // like --ignore-unknown

const source = await readFile(filePath, 'utf8');
const options = (await prettier.resolveConfig(filePath)) ?? {};
const formatted = await prettier.format(source, { ...options, filepath: filePath });

if (formatted !== source) {
  await writeFile(filePath, formatted, 'utf8');
  console.log(`prettier: formatted ${filePath}`);
}
process.exit(0);
