import { notFound } from "next/navigation";
import { Copy, Globe2, PanelTop, QrCode, ShoppingBag, Utensils } from "lucide-react";

import { ManagerPageHeader } from "@/components/dashboard/ManagerPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRestaurantAccess } from "@/lib/auth";
import { getManagerRestaurant } from "@/lib/menu/queries";
import { generateQrDataUrl } from "@/lib/qr/generate";

export const dynamic = "force-dynamic";

export default async function QrPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  await requireRestaurantAccess(restaurantId, "menu:read");
  const data = await getManagerRestaurant(restaurantId);

  if (!data) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/r/${data.restaurant.slug}?source=table-card&table=12`;
  const qrDataUrl = await generateQrDataUrl(url);
  const templates = [
    {
      title: "Table card",
      description: "Best for dine-in guests. Include table codes for aggregate usage.",
      source: "table-card",
      icon: Utensils,
      tone: "bg-emerald-50 text-emerald-800",
    },
    {
      title: "Window sticker",
      description: "Let passers-by preview the menu before entering.",
      source: "window",
      icon: PanelTop,
      tone: "bg-amber-50 text-amber-800",
    },
    {
      title: "Takeaway bag",
      description: "Invite guests back to the current menu after the visit.",
      source: "takeaway",
      icon: ShoppingBag,
      tone: "bg-violet-50 text-violet-800",
    },
    {
      title: "Website",
      description: "Use a clean menu link from Google, Instagram, or your homepage.",
      source: "website",
      icon: Globe2,
      tone: "bg-sky-50 text-sky-800",
    },
  ];

  return (
    <main className="flex flex-col gap-5 p-4 sm:p-6">
      <ManagerPageHeader
        title="QR generator"
        description="Create source-specific QR links for tables, windows, takeaway, and your website without collecting raw IPs or user agents."
        restaurantName={data.restaurant.name}
        restaurantSlug={data.restaurant.slug}
        statusLabel="Attribution ready"
      />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader className="bg-linear-to-r from-amber-50 to-white">
            <QrCode className="text-amber-700" />
            <CardTitle>Table card QR</CardTitle>
            <CardDescription>Source: table-card · Table: 12</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code for the public menu" className="rounded-lg border" />
            <Badge variant="outline" className="w-fit">
              {data.restaurant.slug}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Tracked URL</CardTitle>
            <CardDescription>Use variants for table cards, website, takeaway, and window signage.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <code className="rounded-lg bg-muted p-3 text-sm break-all">{url}</code>
            <Button variant="outline" disabled>
              <Copy data-icon="inline-start" />
              Copy URL
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.source} className="border-0 bg-white shadow-sm ring-1 ring-black/5">
              <CardHeader>
                <span className={`flex size-11 items-center justify-center rounded-xl ${template.tone}`}>
                  <Icon />
                </span>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="block rounded-xl bg-slate-50 p-3 text-xs break-all">
                  {`${baseUrl}/r/${data.restaurant.slug}?source=${template.source}`}
                </code>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
