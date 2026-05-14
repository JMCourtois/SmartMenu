"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ChefHat, QrCode, Settings, Sparkles } from "lucide-react";

import { SmartEyebrow } from "@/components/smartmenu/primitives";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: "menu" | "ai" | "analytics" | "qr" | "settings";
  color: string;
};

const iconByKey = {
  menu: ChefHat,
  ai: Sparkles,
  analytics: BarChart3,
  qr: QrCode,
  settings: Settings,
};

export function ManagerNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      <SmartEyebrow className="hidden px-2 py-1 text-[var(--muted)] lg:block">
        Workspace
      </SmartEyebrow>
      {items.map((item) => {
        const Icon = iconByKey[item.icon];
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-medium transition duration-[var(--dur-fast)] ease-[var(--ease-out-smooth)]",
              active
                ? "bg-white text-[var(--ink)] shadow-[var(--ring-hairline)]"
                : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]",
            )}
          >
            <span
              className="flex size-7 items-center justify-center rounded-[var(--radius-sm)] text-white"
              style={{ backgroundColor: active ? "var(--accent-dark)" : item.color }}
            >
              <Icon className="size-4" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
