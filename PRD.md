# Product Requirements Document (PRD) — Cinematic Motion Engine v3.0 (Modular Broadcast Motion Studio)

| Metadata | Detail |
| :--- | :--- |
| **Product Name** | Cinematic Motion Engine (Modular Broadcast Motion Studio v3.0) |
| **Author** | Roedy Rustam |
| **Version** | `3.0.0` (Skill Registry `5.0.0`) |
| **Status** | Approved & Implemented |
| **Target Platforms** | Antigravity (AGY), Claude Code, Cursor IDE, OpenAI Codex, Windsurf, Gemini CLI |

---

## 1. Executive Summary & Vision
**Cinematic Motion Engine v3.0** transforms AI coding agents into an autonomous broadcast motion graphics studio suite. Moving beyond a single monolithic skill, version `3.0.0` establishes a **modular 6-skill architecture** alongside major deep-engine enhancements:
1. **Modular Skill Suite**: Decomposed into 6 distinct specialized skills (`cinematic-motion-engine`, `cme-kinetic-typography`, `cme-camera-rigs-3d`, `cme-cartoon-puppet-rig`, `cme-audio-reactive-foley`, and `cme-broadcast-renderer`).
2. **Whisper AI Word-Level Subtitles & Automatic Lip-Sync**: Ingests word-level timestamps (`scripts/sync-whisper.mjs`) to drive kinetic karaoke typography and 8-phoneme viseme rigs for cartoon characters.
3. **Procedural Motion Foley Engine (`scripts/generate-foley.mjs`)**: Automatic zero-dependency PCM synthesis of whip-pan whooshes, text slam impacts, UI clicks, and sub-bass drops synchronized to timeline beats.
4. **WebGPU WGSL Shaders & Physics Springs**: Modern WebGPU shaders (with WebGL2 fallback) for chromatic aberration, halation film grain, and deterministic RK4 spring dynamics integrated into `assets/cme-core.js`.
5. **Hardware-Accelerated 60fps Video Pipeline (`scripts/export-video.mjs`)**: Direct GPU hardware encoding via NVIDIA NVENC (`h264_nvenc`) and Apple Silicon VideoToolbox (`h264_videotoolbox`) with ProRes 4444 Alpha and WebM VP9.
6. **Multi-Platform Aspect Ratio Reflow**: Dynamic stage reflow engine supporting `16:9`, `9:16` (Reels/TikTok/Shorts), `1:1`, and `4:5` from a single codebase.

---

## 2. Functional Requirements (FR)

### FR-1: Modular 6-Skill Ecosystem
- **Master Orchestrator (`cinematic-motion-engine`)**: Concept design, style direction routing (12 curated styles, 24 opener concepts, 6 explainer modes), 8 Anti-PPT laws governance, and project scaffolding.
- **`cme-kinetic-typography`**: Broadcast kinetic text, phrase accretion (`slam`, `block`, `multiply`), Whisper word-level timing, variable font weight/slant sweeps, and multi-line boundary clamps.
- **`cme-camera-rigs-3d`**: Continuous spatial canvas `#world`, whip-pan transitions (`into -> settle -> look -> home`), directional SVG motion blur, monotonic speed-ramp $D(t)$, and Three.js/WebGPU camera choreography.
- **`cme-cartoon-puppet-rig`**: Articulated SVG joint rigs $J(el, tx, ty)$, 8-sprite head generator (`kepala-ekspresi.py`), and automatic phoneme-to-viseme mouth shape synchronization.
- **`cme-audio-reactive-foley`**: Procedural sound design (`generate-foley.mjs`), 60fps quantized FFT envelope analysis (`analyze-audio.mjs`), and soundtrack synthesis (`generate-audio.mjs`).
- **`cme-broadcast-renderer`**: Parallel/pipe 60fps rendering, hardware GPU encoding (`export-video.mjs`), Anti-PPT mechanical DOM linting (`audit-anti-ppt.mjs`), and 12-beat contact sheet verification (`snap-contact-sheet.mjs`).

### FR-2: Whisper AI Sync & Subtitle Engine (`scripts/sync-whisper.mjs`)
- Must accept Whisper output formats: JSON (with `words` array containing `start`, `end`, `word`) or `.srt` with word-level tags.
- Produces normalized JavaScript module or JSON payload containing:
  - Exact beat timestamps for word entrances.
  - Active duration per syllable/word.
  - Estimated phoneme class (`A`, `E`, `I`, `O`, `U`, `M/B/P`, `L/N`, `Rest`) for character viseme binding.
- Enables kinetic karaoke mode where words light up with accent colors and subtle scale bounce ($1.15\times$) at their exact timestamp.

### FR-3: Procedural Foley & SFX Generator (`scripts/generate-foley.mjs`)
- Generates 44.1kHz 16-bit Stereo PCM `.wav` without external native sound libraries.
- Supported procedural SFX types:
  - `--type=whoosh`: Exponential frequency-swept filtered noise for camera whip-pans.
  - `--type=impact`: 50Hz sub-bass sine drop with soft-clip saturation for text slams.
  - `--type=click`: High-frequency decaying click for UI accretion and number counters.
  - `--type=riser`: Monotonic pitch-accelerating build-up riser for climax sequences.
- Supports timeline-based batch generation from beat markers: `--timeline=beats.json --out=foley-track.wav`.

### FR-4: WebGPU & Spring Dynamics Runtime (`assets/cme-core.js`)
- Introduces `CME.createSpring({ mass, stiffness, damping })` providing deterministic position/velocity at any time $t$.
- Introduces `CME.createWebGPUShaderPipeline(...)` with auto-fallback to WebGL2 for post-processing effects (chromatic aberration, lens distortion, noise grain).
- Provides `CME.parseWhisperWords(...)` and `CME.mapPhonemeToViseme(...)` helper utilities.

### FR-5: GPU-Accelerated 60fps Video Exporter (`scripts/export-video.mjs`)
- Supports `--gpu=auto|nvenc|videotoolbox|cpu`.
  - Automatically tests `ffmpeg -encoders` for `h264_nvenc` and `h264_videotoolbox`.
  - Fallback to `libx264` when hardware encoders are unavailable.
- Supports multi-ratio rendering `--ratio=16x9|9x16|1x1|4x5`.
- Supports transparent alpha channels (`--codec=prores` using `prores_ks 4444` and `--codec=webm-alpha` using `libvpx-vp9`).

---

## 3. Non-Functional Requirements (NFR)
- **100% Determinism**: Every visual and audio element is a pure mathematical function of `tl.time()`, `mulberry32`, and $D(t)$. Zero random jitter or wall-clock dependence.
- **Zero Heavy Native Dependencies**: All core scripts run directly on standard Node.js $\ge 18$ with optional `ffmpeg` and local Chrome.
- **Strict Parity Invariant**: Complete SHA-256 parity between repository root and `skills/cinematic-motion-engine/` guaranteed by `npm run sync`.
- **Author Identity**: All metadata, skills, rules, and scripts consistently attribute author as **"Roedy Rustam"**.
