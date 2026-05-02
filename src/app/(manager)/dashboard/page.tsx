import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getDashboardRestaurants } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const restaurants = await getDashboardRestaurants(user.id);
  const firstRestaurant = restaurants[0];

  if (firstRestaurant) {
    redirect(`/dashboard/restaurants/${firstRestaurant.id}/menu`);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">No restaurants yet</h1>
    </main>
  );
}
