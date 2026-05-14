import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { SmartEyebrow } from "@/components/smartmenu/primitives";

type Action = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function QuickActionPanel({ actions }: { actions: Action[] }) {
  return (
    <aside className="rounded-[var(--radius-lg)] bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[var(--shadow-rest)]">
      <div className="mb-4">
        <SmartEyebrow className="text-[var(--secondary)]">Quick actions</SmartEyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">Common tasks</h2>
        <p className="mt-1 text-sm leading-5 text-white/65">
          Common restaurant tasks, grouped so staff know what to do next.
        </p>
      </div>
      <div className="grid gap-3">
        {actions.map((item) => (
          <div key={item.title} className="rounded-[var(--radius-md)] bg-white/[0.08] p-3 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/65">{item.description}</p>
              </div>
              <ArrowRight className="size-4 text-white/50" />
            </div>
            {item.action ? <div className="mt-3">{item.action}</div> : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
