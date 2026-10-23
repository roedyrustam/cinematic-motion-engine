# The 6 Narrative Explainer Modes, VO Retiming & Phrase Accretion
## Enam Mode Video Explainer, Retiming Voiceover & Akresi Frasa

---

## 1. Architecture of a Broadcast Explainer Video

Unlike an Opener (which runs 10s–45s on visual/musical rhythm), a **Narrative Explainer** runs 30s–180s and is locked to **spoken Voiceover (`vo.mp3`) segments (`SEG` and `PARA`)**.

### The 3 Non-Negotiable Explainer Rules:
1. **Voiceover Silence Retiming (`SEG` & `PARA`)**:
   - Every visual beat is anchored to exact `[startSec, endSec]` timestamps extracted from `vo.mp3` via `scripts/vo-fft-analyzer.html`.
   - Major camera transitions (`into` + `settle`) occur inside the natural breath/silence gaps between paragraphs (`PARA`).
2. **Phrase Accretion (`3–5` Elements per Beat)**:
   - Never display a static wall of text while the narrator talks for 6 seconds.
   - As each clause of a sentence is spoken (`SEG[i]`), a new visual or typographic block accretes onto the stage (`slam`, `block`, `multiply`), building a complete diagram by the end of the sentence.
3. **Interactive UI Camera Tracker (`camTo` / `camWide`)**:
   - When explaining software UI, workflows, or dashboards, the camera actively zooms onto the specific button, input, or chart being discussed (`camTo('#btn-submit', 2.1, 0.45)`), then pulls back (`camWide(0.55)`) to show the system-wide effect.

---

## 2. Comparison of the 6 Explainer Modes

| Mode ID | Name (ID / EN) | Starter Template | Visual Signature & Surface | Typography & Motion |
| :--- | :--- | :--- | :--- | :--- |
| **1. `aksi-kontinu`** | **Aksi Kontinu** (Continuous Hero Action) | `assets/starter-explainer.html` | Deep architectural slate or warm studio grid; a single central SVG/3D hero object morphs continuously from beat to beat. | Bold sans (`Space Grotesk` / `Syne`) + mono (`JetBrains Mono`). Smooth `expo.out` morphs + directional whip-pans. |
| **2. `kartun-kolase`** | **Kartun Kolase** (Tactile Paper Cutout) | `assets/starter-explainer-kolase.html` | Textured craft/archival paper background, cutout illustrations/photos with thick `6px` white paper rims and hard drop-shadows. | Poster ransom/display (`Fraunces` + `Plus Jakarta Sans`). Stop-motion `steps(4)` or `back.out(1.8)` snappy pops. |
| **3. `jurnalisme-visual`** | **Jurnalisme Visual** (Vox / Archival Doc) | `assets/starter-explainer-kolase.html` | Warm newsprint cream (`#F4EFE6`), scanned document clippings, highlighter marker sweeps (`mix-blend-mode: multiply`), red string maps. | Editorial serif (`Instrument Serif`) + grotesque sans + typewriter mono. Highlighter `scaleX` reveals & camera rostrum pans. |
| **4. `katalog-putih`** | **Katalog Putih** (Clean Studio Catalog) | `assets/starter-explainer-katalog.html` | Pure cyclorama white (`#F8F9FA`), subtle `1px` architectural hairlines, floating isometric cards with soft contact shadows. | Swiss neo-grotesque (`Plus Jakarta Sans` + `JetBrains Mono`). Precision `expo.out` slides, exploding 3D isometric layer stacks. |
| **5. `sketsa-vintage`** | **Sketsa Vintage** (Blueprint & Ink Sketch) | `assets/starter-explainer-sketsa.html` | Warm Da Vinci parchment (`#EFE6D5`) or cyanotype blueprint (`#0D2238`), hand-drawn SVG paths (`stroke-dashoffset`), ink wash fills. | Handwritten (`Caveat` `>= 48px`) + `Instrument Serif`. Live stroke drawing & compass arcs. |
| **6. `kartun-panggung`** | **Kartun Panggung** (Living 2D Stage) | `assets/starter-explainer-panggung.html` | Full-color multi-plane illustrated world (sky, backdrop, mid-stage props, foreground). **Zero text captions on screen.** | Diegetic props only (signs, labels on boxes). Articulated `J(el, tx, ty)` character limbs, walk/talk cycles, camera cuts (`zoom 1.08–1.95`). |

