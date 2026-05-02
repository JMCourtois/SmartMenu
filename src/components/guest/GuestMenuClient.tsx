"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Camera,
  ChevronDown,
  MessageCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Utensils,
} from "lucide-react";

import { AiConciergeWidget } from "@/components/guest/AiConciergeWidget";
import { ClassicMenuView } from "@/components/guest/ClassicMenuView";
import { DishInfoDialog } from "@/components/guest/DishInfoDialog";
import { MenuTagIcon } from "@/components/guest/MenuTagVisual";
import { PhotoMenuView } from "@/components/guest/PhotoMenuView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  filterMenuCategories,
  formatLocalizedPrice,
  getAllMenuItems,
  getGuestCopy,
  getLocaleOption,
  getRecommendations,
  localizedCategoryName,
  localizedName,
  localizedItemField,
  localizedRestaurantField,
  localeOptions,
  normalizeMenuDisplayMode,
  normalizeLocale,
  quickIntents,
} from "@/lib/guest-menu";
import {
  getDemoMenuImageOverrides,
  subscribeDemoImageOverrides,
} from "@/lib/demo-image-overrides";
import { readGuestPreferences, writeGuestPreferences } from "@/lib/guest-preferences";
import { cn } from "@/lib/utils";
import type { MenuDisplayMode, MenuItemView, RestaurantMenuView } from "@/types/menu";
import type { LocaleCode } from "@/lib/guest-menu";

type Props = {
  menu: RestaurantMenuView;
  source?: string;
  tableCode?: string;
  initialView?: string;
};

async function getSessionIdHash() {
  const key = "smartmenu.sessionHash";
  const existing = window.sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const seed = crypto.randomUUID();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  window.sessionStorage.setItem(key, hash);
  return hash;
}

function setViewQueryParam(viewMode: MenuDisplayMode) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", viewMode);
  window.history.replaceState(null, "", url.toString());
}

