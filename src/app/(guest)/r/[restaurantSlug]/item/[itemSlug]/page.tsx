import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Flame, Info, ShieldAlert, Soup, Utensils } from "lucide-react";

import { MenuTagBadge } from "@/components/guest/MenuTagVisual";
import { DemoAwareMenuItemImage } from "@/components/menu/DemoAwareMenuItemImage";
import { Button } from "@/components/ui/button";
import {
  SmartEyebrow,
  SmartMenuLogo,
  SmartPrice,
  SmartSurface,
  getSmartMenuThemeStyle,
} from "@/components/smartmenu/primitives";
import {
  formatLocalizedPrice,
  getGuestCopy,
  localizedAllergenName,
  localizedDescription,
  localizedDietaryTagName,
  localizedIngredients,
  localizedItemField,
  localizedName,
} from "@/lib/guest-menu";
import { getMenuItemBySlug } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

export default async function GuestMenuItemPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string; itemSlug: string }>;
}) {
  const { restaurantSlug, itemSlug } = await params;
  const result = await getMenuItemBySlug(restaurantSlug, itemSlug);

  if (!result) {
    notFound();
  }

  const { item, menu } = result;
  const locale = menu.restaurant.defaultLocale;
  const copy = getGuestCopy(locale);
  const ingredients = localizedIngredients(item, locale);
  const themeStyle = getSmartMenuThemeStyle(menu.restaurant.theme);

  return (
    <main
      className="min-h-screen bg-[var(--paper-light)] text-[var(--ink)]"
      style={themeStyle}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <SmartMenuLogo sublabel={menu.restaurant.name} />
          <Button className="w-full sm:w-auto" variant="ghost" render={<Link href={`/r/${restaurantSlug}`} />}>
            <ArrowLeft data-icon="inline-start" />
            {copy.openMenu}
          </Button>
        </div>

        <article className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--paper)] shadow-[var(--shadow-overlay)] sm:rounded-[28px]">
          <div className="relative min-h-[320px] sm:min-h-[420px]">
            <DemoAwareMenuItemImage
              restaurantSlug={menu.restaurant.slug}
              itemId={item.id}
              itemName={localizedName(item, locale)}
              fallbackUrl={item.imageUrl}
              className="absolute inset-0 h-full w-full"
            />
            <div
              className="absolute inset-0"
              style={{ background: "var(--scrim-bottom)" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <SmartEyebrow className="text-white/75">
                {menu.restaurant.name}
              </SmartEyebrow>
              <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-semibold leading-none sm:text-6xl">
                {localizedName(item, locale)}
              </h1>
              <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-white/90 sm:mt-4 sm:line-clamp-none sm:text-base sm:leading-7">
                {localizedDescription(item, locale)}
              </p>
              <span className="mt-5 inline-flex rounded-full bg-white/95 px-4 py-2 text-[var(--ink)]">
                <SmartPrice>
                  {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
                </SmartPrice>
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:p-7 md:grid-cols-2">
            <SmartSurface className="p-4 sm:p-5 md:col-span-2">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Info className="size-4 text-[var(--accent-dark)]" />
                {copy.explanation}
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {localizedItemField(item, locale, "explanation")}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <SmartEyebrow className="mb-2 text-[var(--muted)]">
                    <Soup className="mr-1 inline size-3.5" />
                    {copy.origin}
                  </SmartEyebrow>
                  <p className="text-sm leading-6">{localizedItemField(item, locale, "origin")}</p>
                </div>
                <div>
                  <SmartEyebrow className="mb-2 text-[var(--muted)]">
                    <Utensils className="mr-1 inline size-3.5" />
                    {copy.tasteProfile}
                  </SmartEyebrow>
                  <p className="text-sm leading-6">
                    {localizedItemField(item, locale, "tasteProfile")}
                  </p>
                </div>
                <div>
                  <SmartEyebrow className="mb-2 text-[var(--muted)]">
                    <Flame className="mr-1 inline size-3.5" />
                    {copy.spiceLevel}
                  </SmartEyebrow>
                  <p className="font-price text-sm font-semibold">{item.spiceLevel}/5</p>
                </div>
              </div>
            </SmartSurface>

            <SmartSurface className="p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Utensils className="size-4 text-[var(--secondary)]" />
                {copy.ingredients}
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex min-h-7 items-center rounded-full border border-[var(--hairline)] bg-white px-3 text-xs text-[var(--ink-soft)]"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {localizedItemField(item, locale, "preparation")}
              </p>
            </SmartSurface>

            <SmartSurface className="p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <BadgeCheck className="size-4 text-[var(--accent-dark)]" />
                {copy.dietary}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.dietaryTags.map((tag) => (
                  <MenuTagBadge
                    key={tag.code}
                    code={tag.code}
                    label={localizedDietaryTagName(tag, locale)}
                  />
                ))}
              </div>
            </SmartSurface>

            <section className="rounded-[var(--radius-lg)] bg-[var(--danger-soft)] p-4 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--danger)_18%,transparent)] sm:p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold text-[var(--danger)]">
                <ShieldAlert className="size-4" />
                {copy.allergens}
              </div>
              <div className="flex flex-col gap-2">
                {item.allergens.map((allergen) => (
                  <div key={allergen.code} className="rounded-[var(--radius-sm)] bg-white p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{localizedAllergenName(allergen, locale)}</span>
                      <span className="font-price text-[10px] uppercase text-[var(--muted)]">
                        {allergen.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    {allergen.note ? (
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{allergen.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                {copy.safetyNotice}
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
