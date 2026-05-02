import { describe, expect, it } from "vitest";

import {
  ALLOWED_MENU_ITEM_IMAGE_TYPES,
  isAllowedMenuItemImageType,
  MAX_MENU_ITEM_IMAGE_SIZE,
  menuItemBlobPath,
  menuItemImageExtension,
  sanitizeMenuItemImageFileName,
} from "@/lib/menu/images";
import { validateDemoMenuImageFile } from "@/lib/demo-image-overrides";

describe("menu item image upload helpers", () => {
  it("allows only browser-safe restaurant image formats", () => {
    expect(ALLOWED_MENU_ITEM_IMAGE_TYPES).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]);
    expect(isAllowedMenuItemImageType("image/webp")).toBe(true);
    expect(isAllowedMenuItemImageType("text/plain")).toBe(false);
    expect(MAX_MENU_ITEM_IMAGE_SIZE).toBe(8 * 1024 * 1024);
  });

  it("maps accepted mime types to stable file extensions", () => {
    expect(menuItemImageExtension("image/jpeg")).toBe("jpg");
    expect(menuItemImageExtension("image/png")).toBe("png");
    expect(menuItemImageExtension("image/webp")).toBe("webp");
    expect(menuItemImageExtension("image/avif")).toBe("avif");
  });

  it("sanitizes unsafe uploaded file names", () => {
    expect(
      sanitizeMenuItemImageFileName("../Schweinshaxe final 01.webp", "image/webp"),
    ).toBe("schweinshaxe-final-01.webp");
    expect(sanitizeMenuItemImageFileName("Käse Spätzle", "image/jpeg")).toBe(
      "kase-spatzle.jpg",
    );
  });

  it("builds scoped Vercel Blob paths for draft item photos", () => {
    expect(
      menuItemBlobPath({
        restaurantId: "rst_123",
        menuItemId: "itm_456",
        fileName: "dish.webp",
        now: 42,
      }),
    ).toBe("restaurants/rst_123/menu-items/itm_456/42-dish.webp");
  });

  it("validates browser-local demo uploads before saving", () => {
    const validFile = new File(["image"], "dish.webp", { type: "image/webp" });
    const invalidFile = new File(["text"], "dish.txt", { type: "text/plain" });
    const oversizedFile = new File([new Uint8Array(MAX_MENU_ITEM_IMAGE_SIZE + 1)], "big.jpg", {
      type: "image/jpeg",
    });

    expect(validateDemoMenuImageFile(validFile)).toBeNull();
    expect(validateDemoMenuImageFile(invalidFile)).toContain("JPEG");
    expect(validateDemoMenuImageFile(oversizedFile)).toContain("8MB");
  });
});
