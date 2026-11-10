---
name: cinematic-motion-engine
description: "Modular broadcast programmatic motion graphics studio suite, kinetic typography, WebGPU shaders, living cartoon stage, Whisper AI lip-sync, procedural foley & 60fps GPU-accelerated video engine (Bang Motion Pro v3.0). Orchestrates 5 specialized sub-skills (cme-kinetic-typography, cme-camera-rigs-3d, cme-cartoon-puppet-rig, cme-audio-reactive-foley, cme-broadcast-renderer) / Suite studio motion graphics broadcast modular, tipografi kinetik, shader WebGPU, panggung kartun hidup, lip-sync AI Whisper, foley prosedural, dan mesin video 60fps terakselerasi GPU."
author: "Roedy Rustam"
version: "5.0.0"
---

# Cinematic Motion Engine & Broadcast Video Architect (Bang Motion Pro v3.0)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

## Orchestration & Modular Suite Architecture
Operates as a **Modular Broadcast Motion Graphics Studio Suite** (`cinematic-motion-engine`) by **Roedy Rustam**. Version 3.0 decomposes the engine into **1 Master Orchestrator + 5 Specialized Domain Sub-Skills**:

| Skill Name | Role & Core Scope | Key Tooling & Starters |
| :--- | :--- | :--- |
| **`cinematic-motion-engine`** *(Master)* | Master concept design, 8 Anti-PPT laws governance, style brief routing (12 styles, 24 opener concepts, 6 explainer modes), one-command scaffolding. | `scripts/scaffold-video.mjs`, `assets/cme-core.js`, 6 starters |
| **`cme-kinetic-typography`** | Broadcast typography, phrase accretion (`slam`, `block`, `multiply`), Whisper AI word-level karaoke sync, 1080p legibility floors ($\ge 100\text{px}$ hero, $\ge 30\text{px}$ min). | `cme-core.js` (text engines), `starter-explainer.html` |
| **`cme-camera-rigs-3d`** | Continuous spatial canvas `#world`, 4-phase camera flight (`into -> settle -> look -> home`), directional SVG motion blur, monotonic speed-ramp $D(t)$, WebGPU/Three.js rigs. | `starter-opener.html`, `cme-core.js` (camera rigs) |
| **`cme-cartoon-puppet-rig`** | 2D articulated SVG character rigs $J(el, tx, ty)$, parametric walk cycles, 8-sprite head generator, phoneme-to-viseme mouth lip-sync. | `scripts/kepala-ekspresi.py`, `starter-explainer-panggung.html` |
| **`cme-audio-reactive-foley`** | Procedural sound design (whooshes, sub-bass slams, UI clicks, risers), procedural music synthesis, 60fps audio FFT envelope compilation. | `scripts/generate-foley.mjs`, `scripts/generate-audio.mjs`, `scripts/analyze-audio.mjs` |
| **`cme-broadcast-renderer`** | Frame-accurate 60fps headless render pipeline, GPU hardware encoding (NVENC / VideoToolbox), ProRes 4444 Alpha, Anti-PPT DOM telemetry QA gate. | `scripts/export-video.mjs`, `scripts/audit-anti-ppt.mjs`, `scripts/snap-contact-sheet.mjs` |

---

### 1. Core Philosophy & The 4 Sovereign Laws of Programmatic Motion

Most code-generated videos fail because they behave like **animated PowerPoint slides** (`<section class="scene">` fading in and out over a passive background). **Cinematic Motion Engine v3.0** enforces an uncompromising broadcast motion studio architecture in pure code (HTML/CSS/SVG + GSAP 3.12 + Three.js / WebGPU + Puppeteer + FFmpeg):

1. **Law I — Continuous Spatial World (Zero Slide Decks)**:
   - Never toggle isolated `<section class="scene">` blocks with `opacity` or `autoAlpha` (`>= 3` scene fades = instant rejection).
   - Every video is either **One Continuous Hero** morphing across the timeline (*Aksi Kontinu*) or **One Unified World Canvas** (`#world` with `inset: -1400px`) where landmarks live at real coordinates `(wx, wy)` and the camera physically travels between them (`into -> settle -> look -> home`).
2. **Law II — 100% Frame-Deterministic Time Function**:
   - Every visual and audio state — DOM transforms, SVG joint rotations, Three.js / WebGPU shader uniforms, particle positions, and audio-reactive pulses — MUST be a pure mathematical function of `tl.time()`.
   - **Strictly Forbidden in Render Loops**: `Date.now()`, `performance.now()`, `Math.random()`, `requestAnimationFrame` delta accumulation, CSS `@keyframes`, or `setInterval`.
   - Use a deterministic **PRNG (`mulberry32`)** for particle/collage seeding and a precomputed **Speed-Ramp Distance Integral `D(t)`** so camera flight and shaders never jump or run backward when velocity decelerates.
