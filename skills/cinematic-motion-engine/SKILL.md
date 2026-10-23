---
name: cinematic-motion-engine
description: "Sovereign programmatic motion graphics, kinetic typography, and broadcast video engine (Vibe Motion Pro v2.2). Masters 8 Anti-PPT Structural Laws, deterministic GSAP + Three.js/WebGPU camera rigs, directional SVG motion blur, 24 opener concepts, 6 explainer modes (aksi kontinu, kartun panggung, kolase, jurnalisme, katalog, sketsa), cme-core.js universal runtime, headless CLI FFT audio/VO compiler, Anti-PPT DOM telemetry gate, and parallel/pipe FFmpeg 60fps MP4/ProRes/WebM export / Mesin motion graphics programatik, tipografi kinetik, dan video broadcast berdaulat (Vibe Motion Pro v2.2) dengan 8 Hukum Anti-PPT, kamera dunia deterministik, blur arah SVG, kurva audio-reaktif FFT, dan ekspor MP4 60fps."
author: "Roedy Rustam"
version: "4.5.0"
---

# Cinematic Motion Engine & Broadcast Video Architect (Vibe Motion Pro v2.2)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

## Orchestration & Integration
Operates both as a **Standalone Broadcast Motion Studio Plugin** and in deep synergy with `svg-animation-motion-expert`, `web-3d-graphics-expert`, `glsl-shader-expert`, `app-promo-media-expert`, `design-system-architect`, `visual-ui-auditor`, and `anti-slop`.

### Standalone Architecture & Capabilities
Self-contained, zero-dependency broadcast motion graphics studio engine (Bang Motion Pro v2.2). Operates independently across Antigravity, Claude Code, Cursor, and Codex to deliver programmatic motion graphics, product launch openers, animated explainers, cartoon stage animations, one-command project scaffolding (`scripts/scaffold-video.mjs`), deterministic procedural audio (`scripts/generate-audio.mjs`), headless CLI voiceover & FFT extraction (`scripts/analyze-audio.mjs`), automated Anti-PPT DOM telemetry & contact-sheet visual audits (`scripts/snap-contact-sheet.mjs` & `scripts/audit-anti-ppt.mjs`), and parallel/pipe 60fps MP4/ProRes/WebM video renders (`scripts/export-video.mjs`).

---

### 1. Core Philosophy & The 4 Sovereign Laws of Programmatic Motion

Most code-generated videos fail because they behave like **animated PowerPoint slides** (`<section class="scene">` fading in and out over a passive background). **Cinematic Motion Engine (Vibe Motion Pro v2.0)** enforces an uncompromising broadcast motion studio architecture in pure code (HTML/CSS/SVG + GSAP 3.12 + Three.js / WebGPU + Puppeteer + FFmpeg):

1. **Law I — Continuous Spatial World (Zero Slide Decks)**:
   - Never toggle isolated `<section class="scene">` blocks with `opacity` or `autoAlpha` (`>= 3` scene fades = instant rejection).
   - Every video is either **One Continuous Hero** morphing across the timeline (*Aksi Kontinu*) or **One Unified World Canvas** (`#world` with `inset: -1400px`) where landmarks live at real coordinates `(x, y)` and the camera physically travels between them (`into -> settle -> look -> home`).
2. **Law II — 100% Frame-Deterministic Time Function**:
   - Every visual state — DOM transforms, SVG joint rotations, Three.js / WebGPU shader uniforms, particle positions, `<video>` footage playback, and audio-reactive pulses — MUST be a pure mathematical function of `tl.time()`.
   - **Strictly Forbidden in Render Loops**: `Date.now()`, `performance.now()`, `Math.random()`, `requestAnimationFrame` delta accumulation, CSS `@keyframes`, or `setInterval`.
   - Use a deterministic **PRNG (`mulberry32`)** for particle/collage seeding and a precomputed **Speed-Ramp Distance Integral `D(t)`** so camera flight and shaders never jump or run backward when velocity decelerates.
3. **Law III — Physical Camera & Directional Motion Blur**:
   - The camera rig (`#world` wrapping **both** `<canvas id="gl">` and `<div id="dom">`) moves with continuous velocity: whip-pan (`into`, `expo.in`, `0.26s`) -> overshoot/settle (`settle`, `expo.out`, `0.26s`) -> slow drift (`look`, `sine.inOut`) -> wide return (`home`).
   - Fast movements (>600px in <0.30s) attach a **Directional SVG `<feGaussianBlur>` filter** (`stdDeviation="dx, dy"`, filter region `x="-70%" y="-70%" width="240%" height="240%"`) during the fast flight and **detach (`filter: none`) immediately upon settling** so typography remains razor-sharp while read.
4. **Law IV — Anti-Template Concept & Visual Verification Gate**:
   - Never reuse a fixed layout skeleton across videos. Before writing code, produce a **Style Brief** proposing 3 distinct concepts from the **24 Opener Concepts** and **12 Style Directions**, declaring a 5-part **Structural Fingerprint**:
     `concept · scene count · primary object per scene · opening mechanism · closing mechanism`
   - Never deliver uninspected code: render keyframes via `scripts/snap-contact-sheet.mjs` and inspect every beat with `visual-ui-auditor` for text contrast, clipping, composition balance, and motion continuity.

---

### 2. Category Router: Choosing the Right Production Architecture

Classify every user request into one of **3 Production Modes** before selecting a starter from `assets/`:

