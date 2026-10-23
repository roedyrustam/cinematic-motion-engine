# 🎬 Cinematic Motion Engine (Bang Motion Pro v2.0)

> **Standalone Broadcast Programmatic Motion Graphics, Kinetic Typography, Living Cartoon Stage & 60fps Video Engine for AI Agents**
> *(Antigravity · Claude Code · Cursor · OpenAI Codex · Gemini CLI)*

[![Version](https://img.shields.io/badge/version-2.0.0-orange)](https://github.com/roedyrustam/cinematic-motion-engine)
[![Engine](https://img.shields.io/badge/Engine-GSAP_3.12_%2B_Three.js_%2B_FFmpeg-34D399)](https://github.com/roedyrustam/cinematic-motion-engine)
[![Output](https://img.shields.io/badge/Output-1080p_%2F_9%3A16_%40_60fps_MP4-F5B952)](https://github.com/roedyrustam/cinematic-motion-engine)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

**Cinematic Motion Engine** is a standalone AI skill and plugin that transforms AI coding assistants into a **broadcast motion graphics studio**. Instead of generating slide-deck fade animations, it enforces **8 Mechanical Anti-PPT Structural Laws**, a continuous `#world` spatial camera rig (`into -> settle -> look -> home`), directional SVG `<feGaussianBlur>` motion blur, deterministic `D(t)` speed-ramped 3D shaders, articulated SVG character joint rigs (`J(el, tx, ty)`), automated contact-sheet visual verification, and multi-worker **60fps visually lossless MP4 export**.

### ✨ Key Features
- **Zero Slide Decks (`#world` Continuous Spatial Rig)**: Unified `6720×5880` world canvas wrapping WebGL/Three.js (`<canvas id="gl">`), SVG isometric pipelines, and DOM typography in 1:1 spatial parallax.
- **100% Frame-Deterministic**: Pure mathematical functions of `tl.time()`, `mulberry32` PRNG, and precomputed velocity integral `D(t)`. Zero `Math.random()` or `Date.now()` drift.
- **Directional SVG Motion Blur**: Dynamic `<feGaussianBlur>` (`#mb-world`) attached during high-velocity whip-pans and detached immediately upon settling for razor-sharp typography.
- **3 Production Modes & 4 Official Starters**:
  1. **Launch Opener / Brand Reel** (`assets/starter-opener.html`) — 24 Opener Concepts & 35+ Object-Carried Transitions.
  2. **Narrative Explainer** (`assets/starter-explainer.html` & `assets/starter-explainer-kolase.html`) — Voiceover `SEG`/`PARA` synchronization & Phrase Accretion (`slam`, `block`, `multiply`).
  3. **Living Cartoon Stage (`kartun-panggung`)** (`assets/starter-explainer-panggung.html`) — Articulated 2D SVG character joint rig `J(el, tx, ty)`, walk cycles, and multi-depth stage parallax.
- **Automated Visual Audit & Parallel 60fps MP4 Renderer**:
  - `scripts/snap-contact-sheet.mjs`: Captures 12 beat keyframes and stitches a high-res `contact-sheet.png`.
  - `scripts/export-video.mjs`: Spawns dedicated unthrottled headless browser workers to capture 60fps frames and muxes audio into H.264 MP4 (`-crf 12 -preset slow -tune grain`).
  - `scripts/generate-audio.mjs`: Synthesizes deterministic 44.1kHz stereo WAV soundtracks + quantized 60fps `AUDIO_FRAMES` FFT envelopes.

### 🚀 Installation

#### 1. Antigravity (AGY) — Standalone Skill or Plugin
```bash
# As a Global Standalone Skill:
git clone https://github.com/roedyrustam/cinematic-motion-engine.git ~/.gemini/config/skills/cinematic-motion-engine

# Or as a Standalone Plugin:
git clone https://github.com/roedyrustam/cinematic-motion-engine.git ~/.gemini/config/plugins/cinematic-motion-engine
```

#### 2. Claude Code / Cursor / Workspace Skill
```bash
git clone https://github.com/roedyrustam/cinematic-motion-engine.git .agents/skills/cinematic-motion-engine
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

**Cinematic Motion Engine** adalah skill dan plugin AI mandiri (*standalone*) yang mengubah asisten coding AI menjadi **studio motion graphics kelas broadcast**. Menggantikan animasi ala slide PowerPoint dengan **8 Hukum Struktural Mekanis Anti-PPT**, rig kamera dunia kontinu `#world`, *motion blur* arah SVG `<feGaussianBlur>`, shader 3D *speed-ramp* deterministik `D(t)`, rig sendi karakter kartun SVG `J(el, tx, ty)`, audit visual *contact-sheet* otomatis, dan perender paralel **MP4 60fps visually lossless**.

### 📁 Struktur Direktori
```text
cinematic-motion-engine/
├── SKILL.md                                  # Instruksi utama skill (EN / ID)
├── plugin.json                               # Manifest plugin mandiri Antigravity
├── rules/
│   └── AGENTS.md                             # Aturan aktivasi otomatis Anti-PPT
├── assets/
│   ├── starter-opener.html                   # Starter Video Opener / Brand Reel (16:9 & 9:16)
│   ├── starter-explainer.html                # Starter Video Explainer Naratif
│   ├── starter-explainer-panggung.html       # Starter Kartun Panggung Hidup (SVG Joint Rig)
│   └── starter-explainer-kolase.html         # Starter Kolase Kertas & Jurnalisme Visual
├── references/
│   ├── anti-ppt-laws.md                      # 8 Hukum Mekanis Anti-PPT & Matematika Skala 1080p
│   ├── opener-concepts.md                    # 24 Konsep Opener & 35+ Transisi Objek
│   ├── explainer-modes.md                    # 6 Mode Explainer & Akresi Frasa
│   ├── techniques-and-shaders.md             # Kamera #world, Blur SVG, & Shader D(t)
│   └── kartun-panggung-and-ae-bridge.md      # Rig Sendi J() & Bridge After Effects MCP
└── scripts/
    ├── snap-contact-sheet.mjs                # Pemotret 12 Keyframe & Penyusun Contact Sheet
    ├── export-video.mjs                      # Perender Paralel Multi-Browser 60fps ke MP4
    ├── generate-audio.mjs                    # Generator Soundtrack WAV Stereo Deterministik & FFT
    ├── vo-fft-analyzer.html                  # Penganalisis Jeda Voiceover & Kurva Audio FFT
    └── kepala-ekspresi.py                    # Generator Sprite Ekspresi Kepala Karakter
```

---

## 📜 License
MIT © Roedy Rustam
