import { describe, expect, it } from "vitest";

import { demoPublishedMenus } from "@/lib/demo-data";
import { slugify } from "@/lib/menu/slug";
import { getManagerRestaurant } from "@/lib/menu/queries";
import { MenuItemFormSchema } from "@/lib/menu/validation";

describe("menu helpers", () => {
  it("creates URL-safe slugs from Bavarian dish names", () => {
    expect(slugify("Käsespätzle & Obatzda")).toBe("kasespatzle-obatzda");
  });

  it("rejects negative prices", () => {
    expect(() =>
      MenuItemFormSchema.parse({
        categoryId: "cat",
        name: "Soup",
        priceCents: -1,
      }),
    ).toThrow();
  });

  it("serves manager demo data for every demo restaurant id", async () => {
    for (const menu of demoPublishedMenus) {
      const managerRestaurant = await getManagerRestaurant(menu.restaurant.id);
      expect(managerRestaurant?.restaurant.slug).toBe(menu.restaurant.slug);
      expect(managerRestaurant?.draftVersion.status).toBe("DRAFT");
    }
  });
});
