"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Camera,
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

import { AiConciergeWidget } from "@/components/guest/AiConciergeWidget";
import { ClassicMenuView } from "@/components/guest/ClassicMenuView";
import { DishInfoDialog } from "@/components/guest/DishInfoDialog";
import { MenuTagIcon } from "@/components/guest/MenuTagVisual";
import { PhotoMenuView } from "@/components/guest/PhotoMenuView";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SmartEyebrow,
  SmartMenuLogo,
  SmartSurface,
  getSmartMenuThemeStyle,
} from "@/components/smartmenu/primitives";
import {
  filterMenuCategories,
  formatLocalizedPrice,
  getAllMenuItems,
  getGuestCopy,
  getLocaleOption,
  getRecommendations,
  localizedCategoryName,
  localizedItemField,
  localizedName,
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
import { withBasePath } from "@/lib/base-path";
import { readGuestPreferences, writeGuestPreferences } from "@/lib/guest-preferences";
import { cn } from "@/lib/utils";
import type { MenuDisplayMode, MenuItemView, RestaurantMenuView } from "@/types/menu";
import type { LocaleCode, QuickIntentValue } from "@/lib/guest-menu";

type Props = {
  menu: RestaurantMenuView;
  source?: string;
  tableCode?: string;
  initialView?: string;
};

type BarMode = "nav" | "search" | "filter" | "more";

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
  const [intent, setIntent] = useState<QuickIntentValue | null>(null);
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
  const [barMode, setBarMode] = useState<BarMode>("nav");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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
  const activeCategoryId =
    activeCategory && filteredCategories.some((category) => category.id === activeCategory)
      ? activeCategory
      : (filteredCategories[0]?.id ?? null);

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
    void fetch(withBasePath("/api/track-event"), {
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

  useEffect(() => {
    if (!filteredCategories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveCategory(visible[0].target.id);
        }
      },
      { rootMargin: "-90px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const category of filteredCategories) {
      const element = document.getElementById(category.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [filteredCategories, viewMode]);

  function selectIntent(value: QuickIntentValue) {
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
    void track("ITEM_VIEWED", { itemSlug: item.slug, presentation: "dialog" });
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

  const themeStyle = getSmartMenuThemeStyle(menu.restaurant.theme);

  return (
    <main
      className="min-h-screen bg-[var(--paper-light)] text-[var(--ink)]"
      style={themeStyle}
    >
      <section className="bg-[var(--paper-light)]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <SmartMenuLogo
              sublabel={tableCode ? `Table ${tableCode}` : "QR menu"}
              className="min-w-0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="smart-focus inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)]"
                    aria-label={copy.chooseLanguage}
                  />
                }
              >
                <span className="text-base leading-none">{currentLocale.flag}</span>
                <span className="hidden sm:inline">{currentLocale.nativeLabel}</span>
                <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-[var(--radius-lg)] bg-white p-2">
                {localeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.code}
                    className="cursor-pointer gap-3 rounded-[var(--radius-md)] px-3 py-2"
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

          <div className="mx-auto mt-10 max-w-3xl pb-3 text-center sm:mt-20 sm:pb-4">
            <SmartEyebrow>
              {restaurantCuisine} · {displayMenu.restaurant.city}
            </SmartEyebrow>
            <h1 className="mt-4 text-balance font-display text-[clamp(3rem,17vw,4.75rem)] font-medium leading-none text-[var(--theme-ink)] sm:mt-5 sm:text-[clamp(3.5rem,9vw,5.5rem)]">
              {displayMenu.restaurant.name}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl font-display text-lg italic leading-snug text-[var(--ink-soft)] sm:mt-4 sm:text-2xl">
              {restaurantDescription}
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-y border-[var(--hairline-soft)] bg-[color-mix(in_srgb,var(--paper-light)_88%,white)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center gap-x-3 gap-y-0 px-3 sm:flex-nowrap sm:gap-4 sm:px-6 lg:px-10">
          <div className="min-w-0 flex-1 basis-full sm:basis-auto">
            {barMode === "search" ? (
              <SearchRow
                query={query}
                setQuery={setQuery}
                onClose={() => setBarMode("nav")}
                onAskAi={(question) => {
                  askAi(question);
                  setBarMode("nav");
                }}
                placeholder={copy.searchPlaceholder}
                askLabel={copy.guideMe}
              />
            ) : (
              <CategoryNav
                categories={filteredCategories}
                activeCategory={activeCategoryId}
                locale={locale}
                onPick={(categoryId) => {
                  setActiveCategory(categoryId);
                  document.getElementById(categoryId)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 py-2 sm:ml-0 sm:py-0">
            <ToolIcon
              label={copy.searchPlaceholder}
              active={barMode === "search"}
              badge={query ? "•" : null}
              onClick={() => setBarMode(barMode === "search" ? "nav" : "search")}
            >
              <Search className="size-4" />
            </ToolIcon>
            <ToolIcon
              label={copy.quickFilters}
              active={barMode === "filter"}
              badge={intent ? "1" : null}
              onClick={() => setBarMode(barMode === "filter" ? "nav" : "filter")}
            >
              <SlidersHorizontal className="size-4" />
            </ToolIcon>
            <ViewToggle viewMode={viewMode} onChange={changeView} copy={copy} />
            <ToolIcon
              label="More"
              active={barMode === "more"}
              onClick={() => setBarMode(barMode === "more" ? "nav" : "more")}
            >
              <MoreHorizontal className="size-4" />
            </ToolIcon>
          </div>
        </div>

        {barMode === "filter" ? (
          <FilterPanel
            copy={copy}
            activeIntent={intent}
            onSelectIntent={selectIntent}
            onReset={() => setIntent(null)}
          />
        ) : null}
        {barMode === "more" ? (
          <MorePanel
            copy={copy}
            onAskAi={() => {
              askAi(copy.ai.demoPrompts[0]?.prompt ?? copy.getRecommendation);
              setBarMode("nav");
            }}
            onShowSignature={() => {
              selectIntent("traditional");
              setBarMode("nav");
            }}
            onAskSafety={() => {
              askAi(copy.safetyNotice);
              setBarMode("nav");
            }}
          />
        ) : null}
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-10">
        <div className="min-w-0">
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

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <SmartSurface className="p-5" as="aside">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent-dark)]">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0">
                <SmartEyebrow className="text-[var(--muted)]">
                  {copy.recommendedNow}
                </SmartEyebrow>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
                  {copy.recommendedDescription}
                </h2>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {recommendations.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3 text-left transition hover:bg-[var(--accent-soft)]"
                  onClick={() => openDishInfo(item)}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="line-clamp-1 text-sm font-semibold">
                      {localizedName(item, locale)}
                    </span>
                    <span className="font-price text-xs font-semibold">
                      {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
                    </span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[var(--muted)]">
                    {localizedItemField(item, locale, "tasteProfile")}
                  </span>
                </button>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => askAi(copy.ai.demoPrompts[0]?.prompt ?? copy.getRecommendation)}
            >
              <MessageCircle data-icon="inline-start" />
              {copy.getRecommendation}
            </Button>
          </SmartSurface>

          <SmartSurface className="p-5" as="aside">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--danger-soft)] text-[var(--danger)]">
                <ShieldAlert className="size-4" />
              </span>
              <div className="min-w-0">
                <SmartEyebrow className="text-[var(--muted)]">
                  {copy.allergens}
                </SmartEyebrow>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {restaurantLegalNotice || copy.safetyNotice}
                </p>
              </div>
            </div>
          </SmartSurface>
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

function CategoryNav({
  categories,
  activeCategory,
  locale,
  onPick,
}: {
  categories: RestaurantMenuView["version"]["categories"];
  activeCategory: string | null;
  locale: string;
  onPick: (categoryId: string) => void;
}) {
  if (!categories.length) {
    return null;
  }

  return (
    <nav className="flex items-center gap-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-7 [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const active = activeCategory === category.id;

        return (
          <a
            key={category.id}
            href={`#${category.id}`}
            className={cn(
              "smart-eyebrow relative inline-flex shrink-0 py-4 text-[var(--muted)] no-underline transition hover:text-[var(--ink)] sm:py-6",
              active && "text-[var(--ink)]",
            )}
            onClick={(event) => {
              event.preventDefault();
              onPick(category.id);
            }}
          >
            {localizedCategoryName(category, locale)}
            {active ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--accent)]" />
            ) : null}
          </a>
        );
      })}
    </nav>
  );
}