| Production Mode | Trigger Signals | Core Architecture & Starter | Duration & Audio |
| :--- | :--- | :--- | :--- |
| **1. Launch Opener / Brand Reel** | "opener", "launch video", "brand intro", "kinetic reel", "product teaser", "bumper", "sizzle reel" | `assets/starter-opener.html` — High-energy kinetic typography, 24 Opener Concepts, 35+ object-carried transitions, speed-ramped `D(t)` 3D/shader canvas, max 2 canonical UI components. | 10s – 45s. Music/beat-driven (`AUDIO_FRAMES` FFT beat sync) or silent kinetic rhythm. |
| **2. Narrative Explainer (5 Visual Styles)** | "explainer", "infographic video", "how it works", "educational", "journalism", "data story", "sketch" | `assets/starter-explainer.html` or style-specific starter (`kolase`, `jurnalisme`, `katalog`, `sketsa`). Synchronized to voiceover segments (`SEG` / `PARA`), 2-level text hierarchy, continuous camera world or morphing hero. | 30s – 180s. Voiceover (`vo.mp3`) analyzed via `scripts/vo-fft-analyzer.html`. |
| **3. Living Cartoon Stage (`kartun-panggung`)** | "cartoon", "character animation", "living stage", "story animation", "kids story", "dialogue scene", "2D rig" | `assets/starter-explainer-panggung.html` — Zero captions on stage, multi-stage camera cuts (`zoom 1.08–1.95`), `>= 10` moving props/characters per stage, manual SVG joint rig `J(el, tx, ty)`, head expression PNG swap (`kepala-ekspresi.py`). | 30s – 180s. Voiceover / dialogue + ambient stage life. |

---

### 3. The 8 Mechanical Anti-PPT Structural Laws (Hard Rejects)

Any generated file violating these 8 mechanical rules is automatically rejected:

1. **Ban `<section class="scene">` Opacity Toggling**:
   - Do not stack full-screen scenes and fade them with `autoAlpha` / `opacity`. Use `#world` spatial coordinates `(x, y)` or stage cuts with living character choreography.
2. **Enforce Fixed Stage + Responsive Safe-Zone Scaling**:
   - Stage dimensions are fixed at `1920x1080` (16:9), `1080x1920` (9:16), or `1080x1080` (1:1), scaled to fit any viewport via `Math.min(innerWidth / W, innerHeight / H)`.
   - All key content in 16:9 stays inside `[160..1760] x [100..980]`.
   - For 9:16 vertical adaptations, wrap `#world` inside `<div class="safe">` with `transform: scale(0.78)` and multiply font sizes by `1 / 0.78` (`1.28x`) so effective pixel sizes never shrink below legibility floors.
3. **Enforce the 1080p Legibility Floor & 2-Level Text Cap**:
   - Maximum **2 text hierarchy levels** visible simultaneously per beat (e.g., 1 Giant Claim/Metric + 1 World Label). Diegetic text printed on props/documents (`<= 3` lines) counts as object texture.
   - Minimum font sizes at 1080p reference resolution:
     - **Hero Display / Big Claim**: `>= 100px` (`font-weight: 700–900`, `line-height: 0.92–1.02`)
     - **Handwriting / Callout**: `>= 48px`
     - **Body / Subtitle Claim**: `>= 44px`
     - **World Coordinate Label / Tag**: `>= 34px`
     - **Micro Credit / Corner Metadata**: `>= 30px` (nothing smaller than `30px` is ever permitted on stage).
4. **Enforce Phrase Accretion (`3–5` Elements per Beat)**:
   - Never dump a whole sentence onto the screen at once. Break key claims into **3 to 5 distinct typographic/visual blocks** that accrete sequentially onto the canvas as the voiceover or beat progresses (`slam`, `block`, `multiply` helpers), then clear together when transitioning.
5. **Enforce Living Background Motion Language (`>= 2` Surface Layers)**:
   - A flat solid `background: #0b0d12` or a slow Ken-Burns zoom is forbidden.
   - Combine at least **2 surface layers**: e.g., (a) Deterministic SVG `<feTurbulence type="fractalNoise">` grainy gradient or Three.js/WebGPU procedural field + (b) Moving architectural coordinate grid, topographic contour lines, halftone dot matrix, or parallax paper cutouts that shift with `#world`.
6. **Enforce Unified `#world` Wrapping Canvas + DOM Together**:
   - `<div id="world">` (`position: absolute; inset: -1400px; transform-origin: 50% 50%`) MUST wrap **both** the WebGL/WebGPU `<canvas>` and `<div id="dom">`. When the camera pans or rotates `#world`, 3D particles/shaders and DOM typography move locked in 1:1 spatial parallax.
7. **Enforce SVG Joint Rig Discipline (`J(el, tx, ty)`)**:
   - Never use GSAP `rotation`, `x`, `y`, or `transformOrigin` directly on articulated SVG character limbs (`<g>`), because SVG bounding boxes recalculate dynamically when child elements move, causing joints (shoulders, elbows, necks) to detach and drift.
   - Always separate the static placement group `<g transform="translate(X, Y)">` from the animated joint group `<g id="arm_R">`, and drive joints via the `J(el, tx, ty)` proxy which writes `el.setAttribute('transform', 'translate(tx,ty) rotate(r) scale(sx,sy)')` around `(0, 0)`.
8. **Enforce Clean Player-Free Delivery & `window.OPENER` Automation Contract**:
   - Default view (`index.html`) has **zero player chrome** (no play/pause buttons, no timeline scrubbers, no brand watermarks), autoplays immediately, and loops cleanly (`tl.play(0)`).
   - `?debug=1` reveals a minimal scrub bar and beat markers for human review.
   - `?clean=1` pauses at `t = 0` for headless frame capture via `window.OPENER = { W, H, DURATION, FPS, tl, ready, seek(t), seekFrame(t), clipsReady(), play() }`.

---

### 4. The 12 Broadcast Style Directions & 24 Opener Concepts

