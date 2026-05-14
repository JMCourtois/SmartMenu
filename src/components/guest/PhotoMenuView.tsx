"use client";

import { BadgeCheck, Info, ShieldAlert, Sparkles } from "lucide-react";

import { MenuTagIcon } from "@/components/guest/MenuTagVisual";
import { Button } from "@/components/ui/button";
import {
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

function MetaRow({ item, locale }: { item: MenuItemView; locale: string }) {
  const codes = [
    ...(item.spiceLevel >= 3 ? ["spicy"] : []),
    ...item.dietaryTags.map((tag) => tag.code).filter((code) => code !== "traditional").slice(0, 3),
  ];

  if (!codes.length) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase text-[var(--muted)]">
      {codes.map((code, index) => {
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

function PhotoCard({
  item,
  menu,
  locale,
  onSelectItem,
}: {
  item: MenuItemView;
  menu: RestaurantMenuView;
  locale: string;
  onSelectItem: (item: MenuItemView) => void;
}) {
  const copy = getGuestCopy(locale);
  const allergenNeedsReview = item.allergens.some(
    (entry) => entry.verificationStatus !== "VERIFIED",
  );

  return (
    <article
      className={cn(
        "group flex cursor-pointer flex-col gap-4 transition-opacity hover:opacity-95",
        !item.isAvailable && "opacity-55",
      )}
      onClick={() => onSelectItem(item)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[var(--paper-warm)]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-[var(--dur-slow)] ease-[var(--ease-out-smooth)] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
        {item.isPromoted ? (
          <span className="smart-eyebrow absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[9px] text-[var(--secondary)]">
            {copy.promoted}
          </span>
        ) : null}
        {!item.isAvailable ? (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--danger)] px-3 py-1.5 text-xs font-medium text-white">
            {copy.unavailable}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-baseline gap-3">
          <h3 className="min-w-0 flex-1 text-balance font-display text-2xl font-medium leading-tight text-[var(--ink)]">
            {localizedName(item, locale)}
          </h3>
          <SmartPrice>
            {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
          </SmartPrice>
        </div>
        <p className="line-clamp-2 font-display text-base italic leading-snug text-[var(--ink-soft)]">
          {localizedDescription(item, locale)}
        </p>
        <p className="line-clamp-1 text-xs leading-5 text-[var(--muted)]">
          {localizedIngredientLine(item, locale)}
        </p>
        <MetaRow item={item} locale={locale} />
        {allergenNeedsReview ? (
          <p className="mt-2 inline-flex items-start gap-1.5 text-xs leading-5 text-[var(--danger)]">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
            {copy.askStaff}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => onSelectItem(item)}>
            <Info data-icon="inline-start" />
            {copy.info}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function PhotoMenuView({
  categories,
  menu,
  locale,
  onSelectItem,
  onAskAi,
}: Props) {
  const copy = getGuestCopy(locale);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-20">
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-24">
          <header className="mb-8 flex items-baseline gap-5">
            <h2 className="whitespace-nowrap font-display text-4xl font-medium leading-none text-[var(--ink)]">
              {localizedCategoryName(category, locale)}
            </h2>
            <SmartHairline />
            <SmartEyebrow className="text-[var(--muted)]">
              {String(category.items.length).padStart(2, "0")}
            </SmartEyebrow>
          </header>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {category.items.map((item) => (
              <PhotoCard
                key={item.id}
                item={item}
                menu={menu}
                locale={locale}
                onSelectItem={onSelectItem}
              />
            ))}
          </div>
        </section>
      ))}
      {categories.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <BadgeCheck className="mx-auto mb-3 text-[var(--muted)]" />
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
      ) : null}
    </div>
  );
}
