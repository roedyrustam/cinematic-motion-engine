#!/usr/bin/env python3
"""
Vibe Motion Pro v2.0 — Local Character Head Expression & Blink Sprite Generator
Generates 6 deterministic expression PNGs from a single character head PNG using Pillow.
Usage: python scripts/kepala-ekspresi.py <input-head.png> <output-dir>
"""
import os
import sys
from PIL import Image, ImageDraw, ImageEnhance


def generate_expressions(src_path: str, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    base = Image.open(src_path).convert("RGBA")
    w, h = base.size

    # 1. Neutral
    base.save(os.path.join(out_dir, "head-neutral.png"))

    # 2. Blink (warm eyelid bar across eye line at ~44% height)
    blink = base.copy()
    draw_blink = ImageDraw.Draw(blink)
    eye_y = int(h * 0.44)
    draw_blink.line([(int(w * 0.28), eye_y), (int(w * 0.44), eye_y)], fill=(29, 53, 87, 255), width=max(3, int(h * 0.025)))
    draw_blink.line([(int(w * 0.56), eye_y), (int(w * 0.72), eye_y)], fill=(29, 53, 87, 255), width=max(3, int(h * 0.025)))
    blink.save(os.path.join(out_dir, "head-blink.png"))

    # 3. Talk Small (consonant mouth ellipse at ~68% height)
    talk_sm = base.copy()
    draw_sm = ImageDraw.Draw(talk_sm)
    mx, my = int(w * 0.50), int(h * 0.68)
    rx, ry = max(6, int(w * 0.055)), max(4, int(h * 0.035))
    draw_sm.ellipse([mx - rx, my - ry, mx + rx, my + ry], fill=(40, 20, 25, 255))
    talk_sm.save(os.path.join(out_dir, "head-talk-small.png"))

    # 4. Talk Wide (vowel mouth ellipse + subtle vertical jaw stretch)
    talk_lg = base.resize((w, int(h * 1.03)), Image.Resampling.BICUBIC).crop((0, 0, w, h))
    draw_lg = ImageDraw.Draw(talk_lg)
    rx_w, ry_w = max(9, int(w * 0.075)), max(8, int(h * 0.065))
    draw_lg.ellipse([mx - rx_w, my - ry_w, mx + rx_w, my + ry_w], fill=(40, 20, 25, 255))
    talk_lg.save(os.path.join(out_dir, "head-talk-wide.png"))

    # 5. Happy (warm brightness boost + cheek blush)
    happy = ImageEnhance.Brightness(base).enhance(1.04)
    draw_hp = ImageDraw.Draw(happy)
    blush_r = max(6, int(w * 0.06))
    cy = int(h * 0.56)
    draw_hp.ellipse([int(w * 0.25) - blush_r, cy - blush_r // 2, int(w * 0.25) + blush_r, cy + blush_r // 2], fill=(230, 57, 70, 75))
    draw_hp.ellipse([int(w * 0.75) - blush_r, cy - blush_r // 2, int(w * 0.75) + blush_r, cy + blush_r // 2], fill=(230, 57, 70, 75))
    happy.save(os.path.join(out_dir, "head-happy.png"))

    # 6. Surprised (slight vertical scale + wide mouth O)
    surprised = base.copy()
    draw_sp = ImageDraw.Draw(surprised)
    ro = max(7, int(w * 0.055))
    draw_sp.ellipse([mx - ro, my - ro, mx + ro, my + ro], fill=(29, 53, 87, 255))
    surprised.save(os.path.join(out_dir, "head-surprised.png"))
    print(f"[KEPALA-EKSPRESI] Generated 6 head expression sprites in {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scripts/kepala-ekspresi.py <input-head.png> <output-dir>")
        sys.exit(1)
    generate_expressions(sys.argv[1], sys.argv[2])
