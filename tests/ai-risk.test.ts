import { describe, expect, it } from "vitest";

import { isAutoApplySupported, recomputeAiRisk } from "@/lib/ai/risk";
import type { AiProposedChange } from "@/lib/ai/schemas";

const baseChange: AiProposedChange = {
  entityType: "TRANSLATION",
  entityId: "item_1",
  operation: "UPDATE",
  field: "en",
  oldValue: null,
  newValue: { name: "Name", description: "Description" },
  reason: "Test",
};

describe("AI risk classification", () => {
  it("keeps translation changes medium and auto-applicable", () => {
    expect(recomputeAiRisk([baseChange])).toBe("MEDIUM");
    expect(isAutoApplySupported(baseChange)).toBe(true);
  });

  it("marks price changes high risk and blocks auto-apply", () => {
    const change: AiProposedChange = {
      ...baseChange,
      entityType: "MENU_ITEM",
      field: "priceCents",
      newValue: 2200,
    };

    expect(recomputeAiRisk([change])).toBe("HIGH");
    expect(isAutoApplySupported(change)).toBe(false);
  });

  it("blocks publish instructions entirely", () => {
    const change: AiProposedChange = {
      ...baseChange,
      entityType: "PUBLISH",
      operation: "UPDATE",
      field: null,
    };

    expect(recomputeAiRisk([change])).toBe("BLOCKED");
    expect(isAutoApplySupported(change)).toBe(false);
  });
});
