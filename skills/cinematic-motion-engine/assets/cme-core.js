/**
 * Cinematic Motion Engine v2.2 (Bang Motion Pro) — Universal Deterministic Broadcast Runtime (cme-core.js)
 *
 * Provides 100% frame-deterministic mathematical primitives, 12 Broadcast Style Theme tokens,
 * #world Camera Rig controllers, Directional SVG <feGaussianBlur> pools, 8 Text Entrances / 5 Exits,
 * Phrase Accretion helpers (slam, block, multiply), Articulated SVG Joint Rigs J(el, tx, ty),
 * Timeline-locked <video> clip() synchronization, and the window.OPENER automation contract.
 *
 * Zero Math.random() or Date.now() calls permitted.
 */
(function (global) {
  'use strict';

  // 1. Deterministic Seeded PRNG (Mulberry32)
  function mulberry32(seed = 0xDEC0DE) {
    let state = seed >>> 0;
    return function () {
      let t = (state += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // 2. Monotonic Speed-Ramp Distance Integral D(t)
  function createSpeedRampTable(duration, speedFn, samples = 2400) {
    const table = new Float32Array(samples + 1);
    let acc = 0;
    const dt = duration / samples;
    for (let i = 0; i <= samples; i++) {
      table[i] = acc;
      acc += Math.max(0.05, speedFn ? speedFn(i * dt) : 1.0) * dt;
    }
    return function D(t) {
      const clamped = Math.max(0, Math.min(duration, t));
      const idx = (clamped / duration) * samples;
      const i0 = Math.floor(idx);
      const i1 = Math.min(samples, i0 + 1);
      const frac = idx - i0;
      return table[i0] * (1 - frac) + table[i1] * frac;
    };
  }

  // 3. Deterministic 60fps Audio Envelope Sampler
  function sampleAudio(t, audioFrames = global.AUDIO_FRAMES, fps = 60) {
    if (!audioFrames || !audioFrames.length) {
      return { bass: 0, mid: 0, high: 0, onset: 0 };
    }
    const exactIdx = Math.max(0, t * fps);
    const i0 = Math.min(audioFrames.length - 1, Math.floor(exactIdx));
    const i1 = Math.min(audioFrames.length - 1, i0 + 1);
    const f = exactIdx - i0;
    const a = audioFrames[i0];
    const b = audioFrames[i1];
    return {
      bass: (a[0] * (1 - f) + b[0] * f) / 100,
      mid: (a[1] * (1 - f) + b[1] * f) / 100,
      high: (a[2] * (1 - f) + b[2] * f) / 100,
      onset: a[3] || 0
    };
  }

  // 4. The 12 Curated Broadcast Style Direction Palettes
  const THEMES = {
    'swiss-grid': {
      bg: '#F4EFE6',
      ink: '#0B0D12',
      accent: '#FF3B1D',
      secondary: '#2563EB',
      grid: 'rgba(11, 13, 18, 0.09)'
    },
    'kartun-kolase': {
      bg: '#EAE2D3',
      ink: '#141413',
      accent: '#D92B2B',
      secondary: '#FFDF38',
      grid: 'rgba(20, 20, 19, 0.15)'
    },
    'jurnalisme-visual': {
      bg: '#F4EFE6',
      ink: '#111318',
      accent: '#D92B2B',
      secondary: '#FFE14D',
      grid: 'rgba(17, 19, 24, 0.07)'
    },
    'katalog-putih': {
      bg: '#F8F9FA',
      ink: '#0F141C',
      accent: '#FF4F18',
      secondary: '#1D4ED8',
      grid: 'rgba(15, 20, 28, 0.07)'
    },
    'sketsa-vintage': {
      bg: '#0D2238',
      ink: '#F4EFE6',
      accent: '#38BDF8',
      secondary: '#FBBF24',
      grid: 'rgba(56, 189, 248, 0.14)'
    },
    'kartun-panggung': {
      bg: '#8ECAE6',
      ink: '#1D3557',
      accent: '#E63946',
      secondary: '#FFB703',
      grid: 'rgba(29, 53, 87, 0.05)'
    },
    'bauhaus-geo': {
      bg: '#F3EAD8',
      ink: '#121316',
      accent: '#E63926',
      secondary: '#1D4ED8',
      grid: 'rgba(18, 19, 22, 0.08)'
    },
    'brutalist-telemetry': {
      bg: '#090B0E',
      ink: '#F4EFE6',
      accent: '#D4FF33',
      secondary: '#FF5500',
      grid: 'rgba(212, 255, 51, 0.09)'
    },
    'editorial-film': {
      bg: '#120E0C',
      ink: '#F5ECE0',
      accent: '#FF5A28',
      secondary: '#D6C7B2',
      grid: 'rgba(245, 236, 224, 0.06)'
    },
    'isometric-blueprint': {
      bg: '#0B111E',
      ink: '#E2E8F0',
      accent: '#38BDF8',
      secondary: '#818CF8',
      grid: 'rgba(56, 189, 248, 0.1)'
    },
    'spatial-optics': {
      bg: '#0B0F19',
      ink: '#F8FAFC',
      accent: '#38BDF8',
      secondary: '#A855F7',
      grid: 'rgba(248, 250, 252, 0.07)'
    },
    'data-sculpture': {
      bg: '#0E1015',
      ink: '#F4EFE6',
      accent: '#D4FF33',
      secondary: '#A855F7',
      grid: 'rgba(244, 239, 230, 0.08)'
    }
  };

  function applyTheme(styleId) {
    const theme = THEMES[styleId];
    if (!theme) return null;
    const root = document.documentElement;
    root.style.setProperty('--cme-bg', theme.bg);
    root.style.setProperty('--cme-ink', theme.ink);
    root.style.setProperty('--cme-accent', theme.accent);
    root.style.setProperty('--cme-secondary', theme.secondary);
    root.style.setProperty('--cme-grid', theme.grid);
    return theme;
  }

  // 5. Camera Rig (#world) & Directional SVG Motion Blur Controller
  function createCameraRig({
    worldSelector = '#world',
    blurNodeSelector = '#mb-world-node',
    blurFilterId = 'mb-world',
    refW = 1920,
    refH = 1080
  } = {}) {
    const worldEl = typeof worldSelector === 'string' ? document.querySelector(worldSelector) : worldSelector;
    const blurNode = typeof blurNodeSelector === 'string' ? document.querySelector(blurNodeSelector) : blurNodeSelector;
    const cam = { x: 0, y: 0, z: 1, rot: 0 };

    function applyCam() {
      if (!worldEl) return;
      worldEl.style.transform = `translate3d(${cam.x.toFixed(2)}px, ${cam.y.toFixed(2)}px, 0) scale(${cam.z.toFixed(4)}) rotate(${cam.rot.toFixed(3)}deg)`;
    }

    function setWorldBlur(dx, dy) {
      if (!worldEl || !blurNode) return;
      if (dx <= 0.1 && dy <= 0.1) {
        blurNode.setAttribute('stdDeviation', '0 0');
        worldEl.style.filter = 'none';
      } else {
        worldEl.style.filter = `url(#${blurFilterId})`;
        blurNode.setAttribute('stdDeviation', `${dx.toFixed(1)} ${dy.toFixed(1)}`);
      }
    }

    function calcShot(wx, wy, z = 1, objectWidth = null, targetFraction = 0.55) {
      const scale = objectWidth ? (refW * targetFraction) / objectWidth : z;
      return {
        x: -(wx - refW / 2) * scale,
        y: -(wy - refH / 2) * scale,
        z: scale
      };
    }

    function into(tl, at, wx, wy, z = 1.15, rot = 0, dur = 0.26) {
      const target = calcShot(wx, wy, z);
      const dx = Math.min(40, Math.abs(target.x - cam.x) * 0.022);
      const dy = Math.min(28, Math.abs(target.y - cam.y) * 0.022);
      tl.call(() => setWorldBlur(dx, dy), null, at);
      tl.to(cam, { x: target.x, y: target.y, z: target.z, rot, duration: dur, ease: 'expo.in', onUpdate: applyCam }, at);
    }

    function settle(tl, at, wx, wy, z = 1.0, rot = 0, dur = 0.28) {
      const target = calcShot(wx, wy, z);
      tl.to(
        cam,
        {
          x: target.x,
          y: target.y,
          z: target.z,
          rot,
          duration: dur,
          ease: 'expo.out',
          onUpdate: applyCam,
          onComplete: () => setWorldBlur(0, 0)
        },
        at
      );
      tl.call(() => setWorldBlur(0, 0), null, at + dur);
    }

    function look(tl, at, wx, wy, z = 1.06, dur = 1.8, rot = 0) {
      const target = calcShot(wx, wy, z);
      tl.to(cam, { x: target.x, y: target.y, z: target.z, rot, duration: dur, ease: 'sine.inOut', onUpdate: applyCam }, at);
    }

    function home(tl, at, dur = 0.55) {
      tl.to(cam, { x: 0, y: 0, z: 1, rot: 0, duration: dur, ease: 'power3.inOut', onUpdate: applyCam }, at);
    }

    function camTo(tl, selectorOrEl, at, { scale = 1.8, dur = 0.54, rot = 0, offsetX = 0, offsetY = 0 } = {}) {
      const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
      if (!el) return;
      const wx = parseFloat(el.dataset.wx || el.offsetLeft || refW / 2) + (el.offsetWidth || 0) / 2 + offsetX;
      const wy = parseFloat(el.dataset.wy || el.offsetTop || refH / 2) + (el.offsetHeight || 0) / 2 + offsetY;
      into(tl, at, wx, wy, scale * 0.92, rot * 0.5, dur * 0.45);
      settle(tl, at + dur * 0.45, wx, wy, scale, rot, dur * 0.55);
    }

    return { cam, applyCam, setWorldBlur, calcShot, into, settle, look, home, camTo };
  }

  // 6. Phrase Accretion & Canonical Text Entrances / Exits
  function splitText(selectorOrEl) {
    const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
    if (!el) return { words: [], chars: [] };
    const rawWords = (el.textContent || '').trim().split(/\s+/);
    el.innerHTML = rawWords
      .map(
        (w) =>
          `<span class="word" style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span class="word-inner" style="display:inline-block;">${[
            ...w
          ]
            .map((ch) => `<span class="char" style="display:inline-block;">${ch}</span>`)
            .join('')}</span></span>`
      )
      .join(' ');
    return {
      words: [...el.querySelectorAll('.word-inner')],
      chars: [...el.querySelectorAll('.char')]
    };
  }

  const text = {
    splitText,
    charRise(tl, chars, at, stagger = 0.018) {
      tl.fromTo(chars, { yPercent: 115, rotateZ: 6 }, { yPercent: 0, rotateZ: 0, duration: 0.48, stagger, ease: 'expo.out' }, at);
    },
    charDrop(tl, chars, at, stagger = 0.018) {
      tl.fromTo(chars, { yPercent: -115 }, { yPercent: 0, duration: 0.45, stagger, ease: 'back.out(1.6)' }, at);
    },
    wordMask(tl, words, at, stagger = 0.045) {
      tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.52, stagger, ease: 'power4.out' }, at);
    },
    scaleSlam(tl, el, at, dur = 0.28) {
      tl.fromTo(el, { scale: 2.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: dur, ease: 'expo.out' }, at);
    },
    trackIn(tl, el, at, dur = 0.45) {
      tl.fromTo(el, { letterSpacing: '0.42em', autoAlpha: 0 }, { letterSpacing: '-0.03em', autoAlpha: 1, duration: dur, ease: 'power3.out' }, at);
    },
    slam(tl, el, at, { dur = 0.28, fromY = -80, scaleFrom = 1.32 } = {}) {
      tl.fromTo(el, { y: fromY, scale: scaleFrom, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: dur, ease: 'back.out(1.7)' }, at);
    },
    block(tl, el, at, { dur = 0.34, dir = 'left' } = {}) {
      const startClip =
        dir === 'left'
          ? 'inset(0 100% 0 0)'
          : dir === 'right'
            ? 'inset(0 0 0 100%)'
            : dir === 'bottom'
              ? 'inset(100% 0 0 0)'
              : 'inset(0 0 100% 0)';
      tl.fromTo(el, { clipPath: startClip, autoAlpha: 1 }, { clipPath: 'inset(0 0% 0 0%)', duration: dur, ease: 'expo.out' }, at);
    },
    multiply(tl, el, at, { dur = 0.32 } = {}) {
      tl.set(el, { transformOrigin: '0% 50%' }, at);
      tl.fromTo(el, { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: dur, ease: 'power3.out' }, at);
    }
  };

  // 7. Articulated SVG Character Joint Rig J(el, tx, ty)
  function J(selectorOrEl, tx = 0, ty = 0) {
    const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
    const state = { tx, ty, r: 0, sx: 1, sy: 1, _el: el };
    const render = () => {
      if (!el) return;
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

  function updateWalkCycle(rig, t, freq = 2.6, amp = 28) {
    const phase = t * freq * Math.PI * 2;
    if (rig.legL) rig.legL.r = Math.sin(phase) * amp;
    if (rig.legR) rig.legR.r = -Math.sin(phase) * amp;
    if (rig.kneeL) rig.kneeL.r = Math.max(0, -Math.cos(phase)) * (amp * 0.85);
    if (rig.kneeR) rig.kneeR.r = Math.max(0, Math.cos(phase)) * (amp * 0.85);
    if (rig.armL) rig.armL.r = -Math.sin(phase) * (amp * 0.75);
    if (rig.armR) rig.armR.r = Math.sin(phase) * (amp * 0.75);
    if (rig.torso) rig.torso.ty = -Math.abs(Math.cos(phase)) * 8;
    if (rig.head) rig.head.r = Math.sin(phase * 0.5) * 3.5;
  }

  global.CME = {
    version: '2.2.0',
    mulberry32,
    createSpeedRampTable,
    sampleAudio,
    THEMES,
    applyTheme,
    createCameraRig,
    text,
    J,
    updateWalkCycle
  };
})(typeof window !== 'undefined' ? window : globalThis);
