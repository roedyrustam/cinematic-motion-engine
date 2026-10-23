# Product Requirements Document (PRD) — Cinematic Motion Engine v2.1 (Vibe Motion Pro)

| Metadata | Detail |
| :--- | :--- |
| **Product Name** | Cinematic Motion Engine (Bang Motion Pro / Vibe Motion Pro v2.1) |
| **Author** | Roedy Rustam |
| **Version** | `2.1.0` (Skill Registry `4.5.0`) |
| **Status** | Approved for Full-Pillar Implementation |
| **Target Platforms** | Antigravity (AGY), Claude Code, Cursor IDE, OpenAI Codex, Gemini CLI |

---

## 1. Executive Summary & Vision
**Cinematic Motion Engine** transforms AI coding agents into an autonomous broadcast motion graphics studio. Version `2.1.0` upgrades the engine across **4 Core Pillars**:
1. **Pilar A — Autonomous CLI Audio & Voiceover Engine**: Zero-GUI procedural soundtrack synthesis (`scripts/generate-audio.mjs`) and headless CLI voiceover silence/FFT compiler (`scripts/analyze-audio.mjs`).
2. **Pilar B — Automated Anti-PPT Telemetry & Visual QA Gate**: Real-time DOM mechanical law verification embedded directly into `scripts/snap-contact-sheet.mjs` and standalone `scripts/audit-anti-ppt.mjs`.
3. **Pilar C — Multi-Codec, Multi-Ratio & Frame-Accurate Render Pipeline**: Upgraded `scripts/export-video.mjs` awaiting `seekFrame(t)`, supporting `16:9` / `9:16` / `1:1` aspect ratios, H.264 visually lossless, ProRes 4444 Alpha, and WebM VP9 Alpha.
4. **Pilar D — Complete 6-Mode Starter Arsenal, Parametric Viseme Rig & Repo Sync**: New dedicated starters for *Katalog Putih* (`assets/starter-explainer-katalog.html`) and *Sketsa Vintage* (`assets/starter-explainer-sketsa.html`), alpha-aware character head/viseme generator (`scripts/kepala-ekspresi.py`), and deterministic root-to-plugin mirroring (`scripts/sync-plugin.mjs`).

---

## 2. Functional Requirements (FR)

### FR-1: CLI Procedural Audio Generator (`scripts/generate-audio.mjs`)
- Must accept CLI flags:
  - `--out=<path.wav>` (default: `./output-audio.wav`)
  - `--frames=<path.json>` (default: `./audio-frames.json`)
  - `--duration=<seconds>` (default: `12.0`)
  - `--bpm=<number>` (default: `125`)
  - `--mood=<editorial|cyber|warm|corporate>` (default: `warm`)
  - `--drops=<csv-seconds>` (custom sub-bass impact timestamps)
  - `--clicks=<csv-seconds>` (custom mechanical UI/phrase accretion clicks)
  - `--seed=<number>` (deterministic `mulberry32` seed)
- Must output 44.1kHz 16-bit Stereo PCM `.wav` and 60fps quantized `AUDIO_FRAMES` JSON (`[bass, mid, high, onset]`).

### FR-2: Headless Voiceover & Audio FFT Compiler (`scripts/analyze-audio.mjs`)
- Must run 100% headlessly in Node.js without requiring manual browser file upload.
- Decodes `.wav` natively in pure Node.js or decodes `.mp3/.m4a/.ogg/.wav` via `ffmpeg` PCM pipe (`f32le`).
- Extracts speech segments (`SEG`), paragraph windows (`PARA`), and 60fps `AUDIO_FRAMES` `[bass, mid, high, onset]`.
- Outputs ready-to-paste JS module/snippet (`--out=vo-data.js`) and/or JSON (`--json=vo-data.json`).

### FR-3: Automated Anti-PPT DOM Linter & Contact Sheet (`scripts/snap-contact-sheet.mjs` & `scripts/audit-anti-ppt.mjs`)
- Must call `await window.OPENER.seekFrame(t)` at each beat timestamp.
- Must execute an in-browser DOM audit checking:
  1. **Law 1 (Zero Slide Fades)**: Rejects `>= 3` `<section class="scene">` containers.
  2. **Law 2 (Safe-Zone Compliance)**: Flags visible text bounding boxes overflowing the safe zone (`[160..1760] x [100..980]` on `1920x1080`, with `40px` tolerance).
  3. **Law 3 (1080p Legibility Floor & Hierarchy Cap)**: Flags any visible text node with effective computed `fontSize < 30px` and checks visible hierarchy tiers.
  4. **Law 3b (Directional Blur Detachment)**: Verifies `#world` blur is detached when camera velocity is settled.
  5. **Law 5 (Living Background Layers)**: Verifies `>= 2` background/surface layers exist.
  6. **Law 7 (`kartun-panggung` Anti-Miniature)**: When in stage mode, verifies zoom is within `[1.08, 1.95]` and active rig/prop groups `>= 10`.
- Renders visual Pass/Warn badges in `contact-sheet.png` and writes `audit-report.json`.

### FR-4: Multi-Format 60fps Video Exporter (`scripts/export-video.mjs`)
- Uses `await window.OPENER.seekFrame(t)` for deterministic `<video>` plate and WebGL synchronization.
- Supports CLI flags:
  - `--fps=<number>` (default: `60`)
  - `--workers=<number>` (default: `min(4, cpus)`)
  - `--ratio=<16x9|9x16|1x1>` (passes `?clean=1&ratio=...` to starter)
  - `--codec=<h264|prores|webm-alpha>`
  - `--audio=<audio.wav|mp3>`

### FR-5: Complete Starter Templates & Sync Tooling
- `assets/starter-explainer-katalog.html`: Isometric 3D Exploded-View Studio Catalog (`#F8F9FA`).
- `assets/starter-explainer-sketsa.html`: Cyanotype & Archival Blueprint real-time SVG stroke drawing (`stroke-dashoffset`).
- Multi-aspect ratio query handling (`?ratio=9x16`, `?ratio=1x1`) across all starters.
- `scripts/kepala-ekspresi.py`: Alpha-bounding-box aware 8-sprite generator + parametric SVG viseme rig generator.
- `scripts/sync-plugin.mjs`: Deterministic file sync between root and `skills/cinematic-motion-engine/`.

---

## 3. Non-Functional Requirements (NFR)
- **Determinism**: 100% of frame states must be pure functions of `t`, `mulberry32`, and `D(t)`. Zero `Math.random()` or `Date.now()`.
- **Zero External Runtime Bloat**: CLI scripts rely only on Node.js built-ins (`node:fs`, `node:child_process`, `node:crypto`), optional `puppeteer` / local Chrome, and `ffmpeg`.
- **Parity Invariant**: Root files and `skills/cinematic-motion-engine/` files must match 100% via SHA-256 verification.
