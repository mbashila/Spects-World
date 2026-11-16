"""Builds web assets from the raw brand files in this folder.

Run from the project root:  python brand/make_assets.py
Outputs:
  src/assets/brand/logo-dark.png   transparent logo for light backgrounds (original colours)
  src/assets/brand/logo-light.png  transparent logo for dark backgrounds (black -> white)
  public/favicon.png               eye mark only, 64px
  src/assets/images/optimized/*.webp  photos
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, 'brand')
OUT_BRAND = os.path.join(ROOT, 'src', 'assets', 'brand')
OUT_IMG = os.path.join(ROOT, 'src', 'assets', 'images', 'optimized')
PUBLIC = os.path.join(ROOT, 'public')
for d in (OUT_BRAND, OUT_IMG, PUBLIC):
    os.makedirs(d, exist_ok=True)


def white_to_alpha(im: Image.Image) -> Image.Image:
    """GIMP-style 'colour to alpha' for white: keeps anti-aliased edges clean."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            alpha = 1 - min(r, g, b) / 255  # how far from white
            if alpha <= 0:
                px[x, y] = (0, 0, 0, 0)
                continue
            un = lambda c: max(0, min(255, round((c - (1 - alpha) * 255) / alpha)))
            px[x, y] = (un(r), un(g), un(b), round(alpha * a))
    return im


def to_light(im: Image.Image) -> Image.Image:
    """Recolour neutral (black/grey) pixels to white; the orange stays orange."""
    im = im.copy()
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a and max(r, g, b) - min(r, g, b) < 60:
                px[x, y] = (255, 255, 255, a)
    return im


logo = white_to_alpha(Image.open(os.path.join(BRAND, 'logo-original.png')))
logo = logo.crop(logo.getbbox())
logo.save(os.path.join(OUT_BRAND, 'logo-dark.png'), optimize=True)
to_light(logo).save(os.path.join(OUT_BRAND, 'logo-light.png'), optimize=True)

# Eye mark = everything above the wordmark (find the first fully transparent row gap)
alpha_rows = [any(logo.getpixel((x, y))[3] > 10 for x in range(logo.width)) for y in range(logo.height)]
gap = next(y for y in range(logo.height // 3, logo.height) if not alpha_rows[y])
mark = logo.crop((0, 0, logo.width, gap))
mark = mark.crop(mark.getbbox())
side = max(mark.size) + 8
canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
canvas.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)
canvas.resize((64, 64), Image.LANCZOS).save(os.path.join(PUBLIC, 'favicon.png'), optimize=True)

for name in ('customer-trying-frames', 'team-reception'):
    im = Image.open(os.path.join(BRAND, name + '.jpg')).convert('RGB')
    im.save(os.path.join(OUT_IMG, name + '.webp'), 'WEBP', quality=82, method=6)

print('logo', logo.size, 'mark gap at', gap)