---

## 3. Phrase Accretion Helpers (`slam`, `block`, `multiply`)

Use these three canonical helpers inside explainers so every spoken clause physically constructs the visual argument:

```javascript
// 1. SLAM: Heavy impact claim/number with vertical motion blur and subtle overshoot
function slam(tl, el, at, { dur = 0.28, fromY = -90, scaleFrom = 1.35 } = {}) {
  tl.set(el, { autoAlpha: 1 }, at);
  tl.fromTo(
    el,
    { y: fromY, scale: scaleFrom, autoAlpha: 0 },
    { y: 0, scale: 1, autoAlpha: 1, duration: dur, ease: 'back.out(1.7)' },
    at
  );
}

// 2. BLOCK: Crisp masked wipe-in for supporting clauses, badges, or diagram cards
function block(tl, el, at, { dur = 0.34, dir = 'left' } = {}) {
  const clipStart =
    dir === 'left'   ? 'inset(0 100% 0 0)' :
    dir === 'right'  ? 'inset(0 0 0 100%)' :
    dir === 'bottom' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
  tl.set(el, { autoAlpha: 1, clipPath: clipStart }, at);
  tl.to(el, { clipPath: 'inset(0 0% 0 0%)', duration: dur, ease: 'expo.out' }, at);
}

// 3. MULTIPLY: Highlighter marker sweep (mix-blend-mode: multiply on light paper, or screen on dark)
function multiply(tl, barEl, at, { dur = 0.32 } = {}) {
  tl.set(barEl, { autoAlpha: 1, transformOrigin: '0% 50%', scaleX: 0 }, at);
  tl.to(barEl, { scaleX: 1, duration: dur, ease: 'power3.out' }, at);
}
```

---

## 4. Interactive UI Camera Tracker (`camTo` & `camWide`)

When animating an explainer that walks through an interface or diagram, never leave the camera static at `scale(1)`. Compute the exact bounding center of the target element relative to `#world` and pan/zoom directly to it:

```javascript
function camTo(tl, selectorOrEl, at, { scale = 1.85, dur = 0.55, rot = 0, offsetX = 0, offsetY = 0 } = {}) {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return;
  const wx = parseFloat(el.dataset.wx || el.offsetLeft || 960) + (el.offsetWidth || 0) / 2 + offsetX;
  const wy = parseFloat(el.dataset.wy || el.offsetTop  || 540) + (el.offsetHeight || 0) / 2 + offsetY;
  into(tl, at, wx, wy, scale * 0.92, rot * 0.5, dur * 0.45);
  settle(tl, at + dur * 0.45, wx, wy, scale, rot, dur * 0.55);
}

function camWide(tl, at, { dur = 0.65 } = {}) {
  home(tl, at, dur);
}
```

---

## 5. Voiceover Silence & FFT Beat Workflow (`vo-fft-analyzer.html`)

When a user provides `vo.mp3` (or any narration track):
1. Open `scripts/vo-fft-analyzer.html` (or run headless audio extraction) to detect silence intervals (`>= 180ms` below `-38dB`).
2. Copy the generated `PARA` (paragraph windows) and `SEG` (clause windows) constants into `index.html`:
   ```javascript
   const PARA = [
     { id: 'p1', start: 0.12, end: 4.85, text: 'Most cloud bills double every year because idle containers never sleep.' },
     { id: 'p2', start: 5.20, end: 10.40, text: 'Our reactive autoscaler freezes cold nodes in twelve milliseconds.' }
   ];
   const SEG = [
     { p: 'p1', i: 0, start: 0.12, end: 1.90, text: 'Most cloud bills double every year' },
     { p: 'p1', i: 1, start: 2.05, end: 4.85, text: 'because idle containers never sleep.' },
     { p: 'p2', i: 0, start: 5.20, end: 7.80, text: 'Our reactive autoscaler freezes cold nodes' },
     { p: 'p2', i: 1, start: 7.95, end: 10.40, text: 'in twelve milliseconds.' }
   ];
   ```
3. Schedule camera transitions (`into` + `settle`) inside the silence gap between `PARA[0].end` (`4.85s`) and `PARA[1].start` (`5.20s`), and schedule `slam` / `block` / `multiply` at each `SEG[k].start`.
