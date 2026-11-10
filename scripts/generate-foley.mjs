#!/usr/bin/env node
/**
 * Cinematic Motion Engine v3.0 — Dedicated Procedural Motion Foley & SFX Generator
 * Author: Roedy Rustam
 *
 * Generates 44.1kHz 16-bit Stereo PCM .wav foley effects without external native sound dependencies:
 *   - whoosh: Exponential frequency-swept filtered noise for camera whip-pans
 *   - impact: 50Hz sub-bass sine drop with soft-clip saturation for text slams
 *   - click: High-frequency decaying click for UI accretion and number counters
 *   - riser: Monotonic pitch-accelerating build-up riser for climax sequences
 *   - timeline: Batch foley generation from a JSON array of timeline events
 *
 * Usage:
 *   node scripts/generate-foley.mjs --type=whoosh --out=whoosh.wav [--duration=0.4] [--seed=12345]
 *   node scripts/generate-foley.mjs --type=impact --out=slam.wav [--duration=0.6]
 *   node scripts/generate-foley.mjs --type=click --out=click.wav [--duration=0.08]
 *   node scripts/generate-foley.mjs --timeline=foley-events.json --out=foley-track.wav --totalDuration=12.0
 */
import fs from 'node:fs';
import path from 'node:path';

function mulberry32(seed = 0xDEC0DE) {
  let state = seed >>> 0;
  return function () {
    let t = (state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createWavHeader(numSamples, sampleRate = 44100, numChannels = 2, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const subChunk2Size = numSamples * numChannels * (bitsPerSample / 8);
  const chunkSize = 36 + subChunk2Size;

  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(subChunk2Size, 40);
  return buffer;
}

function generateWhoosh(duration = 0.38, seed = 0xDEC0DE, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = new Float32Array(numSamples);
  const rand = mulberry32(seed);

  let b0 = 0, b1 = 0, b2 = 0; // Low-pass filter state
  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples; // 0 to 1
    // Bell envelope
    const env = Math.sin(t * Math.PI) ** 2.2;
    // Frequency sweep: 150Hz -> 2800Hz -> 300Hz
    const cutoff = 180 + Math.sin(t * Math.PI) * 2600;
    const rc = 1.0 / (2 * Math.PI * cutoff);
    const dt = 1.0 / sampleRate;
    const alpha = dt / (rc + dt);

    const whiteNoise = rand() * 2.0 - 1.0;
    b0 = b0 + alpha * (whiteNoise - b0);
    b1 = b1 + alpha * (b0 - b1);
    b2 = b2 + alpha * (b1 - b2);

    buffer[i] = b2 * env * 1.8;
  }
  return buffer;
}

function generateImpact(duration = 0.65, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = new Float32Array(numSamples);

  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const norm = i / numSamples;
    const env = Math.exp(-t * 7.5);

    // Sub-bass pitch drop: 130Hz -> 42Hz
    const freq = 42 + 95 * Math.exp(-t * 18);
    phase += (2 * Math.PI * freq) / sampleRate;

    // Sine tone with subtle 2nd harmonic
    let val = Math.sin(phase) * 0.85 + Math.sin(phase * 2) * 0.15;
    // Soft clip
    val = Math.tanh(val * 1.6);
    buffer[i] = val * env;
  }
  return buffer;
}

function generateClick(duration = 0.06, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = new Float32Array(numSamples);
  let phase = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 85);
    // 2400Hz resonant ping
    phase += (2 * Math.PI * 2400) / sampleRate;
    buffer[i] = Math.sin(phase) * env * 0.9;
  }
  return buffer;
}

function generateRiser(duration = 2.5, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = new Float32Array(numSamples);
  let phase = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples; // 0 to 1
    const env = t ** 1.8; // exponential volume swell
    const freq = 60 + Math.pow(t, 2.2) * 1200; // 60Hz to 1260Hz
    phase += (2 * Math.PI * freq) / sampleRate;
    buffer[i] = Math.sin(phase) * env * 0.75;
  }
  return buffer;
}

