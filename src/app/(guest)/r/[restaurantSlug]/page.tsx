import { notFound } from "next/navigation";

import { GuestMenuClient } from "@/components/guest/GuestMenuClient";
import { getPublishedMenuBySlug } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

export default async function GuestRestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantSlug: string }>;
  searchParams: Promise<{ source?: string; table?: string; view?: string }>;
}) {
  const [{ restaurantSlug }, query] = await Promise.all([params, searchParams]);
  const menu = await getPublishedMenuBySlug(restaurantSlug);

  if (!menu) {
    notFound();
  }

  return (
    <GuestMenuClient
      menu={menu}
      source={query.source}
      tableCode={query.table}
      initialView={query.view}
    />
  );
}
