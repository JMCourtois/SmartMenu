import { notFound } from "next/navigation";
import { Globe2, Palette, ShieldCheck, Store } from "lucide-react";

import { ManagerPageHeader } from "@/components/dashboard/ManagerPageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireRestaurantAccess } from "@/lib/auth";
import { getLocaleOption, localeOptions } from "@/lib/guest-menu";
import { getManagerRestaurant } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  await requireRestaurantAccess(restaurantId, "restaurant:read");
  const data = await getManagerRestaurant(restaurantId);

  if (!data) {
    notFound();
  }
  const defaultLocale = getLocaleOption(data.restaurant.defaultLocale);

  return (
    <main className="flex flex-col gap-5">
      <ManagerPageHeader
        title="Restaurant settings"
        description="Defaults that shape the public QR menu, guest language selector, branding, and safety copy."
        restaurantName={data.restaurant.name}
        restaurantSlug={data.restaurant.slug}
        statusLabel="Read-only MVP"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="border-b border-[var(--hairline-soft)] bg-[var(--paper-warm)]">
            <Globe2 className="text-[var(--accent-dark)]" />
            <CardTitle>Locale</CardTitle>
            <CardDescription>Language and currency defaults.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3 shadow-[var(--ring-hairline)]">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Default language
              </div>
              <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
                <span>{defaultLocale.flag}</span>
                {defaultLocale.nativeLabel}
              </div>
            </div>
            <Input value={data.restaurant.currency} readOnly />
            <div className="flex flex-wrap gap-1.5">
              {localeOptions.map((locale) => (
                <Badge key={locale.code} variant="outline" className="gap-1">
                  <span>{locale.flag}</span>
                  {locale.nativeLabel}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-[var(--hairline-soft)] bg-[var(--paper-warm)]">
            <Palette className="text-[var(--accent-dark)]" />
            <CardTitle>Brand</CardTitle>
            <CardDescription>Used for future QR assets and menu theming.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input value={data.restaurant.name} readOnly />
            <Input value={data.restaurant.brandColor} readOnly />
            <div className="flex gap-2">
              <span
                className="size-9 rounded-[var(--radius-md)] shadow-[var(--ring-hairline)]"
                style={{ backgroundColor: data.restaurant.brandColor }}
              />
              <span className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--ink)] text-white">
                <Store className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-[var(--hairline-soft)] bg-[var(--paper-warm)]">
            <ShieldCheck className="text-[var(--secondary)]" />
            <CardTitle>Legal notice</CardTitle>
            <CardDescription>Shown on the public allergen panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={data.restaurant.legalNotice ?? ""} readOnly />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
