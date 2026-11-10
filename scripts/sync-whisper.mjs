#!/usr/bin/env node
/**
 * Cinematic Motion Engine v3.0 — Whisper AI Word-Level Subtitle & Viseme Synchronizer
 * Author: Roedy Rustam
 *
 * Ingests Whisper JSON/SRT transcript files with word-level timestamps and compiles them
 * into millisecond-accurate timeline arrays for kinetic typography and character visemes.
 *
 * Usage:
 *   node scripts/sync-whisper.mjs <transcript.json|srt> [--out=whisper-words.js] [--json=whisper-words.json]
 *   node scripts/sync-whisper.mjs --demo [--out=whisper-words.js]
 */
import fs from 'node:fs';
import path from 'node:path';

function mapPhonemeToViseme(word = '') {
  const s = String(word).toLowerCase();
  if (!s || s === ' ' || s === '.' || s === ',') return 'REST';
  if (/[bmp]/.test(s)) return 'MBP';
  if (/[ln]/.test(s)) return 'LN';
  if (/[aáàäâã]/.test(s)) return 'A';
  if (/[eéèëê]/.test(s)) return 'E';
  if (/[iíìïî]/.test(s)) return 'I';
  if (/[oóòöôõ]/.test(s)) return 'O';
  if (/[uúùüû]/.test(s)) return 'U';
  return 'REST';
}

function parseWhisperJson(rawContent) {
  const parsed = JSON.parse(rawContent);
  const words = [];

  // Format 1: Faster-Whisper / OpenAI words array at root
  if (Array.isArray(parsed.words)) {
    for (const w of parsed.words) {
      words.push({
        word: (w.word || '').trim(),
        start: parseFloat(w.start || 0),
        end: parseFloat(w.end || w.start + 0.3),
        phoneme: mapPhonemeToViseme(w.word)
      });
    }
    return words;
  }

  // Format 2: Segments array with inner words
  if (Array.isArray(parsed.segments)) {
    for (const seg of parsed.segments) {
      if (Array.isArray(seg.words)) {
        for (const w of seg.words) {
          words.push({
            word: (w.word || '').trim(),
            start: parseFloat(w.start || 0),
            end: parseFloat(w.end || w.start + 0.3),
            phoneme: mapPhonemeToViseme(w.word)
          });
        }
      } else {
        // Fallback: estimate from segment text
        const segWords = (seg.text || '').trim().split(/\s+/);
        const dur = (seg.end - seg.start) / Math.max(1, segWords.length);
        segWords.forEach((word, idx) => {
          words.push({
            word,
            start: parseFloat((seg.start + idx * dur).toFixed(2)),
            end: parseFloat((seg.start + (idx + 1) * dur).toFixed(2)),
            phoneme: mapPhonemeToViseme(word)
          });
        });
      }
    }
    return words;
  }

  // Format 3: Direct array of words
  if (Array.isArray(parsed)) {
    return parsed.map((item) => ({
      word: (item.word || item.text || '').trim(),
      start: parseFloat(item.start || 0),
      end: parseFloat(item.end || item.start + 0.3),
      phoneme: mapPhonemeToViseme(item.word || item.text)
    }));
  }

  return [];
}

function generateDemoWords() {
  return [
    { word: 'Cinematic', start: 0.6, end: 1.15, phoneme: 'E' },
    { word: 'Motion', start: 1.18, end: 1.65, phoneme: 'O' },
    { word: 'Engine', start: 1.68, end: 2.15, phoneme: 'E' },
    { word: 'delivers', start: 2.35, end: 2.82, phoneme: 'I' },
    { word: 'broadcast', start: 2.86, end: 3.42, phoneme: 'A' },
    { word: 'quality', start: 3.46, end: 3.98, phoneme: 'A' },
    { word: 'programmatic', start: 4.15, end: 4.92, phoneme: 'A' },
    { word: 'video', start: 4.96, end: 5.45, phoneme: 'I' },
    { word: 'at', start: 5.48, end: 5.68, phoneme: 'A' },
    { word: '60fps', start: 5.72, end: 6.45, phoneme: 'I' }
  ];
}

function parseArgs(argv) {
  const opts = {
    input: null,
    outJs: 'whisper-words.js',
    outJson: null,
    demo: false
  };
  for (const arg of argv) {
    if (!arg.startsWith('--') && !opts.input) opts.input = arg;
    else if (arg === '--demo') opts.demo = true;
    else if (arg.startsWith('--out=')) opts.outJs = arg.slice(6);
    else if (arg.startsWith('--json=')) opts.outJson = arg.slice(7);
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

let words = [];
if (opts.demo || !opts.input) {
  console.log('[CME v3.0] No input file specified or --demo requested. Synthesizing broadcast demo Whisper array...');
  words = generateDemoWords();
} else if (fs.existsSync(opts.input)) {
  const raw = fs.readFileSync(opts.input, 'utf8');
  words = parseWhisperJson(raw);
} else {
  console.error(`[CME v3.0 Error] Input file not found: ${opts.input}`);
  process.exit(1);
}

// Write JS Module
const jsContent = `/**
 * Cinematic Motion Engine v3.0 — Whisper Word-Level Sync Array
 * Author: Roedy Rustam
 * Generated: ${new Date().toISOString()}
 */
export const WHISPER_WORDS = ${JSON.stringify(words, null, 2)};
if (typeof window !== 'undefined') {
  window.WHISPER_WORDS = WHISPER_WORDS;
}
`;
fs.writeFileSync(opts.outJs, jsContent, 'utf8');
console.log(`[CME v3.0] Compiled ${words.length} word timestamps -> ${opts.outJs}`);

if (opts.outJson) {
  fs.writeFileSync(opts.outJson, JSON.stringify(words, null, 2), 'utf8');
  console.log(`[CME v3.0] Saved JSON word timestamps -> ${opts.outJson}`);
}