export function GuestMenuClient({ menu, source, tableCode, initialView }: Props) {
  const [locale, setLocale] = useState<LocaleCode>(() => {
    if (typeof window !== "undefined") {
      const stored = readGuestPreferences(window.sessionStorage, menu.restaurant.slug);
      if (stored.language) return normalizeLocale(stored.language);
    }
    return normalizeLocale(menu.restaurant.defaultLocale);
  });
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<MenuDisplayMode>(() => {
    if (typeof window !== "undefined") {
      const stored = readGuestPreferences(window.sessionStorage, menu.restaurant.slug);
      if (stored.displayMode) return stored.displayMode;
    }
    return normalizeMenuDisplayMode(initialView);
  });
  const [selectedItem, setSelectedItem] = useState<MenuItemView | null>(null);
  const [dishInfoOpen, setDishInfoOpen] = useState(false);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [conciergeSeed, setConciergeSeed] = useState<{
    id: number;
    question: string;
    focusItemId?: string;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadImageOverrides() {
      try {
        const overrides = await getDemoMenuImageOverrides(menu.restaurant.slug);
        if (active) {
          setImageOverrides(overrides);
        }
      } catch {
        if (active) {
          setImageOverrides({});
        }
      }
    }

    loadImageOverrides();
    const unsubscribe = subscribeDemoImageOverrides((detail) => {
      if (!detail || detail.restaurantSlug === menu.restaurant.slug) {
        loadImageOverrides();
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [menu.restaurant.slug]);

  const displayMenu = useMemo<RestaurantMenuView>(() => {
    if (!Object.keys(imageOverrides).length) {
      return menu;
    }

    return {
      ...menu,
      version: {
        ...menu.version,
        categories: menu.version.categories.map((category) => ({
          ...category,
          items: category.items.map((item) => ({
            ...item,
            imageUrl: imageOverrides[item.id] ?? item.imageUrl,
          })),
        })),
      },
    };
  }, [imageOverrides, menu]);

  const allItems = useMemo(() => getAllMenuItems(displayMenu), [displayMenu]);
  const copy = getGuestCopy(locale);
  const currentLocale = getLocaleOption(locale);
  const restaurantCuisine = localizedRestaurantField(displayMenu.restaurant, locale, "cuisine");
  const restaurantDescription = localizedRestaurantField(displayMenu.restaurant, locale, "description");
  const restaurantLegalNotice = localizedRestaurantField(displayMenu.restaurant, locale, "legalNotice");

  const filteredCategories = useMemo(
    () =>
      filterMenuCategories({
        categories: displayMenu.version.categories,
        query,
        intent,
        locale,
      }),
    [intent, locale, displayMenu.version.categories, query],
  );

  const visibleItems = useMemo(
    () => filteredCategories.flatMap((category) => category.items),
    [filteredCategories],
  );

  const recommendations = useMemo(
    () =>
      getRecommendations({
        items: allItems,
        intent,
        limit: 4,
      }),
    [allItems, intent],
  );

  const selectedDisplayItem = useMemo(() => {
    if (!selectedItem) {
      return null;
    }

    return allItems.find((item) => item.id === selectedItem.id) ?? selectedItem;
  }, [allItems, selectedItem]);

  async function track(eventType: string, metadata?: Record<string, unknown>) {
    const sessionIdHash = await getSessionIdHash();
    void fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: menu.restaurant.id,
        eventType,
        locale,
        source,
        tableCode,
        sessionIdHash,
        metadata,
      }),
    });
  }

  useEffect(() => {
    void track("MENU_VIEWED", { path: window.location.pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.restaurant.slug]);

  useEffect(() => {
    const current = readGuestPreferences(window.sessionStorage, menu.restaurant.slug);
    writeGuestPreferences(window.sessionStorage, menu.restaurant.slug, {
      ...current,
      language: locale,
      displayMode: viewMode,
    });
  }, [locale, menu.restaurant.slug, viewMode]);

  function selectIntent(value: string) {
    const next = intent === value ? null : value;
    setIntent(next);
    void track("FILTER_USED", { filter: value });
    if (next) {
      void track("RECOMMENDATION_SHOWN", {
        intent: value,
        itemIds: getRecommendations({ items: allItems, intent: value, limit: 4 }).map(
          (item) => item.id,
        ),
      });
    }
  }

  function changeView(nextViewMode: MenuDisplayMode) {
    setViewMode(nextViewMode);
    setViewQueryParam(nextViewMode);
  }

  function changeLocale(nextLocale: LocaleCode) {
    setLocale(nextLocale);
    void track("LANGUAGE_SELECTED", { fromLocale: locale, toLocale: nextLocale });
  }

  function openDishInfo(item: MenuItemView) {
    setSelectedItem(item);
    setDishInfoOpen(true);
    void track("ALLERGEN_INFO_VIEWED", { itemSlug: item.slug });
  }

  function askAi(question: string, focusItemId?: string) {
    setConciergeSeed({
      id: Date.now(),
      question,
      focusItemId,
    });
    void track("ASSISTANT_OPENED", { entryPoint: "inline-cta" });
  }

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
      <section className="relative overflow-hidden border-b">
        {menu.restaurant.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={menu.restaurant.heroImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-18"
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--menu-accent-soft) 88%, white), color-mix(in srgb, var(--menu-secondary-soft) 72%, white))",
          }}
        />
        <div className="absolute right-4 top-4 z-10 sm:right-6 lg:right-8">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-full bg-white/90 px-2.5 text-base shadow-sm ring-1 ring-black/5 backdrop-blur hover:bg-white"
                  aria-label={copy.chooseLanguage}
                />
              }
            >
              <span className="text-xl leading-none">{currentLocale.flag}</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white p-2">
              {localeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  className="cursor-pointer gap-3 rounded-lg px-3 py-2"
                  onClick={() => changeLocale(option.code)}
                >
                  <span className="text-2xl leading-none">{option.flag}</span>
                  <span className="flex flex-col">
                    <span className="font-medium">{option.nativeLabel}</span>
                    <span className="text-xs text-muted-foreground">{option.label}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-6 pt-16 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="border-0 text-white" style={{ backgroundColor: "var(--menu-accent)" }}>
                  {restaurantCuisine}
                </Badge>
                <Badge variant="outline" className="bg-white/70">
                  {menu.restaurant.city}
                </Badge>
                <Badge variant="outline" className="bg-white/70">
                  {allItems.length} · {copy.explanation}
                </Badge>
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-normal sm:text-6xl" style={{ color: "var(--menu-ink)" }}>
                {menu.restaurant.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: "var(--menu-muted)" }}>
                {restaurantDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  size="lg"
                  className="border-0 text-white"
                  style={{ backgroundColor: "var(--menu-accent)" }}
                  onClick={() =>
                    askAi(copy.ai.demoPrompts[0]?.prompt ?? copy.getRecommendation)
                  }
                >
                  <Sparkles data-icon="inline-start" />
                  {copy.getRecommendation}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setIntent("traditional")}>
                  <Utensils data-icon="inline-start" />
                  {copy.showSignatureDishes}
                </Button>
              </div>
            </div>

            <div className="self-start rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <div className="grid grid-cols-2 rounded-full bg-muted/80 p-1">
                <Button
                  variant={viewMode === "photo" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => changeView("photo")}
                >
                  <Camera data-icon="inline-start" />
                  {copy.photoView}
                </Button>
                <Button
                  variant={viewMode === "classic" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => changeView("classic")}
                >
                  <BookOpen data-icon="inline-start" />
                  {copy.classicView}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-12 rounded-2xl border-0 bg-white/90 pl-10 shadow-sm ring-1 ring-black/5"
              />
            </div>
            <Button
              variant="secondary"
              className="h-12 rounded-2xl"
              onClick={() => askAi(copy.ai.demoPrompts[0]?.prompt ?? copy.getRecommendation)}
            >
              <MessageCircle data-icon="inline-start" />
              {copy.getRecommendation}
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <span className="inline-flex shrink-0 items-center rounded-full bg-white/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.quickFilters}
            </span>
            {quickIntents.map((quickIntent) => {
              return (
                <Button
                  key={quickIntent.value}
                  variant={intent === quickIntent.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "shrink-0 rounded-full bg-white/80",
                    intent === quickIntent.value && "border-0 text-white",
                  )}
                  style={
                    intent === quickIntent.value
                      ? { backgroundColor: "var(--menu-accent)" }
                      : undefined
                  }
                  onClick={() => selectIntent(quickIntent.value)}
                >
                  <MenuTagIcon
                    code={quickIntent.value}
                    className="size-5 border-0 bg-transparent text-current"
                  />
                  {copy.intents[quickIntent.value]}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filteredCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:bg-white"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "var(--menu-secondary)" }}
                />
                {localizedCategoryName(category, locale)}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          {viewMode === "photo" ? (
            <PhotoMenuView
              categories={filteredCategories}
              menu={displayMenu}
              locale={locale}
              onTrack={track}
              onSelectItem={openDishInfo}
              onAskAi={askAi}
            />
          ) : (
            <ClassicMenuView
              categories={filteredCategories}
              menu={displayMenu}
              locale={locale}
              onTrack={track}
              onSelectItem={openDishInfo}
              onAskAi={askAi}
            />
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="overflow-hidden border-0 bg-white/90 shadow-sm ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles style={{ color: "var(--menu-secondary)" }} />
                {copy.recommendedNow}
              </CardTitle>
              <CardDescription>{copy.recommendedDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recommendations.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="rounded-2xl border p-3 text-left transition hover:bg-muted/60"
                  onClick={() => openDishInfo(item)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{localizedName(item, locale)}</div>
                    <div className="font-mono text-xs">
                      {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {localizedItemField(item, locale, "tasteProfile")}
                  </p>
                  {item.pairings[0] ? (
                    <p className="mt-2 text-xs" style={{ color: "var(--menu-accent-dark)" }}>
                      {copy.pairings}: {item.pairings[0].pairedItemName}.
                    </p>
                  ) : null}
                </button>
              ))}
              <Button
                className="mt-1 border-0 text-white"
                style={{ backgroundColor: "var(--menu-accent)" }}
                onClick={() => askAi(copy.ai.demoPrompts[0]?.prompt ?? copy.getRecommendation)}
              >
                <MessageCircle data-icon="inline-start" />
                {copy.getRecommendation}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 shadow-sm ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert style={{ color: "var(--menu-secondary)" }} />
                {copy.allergens}
              </CardTitle>
              <CardDescription>{restaurantLegalNotice || copy.safetyNotice}</CardDescription>
            </CardHeader>
          </Card>
        </aside>
      </div>

      <DishInfoDialog
        item={selectedDisplayItem}
        menu={displayMenu}
        locale={locale}
        open={dishInfoOpen}
        onOpenChange={setDishInfoOpen}
        onAskAi={askAi}
      />

      <AiConciergeWidget
        menu={displayMenu}
        locale={locale}
        visibleItems={visibleItems}
        seedRequest={conciergeSeed}
        onSeedConsumed={() => setConciergeSeed(null)}
        onTrack={track}
      />
    </main>
  );
}
