"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, Upload } from "lucide-react";

import { uploadMenuItemImageAction } from "@/app/(manager)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveDemoMenuItemImageOverride } from "@/lib/demo-image-overrides";

type UploadState = {
  ok: boolean | null;
  message: string | null;
};

export function MenuItemImageUploadForm({
  restaurantId,
  restaurantSlug,
  menuItemId,
  itemName,
  demoMode,
}: {
  restaurantId: string;
  restaurantSlug: string;
  menuItemId: string;
  itemName: string;
  demoMode: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<UploadState>({
    ok: null,
    message: null,
  });
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      encType="multipart/form-data"
      className="mt-3 grid gap-2 rounded-[var(--radius-md)] bg-white p-2 shadow-[var(--ring-hairline)] md:grid-cols-[1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
          if (demoMode) {
            const file = formData.get("image");

            if (!(file instanceof File) || file.size === 0) {
              setState({
                ok: false,
                message: "Choose an image first.",
              });
              return;
            }

            try {
              await saveDemoMenuItemImageOverride(restaurantSlug, menuItemId, file);
              setState({
                ok: true,
                message: "Saved in this browser for demo preview.",
              });
              formRef.current?.reset();
            } catch (error) {
              setState({
                ok: false,
                message:
                  error instanceof Error ? error.message : "Upload failed. Try another image.",
              });
            }

            return;
          }

          const result = await uploadMenuItemImageAction(restaurantId, formData);
          setState({
            ok: result.ok,
            message: result.message,
          });

          if (result.ok) {
            formRef.current?.reset();
          }
        });
      }}
    >
      <input type="hidden" name="menuItemId" value={menuItemId} />
      <div>
        <Input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={isPending}
          aria-label={`Upload image for ${itemName}`}
        />
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <ImageIcon className="size-3.5" />
          {demoMode
            ? "Demo upload: saved in this browser and shown in menu previews."
            : "JPEG, PNG, WebP, or AVIF. Max 8MB. Draft items only."}
        </p>
        {state.message ? (
          <p
            className={
              state.ok
                ? "mt-1 text-xs font-medium text-[var(--accent-dark)]"
                : "mt-1 text-xs font-medium text-destructive"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className={
          demoMode
            ? "border-0 bg-[var(--accent-dark)] text-white hover:bg-[var(--accent)]"
            : undefined
        }
        variant={demoMode ? "default" : "outline"}
      >
        <Upload data-icon="inline-start" />
        {isPending ? "Uploading..." : "Upload image"}
      </Button>
    </form>
  );
}
