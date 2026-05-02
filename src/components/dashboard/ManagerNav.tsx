"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ChefHat, QrCode, Settings, Sparkles } from "lucide-react";

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
    <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const Icon = iconByKey[item.icon];
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
              active
                ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:bg-white/70 hover:text-foreground",
            )}
          >
            <span
              className="flex size-8 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ backgroundColor: item.color }}
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
