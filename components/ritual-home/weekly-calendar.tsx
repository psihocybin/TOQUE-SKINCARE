import Link from "next/link";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/ritual-builder/types";
import { todayWeekday } from "@/lib/ritual-builder/ritual-utils";
import { getDeviceColor } from "@/lib/content/device-colors";
import { cn } from "@/lib/utils";

export type WeekTag = { label: string; deviceSlug: string };

export type WeekCell = {
  weekday: Weekday;
  // Несколько устройств могут быть запланированы на один день — поэтому
  // тегов может быть несколько за ячейку, не один. Пусто = день отдыха.
  tags: WeekTag[];
};

type Props = { cells: WeekCell[] };

// "Сегодня" вычисляется здесь, а не приходит полем в WeekCell — так один и
// тот же тип ячейки подходит и для drip-campaign недели, и для недели
// активного ритуала (lib/ritual-builder/ritual-utils.ts buildRitualWeekCells),
// без дублирования подсчёта текущего дня в каждом билдере отдельно.
export function WeeklyCalendar({ cells }: Props) {
  const today = todayWeekday();

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
          const tags = cell?.tags ?? [];
          return (
            <div key={wd} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px]",
                  wd === today ? "border-2 border-olive text-text" : "text-text-muted",
                )}
              >
                {WEEKDAY_LABELS[wd]}
              </span>
              <div className="flex w-full flex-col gap-1">
                {tags.length > 0 ? (
                  tags.map((tag, i) => {
                    const color = getDeviceColor(tag.deviceSlug);
                    return (
                      <span
                        key={i}
                        className={cn(
                          "flex h-6 w-full items-center justify-center rounded-lg px-0.5 text-center text-[7px] leading-tight",
                          color.bg,
                          color.text,
                        )}
                      >
                        {tag.label}
                      </span>
                    );
                  })
                ) : (
                  <span className="flex h-6 w-full items-center justify-center rounded-lg bg-black/6 px-0.5 text-center text-[7px] text-text-muted">
                    ОТДЫХ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
