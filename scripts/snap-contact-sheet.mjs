#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.1 — Auto-Browser Keyframe Snapshotter, Contact-Sheet Stitcher & Anti-PPT Telemetry Gate
 *
 * Usage:
 *   node scripts/snap-contact-sheet.mjs <path-to-index.html> [out-dir] [--beats=0.5,2.0,4.5] [--ratio=16x9|9x16|1x1] [--strict]
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

/**
 * In-page Anti-PPT DOM Telemetry Audit executed at each captured beat timestamp.
 */
function evaluateBeatTelemetry(timeSec, stageW, stageH) {
  const violations = [];
  const warnings = [];

  // Law 1: Ban <section class="scene"> opacity toggling
  const sceneSections = document.querySelectorAll('section.scene, .ppt-slide, .slide-deck');
  if (sceneSections.length >= 3) {
    violations.push(`Law 1 Violation: Found ${sceneSections.length} slide-deck <section class="scene"> containers`);
  }

  // Law 5 & 6: Unified #world or #camera-rig + >= 2 background layers
  const worldEl = document.getElementById('world') || document.getElementById('camera-rig');
  if (!worldEl) {
    violations.push('Law 6 Violation: Missing continuous #world or #camera-rig spatial container');
  }

  // Check if camera is currently mid-whip-pan (motion blur active)
  const blurNode = document.getElementById('mb-world-node');
  const stdDev = blurNode ? blurNode.getAttribute('stdDeviation') || '0 0' : '0 0';
  const [blurX, blurY] = stdDev.split(/[\s,]+/).map((v) => parseFloat(v) || 0);
  const isMovingFast = blurX > 0.5 || blurY > 0.5;

  // Law 3: Minimum 30px font floor at 1080p reference resolution
  const stageEl = document.getElementById('stage') || document.body;
  const stageRect = stageEl.getBoundingClientRect();
  const stageScale = stageRect.width > 0 ? stageRect.width / stageW : 1;

  const walker = document.createTreeWalker(stageEl, NodeFilter.SHOW_TEXT, null);
  let minFontPx = Infinity;
  let visibleTextNodes = 0;
  const distinctFontBuckets = new Set();

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue ? node.nodeValue.trim() : '';
    if (!text) continue;
    const el = node.parentElement;
    if (!el) continue;
    if (el.closest('#debug-bar') || el.closest('defs')) continue;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.08) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;

    // Check if visible inside the stage viewport
    const relLeft = (rect.left - stageRect.left) / stageScale;
    const relRight = (rect.right - stageRect.left) / stageScale;
    const relTop = (rect.top - stageRect.top) / stageScale;
    const relBottom = (rect.bottom - stageRect.top) / stageScale;

    const inViewport = relRight > 0 && relLeft < stageW && relBottom > 0 && relTop < stageH;
    if (!inViewport) continue;

    visibleTextNodes++;
    const rawFontPx = parseFloat(style.fontSize) || 30;
    if (rawFontPx < minFontPx) minFontPx = rawFontPx;

    // Bucket font sizes to nearest 6px to estimate hierarchy levels (excluding diegetic badges/props)
    if (!el.closest('svg') && !el.classList.contains('diegetic')) {
      distinctFontBuckets.add(Math.round(rawFontPx / 8) * 8);
    }

    if (rawFontPx < 29.5) {
      violations.push(`Law 3 Violation: Text "${text.slice(0, 22)}" has font-size ${rawFontPx.toFixed(1)}px (< 30px floor)`);
    }

    // Safe-zone check when camera is settled (with generous margin for bleed typography)
    if (!isMovingFast && (relLeft < -20 || relRight > stageW + 20 || relTop < -20 || relBottom > stageH + 20)) {
      warnings.push(`Safe-Zone Clipping Warning: "${text.slice(0, 20)}" extends outside stage at t=${timeSec.toFixed(2)}s`);
    }
  }

  // Law 7: kartun-panggung checks
  const isCartoonStage = Boolean(document.getElementById('camera-rig') && !document.getElementById('world'));
  if (isCartoonStage) {
    const animatedProps = document.querySelectorAll('[id^="prop-"], [id^="hero-"], [id^="npc-"], [id^="rig-"]');
    if (animatedProps.length < 10) {
      warnings.push(`Law 7 Warning: Found ${animatedProps.length} rigged stage props (< 10 recommended for kartun-panggung)`);
    }
  }

  return {
    t: timeSec,
    isMovingFast,
    blurStdDeviation: stdDev,
    visibleTextNodes,
    minFontPx: minFontPx === Infinity ? null : Number(minFontPx.toFixed(1)),
    hierarchyLevels: distinctFontBuckets.size,
    violations,
    warnings,
    status: violations.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS'
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log(
      'Usage: node scripts/snap-contact-sheet.mjs <index.html> [out-dir] [--beats=0.5,2.0,4.5] [--ratio=16x9|9x16|1x1] [--strict]'
    );
    process.exit(1);
  }

  const htmlFile = path.resolve(args[0]);
  const outDir = path.resolve(args[1] && !args[1].startsWith('--') ? args[1] : './snaps');
  const beatsArg = args.find((a) => a.startsWith('--beats='));
  const ratioArg = args.find((a) => a.startsWith('--ratio='));
  const strictMode = args.includes('--strict');
  const ratio = ratioArg ? ratioArg.split('=')[1] : '16x9';

  await fs.mkdir(outDir, { recursive: true });
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    const fileUrl = `${pathToFileURL(htmlFile).href}?clean=1&ratio=${encodeURIComponent(ratio)}`;
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true, { timeout: 15000 });
    await page.evaluate(() => (window.OPENER.clipsReady ? window.OPENER.clipsReady() : Promise.resolve(true)));

    const meta = await page.evaluate(() => ({
      W: window.OPENER.W || 1920,
      H: window.OPENER.H || 1080,
      DURATION: window.OPENER.DURATION || 8,
      BEATS: Array.isArray(window.OPENER.BEATS) ? window.OPENER.BEATS : null
    }));
    await page.setViewport({ width: meta.W, height: meta.H, deviceScaleFactor: 1 });

    let timestamps = [];
    if (beatsArg) {
      timestamps = beatsArg
        .replace('--beats=', '')
        .split(',')
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !Number.isNaN(n));
    } else if (meta.BEATS && meta.BEATS.length >= 4) {
      timestamps = meta.BEATS;
    } else {
      const steps = 12;
      for (let i = 0; i < steps; i++) {
        timestamps.push(Number(((meta.DURATION * (i + 0.35)) / steps).toFixed(2)));
      }
    }

    const captured = [];
    let totalViolations = 0;
    let totalWarnings = 0;

    for (let i = 0; i < timestamps.length; i++) {
      const t = timestamps[i];
      await page.evaluate(async (timeSec) => {
        if (typeof window.OPENER.seekFrame === 'function') {
          await window.OPENER.seekFrame(timeSec);
        } else {
          window.OPENER.seek(timeSec);
        }
      }, t);

      const telemetry = await page.evaluate(evaluateBeatTelemetry, t, meta.W, meta.H);
      totalViolations += telemetry.violations.length;
      totalWarnings += telemetry.warnings.length;

      const fileName = `frame-${String(i + 1).padStart(2, '0')}-${t.toFixed(2)}s.png`;
      const filePath = path.join(outDir, fileName);
      await page.screenshot({ path: filePath, type: 'png' });
      captured.push({ fileName, t, telemetry });
      console.log(
        `[SNAP] ${fileName} (t=${t.toFixed(2)}s) | Status=${telemetry.status} | minFont=${telemetry.minFontPx ?? 'N/A'}px | blur=${telemetry.blurStdDeviation}`
      );
    }

    const auditReport = {
      source: path.basename(htmlFile),
      width: meta.W,
      height: meta.H,
      duration: meta.DURATION,
      ratio,
      totalBeats: captured.length,
      totalViolations,
      totalWarnings,
      overallStatus: totalViolations > 0 ? 'FAIL' : totalWarnings > 0 ? 'WARN' : 'PASS',
      beats: captured.map((c) => c.telemetry)
    };

    const auditJsonPath = path.join(outDir, 'audit-report.json');
    await fs.writeFile(auditJsonPath, JSON.stringify(auditReport, null, 2), 'utf8');

    const cardsHtml = captured
      .map((c, idx) => {
        const badgeColor =
          c.telemetry.status === 'PASS' ? '#34D399' : c.telemetry.status === 'WARN' ? '#FBBF24' : '#F87171';
        const fontLabel = c.telemetry.minFontPx ? `minFont: ${c.telemetry.minFontPx}px` : 'diegetic/stage';
        return `
      <div class="cell">
        <img src="./${c.fileName}" />
        <div class="label">
          <span>#${String(idx + 1).padStart(2, '0')} · t=${c.t.toFixed(2)}s · ${fontLabel}</span>
          <span class="badge" style="background:${badgeColor}">${c.telemetry.status}</span>
        </div>
      </div>`;
      })
      .join('\n');

    const contactHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  body { margin: 0; padding: 32px; background: #0B0D12; color: #F4EFE6; font-family: monospace; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  h1 { font-size: 22px; margin: 0; color: #D4FF33; }
  .summary { font-size: 15px; color: #9BA3B0; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .cell { background: #141821; border: 1px solid rgba(244,239,230,0.18); border-radius: 6px; overflow: hidden; }
  .cell img { width: 100%; display: block; }
  .label { padding: 8px 12px; font-size: 13px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
  .badge { color: #0B0D12; padding: 2px 8px; border-radius: 4px; font-weight: 900; font-size: 12px; }
</style>
</head>
<body>
  <div class="header">
    <h1>CINEMATIC MOTION ENGINE v2.1 — CONTACT SHEET &amp; ANTI-PPT AUDIT (${meta.W}x${meta.H} · ${meta.DURATION}s)</h1>
    <div class="summary">Overall: ${auditReport.overallStatus} · Violations: ${totalViolations} · Warnings: ${totalWarnings}</div>
  </div>
  <div class="grid">${cardsHtml}</div>
</body>
</html>`;

    const contactHtmlPath = path.join(outDir, 'contact-sheet.html');
    const contactPngPath = path.join(outDir, 'contact-sheet.png');
    await fs.writeFile(contactHtmlPath, contactHtml, 'utf8');

    await page.setViewport({ width: 1920, height: 1200, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(contactHtmlPath).href, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: contactPngPath, fullPage: true });
    console.log(`[CONTACT SHEET] Saved ${contactPngPath} & ${auditJsonPath} (Overall: ${auditReport.overallStatus})`);

    if (strictMode && totalViolations > 0) {
      console.error(`[STRICT AUDIT FAILED] Found ${totalViolations} mechanical Anti-PPT violations.`);
      process.exit(2);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
