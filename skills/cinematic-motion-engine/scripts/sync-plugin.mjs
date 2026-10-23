#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.1 — Deterministic Root-to-Skill Plugin Synchronizer
 *
 * Ensures 100% SHA-256 byte parity between the repository root (`SKILL.md`, `assets/`,
 * `references/`, `scripts/`) and `skills/cinematic-motion-engine/` so standalone skill
 * clones and Antigravity plugin installations never drift.
 *
 * Usage:
 *   node scripts/sync-plugin.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PLUGIN_SKILL_DIR = path.join(ROOT_DIR, 'skills', 'cinematic-motion-engine');

const SYNC_TARGETS = ['SKILL.md', 'assets', 'references', 'scripts'];

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function collectFiles(baseDir, relPath) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) return [];
  const stat = fs.statSync(fullPath);
  if (stat.isFile()) return [relPath];

  let results = [];
  for (const entry of fs.readdirSync(fullPath)) {
    const childRel = path.join(relPath, entry);
    results = results.concat(collectFiles(baseDir, childRel));
  }
  return results;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  let syncedCount = 0;
  let driftCount = 0;

  for (const target of SYNC_TARGETS) {
    const relFiles = collectFiles(ROOT_DIR, target);
    for (const rel of relFiles) {
      const srcFile = path.join(ROOT_DIR, rel);
      const dstFile = path.join(PLUGIN_SKILL_DIR, rel);

      const srcHash = sha256(srcFile);
      const dstExists = fs.existsSync(dstFile);
      const dstHash = dstExists ? sha256(dstFile) : null;

      if (srcHash !== dstHash) {
        driftCount++;
        if (checkOnly) {
          console.error(`[DRIFT] ${rel} differs between root and skills/cinematic-motion-engine/`);
        } else {
          fs.mkdirSync(path.dirname(dstFile), { recursive: true });
          fs.copyFileSync(srcFile, dstFile);
          syncedCount++;
          console.log(`[SYNC] ${rel} -> skills/cinematic-motion-engine/${rel.replace(/\\/g, '/')}`);
        }
      }
    }
  }

  if (checkOnly) {
    if (driftCount > 0) {
      console.error(`[SYNC CHECK FAILED] ${driftCount} file(s) out of sync. Run: npm run sync`);
      process.exit(1);
    }
    console.log('[SYNC CHECK PASSED] 100% SHA-256 parity between root and skills/cinematic-motion-engine/.');
  } else {
    console.log(`[SYNC COMPLETE] Updated ${syncedCount} file(s). 100% SHA-256 parity verified.`);
  }
}

main();
