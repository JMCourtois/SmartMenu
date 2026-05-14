import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Globe2,
  History,
  Plus,
  ShieldAlert,
  Sparkles,
  Utensils,
} from "lucide-react";

import {
  createCategoryAction,
  createMenuItemAction,
  publishDraftAction,
  restoreVersionAction,
  upsertTranslationAction,
} from "@/app/(manager)/dashboard/actions";
import { MenuItemImageOpenButton } from "@/components/dashboard/MenuItemImageOpenButton";
import { MenuItemImageUploadForm } from "@/components/dashboard/MenuItemImageUploadForm";
import { ManagerPageHeader } from "@/components/dashboard/ManagerPageHeader";
import { ManagerStatusCard } from "@/components/dashboard/ManagerStatusCard";
import { DemoAwareMenuItemImage } from "@/components/menu/DemoAwareMenuItemImage";
import { QuickActionPanel } from "@/components/dashboard/QuickActionPanel";
import { SetupChecklist } from "@/components/dashboard/SetupChecklist";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { hasDatabaseUrl } from "@/lib/db";
import { getManagerRestaurant } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default async function MenuManagerPage({
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

  const createCategory = createCategoryAction.bind(null, restaurantId);
  const createItem = createMenuItemAction.bind(null, restaurantId);
  const upsertTranslation = upsertTranslationAction.bind(null, restaurantId);
  const publishDraft = publishDraftAction.bind(null, restaurantId);
  const restoreVersion = restoreVersionAction.bind(null, restaurantId);
  const isDemo = !hasDatabaseUrl();
  const draftItems = data.draftVersion.categories.flatMap((category) => category.items);
  const allergenWarningCount = draftItems.filter((item) =>
    item.allergens.some((allergen) => allergen.verificationStatus !== "VERIFIED"),
  ).length;
  const translatedItems = draftItems.filter((item) =>
    item.translations.some((translation) => translation.locale === "en"),
  ).length;
  const translationPercent = Math.round((translatedItems / Math.max(draftItems.length, 1)) * 100);
  const soldOutCount = draftItems.filter((item) => !item.isAvailable).length;

  return (
    <main className="flex flex-col gap-5">
      <ManagerPageHeader
        title="Menu operations"
        description="Manage the structured draft menu, check translation and allergen readiness, then publish only when the public QR menu is ready."
        restaurantName={data.restaurant.name}
        restaurantSlug={data.restaurant.slug}
        draftLabel={`Draft v${data.draftVersion.version}`}
        primaryAction={
          <form action={publishDraft}>
            <input type="hidden" name="menuVersionId" value={data.draftVersion.id} />
            <Button type="submit" disabled={isDemo}>
              <CheckCircle2 data-icon="inline-start" />
              Publish draft
            </Button>
          </form>
        }
      />

      {isDemo ? (
        <Alert className="border-[var(--hairline)] bg-[var(--secondary-soft)] text-[var(--accent-dark)]">
          <AlertTriangle />
          <AlertTitle>Demo mode</AlertTitle>
          <AlertDescription>
            Configure `DATABASE_URL`, `DIRECT_URL`, and Clerk keys to persist
            manager changes. The public menu and dashboard are using seeded demo
            data right now.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ManagerStatusCard
          label="Draft items"
          value={String(draftItems.length)}
          helper={`${data.draftVersion.categories.length} menu sections are ready to review.`}
          icon={Utensils}
          tone="green"
        />
        <ManagerStatusCard
          label="Translation coverage"
          value={`${translationPercent}%`}
          helper={`${translatedItems} of ${draftItems.length} items have English guest copy.`}
          icon={Globe2}
          tone="blue"
        />
        <ManagerStatusCard
          label="Allergen warnings"
          value={String(allergenWarningCount)}
          helper="Safety-sensitive data should be checked before publishing."
          icon={ShieldAlert}
          tone={allergenWarningCount > 0 ? "rose" : "green"}
        />
        <ManagerStatusCard
          label="Sold out"
          value={String(soldOutCount)}
          helper="Staff can use availability to guide the guest menu."
          icon={ChefHat}
          tone="amber"
        />
      </section>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-w-0 flex-col gap-4">
          {data.draftVersion.categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="border-b border-[var(--hairline-soft)] bg-[var(--paper-warm)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="flex min-w-0 items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-dark)] font-price text-sm text-white">
                        {category.sortOrder}
                      </span>
                      <span className="min-w-0 truncate">{category.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {category.items.length} draft items · shown on the public QR menu after publish
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Section {category.sortOrder}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {category.items.map((item) => (
                  <div key={item.id} className="min-w-0 rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3 shadow-[var(--ring-hairline)]">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
                        <DemoAwareMenuItemImage
                          restaurantSlug={data.restaurant.slug}
                          itemId={item.id}
                          itemName={item.name}
                          fallbackUrl={item.imageUrl}
                          className="h-28 w-full shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-white shadow-[var(--ring-hairline)] sm:w-36"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{item.name}</h3>
                            {item.isPromoted ? (
                              <Badge variant="secondary">Promoted</Badge>
                            ) : null}
                            {!item.isAvailable ? (
                              <Badge variant="destructive">Sold out</Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <Badge variant="outline">
                              EN {item.translations.some((entry) => entry.locale === "en") ? "ready" : "missing"}
                            </Badge>
                            {item.allergens.map((allergen) => (
                              <Badge
                                key={allergen.code}
                                variant={
                                  allergen.verificationStatus === "VERIFIED"
                                    ? "outline"
                                    : "destructive"
                                }
                              >
                                {allergen.name}: {allergen.status.replaceAll("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                        <div className="font-price text-sm font-semibold">
                          {formatPrice(item.priceCents, data.restaurant.currency)}
                        </div>
                        <MenuItemImageOpenButton
                          restaurantSlug={data.restaurant.slug}
                          itemId={item.id}
                          fallbackUrl={item.imageUrl}
                        />
                      </div>
                    </div>
                    <MenuItemImageUploadForm
                      restaurantId={restaurantId}
                      restaurantSlug={data.restaurant.slug}
                      menuItemId={item.id}
                      itemName={item.name}
                      demoMode={isDemo}
                    />
                    <form action={upsertTranslation} className="mt-3 grid min-w-0 gap-2 rounded-[var(--radius-md)] bg-white p-2 shadow-[var(--ring-hairline)] md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.5fr)_auto]">
                      <input type="hidden" name="menuItemId" value={item.id} />
                      <Input name="locale" defaultValue="en" aria-label="Locale" disabled={isDemo} />
                      <Input
                        name="name"
                        placeholder="English name"
                        defaultValue={item.translations.find((entry) => entry.locale === "en")?.name ?? ""}
                        disabled={isDemo}
                      />
                      <Input
                        name="description"
                        placeholder="English description"
                        defaultValue={item.translations.find((entry) => entry.locale === "en")?.description ?? ""}
                        disabled={isDemo}
                      />
                      <Button type="submit" variant="outline" disabled={isDemo}>
                        Save
                      </Button>
                    </form>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        <aside className="min-w-0 flex flex-col gap-4">
          <SetupChecklist
            items={[
              {
                label: "Review allergen-sensitive items",
                done: allergenWarningCount === 0,
                helper: "Guests see safety notes, but staff verification still matters.",
              },
              {
                label: "Check English translation coverage",
                done: translationPercent === 100,
                helper: "English is the first pilot language for international guests.",
              },
              {
                label: "Preview public QR menu",
                done: true,
                helper: "Use both photo and classic views before publishing.",
              },
              {
                label: "Publish draft when ready",
                done: data.publishedVersion?.version === data.draftVersion.version,
                helper: "Publishing archives the previous public version.",
              },
            ]}
          />

          <QuickActionPanel
            actions={[
              {
                title: "Use AI to rewrite or translate",
                description: "Create a proposal, review the diff, then apply to draft.",
                action: (
                  <Button
                    variant="secondary"
                    className="w-full"
                    render={<Link href={`/dashboard/restaurants/${restaurantId}/ai-editor`} />}
                  >
                    <Sparkles data-icon="inline-start" />
                    Open AI editor
                  </Button>
                ),
              },
              {
                title: "Preview the public menu",
                description: "Check how guests see photos, classic menu, filters, and AI.",
                action: (
                  <Button
                    variant="outline"
                    className="w-full bg-white text-[var(--ink)] hover:bg-white/90"
                    render={<Link href={`/r/${data.restaurant.slug}`} target="_blank" />}
                  >
                    Preview QR menu
                  </Button>
                ),
              },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Add category</CardTitle>
              <CardDescription>Create a new section in the current draft.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createCategory} className="flex flex-col gap-3">
                <input type="hidden" name="menuVersionId" value={data.draftVersion.id} />
                <Input name="name" placeholder="Desserts" disabled={isDemo} />
                <Button type="submit" disabled={isDemo}>
                  <Plus data-icon="inline-start" />
                  Add category
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add dish</CardTitle>
              <CardDescription>Manual edits are always written to the draft.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createItem} className="flex flex-col gap-3">
                <select
                  name="categoryId"
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
                  disabled={isDemo}
                >
                  {data.draftVersion.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Input name="name" placeholder="Dish name" disabled={isDemo} />
                <Input
                  name="priceCents"
                  type="number"
                  min="0"
                  placeholder="Price in cents"
                  disabled={isDemo}
                />
                <Textarea name="description" placeholder="Short description" disabled={isDemo} />
                <Input name="imageUrl" placeholder="Image URL" disabled={isDemo} />
                <p className="text-xs text-muted-foreground">
                  After creating a dish, upload a replacement photo directly from the item row.
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <input name="isAvailable" type="checkbox" defaultChecked disabled={isDemo} />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input name="isPromoted" type="checkbox" disabled={isDemo} />
                  Promoted
                </label>
                <Button type="submit" disabled={isDemo}>
                  <Plus data-icon="inline-start" />
                  Add dish
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version history</CardTitle>
              <CardDescription>Restore any previous version as a new draft.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {data.versions.map((version) => (
                <form
                  key={version.id}
                  action={restoreVersion}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <input type="hidden" name="menuVersionId" value={version.id} />
                  <div>
                    <div className="font-medium">v{version.version}</div>
                    <div className="text-xs text-muted-foreground">{version.status}</div>
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isDemo || version.status === "DRAFT"}
                  >
                    <History data-icon="inline-start" />
                    Restore
                  </Button>
                </form>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
