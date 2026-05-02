import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  helper?: string;
  icon: ComponentType<LucideProps>;
  tone?: "green" | "amber" | "blue" | "rose" | "violet";
};

const toneClass = {
  green: "from-emerald-50 to-white text-emerald-800",
  amber: "from-amber-50 to-white text-amber-800",
  blue: "from-sky-50 to-white text-sky-800",
  rose: "from-rose-50 to-white text-rose-800",
  violet: "from-violet-50 to-white text-violet-800",
};

export function ManagerStatusCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: Props) {
  return (
    <article className={cn("rounded-2xl border bg-linear-to-br p-4 shadow-sm", toneClass[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">{value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          <Icon className="size-5" />
        </span>
      </div>
      {helper ? <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p> : null}
    </article>
  );
}
