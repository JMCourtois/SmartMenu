import type { OrgRole } from "@prisma/client";

export type RestaurantAction =
  | "restaurant:read"
  | "menu:read"
  | "menu:write"
  | "menu:publish"
  | "ai:write"
  | "analytics:read"
  | "settings:write";

const rolePermissions: Record<OrgRole, RestaurantAction[]> = {
  OWNER: [
    "restaurant:read",
    "menu:read",
    "menu:write",
    "menu:publish",
    "ai:write",
    "analytics:read",
    "settings:write",
  ],
  MANAGER: [
    "restaurant:read",
    "menu:read",
    "menu:write",
    "menu:publish",
    "ai:write",
    "analytics:read",
    "settings:write",
  ],
  STAFF: ["restaurant:read", "menu:read", "menu:write"],
  VIEWER: ["restaurant:read", "menu:read", "analytics:read"],
};

export function can(role: OrgRole, action: RestaurantAction) {
  return rolePermissions[role].includes(action);
}
