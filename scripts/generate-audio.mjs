import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 44100;
const DURATION = 12.0;
const FPS = 60;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// Beat transition impact times (whip-pans & stamp slams)
const SUB_DROPS = [0.08, 2.36, 4.76, 7.16, 7.85, 9.56];
// Phrase accretion mechanical clicks / espresso ticks
const CLICKS = [
  0.08, 0.18, 0.42, 0.60,
  2.10, 2.36, 2.44, 2.65, 2.90,
  4.50, 4.76, 4.84, 5.05, 5.30,
  6.90, 7.16, 7.24, 7.45, 7.85,
  9.30, 9.56, 9.65, 9.90, 10.15
];

// Deterministic PRNG for hi-hat / roast crackle texture
function mulberry32(seed = 0xBEEF2026) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261024);

// Warm Specialty Coffee Chord progression (D minor 9 -> Bb maj7 -> G min7 -> A7sus4)
const CHORDS = [
  { start: 0.0, end: 2.36, freqs: [146.83, 220.0, 261.63, 329.63, 440.0] },
  { start: 2.36, end: 4.76, freqs: [116.54, 174.61, 220.0, 293.66, 392.0] },
  { start: 4.76, end: 7.16, freqs: [196.0, 233.08, 293.66, 349.23, 440.0] },
  { start: 7.16, end: 9.56, freqs: [110.0, 164.81, 220.0, 293.66, 329.63] },
  { start: 9.56, end: 12.0, freqs: [146.83, 220.0, 293.66, 369.99, 440.0] }
];

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  let sigL = 0;
  let sigR = 0;

  // 1. Warm analog pad progression
  for (const c of CHORDS) {
    if (t >= c.start && t < c.end) {
      const localT = t - c.start;
      const dur = c.end - c.start;
      const env = Math.sin(Math.min(1, localT / 0.15) * (Math.PI / 2)) * Math.pow(1 - localT / dur, 0.35);
      c.freqs.forEach((f, idx) => {
        const detune = (idx % 2 === 0 ? 1.0015 : 0.9985);
        sigL += Math.sin(2 * Math.PI * f * t) * 0.045 * env;
        sigR += Math.sin(2 * Math.PI * f * detune * t + 0.4) * 0.045 * env;
      });
    }
  }

  // 2. 125 BPM steady kinetic pulse (every 0.48s)
  const beatPeriod = 0.48;
  const beatPhase = (t % beatPeriod) / beatPeriod;
  const kickEnv = Math.exp(-beatPhase * 16);
  const kickFreq = 52 + 95 * Math.exp(-beatPhase * 28);
  const kick = Math.sin(2 * Math.PI * kickFreq * (t % beatPeriod)) * kickEnv * 0.28;
  sigL += kick;
  sigR += kick;

  // Off-beat shaker / roast bean percussive tick
  const hatPhase = ((t + beatPeriod * 0.5) % (beatPeriod * 0.5)) / (beatPeriod * 0.5);
  const hatEnv = Math.exp(-hatPhase * 38);
  const noise = (rand() * 2 - 1) * hatEnv * 0.05;
  sigL += noise * 1.1;
  sigR += noise * 0.9;

  // 3. Sub-bass impact drops on scene whip-pans & LUNAS stamp
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

  // 4. Crisp mechanical UI / caliper / telemetry clicks on phrase accretion
  for (const clickT of CLICKS) {
    const dt = t - clickT;
    if (dt >= 0 && dt < 0.045) {
      const env = Math.exp(-dt * 95);
      const tone = (Math.sin(2 * Math.PI * 1850 * dt) + 0.6 * Math.sin(2 * Math.PI * 3400 * dt)) * env * 0.22;
      sigL += tone;
      sigR += tone;
    }
  }

  // Master fade out at last 0.25s for clean loop
  const masterEnv = t > DURATION - 0.25 ? Math.max(0, (DURATION - t) / 0.25) : 1.0;
  left[i] = Math.max(-0.98, Math.min(0.98, Math.tanh((sigL * masterEnv) * 1.2)));
  right[i] = Math.max(-0.98, Math.min(0.98, Math.tanh((sigR * masterEnv) * 1.2)));
}

// Write 16-bit stereo WAV file
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
buffer.writeUInt16LE(1, 20); // PCM
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

const outWav = path.resolve('C:/Users/roedy/.gemini/antigravity/scratch/beanhubonline/promo-motion/beanhub-audio.wav');
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

fs.writeFileSync(
  path.resolve('C:/Users/roedy/.gemini/antigravity/scratch/beanhubonline/promo-motion/audio-frames.json'),
  JSON.stringify(audioFrames)
);
console.log(`Generated ${outWav} (${(buffer.length / 1024 / 1024).toFixed(2)} MB) and ${audioFrames.length} AUDIO_FRAMES.`);
