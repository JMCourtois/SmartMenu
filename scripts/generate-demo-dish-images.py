#!/usr/bin/env python3
"""Generate deterministic local demo dish images.

These are app-side demo assets: no remote URLs, no text, no people, no logos.
The generator uses the structured menu data to create one food-photo-style image
per dish with colors and plating cues derived from cuisine, ingredients, and tags.
"""

from __future__ import annotations

import hashlib
import json
import math
import random
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT_ROOT = ROOT / "public" / "demo-dishes"
WIDTH = 1200
HEIGHT = 850


def load_menu_items() -> list[dict]:
    code = """
import { demoPublishedMenus } from "./src/lib/demo-data";
const payload = demoPublishedMenus.map((menu) => ({
  restaurantSlug: menu.restaurant.slug,
  theme: menu.restaurant.theme,
  items: menu.version.categories.flatMap((category) =>
    category.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      category: category.name,
      imageUrl: item.imageUrl,
      ingredients: item.ingredients,
      tags: item.dietaryTags.map((tag) => tag.code),
      spiceLevel: item.spiceLevel,
    })),
  ),
}));
console.log(JSON.stringify(payload));
"""
    raw = subprocess.check_output(["pnpm", "tsx", "-e", code], cwd=ROOT, text=True)
    restaurants = json.loads(raw)
    items: list[dict] = []
    for restaurant in restaurants:
        for item in restaurant["items"]:
            items.append({**item, "restaurantSlug": restaurant["restaurantSlug"], "theme": restaurant["theme"]})
    return items


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.strip().lstrip("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return tuple(round(a[i] * (1 - amount) + b[i] * amount) for i in range(3))


def clamp(value: int) -> int:
    return max(0, min(255, value))


def jitter(color: tuple[int, int, int], rng: random.Random, amount: int = 16) -> tuple[int, int, int]:
    return tuple(clamp(channel + rng.randint(-amount, amount)) for channel in color)


def add_noise(image: Image.Image, rng: random.Random, opacity: float = 0.055) -> Image.Image:
    noise = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pixels = noise.load()
    for y in range(0, image.height, 2):
        for x in range(0, image.width, 2):
            value = rng.randint(0, 255)
            alpha = int(255 * opacity * rng.random())
            pixels[x, y] = (value, value, value, alpha)
    return Image.alpha_composite(image.convert("RGBA"), noise).convert("RGB")


def draw_shadow(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], offset: int, alpha: int) -> None:
    x0, y0, x1, y1 = box
    draw.ellipse((x0 + offset, y0 + offset, x1 + offset, y1 + offset), fill=(0, 0, 0, alpha))


def draw_plate(base: Image.Image, rng: random.Random, theme: dict) -> tuple[ImageDraw.ImageDraw, tuple[int, int, int, int]]:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    plate = (170, 115, WIDTH - 170, HEIGHT - 95)
    draw_shadow(draw, plate, 24, 44)
    draw.ellipse(plate, fill=(252, 249, 240, 255), outline=(226, 220, 206, 255), width=6)
    inner = tuple(int(value) for value in (230, 170, WIDTH - 230, HEIGHT - 155))
    draw.ellipse(inner, outline=(239, 232, 216, 255), width=7)
    base.alpha_composite(layer)
    return ImageDraw.Draw(base), inner


