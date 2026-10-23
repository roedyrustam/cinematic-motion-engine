#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.2 — Autonomous One-Command Video Project Scaffolder
 *
 * Scaffolds a complete broadcast motion graphics project directory from one of the 6 official starters,
 * copies `cme-core.js`, synthesizes a deterministic WAV soundtrack + 60fps `AUDIO_FRAMES` curve,
 * and runs the Anti-PPT mechanical linter automatically.
 *
 * Usage:
 *   node scripts/scaffold-video.mjs <target-dir> [options]
 *
 * Options:
 *   --mode=<opener|explainer|panggung|kolase|katalog|sketsa> (default: opener)
 *   --style=<swiss-grid|kartun-kolase|jurnalisme-visual|katalog-putih|sketsa-vintage|kartun-panggung|bauhaus-geo|brutalist-telemetry|editorial-film|isometric-blueprint|spatial-optics|data-sculpture>
 *   --title="<Project Title>"
 *   --duration=<seconds> (default: 10)
 *   --bpm=<number>       (default: 125)
 *   --mood=<warm|cyber|editorial|corporate> (default: warm)
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
    title: 'Cinematic Motion Engine Production',
    duration: 10,
    bpm: 125,
    mood: 'warm'
  };
  for (const arg of argv) {
    if (!arg.startsWith('--') && !opts.targetDir) opts.targetDir = arg;
    else if (arg.startsWith('--out=')) opts.targetDir = arg.slice(6);
    else if (arg.startsWith('--mode=')) opts.mode = arg.slice(7).toLowerCase();
    else if (arg.startsWith('--type=')) opts.mode = arg.slice(7).toLowerCase();
    else if (arg.startsWith('--style=')) opts.style = arg.slice(8).toLowerCase();
    else if (arg.startsWith('--title=')) opts.title = arg.slice(8);
    else if (arg.startsWith('--duration=')) opts.duration = parseFloat(arg.slice(11)) || 10;
    else if (arg.startsWith('--bpm=')) opts.bpm = parseFloat(arg.slice(6)) || 125;
    else if (arg.startsWith('--mood=')) opts.mood = arg.slice(7).toLowerCase();
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.targetDir) {
    console.log(
      'Usage: node scripts/scaffold-video.mjs <target-dir> [--mode=opener|explainer|panggung|kolase|katalog|sketsa] [--style=swiss-grid] [--duration=10] [--bpm=125] [--mood=warm]'
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

  // 3. Customize starter HTML and inject <script src="./audio-frames.js"> & <script src="./cme-core.js">
  let html = fs.readFileSync(starterPath, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${opts.title}</title>`);
  html = html.replace(
    '</head>',
    `  <script src="./audio-frames.js"></script>\n  <script src="./cme-core.js"></script>\n</head>`
  );

  if (opts.style) {
    html = html.replace(
      '</body>',
      `  <script>if (window.CME) window.CME.applyTheme('${opts.style}');</script>\n</body>`
    );
  }

  const indexHtmlPath = path.join(outDir, 'index.html');
  fs.writeFileSync(indexHtmlPath, html, 'utf8');

  // 4. Run Anti-PPT static audit on scaffolded project
  spawnSync(process.execPath, [path.join(ROOT_DIR, 'scripts', 'audit-anti-ppt.mjs'), indexHtmlPath, '--strict'], {
    stdio: 'inherit'
  });

  console.log(`\n[SCAFFOLD COMPLETE] Project ready at: ${outDir}`);
  console.log(`  1. Visual Audit : node "${path.join(ROOT_DIR, 'scripts', 'snap-contact-sheet.mjs')}" "${indexHtmlPath}" "${path.join(outDir, 'snaps')}"`);
  console.log(`  2. 60fps Export : node "${path.join(ROOT_DIR, 'scripts', 'export-video.mjs')}" "${indexHtmlPath}" "${path.join(outDir, 'output.mp4')}" --audio="${wavPath}"`);
}

main();
