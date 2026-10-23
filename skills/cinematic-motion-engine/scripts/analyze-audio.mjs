#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.1 — Headless CLI Voiceover Silence (SEG/PARA) & 60fps FFT Compiler
 *
 * Replaces manual browser uploads in vo-fft-analyzer.html for autonomous AI agent workflows.
 * Decodes .wav natively in pure Node.js or uses FFmpeg for .mp3/.m4a/.ogg/.flac.
 *
 * Usage:
 *   node scripts/analyze-audio.mjs <input-audio.mp3|wav> [--out=vo-data.js] [--json=vo-data.json] [--fps=60] [--db=-38] [--min-silence=180]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const opts = {
    input: null,
    outJs: null,
    outJson: null,
    fps: 60,
    dbThresh: -38,
    minSilenceMs: 180
  };
  for (const arg of argv) {
    if (!arg.startsWith('--') && !opts.input) opts.input = arg;
    else if (arg.startsWith('--out=')) opts.outJs = arg.slice(6);
    else if (arg.startsWith('--json=')) opts.outJson = arg.slice(7);
    else if (arg.startsWith('--fps=')) opts.fps = Math.max(24, Math.min(120, parseInt(arg.slice(6), 10) || 60));
    else if (arg.startsWith('--db=')) opts.dbThresh = parseFloat(arg.slice(5)) || -38;
    else if (arg.startsWith('--min-silence=')) opts.minSilenceMs = parseInt(arg.slice(14), 10) || 180;
  }
  return opts;
}

/**
 * Pure Node.js RIFF WAV parser (supports 16-bit PCM & 32-bit float WAV without FFmpeg).
 */
function decodeWavNative(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Not a standard RIFF WAVE file');
  }

  let offset = 12;
  let audioFormat = 1;
  let numChannels = 1;
  let sampleRate = 44100;
  let bitsPerSample = 16;
  let dataOffset = -1;
  let dataSize = 0;

  while (offset + 8 <= buf.length) {
    const chunkId = buf.toString('ascii', offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    if (chunkId === 'fmt ') {
      audioFormat = buf.readUInt16LE(offset + 8);
      numChannels = buf.readUInt16LE(offset + 10);
      sampleRate = buf.readUInt32LE(offset + 12);
      bitsPerSample = buf.readUInt16LE(offset + 22);
    } else if (chunkId === 'data') {
      dataOffset = offset + 8;
      dataSize = chunkSize;
      break;
    }
    offset += 8 + chunkSize + (chunkSize % 2);
  }

  if (dataOffset < 0) throw new Error('WAV data chunk not found');

  const bytesPerSample = bitsPerSample / 8;
  const frameSize = bytesPerSample * numChannels;
  const totalFrames = Math.floor(Math.min(dataSize, buf.length - dataOffset) / frameSize);
  const mono = new Float32Array(totalFrames);

  for (let i = 0; i < totalFrames; i++) {
    let sum = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      const pos = dataOffset + i * frameSize + ch * bytesPerSample;
      if (audioFormat === 3 && bitsPerSample === 32) {
        sum += buf.readFloatLE(pos);
      } else if (bitsPerSample === 16) {
        sum += buf.readInt16LE(pos) / 32768;
      } else if (bitsPerSample === 24) {
        const b0 = buf[pos];
        const b1 = buf[pos + 1];
        const b2 = buf.readInt8(pos + 2);
        const val = (b2 << 16) | (b1 << 8) | b0;
        sum += val / 8388608;
      } else if (bitsPerSample === 8) {
        sum += (buf.readUInt8(pos) - 128) / 128;
      }
    }
    mono[i] = sum / numChannels;
  }

  return { samples: mono, sampleRate };
}

/**
 * Decodes any audio file (.mp3, .m4a, .ogg, .wav) via FFmpeg into 44.1kHz mono Float32 PCM.
 */
function decodeWithFfmpeg(filePath, targetSr = 44100) {
  const res = spawnSync(
    'ffmpeg',
    ['-v', 'error', '-i', filePath, '-ac', '1', '-ar', String(targetSr), '-f', 'f32le', 'pipe:1'],
    { maxBuffer: 256 * 1024 * 1024 }
  );
  if (res.error || res.status !== 0) {
    throw new Error(`FFmpeg decode failed: ${res.stderr ? res.stderr.toString() : res.error?.message}`);
  }
  const raw = res.stdout;
  const samples = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4));
  return { samples, sampleRate: targetSr };
}

function loadMonoSamples(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.wav') {
    try {
      return decodeWavNative(filePath);
    } catch {
      return decodeWithFfmpeg(filePath);
    }
  }
  return decodeWithFfmpeg(filePath);
}

