"""Process car images: white background + logo on plate + top-right watermark."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = Path(r"C:\Users\Ali Hasnain\.cursor\projects\c-Users-Ali-Hasnain-saftours-clone\assets")
LOGO = ROOT / "images" / "logo.png"
OUT = ROOT / "images" / "cars-preview"

CAR_NAMES = {
    "1.37.12": "kia-sportage",
    "1.37.52": "toyota-corolla-altis",
    "1.54.35": "toyota-land-cruiser-alt",
    "1.54.36_PM-1b46": "toyota-corolla",
    "1.54.36_PM__1_": "toyota-revo-dala",
    "1.54.37": "hyundai-tucson",
    "1.54.38_PM-9dae": "suzuki-alto-japanese",
    "1.54.38_PM__1_": "toyota-prado",
    "1.54.39_PM-1655": "toyota-yaris",
    "1.54.39_PM__1_": "toyota-land-cruiser",
    "1.54.40_PM-f576": "toyota-hiace",
    "1.54.40_PM__1_": "honda-civic",
    "1.54.41_PM-9ae0": "honda-brv",
    "1.54.41_PM__1_": "honda-city",
    "1.54.42": "suzuki-cultus",
}


def is_background(r, g, b):
    if r > 228 and g > 228 and b > 228:
        return True
    if r < 35 and g < 35 and b < 35:
        return True
    if r > 195 and g > 195 and b > 195 and abs(r - g) < 18 and abs(g - b) < 18:
        return True
    return False


def remove_background(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_background(r, g, b):
                pixels[x, y] = (r, g, b, 0)

    white = Image.new("RGBA", img.size, (255, 255, 255, 255))
    white.paste(img, (0, 0), img)
    return white.convert("RGB")


def fit_logo(logo: Image.Image, max_w: int, max_h: int) -> Image.Image:
    logo = logo.convert("RGBA")
    ratio = min(max_w / logo.width, max_h / logo.height)
    size = (max(1, int(logo.width * ratio)), max(1, int(logo.height * ratio)))
    return logo.resize(size, Image.Resampling.LANCZOS)


def add_logos(img: Image.Image, logo: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size

    corner_logo = fit_logo(logo, int(w * 0.16), int(h * 0.11))
    pad = int(w * 0.025)
    img.paste(corner_logo, (w - corner_logo.width - pad, pad), corner_logo)

    plate_w = int(w * 0.22)
    plate_h = int(h * 0.075)
    plate_x = (w - plate_w) // 2
    plate_y = int(h * 0.73)

    plate_bg = Image.new("RGBA", (plate_w, plate_h), (255, 255, 255, 250))
    img.paste(plate_bg, (plate_x, plate_y), plate_bg)

    plate_logo = fit_logo(logo, int(plate_w * 0.88), int(plate_h * 0.82))
    lx = plate_x + (plate_w - plate_logo.width) // 2
    ly = plate_y + (plate_h - plate_logo.height) // 2
    img.paste(plate_logo, (lx, ly), plate_logo)

    return img.convert("RGB")


def guess_name(path: Path) -> str:
    stem = path.stem
    for key, name in CAR_NAMES.items():
        if key in stem:
            return name
    return "car"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    logo = Image.open(LOGO)

    files = sorted(
        f for f in ASSETS.glob("*.png")
        if "WhatsApp_Image" in f.name and "1.32.09" not in f.name
    )
    print(f"Found {len(files)} car images")

    for i, path in enumerate(files, 1):
        name = guess_name(path)
        out_path = OUT / f"{i:02d}-{name}.jpg"

        img = Image.open(path)
        img = remove_background(img)
        img = add_logos(img, logo)
        img.save(out_path, "JPEG", quality=92, optimize=True)
        print(f"Saved: {out_path.name}")

    print(f"\nDone! Preview folder: {OUT}")


if __name__ == "__main__":
    main()
