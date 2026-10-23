#!/usr/bin/env node
/**
 * Cinematic Motion Engine v2.1 — Deterministic Procedural Soundtrack & 60fps FFT Generator
 *
 * Usage:
 *   node scripts/generate-audio.mjs [options]
 *
 * Options:
 *   --out=<path.wav>       Output 44.1kHz 16-bit Stereo WAV path (default: ./output-audio.wav)
 *   --frames=<path.json>   Output 60fps AUDIO_FRAMES JSON path (default: ./audio-frames.json)
 *   --js=<path.js>         Optional JS file exporting window.AUDIO_FRAMES
 *   --duration=<seconds>   Total duration in seconds (default: 10.0)
 *   --bpm=<number>         Tempo in BPM (default: 125)
 *   --mood=<preset>        Harmonic mood preset: warm | cyber | editorial | corporate (default: warm)
 *   --drops=<csv>          Comma-separated sub-bass impact timestamps (e.g. --drops=0.1,2.65,5.65,8.4)
 *   --clicks=<csv>         Comma-separated mechanical UI click timestamps
 *   --seed=<number>        Deterministic Mulberry32 PRNG seed (default: 20261024)
 */
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const opts = {
    out: './output-audio.wav',
    frames: './audio-frames.json',
    js: null,
    duration: 10.0,
    bpm: 125,
    mood: 'warm',
    drops: null,
    clicks: null,
    fps: 60,
    seed: 20261024
  };

  for (const arg of argv) {
    if (arg.startsWith('--out=')) opts.out = arg.slice(6);
    else if (arg.startsWith('--frames=')) opts.frames = arg.slice(9);
    else if (arg.startsWith('--js=')) opts.js = arg.slice(5);
    else if (arg.startsWith('--duration=')) opts.duration = Math.max(1, parseFloat(arg.slice(11)) || 10.0);
    else if (arg.startsWith('--bpm=')) opts.bpm = Math.max(40, Math.min(240, parseFloat(arg.slice(6)) || 125));
    else if (arg.startsWith('--mood=')) opts.mood = arg.slice(7).toLowerCase();
    else if (arg.startsWith('--drops=')) {
      opts.drops = arg
        .slice(8)
        .split(',')
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !Number.isNaN(n));
    } else if (arg.startsWith('--clicks=')) {
      opts.clicks = arg
        .slice(9)
        .split(',')
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !Number.isNaN(n));
    } else if (arg.startsWith('--fps=')) {
      opts.fps = Math.max(24, Math.min(120, parseInt(arg.slice(6), 10) || 60));
    } else if (arg.startsWith('--seed=')) {
      opts.seed = parseInt(arg.slice(7), 10) || 20261024;
    }
  }
  return opts;
}