INGREDIENT_COLORS: dict[str, tuple[int, int, int]] = {
    "pork": (165, 92, 70),
    "beef": (126, 68, 45),
    "chicken": (225, 174, 105),
    "fish": (234, 220, 196),
    "trout": (230, 204, 178),
    "prawn": (239, 119, 80),
    "prawns": (239, 119, 80),
    "tofu": (244, 234, 203),
    "paneer": (238, 227, 194),
    "rice": (246, 243, 229),
    "noodles": (235, 205, 132),
    "potato": (222, 196, 121),
    "potatoes": (222, 196, 121),
    "dumpling": (229, 210, 166),
    "cabbage": (126, 59, 97),
    "red cabbage": (120, 48, 93),
    "kimchi": (186, 49, 35),
    "mango": (235, 162, 46),
    "apple": (216, 72, 55),
    "beetroot": (126, 38, 77),
    "spinach": (56, 132, 80),
    "basil": (54, 133, 74),
    "cilantro": (55, 142, 82),
    "mint": (73, 158, 101),
    "chili": (197, 42, 34),
    "lime": (114, 174, 73),
    "lemon": (229, 201, 76),
    "coconut": (244, 237, 221),
    "lentils": (193, 116, 49),
    "cheese": (228, 171, 70),
    "cream": (246, 232, 205),
    "sesame": (230, 215, 176),
    "peanut": (189, 132, 76),
    "peanuts": (189, 132, 76),
    "mushroom": (143, 111, 82),
    "mushrooms": (143, 111, 82),
    "tomato": (195, 64, 48),
    "cucumber": (86, 159, 94),
}


def ingredient_color(ingredient: str, rng: random.Random, fallback: tuple[int, int, int]) -> tuple[int, int, int]:
    lower = ingredient.lower()
    for key, color in INGREDIENT_COLORS.items():
        if key in lower:
            return jitter(color, rng, 12)
    return jitter(fallback, rng, 24)


def polar_point(cx: int, cy: int, radius_x: float, radius_y: float, angle: float) -> tuple[int, int]:
    return (round(cx + math.cos(angle) * radius_x), round(cy + math.sin(angle) * radius_y))


