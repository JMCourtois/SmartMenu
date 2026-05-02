import { z } from "zod";

export const AnalyticsEventTypeSchema = z.enum([
  "MENU_VIEWED",
  "LANGUAGE_SELECTED",
  "FILTER_USED",
  "ITEM_VIEWED",
  "ASSISTANT_OPENED",
  "QUESTION_ASKED",
  "RECOMMENDATION_SHOWN",
  "PROMOTED_ITEM_CLICKED",
  "ALLERGEN_INFO_VIEWED",
  "CONCIERGE_MESSAGE_SENT",
  "CONCIERGE_RECOMMENDATION_CLICKED",
]);

const metadataByEvent = {
  MENU_VIEWED: ["path"],
  LANGUAGE_SELECTED: ["fromLocale", "toLocale"],
  FILTER_USED: ["filter"],
  ITEM_VIEWED: ["itemSlug"],
  ASSISTANT_OPENED: ["entryPoint"],
  QUESTION_ASKED: ["intent"],
  RECOMMENDATION_SHOWN: ["intent", "itemIds"],
  PROMOTED_ITEM_CLICKED: ["itemSlug"],
  ALLERGEN_INFO_VIEWED: ["itemSlug"],
  CONCIERGE_MESSAGE_SENT: ["messageKind", "visibleItemIds"],
  CONCIERGE_RECOMMENDATION_CLICKED: ["itemSlug"],
} satisfies Record<z.infer<typeof AnalyticsEventTypeSchema>, string[]>;

export const TrackEventSchema = z.object({
  restaurantId: z.string().min(1),
  eventType: AnalyticsEventTypeSchema,
  locale: z.string().max(12).optional(),
  source: z.string().max(80).optional(),
  tableCode: z.string().max(80).optional(),
  menuItemId: z.string().optional(),
  sessionIdHash: z.string().max(128).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export function sanitizeEventMetadata(
  eventType: z.infer<typeof AnalyticsEventTypeSchema>,
  metadata: Record<string, unknown> | undefined,
) {
  const allowedKeys = metadataByEvent[eventType];

  if (!metadata) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => allowedKeys.includes(key)),
  );
}
