---
name: cme-cartoon-puppet-rig
description: "Articulated SVG 2D character rigging, parametric walk cycles J(el, tx, ty), 8-direction head expression generators, and automatic phoneme-to-viseme lip-sync / Rigging karakter kartun 2D SVG berartikulasi, siklus jalan parametrik, generator ekspresi kepala 8-arah, dan lip-sync otomatis fonem-ke-viseme."
author: "Roedy Rustam"
version: "5.0.0"
---

# CME Cartoon Puppet Rig & Character Animator (v3.0)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview & Capabilities
`cme-cartoon-puppet-rig` is the specialized 2D character animation and puppet staging sub-skill of the **Cinematic Motion Engine**. It transforms vector SVG artwork into fully articulated cartoon puppets with nested joint hierarchies, walk cycle mathematics, head rotation sprite switching, and automated lip-sync driving mouth visemes directly from voiceover phonemes.

### 1. The Articulated SVG Joint Rig $J(el, tx, ty)$
Rigging in pure SVG requires pivot-point anchoring that respects translate and rotate orders without triggering CSS transform origin re-computation bugs:
```javascript
// Wrap SVG limb element with CME Joint Rig proxy
const hipJoint = CME.J('#char-hip', 0, 0);
const legLeft = CME.J('#char-leg-left', 20, 140);
const kneeLeft = CME.J('#char-knee-left', 22, 260);

// Animate joint rotation directly in GSAP timeline
tl.to(legLeft, { r: 35, duration: 0.4, ease: 'sine.inOut' }, 0.5);
```

### 2. Parametric Walk Cycles
Use `CME.updateWalkCycle` to drive legs, knees, arms, torso bob, and head tilt in a single mathematical function of timeline time $t$:
```javascript
const characterRig = {
  legL: CME.J('#leg-l'),
  legR: CME.J('#leg-r'),
  kneeL: CME.J('#knee-l'),
  kneeR: CME.J('#knee-r'),
  armL: CME.J('#arm-l'),
  armR: CME.J('#arm-r'),
  torso: CME.J('#torso'),
  head: CME.J('#head')
};

tl.to({}, {
  duration: 6.0,
  onUpdate: () => {
    CME.updateWalkCycle(characterRig, tl.time(), 2.8, 24);
  }
}, 0);
```

### 3. Automatic Phoneme-to-Viseme Lip-Sync
Integrate with `scripts/sync-whisper.mjs` or voiceover transcripts to drive character mouth shapes:
```javascript
import { WHISPER_WORDS } from './whisper-words.js';

// Drive mouth path SVG based on current spoken phoneme
WHISPER_WORDS.forEach((item) => {
  const viseme = CME.mapPhonemeToViseme(item.word);
  const shape = CME.VISEME_MAP[viseme];

  tl.call(() => {
    const mouth = document.querySelector('#char-mouth-path');
    if (mouth) {
      mouth.setAttribute(
        'd',
        `M ${-30 * shape.width} 0 Q 0 ${35 * shape.open} ${30 * shape.width} 0`
      );
    }
  }, null, item.start);

  // Close mouth on word completion
  tl.call(() => {
    const mouth = document.querySelector('#char-mouth-path');
    if (mouth) mouth.setAttribute('d', 'M -20 0 Q 0 2 20 0');
  }, null, item.end);
});
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ikhtisar & Kemampuan
`cme-cartoon-puppet-rig` menyediakan sistem rigging karakter kartun 2D langsung di DOM dan SVG menggunakan proksi sendi $J(el, tx, ty)$, siklus jalan matematis tanpa keyframe manual berlebih, serta sinkronisasi bentuk mulut viseme otomatis berdasarkan transkrip suara.

### Standar Staging Panggung Anti-Miniatur:
- Karakter tidak boleh terlihat kerdil di tengah kanvas kosong; pastikan kamera panggung berada pada zoom $[1.08\times, 1.95\times]$.
- Panggung wajib memiliki minimal 10 prop aktif (lampu, bayangan, tanaman, papan tulis, meja, partikel atmosfer).
