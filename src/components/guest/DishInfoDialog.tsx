"use client";

import { Flame, Info, MessageCircle, ShieldAlert, Soup, Utensils } from "lucide-react";

import { MenuTagBadge } from "@/components/guest/MenuTagVisual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
          className="h-2.5 w-4 rounded-full"
          style={{
            backgroundColor:
              index < value ? "var(--menu-secondary)" : "color-mix(in srgb, var(--menu-muted) 20%, white)",
          }}
        />
      ))}
    </div>
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
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl">
        <div className="grid overflow-hidden rounded-lg md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-64 bg-muted md:min-h-full">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={localizedName(item, locale)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div
              className="absolute inset-x-0 bottom-0 p-5 text-white"
              style={{
                background:
                  "linear-gradient(180deg, transparent, color-mix(in srgb, var(--menu-accent-dark) 88%, black))",
              }}
            >
              <div className="mb-2 inline-flex rounded-full bg-white/95 px-3 py-1 font-mono text-sm font-semibold text-foreground shadow-sm">
                {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
              </div>
              <h2 className="text-3xl font-semibold tracking-normal">{localizedName(item, locale)}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/90">
                {localizedDescription(item, locale)}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <DialogHeader className="sr-only">
              <DialogTitle>{localizedName(item, locale)}</DialogTitle>
              <DialogDescription>{localizedDescription(item, locale)}</DialogDescription>
            </DialogHeader>

            <section
              className="rounded-2xl p-4"
              style={{ backgroundColor: "var(--menu-accent-soft)" }}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Info className="size-4" />
                {copy.explanation}
              </div>
              <p className="text-sm leading-6 text-foreground/80">
                {localizedItemField(item, locale, "explanation")}
              </p>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <section className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Soup className="size-4" style={{ color: "var(--menu-secondary)" }} />
                  {copy.origin}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {localizedItemField(item, locale, "origin")}
                </p>
              </section>
              <section
                className="rounded-2xl border p-4 shadow-sm"
                style={{ backgroundColor: "var(--menu-secondary-soft)" }}
              >
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Utensils className="size-4" style={{ color: "var(--menu-secondary)" }} />
                  {copy.tasteProfile}
                </div>
                <p className="text-sm leading-6 text-foreground/75">
                  {localizedItemField(item, locale, "tasteProfile")}
                </p>
              </section>
            </div>

            <section className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-semibold">{copy.preparation}</div>
              <p className="text-sm leading-6 text-muted-foreground">
                {localizedItemField(item, locale, "preparation")}
              </p>
            </section>

            <section className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 text-sm font-semibold">{copy.ingredients}</div>
              <div className="flex flex-wrap gap-1.5">
                {ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="outline">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Flame className="size-4" style={{ color: "var(--menu-secondary)" }} />
                  {copy.spiceLevel}
                </span>
                <SpiceMeter value={item.spiceLevel} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.dietaryTags.map((tag) => (
                  <MenuTagBadge
                    key={tag.code}
                    code={tag.code}
                    label={localizedDietaryTagName(tag, locale)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="size-4" />
                {copy.allergens}
              </div>
              <div className="space-y-2">
                {item.allergens.map((allergen) => (
                  <div key={allergen.code} className="rounded-lg bg-white p-2 text-xs shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{localizedAllergenName(allergen, locale)}</span>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {allergen.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    {allergen.note ? (
                      <p className="mt-1 leading-5 text-muted-foreground">{allergen.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {safetySensitive ? `${copy.askStaff}. ` : ""}
                {copy.safetyNotice}
              </p>
            </section>

            {item.pairings.length ? (
              <section className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-3 text-sm font-semibold">{copy.pairings}</div>
                <div className="grid gap-2">
                  {item.pairings.map((pairing) => (
                    <div key={pairing.id} className="rounded-xl bg-muted/60 p-3 text-sm">
                      <div className="font-medium">{pairing.pairedItemName}</div>
                      {pairing.reason ? (
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{pairing.reason}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <DialogFooter className="items-stretch sm:items-center">
              <Button
                className="w-full border-0 text-white sm:w-auto"
                style={{ backgroundColor: "var(--menu-accent-dark)" }}
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
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
