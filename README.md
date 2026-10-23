# 🎬 Cinematic Motion Engine

> **Standalone Broadcast Programmatic Motion Graphics, Kinetic Typography, Living Cartoon Stage & 60fps Video Engine for AI Agents**
> *(Antigravity · Claude Code · Cursor · OpenAI Codex · Gemini CLI)*

[![Version](https://img.shields.io/badge/version-2.2.0-orange)](https://github.com/roedyrustam/cinematic-motion-engine/releases/tag/v2.2.0)
[![Engine](https://img.shields.io/badge/Engine-GSAP_3.12_%2B_Three.js_%2B_FFmpeg-34D399)](https://github.com/roedyrustam/cinematic-motion-engine)
[![Output](https://img.shields.io/badge/Output-1080p_%2F_9%3A16_%40_60fps_MP4_ProRes_WebM-F5B952)](https://github.com/roedyrustam/cinematic-motion-engine)

![Cinematic Motion Engine — 12 Broadcast Style Directions](./docs/gallery/style-gallery-overview.png)

[English](#english) | [Style Gallery](#-visual-style-gallery--6-official-starters) | [Prompting Guide](#-ai-prompting-guide--cookbook-examples) | [Bahasa Indonesia](#bahasa-indonesia) | [Contoh Prompting (ID)](#-panduan-prompting-ai--contoh-resep-siap-pakai)

---

<a name="english"></a>
## English

**Cinematic Motion Engine** is a standalone AI skill and plugin that transforms AI coding assistants into a **broadcast motion graphics studio**. Instead of generating slide-deck fade animations, it enforces **8 Mechanical Anti-PPT Structural Laws**, a continuous `#world` spatial camera rig (`into -> settle -> look -> home`), directional SVG `<feGaussianBlur>` motion blur, deterministic `D(t)` speed-ramped 3D shaders, articulated SVG character joint rigs (`J(el, tx, ty)`), automated Anti-PPT DOM telemetry & contact-sheet verification, and multi-worker / zero-disk pipe **60fps visually lossless MP4 / ProRes 4444 / WebM Alpha export**.

---

## 🎨 Visual Style Gallery & 6 Official Starters

### 1. The 6 Official Production Starters (`assets/starter-*.html`)

| 1. Launch Opener & 3D Shader Rig (`starter-opener.html`) | 2. Aksi Kontinu & Phrase Accretion (`starter-explainer.html`) |
| :---: | :---: |
| ![Starter Opener](./docs/gallery/starter-opener.png) | ![Starter Explainer](./docs/gallery/starter-explainer.png) |
| **Speed-ramped `D(t)` 3D particle lattice + directional SVG motion blur** | **VO `SEG`/`PARA` synchronization + `slam` / `block` / `multiply` accretion** |

| 3. Living Cartoon Stage (`starter-explainer-panggung.html`) | 4. Paper Collage & Visual Journalism (`starter-explainer-kolase.html`) |
| :---: | :---: |
| ![Starter Panggung](./docs/gallery/starter-explainer-panggung.png) | ![Starter Kolase](./docs/gallery/starter-explainer-kolase.png) |
| **Articulated SVG Joint Rig `J(el, tx, ty)` + 10+ moving stage props** | **Tactile paper cutout rims + `steps(5)` stop-motion + red yarn evidence map** |

| 5. Clean White Studio Catalog (`starter-explainer-katalog.html`) | 6. Vintage Blueprint & Sketch (`starter-explainer-sketsa.html`) |
| :---: | :---: |
| ![Starter Katalog](./docs/gallery/starter-explainer-katalog.png) | ![Starter Sketsa](./docs/gallery/starter-explainer-sketsa.png) |
| **Pure `#F8F9FA` cyclorama + 3D Isometric Exploded-View layer stack** | **Cyanotype `#0D2238` blueprint grid + live SVG `stroke-dashoffset` schematics** |

---

### 2. The 12 Curated Broadcast Style Directions (`assets/style-gallery.html`)

| `01 · swiss-grid` | `02 · kartun-kolase` | `03 · jurnalisme-visual` |
| :---: | :---: | :---: |
| ![Swiss Grid](./docs/gallery/style-01-swiss-grid.png) | ![Kartun Kolase](./docs/gallery/style-02-kartun-kolase.png) | ![Jurnalisme Visual](./docs/gallery/style-03-jurnalisme-visual.png) |
| **Stark `1px` hairlines, vermilion & ivory** | **Cutout paper rims & `steps(4)` jitter** | **Vox archival cream & multiply marker** |

| `04 · katalog-putih` | `05 · sketsa-vintage` | `06 · kartun-panggung` |
| :---: | :---: | :---: |
| ![Katalog Putih](./docs/gallery/style-04-katalog-putih.png) | ![Sketsa Vintage](./docs/gallery/style-05-sketsa-vintage.png) | ![Kartun Panggung](./docs/gallery/style-06-kartun-panggung.png) |
| **Studio cyclorama & exploded 3D cards** | **Cyanotype blueprint & live stroke draw** | **2.5D theatrical stage & `J()` joint rigs** |

| `07 · bauhaus-geo` | `08 · brutalist-telemetry` | `09 · editorial-film` |
| :---: | :---: | :---: |
| ![Bauhaus Geo](./docs/gallery/style-07-bauhaus-geo.png) | ![Brutalist Telemetry](./docs/gallery/style-08-brutalist-telemetry.png) | ![Editorial Film](./docs/gallery/style-09-editorial-film.png) |
| **Primary geometric constructivism** | **Acid lime `#D4FF33` oscilloscope matrix** | **35mm halation glow & italic editorial serif** |

| `10 · isometric-blueprint` | `11 · spatial-optics` | `12 · data-sculpture` |
| :---: | :---: | :---: |
| ![Isometric Blueprint](./docs/gallery/style-10-isometric-blueprint.png) | ![Spatial Optics](./docs/gallery/style-11-spatial-optics.png) | ![Data Sculpture](./docs/gallery/style-12-data-sculpture.png) |
| **True `30°/60°` extruded data pipelines** | **Specular glass rim & rack-focus depth** | **`AUDIO_FRAMES` FFT monolith bar architecture** |

> 💡 **Regenerate Gallery Anytime**: Run `npm run gallery` (`node scripts/generate-gallery.mjs`) to deterministically render all 19 PNG previews from `assets/style-gallery.html` and `assets/starter-*.html`.

---

### ✨ Key Features (v2.2 Upgrade)
- **Universal Broadcast Runtime SDK (`assets/cme-core.js` — `window.CME`)**: Shared deterministic runtime providing `mulberry32` PRNG, `createSpeedRampTable`, `sampleAudio`, 12 `THEMES` (`applyTheme`), `createCameraRig` (`into -> settle -> look -> home` with directional `#mb-world` motion blur), 8-mode kinetic typography (`text.splitWords`, `text.animateWords`, `text.slam`, `text.block`, `text.multiply`), and `J(el, tx, ty)` / `updateWalkCycle` SVG joint rigs.
- **Zero Slide Decks (`#world` Continuous Spatial Rig)**: Unified `4720×3880` world canvas wrapping WebGL/Three.js (`<canvas id="gl">`), SVG isometric pipelines, and DOM typography in 1:1 spatial parallax.
- **100% Frame-Deterministic**: Pure mathematical functions of `tl.time()`, `mulberry32` PRNG, and precomputed velocity integral `D(t)`. Zero `Math.random()` or `Date.now()` drift.
- **Directional SVG Motion Blur**: Dynamic `<feGaussianBlur>` (`#mb-world`) attached during high-velocity whip-pans and detached immediately upon settling for razor-sharp typography.
- **Autonomous CLI Audio, Anti-PPT Telemetry & 60fps Renderer**:
  - `npm run scaffold` (`scripts/scaffold-video.mjs`): One-command project bootstrapper (`--type=opener|explainer|panggung|kolase|katalog|sketsa`, `--style=<id>`, `--mood`, `--bpm`, `--duration`, `--ratio`, `--out`) that copies the starter + `cme-core.js`, generates `audio.wav` + `audio-frames.js`, applies the broadcast theme, and verifies Anti-PPT compliance.
  - `npm run audio` (`scripts/generate-audio.mjs`): CLI procedural stereo WAV & 60fps `AUDIO_FRAMES` synthesizer (`--mood=warm|cyber|editorial|corporate`, `--bpm`, `--duration`, `--drops`).
  - `npm run analyze` (`scripts/analyze-audio.mjs`): Headless CLI voiceover silence (`SEG`/`PARA`) & 60fps FFT compiler for `.wav/.mp3/.m4a`.
  - `npm run snap` (`scripts/snap-contact-sheet.mjs`): Captures 12 beat keyframes, runs in-browser Anti-PPT DOM telemetry checks (`audit-report.json`), and stitches a labeled `contact-sheet.png`.
  - `npm run audit` (`scripts/audit-anti-ppt.mjs`): Fast static & structural Anti-PPT 8-Law linter.
  - `npm run export` (`scripts/export-video.mjs`): Spawns dedicated browser workers or streams via `--pipe` (`image2pipe`) into FFmpeg (`--codec=h264|prores|webm-alpha`, `--ratio=16x9|9x16|1x1`).
  - `npm run gallery` (`scripts/generate-gallery.mjs`): Automated 19-image visual style gallery & starter keyframe generator.
  - `scripts/kepala-ekspresi.py`: Alpha-bounding-box aware 8-expression character head sprite generator + parametric `viseme-rig.svg`.
  - `npm run sync` / `npm run sync:global` (`scripts/sync-plugin.mjs`): Deterministic SHA-256 synchronizer across root, `skills/cinematic-motion-engine/`, and global AI skill/plugin installations.

### 🚀 Installation

#### 1. Antigravity (AGY) — Standalone Skill or Plugin
```bash
# As a Global Standalone Skill:
git clone https://github.com/roedyrustam/cinematic-motion-engine.git ~/.gemini/config/skills/cinematic-motion-engine

# Or as a Standalone Plugin:
git clone https://github.com/roedyrustam/cinematic-motion-engine.git ~/.gemini/config/plugins/cinematic-motion-engine
```

#### 2. Claude Code / Cursor / Workspace Skill
```bash
git clone https://github.com/roedyrustam/cinematic-motion-engine.git .agents/skills/cinematic-motion-engine
```

---

## 💬 AI Prompting Guide & Cookbook Examples

Because **Cinematic Motion Engine** includes automatic trigger rules (`rules/AGENTS.md`), you can either speak naturally or use the **Broadcast Prompt Formula** for surgical control over starter mode, style palette, soundtrack synthesis, and export codecs:

> **📐 The Broadcast Prompt Formula:**
> `[Video Mode / Starter]` + `[Style Direction (01–12)]` + `[Duration, BPM & Audio Mood]` + `[Narrative Beats & Visual Metaphors]` + `[Aspect Ratio & Export Codec]`

### 1. Brand Launch Opener & 3D Shader Rig (`starter-opener.html`)
```text
Using cinematic-motion-engine, build a 12-second 60fps product launch opener for "VEXEL CLOUD 4.0" using mode=opener and style=brutalist-telemetry.
- Synthesize a 12s soundtrack at 128 BPM with mood=cyber and drops at 2.8s, 6.4s, and 9.6s.
- Beat 1 (0–3s): High-velocity camera whip-pan into a 3D WebGL particle lattice with directional motion blur (#mb-world) and hero claim "ZERO LATENCY" (>=110px).
- Beat 2 (3–6.5s): Speed-ramp D(t) surge into an oscilloscope telemetry matrix showing "0.4ms P99 EDGE ROUTING" with tabular-nums counters.
- Beat 3 (6.5–9.5s): 3D flip kinetic typography reveal of "GLOBAL MESH ARCHITECTURE".
- Beat 4 (9.5–12s): Camera settles home on the final brand monolith "VEXEL 4.0 — DEPLOY NOW".
Run the Anti-PPT contact sheet audit and export to 1080p 60fps MP4.
```

### 2. Continuous Action Explainer & Phrase Accretion (`starter-explainer.html`)
```text
Create a 15-second continuous-world explainer video on "How Deterministic KV-Cache Locking Cuts LLM Latency by 85%" using cinematic-motion-engine (mode=explainer, style=isometric-blueprint, mood=corporate, 120 BPM).
- Use a single continuous #world camera rig (into -> settle -> look -> home) with zero slide fades.
- Accrete phrases using text.slam, text.block, and text.multiply synchronized to the audio beats.
- Draw an interactive SVG pipeline comparing uncached token recomputation vs. byte-identical prefix pinning, then verify with snap-contact-sheet.mjs and export MP4.
```

### 3. Living Cartoon Stage (`Kartun Panggung Hidup` — `starter-explainer-panggung.html`)
```text
Create a 16-second Living Cartoon Stage explainer (mode=panggung, style=kartun-panggung, mood=warm) about "How Cross-Border Instant QR Payments Work".
- Use the SVG joint rig J(el, tx, ty) and updateWalkCycle from cme-core.js for 2 articulated characters (Buyer & Merchant) with pointing, nodding, and handshake gestures.
- Include 10+ living background stage props (parallax clouds, blinking shop neon, QR signal rings, coins traveling along a bezier path, and a ticking wall clock).
- Run the Anti-PPT audit, generate a 12-keyframe contact sheet, and render 60fps MP4.
```

### 4. Paper Collage & Visual Journalism (`Vox-Style` — `starter-explainer-kolase.html`)
```text
Using cinematic-motion-engine, create a 14-second Vox-style visual journalism explainer (mode=kolase, style=jurnalisme-visual, mood=editorial, 110 BPM) titled "Why Submarine Fiber Cables Carry 99% of Global Data".
- Use tactile paper cutout drop-shadows, steps(5) stop-motion frame jitter on archival map cutouts, yellow multiply highlighter sweeps, and animated red yarn evidence lines connecting transoceanic landing stations.
- Audit with snap-contact-sheet.mjs --strict and export 1080p 60fps MP4.
```

### 5. Clean White Studio Catalog & 3D Isometric Exploded View (`starter-explainer-katalog.html`)
```text
Create a 12-second hardware architecture showcase for "AETHER SILICON M4" using cinematic-motion-engine with mode=katalog and style=katalog-putih (mood=warm, 122 BPM).
- Place the product on a pure #F8F9FA studio cyclorama.
- At t=3.2s, animate a 3D isometric exploded-view stack separating into 4 layers (Vapor Chamber, Neural NPU Die, HBM3e Memory Array, CNC Aluminum Unibody) with animated SVG callout leader lines and tabular-nums specs.
- Export in both 16:9 (1920x1080) and 9:16 vertical reel (1080x1920) at 60fps.
```

### 6. Vintage Blueprint & Live Schematic Draw (`starter-explainer-sketsa.html`)
```text
Build a 12-second engineering schematic explainer for "Closed-Loop Rocket Turbopump Ignition" using cinematic-motion-engine (mode=sketsa, style=sketsa-vintage, mood=editorial).
- Render on a deep cyanotype #0D2238 blueprint grid with animated SVG stroke-dashoffset technical drawings, rotating compass reticles, Vernier caliper dimension arrows, and gold #F5B952 telemetry callouts.
- Verify zero Anti-PPT violations and export 60fps MP4.
```

### 7. Voiceover Synchronization (`SEG`/`PARA`) & ProRes / Transparent WebM Overlay
```text
Analyze my `./voiceover.wav` using `scripts/analyze-audio.mjs` to extract `SEG`/`PARA` timestamps and 60fps `AUDIO_FRAMES`.
Then build a kinetic typography & HUD overlay animation synchronized to every voiceover sentence and export it with a transparent alpha channel (`--codec=webm-alpha --pipe`) so I can drop it directly onto my video timeline.
```
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

**Cinematic Motion Engine (v2.2)** adalah skill dan plugin AI mandiri (*standalone*) yang mengubah asisten coding AI menjadi **studio motion graphics kelas broadcast**. Menggantikan animasi ala slide PowerPoint dengan **8 Hukum Struktural Mekanis Anti-PPT**, runtime broadcast universal `assets/cme-core.js` (`window.CME`), rig kamera dunia kontinu `#world`, *motion blur* arah SVG `<feGaussianBlur>`, shader 3D *speed-ramp* deterministik `D(t)`, rig sendi karakter kartun SVG `J(el, tx, ty)`, galeri visual 12 gaya broadcast (`npm run gallery`), *scaffolder* proyek satu perintah (`npm run scaffold`), audit telemetri DOM & *contact-sheet* otomatis (`npm run snap`), serta perender paralel **MP4 / ProRes 4444 / WebM Alpha 60fps** (`npm run export`).

### 📁 Struktur Direktori
```text
cinematic-motion-engine/
├── SKILL.md                                  # Instruksi utama skill (EN / ID)
├── PRD.md                                    # Dokumen Kebutuhan Produk v2.1
├── BLUEPRINT.md                              # Cetak Biru Arsitektur & MADR Decision Log
├── plugin.json                               # Manifest plugin mandiri Antigravity
├── docs/
│   └── gallery/                              # 19 Gambar Preview Galeri Gaya & Starter (Otomatis)
├── rules/
│   └── AGENTS.md                             # Aturan aktivasi otomatis Anti-PPT
├── assets/
│   ├── cme-core.js                           # Universal Broadcast Runtime SDK (window.CME)
│   ├── style-gallery.html                    # Katalog Visual 12 Arah Gaya Broadcast
│   ├── starter-opener.html                   # Starter Video Opener / Brand Reel (16:9, 9:16, 1:1)
│   ├── starter-explainer.html                # Starter Explainer Aksi Kontinu
│   ├── starter-explainer-panggung.html       # Starter Kartun Panggung Hidup (SVG Joint Rig)
│   ├── starter-explainer-kolase.html         # Starter Kolase Kertas & Jurnalisme Visual
│   ├── starter-explainer-katalog.html        # Starter Katalog Putih & 3D Isometric Exploded View
│   └── starter-explainer-sketsa.html         # Starter Sketsa Vintage & Cyanotype Blueprint
├── references/
│   ├── anti-ppt-laws.md                      # 8 Hukum Mekanis Anti-PPT & Matematika Skala 1080p
│   ├── opener-concepts.md                    # 24 Konsep Opener & 35+ Transisi Objek
│   ├── explainer-modes.md                    # 6 Mode Explainer & Akresi Frasa
│   ├── techniques-and-shaders.md             # Kamera #world, Blur SVG, & Shader D(t)
│   └── kartun-panggung-and-ae-bridge.md      # Rig Sendi J() & Bridge After Effects MCP
└── scripts/
    ├── scaffold-video.mjs                    # Scaffolder Proyek Video 1-Perintah + Tema + Audio
    ├── generate-gallery.mjs                  # Generator Otomatis 19 Gambar Style Gallery & Starter
    ├── snap-contact-sheet.mjs                # Pemotret 12 Keyframe + Penyusun Contact Sheet + DOM Linter
    ├── audit-anti-ppt.mjs                    # Linter Statis & Struktural 8 Hukum Anti-PPT
    ├── export-video.mjs                      # Perender 60fps (Multi-Worker / Zero-Disk Pipe / Multi-Codec)
    ├── generate-audio.mjs                    # CLI Generator Soundtrack WAV Stereo & AUDIO_FRAMES
    ├── analyze-audio.mjs                     # CLI Penganalisis Jeda Voiceover (SEG/PARA) & FFT 60fps
    ├── vo-fft-analyzer.html                  # Penganalisis Jeda Voiceover & Kurva Audio FFT (Browser GUI)
    ├── kepala-ekspresi.py                    # Generator 8 Sprite Ekspresi Kepala + SVG Viseme Rig
    └── sync-plugin.mjs                       # Sinkronisator SHA-256 Root <-> skills/cinematic-motion-engine
```

---

## 💬 Panduan Prompting AI & Contoh Resep Siap Pakai

Karena **Cinematic Motion Engine** dilengkapi aturan pemicu otomatis (`rules/AGENTS.md`), Anda cukup menuliskan prompt dalam bahasa alami atau menggunakan **Formula Prompt Broadcast** berikut untuk mengontrol pilihan *starter*, *style direction*, musik latar prosedural, hingga format render 60fps secara presisi:

> **📐 Formula Prompt Broadcast:**
> `[Mode Starter (1–6)]` + `[Gaya Visual (01–12)]` + `[Durasi, BPM & Mood Audio]` + `[Alur Beat Naratif & Objek Visual]` + `[Rasio Aspek & Codec Ekspor]`

### Tabel Cheat-Sheet Parameter Prompt
| Parameter | Pilihan Nilai yang Tersedia |
| :--- | :--- |
| **Mode Starter (`--mode`)** | `opener` · `explainer` · `panggung` · `kolase` · `katalog` · `sketsa` |
| **Gaya Visual (`--style`)** | `swiss-grid` · `kartun-kolase` · `jurnalisme-visual` · `katalog-putih` · `sketsa-vintage` · `kartun-panggung` · `bauhaus-geo` · `brutalist-telemetry` · `editorial-film` · `isometric-blueprint` · `spatial-optics` · `data-sculpture` |
| **Mood Audio (`--mood`)** | `warm` (Ambient/Product) · `cyber` (Tech/Bass) · `editorial` (Jurnalisme/Dokumenter) · `corporate` (Clean SaaS) |
| **Rasio & Codec (`export`)** | `--ratio=16x9\|9x16\|1x1` · `--codec=h264\|prores\|webm-alpha` · `--pipe` |

### Contoh Prompt Bahasa Indonesia Siap Pakai

#### 1. Video Opener Peluncuran Produk SaaS / AI (`opener` + `swiss-grid` / `brutalist-telemetry`)
```text
Gunakan cinematic-motion-engine untuk membuat video opener peluncuran produk "NUSANTARA AI ENGINE 2.0" berdurasi 10 detik 60fps dengan mode=opener dan style=swiss-grid (mood=cyber, 126 BPM).
- Beat 1 (0–2.5s): Kamera whip-pan cepat dengan motion blur arah (#mb-world) menuju klaim hero "OTOMASI TANPA BATAS" (>=110px) dan partikel 3D speed-ramp D(t).
- Beat 2 (2.5–5.5s): Kamera menggeser di dalam #world ke matriks telemetri yang menampilkan metrik "99.99% UPTIME" dan "10X LEBIH CEPAT" dengan angka tabular-nums.
- Beat 3 (5.5–8.0s): Tipografi kinetik flip-3d menampilkan fitur "ARSITEKTUR MULTI-AGEN DETERMINISTIK".
- Beat 4 (8.0–10s): Kamera kembali (home) ke monolith logo "NUSANTARA AI — MULAI SEKARANG".
Jalankan audit contact sheet Anti-PPT dan ekspor ke MP4 1080p 60fps.
```

#### 2. Explainer Naratif Aksi Kontinu (`explainer` + `isometric-blueprint`)
```text
Buatkan video explainer naratif 15 detik menggunakan cinematic-motion-engine (mode=explainer, style=isometric-blueprint, mood=corporate, 120 BPM) tentang "Bagaimana Sistem Pembayaran SNAP BI Memproses Transaksi dalam 0.3 Detik".
- Gunakan satu rig kamera dunia kontinu #world (into -> settle -> look -> home) tanpa efek pudar slide (zero PPT fades).
- Gunakan akresi frasa text.slam, text.block, dan text.multiply dari cme-core.js untuk menyusun kalimat selaras dengan ketukan audio.
- Gambarkan pipa aliran data isometrik dari Pengguna -> API Gateway -> Fraud Engine -> Settlement Bank, lalu verifikasi dengan snap-contact-sheet.mjs dan render ke output.mp4.
```

#### 3. Explainer Kartun Panggung Hidup (`panggung` + `kartun-panggung`)
```text
Buat video explainer animasi Kartun Panggung Hidup berdurasi 16 detik (mode=panggung, style=kartun-panggung, mood=warm) yang menceritakan "Tips Mengamankan Akun dengan Passkeys WebAuthn".
- Gunakan rig sendi SVG J(el, tx, ty) dan updateWalkCycle untuk menggerakkan karakter utama di atas panggung berlapis 2.5D.
- Pastikan ada minimal 10 properti panggung yang hidup (lampu sorot bergerak, gembok kriptografi berputar, gelombang biometrik, awan latar parallax, dan indikator status berkedip).
- Lakukan audit Anti-PPT ketat dan ekspor ke video MP4 60fps.
```

#### 4. Explainer Jurnalisme Visual & Kolase Kertas (`kolase` + `jurnalisme-visual`)
```text
Gunakan cinematic-motion-engine untuk membuat video dokumenter pendek bergaya Vox (mode=kolase, style=jurnalisme-visual, mood=editorial, 112 BPM) berdurasi 14 detik tentang "Sejarah Jalur Rempah & Perdagangan Maritim Nusantara".
- Gunakan potongan kertas berbayang tegas, gerakan stop-motion steps(5), stabilo kuning multiply pada kutipan arsip, serta benang merah SVG yang menghubungkan titik pelabuhan di peta.
- Buat contact sheet 12 keyframe dan render ke MP4 60fps.
```

#### 5. Katalog Produk Putih Bersih & Bedah Komponen 3D (`katalog` + `katalog-putih`)
```text
Buat video showcase produk "EARBUDS STUDIO PRO X" berdurasi 12 detik dengan cinematic-motion-engine (mode=katalog, style=katalog-putih, mood=warm, 124 BPM).
- Tampilkan di atas latar studio putih bersih #F8F9FA dengan tipografi kontras tinggi.
- Pada detik ke-3, pecah tampilan produk secara 3D Isometric Exploded View menjadi 4 lapisan (Driver Graphene 11mm, Chip ANC Dual-Core, Baterai Solid-State, Casing Titanium) lengkap dengan garis penunjuk SVG dan angka spesifikasi tabular-nums.
- Ekspor dalam format 16:9 (YouTube) dan 9:16 (Reels/TikTok) pada 60fps.
```

#### 6. Cetak Biru Sketsa Teknik Vintage (`sketsa` + `sketsa-vintage`)
```text
Buat video penjelasan skema teknik "Cara Kerja Turbin Geotermal Siklus Biner" berdurasi 12 detik menggunakan cinematic-motion-engine (mode=sketsa, style=sketsa-vintage, mood=editorial).
- Gunakan latar kertas blueprint cyanotype #0D2238 dengan animasi penarikan garis sketsa SVG stroke-dashoffset, kompas ukur berputar, panah dimensi Vernier, dan label telemetri emas #F5B952.
- Jalankan audit Anti-PPT dan ekspor ke MP4 60fps.
```

---

## 📜 License
MIT © Roedy Rustam
