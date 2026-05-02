"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  Info,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Utensils,
} from "lucide-react";

import { MenuTagBadge } from "@/components/guest/MenuTagVisual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatLocalizedPrice,
  getGuestCopy,
  localizedCategoryName,
  localizedCtaPrompts,
  localizedDietaryTagName,
  localizedItemField,
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

function SpiceDots({ value }: { value: number }) {
  if (value <= 0) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium">
      {Array.from({ length: Math.min(value, 5) }).map((_, index) => (
        <span
          key={index}
          className="size-1.5 rounded-full"
          style={{ backgroundColor: "var(--menu-secondary)" }}
        />
      ))}
    </span>
  );
}

function MenuItemCard({
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
  const allergenNeedsReview = item.allergens.some(
    (entry) => entry.verificationStatus !== "VERIFIED",
  );
  const copy = getGuestCopy(locale);

  return (
    <Card
      size="sm"
      className={cn(
        "group overflow-hidden border-0 bg-white/90 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg",
        !item.isAvailable && "opacity-60",
      )}
    >
      <div className="relative">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-48"
            loading="lazy"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isPromoted ? (
            <Badge className="border-0 text-white" style={{ backgroundColor: "var(--menu-accent)" }}>
              <Sparkles data-icon="inline-start" />
              {copy.promoted}
            </Badge>
          ) : null}
          {!item.isAvailable ? <Badge variant="destructive">{copy.unavailable}</Badge> : null}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 font-mono text-sm font-semibold shadow-sm">
          {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="line-clamp-1">{localizedName(item, locale)}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {localizedDescription(item, locale)}
            </CardDescription>
          </div>
          <SpiceDots value={item.spiceLevel} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {item.dietaryTags.slice(0, 4).map((tag) => (
            <MenuTagBadge
              key={tag.code}
              code={tag.code}
              label={localizedDietaryTagName(tag, locale)}
              className="min-h-7 px-2 py-0.5"
            />
          ))}
        </div>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          <Utensils data-icon="inline-start" />
          {localizedItemField(item, locale, "tasteProfile")}
        </p>
        {allergenNeedsReview ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-2 text-xs text-muted-foreground">
            <ShieldAlert data-icon="inline-start" />
            {copy.safetyNotice}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectItem(item)}>
            <Info data-icon="inline-start" />
            {copy.info}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onAskAi(
                localizedCtaPrompts(item, locale)[0] ??
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
          className="inline-flex h-8 items-center justify-between rounded-lg px-2.5 text-sm font-medium hover:bg-muted"
          onClick={() =>
            onTrack("ITEM_VIEWED", {
              itemSlug: item.slug,
            })
          }
        >
          {copy.info}
          <ChevronRight data-icon="inline-end" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function PhotoMenuView({
  categories,
  menu,
  locale,
  onTrack,
  onSelectItem,
  onAskAi,
}: Props) {
  const copy = getGuestCopy(locale);

  return (
    <div className="flex flex-col gap-10">
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-28">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--menu-accent)" }}
              >
                {category.sortOrder}
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-normal">
                  {localizedCategoryName(category, locale)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {copy.photoViewDescription}
                </p>
              </div>
            </div>
            <span className="hidden rounded-full px-3 py-1 font-mono text-xs sm:inline-flex"
              style={{ backgroundColor: "var(--menu-secondary-soft)", color: "var(--menu-ink)" }}
            >
              {category.items.length}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {category.items.map((item) => (
              <MenuItemCard
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
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white/80 p-8 text-center">
          <BadgeCheck className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">{copy.noDishesTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.noDishesDescription}
          </p>
        </div>
      ) : null}
    </div>
  );
}