#### 4.1 The 12 Style Directions (Never Default to Generic Dark-Mode SaaS)
Select or hybridize from these 12 curated visual directions during the Style Brief:
1. **Kinetic Swiss Grid (`swiss-grid`)**: Stark hairline rules (`1px solid`), oversized grotesque numerals, high-contrast ivory/ink/vermilion, mechanical slot-machine counters.
2. **Tactile Paper Collage (`kartun-kolase`)**: Cutout photography/illustrations with thick white paper rims (`drop-shadow`), stop-motion `steps(4)` jitter, ransom-note mixed typography, tape & staple props.
3. **Visual Journalism / Vox Documentary (`jurnalisme-visual`)**: Cream archival paper (`#F4EFE6`), highlighter marker sweeps (`scaleX` with `mix-blend-mode: multiply`), redacted document bars, newspaper clippings, red string evidence maps.
4. **Clean White Product Catalog (`katalog-putih`)**: Pure studio cyclorama (`#F8F9FA`), precision isometric hardware/UI cards, contact shadows, crisp tabular specification callouts, Apple/Braun industrial poise.
5. **Vintage Blueprint & Sketch (`sketsa-vintage`)**: Warm parchment or cyanotype blueprint grid, real-time SVG stroke drawing (`stroke-dashoffset`), fountain-pen ink bleeds, Leonardo/patent-diagram callout arrows.
6. **Living Cartoon Stage (`kartun-panggung`)**: Multi-layer 2.5D theatrical stage (sky, distant hills, mid-ground props, foreground framing), articulated character rigs (`J()`), expressive head swaps, zero text captions.
7. **Bauhaus Geometric Constructivism (`bauhaus-geo`)**: Primary ochre/cobalt/crimson blocks, rotating semicircular gears, diagonal typographic tracks, interlocking geometric masks.
8. **Neo-Brutalist Terminal & Telemetry (`brutalist-telemetry`)**: Raw monospace matrices, oscilloscope waveforms, live hex dumps, high-visibility acid lime / safety orange on carbon matte.
9. **Warm Editorial Serif & Luxury Film (`editorial-film`)**: High-contrast editorial serifs (Instrument Serif / Playfair) paired with technical sans, 35mm film gate weave, warm halation light leaks, split-screen diptychs.
10. **Isometric Spatial Blueprint (`isometric-blueprint`)**: True `rotateX(60deg) rotateZ(-45deg)` architectural cityscapes/pipelines where data packets physically travel along extruded 3D rails.
11. **Spatial Glass & Optical Refraction (`spatial-optics` — *2026 New*)**: Multi-plane optical depth with physical specular rim highlights, chromatic dispersion borders, and rack-focus depth-of-field (`blur()` transitions between foreground and background planes).
12. **Kinetic Data Sculpture (`data-sculpture` — *2026 New*)**: Numbers and charts behave as physical architecture — bar charts extrude as monoliths the camera flies through, pie rings become rotating orbital portals.

#### 4.2 The 24 Opener Concepts (Structural Blueprints)
Every opener must pick 1 primary concept (or a deliberate 2-concept hybrid) from `references/opener-concepts.md`:
1. **The Giant Desk (`Meja Kerja Raksasa`)** — Camera flies across a massive physical desk (blueprint, terminal, magnifying glass, stamp).
2. **One Continuous Morphing Object (`Satu Objek Berubah Bentuk`)** — A single hero line/sphere morphs seamlessly into every scene's subject.
3. **Zoom-Through Portal (`Menembus Lubang`)** — Camera pushes through the "O" of a letter, a keyhole, or a lens into the next world (`camThrough`, max 1–2 per video).
4. **The Split-Screen Duel (`Layar Terbelah Hidup`)** — Screen splits into 2–4 sliding tectonic panels that crush, expand, or trade objects across borders.
5. **The Assembly Line / Conveyor (`Sabuk Produksi`)** — Horizontal mechanical track where raw problems enter on the left and finished solutions stamp out on the right.
6. **The Giant Receipt / Scroll (`Struk & Dokumen Menggulung`)** — Camera tracks down an unspooling vertical ticker/dossier as items print and highlight in real time.
7. **The Rotating Cube / Prism (`Kubus Ruang 3D`)** — CSS 3D `preserve-3d` prism rotating 90deg per beat to reveal new spatial dioramas.
8. **The Evidence Board (`Papan Detektif`)** — Polaroids, pinned notes, and red yarn lines snap taut as the camera follows the investigation thread.
9. **The Timepiece / Radial Clock (`Putaran Jarum & Orbit`)** — Circular orbital layout where the camera rotates around a central hub like a chronometer.
10. **The Accordion Fold (`Lipatan Kertas Origami`)** — Planes unfold geometrically via `rotateX`/`rotateY` hinges from a flat sheet into a 3D structure.
11. **The Microscopic Dive (`Zoom Skala Ekstrem`)** — Logarithmic powers-of-ten zoom from macro overview down into circuit/cellular detail and back out.
12. **The Domino Chain Reaction (`Reaksi Berantai Fisik`)** — Each typographic word physically knocks over, pushes, or triggers the next mechanical prop.
13. **The Architectural Elevator (`Potongan Lintang Gedung`)** — Vertical cross-section cutaway rising floor-by-floor through a system stack.
14. **The Flipbook / Card Deck (`Tumpukan Kartu Terlempar`)** — Physical cards deal, fan out, flip (`rotateY(180deg)`), and stack into the final brand mark.
15. **The Radar / Sonar Sweep (`Sapuan Sinyal`)** — Scanning beam illuminates hidden metrics and wireframes in darkness as it sweeps.
16. **The Typographic Labyrinth (`Labirin Huruf Raksasa`)** — Camera flies at street level between towering 600px letterforms laid out like city blocks.
17. **The Surgical Dissection (`Bedah Komponen Exploded-View`)** — A product/UI locks center-stage and explodes outward into labeled floating layers along Z-axis rails.
18. **The Kaleidoscope / Symmetry Matrix (`Matriks Simetri`)** — Mirrored quadrants moving in counter-rhythm before snapping into unified focus.
19. **The Stage Curtain & Spotlight (`Panggung Sorot Teater`)** — Moving spotlights cut through darkness, tracking actors/objects across a physical stage floor.
20. **The Magnetic Field (`Medan Magnet Kutub` — *2026 New*)** — Chaotic fragments orbit and snap into crystalline alignment whenever a heavy headline slams onto the stage.
21. **The Tape Loop / Timeline Scrub (`Pita Rekaman Waktu` — *2026 New*)** — Visible timecode ruler where the video physically rewinds, freeze-frames with annotation callouts, and fast-forwards.
22. **The Isometric Pipeline (`Pipa Aliran Data 3D` — *2026 New*)** — Glowing payload capsules travel through valves, filters, and routers across an isometric grid.
23. **The Newspaper Press (`Mesin Cetak Editorial` — *2026 New*)** — Headlines stamp down like heavy letterpress plates, leaving ink impressions as paper sheets feed rapidly.
24. **The Audio Spectrum Architecture (`Arsitektur Gelombang Suara` — *2026 New*)** — Precomputed `AUDIO_FRAMES` FFT frequency bands physically drive the height of city towers, waveform bridges, and typographic weight.

