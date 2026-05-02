import { Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { menuVersionInclude } from "@/lib/menu/queries";

async function nextVersionNumber(tx: Prisma.TransactionClient, menuId: string) {
  const result = await tx.menuVersion.aggregate({
    where: { menuId },
    _max: { version: true },
  });

  return (result._max.version ?? 0) + 1;
}

async function createDraftFromSource({
  tx,
  menuId,
  sourceVersionId,
  createdById,
}: {
  tx: Prisma.TransactionClient;
  menuId: string;
  sourceVersionId?: string;
  createdById?: string;
}) {
  const version = await nextVersionNumber(tx, menuId);
  const source = sourceVersionId
    ? await tx.menuVersion.findUnique({
        where: { id: sourceVersionId },
        include: menuVersionInclude,
      })
    : null;

  const draft = await tx.menuVersion.create({
    data: {
      menuId,
      version,
      status: "DRAFT",
      createdById,
    },
  });

  if (!source) {
    return draft;
  }

  for (const category of source.categories) {
    const newCategory = await tx.menuCategory.create({
      data: {
        menuVersionId: draft.id,
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });

    for (const item of category.items) {
      await tx.menuItem.create({
        data: {
          categoryId: newCategory.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          priceCents: item.priceCents,
          isAvailable: item.isAvailable,
          isPromoted: item.isPromoted,
          sortOrder: item.sortOrder,
          imageUrl: item.imageUrl,
          translations: {
            create: item.translations.map((translation) => ({
              locale: translation.locale,
              name: translation.name,
              description: translation.description,
            })),
          },
          allergens: {
            create: item.allergens.map((entry) => ({
              allergenId: entry.allergenId,
              status: entry.status,
              verificationStatus: entry.verificationStatus,
              verifiedById: entry.verifiedById,
              verifiedAt: entry.verifiedAt,
              note: entry.note,
            })),
          },
          dietaryTags: {
            create: item.dietaryTags.map((entry) => ({
              tagId: entry.tagId,
              verificationStatus: entry.verificationStatus,
              verifiedById: entry.verifiedById,
              verifiedAt: entry.verifiedAt,
              note: entry.note,
            })),
          },
          pairings: {
            create: item.pairings.map((pairing) => ({
              pairedItemName: pairing.pairedItemName,
              reason: pairing.reason,
              priority: pairing.priority,
            })),
          },
        },
      });
    }
  }

  return draft;
}

export async function getOrCreateDraftMenuVersion(
  menuId: string,
  createdById?: string,
) {
  const prisma = getPrisma();

  const existingDraft = await prisma.menuVersion.findFirst({
    where: { menuId, status: "DRAFT" },
    orderBy: { version: "desc" },
  });

  if (existingDraft) {
    return existingDraft;
  }

  return prisma.$transaction(async (tx) => {
    const source = await tx.menuVersion.findFirst({
      where: {
        menuId,
        status: "PUBLISHED",
      },
      orderBy: { version: "desc" },
    });

    return createDraftFromSource({
      tx,
      menuId,
      sourceVersionId: source?.id,
      createdById,
    });
  });
}

export async function publishDraftVersion({
  menuVersionId,
  actorUserId,
}: {
  menuVersionId: string;
  actorUserId: string;
}) {
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const draft = await tx.menuVersion.findUnique({
      where: { id: menuVersionId },
      include: { menu: true },
    });

    if (!draft) {
      throw new Error("Draft menu version not found.");
    }

    if (draft.status !== "DRAFT") {
      throw new Error("Only draft menu versions can be published.");
    }

    await tx.menuVersion.updateMany({
      where: {
        menuId: draft.menuId,
        status: "PUBLISHED",
      },
      data: {
        status: "ARCHIVED",
      },
    });

    const published = await tx.menuVersion.update({
      where: { id: draft.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    await tx.menu.update({
      where: { id: draft.menuId },
      data: { status: "ACTIVE" },
    });

    await createDraftFromSource({
      tx,
      menuId: draft.menuId,
      sourceVersionId: published.id,
      createdById: actorUserId,
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "PUBLISH_MENU_VERSION",
        entityType: "MenuVersion",
        entityId: published.id,
        metadata: {
          menuId: draft.menuId,
          version: published.version,
        },
      },
    });

    return published;
  });
}

export async function restoreVersionAsDraft({
  menuVersionId,
  actorUserId,
}: {
  menuVersionId: string;
  actorUserId: string;
}) {
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const source = await tx.menuVersion.findUnique({
      where: { id: menuVersionId },
    });

    if (!source) {
      throw new Error("Menu version not found.");
    }

    await tx.menuVersion.updateMany({
      where: {
        menuId: source.menuId,
        status: "DRAFT",
      },
      data: {
        status: "ARCHIVED",
      },
    });

    const draft = await createDraftFromSource({
      tx,
      menuId: source.menuId,
      sourceVersionId: source.id,
      createdById: actorUserId,
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "ROLLBACK_MENU_VERSION",
        entityType: "MenuVersion",
        entityId: source.id,
        metadata: {
          restoredAsVersionId: draft.id,
          restoredAsVersion: draft.version,
        },
      },
    });

    return draft;
  });
}
