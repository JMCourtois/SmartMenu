import Link from "next/link";
import { BarChart3, BookOpen, Camera, ChefHat, ExternalLink, QrCode, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_RESTAURANT_ID, demoRestaurantCards } from "@/lib/demo-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ec]">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#263b2e] text-white">
              <ChefHat />
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-normal text-[#172018] sm:text-6xl">
              SmartMenu
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#667267]">
              A multilingual QR menu and AI concierge that helps guests understand unfamiliar
              dishes, compare menu styles, and choose confidently without weakening allergen
              safety.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/r/${demoRestaurantCards[0].slug}`}>
                <Button className="bg-[#263b2e] text-white hover:bg-[#1b2b21]">
                  <QrCode data-icon="inline-start" />
                  Open guest showcase
                </Button>
              </Link>
              <Link href={`/dashboard/restaurants/${DEMO_RESTAURANT_ID}/menu`}>
                <Button variant="outline">
                  <ExternalLink data-icon="inline-start" />
                  Open manager demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Two menu modes",
                description: "Switch between photo cards and an interactive printed-menu view.",
                icon: BookOpen,
              },
              {
                title: "Visible AI concierge",
                description: "Guests can ask what to order from the hero, sidebar, or floating widget.",
                icon: Sparkles,
              },
              {
                title: "Rich dish context",
                description: "Origin, taste, spice, ingredients, allergens, and pairings are structured.",
                icon: BarChart3,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-0 bg-white/80 shadow-sm ring-1 ring-black/5">
                  <CardHeader>
                    <Icon className="mb-2 text-[#c5531b]" />
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              );
            })}
          </div>
        </div>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-normal text-[#172018]">
                Explore four restaurant demos
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667267]">
                Each concept uses the same reusable menu components but has its own cuisine,
                colors, ingredients, dish explanations, and guest recommendation flow.
              </p>
            </div>
            <Badge variant="outline" className="w-fit bg-white/70">
              Photo view + real-menu view
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {demoRestaurantCards.map((restaurant) => (
              <Card
                key={restaurant.slug}
                className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-black/5"
              >
                <div className="grid min-h-64 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-48">
                    {restaurant.heroImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={restaurant.heroImageUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                    <div
                      className="absolute inset-x-0 bottom-0 p-4 text-white"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,.62), rgba(0,0,0,0))",
                      }}
                    >
                      <div className="font-mono text-xs">{restaurant.itemCount} dishes</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <Badge
                        className="mb-3 border-0 text-white"
                        style={{ backgroundColor: restaurant.theme.accent }}
                      >
                        {restaurant.cuisine}
                      </Badge>
                      <CardTitle className="text-2xl">{restaurant.name}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3">
                        {restaurant.description}
                      </CardDescription>
                    </div>
                    <div className="mt-auto grid gap-2 sm:grid-cols-2">
                      <Link href={`/r/${restaurant.slug}?view=photo`}>
                        <Button className="w-full" style={{ backgroundColor: restaurant.theme.accent, color: "white" }}>
                          <Camera data-icon="inline-start" />
                          Photo menu
                        </Button>
                      </Link>
                      <Link href={`/r/${restaurant.slug}?view=classic`}>
                        <Button variant="outline" className="w-full">
                          <BookOpen data-icon="inline-start" />
                          Real menu
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
