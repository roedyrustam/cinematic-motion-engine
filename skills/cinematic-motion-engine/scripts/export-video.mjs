#!/usr/bin/env node
/**
 * Cinematic Motion Engine v3.0 — Dedicated Multi-Browser 60fps Video Exporter & GPU-Accelerated FFmpeg Encoder
 * Author: Roedy Rustam
 *
 * Features:
 *   - Frame-accurate `await window.OPENER.seekFrame(t)` synchronization (supports <video> clips & WebGL/WebGPU)
 *   - Zero-Disk FFmpeg `image2pipe` streaming mode (`--pipe`) or parallel multi-worker chunk capture
 *   - Hardware GPU acceleration auto-detection: NVIDIA NVENC (`h264_nvenc`) & Apple VideoToolbox (`h264_videotoolbox`)
 *   - Multi-Aspect Ratio (`--ratio=16x9|9x16|1x1|4x5`)
 *   - Multi-Codec Broadcast Output (`--codec=h264|prores|webm-alpha`)
 *
 * Usage:
 *   node scripts/export-video.mjs <index.html> <output.mp4|mov|webm> [--fps=60] [--workers=4] [--audio=audio.wav] [--ratio=16x9|9x16|1x1|4x5] [--codec=h264|prores|webm-alpha] [--gpu=auto|nvenc|videotoolbox|cpu] [--pipe]
 */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execSync } from 'node:child_process';
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
    '--enable-unsafe-webgpu',
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

