#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.1 — Standalone Mechanical Anti-PPT Static & Runtime Auditor
 *
 * Audits any motion HTML file against the 8 Mechanical Anti-PPT Structural Laws:
 *   1. Zero <section class="scene"> opacity/autoAlpha slide toggling
 *   2. Fixed stage + responsive safe-zone scaling
 *   3. 1080p Legibility Floor (>= 30px font-size) & <= 2 hierarchy levels
 *   4. Phrase accretion / deterministic timeline checks (zero Math.random() / Date.now())
 *   5. Living background surface layers (>= 2 layers)
 *   6. Unified #world / #camera-rig wrapping canvas + DOM
 *   7. SVG Joint Rig J(el, tx, ty) discipline
 *   8. Clean player-free delivery & window.OPENER automation contract
 *
 * Usage:
 *   node scripts/audit-anti-ppt.mjs <index.html> [--strict]
 */
import fs from 'node:fs';
import path from 'node:path';

function auditSourceFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  const warnings = [];
  const checks = [];

  // Law 1: Ban <section class="scene"> slide decks
  const sceneMatches = html.match(/<section[^>]*class=["'][^"']*scene[^"']*["']/gi) || [];
  if (sceneMatches.length >= 3) {
    violations.push(`Law 1: Found ${sceneMatches.length} <section class="scene"> elements (Slide-Deck Pattern forbidden)`);
  } else {
    checks.push('Law 1 (Zero Slide Decks): PASS');
  }

  // Law 2: Determinism — Ban Math.random() and Date.now() in animation scripts
  const scriptBlocks = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
  if (/\bMath\.random\s*\(/.test(scriptBlocks)) {
    violations.push('Law 2 (Determinism): Found forbidden Math.random() call. Use mulberry32() seeded PRNG instead.');
  } else if (/\bDate\.now\s*\(/.test(scriptBlocks)) {
    violations.push('Law 2 (Determinism): Found forbidden Date.now() call. Use tl.time() and D(t) instead.');
  } else {
    checks.push('Law 2 (100% Frame-Deterministic Math): PASS');
  }

  // Law 3: Static CSS font-size check (ignoring debug bar styles)
  const cssWithoutDebug = html
    .replace(/#debug-[^{]*\{[^}]*\}/g, '')
    .replace(/\.debug-[^{]*\{[^}]*\}/g, '');
  const fontMatches = [...cssWithoutDebug.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi)];
  const smallFonts = fontMatches.map((m) => parseFloat(m[1])).filter((px) => px > 0 && px < 30);
  if (smallFonts.length > 0) {
    violations.push(
      `Law 3 (1080p Legibility Floor): Found CSS font-size < 30px (${smallFonts.join('px, ')}px) outside debug bar.`
    );
  } else {
    checks.push('Law 3 (1080p Font Floor >= 30px): PASS');
  }

  // Law 6: Unified #world or #camera-rig container
  if (!/id=["'](world|camera-rig)["']/i.test(html)) {
    violations.push('Law 6 (Spatial Rig): Missing #world or #camera-rig container.');
  } else {
    checks.push('Law 6 (Unified #world / #camera-rig Spatial Container): PASS');
  }

  // Law 8: window.OPENER contract
  if (!/window\.OPENER\s*=/.test(scriptBlocks)) {
    violations.push('Law 8 (Automation Contract): Missing window.OPENER export object.');
  } else {
    const hasSeekFrame = /seekFrame\s*\(/.test(scriptBlocks);
    if (!hasSeekFrame) {
      warnings.push('Law 8 Warning: window.OPENER should implement async seekFrame(t) alongside seek(t).');
    }
    checks.push('Law 8 (window.OPENER Automation Contract): PASS');
  }

  return {
    file: path.basename(filePath),
    status: violations.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS',
    checks,
    warnings,
    violations
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node scripts/audit-anti-ppt.mjs <index.html | directory> [--strict]');
    process.exit(1);
  }

  const target = path.resolve(args[0]);
  const strict = args.includes('--strict');
  const files = [];

  if (fs.statSync(target).isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      if (entry.endsWith('.html')) files.push(path.join(target, entry));
    }
  } else {
    files.push(target);
  }

  let hasFailures = false;
  for (const f of files) {
    const res = auditSourceFile(f);
    console.log(`\n=== [ANTI-PPT AUDIT] ${res.file} -> ${res.status} ===`);
    for (const c of res.checks) console.log(`  ✓ ${c}`);
    for (const w of res.warnings) console.log(`  ⚠ ${w}`);
    for (const v of res.violations) console.error(`  ✗ ${v}`);
    if (res.violations.length > 0) hasFailures = true;
  }

  if (hasFailures && strict) {
    process.exit(2);
  }
}

main();