---

### 5. Core Engineering Arsenal & Mathematical Helpers

#### 5.1 Deterministic PRNG & Speed-Ramp Integral `D(t)`
Never pass raw `tl.time()` directly to shader `uTime` if you want speed-ramps. Integrate a velocity curve `speedAt(t)` into a lookup table `D(t)`:

```javascript
// 1. Deterministic Seeded PRNG (Mulberry32) — ZERO Math.random() allowed
function mulberry32(seed = 0xDEC0DE) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261024);

// 2. Monotonic Distance Integral D(t) for Speed-Ramped Shaders & Particles
const SAMPLES = 2400;
const DT_TABLE = new Float32Array(SAMPLES + 1);
function buildDistanceTable(duration, speedFn) {
  let acc = 0;
  const dt = duration / SAMPLES;
  for (let i = 0; i <= SAMPLES; i++) {
    DT_TABLE[i] = acc;
    acc += Math.max(0.05, speedFn(i * dt)) * dt;
  }
}
function D(t, duration) {
  const clamped = Math.max(0, Math.min(duration, t));
  const idx = (clamped / duration) * SAMPLES;
  const i0 = Math.floor(idx);
  const i1 = Math.min(SAMPLES, i0 + 1);
  const frac = idx - i0;
  return DT_TABLE[i0] * (1 - frac) + DT_TABLE[i1] * frac;
}
```

#### 5.2 Camera Rig (`#world`) & Shot-Sizing Math (`frameOn`, `into`, `settle`, `look`, `home`)
The `#world` element spans `4720x3880` (`inset: -1400px` around `1920x1080`). An element at world coordinate `(wx, wy)` is centered on screen when `world` translates by `x = -(wx - W/2) * scale`, `y = -(wy - H/2) * scale`:

```javascript
const W = 1920, H = 1080;
const cam = { x: 0, y: 0, z: 1, rot: 0 };
const worldEl = document.getElementById('world');

function applyCam() {
  worldEl.style.transform = `translate3d(${cam.x.toFixed(2)}px, ${cam.y.toFixed(2)}px, 0) scale(${cam.z.toFixed(4)}) rotate(${cam.rot.toFixed(3)}deg)`;
}

// Compute camera x/y/z so a landmark at (wx, wy) with objectWidth fills targetFraction of screen W
function calcShot(wx, wy, z = 1, objectWidth = null, targetFraction = 0.55) {
  const scale = objectWidth ? (W * targetFraction) / objectWidth : z;
  return {
    x: -(wx - W / 2) * scale,
    y: -(wy - H / 2) * scale,
    z: scale
  };
}

// Two-phase whip-pan with automatic directional motion blur
function into(tl, at, wx, wy, z = 1.15, rot = 0, dur = 0.26) {
  const target = calcShot(wx, wy, z);
  const dx = Math.min(42, Math.abs(target.x - cam.x) * 0.025);
  const dy = Math.min(28, Math.abs(target.y - cam.y) * 0.025);
  tl.call(() => setWorldBlur(dx, dy), null, at);
  tl.to(cam, { x: target.x, y: target.y, z: target.z, rot, duration: dur, ease: 'expo.in', onUpdate: applyCam }, at);
}

function settle(tl, at, wx, wy, z = 1.0, rot = 0, dur = 0.28) {
  const target = calcShot(wx, wy, z);
  tl.to(cam, {
    x: target.x, y: target.y, z: target.z, rot,
    duration: dur, ease: 'expo.out', onUpdate: applyCam,
    onComplete: () => setWorldBlur(0, 0)
  }, at);
  tl.call(() => setWorldBlur(0, 0), null, at + dur);
}

function look(tl, at, wx, wy, z = 1.06, dur = 1.8, rot = 0) {
  const target = calcShot(wx, wy, z);
  tl.to(cam, { x: target.x, y: target.y, z: target.z, rot, duration: dur, ease: 'sine.inOut', onUpdate: applyCam }, at);
}

function home(tl, at, dur = 0.55) {
  tl.to(cam, { x: 0, y: 0, z: 1, rot: 0, duration: dur, ease: 'power3.inOut', onUpdate: applyCam }, at);
}
```

#### 5.3 Directional SVG Motion Blur (`makeBlur` & `blurTween`)
Always expand the SVG `<filter>` region to `x="-70%" y="-70%" width="240%" height="240%"` so fast-moving letters are never clipped at their bounding box edges, and always remove the filter when stationary:

