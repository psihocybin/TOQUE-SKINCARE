import Link from "next/link";
import type { ProgramDay } from "@/lib/content/drip-campaign";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/ritual-builder/types";
import { cn } from "@/lib/utils";

export type WeekCell = {
  weekday: Weekday;
  isToday: boolean;
  entry: ProgramDay | undefined;
};

type Props = { cells: WeekCell[] };

function tagFor(entry: ProgramDay | undefined): { label: string; className: string } {
  if (!entry) return { label: "—", className: "bg-black/[0.03] text-text-muted" };
  if (entry.type !== "procedure" || !entry.procedure) {
    return { label: "ОТДЫХ", className: "bg-black/6 text-text-muted" };
  }
  switch (entry.procedure.mode) {
    case "Cleaning":
      return { label: "CLEAN", className: "bg-blue-500/15 text-blue-600" };
    case "Lifting":
      return { label: "LIFT", className: "bg-olive/15 text-olive" };
    case "Ion-":
      return { label: "ION-", className: "bg-amber-500/15 text-amber-600" };
    case "Ion+":
      return { label: "ION+", className: "bg-rose/15 text-rose" };
    default:
      return {
        label: entry.procedure.mode.toUpperCase(),
        className: "bg-black/6 text-text-muted",
      };
  }
}

export function WeeklyCalendar({ cells }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-[2px] text-text-muted">
          Неделя
        </p>
        <Link href="/ritual-builder" className="text-[11px] text-olive">
          Изменить цели ›
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((wd) => {
          const cell = cells.find((c) => c.weekday === wd);
          const tag = tagFor(cell?.entry);
          return (
            <div key={wd} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px]",
                  cell?.isToday
                    ? "border-2 border-olive text-text"
                    : "text-text-muted",
                )}
              >
                {WEEKDAY_LABELS[wd]}
              </span>
              <span
                className={cn(
                  "flex h-8 w-full items-center justify-center rounded-lg px-0.5 text-center text-[8px] leading-tight",
                  tag.className,
                )}
              >
                {tag.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
