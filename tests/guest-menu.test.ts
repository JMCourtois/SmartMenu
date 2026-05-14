import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

import { getDemoDishImageSource } from "@/lib/demo-dish-images";
import { demoManagerRestaurantsById, demoPublishedMenus } from "@/lib/demo-data";
import {
  filterMenuCategories,
  formatLocalizedPrice,
  getAllMenuItems,
  getDietaryTagVisual,
  getGuestCopy,
  localeOptions,
  localizedCategoryName,
  localizedIngredientLine,
  localizedItemField,
  localizedRestaurantField,
  normalizeMenuDisplayMode,
  SUPPORTED_LOCALES,
} from "@/lib/guest-menu";
import {
  buildPreferenceSummary,
  readGuestPreferences,
  writeGuestPreferences,
} from "@/lib/guest-preferences";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("guest menu views and filters", () => {
  it("provides four complex demo restaurants", () => {
    expect(demoPublishedMenus).toHaveLength(4);
    for (const menu of demoPublishedMenus) {
      expect(getAllMenuItems(menu).length).toBeGreaterThanOrEqual(18);
      expect(menu.version.categories.length).toBeGreaterThanOrEqual(4);
      expect(menu.restaurant.theme.accent).toMatch(/^#/);
    }
  });

  it("filters across dish explanations and ingredients", () => {
    const vietnamese = demoPublishedMenus.find(
      (menu) => menu.restaurant.slug === "demo-vietnamese-house",
    );
    expect(vietnamese).toBeDefined();
    const filtered = filterMenuCategories({
      categories: vietnamese!.version.categories,
      query: "lemongrass",
      intent: null,
      locale: "en",
    });
    expect(filtered.flatMap((category) => category.items).length).toBeGreaterThan(0);
  });

  it("normalizes unsupported menu views back to photo", () => {
    expect(normalizeMenuDisplayMode("classic")).toBe("classic");
    expect(normalizeMenuDisplayMode("unknown")).toBe("photo");
  });

  it("configures all supported guest locales with flags", () => {
    expect(SUPPORTED_LOCALES).toEqual([
      "en",
      "es",
      "de",
      "it",
      "fr",
      "ru",
      "ja",
      "ko",
      "zh-CN",
    ]);
    expect(localeOptions).toHaveLength(9);
    for (const option of localeOptions) {
      expect(option.flag.length).toBeGreaterThan(0);
      expect(option.nativeLabel.length).toBeGreaterThan(0);
    }
  });

  it("provides required guest copy for every locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const copy = getGuestCopy(locale);
      expect(copy.searchPlaceholder).toBeTruthy();
      expect(copy.askAiWhatToOrder).toBeTruthy();
      expect(copy.getRecommendation).toBeTruthy();
      expect(copy.guideMe).toBeTruthy();
      expect(copy.ingredientsPrefix).toBeTruthy();
      expect(copy.ai.filterPreferences).toBeTruthy();
      expect(copy.ai.demoPrompts).toHaveLength(5);
      expect(copy.intents.vegetarian).toBeTruthy();
    }
    expect(getGuestCopy("en").getRecommendation).toBe("Recommend me");
    expect(getGuestCopy("en").getRecommendation).not.toBe("Ask AI what to order");
  });

  it("provides complete translated demo item, category, and restaurant fields", () => {
    for (const menu of demoPublishedMenus) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(localizedRestaurantField(menu.restaurant, locale, "description")).toBeTruthy();
        expect(localizedRestaurantField(menu.restaurant, locale, "cuisine")).toBeTruthy();
        expect(localizedRestaurantField(menu.restaurant, locale, "legalNotice")).toBeTruthy();

        for (const category of menu.version.categories) {
          expect(localizedCategoryName(category, locale)).toBeTruthy();

          for (const item of category.items) {
            const translation = item.translations.find((entry) => entry.locale === locale);
            expect(translation, `${item.slug} missing ${locale}`).toBeDefined();
            expect(translation?.name).toBeTruthy();
            expect(translation?.description).toBeTruthy();
            expect(translation?.origin).toBeTruthy();
            expect(translation?.tasteProfile).toBeTruthy();
            expect(translation?.preparation).toBeTruthy();
            expect(translation?.explanation).toBeTruthy();
            expect(translation?.ingredients?.length).toBeGreaterThan(0);
            expect(translation?.ctaPrompts?.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("falls back to English item fields when a locale field is missing", () => {
    const item = getAllMenuItems(demoPublishedMenus[0])[0];
    const sparseItem = {
      ...item,
      translations: item.translations.filter((translation) => translation.locale === "en"),
    };

    expect(localizedItemField(sparseItem, "ko", "explanation")).toBe(
      localizedItemField(item, "en", "explanation"),
    );
  });

  it("uses localized ingredient previews in classic menu rows", () => {
    const item = demoPublishedMenus[0].version.categories[0].items[0];

    expect(localizedIngredientLine(item, "en")).toContain("pork knuckle");
    expect(localizedIngredientLine(item, "de")).toContain("Kartoffelknödel");
    expect(localizedIngredientLine(item, "ja")).toContain("豚すね肉");
  });

  it("does not leave old generic translation templates in non-English descriptions", () => {
    const bannedSnippets = [
      "helps understand the style",
      "ayuda a entender el estilo",
      "hilft, den Stil",
      "è un buon modo per capire",
      "est une bonne façon de comprendre",
      "помогает понять стиль",
      "特徴を知る最初の一皿",
      "처음 이해하기 좋은",
      "了解这种菜系风格",
    ];

    for (const menu of demoPublishedMenus) {
      for (const item of getAllMenuItems(menu)) {
        const englishDescription = localizedItemField(item, "en", "description");
        for (const locale of SUPPORTED_LOCALES.filter((entry) => entry !== "en")) {
          const description = localizedItemField(item, locale, "description");
          expect(description).not.toBe(englishDescription);
          for (const snippet of bannedSnippets) {
            expect(description).not.toContain(snippet);
          }
        }
      }
    }
  });

  it("points every demo item at a curated stock photo by default", () => {
    expect(existsSync(path.join(process.cwd(), "scripts", "generate-demo-dish-images.py"))).toBe(
      false,
    );
    expect(existsSync(path.join(process.cwd(), "scripts", "generate-demo-dish-images.ts"))).toBe(
      true,
    );

    for (const menu of demoPublishedMenus) {
      expect(demoManagerRestaurantsById[menu.restaurant.id]).toBeTruthy();
      for (const item of getAllMenuItems(menu)) {
        const imageSource = getDemoDishImageSource(menu.restaurant.slug, item.slug);
        expect(imageSource).toBeTruthy();
        expect(imageSource?.url).toBe(item.imageUrl);
        expect(item.imageUrl).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
        expect(item.imageUrl).not.toContain("source.unsplash.com");
      }
    }
  });

  it("maps every known guest tag to a semantic icon visual", () => {
    const tags = new Set<string>();
    for (const menu of demoPublishedMenus) {
      for (const item of getAllMenuItems(menu)) {
        for (const tag of item.dietaryTags) {
          tags.add(tag.code);
        }
      }
    }

    for (const tag of tags) {
      const visual = getDietaryTagVisual(tag);
      expect(visual.icon).toBeTruthy();
      expect(visual.tone).toBeTruthy();
    }
  });

  it("formats prices for the selected locale", () => {
    expect(formatLocalizedPrice(1290, "EUR", "en")).toContain("€");
    expect(formatLocalizedPrice(1290, "EUR", "de")).toContain("12,90");
    expect(formatLocalizedPrice(1290, "EUR", "it")).toContain("12,90");
    expect(formatLocalizedPrice(1290, "EUR", "fr")).toContain("12,90");
    expect(formatLocalizedPrice(1290, "EUR", "ru")).toContain("12,90");
    expect(formatLocalizedPrice(1290, "EUR", "zh-CN")).toContain("12.90");
    expect(formatLocalizedPrice(1290, "EUR", "ja")).toContain("€");
  });

  it("stores guest preferences in session-shaped storage", () => {
    const storage = new MemoryStorage();
    writeGuestPreferences(storage, "demo", {
      dietaryPreferences: ["vegan"],
      avoidedIngredients: ["cilantro"],
      spiceTolerance: "mild",
      budget: "under-20",
      displayMode: "classic",
      language: "en",
    });

    expect(readGuestPreferences(storage, "demo")).toMatchObject({
      dietaryPreferences: ["vegan"],
      avoidedIngredients: ["cilantro"],
      spiceTolerance: "mild",
      budget: "under-20",
      displayMode: "classic",
    });
  });

  it("summarizes active preferences for the AI widget", () => {
    expect(
      buildPreferenceSummary({
        dietaryPreferences: ["vegetarian"],
        avoidedIngredients: ["peanuts"],
        spiceTolerance: "mild",
        budget: "under-20",
      }),
    ).toEqual(["vegetarian", "mild spice", "under-20", "avoid peanuts"]);
  });
});
