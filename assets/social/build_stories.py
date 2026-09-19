"""Generate 1080x1920 Instagram-story infographics announcing WattsNear.

Renders three PNG stories into the same directory as this script.
"""

import base64
import io
import os
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent
SITE = ROOT.parent.parent
SHOTS = SITE / "screenshots"

W, H = 1080, 1920


def shot_data_uri(name: str, max_height: int = 1700) -> str:
    """Load a webp screenshot, resize to fit max_height, return PNG data URI."""
    img = Image.open(SHOTS / name).convert("RGB")
    if img.height > max_height:
        ratio = max_height / img.height
        img = img.resize((int(img.width * ratio), max_height), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


# Shared background and gradient defs.
DEFS = """
<defs>
  <radialGradient id="glow1" cx="15%" cy="10%" r="55%">
    <stop offset="0%"  stop-color="#5b5cff" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#5b5cff" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glow2" cx="92%" cy="95%" r="55%">
    <stop offset="0%"  stop-color="#27b6a8" stop-opacity="0.45"/>
    <stop offset="100%" stop-color="#27b6a8" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"  stop-color="#0b1426"/>
    <stop offset="100%" stop-color="#08111f"/>
  </linearGradient>
  <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%"  stop-color="#818cf8"/>
    <stop offset="100%" stop-color="#27b6a8"/>
  </linearGradient>
  <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"  stop-color="#5b5cff"/>
    <stop offset="100%" stop-color="#27b6a8"/>
  </linearGradient>
  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="22"/>
  </filter>
</defs>
"""


def background() -> str:
    return f"""
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#glow1)"/>
<rect width="{W}" height="{H}" fill="url(#glow2)"/>
"""


def brand_mark(x: int, y: int, size: int = 110) -> str:
    """A rounded-square gradient tile with a lightning bolt inside."""
    r = size * 0.28
    inner = size * 0.55
    pad = (size - inner) / 2
    # The bolt path is normalized to a 32-unit box (matches site SVG).
    return f"""
<g transform="translate({x},{y})">
  <rect width="{size}" height="{size}" rx="{r}" ry="{r}" fill="url(#mark)"/>
  <g transform="translate({pad},{pad}) scale({inner / 32})">
    <path d="M18 2L6 18h8l-1 12 13-18h-8l0-10Z" fill="#ffffff"/>
  </g>
</g>
"""


FONT = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"


def text(x, y, content, *, size=44, weight=600, fill="#f8fafc",
         anchor="start", letter_spacing="-0.01em", opacity=1.0):
    return (
        f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" '
        f'letter-spacing="{letter_spacing}" opacity="{opacity}">{content}</text>'
    )


def pill(x, y, w, h, label, *, size=30, fill="rgba(91,92,255,0.16)",
         stroke="rgba(129,140,248,0.45)", text_fill="#c7d2fe"):
    r = h / 2
    tx = x + w / 2
    ty = y + h / 2 + size * 0.36
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" ry="{r}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>'
        + text(tx, ty, label, size=size, weight=600, fill=text_fill,
               anchor="middle")
    )


# ----- Story 1: announcement ------------------------------------------------

