"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

import {
  getDemoMenuItemImageOverride,
  subscribeDemoImageOverrides,
} from "@/lib/demo-image-overrides";
import { cn } from "@/lib/utils";

type UseDemoMenuItemImageUrlInput = {
  restaurantSlug: string;
  itemId: string;
  fallbackUrl: string | null;
};

export function useDemoMenuItemImageUrl({
  restaurantSlug,
  itemId,
  fallbackUrl,
}: UseDemoMenuItemImageUrlInput) {
  const [imageUrl, setImageUrl] = useState(fallbackUrl);

  useEffect(() => {
    let active = true;

    async function loadOverride() {
      try {
        const override = await getDemoMenuItemImageOverride(restaurantSlug, itemId);
        if (active) {
          setImageUrl(override?.url ?? fallbackUrl);
        }
      } catch {
        if (active) {
          setImageUrl(fallbackUrl);
        }
      }
    }

    loadOverride();

    const unsubscribe = subscribeDemoImageOverrides((detail) => {
      if (
        !detail ||
        (detail.restaurantSlug === restaurantSlug && detail.itemId === itemId)
      ) {
        loadOverride();
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [fallbackUrl, itemId, restaurantSlug]);

  return imageUrl;
}

export function DemoAwareMenuItemImage({
  restaurantSlug,
  itemId,
  itemName,
  fallbackUrl,
  className,
  imageClassName,
  placeholderClassName,
}: UseDemoMenuItemImageUrlInput & {
  itemName: string;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
}) {
  const imageUrl = useDemoMenuItemImageUrl({
    restaurantSlug,
    itemId,
    fallbackUrl,
  });

  if (!imageUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-muted text-muted-foreground",
          placeholderClassName,
          className,
        )}
      >
        <ImageIcon className="size-5" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={itemName}
      className={cn("object-cover", imageClassName, className)}
    />
  );
}
