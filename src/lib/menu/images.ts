export const MAX_MENU_ITEM_IMAGE_SIZE = 8 * 1024 * 1024;

export const ALLOWED_MENU_ITEM_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedMenuItemImageType =
  (typeof ALLOWED_MENU_ITEM_IMAGE_TYPES)[number];

const extensionByMimeType: Record<AllowedMenuItemImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function isAllowedMenuItemImageType(
  mimeType: string,
): mimeType is AllowedMenuItemImageType {
  return ALLOWED_MENU_ITEM_IMAGE_TYPES.includes(
    mimeType as AllowedMenuItemImageType,
  );
}

export function menuItemImageExtension(mimeType: AllowedMenuItemImageType) {
  return extensionByMimeType[mimeType];
}

export function sanitizeMenuItemImageFileName(fileName: string, mimeType: string) {
  const fallbackExtension = isAllowedMenuItemImageType(mimeType)
    ? menuItemImageExtension(mimeType)
    : "jpg";
  const trimmed = fileName.trim() || `menu-item.${fallbackExtension}`;
  const withoutPath = trimmed.split(/[\\/]/).pop() ?? trimmed;
  const safe = withoutPath
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .toLowerCase();

  if (!safe) {
    return `menu-item.${fallbackExtension}`;
  }

  return /\.[a-z0-9]{2,5}$/i.test(safe)
    ? safe
    : `${safe}.${fallbackExtension}`;
}

export function menuItemBlobPath({
  restaurantId,
  menuItemId,
  fileName,
  now = Date.now(),
}: {
  restaurantId: string;
  menuItemId: string;
  fileName: string;
  now?: number;
}) {
  return `restaurants/${restaurantId}/menu-items/${menuItemId}/${now}-${fileName}`;
}
