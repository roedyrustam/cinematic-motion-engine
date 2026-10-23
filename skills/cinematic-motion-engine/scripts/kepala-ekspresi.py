#!/usr/bin/env python3
"""
Cinematic Motion Engine v2.1 — Alpha-Aware Character Head Expression, Blink & Viseme Generator
Generates 8 deterministic expression PNG sprites from a single character head PNG using Pillow
(automatically locating the non-transparent silhouette bounding box), PLUS a parametric SVG
viseme rig snippet (`viseme-rig.svg`) for pure vector lip-sync in `kartun-panggung`.

Usage:
  python scripts/kepala-ekspresi.py <input-head.png> <output-dir>
"""
import os
import sys
from PIL import Image, ImageDraw, ImageEnhance


def detect_alpha_bounds(img: Image.Image) -> tuple[int, int, int, int]:
    """Detect the bounding box of non-transparent pixels (alpha > 16) so landmarks align with the actual head."""
    alpha = img.getchannel("A")
    bbox = alpha.point(lambda a: 255 if a > 16 else 0).getbbox()
    if not bbox:
        return (0, 0, img.width, img.height)
    return bbox


def generate_svg_viseme_rig(out_dir: str) -> None:
    """Writes a reusable parametric SVG Viseme Head Group (`viseme-rig.svg`) for pure SVG character rigs."""
    svg_code = """<!-- Cinematic Motion Engine v2.1 — Parametric SVG Viseme & Blink Rig for kartun-panggung -->
<svg viewBox="-90 -110 180 180" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <g id="head-base">
    <rect x="-56" y="-88" width="112" height="118" rx="46" fill="#F4A261" stroke="#1D3557" stroke-width="4"/>
    <!-- Hair Cap -->
    <path d="M-58 -42 Q-56 -96 0 -96 Q56 -96 58 -42 Q28 -64 0 -58 Q-28 -64 -58 -42 Z" fill="#1D3557"/>
    <!-- Ears -->
    <circle cx="-58" cy="-26" r="12" fill="#E76F51"/>
    <circle cx="58" cy="-26" r="12" fill="#E76F51"/>
    <!-- Eyebrows (Drive with J(browL) / J(browR)) -->
    <g transform="translate(-22, -44)"><g id="rig-brow-l"><rect x="-12" y="-3" width="24" height="6" rx="3" fill="#1D3557"/></g></g>
    <g transform="translate(22, -44)"><g id="rig-brow-r"><rect x="-12" y="-3" width="24" height="6" rx="3" fill="#1D3557"/></g></g>
    <!-- Eyes (Scale sy: 0.08 on blink via J(eyes)) -->
    <g transform="translate(0, -28)">
      <g id="rig-eyes">
        <circle cx="-22" cy="0" r="7.5" fill="#1D3557"/>
        <circle cx="22" cy="0" r="7.5" fill="#1D3557"/>
        <circle cx="-20" cy="-2.5" r="2.5" fill="#FFFFFF"/>
        <circle cx="24" cy="-2.5" r="2.5" fill="#FFFFFF"/>
      </g>
    </g>
    <!-- Cheek Blush -->
    <ellipse cx="-32" cy="-8" rx="9" ry="5" fill="#E63946" opacity="0.35"/>
    <ellipse cx="32" cy="-8" rx="9" ry="5" fill="#E63946" opacity="0.35"/>
    <!-- Mouth Viseme (Scale sx/sy dynamically from AUDIO_FRAMES mid-band) -->
    <g transform="translate(0, 8)">
      <g id="rig-mouth">
        <rect x="-14" y="-5" width="28" height="10" rx="5" fill="#281419"/>
      </g>
    </g>
  </g>
</svg>
"""
    with open(os.path.join(out_dir, "viseme-rig.svg"), "w", encoding="utf-8") as f:
        f.write(svg_code)