function mulberry32(seed = 0xBEEF2026) {
  let state = seed >>> 0;
  return function () {
    let t = (state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MOOD_PALETTES = {
  warm: {
    // D minor 9 -> Bb maj7 -> G min7 -> A7sus4
    chords: [
      [146.83, 220.0, 261.63, 329.63, 440.0],
      [116.54, 174.61, 220.0, 293.66, 392.0],
      [196.0, 233.08, 293.66, 349.23, 440.0],
      [110.0, 164.81, 220.0, 293.66, 329.63]
    ],
    padGain: 0.045,
    kickGain: 0.28,
    clickFreqs: [1850, 3400]
  },
  cyber: {
    // Phrygian dark tech: E1/E2 power bass + minor 2nd tension
    chords: [
      [82.41, 164.81, 246.94, 329.63, 392.0],
      [87.31, 174.61, 261.63, 349.23, 440.0],
      [73.42, 146.83, 220.0, 293.66, 369.99],
      [82.41, 164.81, 246.94, 311.13, 392.0]
    ],
    padGain: 0.052,
    kickGain: 0.34,
    clickFreqs: [2400, 4800]
  },
  editorial: {
    // Warm cinema fourths / modal jazz (C maj9 -> F maj7#11 -> D min9 -> G13sus)
    chords: [
      [130.81, 196.0, 246.94, 293.66, 392.0],
      [174.61, 220.0, 261.63, 329.63, 369.99],
      [146.83, 220.0, 261.63, 329.63, 440.0],
      [196.0, 261.63, 329.63, 392.0, 493.88]
    ],
    padGain: 0.048,
    kickGain: 0.22,
    clickFreqs: [1420, 2840]
  },
  corporate: {
    // Crisp optimistic studio (A add9 -> F#m7 -> D maj9 -> E6)
    chords: [
      [110.0, 220.0, 277.18, 329.63, 493.88],
      [92.5, 185.0, 220.0, 277.18, 329.63],
      [146.83, 220.0, 277.18, 329.63, 369.99],
      [164.81, 246.94, 329.63, 415.3, 493.88]
    ],
    padGain: 0.044,
    kickGain: 0.25,
    clickFreqs: [2100, 4200]
  }
};

function buildDefaultDrops(duration) {
  const step = Math.max(2.0, duration / 4);
  const drops = [0.08];
  for (let t = step; t < duration - 0.8; t += step) {
    drops.push(Number(t.toFixed(2)));
  }
  return drops;
}

function buildDefaultClicks(drops, duration) {
  const clicks = [];
  for (const d of drops) {
    for (const offset of [0.0, 0.12, 0.34, 0.56]) {
      if (d + offset < duration - 0.2) {
        clicks.push(Number((d + offset).toFixed(2)));
      }
    }
  }
  return clicks;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const SAMPLE_RATE = 44100;
  const DURATION = opts.duration;
  const FPS = opts.fps;
  const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

  const palette = MOOD_PALETTES[opts.mood] || MOOD_PALETTES.warm;
  const SUB_DROPS = opts.drops && opts.drops.length ? opts.drops : buildDefaultDrops(DURATION);
  const CLICKS = opts.clicks && opts.clicks.length ? opts.clicks : buildDefaultClicks(SUB_DROPS, DURATION);
  const rand = mulberry32(opts.seed);

  const chordSlotDur = DURATION / palette.chords.length;
  const CHORDS = palette.chords.map((freqs, idx) => ({
    start: idx * chordSlotDur,
    end: (idx + 1) * chordSlotDur,
    freqs
  }));

  const left = new Float32Array(TOTAL_SAMPLES);
  const right = new Float32Array(TOTAL_SAMPLES);
  const beatPeriod = 60.0 / opts.bpm;

  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let sigL = 0;
    let sigR = 0;

    // 1. Harmonic pad progression
    for (const c of CHORDS) {
      if (t >= c.start && t < c.end) {
        const localT = t - c.start;
        const dur = c.end - c.start;
        const env = Math.sin(Math.min(1, localT / 0.15) * (Math.PI / 2)) * Math.pow(Math.max(0, 1 - localT / dur), 0.35);
        c.freqs.forEach((f, idx) => {
          const detune = idx % 2 === 0 ? 1.0015 : 0.9985;
          sigL += Math.sin(2 * Math.PI * f * t) * palette.padGain * env;
          sigR += Math.sin(2 * Math.PI * f * detune * t + 0.4) * palette.padGain * env;
        });
      }
    }

    // 2. Steady BPM kinetic pulse
    const beatPhase = (t % beatPeriod) / beatPeriod;
    const kickEnv = Math.exp(-beatPhase * 16);
    const kickFreq = 52 + 95 * Math.exp(-beatPhase * 28);
    const kick = Math.sin(2 * Math.PI * kickFreq * (t % beatPeriod)) * kickEnv * palette.kickGain;
    sigL += kick;
    sigR += kick;

    // Off-beat shaker / percussive texture
    const hatPhase = ((t + beatPeriod * 0.5) % (beatPeriod * 0.5)) / (beatPeriod * 0.5);
    const hatEnv = Math.exp(-hatPhase * 38);
    const noise = (rand() * 2 - 1) * hatEnv * 0.048;
    sigL += noise * 1.1;
    sigR += noise * 0.9;

    // 3. Sub-bass impact drops on camera whip-pans & hero slams
    for (const dropT of SUB_DROPS) {
      const dt = t - dropT;
      if (dt >= 0 && dt < 0.65) {
        const env = Math.exp(-dt * 6.5);
        const f = 44 + 130 * Math.exp(-dt * 18);
        const sub = Math.sin(2 * Math.PI * f * dt) * env * 0.48;
        sigL += sub;
        sigR += sub;
      }
    }

    // 4. Mechanical UI / phrase accretion clicks
    for (const clickT of CLICKS) {
      const dt = t - clickT;
      if (dt >= 0 && dt < 0.045) {
        const env = Math.exp(-dt * 95);
        const [f1, f2] = palette.clickFreqs;
        const tone = (Math.sin(2 * Math.PI * f1 * dt) + 0.6 * Math.sin(2 * Math.PI * f2 * dt)) * env * 0.22;
        sigL += tone;
        sigR += tone;
      }
    }

    // Master fade-out over final 0.25s for clean loop
    const masterEnv = t > DURATION - 0.25 ? Math.max(0, (DURATION - t) / 0.25) : 1.0;
    left[i] = Math.max(-0.98, Math.min(0.98, Math.tanh(sigL * masterEnv * 1.2)));
    right[i] = Math.max(-0.98, Math.min(0.98, Math.tanh(sigR * masterEnv * 1.2)));
  }

  // Write 16-bit Stereo PCM WAV
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = TOTAL_SAMPLES * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const sL = Math.max(-32768, Math.min(32767, Math.floor(left[i] * 32767)));
    const sR = Math.max(-32768, Math.min(32767, Math.floor(right[i] * 32767)));
    buffer.writeInt16LE(sL, offset);
    buffer.writeInt16LE(sR, offset + 2);
    offset += 4;
  }

  const outWav = path.resolve(opts.out);
  fs.mkdirSync(path.dirname(outWav), { recursive: true });
  fs.writeFileSync(outWav, buffer);

  // Compute 60fps quantized AUDIO_FRAMES: [bass, mid, high, onset]
  const totalFrames = Math.ceil(DURATION * FPS);
  const samplesPerFrame = Math.floor(SAMPLE_RATE / FPS);
  const audioFrames = [];

  for (let f = 0; f < totalFrames; f++) {
    const t = f / FPS;
    let rms = 0;
    const startSample = f * samplesPerFrame;
    for (let s = 0; s < samplesPerFrame && startSample + s < TOTAL_SAMPLES; s++) {
      const v = (left[startSample + s] + right[startSample + s]) * 0.5;
      rms += v * v;
    }
    rms = Math.sqrt(rms / samplesPerFrame);
    const isDrop = SUB_DROPS.some((d) => Math.abs(t - d) < 0.08);
    const bass = Math.min(100, Math.round(rms * 260 + (isDrop ? 45 : 0)));
    const mid = Math.min(100, Math.round(rms * 190));
    const high = Math.min(100, Math.round(rms * 140));
    const onset = isDrop ? 1 : 0;
    audioFrames.push([bass, mid, high, onset]);
  }

  const outFrames = path.resolve(opts.frames);
  fs.mkdirSync(path.dirname(outFrames), { recursive: true });
  fs.writeFileSync(outFrames, JSON.stringify(audioFrames));

  if (opts.js) {
    const outJs = path.resolve(opts.js);
    fs.mkdirSync(path.dirname(outJs), { recursive: true });
    fs.writeFileSync(
      outJs,
      `// Generated by Cinematic Motion Engine v2.1 (mood=${opts.mood}, bpm=${opts.bpm}, duration=${DURATION}s)\nwindow.AUDIO_FRAMES = ${JSON.stringify(audioFrames)};\n`
    );
  }

  console.log(
    `[AUDIO] Generated ${outWav} (${(buffer.length / 1024 / 1024).toFixed(2)} MB, mood=${opts.mood}, bpm=${opts.bpm}) and ${audioFrames.length} frames -> ${outFrames}`
  );
}

main();
