import { AllergenStatus, PrismaClient, VerificationStatus } from "@prisma/client";

import { slugify } from "../src/lib/menu/slug";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@smartmenu.local" },
    update: {},
    create: {
      email: "demo@smartmenu.local",
      name: "Demo Manager",
    },
  });

  const organization = await prisma.organization.create({
    data: {
      name: "Demo Restaurant Group",
      users: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      organizationId: organization.id,
      name: "Demo Bavarian Wirtshaus",
      slug: "demo-bavarian-wirtshaus",
      description: "Traditional Bavarian food explained clearly for international guests.",
      legalNotice: "Please ask staff about severe allergies. Recipes may change by batch.",
      locations: {
        create: {
          name: "Munich Altstadt",
          city: "Munich",
          country: "DE",
        },
      },
    },
  });

  const allergens = await Promise.all(
    [
      ["gluten", "Gluten"],
      ["milk", "Milk"],
      ["egg", "Egg"],
      ["fish", "Fish"],
    ].map(([code, name]) =>
      prisma.allergen.upsert({
        where: { code },
        update: { name },
        create: { code, name },
      }),
    ),
  );

  const tags = await Promise.all(
    [
      ["traditional", "Traditional", false],
      ["vegetarian", "Vegetarian", true],
      ["no-pork", "No pork", true],
      ["pork", "Contains pork", true],
      ["light", "Light", false],
      ["best-with-beer", "Best with beer", false],
    ].map(([code, name, safetySensitive]) =>
      prisma.dietaryTag.upsert({
        where: { code: String(code) },
        update: { name: String(name), safetySensitive: Boolean(safetySensitive) },
        create: {
          code: String(code),
          name: String(name),
          safetySensitive: Boolean(safetySensitive),
        },
      }),
    ),
  );

  const allergenByCode = new Map(allergens.map((entry) => [entry.code, entry]));
  const tagByCode = new Map(tags.map((entry) => [entry.code, entry]));

  const menu = await prisma.menu.create({
    data: {
      restaurantId: restaurant.id,
      name: "Main Menu",
      status: "ACTIVE",
    },
  });

  const version = await prisma.menuVersion.create({
    data: {
      menuId: menu.id,
      version: 1,
      status: "PUBLISHED",
      publishedAt: new Date(),
      createdById: user.id,
    },
  });

  const category = await prisma.menuCategory.create({
    data: {
      menuVersionId: version.id,
      name: "Bavarian Classics",
      sortOrder: 1,
    },
  });

  const dishes = [
    {
      name: "Schweinshaxe",
      description: "Crispy roasted pork knuckle with potato dumpling and dark beer gravy.",
      priceCents: 2450,
      tags: ["traditional", "pork"],
      allergens: [["gluten", "MAY_CONTAIN" as const, "NEEDS_REVIEW" as const]],
      pairing: "Munich Helles",
      promoted: true,
    },
    {
      name: "Käsespätzle",
      description: "Bavarian egg noodles with mountain cheese, onions, and chives.",
      priceCents: 1690,
      tags: ["traditional", "vegetarian"],
      allergens: [
        ["gluten", "CONTAINS" as const, "VERIFIED" as const],
        ["milk", "CONTAINS" as const, "VERIFIED" as const],
        ["egg", "CONTAINS" as const, "VERIFIED" as const],
      ],
      pairing: "Dry Riesling",
      promoted: false,
    },
    {
      name: "Obatzda",
      description: "Creamy Bavarian cheese spread with pretzel and radishes.",
      priceCents: 1090,
      tags: ["vegetarian", "best-with-beer"],
      allergens: [
        ["milk", "CONTAINS" as const, "VERIFIED" as const],
        ["gluten", "CONTAINS" as const, "VERIFIED" as const],
      ],
      pairing: "Weissbier",
      promoted: false,
    },
  ];

  for (const [index, dish] of dishes.entries()) {
    const item = await prisma.menuItem.create({
      data: {
        categoryId: category.id,
        name: dish.name,
        slug: slugify(dish.name),
        description: dish.description,
        priceCents: dish.priceCents,
        isPromoted: dish.promoted,
        sortOrder: index + 1,
        translations: {
          create: {
            locale: "en",
            name: dish.name,
            description: dish.description,
          },
        },
        pairings: {
          create: {
            pairedItemName: dish.pairing,
            reason: "Suggested by the house.",
            priority: 1,
          },
        },
      },
    });

    await prisma.menuItemDietaryTag.createMany({
      data: dish.tags.map((tagCode) => ({
        menuItemId: item.id,
        tagId: tagByCode.get(tagCode)!.id,
        verificationStatus: "VERIFIED",
        verifiedById: user.id,
        verifiedAt: new Date(),
      })),
    });

    await prisma.menuItemAllergen.createMany({
      data: dish.allergens.map(([code, status, verificationStatus]) => ({
        menuItemId: item.id,
        allergenId: allergenByCode.get(code)!.id,
        status: status as AllergenStatus,
        verificationStatus: verificationStatus as VerificationStatus,
        verifiedById: verificationStatus === "VERIFIED" ? user.id : null,
        verifiedAt: verificationStatus === "VERIFIED" ? new Date() : null,
      })),
    });
  }

  console.log(`Demo restaurant created: /r/${restaurant.slug}`);
  console.log(`Manager route: /dashboard/restaurants/${restaurant.id}/menu`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