def story1() -> str:
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        DEFS,
        background(),
        # Top eyebrow pill
        pill(380, 240, 320, 64, "NEW · iPhone + CarPlay", size=28),
        # Brand block
        brand_mark(W // 2 - 110, 380, size=220),
        text(W // 2, 700, "WattsNear", size=86, weight=700,
             anchor="middle", letter_spacing="-0.04em"),
        text(W // 2, 760, "Closest &amp; cheapest EV chargers", size=34,
             weight=400, fill="#9ca3af", anchor="middle"),
        # Headline
        text(W // 2, 1020, "I built", size=120, weight=800,
             anchor="middle", letter_spacing="-0.05em"),
        text(W // 2, 1170, "an app.", size=160, weight=800, fill="#ffffff",
             anchor="middle", letter_spacing="-0.05em"),
        # Accent underline
        f'<rect x="{W//2 - 140}" y="1210" width="280" height="10" rx="5" fill="url(#accentLine)"/>',
        # Subline
        text(W // 2, 1340, "Find the closest, cheapest", size=42,
             weight=500, fill="#cbd5f5", anchor="middle"),
        text(W // 2, 1394, "EV charger — fast.", size=42,
             weight=500, fill="#cbd5f5", anchor="middle"),
        # Footer call to action
        f'<rect x="240" y="1640" width="600" height="120" rx="60" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>',
        text(W // 2, 1700, "Free on the App Store", size=44, weight=700,
             fill="#f8fafc", anchor="middle"),
        text(W // 2, 1742, "wattsnear.com", size=26, weight=500,
             fill="#9ca3af", anchor="middle"),
        "</svg>",
    ]
    return "\n".join(parts)


# ----- Story 2: features + screenshot ---------------------------------------

def story2() -> str:
    uri = shot_data_uri("cheapest.webp", max_height=1400)
    # Phone runs the full height of the right side, slightly cropped at the
    # bottom so it reads as a peek rather than a full ad.
    phone_w = 360
    phone_h = int(phone_w * (2164 / 1000))  # ~779
    phone_x = W - phone_w - 40              # right-aligned with 40px margin
    phone_y = 560

    rows = [
        ("⚡", "Closest first",
         "Sorted by distance."),
        ("$",  "Cheapest first",
         "See $/kWh first."),
        ("🚗", "CarPlay + Siri",
         "Hands-free from the dash."),
    ]
    row_y = 1080
    row_gap = 180
    row_svg = []
    for i, (icon, title, body) in enumerate(rows):
        y = row_y + i * row_gap
        row_svg.append(
            f'<g>'
            f'<rect x="80" y="{y - 70}" width="100" height="100" rx="28" '
            f'fill="rgba(91,92,255,0.18)" stroke="rgba(129,140,248,0.4)" stroke-width="1.5"/>'
            f'<text x="130" y="{y - 2}" font-family="{FONT}" font-size="52" '
            f'font-weight="700" fill="#a5b4fc" text-anchor="middle">{icon}</text>'
            + text(220, y - 8, title, size=42, weight=700)
            + text(220, y + 36, body, size=26, weight=400, fill="#9ca3af")
            + "</g>"
        )

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        DEFS,
        background(),
        # Top brand row
        brand_mark(80, 230, size=88),
        text(190, 270, "WattsNear", size=42, weight=700),
        text(190, 312, "Closest &amp; cheapest EV chargers", size=24,
             weight=500, fill="#9ca3af"),
        # Eyebrow pill
        pill(80, 400, 220, 56, "Meet the app", size=24),
        # Headline (two lines, kept on the left side)
        text(80, 560, "Charge", size=120, weight=800,
             letter_spacing="-0.05em"),
        text(80, 690, "smarter.", size=120, weight=800,
             letter_spacing="-0.05em"),
        # Accent underline
        f'<rect x="80" y="720" width="220" height="8" rx="4" fill="url(#accentLine)"/>',
        text(80, 800, "Two taps, fewer surprises.", size=32, weight=500,
             fill="#cbd5f5"),
        # Phone screenshot, rounded mask, lower-right
        f'<defs><clipPath id="phoneClip">'
        f'<rect x="{phone_x}" y="{phone_y}" width="{phone_w}" height="{phone_h}" rx="46" ry="46"/>'
        f'</clipPath></defs>',
        f'<rect x="{phone_x - 8}" y="{phone_y - 8}" width="{phone_w + 16}" height="{phone_h + 16}" rx="54" '
        f'fill="#000" opacity="0.85"/>',
        f'<image href="{uri}" x="{phone_x}" y="{phone_y}" width="{phone_w}" height="{phone_h}" '
        f'preserveAspectRatio="xMidYMid slice" clip-path="url(#phoneClip)"/>',
        *row_svg,
        # Bottom strip
        f'<rect x="60" y="1690" width="{W - 120}" height="120" rx="32" '
        f'fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>',
        text(W // 2, 1740, "Live NREL data · No accounts · No tracking",
             size=28, weight=600, fill="#cbd5f5", anchor="middle"),
        text(W // 2, 1778, "Free on the App Store",
             size=24, weight=500, fill="#9ca3af", anchor="middle"),
        "</svg>",
    ]
    return "\n".join(parts)


