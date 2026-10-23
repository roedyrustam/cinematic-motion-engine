# The 8 Mechanical Anti-PPT Laws & Typography Scaling Contract
## Delapan Hukum Mekanis Anti-PPT & Kontrak Skala Tipografi

---

## 1. Why Code Animations Look Like PowerPoint (And How to Eradicate It)

A PowerPoint slide deck has five unmistakable mechanical signatures:
1. Isolated full-screen `<section class="scene">` containers stacked at `(0, 0)` that toggle visibility via `opacity` or `autoAlpha`.
2. A static or slowly zooming background completely disconnected from foreground objects.
3. Three or more levels of centered text (kicker + headline + subtitle + body paragraph + bullet list) appearing at once.
4. Elements fading in place (`y: 20 -> 0, opacity: 0 -> 1`) with identical `power2.out` easing and zero physical camera momentum.
5. Unmotivated generic SaaS templates (dark blue-purple gradients, glowing neon blobs, pill badges, and 3-column bento cards).

**Cinematic Motion Engine (Vibe Motion Pro v2.0)** enforces **8 Mechanical Anti-PPT Laws** that make slide-deck behavior physically impossible in the DOM.

---

## 2. Detailed Specification of the 8 Mechanical Laws

### Law 1 — Ban `<section class="scene">` Opacity Toggling
- **Rule**: Never create `>= 3` full-screen scene containers that transition via `opacity` or `autoAlpha`.
- **Correct Mechanism**:
  - **World Camera Traversal**: Place landmarks across `#world` (`inset: -1400px`) at distinct `(wx, wy)` coordinates (e.g., Beat 1 at `(960, 540)`, Beat 2 at `(2350, 420)`, Beat 3 at `(1840, 1680)`, Beat 4 at `(-320, 1240)`). The camera physically pans, zooms, and rotates `#world` (`into -> settle -> look -> home`).
  - **Continuous Hero Morph (*Aksi Kontinu*)**: One central SVG/3D object stays on stage and physically morphs its geometry (`attr: { d }`, stroke-dashoffset, or 3D vertex state) to become the next beat's subject while the surrounding environment scrolls past.
  - **Object-Carried Wipe**: A physical foreground object (a stamp, folder, metro train, or 3D card) passes right across the lens (`scale: 8`), wiping the frame into the next environment.

### Law 2 — Persistent Spatial Thread
- Every frame must contain at least one element that was already present 0.5s ago or will still be present 0.5s later (a coordinate grid, a continuous timeline rail, a hero object, or a stage prop).

### Law 3 — Maximum 2 Text Hierarchy Levels & 1080p Legibility Floor
- **Rule**: At any single moment, display at most **2 text hierarchy levels** (e.g., 1 Giant Claim/Metric + 1 Coordinate/Category Label).
- **Diegetic Exception**: Text printed physically inside an object (a newspaper clipping, a receipt line, a terminal command, a stamp) with `<= 3` short lines counts as part of the object texture, not a separate slide caption.
- **1080p Reference Resolution Minimum Font Sizes**:

| Role / Element | 16:9 (`1920x1080`) Floor | 9:16 (`1080x1920` inside `.safe` `scale(0.78)`) | Recommended Weight & Tracking |
| :--- | :--- | :--- | :--- |
| **Hero Number / Giant Claim** | `>= 100px` (typically `110px–220px`) | `>= 128px` | `800–900`, `letter-spacing: -0.04em`, `tabular-nums` |
| **Handwriting / Marker Callout** | `>= 48px` | `>= 62px` | `400–700`, slight rotation `-2deg..3deg` |
| **Body Claim / Secondary Line** | `>= 44px` | `>= 56px` | `600–700`, `line-height: 1.08` |
| **World Label / Axis Tag** | `>= 34px` | `>= 44px` | `600`, monospace/grotesque, `letter-spacing: 0.08em` |
| **Corner Metadata / Credit** | `>= 30px` | `>= 38px` | `500`, `tabular-nums` |

> **Hard Constraint**: Zero text nodes with `font-size < 30px` on a 1080p stage.

