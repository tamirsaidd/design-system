#!/usr/bin/env node
/**
 * Public-safety check. This repo is public, so it fails when:
 *   - a private product name, a build tool's name, or a known misspelling
 *     shows up in any file, any file path, or any commit message;
 *   - a hex colour code appears outside src/tokens/, the only home for values.
 *
 *   npm run check:banned
 *
 * The forbidden patterns are stored base64-encoded so this file never spells
 * them out, and a failure reports where, never the word itself (CI logs on a
 * public repo are public too).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const decode = (b64) => Buffer.from(b64, 'base64').toString('utf8');

const FORBIDDEN = [
  { label: 'private product name', pattern: new RegExp(decode('QWRtaXRseQ=='), 'i') },
  { label: 'build tool name', pattern: new RegExp(`\\b${decode('Q3Vyc29y')}\\b`) },
  {
    label: 'build tool name',
    pattern: new RegExp(decode('Y3Vyc29yXC4oPzpjb218c2h8c28pXGJ8XGJjdXJzb3IgKD86aWRlfGVkaXRvcnxhaSlcYg=='), 'i'),
  },
  { label: 'misspelled product name', pattern: new RegExp(decode('VGFiYm9vaw=='), 'i') },
];

// A '#' followed by 3, 4, 6 or 8 hex digits, not preceded by a word character, & or '#'.
const HEX = /(?<![\w&#])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;
const TOKENS_DIR = 'src/tokens/';
const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf|zip)$/i;
// Generated lockfiles carry commit hashes after '#'; they hold no colours.
const HEX_EXEMPT = new Set(['package-lock.json']);

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const files = git('ls-files', '-z', '--cached', '--others', '--exclude-standard')
  .split('\0')
  .filter(Boolean)
  .filter((f, i, all) => all.indexOf(f) === i);

const problems = [];

for (const file of files) {
  for (const { label, pattern } of FORBIDDEN) {
    // Mask the match: the path itself would otherwise print the word.
    const masked = file.replace(new RegExp(pattern.source, `${pattern.flags.replace('g', '')}g`), '[redacted]');
    if (pattern.test(file)) problems.push(`${masked}: file path contains the ${label}`);
  }
  if (BINARY.test(file)) continue;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue; // deleted in the working tree but still tracked
  }
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(line)) problems.push(`${file}:${i + 1}: contains the ${label}`);
    }
    if (!file.startsWith(TOKENS_DIR) && !HEX_EXEMPT.has(file)) {
      for (const match of line.matchAll(HEX)) {
        problems.push(`${file}:${i + 1}: hex colour ${match[0]} outside ${TOKENS_DIR}; use a token`);
      }
    }
  });
}

let commits = [];
try {
  commits = git('log', '--format=%H%x00%B%x01').split('\x01').filter((c) => c.trim());
} catch {
  // Not a git repository with history yet.
}
for (const entry of commits) {
  const [hash, body = ''] = entry.trim().split('\0');
  for (const { label, pattern } of FORBIDDEN) {
    if (pattern.test(body)) problems.push(`commit ${hash.slice(0, 8)}: message contains the ${label}`);
  }
}

if (problems.length) {
  console.error(`Public-safety check failed (${problems.length}):\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`Public-safety check OK: ${files.length} files, ${commits.length} commit messages, no forbidden words, no stray hex.`);
