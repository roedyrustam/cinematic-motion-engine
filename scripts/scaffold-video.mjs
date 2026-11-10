#!/usr/bin/env node
/**
 * Cinematic Motion Engine v3.0 — Autonomous One-Command Video Project Scaffolder
 * Author: Roedy Rustam
 *
 * Scaffolds a complete broadcast motion graphics project directory from one of the 6 official starters,
 * copies `cme-core.js`, synthesizes a deterministic WAV soundtrack + 60fps `AUDIO_FRAMES` curve,
 * generates procedural foley SFX, optionally generates Whisper word-level timing,
 * and runs the Anti-PPT mechanical linter automatically.
 *
 * Usage:
 *   node scripts/scaffold-video.mjs <target-dir> [options]
 *
 * Options:
 *   --mode=<opener|explainer|panggung|kolase|katalog|sketsa> (default: opener)
 *   --style=<swiss-grid|kartun-kolase|jurnalisme-visual|katalog-putih|sketsa-vintage|kartun-panggung|bauhaus-geo|brutalist-telemetry|editorial-film|isometric-blueprint|spatial-optics|data-sculpture>
 *   --ratio=<16x9|9x16|1x1|4x5> (default: 16x9)
 *   --title="<Project Title>"
 *   --duration=<seconds> (default: 10)
 *   --bpm=<number>       (default: 125)
 *   --mood=<warm|cyber|editorial|corporate> (default: warm)
 *   --foley              (generate procedural foley sound effects track)
 *   --whisper            (generate demo Whisper word-level karaoke array)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const MODE_TO_STARTER = {
  opener: 'starter-opener.html',
  explainer: 'starter-explainer.html',
  panggung: 'starter-explainer-panggung.html',
  kolase: 'starter-explainer-kolase.html',
  katalog: 'starter-explainer-katalog.html',
  sketsa: 'starter-explainer-sketsa.html'
};

function parseArgs(argv) {
  const opts = {
    targetDir: null,
    mode: 'opener',
    style: null,
    ratio: '16x9',
    title: 'Cinematic Motion Engine v3.0 Production',
    duration: 10,
    bpm: 125,
    mood: 'warm',
    foley: false,
    whisper: false
  };
  for (const arg of argv) {
    if (!arg.startsWith('--') && !opts.targetDir) opts.targetDir = arg;
    else if (arg.startsWith('--out=')) opts.targetDir = arg.slice(6);
    else if (arg.startsWith('--mode=')) opts.mode = arg.slice(7).toLowerCase();
    else if (arg.startsWith('--type=')) opts.mode = arg.slice(7).toLowerCase();
    else if (arg.startsWith('--style=')) opts.style = arg.slice(8).toLowerCase();
    else if (arg.startsWith('--ratio=')) opts.ratio = arg.slice(8).toLowerCase();
    else if (arg.startsWith('--title=')) opts.title = arg.slice(8);
    else if (arg.startsWith('--duration=')) opts.duration = parseFloat(arg.slice(11)) || 10;
    else if (arg.startsWith('--bpm=')) opts.bpm = parseFloat(arg.slice(6)) || 125;
    else if (arg.startsWith('--mood=')) opts.mood = arg.slice(7).toLowerCase();
    else if (arg === '--foley') opts.foley = true;
    else if (arg === '--whisper') opts.whisper = true;
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.targetDir) {
    console.log(
      'Usage: node scripts/scaffold-video.mjs <target-dir> [--mode=opener|explainer|panggung|kolase|katalog|sketsa] [--style=swiss-grid] [--ratio=16x9|9x16|1x1|4x5] [--duration=10] [--bpm=125] [--mood=warm] [--foley] [--whisper]'
    );
    process.exit(1);
  }

  const outDir = path.resolve(opts.targetDir);
  fs.mkdirSync(outDir, { recursive: true });

  const starterName = MODE_TO_STARTER[opts.mode] || MODE_TO_STARTER.opener;
  const starterPath = path.join(ROOT_DIR, 'assets', starterName);
  const coreJsPath = path.join(ROOT_DIR, 'assets', 'cme-core.js');

  // 1. Copy cme-core.js into target project
  fs.copyFileSync(coreJsPath, path.join(outDir, 'cme-core.js'));

  // 2. Generate deterministic audio.wav + audio-frames.js
  const wavPath = path.join(outDir, 'audio.wav');
  const framesJsonPath = path.join(outDir, 'audio-frames.json');
  const framesJsPath = path.join(outDir, 'audio-frames.js');

  spawnSync(
    process.execPath,
    [
      path.join(ROOT_DIR, 'scripts', 'generate-audio.mjs'),
      `--out=${wavPath}`,
      `--frames=${framesJsonPath}`,
      `--js=${framesJsPath}`,
      `--duration=${opts.duration}`,
      `--bpm=${opts.bpm}`,
      `--mood=${opts.mood}`
    ],
    { stdio: 'inherit' }
  );

  // 3. Optional Foley generation
  if (opts.foley) {
    const foleyPath = path.join(outDir, 'foley-whoosh.wav');
    spawnSync(process.execPath, [path.join(ROOT_DIR, 'scripts', 'generate-foley.mjs'), '--type=whoosh', `--out=${foleyPath}`]);
    const slamPath = path.join(outDir, 'foley-slam.wav');
    spawnSync(process.execPath, [path.join(ROOT_DIR, 'scripts', 'generate-foley.mjs'), '--type=impact', `--out=${slamPath}`]);
  }

  // 4. Optional Whisper demo generation
  if (opts.whisper) {
    const whisperJsPath = path.join(outDir, 'whisper-words.js');
    spawnSync(process.execPath, [path.join(ROOT_DIR, 'scripts', 'sync-whisper.mjs'), '--demo', `--out=${whisperJsPath}`]);
  }

  // 5. Customize starter HTML and inject scripts
  let html = fs.readFileSync(starterPath, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${opts.title}</title>`);

  let injectedScripts = `  <script src="./audio-frames.js"></script>\n  <script src="./cme-core.js"></script>`;
  if (opts.whisper) {
    injectedScripts += `\n  <script src="./whisper-words.js"></script>`;
  }
  html = html.replace('</head>', `${injectedScripts}\n</head>`);

  if (opts.style) {
    html = html.replace(
      '</body>',
      `  <script>if (window.CME) window.CME.applyTheme('${opts.style}');</script>\n</body>`
    );
  }

  const indexHtmlPath = path.join(outDir, 'index.html');
  fs.writeFileSync(indexHtmlPath, html, 'utf8');

  // 6. Run Anti-PPT static audit on scaffolded project
  spawnSync(process.execPath, [path.join(ROOT_DIR, 'scripts', 'audit-anti-ppt.mjs'), indexHtmlPath, '--strict'], {
    stdio: 'inherit'
  });

  console.log(`\n[CME v3.0 SCAFFOLD COMPLETE] Project ready at: ${outDir}`);
  console.log(`  Ratio: ${opts.ratio} | Mode: ${opts.mode} | Style: ${opts.style || 'default'}`);
  console.log(`  1. Visual Audit : node "${path.join(ROOT_DIR, 'scripts', 'snap-contact-sheet.mjs')}" "${indexHtmlPath}" "${path.join(outDir, 'snaps')}"`);
  console.log(`  2. 60fps Export : node "${path.join(ROOT_DIR, 'scripts', 'export-video.mjs')}" "${indexHtmlPath}" "${path.join(outDir, 'output.mp4')}" --audio="${wavPath}" --ratio=${opts.ratio} --gpu=auto`);
}

main();
