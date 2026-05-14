import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { SmartBadge, SmartEyebrow } from "@/components/smartmenu/primitives";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  restaurantName?: string;
  restaurantSlug?: string;
  draftLabel?: string;
  statusLabel?: string;
  primaryAction?: ReactNode;
};

export function ManagerPageHeader({
  title,
  description,
  restaurantName,
  restaurantSlug,
  draftLabel,
  statusLabel = "Draft workspace",
  primaryAction,
}: Props) {
  return (
    <header className="rounded-[var(--radius-lg)] bg-white p-5 shadow-[var(--shadow-rest),var(--ring-hairline)] sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {restaurantName ? <SmartBadge>{restaurantName}</SmartBadge> : null}
            {draftLabel ? <SmartBadge variant="outline">{draftLabel}</SmartBadge> : null}
            <SmartBadge variant="accent">{statusLabel}</SmartBadge>
          </div>
          <SmartEyebrow className="text-[var(--muted)]">SmartMenu manager</SmartEyebrow>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-none text-[var(--ink)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {restaurantSlug ? (
            <Button
              variant="outline"
              render={<Link href={`/r/${restaurantSlug}`} target="_blank" />}
            >
                <ExternalLink data-icon="inline-start" />
                Public preview
            </Button>
          ) : null}
          {primaryAction}
        </div>
      </div>
    </header>
  );
}
