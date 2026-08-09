import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLURAL_DAYS, pluralRu } from "@/lib/utils/format";
import type { AttendanceDay } from "@/lib/queries/attendance";

type Props = {
  last7Days: AttendanceDay[];
  streak: number;
};

// Индекс = Date.getDay() (0=вс...6=сб), НЕ позиция в last7Days — окно
// last7Days скользящее и может начинаться с любого дня недели в зависимости
// от того, какой сегодня день, поэтому подпись обязана считаться из
// реальной day.date, а не из индекса в массиве (это и было багом раньше).
const WEEKDAY_LETTERS = ["В", "П", "В", "С", "Ч", "П", "С"];

// day.date — "YYYY-MM-DD" (см. toDateKey в lib/queries/attendance.ts).
// Парсим с явным local-midnight ("T00:00:00"), а не голую дату: без этого
// new Date("YYYY-MM-DD") трактуется как UTC-полночь, и getDay() в часовом
// поясе восточнее UTC может съехать на день назад.
function weekdayLetter(dateKey: string): string {
  const dow = new Date(`${dateKey}T00:00:00`).getDay();
  return WEEKDAY_LETTERS[dow] ?? "";
}

export function AttendanceCard({ last7Days, streak }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[9px] uppercase tracking-[2px] text-text-muted">
        Посещаемость
      </p>

      <div className="mt-3 flex justify-between">
        {last7Days.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                day.completed
                  ? "bg-olive"
                  : day.isToday
                    ? "border-2 border-olive"
                    : "bg-black/6",
              )}
            >
              {day.completed ? (
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              ) : null}
            </span>
            <span className="text-[9px] text-text-muted">
              {weekdayLetter(day.date)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[12px] text-text">
        {streak} {pluralRu(streak, PLURAL_DAYS)} подряд 🔥
      </p>

      {streak >= 7 ? (
        <span className="mt-2 inline-block rounded-full bg-olive/10 px-2.5 py-1 text-[10px] text-olive">
          Отлично! Неделя без пропусков
        </span>
      ) : null}
    </div>
  );
}
