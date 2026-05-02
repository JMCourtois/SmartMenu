import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import OpenAI from "openai";

import { demoPublishedMenus } from "../src/lib/demo-data";
import {
  getAllMenuItems,
  localizedIngredients,
  localizedItemField,
} from "../src/lib/guest-menu";
import type { MenuItemView, RestaurantMenuView } from "../src/types/menu";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const OUT_ROOT = path.join(ROOT, "public", "demo-dishes");
const MANIFEST_PATH = path.join(OUT_ROOT, "manifest.json");
const MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";
const SIZE = "1536x1024";
const QUALITY = "high";
const OUTPUT_FORMAT = "webp";
const OUTPUT_COMPRESSION = 85;

type ManifestItem = {
  restaurantSlug: string;
  itemSlug: string;
  dishName: string;
  category: string;
  model: string;
  path: string;
  promptSummary: string;
};

type Manifest = {
  generatedAt: string;
  mode: "dry-run" | "generated";
  model: string;
  size: string;
  quality: string;
  outputFormat: string;
  outputCompression: number;
  items: ManifestItem[];
};

function loadEnvFile(filePath: string) {
  return fs
    .readFile(filePath, "utf8")
    .then((content) => {
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
          continue;
        }

        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts
          .join("=")
          .trim()
          .replace(/^['"]|['"]$/g, "");

        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    })
    .catch(() => undefined);
}

function parseArgs(argv: string[]) {
  const args = new Map<string, string | true>();

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split("=");
    if (inlineValue !== undefined) {
      args.set(rawKey, inlineValue);
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args.set(rawKey, next);
      index += 1;
    } else {
      args.set(rawKey, true);
    }
  }

  return {
    force: args.has("force"),
    dryRun: args.has("dry-run"),
    only: typeof args.get("only") === "string" ? (args.get("only") as string) : null,
    limit:
      typeof args.get("limit") === "string"
        ? Number.parseInt(args.get("limit") as string, 10)
        : null,
  };
}

function findCategoryName(menu: RestaurantMenuView, itemId: string) {
  return (
    menu.version.categories.find((category) =>
      category.items.some((item) => item.id === itemId),
    )?.name ?? menu.menu.name
  );
}

function promptForDish(menu: RestaurantMenuView, item: MenuItemView, category: string) {
  const ingredients = localizedIngredients(item, "en");
  const origin = localizedItemField(item, "en", "origin");
  const taste = localizedItemField(item, "en", "tasteProfile");
  const preparation = localizedItemField(item, "en", "preparation");
  const explanation = localizedItemField(item, "en", "explanation");
  const pairings = item.pairings.map((pairing) => pairing.pairedItemName).join(", ");

  return [
    `Realistic restaurant food photography of ${item.name}.`,
    `Restaurant concept: ${menu.restaurant.name}, ${menu.restaurant.cuisine} in ${menu.restaurant.city}.`,
    `Menu category: ${category}.`,
    `Dish context: ${explanation}`,
    `Origin or cultural context: ${origin}`,
    `Ingredients to visibly respect where natural: ${ingredients.join(", ")}.`,
    `Preparation: ${preparation}`,
    `Taste profile: ${taste}`,
    pairings ? `Suitable pairing context: ${pairings}.` : "",
    "Style: clean plated food in a real restaurant setting, natural window light, appetizing texture, shallow depth of field, three-quarter overhead angle, true to the dish.",
    "Strict negatives: no text, no logos, no people, no hands, no packaging, no illustration, no cartoon, no vector art, no UI, no watermark.",
  ]
    .filter(Boolean)
    .join("\n");
}

function outputPathFor(menu: RestaurantMenuView, item: MenuItemView) {
  return path.join(OUT_ROOT, menu.restaurant.slug, `${item.slug}.webp`);
}

function publicPathFor(menu: RestaurantMenuView, item: MenuItemView) {
  return `/demo-dishes/${menu.restaurant.slug}/${item.slug}.webp`;
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeBase64Image(filePath: string, b64: string) {
  const buffer = Buffer.from(b64, "base64");
  const temporaryPath = `${filePath}.tmp`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(temporaryPath, buffer);
  await fs.rename(temporaryPath, filePath);
}

async function fetchImageUrl(filePath: string, url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not download generated image: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const temporaryPath = `${filePath}.tmp`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(temporaryPath, buffer);
  await fs.rename(temporaryPath, filePath);
}

async function main() {
  await loadEnvFile(path.join(ROOT, ".env.local"));
  const args = parseArgs(process.argv.slice(2));

  if (!process.env.OPENAI_API_KEY && !args.dryRun) {
    throw new Error("OPENAI_API_KEY is required to generate demo dish images.");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const manifestItems: ManifestItem[] = [];
  const jobs = demoPublishedMenus.flatMap((menu) =>
    getAllMenuItems(menu).map((item) => ({
      menu,
      item,
      category: findCategoryName(menu, item.id),
    })),
  );
  const selected = jobs
    .filter(({ menu, item }) => {
      if (!args.only) {
        return true;
      }

      return args.only === `${menu.restaurant.slug}/${item.slug}`;
    })
    .slice(0, args.limit ?? jobs.length);

  if (selected.length === 0) {
    throw new Error(`No demo dish matched ${args.only ?? "the current filters"}.`);
  }

  console.log(
    `Generating ${selected.length} realistic ${OUTPUT_FORMAT.toUpperCase()} demo dish image(s) with ${MODEL}.`,
  );

  for (const [index, { menu, item, category }] of selected.entries()) {
    const filePath = outputPathFor(menu, item);
    const relativePath = publicPathFor(menu, item);
    const prompt = promptForDish(menu, item, category);
    const promptSummary = prompt.replace(/\s+/g, " ").slice(0, 260);

    manifestItems.push({
      restaurantSlug: menu.restaurant.slug,
      itemSlug: item.slug,
      dishName: item.name,
      category,
      model: MODEL,
      path: relativePath,
      promptSummary,
    });

    if (!args.force && (await fileExists(filePath))) {
      console.log(`[${index + 1}/${selected.length}] Skipping existing ${relativePath}`);
      continue;
    }

    if (args.dryRun) {
      console.log(`[${index + 1}/${selected.length}] Dry run ${relativePath}`);
      console.log(prompt);
      continue;
    }

    console.log(`[${index + 1}/${selected.length}] Generating ${relativePath}`);
    const result = await client.images.generate({
      model: MODEL,
      prompt,
      size: SIZE,
      quality: QUALITY,
      output_format: OUTPUT_FORMAT,
      output_compression: OUTPUT_COMPRESSION,
    } as never);
    const image = result.data?.[0];

    if (!image) {
      throw new Error(`OpenAI returned no image for ${relativePath}.`);
    }

    if ("b64_json" in image && image.b64_json) {
      await writeBase64Image(filePath, image.b64_json);
    } else if ("url" in image && image.url) {
      await fetchImageUrl(filePath, image.url);
    } else {
      throw new Error(`OpenAI returned an unsupported image payload for ${relativePath}.`);
    }
  }

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    mode: args.dryRun ? "dry-run" : "generated",
    model: MODEL,
    size: SIZE,
    quality: QUALITY,
    outputFormat: OUTPUT_FORMAT,
    outputCompression: OUTPUT_COMPRESSION,
    items: manifestItems,
  };

  await fs.mkdir(OUT_ROOT, { recursive: true });
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${path.relative(ROOT, MANIFEST_PATH)}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
