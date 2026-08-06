import { getDeviceColor } from "@/lib/content/device-colors";
import type { RitualWeekCell } from "@/lib/ritual-builder/ritual-utils";
import { WEEKDAYS, WEEKDAY_LABELS } from "@/lib/ritual-builder/types";
import { cn } from "@/lib/utils";

type Props = { cells: RitualWeekCell[] };

// Компактная сетка тегов без карточки-обёртки — переиспользуется внутри
// других карточек (предпросмотр в конструкторе, экран "Ритуал сохранён",
// превью в /my-rituals), в отличие от WeeklyCalendar
// (components/ritual-home/weekly-calendar.tsx), которая всегда рисует
// собственную белую карточку и заголовок и предназначена для отдельного
// самостоятельного блока на /ritual-home.
export function MiniWeekCalendar({ cells }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((wd) => {
        const cell = cells.find((c) => c.weekday === wd);
        const tags = cell?.tags ?? [];
        return (
          <div key={wd} className="flex flex-col items-center gap-1">
            <span className="text-[8px] text-text-muted">{WEEKDAY_LABELS[wd]}</span>
            <div className="flex w-full flex-col gap-0.5">
              {tags.length > 0 ? (
                tags.map((tag, i) => {
                  const color = getDeviceColor(tag.deviceSlug);
                  return (
                    <span
                      key={i}
                      className={cn(
                        "flex h-[18px] w-full items-center justify-center rounded px-0.5 text-center text-[7px] leading-tight",
                        color.bg,
                        color.text,
                      )}
                    >
                      {tag.label}
                    </span>
                  );
                })
              ) : (
                <span className="flex h-[18px] w-full items-center justify-center text-[9px] text-text-muted">
                  —
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