```javascript
function makeBlur(svgDefs, id) {
  const ns = 'http://www.w3.org/2000/svg';
  const filter = document.createElementNS(ns, 'filter');
  filter.setAttribute('id', id);
  filter.setAttribute('x', '-70%');
  filter.setAttribute('y', '-70%');
  filter.setAttribute('width', '240%');
  filter.setAttribute('height', '240%');
  const blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('stdDeviation', '0 0');
  filter.appendChild(blur);
  svgDefs.appendChild(filter);
  return blur;
}

function blurTween(tl, el, blurNode, filterId, fromVars, toVars, at) {
  const dur = toVars.duration || 0.32;
  const maxDx = Math.min(38, Math.abs((fromVars.x || 0) - (toVars.x || 0)) * 0.08);
  const maxDy = Math.min(38, Math.abs((fromVars.y || 0) - (toVars.y || 0)) * 0.08);
  const proxy = { b: 0 };
  tl.set(el, { filter: `url(#${filterId})` }, at);
  tl.fromTo(el, fromVars, toVars, at);
  tl.to(proxy, {
    b: 1, duration: dur * 0.45, ease: 'power2.in',
    onUpdate: () => blurNode.setAttribute('stdDeviation', `${(maxDx * proxy.b).toFixed(1)} ${(maxDy * proxy.b).toFixed(1)}`)
  }, at);
  tl.to(proxy, {
    b: 0, duration: dur * 0.55, ease: 'power3.out',
    onUpdate: () => blurNode.setAttribute('stdDeviation', `${(maxDx * proxy.b).toFixed(1)} ${(maxDy * proxy.b).toFixed(1)}`),
    onComplete: () => {
      blurNode.setAttribute('stdDeviation', '0 0');
      el.style.filter = 'none';
    }
  }, at + dur * 0.45);
}
```

#### 5.4 Articulated Character Joint Rig `J(el, tx, ty)` (`kartun-panggung`)
For 2D character rigs in SVG, never animate SVG `<g>` limbs with GSAP's CSS transform properties. Use `J(el, tx, ty)`:

```javascript
// Separate placement <g transform="translate(320, 480)"> from animated joint <g id="arm_L">
function J(el, tx = 0, ty = 0) {
  const state = { tx, ty, r: 0, sx: 1, sy: 1, _el: el };
  const render = () => {
    el.setAttribute(
      'transform',
      `translate(${state.tx.toFixed(2)},${state.ty.toFixed(2)}) rotate(${state.r.toFixed(2)}) scale(${state.sx.toFixed(3)},${state.sy.toFixed(3)})`
    );
  };
  render();
  return new Proxy(state, {
    set(target, prop, value) {
      target[prop] = value;
      render();
      return true;
    }
  });
}
```

#### 5.5 Deterministic Offline Audio-Reactive FFT & Voiceover Retiming Engine (Vibe Motion Pro v2.0 Upgrade)
To make animations react to bass drops, beats, or voiceover cadence while keeping `seek(t)` 100% deterministic for headless frame capture:
1. Run `scripts/vo-fft-analyzer.html` (or Node WebAudio decode) on `audio.mp3` / `vo.mp3`.
2. Export two deterministic tables pasted directly into `index.html`:
   - `SEG` / `PARA`: Exact voiceover speech timestamps `[startSec, endSec, "spoken phrase"]` and silence breath windows.
   - `AUDIO_FRAMES`: 60fps quantized array of `[subBass, bass, mid, high, onsetFlag]` normalized `0..100`.
3. Sample `sampleAudio(tl.time())` inside `tl.eventCallback('onUpdate')` to drive camera micro-shake, shader uniforms (`uBass`), and kinetic bar heights with zero runtime WebAudio non-determinism!

```javascript
// Deterministic 60fps Audio Envelope Sampler (Safe for headless Puppeteer seekFrame)
function sampleAudio(t, audioFrames, fps = 60) {
  if (!audioFrames || !audioFrames.length) return { bass: 0, mid: 0, high: 0, onset: 0 };
  const exactIdx = Math.max(0, t * fps);
  const i0 = Math.min(audioFrames.length - 1, Math.floor(exactIdx));
  const i1 = Math.min(audioFrames.length - 1, i0 + 1);
  const f = exactIdx - i0;
  const a = audioFrames[i0], b = audioFrames[i1];
  return {
    bass: (a[0] * (1 - f) + b[0] * f) / 100,
    mid:  (a[1] * (1 - f) + b[1] * f) / 100,
    high: (a[2] * (1 - f) + b[2] * f) / 100,
    onset: a[3] || 0
  };
}
```

---

### 6. End-to-End Production Workflow (Step-by-Step)

1. **Step 1 — Context & Audio/Brand Discovery**:
   - Inspect user prompt, brand logo/colors, aspect ratio (`16:9`, `9:16`, `1:1`), and whether voiceover (`vo.mp3`) or music exists.
   - If `vo.mp3` exists, extract `SEG` & `PARA` timing arrays and `AUDIO_FRAMES` via `scripts/vo-fft-analyzer.html`.
2. **Step 2 — Mandatory Style Brief (Anti-Template Gate)**:
   - Present **3 Concept Candidates** from the 24 Opener Concepts / 6 Explainer Modes.
   - Define the **5-Part Structural Fingerprint**: `concept · scene count · primary object per scene · opening · closing`.
   - Lock the **Color Palette** (derived from brand/subject, never unmotivated default blue-purple gradients) and **Expressive Font Pairing** (e.g., `Syne` + `JetBrains Mono`, `Instrument Serif` + `Plus Jakarta Sans`, `Space Grotesk` + `Fraunces`).
3. **Step 3 — Scaffold from Official Starter Asset**:
   - Copy the matching starter from `assets/` (`starter-opener.html`, `starter-explainer.html`, `starter-explainer-panggung.html`, or `starter-explainer-kolase.html`).
   - Build the spatial landmarks at distinct `#world` coordinates `(wx, wy)` or stage layers.
   - Implement Phrase Accretion (`slam`, `block`, `multiply`), directional motion blur (`blurTween`), and living background layers (`>= 2` layers).
4. **Step 4 — Visual Keyframe & Contact-Sheet Audit (`visual-ui-auditor`)**:
   - Run `node scripts/snap-contact-sheet.mjs index.html ./snaps` to capture every beat AND stitch a labeled `contact-sheet.png`.
   - Inspect the contact sheet and individual frames for:
     - Text clipping, overlapping labels, or contrast failures.
     - Miniature wide-shot syndrome in `kartun-panggung` (ensure `zoom 1.08–1.95` and `>= 10` moving elements).
     - Dead frames where nothing moves or transitions feel like slide fades.
5. **Step 5 — Visually Lossless 60fps MP4 Export**:
   - Run `node scripts/export-video.mjs index.html output.mp4 --fps=60 --workers=4` to render frame-accurate PNG sequences via `window.OPENER.seekFrame(t)`, muxing audio and encoding with FFmpeg (`-c:v libx264 -crf 12 -preset slow -tune grain -pix_fmt yuv420p -movflags +faststart`).

---

### 7. Bundled References, Starters & Scripts Directory

