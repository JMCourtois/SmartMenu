"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Loader2, Send, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { MenuTagIcon } from "@/components/guest/MenuTagVisual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { SmartEyebrow, SmartPrice } from "@/components/smartmenu/primitives";
import { ConciergeResponseSchema, type ConciergeResponse } from "@/lib/ai/concierge";
import { withBasePath } from "@/lib/base-path";
import {
  clearConversation,
  detectChatLanguage,
  readConversation,
  writeConversation,
  type ConciergeStoredMessage,
} from "@/lib/guest-chat";
import {
  formatLocalizedPrice,
  getAllMenuItems,
  getGuestCopy,
  localizedItemField,
  localizedName,
} from "@/lib/guest-menu";
import {
  defaultGuestPreferences,
  readGuestPreferences,
  writeGuestPreferences,
  type GuestPreferenceSnapshot,
} from "@/lib/guest-preferences";
import { cn } from "@/lib/utils";
import type { MenuItemView, RestaurantMenuView } from "@/types/menu";
import type { QuickIntentValue } from "@/lib/guest-menu";

type Props = {
  menu: RestaurantMenuView;
  locale: string;
  visibleItems: MenuItemView[];
  seedRequest: {
    id: number;
    question: string;
    focusItemId?: string;
  } | null;
  onSeedConsumed: () => void;
  onTrack: (eventType: string, metadata?: Record<string, unknown>) => void;
};

const preferenceOptions: Array<{ value: QuickIntentValue }> = [
  { value: "vegetarian" },
  { value: "vegan" },
  { value: "no-pork" },
  { value: "light" },
  { value: "spicy" },
  { value: "under-20" },
];

const demoPromptPreferencePatches: Array<Partial<GuestPreferenceSnapshot> | undefined> = [
  undefined,
  {
    dietaryPreferences: ["vegetarian", "light"],
    spiceTolerance: "mild",
  },
  {
    dietaryPreferences: ["spicy", "no-pork"],
    spiceTolerance: "hot",
  },
  {
    dietaryPreferences: ["under-20"],
    budget: "under-20",
  },
  {
    dietaryPreferences: ["traditional"],
  },
];

