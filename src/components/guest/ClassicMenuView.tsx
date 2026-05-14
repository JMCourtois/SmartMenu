"use client";

import { Info, ShieldAlert, Sparkles } from "lucide-react";

import { MenuTagIcon } from "@/components/guest/MenuTagVisual";
import { Button } from "@/components/ui/button";
import {
  DotLeader,
  SmartEyebrow,
  SmartHairline,
  SmartPrice,
} from "@/components/smartmenu/primitives";
import {
  formatLocalizedPrice,
  getGuestCopy,
  localizedCategoryName,
  localizedDescription,
  localizedDietaryTagName,
  localizedIngredientLine,
  localizedItemField,
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

function ClassicMeta({ item, locale }: { item: MenuItemView; locale: string }) {
  const tags = [
    ...(item.spiceLevel > 0 ? ["spicy"] : []),
    ...item.dietaryTags.map((tag) => tag.code).filter((code) => code !== "traditional"),
  ];

  if (!tags.length) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase text-[var(--muted)]">
      {tags.slice(0, 6).map((code, index) => {
        const tag = item.dietaryTags.find((entry) => entry.code === code);

        return (
          <span key={`${code}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className="size-1 rounded-full bg-[var(--hairline)]" />
            ) : null}
            <MenuTagIcon code={code} className="size-4 border-0 bg-transparent text-current" />
            {tag ? localizedDietaryTagName(tag, locale) : code}
          </span>
        );
      })}
    </div>
  );
}

function ClassicMenuRow({
  item,
  menu,
  locale,
  onSelectItem,
  last,
}: {
  item: MenuItemView;
  menu: RestaurantMenuView;
  locale: string;
  onSelectItem: (item: MenuItemView) => void;
  last: boolean;
}) {
  const warning = item.allergens.some((allergen) => allergen.verificationStatus !== "VERIFIED");
  const copy = getGuestCopy(locale);

  return (
    <article
      className={cn(
        "min-w-0 cursor-pointer py-5 transition-opacity hover:opacity-95 sm:py-6",
        !last && "border-b border-[var(--hairline-soft)]",
        !item.isAvailable && "opacity-55",
      )}
      onClick={() => onSelectItem(item)}
    >
      {item.isPromoted ? (
        <SmartEyebrow className="mb-2 text-[var(--secondary)]">
          {copy.promoted}
        </SmartEyebrow>
      ) : null}

      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-0">
        <h3 className="min-w-0 text-balance font-display text-xl font-medium leading-tight text-[var(--ink)] sm:text-2xl">
          {localizedName(item, locale)}
        </h3>
        <DotLeader className="hidden sm:block" />
        <SmartPrice size="lg">
          {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
        </SmartPrice>
      </div>

        <p className="mt-2 max-w-2xl font-display text-[15px] italic leading-relaxed text-[var(--ink-soft)] sm:text-base">
        {localizedDescription(item, locale)}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        {localizedIngredientLine(item, locale)}.
      </p>
      {localizedItemField(item, locale, "explanation") ? (
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[var(--muted)]">
          {localizedItemField(item, locale, "explanation")}
        </p>
      ) : null}

      <ClassicMeta item={item} locale={locale} />
      {warning ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--danger)]">
          <ShieldAlert className="size-4" />
          {copy.askStaff}
        </p>
      ) : null}

      <div
        className="mt-4 flex flex-wrap gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        <Button variant="outline" size="sm" onClick={() => onSelectItem(item)}>
          <Info data-icon="inline-start" />
          {copy.info}
        </Button>
      </div>
    </article>
  );
}

export function ClassicMenuView({
  categories,
  menu,
  locale,
  onSelectItem,
  onAskAi,
}: Props) {
  const copy = getGuestCopy(locale);

  return (
    <div className="mx-auto max-w-3xl">
      {categories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={cn("scroll-mt-24", categoryIndex > 0 && "mt-12 sm:mt-16")}
        >
          <header className="mb-5 flex items-baseline gap-4 sm:mb-6 sm:gap-5">
            <h2 className="min-w-0 text-balance font-display text-3xl font-medium leading-none text-[var(--ink)] sm:whitespace-nowrap">
              {localizedCategoryName(category, locale)}
            </h2>
            <SmartHairline />
            <SmartEyebrow className="text-[var(--muted)]">
              {String(category.items.length).padStart(2, "0")}
            </SmartEyebrow>
          </header>
          <div>
            {category.items.map((item, itemIndex) => (
              <ClassicMenuRow
                key={item.id}
                item={item}
                menu={menu}
                locale={locale}
                onSelectItem={onSelectItem}
                last={itemIndex === category.items.length - 1}
              />
            ))}
          </div>
        </section>
      ))}

      {categories.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">
            {copy.noDishesTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {copy.noDishesDescription}
          </p>
          <Button
            className="mt-5"
            onClick={() => onAskAi(copy.ai.demoPrompts[0]?.prompt ?? copy.getRecommendation)}
          >
            <Sparkles data-icon="inline-start" />
            {copy.getRecommendation}
          </Button>
        </div>
      ) : (
        <footer className="mt-20 flex flex-col gap-2 border-t border-[var(--hairline)] pt-6 font-price text-[10px] uppercase text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>Prices in {menu.restaurant.currency}</span>
          <span>{copy.safetyNotice}</span>
        </footer>
      )}
    </div>
  );
}