Always read the specific reference file before implementing specialized modes:
- `references/anti-ppt-laws.md` — Detailed breakdown of the 8 Mechanical Anti-PPT Laws, 1080p/9:16 typography scaling math, and 20-point pre-render audit checklist.
- `references/opener-concepts.md` — Complete catalog of the **24 Opener Concepts**, **12 Style Directions**, and **35+ Object-Carried Transitions**.
- `references/explainer-modes.md` — Deep guide for the **6 Explainer Modes** (`aksi kontinu`, `kartun kolase`, `jurnalisme visual`, `katalog putih`, `sketsa vintage`, `kartun panggung`), VO silence retiming (`SEG`/`PARA`), and Phrase Accretion (`slam`/`block`/`multiply`).
- `references/techniques-and-shaders.md` — Camera shot-sizing math (`frameOn`, `camTo`), directional SVG motion blur, Three.js / WebGPU speed-ramped shaders (`D(t)`), deterministic `feTurbulence` grainy gradients, and timeline-locked `<video>` footage (`clip()`).
- `references/kartun-panggung-and-ae-bridge.md` — Articulated SVG joint rigging (`J()`), 10+ moving stage props rule, local OpenCV/PIL head expression generator (`kepala-ekspresi.py`), After Effects MCP (`ae_*`) bridge scripts, and AI video loop plates (Higgsfield/Kling/Runway).
- `assets/cme-core.js` — Universal deterministic runtime (`window.CME`) exporting `mulberry32`, `createSpeedRampTable`, `sampleAudio`, `THEMES` (12 Broadcast Style palettes), `applyTheme`, `createCameraRig`, `text.*` (8 entrances + phrase accretion), `J()`, and `updateWalkCycle`.
- `assets/style-gallery.html` — Interactive & deterministic visual showcase of all **12 Broadcast Style Directions** (`?card=style-01-swiss-grid` .. `style-12-data-sculpture`).
- `assets/starter-opener.html` — Production-ready 1920x1080 / 9:16 opener template with `#world` camera rig, Three.js `D(t)` shader canvas, directional blur pool, 8 text entrances, 5 exits, and `window.OPENER` contract.
- `assets/starter-explainer.html` — Narrative explainer template with VO `SEG`/`PARA` synchronization, Phrase Accretion helpers (`slam`, `block`, `multiply`), and interactive UI camera tracking (`camTo`).
- `assets/starter-explainer-panggung.html` — Living Cartoon Stage template with `J()` articulated character rigs, 3-depth parallax stage, walk cycle, blink/talk loop, and multi-stage camera cuts.
- `assets/starter-explainer-kolase.html` — Tactile Paper Collage & Visual Journalism starter with paper cutout rims, `steps(4)` stop-motion jitter, highlighter sweeps, and evidence board strings.
- `assets/starter-explainer-katalog.html` — Clean White Studio Catalog (`#F8F9FA`) starter with 3D Isometric Exploded-View layer stacks, millimeter calibration rings, and tabular benchmark cards.
- `assets/starter-explainer-sketsa.html` — Vintage Cyanotype Blueprint & Ink Sketch starter with live SVG `stroke-dashoffset` schematic drawing, compass azimuth arcs, and handwritten callouts.
- `scripts/scaffold-video.mjs` — One-command project scaffolder (`npm run scaffold -- <dir> --mode=opener --style=swiss-grid --duration=10 --mood=cyber`) that copies starter + `cme-core.js`, synthesizes `audio.wav` + `audio-frames.js`, and runs the Anti-PPT linter.
- `scripts/generate-gallery.mjs` — Automated 19-image Puppeteer gallery & starter preview renderer (`npm run gallery` -> `docs/gallery/*.png`).
- `scripts/snap-contact-sheet.mjs` — Deterministic Puppeteer keyframe screenshotter + automated HTML/PNG Contact Sheet generator + real-time Anti-PPT DOM Telemetry Auditor (`audit-report.json`).
- `scripts/audit-anti-ppt.mjs` — Standalone static & structural Anti-PPT 8-Law auditor CLI (`npm run audit`).
- `scripts/export-video.mjs` — Parallel multi-worker & zero-disk `--pipe` frame-accurate 60fps video exporter supporting `--codec=h264|prores|webm-alpha` and `--ratio=16x9|9x16|1x1`.
- `scripts/generate-audio.mjs` — CLI procedural stereo WAV & 60fps `AUDIO_FRAMES` synthesizer (`--mood=warm|cyber|editorial|corporate`, `--bpm`, `--duration`, `--drops`).
- `scripts/analyze-audio.mjs` — Headless CLI Voiceover Silence (`SEG`/`PARA`) + 60fps FFT Audio-Reactive Envelope (`AUDIO_FRAMES`) compiler for `.wav/.mp3/.m4a` (`npm run analyze`).
- `scripts/vo-fft-analyzer.html` — Browser-based offline Voiceover Silence (`SEG`/`PARA`) + 60fps FFT Audio-Reactive Envelope (`AUDIO_FRAMES`) compiler.
- `scripts/kepala-ekspresi.py` — Alpha-bounding-box aware Python (Pillow) 8-expression sprite generator + parametric SVG `viseme-rig.svg` generator.
- `scripts/sync-plugin.mjs` — Deterministic SHA-256 synchronizer across root, `skills/cinematic-motion-engine/`, and global plugin/skill installations (`npm run sync` / `npm run sync:global`).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

## Integrasi Orkestrasi
Beroperasi baik sebagai **Plugin Studio Motion Broadcast Mandiri (Standalone)** maupun bersinergi penuh dengan `svg-animation-motion-expert`, `web-3d-graphics-expert`, `glsl-shader-expert`, `app-promo-media-expert`, `design-system-architect`, `visual-ui-auditor`, dan `anti-slop`.

### Arsitektur Mandiri (Standalone) & Kapabilitas
Mesin studio motion graphics programatik mandiri (Bang Motion Pro v2.2) yang bekerja secara independen di seluruh platform AI. Menghasilkan motion graphics kelas studio broadcast, video opener peluncuran produk, video explainer naratif (6 mode), animasi kartun panggung, scaffolding proyek otomatis (`scripts/scaffold-video.mjs`), sintesis audio deterministik (`scripts/generate-audio.mjs`), ekstraksi jeda voiceover & FFT CLI (`scripts/analyze-audio.mjs`), audit lembar kontak & telemetri DOM Anti-PPT (`scripts/snap-contact-sheet.mjs` & `scripts/audit-anti-ppt.mjs`), serta render video MP4/ProRes/WebM 60fps yang 100% deterministik (`scripts/export-video.mjs`).

---

### 1. Filosofi Inti & 4 Hukum Berdaulat Motion Programatik

