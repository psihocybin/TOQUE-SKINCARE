import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLURAL_DAYS, pluralRu } from "@/lib/utils/format";
import type { AttendanceDay } from "@/lib/queries/attendance";

type Props = {
  last7Days: AttendanceDay[];
  streak: number;
};

const WEEKDAY_LETTERS = ["П", "В", "С", "Ч", "П", "С", "В"];

export function AttendanceCard({ last7Days, streak }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[9px] uppercase tracking-[2px] text-text-muted">
        Посещаемость
      </p>

      <div className="mt-3 flex justify-between">
        {last7Days.map((day, i) => (
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
              {WEEKDAY_LETTERS[i]}
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