def draw_noodle_lines(draw: ImageDraw.ImageDraw, rng: random.Random, box: tuple[int, int, int, int], color: tuple[int, int, int]) -> None:
    x0, y0, x1, y1 = box
    for _ in range(34):
        y = rng.randint(y0, y1)
        points = []
        for step in range(6):
            x = x0 + step * ((x1 - x0) // 5)
            points.append((x, y + rng.randint(-20, 20)))
        draw.line(points, fill=(*jitter(color, rng, 10), 230), width=rng.randint(5, 9), joint="curve")


def draw_grains(draw: ImageDraw.ImageDraw, rng: random.Random, box: tuple[int, int, int, int], color: tuple[int, int, int]) -> None:
    x0, y0, x1, y1 = box
    for _ in range(210):
        x = rng.randint(x0, x1)
        y = rng.randint(y0, y1)
        if ((x - (x0 + x1) / 2) / ((x1 - x0) / 2)) ** 2 + ((y - (y0 + y1) / 2) / ((y1 - y0) / 2)) ** 2 <= 1:
            draw.ellipse((x, y, x + rng.randint(8, 16), y + rng.randint(3, 7)), fill=(*jitter(color, rng, 8), 235))


def draw_food_blob(
    draw: ImageDraw.ImageDraw,
    rng: random.Random,
    center: tuple[int, int],
    rx: int,
    ry: int,
    color: tuple[int, int, int],
    points: int = 18,
) -> None:
    cx, cy = center
    polygon = []
    for index in range(points):
        angle = 2 * math.pi * index / points
        radius_x = rx * rng.uniform(0.78, 1.12)
        radius_y = ry * rng.uniform(0.78, 1.12)
        polygon.append(polar_point(cx, cy, radius_x, radius_y, angle))
    draw.polygon(polygon, fill=(*color, 245))
    highlight = mix(color, (255, 255, 255), 0.22)
    draw.arc((cx - rx, cy - ry, cx + rx, cy + ry), 205, 318, fill=(*highlight, 170), width=max(3, rx // 12))


def draw_garnish(draw: ImageDraw.ImageDraw, rng: random.Random, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    greens = [(44, 132, 70), (68, 154, 86), (35, 116, 72)]
    reds = [(198, 43, 35), (221, 75, 48)]
    for _ in range(36):
        x = rng.randint(x0, x1)
        y = rng.randint(y0, y1)
        color = rng.choice(greens if rng.random() > 0.25 else reds)
        draw.ellipse((x, y, x + rng.randint(8, 24), y + rng.randint(3, 10)), fill=(*jitter(color, rng, 8), 230))
    for _ in range(22):
        x = rng.randint(x0, x1)
        y = rng.randint(y0, y1)
        draw.line((x, y, x + rng.randint(-18, 18), y + rng.randint(-12, 12)), fill=(255, 245, 210, 180), width=2)


def draw_sauce(draw: ImageDraw.ImageDraw, rng: random.Random, box: tuple[int, int, int, int], spicy: bool) -> None:
    x0, y0, x1, y1 = box
    colors = [(145, 72, 38), (184, 91, 39), (218, 62, 39)] if spicy else [(126, 82, 52), (208, 164, 82), (242, 228, 192)]
    for _ in range(7):
        x = rng.randint(x0, x1 - 120)
        y = rng.randint(y0, y1 - 80)
        draw.ellipse((x, y, x + rng.randint(90, 180), y + rng.randint(42, 90)), fill=(*jitter(rng.choice(colors), rng, 16), 120))


def render_item(item: dict) -> Image.Image:
    seed = int(hashlib.sha256(f"{item['restaurantSlug']}:{item['slug']}".encode()).hexdigest()[:12], 16)
    rng = random.Random(seed)
    theme = item["theme"]
    accent = hex_to_rgb(theme["accent"])
    secondary = hex_to_rgb(theme["secondary"])
    paper = hex_to_rgb(theme["paper"])

    base = Image.new("RGBA", (WIDTH, HEIGHT), mix(paper, (255, 255, 255), 0.35) + (255,))
    draw = ImageDraw.Draw(base)

    for y in range(HEIGHT):
        amount = y / HEIGHT
        color = mix(mix(paper, (255, 255, 255), 0.2), mix(secondary, (255, 255, 255), 0.78), amount)
        draw.line((0, y, WIDTH, y), fill=(*color, 255))

    for _ in range(18):
        x = rng.randint(-80, WIDTH)
        y = rng.randint(-80, HEIGHT)
        radius = rng.randint(55, 170)
        color = mix(rng.choice([accent, secondary, paper]), (255, 255, 255), rng.uniform(0.45, 0.78))
        draw.ellipse((x, y, x + radius, y + radius), fill=(*color, rng.randint(28, 70)))

    draw, inner = draw_plate(base, rng, theme)
    x0, y0, x1, y1 = inner
    cx = (x0 + x1) // 2
    cy = (y0 + y1) // 2
    category = f"{item['name']} {item['category']}".lower()
    ingredients = item["ingredients"]
    tags = set(item["tags"])
    spicy = item["spiceLevel"] > 1 or "spicy" in tags or any("chili" in ingredient.lower() for ingredient in ingredients)

    if any(word in category for word in ["soup", "pho", "ramen", "curry", "dal", "broth", "tom kha"]):
        bowl = (260, 135, WIDTH - 260, HEIGHT - 105)
        draw.ellipse(bowl, fill=(246, 243, 232, 255), outline=(219, 211, 194, 255), width=6)
        soup_color = mix(ingredient_color("lentils" if "dal" in category else "coconut" if "coconut" in " ".join(ingredients).lower() else "beef", rng, secondary), secondary, 0.28)
        draw.ellipse((300, 175, WIDTH - 300, HEIGHT - 150), fill=(*soup_color, 238))
        if "noodles" in " ".join(ingredients).lower() or "pho" in category or "ramen" in category:
            draw_noodle_lines(draw, rng, (355, 250, WIDTH - 355, HEIGHT - 245), (233, 204, 132))
        for index, ingredient in enumerate(ingredients[:7]):
            angle = 2 * math.pi * index / max(7, len(ingredients[:7])) + rng.random()
            px, py = polar_point(cx, cy, rng.randint(95, 260), rng.randint(70, 190), angle)
            color = ingredient_color(ingredient, rng, secondary)
            draw_food_blob(draw, rng, (px, py), rng.randint(34, 70), rng.randint(18, 46), color, points=14)
    elif any(word in category for word in ["noodle", "pad thai", "bun cha", "bún", "spätzle"]):
        draw_noodle_lines(draw, rng, (300, 230, WIDTH - 300, HEIGHT - 220), (230, 190, 115))
        for ingredient in ingredients[:8]:
            color = ingredient_color(ingredient, rng, secondary)
            draw_food_blob(
                draw,
                rng,
                (rng.randint(x0 + 140, x1 - 140), rng.randint(y0 + 95, y1 - 95)),
                rng.randint(36, 82),
                rng.randint(18, 52),
                color,
            )
    elif any(word in category for word in ["rice", "biryani", "bao", "dumpling", "momo", "roll", "sushi"]):
        draw_grains(draw, rng, (330, 235, WIDTH - 330, HEIGHT - 215), (246, 239, 211))
        for ingredient in ingredients[:9]:
            color = ingredient_color(ingredient, rng, accent)
            draw_food_blob(
                draw,
                rng,
                (rng.randint(x0 + 120, x1 - 120), rng.randint(y0 + 80, y1 - 80)),
                rng.randint(42, 88),
                rng.randint(24, 60),
                color,
            )
    elif any(word in category for word in ["strudel", "dessert", "mango", "coffee", "tea", "lassi"]):
        pastry = (360, 260, WIDTH - 360, HEIGHT - 265)
        draw.rounded_rectangle(pastry, radius=70, fill=(218, 146, 61, 245), outline=(179, 103, 48, 210), width=5)
        draw_sauce(draw, rng, (x0 + 70, y0 + 70, x1 - 70, y1 - 70), spicy=False)
        for ingredient in ingredients[:6]:
            color = ingredient_color(ingredient, rng, secondary)
            draw_food_blob(
                draw,
                rng,
                (rng.randint(x0 + 100, x1 - 100), rng.randint(y0 + 100, y1 - 100)),
                rng.randint(26, 58),
                rng.randint(15, 40),
                color,
                points=12,
            )
    else:
        main_ingredients = ingredients[: max(4, min(9, len(ingredients)))]
        for index, ingredient in enumerate(main_ingredients):
            angle = 2 * math.pi * index / len(main_ingredients) + rng.uniform(-0.28, 0.28)
            px, py = polar_point(cx, cy, rng.randint(80, 260), rng.randint(48, 180), angle)
            color = ingredient_color(ingredient, rng, secondary)
            rx = rng.randint(52, 125)
            ry = rng.randint(28, 78)
            draw_food_blob(draw, rng, (px, py), rx, ry, color, points=rng.randint(14, 22))
        if any(tag in tags for tag in ["pork", "traditional", "best-with-beer"]):
            draw_food_blob(draw, rng, (cx - 20, cy - 5), 190, 112, ingredient_color("pork", rng, accent), points=24)

    draw_sauce(draw, rng, (x0 + 70, y0 + 70, x1 - 70, y1 - 70), spicy=spicy)
    draw_garnish(draw, rng, (x0 + 85, y0 + 75, x1 - 85, y1 - 75))

    base = base.filter(ImageFilter.UnsharpMask(radius=2, percent=125, threshold=3))
    base = add_noise(base.convert("RGB"), rng)
    return base


def main() -> None:
    items = load_menu_items()
    for item in items:
        output = ROOT / "public" / item["imageUrl"].lstrip("/")
        output.parent.mkdir(parents=True, exist_ok=True)
        render_item(item).save(output, "WEBP", quality=88, method=6)
    print(f"Generated {len(items)} demo dish images in {OUT_ROOT}")


if __name__ == "__main__":
    main()
