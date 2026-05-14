import Link from "next/link";
import type { CSSProperties } from "react";
import { BookOpen, ExternalLink, QrCode, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SmartBadge,
  SmartEyebrow,
  SmartHairline,
  SmartMenuLogo,
  SmartPrice,
  SmartSurface,
} from "@/components/smartmenu/primitives";
import { demoRestaurantCards } from "@/lib/demo-data";

export default function Home() {
  const featured = demoRestaurantCards[0];

  return (
    <main className="min-h-screen bg-[var(--paper-light)] text-[var(--ink)]">
      <section className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-6 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <SmartMenuLogo sublabel="Restaurant menus" />
          <Button variant="outline" render={<Link href={`/r/${featured.slug}`} />}>
            <QrCode data-icon="inline-start" />
            Open guest showcase
          </Button>
        </header>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-3xl">
            <SmartEyebrow>QR menu · AI concierge</SmartEyebrow>
            <h1 className="mt-5 text-balance font-display text-[clamp(4.5rem,11vw,8rem)] font-medium leading-none text-[var(--ink)]">
              SmartMenu
            </h1>
            <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-[var(--ink-soft)]">
              A multilingual QR menu and AI concierge that helps guests understand unfamiliar
              dishes, compare menu styles, and choose confidently without weakening allergen
              safety.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Button size="lg" render={<Link href={`/r/${featured.slug}`} />}>
                <QrCode data-icon="inline-start" />
                Open guest showcase
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href={`/dashboard/restaurants/${featured.id}/menu`} />}
              >
                <ExternalLink data-icon="inline-start" />
                Open manager demo
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Menu modes",
                value: "02",
                description: "Photo cards and a typeset classic menu.",
              },
              {
                label: "Languages",
                value: "09",
                description: "Guest copy and concierge prompts localized.",
              },
              {
                label: "Safety",
                value: "Staff",
                description: "Allergen copy always points back to staff confirmation.",
              },
            ].map((item) => (
              <SmartSurface key={item.label} className="p-5">
                <SmartEyebrow className="text-[var(--muted)]">{item.label}</SmartEyebrow>
                <div className="mt-4 font-display text-4xl font-semibold leading-none">
                  {item.value}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </SmartSurface>
            ))}
          </div>
        </div>

        <section className="grid gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SmartEyebrow>Restaurant demos</SmartEyebrow>
              <h2 className="mt-3 font-display text-5xl font-medium leading-none">
                Four menus, one system
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Each concept uses the same reusable menu components with its own cuisine,
                colors, ingredients, dish explanations, and guest recommendation flow.
              </p>
            </div>
            <SmartBadge variant="outline">Menu + editor</SmartBadge>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {demoRestaurantCards.map((restaurant) => (
              <article
                key={restaurant.slug}
                className="group grid overflow-hidden rounded-[var(--radius-lg)] bg-[var(--paper)] shadow-[var(--shadow-rest),var(--ring-hairline)] sm:grid-cols-[0.92fr_1.08fr]"
                style={{
                  "--accent": restaurant.theme.accent,
                  "--accent-dark": restaurant.theme.accentDark,
                  "--accent-soft": restaurant.theme.accentSoft,
                  "--secondary": restaurant.theme.secondary,
                  "--secondary-soft": restaurant.theme.secondarySoft,
                  "--theme-ink": restaurant.theme.ink,
                  "--paper": restaurant.theme.paper,
                } as CSSProperties}
              >
                <div className="relative min-h-72 overflow-hidden bg-[var(--paper-warm)]">
                  {restaurant.heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={restaurant.heroImageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-[var(--dur-slow)] ease-[var(--ease-out-smooth)] group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <div
                    className="absolute inset-x-0 bottom-0 p-5 text-white"
                    style={{ background: "var(--scrim-bottom)" }}
                  >
                    <SmartPrice className="text-white" size="sm">
                      {restaurant.itemCount} dishes
                    </SmartPrice>
                  </div>
                </div>
                <div className="flex flex-col gap-5 p-5">
                  <div>
                    <SmartEyebrow>
                      {restaurant.cuisine} · {restaurant.city}
                    </SmartEyebrow>
                    <h3 className="mt-3 font-display text-4xl font-medium leading-none text-[var(--theme-ink)]">
                      {restaurant.name}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-[var(--muted)]">
                      {restaurant.description}
                    </p>
                  </div>
                  <SmartHairline />
                  <div className="mt-auto grid gap-2 sm:grid-cols-2">
                    <Button render={<Link href={`/r/${restaurant.slug}?view=classic`} />}>
                      <BookOpen data-icon="inline-start" />
                      Menu
                    </Button>
                    <Button
                      variant="secondary"
                      render={<Link href={`/dashboard/restaurants/${restaurant.id}/menu`} />}
                    >
                      <Sparkles data-icon="inline-start" />
                      Edit
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