function SearchRow({
  query,
  setQuery,
  onClose,
  onAskAi,
  placeholder,
  askLabel,
}: {
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
  onAskAi: (question: string) => void;
  placeholder: string;
  askLabel: string;
}) {
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    if (value.length > 18 || /\?|how|what|which|recommend|suggest|guide|help/i.test(value)) {
      onAskAi(value);
    }
  }

  return (
    <form onSubmit={submit} className="flex min-h-16 min-w-0 items-center gap-2 sm:gap-3">
      <Search className="size-4 shrink-0 text-[var(--muted)]" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-14 min-w-0 flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] sm:h-16 sm:text-[15px]"
      />
      {query ? (
        <button
          type="button"
          className="smart-focus rounded-full bg-[color-mix(in_srgb,var(--ink)_6%,transparent)] px-3 py-1.5 text-xs text-[var(--muted)]"
          onClick={() => setQuery("")}
        >
          Clear
        </button>
      ) : null}
      <Button type="submit" size="sm" disabled={!query.trim()}>
        <Sparkles data-icon="inline-start" />
        <span className="hidden sm:inline">{askLabel}</span>
      </Button>
      <button
        type="button"
        className="smart-focus grid size-8 place-items-center rounded-full text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)]"
        onClick={onClose}
        aria-label="Close search"
      >
        <X className="size-4" />
      </button>
    </form>
  );
}