### Law 4 — Phrase Accretion (`3–5` Elements per Beat)
- Instead of showing `"92% OF AI PROJECTS FAIL BEFORE PRODUCTION"` as a single static paragraph:
  1. `t = 0.00s`: `[92%]` slams down (`scaleSlam`, `180px`, vermilion) with directional vertical blur.
  2. `t = 0.38s`: `[OF AI PROJECTS]` slides out from a clip mask (`wordMask`, `54px`, ink).
  3. `t = 0.72s`: `[FAIL]` stamps obliquely across the number with a red ink border (`rotate(-4deg)`, `96px`).
  4. `t = 1.10s`: `[BEFORE PRODUCTION]` highlights with a yellow multiply marker sweep (`scaleX: 0 -> 1`).
- All 4 accreted blocks hold together in a balanced composition until `t = 2.40s`, then clear via camera whip-pan to the next landmark.

### Law 5 — Living Background Motion Language (`>= 2` Surface Layers)
Select at least one primary **Background Motion Language** and pair it with a secondary texture layer:
1. **Architectural Coordinate Drift**: `1px` hairline grid + live coordinate crosshairs (`+`) that parallax at `0.35x` camera speed.
2. **Topographic Contour Morph**: Concentric SVG isolines slowly shifting phase via deterministic sine offsets.
3. **Halftone Matrix Pulse**: SVG `<pattern>` of circles whose radius modulates across the stage like a print screen.
4. **Isometric Rail Grid**: `rotateX(60deg) rotateZ(-45deg)` floor plane with travelling signal dashes (`stroke-dashoffset`).
5. **Grainy Gradient Field**: Deterministic SVG `<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="7">` blended over shifting radial color stops.
6. **Diagonal Hazard / Telemetry Tape**: Counter-scrolling typographic ticker bands at `4–8%` opacity in deep background space.
7. **Paper Cutout Parallax**: Torn archival paper edges with contact drop-shadows layered at 3 depth planes.
8. **Perspective Tunnel Grid**: Vanishing-point corridor lines converging toward the active camera target.
9. **Orbital Radar Rings**: Rotating dashed azimuth rings with degree ticks and sweeping sector arcs.
10. **Blueprint Cyanotype Ruled Sheet**: Technical millimeter subdivisions with registration marks and fold creases.
11. **Volumetric Shader Field**: Three.js / WebGPU particle lattice or signed-distance field driven by `uTime = D(tl.time())`.
12. **Theatrical Multi-Plane Stage (`kartun-panggung`)**: Sky gradient + drifting clouds + mid-ground trees/buildings + foreground stage floor.

### Law 6 — Varied Depth Transitions (No Consecutive Identical Cuts)
Never repeat the same transition twice in a row. Rotate through:
- **Camera Whip-Pan (`into` + `settle`)** with directional SVG motion blur (`stdDeviation="dx, dy"`).
- **3D Push-Through (`camThrough`)**: Camera zooms `scale: 1 -> 14` straight through an aperture (the counter of `"0"`, a browser window, a camera lens) into the next scene (maximum 1–2 times per video, only when physically motivated).
- **3D Card / Hinged Plane Flip (`rotateY(180deg)`)** with `backface-visibility: hidden` and `perspective: 1400px`.
- **Foreground Object Wipe**: A diegetic prop crosses close to the lens, obscuring the frame for `0.16s` while the scene swaps behind it.
- **SVG `clipPath` Geometry Expand**: A badge, circle, or brand polygon expands from an object's exact center to fill `1920x1080`.
- **Rack Focus + Light Leak**: Background blurs (`filter: blur(18px)`) while a warm screen-blended light leak (`mix-blend-mode: screen`, placed outside `#world`) flashes across the cut.

### Law 7 — Living Stage Anti-Miniature Law (`kartun-panggung`)
- Camera zoom on `kartun-panggung` stages must stay within **`1.08` to `1.95`** so characters fill `35%–65%` of stage height (never tiny distant stick figures).
- Every stage must have **`>= 10` simultaneously moving elements** (character walk/talk/blink cycles, swaying foliage, drifting clouds, bobbing props, flickering lamps, dust motes).

### Law 8 — Pre-Code Style Brief & Pre-Delivery Contact-Sheet Gate
- Every production starts with a 3-option Style Brief + 5-part Structural Fingerprint.
- Every production ends with `node scripts/snap-contact-sheet.mjs` + visual inspection of `contact-sheet.png`.
