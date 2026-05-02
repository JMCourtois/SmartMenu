import { describe, expect, it } from "vitest";

import {
  buildFallbackConciergeResponse,
  ConciergeRequestSchema,
  findConciergeMenuItem,
  parseConciergeModelContent,
  sanitizeConciergeResponse,
} from "@/lib/ai/concierge";
import { demoPublishedMenus } from "@/lib/demo-data";
import { getAllMenuItems } from "@/lib/guest-menu";

describe("AI concierge safety", () => {
  const menu = demoPublishedMenus[0];

  it("parses valid model JSON even if MiniMax includes thinking tags", () => {
    expect(
      parseConciergeModelContent(
        `<think>private reasoning</think>{"answer":"Try this.","recommendedItemIds":["${getAllMenuItems(menu)[0].id}"],"safetyNotes":["Ask staff about allergies."],"followUpPrompts":["What is traditional?"]}`,
      ).answer,
    ).toBe("Try this.");
  });

  it("rejects invalid model JSON", () => {
    expect(() => parseConciergeModelContent("I recommend everything")).toThrow();
  });

  it("accepts chatLocale separately from menu locale", () => {
    const parsed = ConciergeRequestSchema.parse({
      restaurantSlug: menu.restaurant.slug,
      locale: "en",
      chatLocale: "ru",
      question: "Что заказать?",
      preferences: {
        dietaryPreferences: [],
        avoidedIngredients: [],
        spiceTolerance: "medium",
        budget: "any",
      },
      conversation: [{ role: "user", content: "Что заказать?", locale: "ru" }],
      visibleItemIds: [],
    });

    expect(parsed.chatLocale).toBe("ru");
  });

  it("removes recommended item IDs that are not on the requested menu", () => {
    const itemId = getAllMenuItems(menu)[0].id;
    const response = sanitizeConciergeResponse({
      menu,
      visibleItemIds: [itemId],
      response: {
        answer: "Try one dish.",
        recommendedItemIds: [itemId, "unknown-item"],
        safetyNotes: [],
        followUpPrompts: [],
      },
    });

    expect(response.recommendedItemIds).toEqual([itemId]);
  });

  it("keeps recommendation reasons only for valid recommended items", () => {
    const itemId = getAllMenuItems(menu)[0].id;
    const response = sanitizeConciergeResponse({
      menu,
      visibleItemIds: [itemId],
      response: {
        answer: "Try one dish.",
        recommendedItemIds: [itemId, "unknown-item"],
        recommendationReasons: [
          { itemId, reason: "Matches your preferences." },
          { itemId: "unknown-item", reason: "Should be removed." },
        ],
        safetyNotes: [],
        followUpPrompts: [],
      },
    });

    expect(response.recommendationReasons).toEqual([
      { itemId, reason: "Matches your preferences." },
    ]);
  });

  it("can resolve focus items only from the current menu", () => {
    const itemId = getAllMenuItems(menu)[0].id;
    expect(findConciergeMenuItem(menu, itemId)?.id).toBe(itemId);
    expect(findConciergeMenuItem(menu, "not-on-this-menu")).toBeNull();
  });

  it("fallback concierge prioritizes a focused dish", () => {
    const itemId = getAllMenuItems(menu)[4].id;
    const response = buildFallbackConciergeResponse({
      menu,
      locale: "en",
      question: "Explain this dish and whether I should order it.",
      visibleItemIds: [],
      focusItemId: itemId,
    });

    expect(response.recommendedItemIds[0]).toBe(itemId);
    expect(response.recommendationReasons[0]?.itemId).toBe(itemId);
  });

  it("fallback concierge includes allergy staff-check language", () => {
    const response = buildFallbackConciergeResponse({
      menu,
      locale: "en",
      question: "I have a nut allergy. What should I order?",
      visibleItemIds: getAllMenuItems(menu).map((item) => item.id),
    });

    expect(response.safetyNotes.join(" ")).toContain("staff");
  });

  it("fallback concierge uses localized answer copy", () => {
    const response = buildFallbackConciergeResponse({
      menu,
      locale: "ru",
      question: "Что заказать?",
      visibleItemIds: getAllMenuItems(menu).map((item) => item.id),
    });

    expect(response.answer).toContain("Рекомендуем");
    expect(response.safetyNotes.join(" ")).toContain("персонал");
  });
});