# ----- Story 3: how to get it -----------------------------------------------

def story3() -> str:
    uri = shot_data_uri("map.webp", max_height=1100)
    # Faint phone preview at the top-right
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        DEFS,
        background(),
        # Brand
        brand_mark(W // 2 - 60, 220, size=120),
        text(W // 2, 410, "WattsNear", size=58, weight=700,
             anchor="middle", letter_spacing="-0.03em"),
        text(W // 2, 456, "Closest &amp; cheapest EV chargers", size=26,
             weight=500, fill="#9ca3af", anchor="middle"),
        # Big call to action
        text(W // 2, 640, "Free on the", size=58, weight=600,
             fill="#cbd5f5", anchor="middle"),
        text(W // 2, 740, "App Store.", size=120, weight=800,
             anchor="middle", letter_spacing="-0.04em"),
        # Accent bar
        f'<rect x="{W//2 - 180}" y="780" width="360" height="10" rx="5" fill="url(#accentLine)"/>',
        # Search hint
        f'<rect x="120" y="880" width="{W - 240}" height="120" rx="32" '
        f'fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>',
        text(W // 2, 930, "Search the App Store for", size=28, weight=500,
             fill="#9ca3af", anchor="middle"),
        text(W // 2, 980, "“WattsNear”", size=54, weight=800,
             anchor="middle", letter_spacing="-0.03em"),
        # Feature pills row
        pill(140, 1080, 220, 70, "iPhone", size=28),
        pill(380, 1080, 220, 70, "CarPlay", size=28),
        pill(620, 1080, 220, 70, "Siri", size=28),
        pill(860, 1080, 80, 70, "+", size=32),
        pill(140, 1170, 320, 70, "Home-screen widget", size=24),
        pill(480, 1170, 460, 70, "iOS 18+ · no subscription", size=24),
        # Phone screenshot at bottom
        # Place a smaller phone tease in bottom area
        f'<defs><clipPath id="phoneClip3">'
        f'<rect x="340" y="1310" width="400" height="500" rx="44" ry="44"/>'
        f'</clipPath></defs>',
        f'<rect x="332" y="1302" width="416" height="516" rx="52" fill="#000" opacity="0.85"/>',
        f'<image href="{uri}" x="340" y="1310" width="400" height="866" '
        f'preserveAspectRatio="xMidYMin slice" clip-path="url(#phoneClip3)"/>',
        # URL footer
        text(W // 2, 1880, "wattsnear.com", size=32, weight=600,
             fill="#cbd5f5", anchor="middle"),
        "</svg>",
    ]
    return "\n".join(parts)


def render(svg: str, out: Path) -> None:
    cairosvg.svg2png(bytestring=svg.encode("utf-8"),
                     output_width=W, output_height=H,
                     write_to=str(out))
    print(f"wrote {out.relative_to(SITE)} ({out.stat().st_size // 1024} KB)")


def main() -> None:
    builders = [
        ("story-1-announcement.png", story1),
        ("story-2-features.png",     story2),
        ("story-3-get-the-app.png",  story3),
    ]
    for name, fn in builders:
        svg = fn()
        # Also save the SVG source for tweaking.
        (ROOT / name.replace(".png", ".svg")).write_text(svg, encoding="utf-8")
        render(svg, ROOT / name)


if __name__ == "__main__":
    main()