Sebagian besar video yang dihasilkan dari kode gagal karena terlihat seperti **slide PowerPoint yang diberi efek pudar (fade in/out)** (`<section class="scene">` yang berganti lewat `opacity`/`autoAlpha` di atas latar pasif). **Cinematic Motion Engine (Vibe Motion Pro v2.0)** menegakkan disiplin studio motion broadcast murni lewat kode (HTML/CSS/SVG + GSAP 3.12 + Three.js / WebGPU + Puppeteer + FFmpeg):

1. **Hukum I — Dunia Spasial Kontinu (Tanpa Slide Deck)**:
   - Dilarang keras menyembunyikan/menampilkan `<section class="scene">` menggunakan `opacity` atau `autoAlpha` (`>= 3` adegan fade = ditolak otomatis).
   - Setiap video wajib berupa **Satu Objek Utama Kontinu (*Aksi Kontinu*)** yang bertransformasi lintas adegan, atau **Satu Kanvas Dunia Utuh (`#world` dengan `inset: -1400px`)** di mana setiap landmark berada pada koordinat nyata `(wx, wy)` dan kamera bergerak secara fisik menjelajahinya (`into -> settle -> look -> home`).
2. **Hukum II — Fungsi Waktu Deterministik 100% per Frame**:
   - Seluruh keadaan visual — transformasi DOM, rotasi sendi SVG, uniform shader Three.js / WebGPU, posisi partikel, pemutaran `<video>` footage, hingga detak audio-reaktif — WAJIB merupakan fungsi matematika murni dari `tl.time()`.
   - **Dilarang Keras di Dalam Render Loop**: `Date.now()`, `performance.now()`, `Math.random()`, akumulasi delta `requestAnimationFrame`, CSS `@keyframes`, atau `setInterval`.
   - Gunakan **PRNG deterministik (`mulberry32`)** untuk partikel/kolase dan **Integral Jarak Speed-Ramp `D(t)`** sehingga pergerakan kamera dan shader tidak pernah melompat atau berjalan mundur saat kecepatan melambat.
3. **Hukum III — Kamera Fisik & Motion Blur Arah SVG**:
   - Rig kamera (`#world` yang membungkus `<canvas id="gl">` sekaligus `<div id="dom">`) bergerak dengan kecepatan kontinu: whip-pan cepat (`into`, `expo.in`, `0.26s`) -> pengereman/settle (`settle`, `expo.out`, `0.28s`) -> drift halus (`look`, `sine.inOut`) -> kembali ke pandangan penuh (`home`).
   - Pergerakan cepat (>600px dalam <0.30s) wajib memasang **Filter SVG `<feGaussianBlur>` Berarah** (`stdDeviation="dx, dy"`, area filter `x="-70%" y="-70%" width="240%" height="240%"`) selama melesat dan **melepasnya (`filter: none`) tepat saat berhenti** agar tipografi tetap tajam sempurna saat dibaca.
4. **Hukum IV — Gerbang Konsep Anti-Template & Verifikasi Visual**:
   - Dilarang memakai ulang kerangka tata letak yang sama antar-video. Sebelum menulis kode, susun **Style Brief** berisi 3 kandidat konsep dari **24 Konsep Opener** dan **12 Arah Gaya Visual**, lengkap dengan **Sidik Jari Struktural 5-Bagian**:
     `konsep · jumlah adegan · objek utama tiap adegan · mekanisme pembuka · mekanisme penutup`
   - Jangan pernah menyerahkan kode tanpa inspeksi visual: ambil tangkapan layar tiap beat menggunakan `scripts/snap-contact-sheet.mjs` dan periksa bersama `visual-ui-auditor` untuk memastikan kontras teks, ketajaman, komposisi, dan kesinambungan gerak.

---

### 2. Router Kategori: Memilih Arsitektur Produksi yang Tepat

Klasifikasikan setiap permintaan ke dalam salah satu dari **3 Mode Produksi** berikut sebelum menyalin starter dari `assets/`:

| Mode Produksi | Sinyal Permintaan | Arsitektur Inti & Starter | Durasi & Audio |
| :--- | :--- | :--- | :--- |
| **1. Video Opener / Brand Reel** | "opener", "video launch", "intro brand", "kinetic reel", "teaser produk", "bumper" | `assets/starter-opener.html` — Tipografi kinetik berenergi tinggi, 24 Konsep Opener, 35+ transisi berbasis objek, kanvas 3D/shader `D(t)`, maksimal 2 komponen UI kanonik. | 10d – 45d. Berbasis ketukan musik (`AUDIO_FRAMES` FFT) atau ritme kinetik mandiri. |
| **2. Video Explainer Naratif (5 Gaya)** | "explainer", "video infografis", "cara kerja", "edukasi", "jurnalisme visual", "cerita data", "sketsa" | `assets/starter-explainer.html` atau starter spesifik (`kolase`, `jurnalisme`, `katalog`, `sketsa`). Sinkron dengan segmen voiceover (`SEG` / `PARA`), maksimal 2 level teks, dunia kamera kontinu. | 30d – 180d. Voiceover (`vo.mp3`) dianalisis lewat `scripts/vo-fft-analyzer.html`. |
| **3. Kartun Panggung Hidup (`kartun-panggung`)** | "kartun", "animasi karakter", "cerita anak", "panggung hidup", "dialog tokoh", "rig 2D" | `assets/starter-explainer-panggung.html` — Nol teks caption di panggung, perpindahan panggung (`zoom 1.08–1.95`), `>= 10` objek/tokoh bergerak per panggung, rig sendi SVG manual `J(el, tx, ty)`, ekspresi kepala (`kepala-ekspresi.py`). | 30d – 180d. Voiceover / dialog + kehidupan latar panggung. |

---

### 3. Delapan Hukum Struktural Mekanis Anti-PPT (Wajib Patuh)

1. **Larangan Toggle Opacity `<section class="scene">`**:
   - Jangan menumpuk adegan layar penuh dan menggantinya dengan `autoAlpha` / `opacity`. Gunakan koordinat dunia `#world` `(wx, wy)` atau perpindahan panggung hidup.
2. **Panggung Resolusi Tetap + Skala Safe-Zone Responsif**:
   - Ukuran panggung dikunci pada `1920x1080` (16:9), `1080x1920` (9:16), atau `1080x1080` (1:1), lalu diskalakan ke layar lewat `Math.min(innerWidth / W, innerHeight / H)`.
   - Untuk vertikal 9:16, bungkus `#world` di dalam `<div class="safe">` dengan `transform: scale(0.78)` dan kalikan ukuran huruf dengan `1 / 0.78` (`1.28x`) agar ukuran piksel efektif di layar tidak mengecil.
