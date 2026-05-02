import { z } from "zod";

export const GuestPreferenceSchema = z.object({
  language: z.string().max(12).optional(),
  displayMode: z.enum(["photo", "classic"]).optional(),
  dietaryPreferences: z.array(z.string().max(40)).default([]),
  avoidedIngredients: z.array(z.string().max(60)).default([]),
  spiceTolerance: z.enum(["mild", "medium", "hot"]).default("medium"),
  budget: z.enum(["any", "under-15", "under-20", "splurge"]).default("any"),
});

export type GuestPreferenceSnapshot = z.infer<typeof GuestPreferenceSchema>;

export const defaultGuestPreferences: GuestPreferenceSnapshot = {
  dietaryPreferences: [],
  avoidedIngredients: [],
  spiceTolerance: "medium",
  budget: "any",
};

export function preferenceStorageKey(restaurantSlug: string) {
  return `smartmenu.preferences.${restaurantSlug}`;
}

export function readGuestPreferences(
  storage: Pick<Storage, "getItem">,
  restaurantSlug: string,
): GuestPreferenceSnapshot {
  const raw = storage.getItem(preferenceStorageKey(restaurantSlug));

  if (!raw) {
    return defaultGuestPreferences;
  }

  try {
    return {
      ...defaultGuestPreferences,
      ...GuestPreferenceSchema.parse(JSON.parse(raw)),
    };
  } catch {
    return defaultGuestPreferences;
  }
}

export function writeGuestPreferences(
  storage: Pick<Storage, "setItem">,
  restaurantSlug: string,
  preferences: GuestPreferenceSnapshot,
) {
  storage.setItem(
    preferenceStorageKey(restaurantSlug),
    JSON.stringify(GuestPreferenceSchema.parse(preferences)),
  );
}

export function buildPreferenceSummary(preferences: GuestPreferenceSnapshot) {
  const summary = [...preferences.dietaryPreferences];

  if (preferences.spiceTolerance !== "medium") {
    summary.push(`${preferences.spiceTolerance} spice`);
  }

  if (preferences.budget !== "any") {
    summary.push(preferences.budget === "splurge" ? "open to splurge" : preferences.budget);
  }

  for (const ingredient of preferences.avoidedIngredients) {
    summary.push(`avoid ${ingredient}`);
  }

  return summary;
}
