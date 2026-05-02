import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
    <header className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {restaurantName ? <Badge variant="secondary">{restaurantName}</Badge> : null}
            {draftLabel ? <Badge variant="outline">{draftLabel}</Badge> : null}
            <Badge className="border-0 bg-emerald-700 text-white">{statusLabel}</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
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
