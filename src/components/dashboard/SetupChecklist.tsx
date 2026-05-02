import { CheckCircle2, CircleDashed } from "lucide-react";

type ChecklistItem = {
  label: string;
  done: boolean;
  helper?: string;
};

export function SetupChecklist({ items }: { items: ChecklistItem[] }) {
  const complete = items.filter((item) => item.done).length;
  const percent = Math.round((complete / Math.max(items.length, 1)) * 100);

  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-normal">Today&apos;s tasks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A practical setup path for restaurant teams.
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          {percent}%
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item) => {
          const Icon = item.done ? CheckCircle2 : CircleDashed;

          return (
            <div key={item.label} className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <Icon
                className={item.done ? "text-emerald-700" : "text-amber-600"}
              />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                {item.helper ? (
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.helper}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