export function AiConciergeWidget({
  menu,
  locale,
  visibleItems,
  seedRequest,
  onSeedConsumed,
  onTrack,
}: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ConciergeStoredMessage[]>(() =>
    typeof window === "undefined" ? [] : readConversation(window.sessionStorage, menu.restaurant.slug),
  );
  const [preferences, setPreferences] = useState<GuestPreferenceSnapshot>(() =>
    typeof window === "undefined"
      ? defaultGuestPreferences
      : readGuestPreferences(window.sessionStorage, menu.restaurant.slug),
  );
  const [lastResult, setLastResult] = useState<ConciergeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.sessionStorage.getItem(`smartmenu.concierge.opened.${menu.restaurant.slug}`) ===
        "true",
  );

  const itemById = useMemo(
    () => new Map(getAllMenuItems(menu).map((item) => [item.id, item])),
    [menu],
  );
  const copy = getGuestCopy(locale);
  const demoPrompts = useMemo(
    () =>
      copy.ai.demoPrompts.map((prompt, index) => ({
        ...prompt,
        preferences: demoPromptPreferencePatches[index],
      })),
    [copy.ai.demoPrompts],
  );
  const activePreferenceSummary = useMemo(() => {
    const summary = preferences.dietaryPreferences.map((preference) => {
      const key = preference as QuickIntentValue;
      return copy.intents[key] ?? preference;
    });

    if (preferences.spiceTolerance !== "medium") {
      summary.push(
        preferences.spiceTolerance === "mild" ? copy.ai.mild : copy.ai.hot,
      );
    }

    if (preferences.budget !== "any") {
      summary.push(
        preferences.budget === "splurge" ? "Splurge" : copy.intents["under-20"],
      );
    }

    for (const ingredient of preferences.avoidedIngredients) {
      summary.push(`Avoid ${ingredient}`);
    }

    return summary;
  }, [copy, preferences]);

  useEffect(() => {
    writeGuestPreferences(window.sessionStorage, menu.restaurant.slug, {
      ...preferences,
      language: locale,
    });
  }, [locale, menu.restaurant.slug, preferences]);

  useEffect(() => {
    writeConversation(window.sessionStorage, menu.restaurant.slug, messages);
  }, [menu.restaurant.slug, messages]);

  function togglePreference(value: string) {
    setPreferences((current) => {
      const exists = current.dietaryPreferences.includes(value);
      return {
        ...current,
        dietaryPreferences: exists
          ? current.dietaryPreferences.filter((entry) => entry !== value)
          : [...current.dietaryPreferences, value],
      };
    });
  }

  const openConcierge = useCallback((entryPoint: string) => {
    setOpen(true);
    setHasOpenedBefore(true);
    window.sessionStorage.setItem(`smartmenu.concierge.opened.${menu.restaurant.slug}`, "true");
    onTrack("ASSISTANT_OPENED", { entryPoint });
  }, [menu.restaurant.slug, onTrack]);

  function resetPreferences() {
    setPreferences({
      ...defaultGuestPreferences,
      language: locale,
      displayMode: preferences.displayMode,
    });
  }

  const askConcierge = useCallback(async (
    question: string,
    options?: {
      focusItemId?: string;
      preferencesOverride?: GuestPreferenceSnapshot;
    },
  ) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const effectivePreferences = options?.preferencesOverride ?? preferences;
    const chatLocale = detectChatLanguage(trimmed, locale);
    setLoading(true);
    setError(null);
    setInput("");
    const nextMessages: ConciergeStoredMessage[] = [
      ...messages,
      { role: "user" as const, content: trimmed, locale: chatLocale },
    ].slice(-6);
    setMessages(nextMessages);
    onTrack("QUESTION_ASKED", { intent: "concierge" });
    onTrack("CONCIERGE_MESSAGE_SENT", {
      messageKind: "guest_question",
      visibleItemIds: visibleItems.map((item) => item.id).slice(0, 20),
    });

    try {
      const response = await fetch(withBasePath("/api/ai/concierge"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantSlug: menu.restaurant.slug,
          locale,
          chatLocale,
          question: trimmed,
          preferences: {
            dietaryPreferences: effectivePreferences.dietaryPreferences,
            avoidedIngredients: effectivePreferences.avoidedIngredients,
            spiceTolerance: effectivePreferences.spiceTolerance,
            budget: effectivePreferences.budget,
          },
          conversation: messages.slice(-4),
          visibleItemIds: visibleItems.map((item) => item.id),
          focusItemId: options?.focusItemId,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "AI concierge failed");
      }
      const result = ConciergeResponseSchema.parse(payload.result);
      setLastResult(result);
      setMessages((current) =>
        [...current, { role: "assistant" as const, content: result.answer, locale: chatLocale }].slice(-6),
      );
      onTrack("RECOMMENDATION_SHOWN", {
        intent: "concierge",
        itemIds: result.recommendedItemIds,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not ask the concierge.");
    } finally {
      setLoading(false);
    }
  }, [loading, locale, menu.restaurant.slug, messages, onTrack, preferences, visibleItems]);

  useEffect(() => {
    if (!seedRequest) return;
    const timeout = window.setTimeout(() => {
      openConcierge("dish-info");
      void askConcierge(seedRequest.question, { focusItemId: seedRequest.focusItemId });
      onSeedConsumed();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [askConcierge, onSeedConsumed, openConcierge, seedRequest]);

  function mergePreferences(patch?: Partial<GuestPreferenceSnapshot>) {
    if (!patch) {
      return preferences;
    }

    return {
      ...preferences,
      ...patch,
      dietaryPreferences: [
        ...new Set([
          ...preferences.dietaryPreferences,
          ...(patch.dietaryPreferences ?? []),
        ]),
      ],
      avoidedIngredients: [
        ...new Set([
          ...preferences.avoidedIngredients,
          ...(patch.avoidedIngredients ?? []),
        ]),
      ],
    };
  }

  function sendDemoPrompt(prompt: (typeof demoPrompts)[number]) {
    const nextPreferences = mergePreferences(prompt.preferences);
    setPreferences(nextPreferences);
    void askConcierge(prompt.prompt, { preferencesOverride: nextPreferences });
  }

  const recommendedItems =
    lastResult?.recommendedItemIds
      .map((itemId) => itemById.get(itemId))
      .filter((item): item is MenuItemView => Boolean(item)) ?? [];

  return (
    <>
      <div className="fixed right-4 bottom-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:right-5 sm:bottom-5">
        <Button
          size="lg"
          className={cn(
            "h-11 max-w-full rounded-full px-4 text-sm shadow-[var(--shadow-overlay),0_0_0_4px_rgba(255,255,255,.85)] sm:h-12 sm:px-5 sm:text-base",
            !hasOpenedBefore && "animate-pulse",
          )}
          style={{ backgroundColor: "var(--menu-accent-dark)", color: "white" }}
          onClick={() => openConcierge("floating-widget")}
        >
          <Sparkles data-icon="inline-start" />
          {copy.getRecommendation}
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="h-[100dvh] w-full max-w-full gap-0 border-l-0 bg-[var(--paper)] shadow-[var(--shadow-overlay)] sm:max-w-[440px]">
          <SheetHeader className="border-b border-[var(--hairline-soft)] px-4 py-4 pr-12 sm:px-6 sm:py-5">
            <SmartEyebrow>{copy.ai.oneClickDemos}</SmartEyebrow>
            <SheetTitle className="mt-2 flex items-center gap-2 font-display text-2xl font-semibold leading-tight sm:text-3xl">
              <Sparkles style={{ color: "var(--menu-secondary)" }} />
              {copy.ai.title}
            </SheetTitle>
            <SheetDescription className="leading-6">{copy.ai.subtitle}</SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <section className="surface-card rounded-[var(--radius-lg)] p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{copy.ai.oneClickDemos}</div>
                <Badge variant="outline">
                  {visibleItems.length} {copy.ai.visibleMenu}
                </Badge>
              </div>
              <div className="grid gap-2">
                {demoPrompts.map((prompt) => (
                  <Button
                    key={prompt.label}
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="h-auto justify-start rounded-[var(--radius-md)] px-3 py-3 text-left whitespace-normal"
                    onClick={() => sendDemoPrompt(prompt)}
                  >
                    <span className="grid gap-0.5">
                      <span className="text-sm font-semibold">{prompt.label}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {prompt.description}
                      </span>
                    </span>
                  </Button>
                ))}
              </div>
            </section>

            <section className="surface-card rounded-[var(--radius-lg)] p-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-between rounded-[var(--radius-md)]"
                onClick={() => setFiltersOpen((current) => !current)}
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4" />
                  {copy.ai.filterPreferences}
                </span>
                <Badge variant="secondary">{activePreferenceSummary.length}</Badge>
              </Button>
              {filtersOpen ? (
                <div className="mt-3 rounded-[var(--radius-md)] p-3" style={{ backgroundColor: "var(--menu-accent-soft)" }}>
                  <div className="smart-eyebrow mb-2 text-[var(--muted)]">
                    {copy.ai.preferenceSummary}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferenceOptions.map((option) => {
                      const selected = preferences.dietaryPreferences.includes(option.value);
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          className={cn("h-8 rounded-full", selected && "border-0")}
                          style={
                            selected
                              ? { backgroundColor: "var(--menu-accent-dark)", color: "white" }
                              : undefined
                          }
                          onClick={() => togglePreference(option.value)}
                        >
                          <MenuTagIcon
                            code={option.value}
                            className="size-5 border-0 bg-transparent text-current"
                          />
                          {copy.intents[option.value]}
                        </Button>
                      );
                    })}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {(["mild", "medium", "hot"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={preferences.spiceTolerance === level ? "secondary" : "outline"}
                        size="sm"
                        className="whitespace-normal"
                        onClick={() =>
                          setPreferences((current) => ({ ...current, spiceTolerance: level }))
                        }
                      >
                        {level === "mild"
                          ? copy.ai.mild
                          : level === "hot"
                            ? copy.ai.hot
                            : copy.ai.medium}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {(["any", "under-20", "splurge"] as const).map((budget) => (
                      <Button
                        key={budget}
                        variant={preferences.budget === budget ? "secondary" : "outline"}
                        size="sm"
                        className="whitespace-normal"
                        onClick={() => setPreferences((current) => ({ ...current, budget }))}
                      >
                        {budget === "any"
                          ? copy.ai.budget
                          : budget === "under-20"
                            ? copy.intents["under-20"]
                            : "Splurge"}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={resetPreferences}
                  >
                    {copy.ai.resetFilters}
                  </Button>
                </div>
              ) : null}
            </section>

            <section className="rounded-[var(--radius-lg)] bg-[var(--paper-warm)] p-3">
              <div className="smart-eyebrow mb-2 text-[var(--muted)]">
                {copy.ai.activeContext}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activePreferenceSummary.length ? (
                  activePreferenceSummary.map((entry) => (
                    <Badge key={entry} variant="secondary">
                      {entry}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {copy.ai.noActiveContext}
                  </span>
                )}
              </div>
            </section>

            {messages.length === 0 ? (
              <section className="grid gap-2">
                <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--hairline)] p-4 text-sm leading-6 text-[var(--muted)]">
                  {copy.ai.oneClickDemos}. {copy.ai.subtitle}
                </div>
              </section>
            ) : (
              <section className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={cn(
                      "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6",
                      message.role === "user"
                        ? "ml-auto bg-white text-[var(--ink)] shadow-[var(--ring-hairline)]"
                        : "mr-auto border text-[var(--ink)] shadow-sm",
                    )}
                    style={
                      message.role === "assistant"
                        ? {
                            backgroundColor:
                              "color-mix(in srgb, var(--menu-accent-soft) 42%, white)",
                            borderColor:
                              "color-mix(in srgb, var(--menu-accent) 22%, transparent)",
                          }
                        : undefined
                    }
                  >
                    {message.content}
                  </div>
                ))}
                {loading ? (
                  <div className="mr-auto inline-flex max-w-[88%] items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">
                    <Loader2 className="size-4 animate-spin" />
                    {copy.ai.thinking}
                  </div>
                ) : null}
              </section>
            )}

            {recommendedItems.length > 0 ? (
              <section className="surface-card rounded-[var(--radius-lg)] p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles style={{ color: "var(--menu-secondary)" }} />
                  {copy.ai.recommendations}
                </div>
                <div className="grid gap-2">
                  {recommendedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/r/${menu.restaurant.slug}/item/${item.slug}`}
                      className="rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3 transition hover:bg-[var(--accent-soft)]"
                      onClick={() =>
                        onTrack("CONCIERGE_RECOMMENDATION_CLICKED", {
                          itemSlug: item.slug,
                        })
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{localizedName(item, locale)}</div>
                        <SmartPrice size="sm">
                          {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
                        </SmartPrice>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {item.spiceLevel > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Flame className="size-3" />
                            {copy.spiceLevel} {item.spiceLevel}/5
                          </span>
                        ) : null}
                        <span className="line-clamp-1">
                          {localizedItemField(item, locale, "tasteProfile")}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {lastResult?.recommendationReasons.find(
                          (reason) => reason.itemId === item.id,
                        )?.reason ?? copy.recommendedDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {lastResult?.safetyNotes.length ? (
              <section className="rounded-[var(--radius-lg)] bg-[var(--danger-soft)] p-3 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--danger)_18%,transparent)]">
                <div className="mb-2 text-sm font-semibold">{copy.ai.safetyNotes}</div>
                <div className="space-y-1">
                  {lastResult.safetyNotes.map((note) => (
                    <p key={note} className="text-xs leading-5 text-muted-foreground">
                      {note}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            {lastResult?.followUpPrompts.length ? (
              <section className="grid gap-2">
                <div className="smart-eyebrow text-[var(--muted)]">
                  {copy.ai.followUps}
                </div>
                {lastResult.followUpPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="ghost"
                    className="h-auto justify-start rounded-xl px-3 py-2 text-left text-sm whitespace-normal"
                    onClick={() => askConcierge(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </section>
            ) : null}

            {error ? (
              <div className="rounded-[var(--radius-lg)] bg-[var(--danger-soft)] p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-[var(--hairline-soft)] bg-[var(--paper)] p-3 sm:p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void askConcierge(input);
            }}
          >
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={copy.ai.messagePlaceholder}
                className="min-h-12 resize-none"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
                <span className="sr-only">{copy.ai.send}</span>
              </Button>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMessages([]);
                setLastResult(null);
                setError(null);
                clearConversation(window.sessionStorage, menu.restaurant.slug);
              }}
            >
              <X className="size-3" />
              {copy.ai.resetVisit}
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
