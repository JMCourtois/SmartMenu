import { z } from "zod";

import {
  getAllMenuItems,
  getGuestCopy,
  hasTag,
  localizedAllergenName,
  localizedDietaryTagName,
  localizedIngredients,
  localizedItemField,
  localizedName,
  localizedRestaurantField,
} from "@/lib/guest-menu";
import type { MenuItemView, RestaurantMenuView } from "@/types/menu";

export const ConciergeMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(1200),
  locale: z.string().max(12).optional(),
});

export const ConciergePreferencesSchema = z.object({
  dietaryPreferences: z.array(z.string().max(40)).default([]),
  avoidedIngredients: z.array(z.string().max(60)).default([]),
  spiceTolerance: z.enum(["mild", "medium", "hot"]).default("medium"),
  budget: z.enum(["any", "under-15", "under-20", "splurge"]).default("any"),
});

export const ConciergeRequestSchema = z.object({
  restaurantSlug: z.string().min(1),
  locale: z.string().max(12).default("en"),
  chatLocale: z.string().max(12).optional(),
  question: z.string().min(1).max(1200),
  preferences: ConciergePreferencesSchema.default({
    dietaryPreferences: [],
    avoidedIngredients: [],
    spiceTolerance: "medium",
    budget: "any",
  }),
  conversation: z.array(ConciergeMessageSchema).max(8).default([]),
  visibleItemIds: z.array(z.string()).max(80).default([]),
  focusItemId: z.string().optional(),
});

export const ConciergeRecommendationReasonSchema = z.object({
  itemId: z.string(),
  reason: z.string().max(240),
});

export const ConciergeResponseSchema = z.object({
  answer: z.string().min(1).max(1600),
  recommendedItemIds: z.array(z.string()).max(5).default([]),
  recommendationReasons: z.array(ConciergeRecommendationReasonSchema).max(5).default([]),
  safetyNotes: z.array(z.string().max(240)).max(4).default([]),
  followUpPrompts: z.array(z.string().max(120)).max(4).default([]),
});

export type ConciergeRequest = z.infer<typeof ConciergeRequestSchema>;
export type ConciergeResponse = z.infer<typeof ConciergeResponseSchema>;
export type ConciergePreferences = z.infer<typeof ConciergePreferencesSchema>;

export function parseConciergeModelContent(content: string) {
  const withoutThinking = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  try {
    return ConciergeResponseSchema.parse(JSON.parse(withoutThinking));
  } catch {
    const start = withoutThinking.indexOf("{");
    const end = withoutThinking.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Concierge response did not contain valid JSON.");
    }

    return ConciergeResponseSchema.parse(JSON.parse(withoutThinking.slice(start, end + 1)));
  }
}

export function sanitizeConciergeResponse({
  response,
  menu,
  visibleItemIds,
  focusItemId,
}: {
  response: ConciergeResponse;
  menu: RestaurantMenuView;
  visibleItemIds: string[];
  focusItemId?: string;
}) {
  const normalizedResponse = ConciergeResponseSchema.parse(response);
  const menuItems = getAllMenuItems(menu);
  const validItemIds = new Set(menuItems.map((item) => item.id));
  const visibleSet = new Set(visibleItemIds);
  const allowedIds = visibleItemIds.length
    ? new Set([...visibleSet].filter((id) => validItemIds.has(id)))
    : validItemIds;
  if (focusItemId && validItemIds.has(focusItemId)) {
    allowedIds.add(focusItemId);
  }
  const recommendedItemIds = normalizedResponse.recommendedItemIds.filter((id) =>
    allowedIds.has(id),
  );
  const recommendedIdSet = new Set(recommendedItemIds);

  return ConciergeResponseSchema.parse({
    ...normalizedResponse,
    recommendedItemIds,
    recommendationReasons: normalizedResponse.recommendationReasons.filter(
      (reason) => allowedIds.has(reason.itemId) && recommendedIdSet.has(reason.itemId),
    ),
    safetyNotes: normalizedResponse.safetyNotes,
    followUpPrompts: normalizedResponse.followUpPrompts,
  });
}