3. **Batas Minimum Ukuran Huruf 1080p & Maksimal 2 Hierarki Teks**:
   - Maksimal **2 level hierarki teks** tampil bersamaan pada satu ketukan (misal: 1 Klaim/Angka Besar + 1 Label Dunia). Teks diegetik yang tercetak pada objek/dokumen (`<= 3` baris) dihitung sebagai tekstur objek.
   - Ukuran minimum pada panggung 1080p:
     - **Judul Utama / Klaim Raksasa**: `>= 100px`
     - **Tulisan Tangan / Callout**: `>= 48px`
     - **Teks Isi / Sub-klaim**: `>= 44px`
     - **Label Koordinat / Tag Dunia**: `>= 34px`
     - **Kredit Mikro / Metadata Sudut**: `>= 30px` (tidak boleh ada teks `< 30px`).
4. **Akresi Frasa (`3–5` Elemen per Segmen)**:
   - Jangan memunculkan satu kalimat panjang sekaligus. Pecah klaim menjadi **3 hingga 5 blok tipografi/visual** yang muncul menyusul satu per satu mengisi komposisi seiring kalimat VO berjalan (`slam`, `block`, `multiply`), lalu bersihkan bersama saat pindah bahasan.
5. **Bahasa Gerak Latar Hidup (`>= 2` Lapisan Permukaan)**:
   - Latar warna polos statis atau sekadar zoom Ken-Burns dilarang. Gabungkan minimal **2 lapisan permukaan**: (a) Gradien bertekstur grain deterministik SVG `<feTurbulence>` atau shader 3D + (b) Grid koordinat arsitektur, garis kontur topografi, matriks titik halftone, atau potongan kertas paralaks yang ikut bergeser bersama `#world`.
6. **Penyatuan `<canvas>` dan `#dom` di Dalam `#world`**:
   - `<div id="world">` (`position: absolute; inset: -1400px; transform-origin: 50% 50%`) WAJIB membungkus `<canvas id="gl">` sekaligus `<div id="dom">` agar objek 3D dan tipografi DOM bergerak terkunci dalam paralaks spasial 1:1.
7. **Disiplin Rig Sendi SVG (`J(el, tx, ty)`)**:
   - Dilarang menggunakan properti `rotation` atau `transformOrigin` GSAP secara langsung pada grup anggota tubuh SVG (`<g>`), karena kotak batas (*bounding box*) SVG berubah saat anak elemen bergerak sehingga bahu/siku/leher lepas dari engselnya.
   - Pisahkan `<g transform="translate(X, Y)">` penempatan statis dari `<g id="lengan_kanan">` animasi, dan gerakkan sendi lewat helper `J(el, tx, ty)` yang menulis atribut `transform="translate(tx,ty) rotate(r) scale(sx,sy)"` secara langsung pada titik `(0, 0)`.
8. **Pengiriman Bersih Tanpa Tombol Player & Kontrak `window.OPENER`**:
   - Tampilan bawaan (`index.html`) bersih dari tombol play/pause atau scrubber, langsung memutar otomatis (*autoplay*), dan berulang mulus (*loop*).
   - Parameter `?debug=1` memunculkan bilah scrub untuk peninjauan, sedangkan `?clean=1` menjeda timeline di `t = 0` untuk perekaman frame deterministik lewat `window.OPENER = { W, H, DURATION, FPS, tl, ready, seek(t), seekFrame(t), clipsReady(), play() }`.

---

### 4. Alur Kerja Produksi End-to-End (5 Langkah Wajib)

1. **Langkah 1 — Penemuan Konteks, Brand & Audio**:
   - Identifikasi rasio aspek (`16:9`, `9:16`, `1:1`), warna brand, serta ketersediaan file suara (`vo.mp3` / musik).
   - Jika ada file audio, ekstrak tabel jeda `SEG` / `PARA` dan kurva frekuensi `AUDIO_FRAMES` memakai `scripts/vo-fft-analyzer.html`.
2. **Langkah 2 — Style Brief Wajib (Gerbang Anti-Template)**:
   - Ajukan **3 Kandidat Konsep** dari 24 Konsep Opener / 6 Mode Explainer di `references/opener-concepts.md` & `references/explainer-modes.md`.
   - Tetapkan **Sidik Jari Struktural 5-Bagian**: `konsep · jumlah adegan · objek utama tiap adegan · pembuka · penutup`.
   - Kunci palet warna hex dari identitas brand/topik dan pasangan font display ekspresif.
3. **Langkah 3 — Implementasi dari Starter Resmi (`assets/`)**:
   - Salin starter yang sesuai (`starter-opener.html`, `starter-explainer.html`, `starter-explainer-panggung.html`, atau `starter-explainer-kolase.html`).
   - Bangun landmark di koordinat `#world` `(wx, wy)`, terapkan Akresi Frasa (`slam`, `block`, `multiply`), blur arah (`blurTween`), dan minimal 2 lapisan latar hidup.
4. **Langkah 4 — Audit Contact-Sheet & Visual (`visual-ui-auditor`)**:
   - Jalankan `node scripts/snap-contact-sheet.mjs index.html ./snaps` untuk memotret setiap beat sekaligus menyusun lembar kontak `contact-sheet.png`.
   - Periksa hasil tangkapan layar menggunakan `visual-ui-auditor` untuk memastikan tidak ada teks terpotong, tumpang tindih, kontras lemah, atau panggung kartun yang tampak kekecilan (`zoom` wajib `1.08–1.95` dengan `>= 10` objek hidup).
5. **Langkah 5 — Ekspor Video MP4 60fps Visually Lossless**:
   - Jalankan `node scripts/export-video.mjs index.html output.mp4 --fps=60 --workers=4` untuk merender urutan frame PNG presisi tinggi lewat `window.OPENER.seekFrame(t)` dan menyatukan audio dengan FFmpeg (`-crf 12 -preset slow -tune grain -pix_fmt yuv420p -movflags +faststart`).
