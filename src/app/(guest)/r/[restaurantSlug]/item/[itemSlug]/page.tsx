import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowLeft, BadgeCheck, Flame, Info, ShieldAlert, Soup, Utensils } from "lucide-react";

import { MenuTagBadge } from "@/components/guest/MenuTagVisual";
import { DemoAwareMenuItemImage } from "@/components/menu/DemoAwareMenuItemImage";
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
  const themeStyle = {
    "--menu-accent": menu.restaurant.theme.accent,
    "--menu-accent-dark": menu.restaurant.theme.accentDark,
    "--menu-accent-soft": menu.restaurant.theme.accentSoft,
    "--menu-secondary": menu.restaurant.theme.secondary,
    "--menu-secondary-soft": menu.restaurant.theme.secondarySoft,
    "--menu-ink": menu.restaurant.theme.ink,
    "--menu-paper": menu.restaurant.theme.paper,
    "--menu-muted": menu.restaurant.theme.muted,
  } as CSSProperties;

  return (
    <main className="min-h-screen" style={{ ...themeStyle, backgroundColor: "var(--menu-paper)" }}>
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/r/${restaurantSlug}`} className="w-fit">
          <Button variant="ghost">
            <ArrowLeft data-icon="inline-start" />
            {copy.openMenu}
          </Button>
        </Link>

        <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-black/5">
          <DemoAwareMenuItemImage
            restaurantSlug={menu.restaurant.slug}
            itemId={item.id}
            itemName={localizedName(item, locale)}
            fallbackUrl={item.imageUrl}
            className="h-72 w-full"
          />
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-3xl">{localizedName(item, locale)}</CardTitle>
                <CardDescription className="mt-2 max-w-2xl text-base leading-7">
                  {localizedDescription(item, locale)}
                </CardDescription>
              </div>
              <div className="font-mono text-lg font-semibold">
                {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border p-4 md:col-span-2" style={{ backgroundColor: "var(--menu-accent-soft)" }}>
              <div className="mb-3 flex items-center gap-2 font-medium">
                <Info />
                {copy.explanation}
              </div>
              <p className="text-sm leading-6 text-foreground/80">
                {localizedItemField(item, locale, "explanation")}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    <Soup className="size-4" />
                    {copy.origin}
                  </div>
                  <p className="text-sm">{localizedItemField(item, locale, "origin")}</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    <Utensils className="size-4" />
                    {copy.tasteProfile}
                  </div>
                  <p className="text-sm">{localizedItemField(item, locale, "tasteProfile")}</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    <Flame className="size-4" />
                    {copy.spiceLevel}
                  </div>
                  <p className="text-sm">{item.spiceLevel}/5</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 font-medium">
                <Utensils />
                {copy.ingredients}
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="outline">
                    {ingredient}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {localizedItemField(item, locale, "preparation")}
              </p>
            </section>

            <section className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 font-medium">
                <BadgeCheck />
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
            </section>

            <section className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 font-medium">
                <ShieldAlert />
                {copy.allergens}
              </div>
              <div className="flex flex-col gap-2">
                {item.allergens.map((allergen) => (
                  <div key={allergen.code} className="rounded-lg bg-muted p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{localizedAllergenName(allergen, locale)}</span>
                      <Badge
                        variant={
                          allergen.verificationStatus === "VERIFIED"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {allergen.status.replaceAll("_", " ")}
                      </Badge>
                    </div>
                    {allergen.note ? (
                      <p className="mt-1 text-xs text-muted-foreground">{allergen.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {copy.safetyNotice}
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