export function findConciergeMenuItem(menu: RestaurantMenuView, itemId: string | undefined) {
  if (!itemId) {
    return null;
  }

  return getAllMenuItems(menu).find((item) => item.id === itemId) ?? null;
}

function serializeConciergeItem(item: MenuItemView, locale: string) {
  return {
    id: item.id,
    name: localizedName(item, locale),
    slug: item.slug,
    description: localizedItemField(item, locale, "description"),
    priceCents: item.priceCents,
    available: item.isAvailable,
    promoted: item.isPromoted,
    ingredients: localizedIngredients(item, locale),
    origin: localizedItemField(item, locale, "origin"),
    tasteProfile: localizedItemField(item, locale, "tasteProfile"),
    preparation: localizedItemField(item, locale, "preparation"),
    spiceLevel: item.spiceLevel,
    explanation: localizedItemField(item, locale, "explanation"),
    tags: item.dietaryTags.map((tag) => ({
      code: tag.code,
      name: localizedDietaryTagName(tag, locale),
      verified: tag.verificationStatus === "VERIFIED",
      safetySensitive: tag.safetySensitive,
    })),
    allergens: item.allergens.map((allergen) => ({
      code: allergen.code,
      name: localizedAllergenName(allergen, locale),
      status: allergen.status,
      verified: allergen.verificationStatus === "VERIFIED",
      note: allergen.note,
    })),
    pairings: item.pairings.map((pairing) => ({
      pairedItemName: pairing.pairedItemName,
      reason: pairing.reason,
    })),
  };
}

export function buildConciergeMenuContext(menu: RestaurantMenuView, locale: string) {
  return {
    restaurant: {
      name: menu.restaurant.name,
      cuisine: localizedRestaurantField(menu.restaurant, locale, "cuisine"),
      city: menu.restaurant.city,
      legalNotice: localizedRestaurantField(menu.restaurant, locale, "legalNotice"),
    },
    items: getAllMenuItems(menu).map((item) => serializeConciergeItem(item, locale)),
  };
}

export function buildFocusedItemContext(
  menu: RestaurantMenuView,
  locale: string,
  focusItemId: string | undefined,
) {
  const item = findConciergeMenuItem(menu, focusItemId);
  return item ? serializeConciergeItem(item, locale) : null;
}

