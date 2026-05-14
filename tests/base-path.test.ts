import { describe, expect, it, vi } from "vitest";

import { normalizeBasePath, withBasePath } from "@/lib/base-path";

describe("base path helpers", () => {
  it("normalizes deploy base path values", () => {
    expect(normalizeBasePath(undefined)).toBe("");
    expect(normalizeBasePath("")).toBe("");
    expect(normalizeBasePath("/")).toBe("");
    expect(normalizeBasePath("smartmenu/")).toBe("/smartmenu");
    expect(normalizeBasePath("/smartmenu/")).toBe("/smartmenu");
  });

  it("prefixes local API and public asset paths under the configured base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/smartmenu");

    expect(withBasePath("/api/ai/concierge")).toBe("/smartmenu/api/ai/concierge");
    expect(withBasePath("/demo-dishes/demo/item.webp")).toBe(
      "/smartmenu/demo-dishes/demo/item.webp",
    );
    expect(withBasePath("dashboard")).toBe("/smartmenu/dashboard");
    expect(withBasePath("/smartmenu/api/track-event")).toBe(
      "/smartmenu/api/track-event",
    );
    expect(withBasePath("https://images.example/dish.webp")).toBe(
      "https://images.example/dish.webp",
    );
    expect(withBasePath("#menu")).toBe("#menu");

    vi.unstubAllEnvs();
  });
});
