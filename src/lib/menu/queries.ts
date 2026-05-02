import { Prisma } from "@prisma/client";

import {
  demoAnalyticsSummary,
  demoAiChangeSets,
  demoManagerRestaurantsById,
  demoMenusBySlug,
  demoPublishedMenus,
  DEMO_DRAFT_VERSION_ID,
  DEMO_RESTAURANT_IDS,
  DEMO_USER_ID,
} from "@/lib/demo-data";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import type {
  AiChangeSetView,
  AnalyticsSummary,
  ManagerRestaurantView,
  MenuVersionView,
  RestaurantMenuView,
} from "@/types/menu";

export const menuVersionInclude = {
  categories: {
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: true,
          allergens: {
            include: {
              allergen: true,
            },
          },
          dietaryTags: {
            include: {
              tag: true,
            },
          },
          pairings: {
            orderBy: { priority: "asc" },
          },
        },
      },
    },
  },
} satisfies Prisma.MenuVersionInclude;

type MenuVersionRecord = Prisma.MenuVersionGetPayload<{
  include: typeof menuVersionInclude;
}>;

function serializeVersion(version: MenuVersionRecord): MenuVersionView {
  return {
    id: version.id,
    version: version.version,
    status: version.status,
    publishedAt: version.publishedAt?.toISOString() ?? null,
    createdAt: version.createdAt.toISOString(),
    categories: version.categories.map((category) => ({
      id: category.id,
      name: category.name,
      sortOrder: category.sortOrder,
      items: category.items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        ingredients: [],
        origin: null,
        tasteProfile: null,
        preparation: null,
        spiceLevel: 0,
        explanation: item.description,
        ctaPrompts: [],
        priceCents: item.priceCents,
        isAvailable: item.isAvailable,
        isPromoted: item.isPromoted,
        sortOrder: item.sortOrder,
        imageUrl: item.imageUrl,
        translations: item.translations.map((translation) => ({
          id: translation.id,
          locale: translation.locale,
          name: translation.name,
          description: translation.description,
        })),
        allergens: item.allergens.map((entry) => ({
          code: entry.allergen.code,
          name: entry.allergen.name,
          status: entry.status,
          verificationStatus: entry.verificationStatus,
          note: entry.note,
        })),
        dietaryTags: item.dietaryTags.map((entry) => ({
          code: entry.tag.code,
          name: entry.tag.name,
          safetySensitive: entry.tag.safetySensitive,
          verificationStatus: entry.verificationStatus,
        })),
        pairings: item.pairings.map((pairing) => ({
          id: pairing.id,
          pairedItemName: pairing.pairedItemName,
          reason: pairing.reason,
          priority: pairing.priority,
        })),
      })),
    })),
  };
}

function warningsFromJson(value: Prisma.JsonValue | null): string[] {
  return Array.isArray(value)
    ? value.filter((warning): warning is string => typeof warning === "string")
    : [];
}

export async function getPublishedMenuBySlug(
  restaurantSlug: string,
): Promise<RestaurantMenuView | null> {
  const demoMenu = demoMenusBySlug[restaurantSlug];
  if (demoMenu) {
    return demoMenu;
  }

  if (!hasDatabaseUrl()) {
    return null;
  }

  const prisma = getPrisma();
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug },
    include: {
      menus: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "asc" },
        take: 1,
        include: {
          versions: {
            where: { status: "PUBLISHED" },
            orderBy: { version: "desc" },
            take: 1,
            include: menuVersionInclude,
          },
        },
      },
    },
  });

  const menu = restaurant?.menus[0];
  const version = menu?.versions[0];

  if (!restaurant || !menu || !version) {
    return null;
  }

  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      defaultLocale: restaurant.defaultLocale,
      currency: restaurant.currency,
      brandColor: restaurant.brandColor,
      cuisine: "Restaurant",
      city: "Munich",
      heroImageUrl: null,
      theme: {
        accent: restaurant.brandColor,
        accentDark: restaurant.brandColor,
        accentSoft: "#f1f5f9",
        secondary: "#d97706",
        secondarySoft: "#fff7ed",
        ink: "#111827",
        paper: "#ffffff",
        muted: "#6b7280",
      },
      legalNotice: restaurant.legalNotice,
    },
    menu: {
      id: menu.id,
      name: menu.name,
      status: menu.status,
    },
    version: serializeVersion(version),
  };
}

export async function getMenuItemBySlug(restaurantSlug: string, itemSlug: string) {
  const menu = await getPublishedMenuBySlug(restaurantSlug);

  if (!menu) {
    return null;
  }

  const item = menu.version.categories
    .flatMap((category) => category.items)
    .find((candidate) => candidate.slug === itemSlug);

  return item ? { menu, item } : null;
}

