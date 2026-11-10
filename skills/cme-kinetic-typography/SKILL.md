---
name: cme-kinetic-typography
description: "Broadcast kinetic typography, phrase accretion (slam, block, multiply), Whisper AI word-level karaoke sync, and 1080p legibility enforcement / Tipografi kinetik broadcast, akresi frasa, sinkronisasi karaoke Whisper per-kata, dan penegakan keterbacaan 1080p."
author: "Roedy Rustam"
version: "5.0.0"
---

# CME Kinetic Typography & Phrase Accretion Director (v3.0)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview & Capabilities
`cme-kinetic-typography` is the specialized typography sub-skill of the **Cinematic Motion Engine**. It governs broadcast-grade typographic hierarchy, dynamic phrase accretion, character/word entrance choreography, Whisper AI word-level karaoke synchronization, and strict 1080p legibility floors.

### 1. The 3 Core Laws of Programmatic Kinetic Typography
1. **The 1080p Legibility Floor**:
   - Primary claim / Hero text: **$\ge 100\text{px}$** (e.g. `clamp(80px, 8vw, 140px)`).
   - Secondary / Explainer copy: **$\ge 48\text{px}$** (e.g. `clamp(36px, 4vw, 56px)`).
   - Metadata / Ticker / Sub-labels: Strict minimum floor of **$30\text{px}$**. Any text $< 30\text{px}$ is flagged as a slide-deck failure by the DOM telemetry gate.
2. **Hierarchy Cap ($\le 2$ Levels per Beat)**:
   - At any given beat $t$, never display more than 2 visual hierarchy tiers simultaneously. Avoid paragraph dumping.
3. **Phrase Accretion (Zero Replace Fades)**:
   - Do NOT fade out entire sentences to replace them with new sentences.
   - Accrete arguments dynamically on the continuous canvas:
     - **`slam`**: High-velocity vertical drop with back-overshoot (`ease: 'back.out(1.7)'`).
     - **`block`**: Directional wipe using animated `clip-path: inset(...)`.
     - **`multiply`**: Underline or marker accent scaling from zero width (`scaleX: 0 -> 1`).

---

### 2. Implementation Recipes with `cme-core.js`

#### A. Splitting Text & Canonical Entrances
```javascript
// Split text into wrapped words and characters
const { words, chars } = CME.text.splitText('#hero-claim');

// 1. Character Rise (skewed upward cascade)
CME.text.charRise(tl, chars, 0.45, 0.018);

// 2. Character Drop (bouncing ceiling drop)
CME.text.charDrop(tl, chars, 1.20, 0.022);

// 3. Word Mask (smooth container reveal)
CME.text.wordMask(tl, words, 2.00, 0.045);
```

#### B. Whisper AI Word-Level Karaoke Synchronization
```javascript
import { WHISPER_WORDS } from './whisper-words.js';

// Automatically builds span tags, triggers bounce pop and accent highlight at exact start timestamp
const wordElements = CME.syncWhisperTimeline(tl, '#subtitle-stream', WHISPER_WORDS, {
  accentColor: '#FF3B1D',
  normalColor: '#111318',
  bounceScale: 1.15,
  showContainerAt: 0.5
});
```

#### C. Responsive Aspect Ratio Reflow
```css
/* Container queries & clamp sizing for multi-ratio layouts */
.hero-title {
  font-size: clamp(48px, 6vw, 120px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 800;
  max-width: 90%;
  word-break: break-word;
}

/* 9:16 Vertical Reflow */
[data-ratio="9x16"] .hero-title {
  font-size: clamp(56px, 9vw, 96px);
  line-height: 1.1;
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ikhtisar & Kemampuan
`cme-kinetic-typography` adalah sub-skill khusus dari **Cinematic Motion Engine** yang mengatur hierarki tipografi siaran kelas atas, akresi frasa dinamis, koreografi kemunculan karakter/kata, sinkronisasi karaoke Whisper per-kata, serta penegakan batas minimal keterbacaan 1080p.

### Praktik Terbaik:
- Gunakan `CME.text.splitText()` untuk memecah string menjadi elemen karakter deterministik.
- Selalu pastikan ukuran font utama $\ge 100\text{px}$ dan teks terkecil $\ge 30\text{px}$.
- Integrasikan transkrip Whisper dengan `CME.syncWhisperTimeline()` agar kata yang diucapkan menyala secara otomatis sesuai suara narasi.
