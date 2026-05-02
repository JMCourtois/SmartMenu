import { z } from "zod";

export const AiProposedChangeSchema = z.object({
  entityType: z.enum([
    "MENU_ITEM",
    "MENU_CATEGORY",
    "TRANSLATION",
    "PAIRING",
    "PROMOTION",
    "AVAILABILITY",
    "ALLERGEN",
    "DIETARY_TAG",
    "PUBLISH",
  ]),
  entityId: z.string().nullable(),
  operation: z.enum(["CREATE", "UPDATE", "DELETE"]),
  field: z.string().nullable(),
  oldValue: z.unknown().nullable(),
  newValue: z.unknown().nullable(),
  reason: z.string(),
});

export const AiMenuChangeSchema = z.object({
  summary: z.string(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "BLOCKED"]),
  changes: z.array(AiProposedChangeSchema),
  warnings: z.array(z.string()).default([]),
});

export type AiMenuChange = z.infer<typeof AiMenuChangeSchema>;
export type AiProposedChange = z.infer<typeof AiProposedChangeSchema>;
