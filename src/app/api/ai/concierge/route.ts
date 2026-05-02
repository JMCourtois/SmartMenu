import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  buildConciergeMenuContext,
  buildFocusedItemContext,
  buildFallbackConciergeResponse,
  ConciergeRequestSchema,
  findConciergeMenuItem,
  parseConciergeModelContent,
  sanitizeConciergeResponse,
} from "@/lib/ai/concierge";
import { getPublishedMenuBySlug } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

let minimaxClient: OpenAI | null = null;

function getMiniMaxClient() {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    return null;
  }

  minimaxClient ??= new OpenAI({
    apiKey,
    baseURL: process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/v1",
    maxRetries: 0,
    timeout: 8000,
  });

  return minimaxClient;
}

const systemPrompt = `
You are SmartMenu's guest-facing AI menu concierge.

Return exactly one JSON object with:
{
  "answer": string,
  "recommendedItemIds": string[],
  "safetyNotes": string[],
  "followUpPrompts": string[],
  "recommendationReasons": [{"itemId": string, "reason": string}]
}

Rules:
- Recommend only item IDs that exist in the supplied menu context.
- Explain unfamiliar dishes using the supplied origin, taste, preparation, and ingredients.
- Do not invent ingredients, allergens, prices, availability, or dietary claims.
- Never say a dish is safe for severe allergies.
- If the user mentions allergies, gluten, lactose, pork, shellfish, nuts, sesame, soy, vegan, or vegetarian safety, include a staff-check safety note.
- If focusItem is provided, answer about that dish first using its explanation, ingredients, origin, taste, preparation, allergens, dietary tags, spice level, and pairings.
- If focusItem is provided, include it in recommendedItemIds unless it is unavailable or clearly conflicts with the user's preferences.
- recommendationReasons must explain why each recommended item fits in one short sentence.
- Reply in chatLocale, the language of the guest's current question. Use English only when chatLocale is missing or unsupported.
- Keep the answer concise, practical, and friendly.
- Do not include markdown fences.
`;

export async function POST(request: Request) {
  try {
    const data = ConciergeRequestSchema.parse(await request.json());
    const menu = await getPublishedMenuBySlug(data.restaurantSlug);

    if (!menu) {
      return NextResponse.json({ ok: false, error: "Restaurant not found" }, { status: 404 });
    }

    const focusItem = findConciergeMenuItem(menu, data.focusItemId);
    if (data.focusItemId && !focusItem) {
      return NextResponse.json(
        { ok: false, error: "Focused menu item not found for this restaurant" },
        { status: 400 },
      );
    }

    const chatLocale = data.chatLocale ?? data.locale;
    const client = getMiniMaxClient();
    const fallbackResult = buildFallbackConciergeResponse({
      menu,
      locale: chatLocale,
      question: data.question,
      visibleItemIds: data.visibleItemIds,
      preferences: data.preferences,
      focusItemId: data.focusItemId,
    });

    if (!client) {
      return NextResponse.json({
        ok: true,
        mode: "fallback",
        result: fallbackResult,
      });
    }

    try {
      const response = await client.chat.completions.create({
        model: process.env.MINIMAX_MODEL ?? "MiniMax-M2.7",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...data.conversation.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          {
            role: "user",
            content: JSON.stringify({
              question: data.question,
              menuLocale: data.locale,
              chatLocale,
              preferences: data.preferences,
              visibleItemIds: data.visibleItemIds,
              menu: buildConciergeMenuContext(menu, chatLocale),
              focusItem: buildFocusedItemContext(menu, chatLocale, data.focusItemId),
            }),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_completion_tokens: 1200,
      });

      const content = response.choices[0]?.message.content;

      if (!content) {
        throw new Error("MiniMax returned an empty concierge response.");
      }

      const parsed = parseConciergeModelContent(content);
      const result = sanitizeConciergeResponse({
        response: parsed,
        menu,
        visibleItemIds: data.visibleItemIds,
        focusItemId: data.focusItemId,
      });

      return NextResponse.json({ ok: true, mode: "minimax", result });
    } catch {
      return NextResponse.json({
        ok: true,
        mode: "fallback-after-minimax-error",
        result: fallbackResult,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Concierge request failed",
      },
      { status: 400 },
    );
  }
}
