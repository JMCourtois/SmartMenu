import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

import { SmartEyebrow } from "@/components/smartmenu/primitives";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  helper?: string;
  icon: ComponentType<LucideProps>;
  tone?: "green" | "amber" | "blue" | "rose" | "violet";
};

const toneClass = {
  green: "bg-[var(--accent-soft)] text-[var(--accent-dark)]",
  amber: "bg-[var(--secondary-soft)] text-[var(--accent-dark)]",
  blue: "bg-[var(--accent-soft)] text-[var(--accent-dark)]",
  rose: "bg-[var(--danger-soft)] text-[var(--danger)]",
  violet: "bg-[var(--secondary-soft)] text-[var(--accent-dark)]",
};

export function ManagerStatusCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: Props) {
  return (
    <article className="rounded-[var(--radius-lg)] bg-white p-4 shadow-[var(--shadow-rest),var(--ring-hairline)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SmartEyebrow className="text-[var(--muted)]">{label}</SmartEyebrow>
          <p className="mt-3 break-words font-display text-3xl font-semibold leading-none text-[var(--ink)] sm:text-4xl">{value}</p>
        </div>
        <span className={cn("flex size-10 items-center justify-center rounded-[var(--radius-md)]", toneClass[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
      {helper ? <p className="mt-3 text-sm leading-5 text-[var(--muted)]">{helper}</p> : null}
    </article>
  );
}
