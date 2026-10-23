#!/usr/bin/env node
/**
 * Cinematic Motion Engine (Standalone) — Auto-Browser Keyframe Snapshotter & Contact-Sheet Stitcher
 * Usage: node scripts/snap-contact-sheet.mjs <path-to-index.html> [out-dir] [--beats=0.5,2.0,4.5]
 */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

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
      throw new Error('No local Chrome/Edge/Playwright Chromium found. Set CHROME_PATH or run: npm i -D puppeteer');
    }
    return await puppeteerCore.default.launch({ executablePath, headless: 'new', protocolTimeout: 120000, args });
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node scripts/snap-contact-sheet.mjs <index.html> [out-dir] [--beats=0.5,2.0,4.5]');
    process.exit(1);
  }

  const htmlFile = path.resolve(args[0]);
  const outDir = path.resolve(args[1] && !args[1].startsWith('--') ? args[1] : './snaps');
  const beatsArg = args.find((a) => a.startsWith('--beats='));

  await fs.mkdir(outDir, { recursive: true });
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    const fileUrl = `${pathToFileURL(htmlFile).href}?clean=1`;
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true, { timeout: 15000 });
    await page.evaluate(() => (window.OPENER.clipsReady ? window.OPENER.clipsReady() : Promise.resolve(true)));

    const meta = await page.evaluate(() => ({
      W: window.OPENER.W || 1920,
      H: window.OPENER.H || 1080,
      DURATION: window.OPENER.DURATION || 8
    }));
    await page.setViewport({ width: meta.W, height: meta.H, deviceScaleFactor: 1 });

    let timestamps = [];
    if (beatsArg) {
      timestamps = beatsArg.replace('--beats=', '').split(',').map((n) => parseFloat(n.trim())).filter((n) => !Number.isNaN(n));
    } else {
      const steps = 12;
      for (let i = 0; i < steps; i++) {
        timestamps.push(Number(((meta.DURATION * (i + 0.35)) / steps).toFixed(2)));
      }
    }

    const captured = [];
    for (let i = 0; i < timestamps.length; i++) {
      const t = timestamps[i];
      await page.evaluate((timeSec) => {
        window.OPENER.seek(timeSec);
      }, t);

      const fileName = `frame-${String(i + 1).padStart(2, '0')}-${t.toFixed(2)}s.png`;
      const filePath = path.join(outDir, fileName);
      await page.screenshot({ path: filePath, type: 'png' });
      captured.push({ fileName, t });
      console.log(`[SNAP] ${fileName} (t=${t.toFixed(2)}s)`);
    }

    const cardsHtml = captured
      .map(
        (c, idx) => `
      <div class="cell">
        <img src="./${c.fileName}" />
        <div class="label">#${String(idx + 1).padStart(2, '0')} · t = ${c.t.toFixed(2)}s</div>
      </div>`
      )
      .join('\n');

    const contactHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  body { margin: 0; padding: 32px; background: #0B0D12; color: #F4EFE6; font-family: monospace; }
  h1 { font-size: 24px; margin: 0 0 20px 0; color: #D4FF33; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .cell { background: #141821; border: 1px solid rgba(244,239,230,0.18); border-radius: 6px; overflow: hidden; }
  .cell img { width: 100%; display: block; }
  .label { padding: 8px 12px; font-size: 15px; font-weight: bold; }
</style>
</head>
<body>
  <h1>CINEMATIC MOTION ENGINE — KEYFRAME CONTACT SHEET (${meta.W}x${meta.H} · ${meta.DURATION}s)</h1>
  <div class="grid">${cardsHtml}</div>
</body>
</html>`;

    const contactHtmlPath = path.join(outDir, 'contact-sheet.html');
    const contactPngPath = path.join(outDir, 'contact-sheet.png');
    await fs.writeFile(contactHtmlPath, contactHtml, 'utf8');

    await page.setViewport({ width: 1920, height: 1200, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(contactHtmlPath).href, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: contactPngPath, fullPage: true });
    console.log(`[CONTACT SHEET] Saved ${contactPngPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
