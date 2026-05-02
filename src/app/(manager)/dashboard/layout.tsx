import Link from "next/link";
import { ChefHat, ClipboardCheck } from "lucide-react";

import { ManagerNav } from "@/components/dashboard/ManagerNav";
import { requireUser } from "@/lib/auth";
import { getDashboardRestaurants } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const restaurants = await getDashboardRestaurants(user.id);
  const firstRestaurant = restaurants[0];

  const nav = firstRestaurant
    ? [
        {
          href: `/dashboard/restaurants/${firstRestaurant.id}/menu`,
          label: "Menu",
          icon: "menu" as const,
          color: "#1f7a55",
        },
        {
          href: `/dashboard/restaurants/${firstRestaurant.id}/ai-editor`,
          label: "AI editor",
          icon: "ai" as const,
          color: "#7c3aed",
        },
        {
          href: `/dashboard/restaurants/${firstRestaurant.id}/analytics`,
          label: "Analytics",
          icon: "analytics" as const,
          color: "#0f78b8",
        },
        {
          href: `/dashboard/restaurants/${firstRestaurant.id}/qr`,
          label: "QR",
          icon: "qr" as const,
          color: "#d97706",
        },
        {
          href: `/dashboard/restaurants/${firstRestaurant.id}/settings`,
          label: "Settings",
          icon: "settings" as const,
          color: "#334155",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#f5f7f2]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[240px_1fr]">
        <aside className="border-b bg-[#eef4ea] px-4 py-4 lg:border-b-0 lg:border-r lg:border-emerald-900/10">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-sm">
              <ChefHat />
            </span>
            SmartMenu
          </Link>
          <div className="mt-5 rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Restaurant workspace
            </p>
            <p className="mt-1 truncate font-medium">
              {firstRestaurant?.name ?? "No restaurants"}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <ClipboardCheck data-icon="inline-start" />
              Review draft changes before publishing the public QR menu.
            </div>
          </div>
          <ManagerNav items={nav} />
        </aside>
        <div className="min-w-0 bg-[#f8faf5]">{children}</div>
      </div>
    </div>
  );
}
