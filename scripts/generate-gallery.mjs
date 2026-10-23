#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.1 — Automated Broadcast Style Gallery & Starter Preview Generator
 *
 * Automatically captures high-resolution visual previews into `docs/gallery/`:
 *   1. `style-gallery-overview.png` (1920x1160 master 12-style grid showcase)
 *   2. 6 Official Starter Previews (`starter-opener.png`, `starter-explainer.png`, etc.)
 *   3. 12 Individual Broadcast Style Cards (`style-01-swiss-grid.png` .. `style-12-data-sculpture.png`)
 *
 * Usage:
 *   node scripts/generate-gallery.mjs
 */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'docs', 'gallery');

function findLocalChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'),
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  return candidates.find((p) => fsSync.existsSync(p)) || null;
}

async function launchBrowser() {
  const args = ['--allow-file-access-from-files', '--enable-webgl', '--ignore-gpu-blocklist'];
  try {
    const puppeteer = await import('puppeteer');
    return await puppeteer.default.launch({ headless: 'new', protocolTimeout: 120000, args });
  } catch {
    const puppeteerCore = await import('puppeteer-core');
    const executablePath = findLocalChrome();
    if (!executablePath) {
      throw new Error('No local Chrome/Edge/Playwright Chromium found.');
    }
    return await puppeteerCore.default.launch({ executablePath, headless: 'new', protocolTimeout: 120000, args });
  }
}

async function waitForFonts(page) {
  await Promise.race([
    page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve())),
    new Promise((r) => setTimeout(r, 2500))
  ]);
}

const STARTERS = [
  { file: 'starter-opener.html', out: 'starter-opener.png', beat: 3.35, title: 'Launch Opener & 3D Shader Rig' },
  { file: 'starter-explainer.html', out: 'starter-explainer.png', beat: 2.35, title: 'Aksi Kontinu & Phrase Accretion' },
  { file: 'starter-explainer-panggung.html', out: 'starter-explainer-panggung.png', beat: 4.2, title: 'Kartun Panggung Hidup (J() Rig)' },
  { file: 'starter-explainer-kolase.html', out: 'starter-explainer-kolase.png', beat: 4.3, title: 'Kartun Kolase & Jurnalisme Visual' },
  { file: 'starter-explainer-katalog.html', out: 'starter-explainer-katalog.png', beat: 1.4, title: 'Katalog Putih (3D Isometric Stack)' },
  { file: 'starter-explainer-sketsa.html', out: 'starter-explainer-sketsa.png', beat: 1.8, title: 'Sketsa Vintage & Cyanotype Blueprint' }
];

const STYLE_IDS = [
  'style-01-swiss-grid',
  'style-02-kartun-kolase',
  'style-03-jurnalisme-visual',
  'style-04-katalog-putih',
  'style-05-sketsa-vintage',
  'style-06-kartun-panggung',
  'style-07-bauhaus-geo',
  'style-08-brutalist-telemetry',
  'style-09-editorial-film',
  'style-10-isometric-blueprint',
  'style-11-spatial-optics',
  'style-12-data-sculpture'
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    const galleryHtml = path.join(ROOT_DIR, 'assets', 'style-gallery.html');

    // 1. Capture Master 12-Style Overview Banner (1920x1140)
    await page.setViewport({ width: 1920, height: 1140, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(galleryHtml).href, { waitUntil: 'domcontentloaded' });
    await waitForFonts(page);
    const overviewPath = path.join(OUT_DIR, 'style-gallery-overview.png');
    await page.screenshot({ path: overviewPath, type: 'png' });
    console.log(`[GALLERY] Captured Master Overview -> ${overviewPath}`);

    // 2. Capture 12 Individual Style Direction Cards (960x540)
    await page.setViewport({ width: 960, height: 540, deviceScaleFactor: 1 });
    for (const styleId of STYLE_IDS) {
      const url = `${pathToFileURL(galleryHtml).href}?card=${styleId}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await waitForFonts(page);
      const outPath = path.join(OUT_DIR, `${styleId}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`[GALLERY] Captured Style Card -> ${styleId}.png`);
    }

    // 3. Capture 6 Official Starter Templates at Hero Beats (1920x1080 rendered, downsampled or native)
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    for (const item of STARTERS) {
      const starterPath = path.join(ROOT_DIR, 'assets', item.file);
      const url = `${pathToFileURL(starterPath).href}?clean=1`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true, { timeout: 15000 });
      await waitForFonts(page);
      await page.evaluate(async (t) => {
        if (typeof window.OPENER.seekFrame === 'function') {
          await window.OPENER.seekFrame(t);
        } else {
          window.OPENER.seek(t);
        }
      }, item.beat);
      const outPath = path.join(OUT_DIR, item.out);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`[GALLERY] Captured Starter Hero Beat -> ${item.out} (t=${item.beat}s)`);
    }

    console.log(`[DONE] Generated 19 gallery assets in ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
