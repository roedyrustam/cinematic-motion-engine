#!/usr/bin/env node
/**
 * Cinematic Motion Engine (Standalone) — Dedicated Multi-Browser 60fps Exporter & FFmpeg Encoder
 * Usage: node scripts/export-video.mjs <index.html> <output.mp4> [--fps=60] [--workers=4] [--audio=audio.wav]
 */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
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
  const args = [
    '--allow-file-access-from-files',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding'
  ];
  try {
    const puppeteer = await import('puppeteer');
    return await puppeteer.default.launch({ headless: 'new', protocolTimeout: 180000, args });
  } catch {
    const puppeteerCore = await import('puppeteer-core');
    const executablePath = findLocalChrome();
    if (!executablePath) {
      throw new Error('No local Chrome/Edge/Playwright Chromium found. Set CHROME_PATH or run: npm i -D puppeteer');
    }
    return await puppeteerCore.default.launch({ executablePath, headless: 'new', protocolTimeout: 180000, args });
  }
}

function runFfmpeg(ffmpegArgs) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', ffmpegArgs, { stdio: 'inherit' });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node scripts/export-video.mjs <index.html> <output.mp4> [--fps=60] [--workers=4] [--audio=audio.wav]');
    process.exit(1);
  }

  const htmlPath = path.resolve(args[0]);
  const outputMp4 = path.resolve(args[1]);
  const fpsArg = args.find((a) => a.startsWith('--fps='));
  const workersArg = args.find((a) => a.startsWith('--workers='));
  const audioArg = args.find((a) => a.startsWith('--audio='));

  const fps = fpsArg ? parseInt(fpsArg.split('=')[1], 10) : 60;
  const workers = workersArg ? Math.max(1, parseInt(workersArg.split('=')[1], 10)) : Math.min(4, os.cpus().length);
  const audioFile = audioArg ? path.resolve(audioArg.split('=')[1]) : null;

  const tmpFramesDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cinematic-motion-frames-'));
  const fileUrl = `${pathToFileURL(htmlPath).href}?clean=1`;

  const probeBrowser = await launchBrowser();
  let meta;
  try {
    const probePage = await probeBrowser.newPage();
    await probePage.goto(fileUrl, { waitUntil: 'networkidle0' });
    await probePage.waitForFunction(() => window.OPENER && window.OPENER.ready === true, { timeout: 15000 });
    meta = await probePage.evaluate(() => ({
      W: window.OPENER.W || 1920,
      H: window.OPENER.H || 1080,
      DURATION: window.OPENER.DURATION || 8
    }));
  } finally {
    await probeBrowser.close();
  }

  const totalFrames = Math.ceil(meta.DURATION * fps);
  console.log(`[EXPORT] Rendering ${totalFrames} frames (${meta.W}x${meta.H} @ ${fps}fps) across ${workers} dedicated browser workers...`);

  const chunkSize = Math.ceil(totalFrames / workers);
  const workerPromises = [];

  try {
    for (let w = 0; w < workers; w++) {
      const startFrame = w * chunkSize;
      const endFrame = Math.min(totalFrames, startFrame + chunkSize);
      if (startFrame >= endFrame) continue;

      workerPromises.push(
        (async () => {
          const browser = await launchBrowser();
          try {
            const page = await browser.newPage();
            await page.setViewport({ width: meta.W, height: meta.H, deviceScaleFactor: 1 });
            await page.goto(fileUrl, { waitUntil: 'networkidle0' });
            await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true, { timeout: 20000 });
            await page.evaluate(() => (window.OPENER.clipsReady ? window.OPENER.clipsReady() : Promise.resolve(true)));

            for (let f = startFrame; f < endFrame; f++) {
              const t = f / fps;
              await page.evaluate((timeSec) => {
                window.OPENER.seek(timeSec);
              }, t);
              const framePath = path.join(tmpFramesDir, `frame_${String(f).padStart(6, '0')}.jpg`);
              await page.screenshot({ path: framePath, type: 'jpeg', quality: 98, optimizeForSpeed: true });
            }
          } finally {
            await browser.close();
          }
        })()
      );
    }

    await Promise.all(workerPromises);
    console.log('[EXPORT] Frame capture complete. Encoding visually lossless H.264 MP4 with FFmpeg...');

    const ffmpegArgs = [
      '-y',
      '-framerate', String(fps),
      '-i', path.join(tmpFramesDir, 'frame_%06d.jpg')
    ];
    if (audioFile) {
      ffmpegArgs.push('-i', audioFile, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    }
    ffmpegArgs.push(
      '-c:v', 'libx264',
      '-crf', '12',
      '-preset', 'slow',
      '-tune', 'grain',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outputMp4
    );

    await runFfmpeg(ffmpegArgs);
    console.log(`[DONE] Saved broadcast MP4 -> ${outputMp4}`);
  } finally {
    await fs.rm(tmpFramesDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
