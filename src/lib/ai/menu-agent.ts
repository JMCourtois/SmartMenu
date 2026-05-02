import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { AiMenuChangeSchema, type AiMenuChange } from "@/lib/ai/schemas";

let openaiClient: OpenAI | null = null;

function getOpenAiClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  openaiClient ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openaiClient;
}

type RunMenuAgentInput = {
  managerPrompt: string;
  menuSnapshot: unknown;
};

const systemPrompt = `
You are SmartMenu's restaurant menu editing assistant.

Return only structured proposed changes. You do not publish menus and you do not
write to the database. The application will validate and apply only whitelisted
changes after manager approval.

Allowed low/medium proposal shapes:
- TRANSLATION: entityId is the menu item id, field is the locale like "en",
  newValue is { "name": string, "description": string | null }.
- MENU_ITEM description: entityId is menu item id, field is "description",
  newValue is the replacement description string.
- AVAILABILITY: entityId is menu item id, field is "isAvailable",
  newValue is boolean.
- PAIRING: entityId is menu item id, operation is CREATE,
  newValue is { "pairedItemName": string, "reason": string | null, "priority": number }.
- PROMOTION: entityId is menu item id, field is "isPromoted", newValue is boolean.

Safety rules:
- Never invent allergen data.
- Never mark an item safe for allergies.
- Never claim gluten-free, vegan, lactose-free, or no-pork unless the current
  menu data already verifies it.
- Price, allergen, dietary safety, deletion, and publish changes must be HIGH
  or BLOCKED risk and must remain proposals only.
- If data is missing, add a warning instead of guessing.
`;

function fallbackProposal(input: RunMenuAgentInput): AiMenuChange {
  return {
    summary:
      "Demo proposal generated without calling OpenAI. Configure OPENAI_API_KEY for live structured proposals.",
    riskLevel: "MEDIUM",
    warnings: ["OpenAI is not configured, so this is a deterministic local demo."],
    changes: [
      {
        entityType: "TRANSLATION",
        entityId: "item-schweinshaxe",
        operation: "UPDATE",
        field: "en",
        oldValue: null,
        newValue: {
          name: "Crispy pork knuckle",
          description:
            "A Bavarian beer-hall classic with crackling skin, potato dumpling, and dark beer gravy.",
        },
        reason: `Local demo response for: ${input.managerPrompt}`,
      },
    ],
  };
}

export async function runMenuAgent(input: RunMenuAgentInput): Promise<AiMenuChange> {
  const client = getOpenAiClient();

  if (!client) {
    return fallbackProposal(input);
  }

  const response = await client.responses.parse({
    model: "gpt-5.5",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify({
          instruction: input.managerPrompt,
          currentMenu: input.menuSnapshot,
        }),
      },
    ],
    text: {
      format: zodTextFormat(AiMenuChangeSchema, "smart_menu_ai_change_set"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI returned no parsed structured menu proposal.");
  }

  return AiMenuChangeSchema.parse(response.output_parsed);
}
