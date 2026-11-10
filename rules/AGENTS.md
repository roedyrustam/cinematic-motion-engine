# Cinematic Motion Engine v3.0 — Modular Rules (AGENTS.md)
Author: Roedy Rustam

Whenever the user asks to create a promotional video, motion graphics opener, kinetic typography reel, narrative explainer video, living cartoon stage animation, or procedural sound design:

1. **Activate the Modular CME Skill Suite (`cinematic-motion-engine`)**:
   - Master Orchestrator: `cinematic-motion-engine` (`SKILL.md`)
   - Specialized Sub-Skills:
     - `cme-kinetic-typography`: Kinetic text, phrase accretion (`slam`, `block`, `multiply`), Whisper word-level sync.
     - `cme-camera-rigs-3d`: Continuous spatial canvas `#world`, 4-phase camera flight, directional SVG blur, $D(t)$ speed-ramps.
     - `cme-cartoon-puppet-rig`: Articulated SVG joint rigs $J(el, tx, ty)$, walk cycles, 8-sprite head generator, viseme lip-sync.
     - `cme-audio-reactive-foley`: Procedural sound design (`generate-foley.mjs`), music synthesis (`generate-audio.mjs`), 60fps FFT analysis.
     - `cme-broadcast-renderer`: Multi-worker GPU-accelerated video export (`export-video.mjs`), ProRes 4444 Alpha, Anti-PPT DOM gate.
   - Scaffold a new project in one command:
     `node scripts/scaffold-video.mjs <dir> --mode=<mode> --style=<style> --ratio=<16x9|9x16|1x1|4x5> [--foley] [--whisper]`

2. **Enforce the 8 Mechanical Anti-PPT Laws**:
   - Ban `<section class="scene">` opacity/autoAlpha toggling (`0` slide-deck fades allowed).
   - Use a single continuous `#world` rig wrapping both `<canvas id="gl">` and `<div id="dom">`.
   - Keep 100% of animations frame-deterministic as pure functions of `tl.time()`, `mulberry32`, and precomputed distance integral `D(t)` (provided in `assets/cme-core.js`).
   - Attach directional SVG `<feGaussianBlur>` (`#mb-world`) during fast whip-pans (`into`) and remove it immediately upon settling (`settle`).
   - Enforce the 1080p legibility floor (`>= 100px` hero claims, `>= 30px` minimum text floor, max 2 text hierarchy levels per beat).

3. **Mandatory Automated Anti-PPT Telemetry, Visual Audit & GPU Export**:
   - Run static structural verification: `node scripts/audit-anti-ppt.mjs index.html --strict`.
   - Capture beat keyframes and generate contact sheet: `node scripts/snap-contact-sheet.mjs index.html ./snaps --strict`.
   - Render 60fps broadcast video with GPU hardware acceleration:
     `node scripts/export-video.mjs index.html output.mp4 --fps=60 --gpu=auto --ratio=16x9 --audio=audio.wav`.