function ToolIcon({
  children,
  label,
  active,
  badge,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "smart-focus relative grid size-9 place-items-center rounded-full text-[var(--ink-soft)] transition hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)]",
        active && "bg-[var(--accent-soft)] text-[var(--accent-dark)]",
      )}
      onClick={onClick}
    >
      {children}
      {badge ? (
        <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 font-price text-[10px] font-semibold leading-4 text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function ViewToggle({
  viewMode,
  onChange,
  copy,
}: {
  viewMode: MenuDisplayMode;
  onChange: (mode: MenuDisplayMode) => void;
  copy: ReturnType<typeof getGuestCopy>;
}) {
  return (
    <div className="mx-1 inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] p-1">
      <button
        type="button"
        aria-label={copy.photoView}
        title={copy.photoView}
        className={cn(
          "smart-focus grid size-8 place-items-center rounded-full text-[var(--muted)]",
          viewMode === "photo" && "bg-white text-[var(--ink)] shadow-[var(--ring-hairline)]",
        )}
        onClick={() => onChange("photo")}
      >
        <Camera className="size-4" />
      </button>
      <button
        type="button"
        aria-label={copy.classicView}
        title={copy.classicView}
        className={cn(
          "smart-focus grid size-8 place-items-center rounded-full text-[var(--muted)]",
          viewMode === "classic" && "bg-white text-[var(--ink)] shadow-[var(--ring-hairline)]",
        )}
        onClick={() => onChange("classic")}
      >
        <BookOpen className="size-4" />
      </button>
    </div>
  );
}

function FilterPanel({
  copy,
  activeIntent,
  onSelectIntent,
  onReset,
}: {
  copy: ReturnType<typeof getGuestCopy>;
  activeIntent: QuickIntentValue | null;
  onSelectIntent: (intent: QuickIntentValue) => void;
  onReset: () => void;
}) {
  return (
    <div className="border-t border-[var(--hairline-soft)] bg-[color-mix(in_srgb,var(--paper)_90%,white)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 sm:gap-3 sm:px-6 sm:py-5 lg:px-10">
        <SmartEyebrow className="text-[var(--muted)]">{copy.quickFilters}</SmartEyebrow>
        {quickIntents.map((quickIntent) => {
          const value = quickIntent.value;
          const active = activeIntent === value;

          return (
            <button
              key={value}
              type="button"
              className={cn(
                "smart-focus inline-flex h-9 items-center gap-2 rounded-full bg-white px-3 text-xs font-medium text-[var(--ink-soft)] shadow-[var(--ring-soft)] transition",
                active && "bg-[var(--accent)] text-white shadow-none",
              )}
              onClick={() => onSelectIntent(value)}
            >
              <MenuTagIcon code={value} className="size-5 border-0 bg-transparent text-current" />
              {copy.intents[value]}
            </button>
          );
        })}
        {activeIntent ? (
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-white sm:ml-auto"
            onClick={onReset}
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MorePanel({
  copy,
  onAskAi,
  onShowSignature,
  onAskSafety,
}: {
  copy: ReturnType<typeof getGuestCopy>;
  onAskAi: () => void;
  onShowSignature: () => void;
  onAskSafety: () => void;
}) {
  const items = [
    {
      title: copy.getRecommendation,
      description: copy.ai.subtitle,
      icon: Sparkles,
      onClick: onAskAi,
    },
    {
      title: copy.showSignatureDishes,
      description: copy.intents.traditional,
      icon: Utensils,
      onClick: onShowSignature,
    },
    {
      title: copy.allergens,
      description: copy.askStaff,
      icon: ShieldAlert,
      onClick: onAskSafety,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="fixed inset-x-4 top-[9.5rem] z-40 rounded-[var(--radius-lg)] bg-white p-2 shadow-[var(--shadow-overlay),var(--ring-hairline)] sm:absolute sm:inset-x-auto sm:right-6 sm:top-2 sm:w-72 lg:right-10">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              className="flex w-full items-center gap-3 rounded-[var(--radius-md)] p-3 text-left transition hover:bg-[var(--paper-warm)]"
              onClick={item.onClick}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent-dark)]">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