def generate_expressions(src_path: str, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    base = Image.open(src_path).convert("RGBA")
    w, h = base.size
    bx0, by0, bx1, by1 = detect_alpha_bounds(base)
    bw = max(16, bx1 - bx0)
    bh = max(16, by1 - by0)

    def fx(rel_x: float) -> int:
        return int(bx0 + bw * rel_x)

    def fy(rel_y: float) -> int:
        return int(by0 + bh * rel_y)

    eye_y = fy(0.44)
    mx, my = fx(0.50), fy(0.68)
    stroke_w = max(3, int(bh * 0.025))

    # 1. Neutral
    base.save(os.path.join(out_dir, "head-neutral.png"))

    # 2. Blink (closed warm eyelid lines aligned to silhouette bounds)
    blink = base.copy()
    draw_blink = ImageDraw.Draw(blink)
    draw_blink.line([(fx(0.28), eye_y), (fx(0.44), eye_y)], fill=(29, 53, 87, 255), width=stroke_w)
    draw_blink.line([(fx(0.56), eye_y), (fx(0.72), eye_y)], fill=(29, 53, 87, 255), width=stroke_w)
    blink.save(os.path.join(out_dir, "head-blink.png"))

    # 3. Talk Small (consonant M/B/P/S)
    talk_sm = base.copy()
    draw_sm = ImageDraw.Draw(talk_sm)
    rx, ry = max(5, int(bw * 0.055)), max(3, int(bh * 0.032))
    draw_sm.ellipse([mx - rx, my - ry, mx + rx, my + ry], fill=(40, 20, 25, 255))
    talk_sm.save(os.path.join(out_dir, "head-talk-small.png"))

    # 4. Talk Wide (open vowel A/E)
    talk_lg = base.resize((w, int(h * 1.03)), Image.Resampling.BICUBIC).crop((0, 0, w, h))
    draw_lg = ImageDraw.Draw(talk_lg)
    rx_w, ry_w = max(8, int(bw * 0.078)), max(7, int(bh * 0.065))
    draw_lg.ellipse([mx - rx_w, my - ry_w, mx + rx_w, my + ry_w], fill=(40, 20, 25, 255))
    talk_lg.save(os.path.join(out_dir, "head-talk-wide.png"))

    # 5. Talk O/U (rounded vowel mouth)
    talk_o = base.copy()
    draw_o = ImageDraw.Draw(talk_o)
    ro_mouth = max(6, int(bw * 0.048))
    draw_o.ellipse([mx - ro_mouth, my - ro_mouth, mx + ro_mouth, my + ro_mouth], fill=(40, 20, 25, 255))
    talk_o.save(os.path.join(out_dir, "head-talk-o.png"))

    # 6. Happy (warm brightness boost + cheek blush)
    happy = ImageEnhance.Brightness(base).enhance(1.04)
    draw_hp = ImageDraw.Draw(happy)
    blush_r = max(5, int(bw * 0.06))
    cy = fy(0.56)
    draw_hp.ellipse([fx(0.25) - blush_r, cy - blush_r // 2, fx(0.25) + blush_r, cy + blush_r // 2], fill=(230, 57, 70, 80))
    draw_hp.ellipse([fx(0.75) - blush_r, cy - blush_r // 2, fx(0.75) + blush_r, cy + blush_r // 2], fill=(230, 57, 70, 80))
    happy.save(os.path.join(out_dir, "head-happy.png"))

    # 7. Surprised (widened O mouth + raised brow emphasis)
    surprised = base.copy()
    draw_sp = ImageDraw.Draw(surprised)
    ro = max(7, int(bw * 0.058))
    draw_sp.ellipse([mx - ro, my - ro, mx + ro, my + ro], fill=(29, 53, 87, 255))
    surprised.save(os.path.join(out_dir, "head-surprised.png"))

    # 8. Focused / Determined (angled brow bars)
    focused = base.copy()
    draw_fc = ImageDraw.Draw(focused)
    brow_y = fy(0.36)
    draw_fc.line([(fx(0.27), brow_y - 3), (fx(0.44), brow_y + 3)], fill=(29, 53, 87, 255), width=stroke_w)
    draw_fc.line([(fx(0.73), brow_y - 3), (fx(0.56), brow_y + 3)], fill=(29, 53, 87, 255), width=stroke_w)
    focused.save(os.path.join(out_dir, "head-focused.png"))

    generate_svg_viseme_rig(out_dir)
    print(f"[KEPALA-EKSPRESI] Generated 8 alpha-aligned head expression sprites + viseme-rig.svg in {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scripts/kepala-ekspresi.py <input-head.png> <output-dir>")
        sys.exit(1)
    generate_expressions(sys.argv[1], sys.argv[2])