function detectGpuEncoder(requestedGpu = 'auto') {
  if (requestedGpu === 'cpu') return 'cpu';
  try {
    const encoders = execSync('ffmpeg -encoders', { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' });
    if ((requestedGpu === 'nvenc' || requestedGpu === 'auto') && encoders.includes('h264_nvenc')) {
      return 'nvenc';
    }
    if ((requestedGpu === 'videotoolbox' || requestedGpu === 'auto') && encoders.includes('h264_videotoolbox')) {
      return 'videotoolbox';
    }
  } catch {
    // FFmpeg query failed or not in PATH
  }
  return 'cpu';
}

function buildCodecArgs(codec, outputFile, gpuMode = 'cpu') {
  if (codec === 'prores') {
    return ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', outputFile];
  }
  if (codec === 'webm-alpha') {
    return ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '18', outputFile];
  }

  // H.264 MP4 with hardware acceleration if available
  if (gpuMode === 'nvenc') {
    console.log('[CME v3.0] Using NVIDIA NVENC Hardware Accelerated Encoder (h264_nvenc)');
    return [
      '-c:v', 'h264_nvenc',
      '-preset', 'p6',
      '-tune', 'hq',
      '-cq', '16',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outputFile
    ];
  }
  if (gpuMode === 'videotoolbox') {
    console.log('[CME v3.0] Using Apple Silicon VideoToolbox Hardware Accelerated Encoder');
    return [
      '-c:v', 'h264_videotoolbox',
      '-q:v', '72',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outputFile
    ];
  }

  // CPU fallback
  return [
    '-c:v', 'libx264',
    '-crf', '12',
    '-preset', 'slow',
    '-tune', 'grain',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputFile
  ];
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
    console.log(
      'Usage: node scripts/export-video.mjs <index.html> <output.mp4> [--fps=60] [--workers=4] [--audio=audio.wav] [--ratio=16x9|9x16|1x1|4x5] [--codec=h264|prores|webm-alpha] [--gpu=auto|nvenc|videotoolbox|cpu] [--pipe]'
    );
    process.exit(1);
  }

  const htmlPath = path.resolve(args[0]);
  const outputVideo = path.resolve(args[1]);
  const fpsArg = args.find((a) => a.startsWith('--fps='));
  const workersArg = args.find((a) => a.startsWith('--workers='));
  const audioArg = args.find((a) => a.startsWith('--audio='));
  const ratioArg = args.find((a) => a.startsWith('--ratio='));
  const codecArg = args.find((a) => a.startsWith('--codec='));
  const gpuArg = args.find((a) => a.startsWith('--gpu='));
  const usePipe = args.includes('--pipe');

  const fps = fpsArg ? parseInt(fpsArg.split('=')[1], 10) : 60;
  const workers = workersArg ? Math.max(1, parseInt(workersArg.split('=')[1], 10)) : Math.min(4, os.cpus().length);
  const audioFile = audioArg ? path.resolve(audioArg.split('=')[1]) : null;
  const ratio = ratioArg ? ratioArg.split('=')[1] : '16x9';
  const codec = codecArg ? codecArg.split('=')[1].toLowerCase() : 'h264';
  const requestedGpu = gpuArg ? gpuArg.split('=')[1].toLowerCase() : 'auto';
  const gpuMode = detectGpuEncoder(requestedGpu);
  const needsAlpha = codec === 'prores' || codec === 'webm-alpha';

  const fileUrl = `${pathToFileURL(htmlPath).href}?clean=1&ratio=${encodeURIComponent(ratio)}`;

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
  console.log(
    `[CME v3.0 EXPORT] Rendering ${totalFrames} frames (${meta.W}x${meta.H} @ ${fps}fps, ratio=${ratio}, codec=${codec}, gpu=${gpuMode}) ${
      usePipe ? 'via Zero-Disk FFmpeg stdin pipe' : `across ${workers} dedicated browser workers`
    }...`
  );

  // Mode 1: Zero-Disk Direct Memory Pipe (--pipe)
  if (usePipe) {
    const imgCodec = needsAlpha ? 'png' : 'mjpeg';
    const ffmpegArgs = ['-y', '-f', 'image2pipe', '-vcodec', imgCodec, '-framerate', String(fps), '-i', '-'];
    if (audioFile) {
      ffmpegArgs.push('-i', audioFile, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    }
    ffmpegArgs.push(...buildCodecArgs(codec, outputVideo, gpuMode));

    const ffmpegProc = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
    const browser = await launchBrowser();
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: meta.W, height: meta.H, deviceScaleFactor: 1 });
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });
      await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true, { timeout: 20000 });
      await page.evaluate(() => (window.OPENER.clipsReady ? window.OPENER.clipsReady() : Promise.resolve(true)));

      for (let f = 0; f < totalFrames; f++) {
        const t = f / fps;
        await page.evaluate(async (timeSec) => {
          if (typeof window.OPENER.seekFrame === 'function') {
            await window.OPENER.seekFrame(timeSec);
          } else {
            window.OPENER.seek(timeSec);
          }
        }, t);

        const buf = await page.screenshot(
          needsAlpha
            ? { type: 'png', omitBackground: true }
            : { type: 'jpeg', quality: 98, optimizeForSpeed: true }
        );
        if (!ffmpegProc.stdin.write(buf)) {
          await new Promise((r) => ffmpegProc.stdin.once('drain', r));
        }
      }
      ffmpegProc.stdin.end();
      await new Promise((resolve, reject) => {
        ffmpegProc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`FFmpeg exited ${code}`))));
      });
      console.log(`[CME v3.0 DONE] Saved broadcast video -> ${outputVideo}`);
    } finally {
      await browser.close();
    }
    return;
  }

  // Mode 2: Parallel Multi-Browser Worker Capture
  const tmpFramesDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cinematic-motion-frames-'));
  const ext = needsAlpha ? 'png' : 'jpg';
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
              await page.evaluate(async (timeSec) => {
                if (typeof window.OPENER.seekFrame === 'function') {
                  await window.OPENER.seekFrame(timeSec);
                } else {
                  window.OPENER.seek(timeSec);
                }
              }, t);
              const framePath = path.join(tmpFramesDir, `frame_${String(f).padStart(6, '0')}.${ext}`);
              await page.screenshot(
                needsAlpha
                  ? { path: framePath, type: 'png', omitBackground: true }
                  : { path: framePath, type: 'jpeg', quality: 98, optimizeForSpeed: true }
              );
            }
          } finally {
            await browser.close();
          }
        })()
      );
    }

    await Promise.all(workerPromises);
    console.log(`[CME v3.0 EXPORT] Frame capture complete. Encoding ${codec.toUpperCase()} with FFmpeg (${gpuMode})...`);

    const ffmpegArgs = ['-y', '-framerate', String(fps), '-i', path.join(tmpFramesDir, `frame_%06d.${ext}`)];
    if (audioFile) {
      ffmpegArgs.push('-i', audioFile, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    }
    ffmpegArgs.push(...buildCodecArgs(codec, outputVideo, gpuMode));

    await runFfmpeg(ffmpegArgs);
    console.log(`[CME v3.0 DONE] Saved broadcast video -> ${outputVideo}`);
  } finally {
    await fs.rm(tmpFramesDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
