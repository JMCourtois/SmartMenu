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
import { ConciergeResponseSchema, type ConciergeResponse } from "@/lib/ai/concierge";
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
      const response = await fetch("/api/ai/concierge", {
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
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <div
          className={cn(
            "hidden max-w-[260px] rounded-2xl px-4 py-3 text-sm font-medium shadow-xl ring-1 ring-black/10 sm:block",
            !hasOpenedBefore && "animate-pulse",
          )}
          style={{
            backgroundColor: "color-mix(in srgb, var(--menu-secondary-soft) 80%, white)",
            color: "var(--menu-ink)",
          }}
        >
          {copy.aiCtaHelper}
        </div>
        <Button
          size="lg"
          className={cn(
            "h-auto rounded-full px-5 py-3 text-left text-base shadow-2xl ring-4 ring-white/80",
            !hasOpenedBefore && "animate-pulse",
          )}
          style={{ backgroundColor: "var(--menu-accent-dark)", color: "white" }}
          onClick={() => openConcierge("floating-widget")}
        >
          <Sparkles data-icon="inline-start" />
          <span className="grid gap-0.5">
            <span>{copy.getRecommendation}</span>
            <span className="text-xs font-normal text-white/80">{copy.ai.subtitle}</span>
          </span>
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="border-b pr-12">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles style={{ color: "var(--menu-secondary)" }} />
              {copy.ai.title}
            </SheetTitle>
            <SheetDescription>{copy.ai.subtitle}</SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            <section className="rounded-2xl border bg-background p-3">
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
                    className="h-auto justify-start rounded-2xl px-3 py-3 text-left whitespace-normal"
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

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-between rounded-xl"
                onClick={() => setFiltersOpen((current) => !current)}
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4" />
                  {copy.ai.filterPreferences}
                </span>
                <Badge variant="secondary">{activePreferenceSummary.length}</Badge>
              </Button>
              {filtersOpen ? (
                <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: "var(--menu-accent-soft)" }}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
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
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["mild", "medium", "hot"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={preferences.spiceTolerance === level ? "secondary" : "outline"}
                        size="sm"
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
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["any", "under-20", "splurge"] as const).map((budget) => (
                      <Button
                        key={budget}
                        variant={preferences.budget === budget ? "secondary" : "outline"}
                        size="sm"
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

            <section className="rounded-2xl border bg-muted/40 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
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
                <div className="rounded-2xl border border-dashed p-4 text-sm leading-6 text-muted-foreground">
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
                        ? "ml-auto border border-black/15 bg-white text-black shadow-md"
                        : "mr-auto border text-slate-950 shadow-sm",
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
              <section className="rounded-2xl border bg-background p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles style={{ color: "var(--menu-secondary)" }} />
                  {copy.ai.recommendations}
                </div>
                <div className="grid gap-2">
                  {recommendedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/r/${menu.restaurant.slug}/item/${item.slug}`}
                      className="rounded-xl border p-3 transition hover:bg-muted"
                      onClick={() =>
                        onTrack("CONCIERGE_RECOMMENDATION_CLICKED", {
                          itemSlug: item.slug,
                        })
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{localizedName(item, locale)}</div>
                        <div className="font-mono text-xs">
                          {formatLocalizedPrice(item.priceCents, menu.restaurant.currency, locale)}
                        </div>
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
              <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3">
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
                <div className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
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
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>

          <form
            className="border-t p-4"
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