function writeWavFile(outPath, monoSamples, sampleRate = 44100) {
  const numSamples = monoSamples.length;
  const header = createWavHeader(numSamples, sampleRate, 2, 16);
  const data = Buffer.alloc(numSamples * 4); // 2 channels * 2 bytes

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, monoSamples[i]));
    const intVal = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    // Left channel
    data.writeInt16LE(Math.round(intVal), i * 4);
    // Right channel
    data.writeInt16LE(Math.round(intVal), i * 4 + 2);
  }

  const fd = fs.openSync(outPath, 'w');
  fs.writeSync(fd, header);
  fs.writeSync(fd, data);
  fs.closeSync(fd);
}

// CLI Argument Parsing
function parseArgs(argv) {
  const opts = {
    type: 'whoosh',
    out: null,
    duration: null,
    seed: 0xDEC0DE,
    timeline: null,
    totalDuration: 12.0
  };
  for (const arg of argv) {
    if (arg.startsWith('--type=')) opts.type = arg.slice(7).toLowerCase();
    else if (arg.startsWith('--out=')) opts.out = arg.slice(6);
    else if (arg.startsWith('--duration=')) opts.duration = parseFloat(arg.slice(11));
    else if (arg.startsWith('--seed=')) opts.seed = parseInt(arg.slice(7), 10) || 0xDEC0DE;
    else if (arg.startsWith('--timeline=')) opts.timeline = arg.slice(11);
    else if (arg.startsWith('--totalDuration=')) opts.totalDuration = parseFloat(arg.slice(16)) || 12.0;
  }
  if (!opts.out) {
    opts.out = path.resolve(process.cwd(), `foley-${opts.type}.wav`);
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
const sampleRate = 44100;

if (opts.timeline && fs.existsSync(opts.timeline)) {
  const events = JSON.parse(fs.readFileSync(opts.timeline, 'utf8'));
  const totalSamples = Math.floor(opts.totalDuration * sampleRate);
  const masterBuffer = new Float32Array(totalSamples);

  for (const ev of events) {
    const at = ev.at || 0;
    const type = ev.type || 'click';
    const dur = ev.duration || (type === 'whoosh' ? 0.38 : type === 'impact' ? 0.6 : 0.06);

    let snippet = null;
    if (type === 'whoosh') snippet = generateWhoosh(dur, opts.seed, sampleRate);
    else if (type === 'impact' || type === 'slam') snippet = generateImpact(dur, sampleRate);
    else if (type === 'riser') snippet = generateRiser(dur, sampleRate);
    else snippet = generateClick(dur, sampleRate);

    const startSample = Math.floor(at * sampleRate);
    for (let i = 0; i < snippet.length && startSample + i < totalSamples; i++) {
      masterBuffer[startSample + i] += snippet[i] * (ev.volume || 1.0);
    }
  }

  writeWavFile(opts.out, masterBuffer, sampleRate);
  console.log(`[CME v3.0] Rendered multi-event timeline foley track -> ${opts.out} (${opts.totalDuration}s)`);
} else {
  let buffer = null;
  const dur = opts.duration || (opts.type === 'whoosh' ? 0.38 : opts.type === 'impact' ? 0.6 : opts.type === 'riser' ? 2.5 : 0.06);

  if (opts.type === 'impact' || opts.type === 'slam') {
    buffer = generateImpact(dur, sampleRate);
  } else if (opts.type === 'click') {
    buffer = generateClick(dur, sampleRate);
  } else if (opts.type === 'riser') {
    buffer = generateRiser(dur, sampleRate);
  } else {
    buffer = generateWhoosh(dur, opts.seed, sampleRate);
  }

  writeWavFile(opts.out, buffer, sampleRate);
  console.log(`[CME v3.0] Generated procedural ${opts.type} SFX -> ${opts.out} (${dur}s)`);
}
