import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

import { ManagerNav } from "@/components/dashboard/ManagerNav";
import { SmartEyebrow, SmartMenuLogo } from "@/components/smartmenu/primitives";
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
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]" data-theme="hofbrau">
      <div className="mx-auto grid min-h-screen max-w-[1380px] gap-6 p-4 lg:grid-cols-[260px_1fr] lg:p-6">
        <aside className="flex flex-col gap-4 rounded-[var(--radius-xl)] bg-[var(--paper-warm)] p-4 shadow-[var(--ring-hairline)] lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:self-start lg:overflow-y-auto">
          <Link href="/dashboard" className="no-underline">
            <SmartMenuLogo sublabel="Manager" />
          </Link>
          <div className="rounded-[var(--radius-md)] bg-white p-4 shadow-[var(--ring-hairline)]">
            <SmartEyebrow className="text-[var(--muted)]">Restaurant</SmartEyebrow>
            <p className="mt-2 truncate text-sm font-semibold">
              {firstRestaurant?.name ?? "No restaurants"}
            </p>
            <p className="mt-1 truncate text-xs text-[var(--muted)]">{user.email}</p>
            <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--secondary-soft)] p-3 text-xs leading-5 text-[var(--accent-dark)]">
              <ClipboardCheck data-icon="inline-start" />
              Review draft changes before publishing the public QR menu.
            </div>
          </div>
          <ManagerNav items={nav} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
