"use client";

import Link from "next/link";
import { ChevronRight, Info, MessageCircle, ShieldAlert, Sparkles, ThermometerSun, Utensils } from "lucide-react";

import { MenuTagBadge } from "@/components/guest/MenuTagVisual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatLocalizedPrice,
  getGuestCopy,
  localizedCategoryName,
  localizedCtaPrompts,
  localizedDietaryTagName,
  localizedItemField,
  localizedIngredientLine,
  localizedDescription,
  localizedName,
} from "@/lib/guest-menu";
import { cn } from "@/lib/utils";
import type { MenuCategoryView, MenuItemView, RestaurantMenuView } from "@/types/menu";

type Props = {
  categories: MenuCategoryView[];
  menu: RestaurantMenuView;
  locale: string;
  onTrack: (eventType: string, metadata?: Record<string, unknown>) => void;
  onSelectItem: (item: MenuItemView) => void;
  onAskAi: (question: string) => void;
};

function ClassicMenuRow({
  item,
  menu,
  locale,
  onTrack,
  onSelectItem,
  onAskAi,
}: {
  item: MenuItemView;
  menu: RestaurantMenuView;
  locale: string;
  onTrack: Props["onTrack"];
  onSelectItem: (item: MenuItemView) => void;
  onAskAi: (question: string) => void;
}) {
  const warning = item.allergens.some((allergen) => allergen.verificationStatus !== "VERIFIED");
  const copy = getGuestCopy(locale);

  return (
    <article
      className={cn(
        "grid gap-3 border-b border-dashed py-5 last:border-0 md:grid-cols-[1fr_auto]",
        !item.isAvailable && "opacity-55",
      )}
      style={{ borderColor: "color-mix(in srgb, var(--menu-accent) 22%, transparent)" }}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-semibold tracking-normal" style={{ color: "var(--menu-ink)" }}>
            {localizedName(item, locale)}
          </h3>
          {item.isPromoted ? (
            <Badge className="border-0 text-white" style={{ backgroundColor: "var(--menu-secondary)" }}>
              <Sparkles data-icon="inline-start" />
              {copy.promoted}
            </Badge>
          ) : null}
          {!item.isAvailable ? <Badge variant="destructive">{copy.unavailable}</Badge> : null}
        </div>
        <p className="mt-1 max-w-3xl text-sm leading-6" style={{ color: "var(--menu-muted)" }}>
          {localizedDescription(item, locale)}
        </p>
        <p className="mt-2 flex max-w-3xl items-start gap-1.5 text-xs leading-5 text-foreground/70">
          <Utensils className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--menu-secondary)" }} />
          <span>
            <span className="font-semibold">{copy.ingredientsPrefix}:</span>{" "}
            {localizedIngredientLine(item, locale)}
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-foreground/65">
          {localizedItemField(item, locale, "explanation")}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.dietaryTags.slice(0, 5).map((tag) => (
            <MenuTagBadge
              key={tag.code}
              code={tag.code}
              label={localizedDietaryTagName(tag, locale)}
            />
          ))}
          {item.spiceLevel > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs">
              <ThermometerSun className="size-4" style={{ color: "var(--menu-secondary)" }} />
              {copy.spiceLevel} {item.spiceLevel}/5
            </span>
          ) : null}
          {warning ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
              <ShieldAlert className="size-4" />
              {copy.askStaff}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:min-w-48 md:flex-col md:items-end md:justify-start">
        <div className="font-mono text-lg font-semibold" style={{ color: "var(--menu-accent-dark)" }}>
          {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectItem(item)}>
            <Info data-icon="inline-start" />
            {copy.info}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onAskAi(
                localizedCtaPrompts(item, locale)[1] ??
                  copy.ai.demoPrompts[0]?.prompt ??
                  copy.getRecommendation,
              )
            }
          >
            <MessageCircle data-icon="inline-start" />
            {copy.guideMe}
          </Button>
        </div>
        <Link
          href={`/r/${menu.restaurant.slug}/item/${item.slug}`}
          className="hidden items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground md:inline-flex"
          onClick={() => onTrack("ITEM_VIEWED", { itemSlug: item.slug })}
        >
          {copy.info}
          <ChevronRight data-icon="inline-end" />
        </Link>
      </div>
    </article>
  );
}

export function ClassicMenuView({
  categories,
  menu,
  locale,
  onTrack,
  onSelectItem,
  onAskAi,
}: Props) {
  const copy = getGuestCopy(locale);

  return (
    <div
      className="rounded-[2rem] border p-4 shadow-sm sm:p-8"
      style={{
        backgroundColor: "var(--menu-paper)",
        borderColor: "color-mix(in srgb, var(--menu-accent) 18%, transparent)",
      }}
    >
      <div className="mb-8 flex flex-col gap-3 border-b pb-6 text-center"
        style={{ borderColor: "color-mix(in srgb, var(--menu-accent) 25%, transparent)" }}
      >
        <div className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--menu-secondary)" }}>
          {copy.classicView}
        </div>
        <h2 className="text-3xl font-semibold tracking-normal" style={{ color: "var(--menu-ink)" }}>
          {menu.restaurant.name}
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-6" style={{ color: "var(--menu-muted)" }}>
          {copy.classicViewDescription}
        </p>
      </div>

      <div className="grid gap-10">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <div className="mb-2 flex items-end justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold tracking-normal" style={{ color: "var(--menu-accent-dark)" }}>
                {localizedCategoryName(category, locale)}
              </h3>
              <div className="h-px flex-1" style={{ backgroundColor: "color-mix(in srgb, var(--menu-accent) 22%, transparent)" }} />
              <span className="font-mono text-xs" style={{ color: "var(--menu-muted)" }}>
                {String(category.items.length).padStart(2, "0")}
              </span>
            </div>
            <div>
              {category.items.map((item) => (
                <ClassicMenuRow
                  key={item.id}
                  item={item}
                  menu={menu}
                  locale={locale}
                  onTrack={onTrack}
                  onSelectItem={onSelectItem}
                  onAskAi={onAskAi}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white/50 p-8 text-center">
          <p className="font-medium">{copy.noDishesTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.noDishesDescription}
          </p>
        </div>
      ) : null}
    </div>
  );
}
