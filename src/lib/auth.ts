import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DEMO_RESTAURANT_IDS, DEMO_USER_ID } from "@/lib/demo-data";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { can, type RestaurantAction } from "@/lib/permissions";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  isDemo: boolean;
};

function hasClerkKeys() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );
}

export async function requireUser(): Promise<AppUser> {
  if (!hasClerkKeys() || !hasDatabaseUrl()) {
    return {
      id: DEMO_USER_ID,
      email: "demo@smartmenu.local",
      name: "Demo Manager",
      isDemo: true,
    };
  }

  const clerkUser = await currentUser().catch(() => null);

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated Clerk user has no email address.");
  }

  const prisma = getPrisma();
  const user = await prisma.user.upsert({
    where: { clerkUserId: clerkUser.id },
    update: {
      email,
      name: clerkUser.fullName,
    },
    create: {
      clerkUserId: clerkUser.id,
      email,
      name: clerkUser.fullName,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isDemo: false,
  };
}

export async function requireRestaurantAccess(
  restaurantId: string,
  action: RestaurantAction,
) {
  const user = await requireUser();

  if (user.isDemo && DEMO_RESTAURANT_IDS.includes(restaurantId)) {
    return {
      user,
      role: "OWNER" as const,
      organizationId: "demo-organization",
    };
  }

  const prisma = getPrisma();
  const membership = await prisma.organizationUser.findFirst({
    where: {
      userId: user.id,
      organization: {
        restaurants: {
          some: {
            id: restaurantId,
          },
        },
      },
    },
    select: {
      role: true,
      organizationId: true,
    },
  });

  if (!membership || !can(membership.role, action)) {
    throw new Error("You do not have access to this restaurant action.");
  }

  return {
    user,
    role: membership.role,
    organizationId: membership.organizationId,
  };
}
