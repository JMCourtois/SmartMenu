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
    <main className="flex flex-col gap-5 p-4 sm:p-6">
      <ManagerPageHeader
        title="Restaurant settings"
        description="Defaults that shape the public QR menu, guest language selector, branding, and safety copy."
        restaurantName={data.restaurant.name}
        restaurantSlug={data.restaurant.slug}
        statusLabel="Read-only MVP"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader className="bg-linear-to-r from-sky-50 to-white">
            <Globe2 className="text-sky-700" />
            <CardTitle>Locale</CardTitle>
            <CardDescription>Language and currency defaults.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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

        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader className="bg-linear-to-r from-emerald-50 to-white">
            <Palette className="text-emerald-700" />
            <CardTitle>Brand</CardTitle>
            <CardDescription>Used for future QR assets and menu theming.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input value={data.restaurant.name} readOnly />
            <Input value={data.restaurant.brandColor} readOnly />
            <div className="flex gap-2">
              <span
                className="size-9 rounded-xl shadow-sm ring-1 ring-black/10"
                style={{ backgroundColor: data.restaurant.brandColor }}
              />
              <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Store className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader className="bg-linear-to-r from-amber-50 to-white">
            <ShieldCheck className="text-amber-700" />
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
