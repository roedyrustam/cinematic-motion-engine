# Advanced Motion Techniques, Shaders, Footage & Grainy Surfaces
## Teknik Motion Tingkat Lanjut, Shader, Footage Video & Tekstur Grain

---

## 1. The 8 Canonical Text Entrances & 5 Text Exits

Never use plain `opacity: 0 -> 1` on headlines. Split text into `.char`, `.word`, or `.line` spans and rotate across these **8 Entrances** and **5 Exits**:

### 8 Entrances:
1. **`charRise(tl, chars, at)`**: Characters rise from `yPercent: 115, rotateZ: 6` inside an `overflow: hidden` line wrapper (`stagger: 0.018`, `expo.out`).
2. **`charDrop(tl, chars, at)`**: Characters drop from `yPercent: -115` with `back.out(1.6)` bounce on impact.
3. **`wordMask(tl, words, at)`**: Words reveal from bottom mask (`yPercent: 105 -> 0`, `stagger: 0.045`, `power4.out`).
4. **`wordSlide(tl, words, at)`**: Words whip in horizontally (`x: 90 -> 0`) with directional SVG motion blur (`blurTween`).
5. **`lineMask(tl, lines, at)`**: Full lines rise out of masked baselines with a `0.08s` stagger.
6. **`clipWipe(tl, el, at)`**: Element unmasks via `clipPath: 'inset(0 100% 0 0)' -> 'inset(0 0% 0 0%)'` (`expo.inOut`).
7. **`scaleSlam(tl, el, at)`**: Giant number or word drops from `scale: 2.2, autoAlpha: 0` to `scale: 1` (`expo.out`, `0.24s`) triggering a micro camera shake.
8. **`trackIn(tl, el, at)`**: Wide letter-spacing (`letterSpacing: '0.45em'`) compresses to `-0.03em` (`power3.out`).

### 5 Exits:
1. **`exitUp(tl, chars, at)`**: Characters accelerate upward (`yPercent: -115`, `power3.in`, `stagger: 0.012`).
2. **`exitScatter(tl, chars, at)`**: Characters scatter along deterministic radial vectors `(dx, dy, drot)` seeded by `mulberry32`.
3. **`exitClip(tl, el, at)`**: Element collapses right-to-left via `clipPath: 'inset(0 0 0 100%)'` (`expo.in`).
4. **`exitTrackOut(tl, el, at)`**: Letter-spacing expands rapidly while `scaleY` compresses to `0`.
5. **`exitFadeDown(tl, words, at)`**: Words drop through their baseline mask (`yPercent: 110`, `power2.in`).

---

## 2. Deterministic SVG Grainy Gradient Surface (`feTurbulence`)

To create rich editorial/broadcast surfaces that never band in MP4 compression and remain 100% deterministic across headless renders:

```html
<svg width="0" height="0" style="position:absolute">
  <defs>
    <!-- Deterministic Film Grain Overlay -->
    <filter id="film-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="42" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="monoNoise"/>
      <feComponentTransfer in="monoNoise" result="alphaNoise">
        <feFuncA type="linear" slope="0.065"/>
      </feComponentTransfer>
      <feBlend mode="overlay" in="SourceGraphic" in2="alphaNoise"/>
    </filter>

    <!-- Directional Motion Blur Pool (Expanded Region so Fast Glyphs Never Clip) -->
    <filter id="mb-world" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur id="mb-world-node" in="SourceGraphic" stdDeviation="0 0"/>
    </filter>
  </defs>
</svg>
```

---

## 3. Speed-Ramped Three.js / WebGPU Shader Integration (`D(t)`)

When embedding a Three.js `<canvas id="gl">` inside `#world`:
1. Size the renderer to `1920x1080` (`pixelRatio: 1` for deterministic capture).
2. Drive all shader uniforms and mesh rotations from `D(tl.time(), DURATION)` + `sampleAudio(tl.time(), AUDIO_FRAMES)`:

```javascript
function syncThreeScene(t) {
  const d = D(t, DURATION);
  const audio = sampleAudio(t, window.AUDIO_FRAMES);
  uniforms.uTime.value = d;
  uniforms.uBass.value = audio.bass;
  uniforms.uMid.value  = audio.mid;
  heroMesh.rotation.y  = d * 0.45;
  heroMesh.rotation.x  = Math.sin(d * 0.3) * 0.22;
  renderer.render(scene, camera);
}
```

---

## 4. Timeline-Locked `<video>` Footage Layer (`clip()`)

To embed real video footage, screen recordings, or AI video plates (Higgsfield / Kling / Runway) inside `#world` so they play smoothly in browser preview AND seek frame-accurately during `export-video.mjs`:

```javascript
const CLIPS = [];

function clip({ src, el, startAt = 0, inPoint = 0, rate = 1 }) {
  const video = typeof el === 'string' ? document.querySelector(el) : el;
  video.src = src;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  const entry = { video, startAt, inPoint, rate, ready: false };
  video.addEventListener('loadeddata', () => { entry.ready = true; }, { once: true });
  video.load();
  CLIPS.push(entry);
  return entry;
}

async function syncClipsToTime(t, isCapturing = false) {
  const tasks = CLIPS.map(async (c) => {
    const localT = (t - c.startAt) * c.rate + c.inPoint;
    if (localT < c.inPoint || localT > (c.video.duration || 999)) return;
    if (Math.abs(c.video.currentTime - localT) > (isCapturing ? 0.008 : 0.12)) {
      c.video.currentTime = localT;
      if (isCapturing) {
        await new Promise((res) => {
          const done = () => { c.video.removeEventListener('seeked', done); res(); };
          c.video.addEventListener('seeked', done);
          setTimeout(done, 120);
        });
      }
    }
  });
  await Promise.all(tasks);
}
```

---

## 5. Responsive Multi-Aspect Ratio Adaptation (`16:9`, `9:16`, `1:1`)

Use URL query `?ratio=9x16` or `?ratio=1x1` (or CSS custom properties) to adapt a composition without rewriting coordinates:
- **16:9 (`1920x1080`)**: Default stage. Safe zone `[160..1760] x [100..980]`.
- **9:16 (`1080x1920`)**: Wrap `#world` in `<div class="safe" style="transform: scale(0.78); transform-origin: 50% 50%;">` and scale font sizes by `1.28x` (`calc(var(--fs) * 1.28)`), stacking horizontal 2-column layouts into vertical top/bottom splits.
- **1:1 (`1080x1080`)**: Safe zone `[90..990] x [90..990]`, scale `#world` by `0.86`.
