import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/menu/slug";
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
});
