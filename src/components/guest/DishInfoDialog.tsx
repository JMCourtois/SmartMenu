"use client";

import type { ReactNode } from "react";
import { Flame, Info, MessageCircle, ShieldAlert, Soup, Utensils } from "lucide-react";

import { MenuTagBadge } from "@/components/guest/MenuTagVisual";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SmartEyebrow,
  SmartPrice,
} from "@/components/smartmenu/primitives";
import {
  formatLocalizedPrice,
  getGuestCopy,
  localizedAllergenName,
  localizedDescription,
  localizedDietaryTagName,
  localizedIngredients,
  localizedCtaPrompts,
  localizedItemField,
  localizedName,
} from "@/lib/guest-menu";
import type { MenuItemView, RestaurantMenuView } from "@/types/menu";

type Props = {
  item: MenuItemView | null;
  menu: RestaurantMenuView;
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAskAi: (question: string, focusItemId?: string) => void;
};

function SpiceMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Spice level ${value} of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className="h-1.5 w-4 rounded-full"
          style={{
            backgroundColor:
              index < value ? "var(--secondary)" : "color-mix(in srgb, var(--muted) 18%, white)",
          }}
        />
      ))}
    </div>
  );
}

function DetailCard({
  title,
  icon,
  children,
  tone = "white",
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  tone?: "white" | "accent" | "secondary";
}) {
  return (
    <section
      className="rounded-[var(--radius-lg)] p-4 shadow-[var(--ring-hairline)]"
      style={{
        background:
          tone === "accent"
            ? "var(--accent-soft)"
            : tone === "secondary"
              ? "var(--secondary-soft)"
              : "var(--white)",
      }}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
        {icon}
        {title}
      </div>
      <div className="text-sm leading-6 text-[var(--muted)]">{children}</div>
    </section>
  );
}

export function DishInfoDialog({
  item,
  menu,
  locale,
  open,
  onOpenChange,
  onAskAi,
}: Props) {
  if (!item) {
    return null;
  }

  const safetySensitive = item.allergens.some(
    (allergen) => allergen.verificationStatus !== "VERIFIED",
  );
  const copy = getGuestCopy(locale);
  const ingredients = localizedIngredients(item, locale);
  const ctaPrompts = localizedCtaPrompts(item, locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100dvh] overflow-hidden rounded-none bg-[var(--paper)] p-0 shadow-[var(--shadow-overlay)] ring-0 sm:max-h-[92vh] sm:rounded-[28px] sm:max-w-5xl">
        <div className="grid max-h-[100dvh] overflow-y-auto sm:max-h-[92vh] md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-72 bg-[var(--ink)] sm:min-h-80 md:min-h-full">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={localizedName(item, locale)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div
              className="absolute inset-0"
              style={{ background: "var(--scrim-bottom)" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <span className="mb-4 inline-flex rounded-full bg-white/95 px-4 py-2 text-[var(--ink)]">
                <SmartPrice>
                  {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
                </SmartPrice>
              </span>
              <h2 className="text-balance font-display text-3xl font-semibold leading-none sm:text-5xl">
                {localizedName(item, locale)}
              </h2>
              <p className="mt-3 line-clamp-3 max-w-md text-sm leading-6 text-white/90 sm:line-clamp-none">
                {localizedDescription(item, locale)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-7">
            <DialogHeader className="sr-only">
              <DialogTitle>{localizedName(item, locale)}</DialogTitle>
              <DialogDescription>{localizedDescription(item, locale)}</DialogDescription>
            </DialogHeader>

            <DetailCard
              title={copy.explanation}
              icon={<Info className="size-4 text-[var(--accent-dark)]" />}
              tone="accent"
            >
              {localizedItemField(item, locale, "explanation")}
            </DetailCard>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailCard
                title={copy.origin}
                icon={<Soup className="size-4 text-[var(--secondary)]" />}
              >
                {localizedItemField(item, locale, "origin")}
              </DetailCard>
              <DetailCard
                title={copy.tasteProfile}
                icon={<Utensils className="size-4 text-[var(--secondary)]" />}
                tone="secondary"
              >
                {localizedItemField(item, locale, "tasteProfile")}
              </DetailCard>
            </div>

            <DetailCard title={copy.preparation}>
              {localizedItemField(item, locale, "preparation")}
            </DetailCard>

            <DetailCard title={copy.ingredients}>
              <div className="flex flex-wrap gap-1.5">
                {ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex min-h-7 items-center rounded-full border border-[var(--hairline)] bg-white px-3 text-xs text-[var(--ink-soft)]"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </DetailCard>

            <DetailCard
              title={copy.dietary}
              icon={<Flame className="size-4 text-[var(--secondary)]" />}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-xs font-medium text-[var(--ink-soft)]">
                  {copy.spiceLevel}
                </span>
                <SpiceMeter value={item.spiceLevel} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.dietaryTags.map((tag) => (
                  <MenuTagBadge
                    key={tag.code}
                    code={tag.code}
                    label={localizedDietaryTagName(tag, locale)}
                  />
                ))}
              </div>
            </DetailCard>

            <section className="rounded-[var(--radius-lg)] bg-[var(--danger-soft)] p-4 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--danger)_18%,transparent)]">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--danger)]">
                <ShieldAlert className="size-4" />
                {copy.allergens}
              </div>
              <div className="grid gap-2">
                {item.allergens.length ? (
                  item.allergens.map((allergen) => (
                    <div
                      key={allergen.code}
                      className="min-w-0 rounded-[var(--radius-sm)] bg-white p-3 text-xs shadow-[var(--ring-hairline)]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <span className="font-medium text-[var(--ink)]">
                          {localizedAllergenName(allergen, locale)}
                        </span>
                        <span className="font-price text-[10px] uppercase text-[var(--muted)]">
                          {allergen.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      {allergen.note ? (
                        <p className="mt-1 leading-5 text-[var(--muted)]">{allergen.note}</p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-xs leading-5 text-[var(--muted)]">
                    {copy.safetyNotice}
                  </p>
                )}
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                {safetySensitive ? `${copy.askStaff}. ` : ""}
                {copy.safetyNotice}
              </p>
            </section>

            {item.pairings.length ? (
              <DetailCard title={copy.pairings}>
                <div className="grid gap-2">
                  {item.pairings.map((pairing) => (
                    <div
                      key={pairing.id}
                      className="rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3"
                    >
                      <div className="font-semibold text-[var(--ink)]">
                        {pairing.pairedItemName}
                      </div>
                      {pairing.reason ? (
                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                          {pairing.reason}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </DetailCard>
            ) : null}

            <div className="pt-1">
              <SmartEyebrow className="mb-3 text-[var(--muted)]">
                {copy.ai.title}
              </SmartEyebrow>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  onOpenChange(false);
                  onAskAi(
                    ctaPrompts[0] ??
                      copy.ai.demoPrompts[0]?.prompt ??
                      copy.getRecommendation,
                    item.id,
                  );
                }}
              >
                <MessageCircle data-icon="inline-start" />
                {copy.askAiAboutDish}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