3. **Law III — Physical Camera & Directional Motion Blur**:
   - The camera rig (`#world` wrapping **both** `<canvas id="gl">` and `<div id="dom">`) moves with continuous velocity: whip-pan (`into`, `expo.in`, `0.26s`) -> overshoot/settle (`settle`, `expo.out`, `0.28s`) -> slow drift (`look`, `sine.inOut`) -> wide return (`home`).
   - Fast movements (>600px in <0.30s) attach a **Directional SVG `<feGaussianBlur>` filter** (`stdDeviation="dx, dy"`, filter region `x="-70%" y="-70%" width="240%" height="240%"`) during the fast flight and **detach (`filter: none`) immediately upon settling** so typography remains razor-sharp while read.
4. **Law IV — Anti-Template Concept & Visual Verification Gate**:
   - Never reuse a fixed layout skeleton across videos. Before writing code, produce a **Style Brief** proposing 3 distinct concepts from the **24 Opener Concepts** and **12 Style Directions**, declaring a 5-part **Structural Fingerprint**:
     `concept · scene count · primary object per scene · opening mechanism · closing mechanism`
   - Never deliver uninspected code: render keyframes via `scripts/snap-contact-sheet.mjs --strict` and inspect every beat via `audit-report.json` and `contact-sheet.png` for text contrast, clipping, composition balance, and motion continuity.

---

### 2. Category Router: Choosing the Right Production Architecture

Classify every user request into one of **3 Production Modes** before selecting a starter from `assets/`:

| Production Mode | Trigger Signals | Core Architecture & Starter | Duration & Audio |
| :--- | :--- | :--- | :--- |
| **1. Launch Opener / Brand Reel** | "opener", "launch video", "brand intro", "kinetic reel", "product teaser", "bumper", "sizzle reel" | `assets/starter-opener.html` — High-energy kinetic typography, 24 Opener Concepts, speed-ramped `D(t)` 3D/shader canvas, max 2 canonical UI components. | 10s – 45s. Music/beat-driven (`AUDIO_FRAMES` FFT beat sync) or procedural foley. |
| **2. Narrative Explainer (5 Visual Styles)** | "explainer", "infographic video", "how it works", "educational", "journalism", "data story", "sketch" | `assets/starter-explainer.html` or style-specific starter (`kolase`, `jurnalisme`, `katalog`, `sketsa`). Synchronized to voiceover segments (`SEG` / `PARA`), Whisper word karaoke, continuous camera world. | 30s – 180s. Voiceover analyzed via `scripts/sync-whisper.mjs` & `scripts/analyze-audio.mjs`. |
| **3. Living Cartoon Stage (`kartun-panggung`)** | "cartoon", "character animation", "living stage", "story animation", "kids story", "dialogue scene", "2D rig" | `assets/starter-explainer-panggung.html` — Zero captions on stage, multi-stage camera cuts (`zoom 1.08–1.95`), `>= 10` moving props/characters, manual SVG joint rig `J(el, tx, ty)`, phoneme viseme lip-sync. | 30s – 180s. Voiceover / dialogue + procedural foley. |

---

### 3. The 8 Mechanical Anti-PPT Structural Laws (Hard Rejects)

1. **Ban `<section class="scene">` Opacity Toggling**:
   - Do not stack full-screen scenes and fade them with `autoAlpha` / `opacity`. Use `#world` spatial coordinates `(x, y)` or stage cuts with living character choreography.
2. **Enforce Fixed Stage + Responsive Safe-Zone Scaling**:
   - Stage dimensions support `16:9` (`1920x1080`), `9:16` (`1080x1920`), `1:1` (`1080x1080`), and `4:5` (`1080x1350`).
   - All key content in 16:9 stays inside `[160..1760] x [100..980]`.
3. **Enforce the 1080p Legibility Floor & 2-Level Text Cap**:
   - Maximum **2 text hierarchy levels** visible simultaneously per beat.
   - Minimum font sizes at 1080p:
     - **Hero Display / Big Claim**: `>= 100px` (`font-weight: 700–900`)
     - **Handwriting / Callout**: `>= 48px`
     - **Body / Subtitle Claim**: `>= 44px`
     - **World Coordinate Label / Tag**: `>= 34px`
     - **Micro Credit / Corner Metadata**: `>= 30px` (nothing smaller than `30px` is permitted).
4. **Enforce Phrase Accretion (`3–5` Elements per Beat)**:
   - Break key claims into **3 to 5 distinct typographic/visual blocks** that accrete sequentially (`slam`, `block`, `multiply`), then clear together when transitioning.
