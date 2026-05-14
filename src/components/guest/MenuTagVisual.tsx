import type { ComponentType, SVGProps } from "react";
import {
  BadgeCheck,
  Beer,
  Euro,
  Flame,
  Leaf,
  ShieldAlert,
  Sparkles,
  Utensils,
  WheatOff,
} from "lucide-react";

import { getDietaryTagVisual, type DietaryTagIconKey, type DietaryTagTone } from "@/lib/guest-menu";
import { cn } from "@/lib/utils";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

function NoPorkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.4 10.2c.9-2.8 3.3-4.6 6.4-4.6 3.8 0 6.7 2.4 6.7 5.8 0 3.3-2.8 5.9-6.7 5.9H8.2c-2.1 0-3.7-1.4-3.7-3.2 0-1.4.8-2.5 1.9-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.6c-.9-.8-2.2-1-3.4-.5M15.9 10.7h.01M12.6 13.9h4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m4.2 19.8 15.6-15.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const icons: Record<DietaryTagIconKey, SvgIcon> = {
  "badge-check": BadgeCheck,
  beer: Beer,
  coin: Euro,
  flame: Flame,
  leaf: Leaf,
  "no-pork": NoPorkIcon,
  "shield-alert": ShieldAlert,
  sparkles: Sparkles,
  utensils: Utensils,
  "wheat-off": WheatOff,
};

const toneClassNames: Record<DietaryTagTone, string> = {
  accent: "border-[var(--accent-soft)] bg-[var(--accent-soft)] text-[var(--accent-dark)]",
  danger: "border-[var(--danger-soft)] bg-[var(--danger-soft)] text-[var(--danger)]",
  fresh: "border-[var(--secondary-soft)] bg-[var(--secondary-soft)] text-[var(--accent-dark)]",
  gold: "border-[var(--warn-soft)] bg-[var(--warn-soft)] text-[var(--warn)]",
  neutral: "border-[var(--hairline)] bg-[var(--paper-warm)] text-[var(--muted)]",
  spicy: "border-[var(--warn-soft)] bg-[var(--warn-soft)] text-[var(--warn)]",
};

export function MenuTagIcon({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const visual = getDietaryTagVisual(code);
  const Icon = icons[visual.icon];

  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full border",
        toneClassNames[visual.tone],
        className,
      )}
      aria-hidden="true"
    >
      <Icon className="size-4" strokeWidth={2.2} />
    </span>
  );
}

export function MenuTagBadge({
  code,
  label,
  className,
}: {
  code: string;
  label: string;
  className?: string;
}) {
  const visual = getDietaryTagVisual(code);

  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClassNames[visual.tone],
        className,
      )}
    >
      <MenuTagIcon code={code} className="size-5 border-0 bg-transparent text-current" />
      {label}
    </span>
  );
}