function analyzeSamples(samples, sr, opts) {
  const duration = samples.length / sr;
  const fps = opts.fps;
  const ampThresh = Math.pow(10, opts.dbThresh / 20);
  const minSilenceSec = opts.minSilenceMs / 1000;

  // 1. Speech Segments (SEG) & Paragraph Windows (PARA)
  const winSamples = Math.floor(sr * 0.02);
  const SEG = [];
  let inSpeech = false;
  let segStart = 0;
  let silenceRun = 0;

  for (let i = 0; i < samples.length; i += winSamples) {
    let sumSq = 0;
    const end = Math.min(samples.length, i + winSamples);
    for (let j = i; j < end; j++) sumSq += samples[j] * samples[j];
    const rms = Math.sqrt(sumSq / (end - i));
    const t = i / sr;

    if (rms >= ampThresh) {
      if (!inSpeech) {
        inSpeech = true;
        segStart = t;
      }
      silenceRun = 0;
    } else if (inSpeech) {
      silenceRun += 0.02;
      if (silenceRun >= minSilenceSec) {
        inSpeech = false;
        const endSec = Math.max(segStart + 0.02, t - silenceRun);
        SEG.push({
          start: Number(segStart.toFixed(2)),
          end: Number(endSec.toFixed(2)),
          dur: Number((endSec - segStart).toFixed(2))
        });
      }
    }
  }
  if (inSpeech) {
    SEG.push({
      start: Number(segStart.toFixed(2)),
      end: Number(duration.toFixed(2)),
      dur: Number((duration - segStart).toFixed(2))
    });
  }

  const PARA = [];
  for (const seg of SEG) {
    const prev = PARA[PARA.length - 1];
    if (!prev || seg.start - prev.end >= 0.48) {
      PARA.push({ id: `p${PARA.length + 1}`, start: seg.start, end: seg.end });
    } else {
      prev.end = seg.end;
    }
  }

  // 2. Deterministic 60fps Multi-Band Energy & Onset Table (AUDIO_FRAMES)
  const totalFrames = Math.ceil(duration * fps);
  const samplesPerFrame = Math.floor(sr / fps);
  const AUDIO_FRAMES = [];
  let prevBass = 0;

  for (let f = 0; f < totalFrames; f++) {
    const s0 = f * samplesPerFrame;
    const s1 = Math.min(samples.length, s0 + samplesPerFrame);
    let low = 0;
    let mid = 0;
    let high = 0;
    let lp = 0;
    let bp = 0;

    for (let i = s0; i < s1; i++) {
      const x = samples[i];
      lp = lp * 0.92 + x * 0.08;
      bp = bp * 0.75 + (x - lp) * 0.25;
      const hp = x - lp - bp;
      low += lp * lp;
      mid += bp * bp;
      high += hp * hp;
    }
    const n = Math.max(1, s1 - s0);
    const bassNorm = Math.min(100, Math.round(Math.sqrt(low / n) * 420));
    const midNorm = Math.min(100, Math.round(Math.sqrt(mid / n) * 380));
    const highNorm = Math.min(100, Math.round(Math.sqrt(high / n) * 460));
    const onset = bassNorm - prevBass > 22 && bassNorm > 45 ? 1 : 0;
    prevBass = bassNorm;
    AUDIO_FRAMES.push([bassNorm, midNorm, highNorm, onset]);
  }

  return {
    duration: Number(duration.toFixed(2)),
    fps,
    PARA,
    SEG,
    AUDIO_FRAMES
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.input) {
    console.log(
      'Usage: node scripts/analyze-audio.mjs <input-audio.mp3|wav> [--out=vo-data.js] [--json=vo-data.json] [--fps=60] [--db=-38] [--min-silence=180]'
    );
    process.exit(1);
  }

  const inputPath = path.resolve(opts.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`[ERROR] Input audio file not found: ${inputPath}`);
    process.exit(1);
  }

  const { samples, sampleRate } = loadMonoSamples(inputPath);
  const result = analyzeSamples(samples, sampleRate, opts);

  const jsSnippet = [
    `// Generated by Cinematic Motion Engine v2.1 — Source: ${path.basename(inputPath)} (${result.duration}s @ ${result.fps}fps)`,
    `const DURATION = ${result.duration};`,
    `const PARA = ${JSON.stringify(result.PARA, null, 2)};`,
    `const SEG = ${JSON.stringify(result.SEG, null, 2)};`,
    `window.AUDIO_FRAMES = ${JSON.stringify(result.AUDIO_FRAMES)};`
  ].join('\n\n');

  if (opts.outJs) {
    const outJsPath = path.resolve(opts.outJs);
    fs.mkdirSync(path.dirname(outJsPath), { recursive: true });
    fs.writeFileSync(outJsPath, `${jsSnippet}\n`, 'utf8');
    console.log(`[ANALYZE] Wrote JS timing & FFT constants -> ${outJsPath}`);
  }

  if (opts.outJson) {
    const outJsonPath = path.resolve(opts.outJson);
    fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
    fs.writeFileSync(outJsonPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`[ANALYZE] Wrote JSON report -> ${outJsonPath}`);
  }

  if (!opts.outJs && !opts.outJson) {
    console.log(jsSnippet);
  } else {
    console.log(
      `[SUMMARY] Duration=${result.duration}s | Paragraphs=${result.PARA.length} | Segments=${result.SEG.length} | AudioFrames=${result.AUDIO_FRAMES.length}`
    );
  }
}

main();
