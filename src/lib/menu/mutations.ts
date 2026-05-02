import { Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { slugify } from "@/lib/menu/slug";
import {
  MenuCategoryFormSchema,
  MenuItemFormSchema,
  TranslationFormSchema,
} from "@/lib/menu/validation";

async function uniqueItemSlug(
  tx: Prisma.TransactionClient,
  categoryId: string,
  name: string,
) {
  const baseSlug = slugify(name) || "item";
  let slug = baseSlug;
  let counter = 2;

  while (
    await tx.menuItem.findUnique({
      where: {
        categoryId_slug: {
          categoryId,
          slug,
        },
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function createMenuCategory({
  formData,
  actorUserId,
}: {
  formData: FormData;
  actorUserId: string;
}) {
  const data = MenuCategoryFormSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const result = await tx.menuCategory.aggregate({
      where: { menuVersionId: data.menuVersionId },
      _max: { sortOrder: true },
    });

    const category = await tx.menuCategory.create({
      data: {
        menuVersionId: data.menuVersionId,
        name: data.name,
        sortOrder: (result._max.sortOrder ?? 0) + 1,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "CREATE_MENU_CATEGORY",
        entityType: "MenuCategory",
        entityId: category.id,
        metadata: {
          menuVersionId: data.menuVersionId,
          name: data.name,
        },
      },
    });

    return category;
  });
}

export async function createMenuItem({
  formData,
  actorUserId,
}: {
  formData: FormData;
  actorUserId: string;
}) {
  const parsed = MenuItemFormSchema.parse({
    ...Object.fromEntries(formData),
    isAvailable: formData.get("isAvailable") === "on",
    isPromoted: formData.get("isPromoted") === "on",
  });
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const result = await tx.menuItem.aggregate({
      where: { categoryId: parsed.categoryId },
      _max: { sortOrder: true },
    });

    const item = await tx.menuItem.create({
      data: {
        categoryId: parsed.categoryId,
        name: parsed.name,
        slug: await uniqueItemSlug(tx, parsed.categoryId, parsed.name),
        description: parsed.description || null,
        priceCents: parsed.priceCents,
        imageUrl: parsed.imageUrl || null,
        isAvailable: parsed.isAvailable,
        isPromoted: parsed.isPromoted,
        sortOrder: (result._max.sortOrder ?? 0) + 1,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "CREATE_MENU_ITEM",
        entityType: "MenuItem",
        entityId: item.id,
        metadata: {
          categoryId: parsed.categoryId,
          priceCents: parsed.priceCents,
        },
      },
    });

    return item;
  });
}

export async function upsertMenuItemTranslation({
  formData,
  actorUserId,
}: {
  formData: FormData;
  actorUserId: string;
}) {
  const parsed = TranslationFormSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const translation = await tx.menuItemTranslation.upsert({
      where: {
        menuItemId_locale: {
          menuItemId: parsed.menuItemId,
          locale: parsed.locale,
        },
      },
      update: {
        name: parsed.name,
        description: parsed.description || null,
      },
      create: {
        menuItemId: parsed.menuItemId,
        locale: parsed.locale,
        name: parsed.name,
        description: parsed.description || null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "UPSERT_MENU_ITEM_TRANSLATION",
        entityType: "MenuItemTranslation",
        entityId: translation.id,
        metadata: {
          menuItemId: parsed.menuItemId,
          locale: parsed.locale,
        },
      },
    });

    return translation;
  });
}
