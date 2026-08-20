#!/usr/bin/env python3
"""Render the carousel's device-mockup PNGs from Photo-Memory-iOS raw captures.

The site wants a different artifact from the App Store lineup: a device on a
*transparent* background with no caption and no gradient, because the page supplies its
own headings. `Tools/EasyFrame` in the iOS repository only emits the store style, so this
reproduces the geometry of its `FramedScreenshotView` — screenshot clipped to the screen
rect, bezel art composited over it, transparent everywhere else — and skips the
`ScreenshotDesignView` caption band and background entirely.

Every constant below is lifted from, and must stay in step with,
`Tools/EasyFrame/Sources/EasyFrameCommand/Model/SupportedDevice.swift`.

Usage:
    make screenshots            # in Photo-Memory-iOS, to refresh raw-screenshots/
    python3 tools/make-device-mockups.py [--ios-repo PATH]

Writes straight over `images/screenshots/` (en-US) and `de/images/screenshots/` (de-DE),
keeping the filenames the two index.html files reference.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw

# deviceImageName, deviceScreenSize, devicePositioningOffset, clipCornerRadius
DEVICES = {
    "iPhone": ("Apple iPhone 14 Pro Max Black.png", (1290, 2796), (0, 2), 35),
    "iPad": ("Apple iPad Pro (12.9-inch) (4th generation) Space Gray.png", (2048, 2732), (2, 0), 35),
}

MOTIFS = ["01-Photos", "02-Selection", "03-Players", "04-Sizes", "05-HighScores"]

# The English page lives at the root; the German one under de/.
LOCALES = {"en-US": "", "de-DE": "de/"}


def rounded(image, radius):
    """Clip to the screen's rounded rectangle, so the bezel's inner corners stay visible."""
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, image.size[0] - 1, image.size[1] - 1], radius=radius, fill=255
    )
    clipped = image.convert("RGBA")
    clipped.putalpha(mask)
    return clipped


def render(device, art_dir, source, destination):
    art_name, screen_size, offset, radius = DEVICES[device]

    bezel = Image.open(art_dir / art_name).convert("RGBA")
    canvas = Image.new("RGBA", bezel.size, (0, 0, 0, 0))

    screen = rounded(Image.open(source).convert("RGBA").resize(screen_size, Image.LANCZOS), radius)

    # `FramedScreenshotView` is a ZStack: both children are centred and only the bezel
    # carries `devicePositioningOffset`.
    centre_x, centre_y = canvas.size[0] // 2, canvas.size[1] // 2
    canvas.alpha_composite(screen, (centre_x - screen_size[0] // 2, centre_y - screen_size[1] // 2))
    canvas.alpha_composite(bezel, (max(0, offset[0]), max(0, offset[1])))

    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, "PNG", optimize=True)
    return canvas.size


def main():
    site = Path(__file__).resolve().parent.parent

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--ios-repo",
        type=Path,
        default=site.parent / "Photo-Memory-iOS",
        help="Checkout of Photo-Memory-iOS holding Screenshots/raw-screenshots and Tools/EasyFrame.",
    )
    args = parser.parse_args()

    art_dir = args.ios_repo / "Tools/EasyFrame/Sources/Resources"
    raw_dir = args.ios_repo / "Screenshots/raw-screenshots"

    for path, what in ((art_dir, "bezel art"), (raw_dir, "raw screenshots")):
        if not path.is_dir():
            raise SystemExit(f"error: no {what} at {path} — run 'make screenshots' in the iOS repo first.")

    for locale, prefix in LOCALES.items():
        for device in DEVICES:
            for motif in MOTIFS:
                source = raw_dir / locale / f"{device}-{motif}.png"
                name = f"{device.lower()}-{motif.lower()}-framed.png"
                size = render(device, art_dir, source, site / (prefix + "images/screenshots") / name)
                print(f"{locale} {name} -> {size[0]}x{size[1]}")


if __name__ == "__main__":
    main()