export async function getDashboardRestaurants(userId: string) {
  if (!hasDatabaseUrl() || userId === DEMO_USER_ID) {
    return demoPublishedMenus.map((menu) => ({
      id: menu.restaurant.id,
      name: menu.restaurant.name,
      slug: menu.restaurant.slug,
      description: menu.restaurant.description,
    }));
  }

  const prisma = getPrisma();
  return prisma.restaurant.findMany({
    where: {
      organization: {
        users: {
          some: {
            userId,
          },
        },
      },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });
}

export async function getManagerRestaurant(
  restaurantId: string,
): Promise<ManagerRestaurantView | null> {
  const demoRestaurant = demoManagerRestaurantsById[restaurantId];
  if (demoRestaurant) {
    return demoRestaurant;
  }

  if (!hasDatabaseUrl()) {
    return null;
  }

  const prisma = getPrisma();
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      menus: {
        orderBy: { createdAt: "asc" },
        take: 1,
        include: {
          versions: {
            orderBy: { version: "desc" },
            include: menuVersionInclude,
          },
        },
      },
    },
  });

  const menu = restaurant?.menus[0];

  if (!restaurant || !menu) {
    return null;
  }

  const draftVersion = menu.versions.find((version) => version.status === "DRAFT");
  const publishedVersion =
    menu.versions.find((version) => version.status === "PUBLISHED") ?? null;

  const workingVersion = draftVersion ?? publishedVersion;

  if (!workingVersion) {
    return null;
  }

  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      defaultLocale: restaurant.defaultLocale,
      currency: restaurant.currency,
      brandColor: restaurant.brandColor,
      cuisine: "Restaurant",
      city: "Munich",
      heroImageUrl: null,
      theme: {
        accent: restaurant.brandColor,
        accentDark: restaurant.brandColor,
        accentSoft: "#f1f5f9",
        secondary: "#d97706",
        secondarySoft: "#fff7ed",
        ink: "#111827",
        paper: "#ffffff",
        muted: "#6b7280",
      },
      legalNotice: restaurant.legalNotice,
    },
    menu: {
      id: menu.id,
      name: menu.name,
      status: menu.status,
    },
    version: serializeVersion(workingVersion),
    draftVersion: serializeVersion(workingVersion),
    publishedVersion: publishedVersion ? serializeVersion(publishedVersion) : null,
    versions: menu.versions.map((version) => ({
      id: version.id,
      version: version.version,
      status: version.status,
      publishedAt: version.publishedAt?.toISOString() ?? null,
      createdAt: version.createdAt.toISOString(),
    })),
  };
}

export async function getAiChangeSets(
  menuVersionId: string,
): Promise<AiChangeSetView[]> {
  const demoDraftVersionIds = new Set(
    Object.values(demoManagerRestaurantsById).map(
      (restaurant) => restaurant.draftVersion.id,
    ),
  );

  if (demoDraftVersionIds.has(menuVersionId)) {
    return menuVersionId === DEMO_DRAFT_VERSION_ID ? demoAiChangeSets : [];
  }

  if (!hasDatabaseUrl()) {
    return [];
  }

  const prisma = getPrisma();
  const changeSets = await prisma.aiChangeSet.findMany({
    where: { menuVersionId },
    orderBy: { createdAt: "desc" },
    include: {
      changes: {
        orderBy: { id: "asc" },
      },
    },
  });

  return changeSets.map((changeSet) => ({
    id: changeSet.id,
    prompt: changeSet.prompt,
    status: changeSet.status,
    riskLevel: changeSet.riskLevel,
    summary: changeSet.summary,
    warnings: warningsFromJson(changeSet.warnings),
    createdAt: changeSet.createdAt.toISOString(),
    appliedAt: changeSet.appliedAt?.toISOString() ?? null,
    changes: changeSet.changes.map((change) => ({
      id: change.id,
      entityType: change.entityType,
      entityId: change.entityId,
      operation: change.operation,
      field: change.field,
      oldValue: change.oldValue,
      newValue: change.newValue,
      reason: change.reason,
    })),
  }));
}

export async function getAnalyticsSummary(
  restaurantId: string,
): Promise<AnalyticsSummary> {
  if (!hasDatabaseUrl() || DEMO_RESTAURANT_IDS.includes(restaurantId)) {
    return demoAnalyticsSummary;
  }

  const from = new Date();
  from.setDate(from.getDate() - 30);

  const prisma = getPrisma();
  const events = await prisma.analyticsEvent.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: from,
      },
    },
    include: {
      menuItem: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const byLocale = new Map<string, number>();
  const byItem = new Map<string, { itemId: string; name: string; count: number }>();
  const byFilter = new Map<string, number>();

  for (const event of events) {
    if (event.locale) {
      byLocale.set(event.locale, (byLocale.get(event.locale) ?? 0) + 1);
    }

    if (event.eventType === "ITEM_VIEWED" && event.menuItem) {
      const current = byItem.get(event.menuItem.id) ?? {
        itemId: event.menuItem.id,
        name: event.menuItem.name,
        count: 0,
      };
      byItem.set(event.menuItem.id, { ...current, count: current.count + 1 });
    }

    const metadata =
      event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
        ? event.metadata
        : null;
    const filter = metadata?.filter;
    if (event.eventType === "FILTER_USED" && typeof filter === "string") {
      byFilter.set(filter, (byFilter.get(filter) ?? 0) + 1);
    }
  }

  const count = (eventType: string) =>
    events.filter((event) => event.eventType === eventType).length;

  return {
    scans: count("MENU_VIEWED"),
    itemViews: count("ITEM_VIEWED"),
    allergenViews: count("ALLERGEN_INFO_VIEWED"),
    assistantOpens: count("ASSISTANT_OPENED"),
    promotedClicks: count("PROMOTED_ITEM_CLICKED"),
    topLanguages: [...byLocale.entries()]
      .map(([locale, localeCount]) => ({ locale, count: localeCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    topItems: [...byItem.values()].sort((a, b) => b.count - a.count).slice(0, 10),
    topFilters: [...byFilter.entries()]
      .map(([filter, filterCount]) => ({ filter, count: filterCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}
