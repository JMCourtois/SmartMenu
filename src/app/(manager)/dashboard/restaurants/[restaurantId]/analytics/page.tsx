import { notFound } from "next/navigation";
import { BarChart3, Filter, Languages, MousePointerClick, ShieldAlert } from "lucide-react";

import { ManagerPageHeader } from "@/components/dashboard/ManagerPageHeader";
import { ManagerStatusCard } from "@/components/dashboard/ManagerStatusCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRestaurantAccess } from "@/lib/auth";
import { getLocaleOption } from "@/lib/guest-menu";
import { getAnalyticsSummary, getManagerRestaurant } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  await requireRestaurantAccess(restaurantId, "analytics:read");
  const [data, summary] = await Promise.all([
    getManagerRestaurant(restaurantId),
    getAnalyticsSummary(restaurantId),
  ]);

  if (!data) {
    notFound();
  }

  const maxLanguageCount = Math.max(...summary.topLanguages.map((language) => language.count), 1);
  const maxTopItemCount = Math.max(...summary.topItems.map((item) => item.count), 1);

  return (
    <main className="flex flex-col gap-5 p-4 sm:p-6">
      <ManagerPageHeader
        title="Guest analytics"
        description="Privacy-friendly first-party events that help operators decide what to translate, promote, clarify, and label."
        restaurantName={data.restaurant.name}
        restaurantSlug={data.restaurant.slug}
        statusLabel="Last 30 days"
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <ManagerStatusCard
          label="QR scans"
          value={String(summary.scans)}
          helper="Public menu sessions from QR and shared links."
          icon={BarChart3}
          tone="blue"
        />
        <ManagerStatusCard
          label="Item views"
          value={String(summary.itemViews)}
          helper="Dish pages and info panels opened by guests."
          icon={MousePointerClick}
          tone="green"
        />
        <ManagerStatusCard
          label="Allergen views"
          value={String(summary.allergenViews)}
          helper="Safety information that guests actively checked."
          icon={ShieldAlert}
          tone="rose"
        />
        <ManagerStatusCard
          label="AI opens"
          value={String(summary.assistantOpens)}
          helper="Concierge sessions where guests asked what to order."
          icon={Filter}
          tone="violet"
        />
        <ManagerStatusCard
          label="Promo clicks"
          value={String(summary.promotedClicks)}
          helper="Featured dishes that earned guest attention."
          icon={MousePointerClick}
          tone="amber"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader>
            <Languages className="text-sky-700" />
            <CardTitle>Top languages</CardTitle>
            <CardDescription>Guest-selected menu language.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {summary.topLanguages.map((language) => {
              const option = getLocaleOption(language.locale);
              return (
                <div key={language.locale} className="grid gap-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="gap-2">
                      <span>{option.flag}</span>
                      {option.nativeLabel}
                    </Badge>
                    <span className="font-mono text-sm">{language.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-600"
                      style={{ width: `${(language.count / maxLanguageCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader>
            <MousePointerClick className="text-emerald-700" />
            <CardTitle>Top dishes</CardTitle>
            <CardDescription>Most opened item detail pages.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {summary.topItems.map((item, index) => (
              <div key={item.itemId} className="grid gap-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">
                    #{index + 1} {item.name}
                  </span>
                  <span className="font-mono text-sm">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(item.count / maxTopItemCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader>
            <Filter className="text-amber-700" />
            <CardTitle>Top filters</CardTitle>
            <CardDescription>Signals for menu labels and translations.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {summary.topFilters.map((filter) => (
              <div key={filter.filter} className="flex items-center justify-between">
                <Badge variant="secondary">{filter.filter}</Badge>
                <span className="font-mono text-sm">{filter.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-slate-950 text-white shadow-sm">
        <CardHeader>
          <CardTitle>Recommended actions</CardTitle>
          <CardDescription className="text-white/65">
            Generated from first-party menu events.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-white/[0.08] p-3 text-sm ring-1 ring-white/10">
            Add visible no-pork labels to dishes guests filter for most.
          </div>
          <div className="rounded-xl bg-white/[0.08] p-3 text-sm ring-1 ring-white/10">
            Translate the top viewed dishes before translating long-tail items.
          </div>
          <div className="rounded-xl bg-white/[0.08] p-3 text-sm ring-1 ring-white/10">
            Review allergen notes on promoted dishes before increasing visibility.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