5. **Enforce Living Background Motion Language (`>= 2` Surface Layers)**:
   - Combine at least **2 surface layers**: (a) Deterministic SVG `<feTurbulence>` or WebGPU/Three.js shader field + (b) Moving coordinate grid, topographic lines, halftone matrix, or parallax cutouts.
6. **Enforce Unified `#world` Wrapping Canvas + DOM Together**:
   - `<div id="world">` MUST wrap **both** the WebGL/WebGPU `<canvas>` and `<div id="dom">`.
7. **Enforce SVG Joint Rig Discipline (`J(el, tx, ty)`)**:
   - Separate static placement group `<g transform="translate(X,Y)">` from animated limb `<g id="limb">`. Drive joints via `J(el, tx, ty)` around `(0, 0)`.
8. **Enforce Clean Player-Free Delivery & `window.OPENER` Automation Contract**:
   - `?clean=1` pauses at `t = 0` for headless frame capture via `window.OPENER = { W, H, DURATION, FPS, tl, ready, seek(t), seekFrame(t), clipsReady(), play() }`.

---

### 4. Complete File, Tool & Starter Index

- `skills/cme-kinetic-typography/SKILL.md` — Kinetic typography, phrase accretion, Whisper karaoke sync.
- `skills/cme-camera-rigs-3d/SKILL.md` — `#world` camera rigs, directional blur, $D(t)$ speed-ramps, WebGPU shaders.
- `skills/cme-cartoon-puppet-rig/SKILL.md` — Articulated SVG character rigging, walk cycles, viseme lip-sync.
- `skills/cme-audio-reactive-foley/SKILL.md` — Procedural audio synthesis, motion foley SFX, 60fps FFT curves.
- `skills/cme-broadcast-renderer/SKILL.md` — 60fps GPU-accelerated video export, ProRes 4444, Anti-PPT DOM gate.
- `assets/cme-core.js` — Universal deterministic runtime (`window.CME`).
- `assets/starter-*.html` — 6 official production starters (`opener`, `explainer`, `panggung`, `kolase`, `katalog`, `sketsa`).
- `scripts/scaffold-video.mjs` — One-command project scaffolder (`npm run scaffold`).
- `scripts/generate-foley.mjs` — Procedural motion foley generator (`npm run foley`).
- `scripts/sync-whisper.mjs` — Whisper word-level timing & viseme compiler (`npm run whisper`).
- `scripts/export-video.mjs` — Multi-worker GPU-accelerated 60fps exporter (`npm run export`).
- `scripts/audit-anti-ppt.mjs` — Mechanical Anti-PPT 8-law static linter (`npm run audit`).
- `scripts/snap-contact-sheet.mjs` — 12-beat keyframe capturer + DOM telemetry report (`npm run snap`).
- `scripts/sync-plugin.mjs` — Deterministic SHA-256 synchronizer (`npm run sync`).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

## Arsitektur Suite Modular & Orkestrasi
Beroperasi sebagai **Suite Studio Motion Graphics Broadcast Modular** (`cinematic-motion-engine`) karya **Roedy Rustam**. Versi 3.0 memecah engine menjadi **1 Master Orchestrator + 5 Sub-Skill Domain Spesialis**:
1. **`cinematic-motion-engine`** *(Master)*: Desain konsep, penegakan 8 hukum Anti-PPT, routing style brief, dan perancah proyek.
2. **`cme-kinetic-typography`**: Tipografi siaran kelas atas, akresi frasa (`slam`, `block`, `multiply`), sinkronisasi karaoke Whisper per-kata, batas minimal ukuran huruf 1080p.
3. **`cme-camera-rigs-3d`**: Kanvas dunia spasial kontinu `#world`, pergerakan kamera fisik 4-fase, motion blur arah SVG, integral kecepatan monoton $D(t)$.
4. **`cme-cartoon-puppet-rig`**: Rigging karakter kartun 2D berartikulasi $J(el, tx, ty)$, siklus jalan parametrik, generator ekspresi kepala 8-arah, lip-sync mulut viseme.
5. **`cme-audio-reactive-foley`**: Desain suara foley prosedural (whoosh, slam, click, riser), sintesis trek musik prosedural, kurva FFT 60fps.
6. **`cme-broadcast-renderer`**: Pipeline render video 60fps terakselerasi GPU (NVENC/VideoToolbox), ekspor ProRes 4444 Alpha, audit telemetri DOM Anti-PPT.

### Komitmen Mutu & Kedaulatan:
- Seluruh kode 100% deterministik dan bebas dari kode placeholder `// TODO`.
- Menggunakan standar siaran broadcast tanpa tampilan tombol pemutar pada layar utama.
- Menjamin keterbacaan teks maksimal dan pergerakan kamera berbobot fisik yang nyata.
