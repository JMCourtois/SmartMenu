import { CheckCircle2, CircleDashed } from "lucide-react";

import { SmartEyebrow } from "@/components/smartmenu/primitives";

type ChecklistItem = {
  label: string;
  done: boolean;
  helper?: string;
};

export function SetupChecklist({ items }: { items: ChecklistItem[] }) {
  const complete = items.filter((item) => item.done).length;
  const percent = Math.round((complete / Math.max(items.length, 1)) * 100);

  return (
    <section className="rounded-[var(--radius-lg)] bg-white p-5 shadow-[var(--shadow-rest),var(--ring-hairline)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <SmartEyebrow className="text-[var(--muted)]">Today</SmartEyebrow>
          <h2 className="mt-2 font-display text-2xl font-semibold">Setup checklist</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            A practical setup path for restaurant teams.
          </p>
        </div>
        <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-price text-sm font-semibold text-[var(--accent-dark)]">
          {percent}%
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--paper-warm)]">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item) => {
          const Icon = item.done ? CheckCircle2 : CircleDashed;

          return (
            <div
              key={item.label}
              className={item.done ? "flex gap-3 rounded-[var(--radius-md)] bg-[var(--accent-soft)] p-3" : "flex gap-3 rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3"}
            >
              <Icon
                className={item.done ? "text-[var(--accent-dark)]" : "text-[var(--secondary)]"}
              />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                {item.helper ? (
                  <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">{item.helper}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