function hasAllergenOrIngredient(item: MenuItemView, avoided: string[]) {
  const normalizedAvoided = avoided.map((entry) => entry.toLowerCase());
  if (normalizedAvoided.length === 0) {
    return false;
  }

  const itemText = [
    item.name,
    item.description,
    item.ingredients.join(" "),
    ...item.allergens.map((allergen) => `${allergen.code} ${allergen.name}`),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return normalizedAvoided.some((entry) => itemText.includes(entry));
}

function budgetMatches(item: MenuItemView, budget: ConciergePreferences["budget"]) {
  if (budget === "under-15") return item.priceCents < 1500;
  if (budget === "under-20") return item.priceCents < 2000;
  return true;
}

function reasonForItem({
  item,
  preferences,
  focused,
  locale,
}: {
  item: MenuItemView;
  preferences: ConciergePreferences;
  focused: boolean;
  locale: string;
}) {
  const copy = getGuestCopy(locale);
  if (focused) {
    return `${localizedName(item, locale)}: ${localizedItemField(item, locale, "tasteProfile")}`;
  }

  if (preferences.dietaryPreferences.some((tag) => hasTag(item, tag))) {
    return copy.ai.preferenceSummary;
  }

  if (preferences.budget !== "any" && budgetMatches(item, preferences.budget)) {
    return copy.intents["under-20"];
  }

  if (preferences.spiceTolerance === "hot" && item.spiceLevel >= 3) {
    return copy.ai.hot;
  }

  if (preferences.spiceTolerance === "mild" && item.spiceLevel <= 1) {
    return copy.ai.mild;
  }

  return localizedItemField(item, locale, "tasteProfile") || copy.recommendedDescription;
}

export function buildFallbackConciergeResponse({
  menu,
  locale,
  question,
  visibleItemIds,
  preferences = {
    dietaryPreferences: [],
    avoidedIngredients: [],
    spiceTolerance: "medium",
    budget: "any",
  },
  focusItemId,
}: {
  menu: RestaurantMenuView;
  locale: string;
  question: string;
  visibleItemIds: string[];
  preferences?: ConciergePreferences;
  focusItemId?: string;
}): ConciergeResponse {
  const allItems = getAllMenuItems(menu).filter((item) => item.isAvailable);
  const visibleSet = new Set(visibleItemIds);
  const focusItem = findConciergeMenuItem(menu, focusItemId) ?? null;
  const poolBase = visibleItemIds.length
    ? allItems.filter((item) => visibleSet.has(item.id))
    : allItems;
  const pool = poolBase.filter(
    (item) =>
      item.id === focusItem?.id ||
      (!hasAllergenOrIngredient(item, preferences.avoidedIngredients) &&
        budgetMatches(item, preferences.budget)),
  );
  const normalizedQuestion = question.toLowerCase();
  const wantsSpice = /spicy|hot|chili|chilli|spice/.test(normalizedQuestion);
  const wantsLight = /light|fresh|healthy|not heavy/.test(normalizedQuestion);
  const wantsVegetarian = /vegetarian|vegan|without meat|no meat/.test(normalizedQuestion);
  const wantsNoPork = /no pork|without pork|avoid pork|pork/.test(normalizedQuestion);
  const allergenSensitive = /allerg|gluten|lactose|milk|shellfish|shrimp|prawn|nut|peanut|sesame|soy|pork|vegan|vegetarian/.test(
    normalizedQuestion,
  );

  const scored = pool
    .map((item) => {
      let score = Number(item.isPromoted) * 4;
      if (item.id === focusItem?.id) score += 20;
      if (wantsSpice) score += item.spiceLevel;
      if (wantsLight && item.dietaryTags.some((tag) => tag.code === "light")) score += 5;
      if (wantsVegetarian && item.dietaryTags.some((tag) => ["vegetarian", "vegan"].includes(tag.code))) {
        score += 5;
      }
      if (wantsNoPork && hasTag(item, "no-pork")) score += 5;
      for (const preference of preferences.dietaryPreferences) {
        if (preference === "spicy") score += item.spiceLevel;
        else if (preference === "under-20" && item.priceCents < 2000) score += 4;
        else if (hasTag(item, preference)) score += 5;
      }
      if (preferences.spiceTolerance === "mild") score += item.spiceLevel <= 1 ? 3 : -3;
      if (preferences.spiceTolerance === "hot") score += item.spiceLevel >= 3 ? 4 : 0;
      if (preferences.budget !== "any" && budgetMatches(item, preferences.budget)) score += 3;
      if (item.priceCents < 2000) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.priceCents - b.item.priceCents)
    .slice(0, 3)
    .map(({ item }) => item);

  const names = scored.map((item) => localizedName(item, locale));
  const focusedName = focusItem ? localizedName(focusItem, locale) : null;
  const focusedExplanation = focusItem
    ? localizedItemField(focusItem, locale, "explanation")
    : "";
  const copy = getGuestCopy(locale);
  const recommendationReasons = scored.map((item) => ({
    itemId: item.id,
    reason: reasonForItem({
      item,
      preferences,
      focused: item.id === focusItem?.id,
      locale,
    }),
  }));

  return {
    answer:
      names.length > 0 && focusedName
        ? `${focusedName}: ${focusedExplanation} ${copy.recommendedDescription}: ${names.filter((name) => name !== focusedName).join(", ") || focusedName}. ${copy.safetyNotice}`
        : names.length > 0
          ? `${copy.recommendedNow}: ${names.join(", ")}. ${copy.recommendedDescription} ${copy.safetyNotice}`
          : `${copy.noDishesTitle}. ${copy.noDishesDescription}`,
    recommendedItemIds: scored.map((item) => item.id),
    recommendationReasons,
    safetyNotes: [
      allergenSensitive
        ? copy.safetyNotice
        : copy.askStaff,
      copy.safetyNotice,
    ].filter(Boolean),
    followUpPrompts: copy.ai.demoPrompts.slice(0, 4).map((prompt) => prompt.prompt),
  };
}
