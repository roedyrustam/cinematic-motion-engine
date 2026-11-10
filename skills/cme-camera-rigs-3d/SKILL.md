---
name: cme-camera-rigs-3d
description: "Continuous spatial #world camera rigs, directional SVG motion blur, monotonic speed-ramp D(t), and WebGPU/Three.js camera coordination / Rig kamera dunia spasial kontinu, blur arah SVG, integral kecepatan monoton D(t), dan koordinasi kamera WebGPU/Three.js."
author: "Roedy Rustam"
version: "5.0.0"
---

# CME Camera Rigs & 3D WebGPU Director (v3.0)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview & Capabilities
`cme-camera-rigs-3d` is the specialized spatial animation and camera director sub-skill of the **Cinematic Motion Engine**. It eliminates slide transitions by anchoring all graphic landmarks at real 2D/3D world coordinates on a single continuous canvas (`#world`) and moving a unified physical camera rig between them with realistic inertia, directional motion blur, and speed-ramped time functions.

### 1. The Core Architecture: `#world` Coordinate Geometry
In a Cinematic Motion Engine scene, the stage is a unified world wrapper with generous negative insets (e.g. `inset: -1400px`):
```html
<div id="stage">
  <div id="world">
    <!-- 3D WebGL / WebGPU Canvas Layer -->
    <canvas id="gl"></canvas>
    <!-- DOM Graphics & Typography Layer -->
    <div id="dom">
      <div class="landmark" data-wx="960" data-wy="540">Origin Landmark</div>
      <div class="landmark" data-wx="2800" data-wy="1400">Feature Landmark</div>
    </div>
  </div>
</div>
```

### 2. Physical 4-Phase Camera Flight Pattern
Every camera transition between landmarks follows the canonical 4-beat rhythm:
1. **`into` (Whip-Pan Acceleration)**: High-speed departure (`ease: 'expo.in'`, $0.26\text{s}$) with directional blur attached.
2. **`settle` (Elastic Overshoot)**: Immediate deceleration at landmark (`ease: 'expo.out'`, $0.28\text{s}$), detaching SVG blur upon arrival (`stdDeviation="0 0"`).
3. **`look` (Drift)**: Subtle organic drift (`ease: 'sine.inOut'`, $1.5\text{s} - 2.5\text{s}$) while reading content.
4. **`home` (Wide Re-Centering)**: Smooth return to macro overview (`ease: 'power3.inOut'`).

```javascript
const camera = CME.createCameraRig({
  worldSelector: '#world',
  blurNodeSelector: '#mb-world-node',
  blurFilterId: 'mb-world'
});

// Move camera to target world coordinates
camera.into(tl, 0.50, 2400, 1100, 1.45);
camera.settle(tl, 0.76, 2400, 1100, 1.20);
camera.look(tl, 1.04, 2420, 1110, 1.22, 2.0);
```

### 3. Monotonic Speed-Ramp Distance Integral $D(t)$
When 3D shaders or particle systems decelerate or speed up, never pass raw time $t \cdot \text{speed}(t)$ to shader uniforms; doing so causes the animation to jump or run backward.
Always use `CME.createSpeedRampTable`:
```javascript
// Precompute monotonic integral table
const D = CME.createSpeedRampTable(DURATION, (t) => {
  if (t < 2.0) return 0.2;        // Slow intro drift
  if (t < 3.0) return 4.5;        // Hyper-drive whip
  return 1.0;                     // Normal cruise
});

// In render loop / GSAP timeline:
tl.to({}, {
  duration: DURATION,
  onUpdate: () => {
    const t = tl.time();
    material.uniforms.uTime.value = D(t);
  }
}, 0);
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ikhtisar & Kemampuan
`cme-camera-rigs-3d` mengatur pergerakan kamera sinematik dunia kontinu (`#world`), motion blur directional berbasis SVG, serta kurva kecepatan integral $D(t)$ untuk Three.js dan WebGPU.

### Aturan Utama:
- Jangan pernah menyembunyikan scene dengan `opacity: 0` bergantian. Semua objek diletakkan di koordinat dunia `(wx, wy)` yang nyata.
- Motion blur hanya aktif selama akselerasi cepat dan WAJIB dicopot (`filter: none`) saat kamera berhenti membaca teks.
