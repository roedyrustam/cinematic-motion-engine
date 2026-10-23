# Cinematic Motion Engine v2.2 — Standalone Rules (AGENTS.md)

Whenever the user asks to create a promotional video, motion graphics opener, kinetic typography reel, narrative explainer video, or living cartoon stage animation:

1. **Activate `cinematic-motion-engine`**:
   - Read `skills/cinematic-motion-engine/SKILL.md` (or root `SKILL.md`), select one of the **6 Official Starters** from `assets/` (`starter-opener.html`, `starter-explainer.html`, `starter-explainer-panggung.html`, `starter-explainer-kolase.html`, `starter-explainer-katalog.html`, `starter-explainer-sketsa.html`), or scaffold a new project in one command via `node scripts/scaffold-video.mjs <dir> --mode=<mode> --style=<style>`.
   - Consult the specialized reference manuals in `references/` (`anti-ppt-laws.md`, `opener-concepts.md`, `explainer-modes.md`, `techniques-and-shaders.md`, `kartun-panggung-and-ae-bridge.md`).
2. **Enforce the 8 Mechanical Anti-PPT Laws**:
   - Ban `<section class="scene">` opacity/autoAlpha toggling (`0` slide-deck fades allowed).
   - Use a single continuous `#world` rig wrapping both `<canvas id="gl">` and `<div id="dom">` (or multi-layer `kartun-panggung` stage cuts with `J(el, tx, ty)` SVG joint rigs).
   - Keep 100% of animations frame-deterministic as pure functions of `tl.time()`, `mulberry32`, and precomputed distance integral `D(t)` (provided in `assets/cme-core.js`).
   - Attach directional SVG `<feGaussianBlur>` (`#mb-world`) during fast whip-pans (`into`) and remove it immediately upon settling (`settle`).
   - Enforce the 1080p legibility floor (`>= 100px` hero claims, `>= 30px` minimum text floor, max 2 text hierarchy levels per beat).
3. **Mandatory Automated Anti-PPT Telemetry, Visual Audit & 60fps Export**:
   - Run static structural verification via `node scripts/audit-anti-ppt.mjs index.html --strict`.
   - Capture beat keyframes, run in-browser DOM telemetry checks (`audit-report.json`), and stitch a labeled contact sheet via `node scripts/snap-contact-sheet.mjs index.html ./snaps --strict`.
   - Render 60fps broadcast video via `node scripts/export-video.mjs index.html output.mp4 --fps=60 --workers=4` (or `--pipe`, `--codec=h264|prores|webm-alpha`, `--ratio=16x9|9x16|1x1`).
