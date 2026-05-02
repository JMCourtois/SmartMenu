"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDemoMenuItemImageUrl } from "@/components/menu/DemoAwareMenuItemImage";

export function MenuItemImageOpenButton({
  restaurantSlug,
  itemId,
  fallbackUrl,
}: {
  restaurantSlug: string;
  itemId: string;
  fallbackUrl: string | null;
}) {
  const imageUrl = useDemoMenuItemImageUrl({
    restaurantSlug,
    itemId,
    fallbackUrl,
  });

  if (!imageUrl) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      render={<a href={imageUrl} target="_blank" rel="noreferrer" />}
    >
      <ExternalLink data-icon="inline-start" />
      Open image
    </Button>
  );
}
