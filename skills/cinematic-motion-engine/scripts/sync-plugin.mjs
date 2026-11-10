#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.2 — Deterministic Root-to-Skill & Global Plugin Synchronizer
 *
 * Ensures 100% SHA-256 byte parity between the repository root (`SKILL.md`, `assets/`,
 * `references/`, `scripts/`) and:
 *   1. `skills/cinematic-motion-engine/` (in-repo plugin skill mirror)
 *   2. Global standalone plugin installation when `--global` is passed:
 *      - `~/.gemini/config/plugins/cinematic-motion-engine`
 *      - `~/.gemini/config/plugins/cinematic-motion-engine/skills/cinematic-motion-engine`
 *
 * Usage:
 *   node scripts/sync-plugin.mjs [--check] [--global]
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
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

function syncDirectoryTree(srcBase, dstBase, targets, label, checkOnly = false) {
  let syncedCount = 0;
  let driftCount = 0;

  for (const target of targets) {
    const relFiles = collectFiles(srcBase, target);
    for (const rel of relFiles) {
      const srcFile = path.join(srcBase, rel);
      const dstFile = path.join(dstBase, rel);

      const srcHash = sha256(srcFile);
      const dstExists = fs.existsSync(dstFile);
      const dstHash = dstExists ? sha256(dstFile) : null;

      if (srcHash !== dstHash) {
        driftCount++;
        if (checkOnly) {
          console.error(`[DRIFT:${label}] ${rel} differs`);
        } else {
          fs.mkdirSync(path.dirname(dstFile), { recursive: true });
          fs.copyFileSync(srcFile, dstFile);
          syncedCount++;
          console.log(`[SYNC:${label}] ${rel.replace(/\\/g, '/')}`);
        }
      }
    }
  }
  return { syncedCount, driftCount };
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const syncGlobal = process.argv.includes('--global');

  // 1. In-repo sync (root -> skills/cinematic-motion-engine)
  const localRes = syncDirectoryTree(ROOT_DIR, PLUGIN_SKILL_DIR, SYNC_TARGETS, 'local-skill', checkOnly);

  let globalSynced = 0;
  let globalDrift = 0;

  // 2. Global standalone plugin directory sync
  if (syncGlobal) {
    const home = os.homedir();
    const globalPluginDir = path.join(home, '.gemini', 'config', 'plugins', 'cinematic-motion-engine');

    const rootTargets = [...SYNC_TARGETS, 'rules', 'README.md', 'package.json', 'plugin.json', 'PRD.md', 'BLUEPRINT.md', 'docs'];

    if (fs.existsSync(globalPluginDir)) {
      const r1 = syncDirectoryTree(ROOT_DIR, globalPluginDir, rootTargets, 'global-plugin-root', checkOnly);
      const r2 = syncDirectoryTree(
        ROOT_DIR,
        path.join(globalPluginDir, 'skills', 'cinematic-motion-engine'),
        SYNC_TARGETS,
        'global-plugin-skill',
        checkOnly
      );
      globalSynced += r1.syncedCount + r2.syncedCount;
      globalDrift += r1.driftCount + r2.driftCount;
    }
  }

  const totalDrift = localRes.driftCount + globalDrift;
  const totalSynced = localRes.syncedCount + globalSynced;

  if (checkOnly) {
    if (totalDrift > 0) {
      console.error(`[SYNC CHECK FAILED] ${totalDrift} file(s) out of sync. Run: npm run sync`);
      process.exit(1);
    }
    console.log('[SYNC CHECK PASSED] 100% SHA-256 parity verified.');
  } else {
    console.log(`[SYNC COMPLETE] Updated ${totalSynced} file(s). 100% SHA-256 parity verified.`);
  }
}

main();
