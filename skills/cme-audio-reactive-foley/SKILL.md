---
name: cme-audio-reactive-foley
description: "Procedural sound design, motion-synchronized foley (whoosh, slam, click, riser), and 60fps audio FFT envelope compilation / Desain suara prosedural, foley tersinkronisasi gerakan, dan kompilasi kurva amplop FFT audio 60fps."
author: "Roedy Rustam"
version: "5.0.0"
---

# CME Audio-Reactive & Procedural Foley Studio (v3.0)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview & Capabilities
`cme-audio-reactive-foley` is the sound design and audio-intelligence sub-skill of the **Cinematic Motion Engine**. It eliminates silent motion graphics and external sound library dependencies by programmatically generating custom procedural soundtracks, synthesizing tactile motion foley SFX (whip-pan whooshes, sub-bass slams, UI clicks), and compiling voiceover audio into frame-quantized 60fps FFT envelopes.

### 1. The Audio Toolset Architecture
1. **Procedural Soundtrack Synthesis (`scripts/generate-audio.mjs`)**:
   Generates a full synthesized soundtrack `.wav` file matching the timeline BPM, duration, mood (`warm`, `cyber`, `editorial`, `corporate`), and custom drop timestamps.
2. **Motion Foley Sound Designer (`scripts/generate-foley.mjs`)**:
   Synthesizes individual sound effects or multi-event timeline foley tracks in pure Node.js 16-bit PCM:
   - `--type=whoosh`: Exponential frequency-swept filtered noise for camera whip-pans.
   - `--type=impact`: 50Hz sub-bass sine drop with soft-clip saturation for text slams.
   - `--type=click`: High-frequency decaying tick for numbers and UI markers.
   - `--type=riser`: Monotonic pitch swell for dramatic builds.
3. **Headless Audio/VO Analyzer (`scripts/analyze-audio.mjs`)**:
   Processes voiceover files (`.wav`, `.mp3`, `.m4a`) to extract speech pause boundaries (`SEG`), paragraph blocks (`PARA`), and 60fps `AUDIO_FRAMES` `[bass, mid, high, onset]`.

---

### 2. Implementation Recipes

#### A. Generating Timeline-Synced Foley Effects
```bash
# Generate a whip-pan whoosh for camera transitions
node scripts/generate-foley.mjs --type=whoosh --out=whoosh.wav --duration=0.35

# Generate a sub-bass slam for title reveals
node scripts/generate-foley.mjs --type=impact --out=slam.wav --duration=0.65

# Render an entire timeline of mixed foley events
node scripts/generate-foley.mjs --timeline=foley-beats.json --out=foley-master.wav --totalDuration=10.0
```

#### B. Driving Visuals from 60fps Audio Envelopes
In client code (`starter-*.html`), read quantized frequency bands dynamically without runtime Web Audio overhead:
```javascript
// Sample 60fps audio data at current timeline second t
tl.to({}, {
  duration: DURATION,
  onUpdate: () => {
    const t = tl.time();
    const { bass, mid, high, onset } = CME.sampleAudio(t);

    // Pulse background grid from bass
    gridMesh.scale.setScalar(1.0 + bass * 0.12);

    // Accentuate lighting on beat drop onset
    if (onset > 0.8) {
      glowElement.style.opacity = '1.0';
    } else {
      glowElement.style.opacity = '0.2';
    }
  }
}, 0);
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ikhtisar & Kemampuan
`cme-audio-reactive-foley` menyediakan modul sintesis audio prosedural deterministik (WAV 44.1kHz), generator efek suara foley taktil (whoosh kamera, dentuman sub-bass, klik UI), dan analisis amplop FFT audio 60fps untuk menggerakkan visual reaktif.

### Panduan Desain Suara:
- Selalu sinkronkan efek foley *whoosh* dengan momen awal akselerasi kamera (`into`).
- Pasangkan efek foley *impact/slam* saat teks judul jatuh menghentak kanvas (`CME.text.slam`).
