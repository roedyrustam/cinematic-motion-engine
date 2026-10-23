# 🎬 Cinematic Motion Engine (Bang Motion Pro v2.1)

> **Standalone Broadcast Programmatic Motion Graphics, Kinetic Typography, Living Cartoon Stage & 60fps Video Engine for AI Agents**
> *(Antigravity · Claude Code · Cursor · OpenAI Codex · Gemini CLI)*

[![Version](https://img.shields.io/badge/version-2.1.0-orange)](https://github.com/roedyrustam/cinematic-motion-engine)
[![Engine](https://img.shields.io/badge/Engine-GSAP_3.12_%2B_Three.js_%2B_FFmpeg-34D399)](https://github.com/roedyrustam/cinematic-motion-engine)
[![Output](https://img.shields.io/badge/Output-1080p_%2F_9%3A16_%40_60fps_MP4_ProRes_WebM-F5B952)](https://github.com/roedyrustam/cinematic-motion-engine)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

**Cinematic Motion Engine** is a standalone AI skill and plugin that transforms AI coding assistants into a **broadcast motion graphics studio**. Instead of generating slide-deck fade animations, it enforces **8 Mechanical Anti-PPT Structural Laws**, a continuous `#world` spatial camera rig (`into -> settle -> look -> home`), directional SVG `<feGaussianBlur>` motion blur, deterministic `D(t)` speed-ramped 3D shaders, articulated SVG character joint rigs (`J(el, tx, ty)`), automated Anti-PPT DOM telemetry & contact-sheet verification, and multi-worker / zero-disk pipe **60fps visually lossless MP4 / ProRes 4444 / WebM Alpha export**.

### ✨ Key Features (v2.1 Upgrade)
- **Zero Slide Decks (`#world` Continuous Spatial Rig)**: Unified `4720×3880` world canvas wrapping WebGL/Three.js (`<canvas id="gl">`), SVG isometric pipelines, and DOM typography in 1:1 spatial parallax.
- **100% Frame-Deterministic**: Pure mathematical functions of `tl.time()`, `mulberry32` PRNG, and precomputed velocity integral `D(t)`. Zero `Math.random()` or `Date.now()` drift.
- **Directional SVG Motion Blur**: Dynamic `<feGaussianBlur>` (`#mb-world`) attached during high-velocity whip-pans and detached immediately upon settling for razor-sharp typography.
- **3 Production Modes & 6 Official Starters**:
  1. **Launch Opener / Brand Reel** (`assets/starter-opener.html`) — 24 Opener Concepts & 35+ Object-Carried Transitions.
  2. **Narrative Explainer — Aksi Kontinu** (`assets/starter-explainer.html`) — Voiceover `SEG`/`PARA` synchronization & Phrase Accretion (`slam`, `block`, `multiply`).
  3. **Narrative Explainer — Kartun Kolase & Jurnalisme Visual** (`assets/starter-explainer-kolase.html`) — Tactile paper cutouts, `steps(4)` stop-motion, highlighter sweeps, and red yarn evidence boards.
  4. **Narrative Explainer — Katalog Putih 3D** (`assets/starter-explainer-katalog.html`) — Pure studio cyclorama (`#F8F9FA`) with 3D Isometric Exploded-View layer stacks.
  5. **Narrative Explainer — Sketsa Vintage Blueprint** (`assets/starter-explainer-sketsa.html`) — Cyanotype blueprint grid with live SVG `stroke-dashoffset` schematic drawing.
  6. **Living Cartoon Stage (`kartun-panggung`)** (`assets/starter-explainer-panggung.html`) — Articulated 2D SVG character joint rig `J(el, tx, ty)`, walk cycles, and multi-depth stage parallax.
- **Autonomous CLI Audio, Anti-PPT Telemetry & 60fps Renderer**:
  - `scripts/generate-audio.mjs`: CLI procedural stereo WAV & 60fps `AUDIO_FRAMES` synthesizer (`--mood=warm|cyber|editorial|corporate`, `--bpm`, `--duration`, `--drops`).
  - `scripts/analyze-audio.mjs`: Headless CLI voiceover silence (`SEG`/`PARA`) & 60fps FFT compiler for `.wav/.mp3/.m4a`.
  - `scripts/snap-contact-sheet.mjs`: Captures 12 beat keyframes, runs in-browser Anti-PPT DOM telemetry checks (`audit-report.json`), and stitches a labeled `contact-sheet.png`.
  - `scripts/audit-anti-ppt.mjs`: Fast static & structural Anti-PPT 8-Law linter (`npm run audit`).
  - `scripts/export-video.mjs`: Spawns dedicated browser workers or streams via `--pipe` (`image2pipe`) into FFmpeg (`--codec=h264|prores|webm-alpha`, `--ratio=16x9|9x16|1x1`).
  - `scripts/kepala-ekspresi.py`: Alpha-bounding-box aware 8-expression character head sprite generator + parametric `viseme-rig.svg`.
  - `scripts/sync-plugin.mjs`: Deterministic SHA-256 synchronizer between root and `skills/cinematic-motion-engine/`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

**Cinematic Motion Engine (v2.1)** adalah skill dan plugin AI mandiri (*standalone*) yang mengubah asisten coding AI menjadi **studio motion graphics kelas broadcast**. Menggantikan animasi ala slide PowerPoint dengan **8 Hukum Struktural Mekanis Anti-PPT**, rig kamera dunia kontinu `#world`, *motion blur* arah SVG `<feGaussianBlur>`, shader 3D *speed-ramp* deterministik `D(t)`, rig sendi karakter kartun SVG `J(el, tx, ty)`, audit telemetri DOM & *contact-sheet* otomatis, serta perender paralel **MP4 / ProRes 4444 / WebM Alpha 60fps**.

### 📁 Struktur Direktori
```text
cinematic-motion-engine/
├── SKILL.md                                  # Instruksi utama skill (EN / ID)
├── PRD.md                                    # Dokumen Kebutuhan Produk v2.1
├── BLUEPRINT.md                              # Cetak Biru Arsitektur & MADR Decision Log
├── plugin.json                               # Manifest plugin mandiri Antigravity
├── rules/
│   └── AGENTS.md                             # Aturan aktivasi otomatis Anti-PPT
├── assets/
│   ├── starter-opener.html                   # Starter Video Opener / Brand Reel (16:9, 9:16, 1:1)
│   ├── starter-explainer.html                # Starter Explainer Aksi Kontinu
│   ├── starter-explainer-panggung.html       # Starter Kartun Panggung Hidup (SVG Joint Rig)
│   ├── starter-explainer-kolase.html         # Starter Kolase Kertas & Jurnalisme Visual
│   ├── starter-explainer-katalog.html        # Starter Katalog Putih & 3D Isometric Exploded View
│   └── starter-explainer-sketsa.html         # Starter Sketsa Vintage & Cyanotype Blueprint
├── references/
│   ├── anti-ppt-laws.md                      # 8 Hukum Mekanis Anti-PPT & Matematika Skala 1080p
│   ├── opener-concepts.md                    # 24 Konsep Opener & 35+ Transisi Objek
│   ├── explainer-modes.md                    # 6 Mode Explainer & Akresi Frasa
│   ├── techniques-and-shaders.md             # Kamera #world, Blur SVG, & Shader D(t)
│   └── kartun-panggung-and-ae-bridge.md      # Rig Sendi J() & Bridge After Effects MCP
└── scripts/
    ├── snap-contact-sheet.mjs                # Pemotret 12 Keyframe + Penyusun Contact Sheet + DOM Linter
    ├── audit-anti-ppt.mjs                    # Linter Statis & Struktural 8 Hukum Anti-PPT
    ├── export-video.mjs                      # Perender 60fps (Multi-Worker / Zero-Disk Pipe / Multi-Codec)
    ├── generate-audio.mjs                    # CLI Generator Soundtrack WAV Stereo & AUDIO_FRAMES
    ├── analyze-audio.mjs                     # CLI Penganalisis Jeda Voiceover (SEG/PARA) & FFT 60fps
    ├── vo-fft-analyzer.html                  # Penganalisis Jeda Voiceover & Kurva Audio FFT (Browser GUI)
    ├── kepala-ekspresi.py                    # Generator 8 Sprite Ekspresi Kepala + SVG Viseme Rig
    └── sync-plugin.mjs                       # Sinkronisator SHA-256 Root <-> skills/cinematic-motion-engine
```

---

## 📜 License
MIT © Roedy Rustam
