# Cinematic Motion Engine — Standalone Rules (AGENTS.md)

Whenever the user asks to create a promotional video, motion graphics opener, kinetic typography reel, narrative explainer video, or living cartoon stage animation:

1. **Activate `cinematic-motion-engine`**: Read `skills/cinematic-motion-engine/SKILL.md` and select the appropriate starter from `assets/` and reference manual from `references/`.
2. **Enforce the 8 Mechanical Anti-PPT Laws**:
   - Ban `<section class="scene">` opacity/autoAlpha toggling.
   - Use a single continuous `#world` rig wrapping both `<canvas id="gl">` and `<div id="dom">` (or multi-layer `kartun-panggung` stage cuts with `J(el, tx, ty)` SVG joint rigs).
   - Keep 100% of animations frame-deterministic as pure functions of `tl.time()`, `mulberry32`, and precomputed distance integral `D(t)`.
   - Attach directional SVG `<feGaussianBlur>` (`#mb-world`) during fast whip-pans (`into`) and remove it immediately upon settling (`settle`).
   - Enforce the 1080p legibility floor (`>= 100px` hero claims, `>= 30px` minimum text floor, max 2 text hierarchy levels per beat).
3. **Mandatory Visual Audit & 60fps Export**:
   - Capture 12 keyframes and a contact sheet via `node scripts/snap-contact-sheet.mjs index.html ./snaps` and inspect every frame before final video export.
   - Render 60fps MP4 via `node scripts/export-video.mjs index.html output.mp4 --fps=60 --workers=4`.
