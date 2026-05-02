import { describe, expect, it } from "vitest";

import { sanitizeEventMetadata, TrackEventSchema } from "@/lib/analytics/schemas";

describe("analytics validation", () => {
  it("accepts minimal first-party events", () => {
    expect(
      TrackEventSchema.parse({
        restaurantId: "restaurant_1",
        eventType: "MENU_VIEWED",
      }).eventType,
    ).toBe("MENU_VIEWED");
  });

  it("drops unapproved metadata keys", () => {
    expect(
      sanitizeEventMetadata("FILTER_USED", {
        filter: "vegetarian",
        userAgent: "should-not-store",
      }),
    ).toEqual({ filter: "vegetarian" });
  });

  it("allows only compact concierge metadata", () => {
    expect(
      sanitizeEventMetadata("CONCIERGE_MESSAGE_SENT", {
        messageKind: "guest_question",
        visibleItemIds: ["item_1"],
        rawMessage: "do not store",
      }),
    ).toEqual({
      messageKind: "guest_question",
      visibleItemIds: ["item_1"],
    });
  });
});
