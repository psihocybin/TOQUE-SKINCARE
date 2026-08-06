import { CloudSun, Moon, Sun, type LucideIcon } from "lucide-react";
import { DeviceProcedureCard } from "@/components/ritual-home/device-procedure-card";
import type { TodayProcedure, SessionTimeSlot } from "@/lib/program/utils";
import { PLURAL_PROCEDURES, pluralRu } from "@/lib/utils/format";

const SLOT_META: Record<SessionTimeSlot, { label: string; icon: LucideIcon }> = {
  morning: { label: "УТРО", icon: Sun },
  day: { label: "ДЕНЬ", icon: CloudSun },
  evening: { label: "ВЕЧЕР", icon: Moon },
};

type Props = {
  slot: SessionTimeSlot;
  procedures: TodayProcedure[];
  doneToday: boolean;
  dayBadge?: string; // "День 12 из 30" — при нескольких секциях показываем один раз
};

// Переиспользует DeviceProcedureCard из /ritual-home — тот же визуальный
// формат карточки процедуры устройства, чтобы не заводить второй похожий
// компонент.
export function TodaySessionSection({ slot, procedures, doneToday, dayBadge }: Props) {
  const { label, icon: Icon } = SLOT_META[slot];
  const countLabel = pluralRu(procedures.length, PLURAL_PROCEDURES).toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-olive" strokeWidth={1.75} aria-hidden />
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-text">
            {label} · {procedures.length} {countLabel}
          </p>
        </div>
        {dayBadge ? (
          <span className="rounded-full bg-olive/10 px-2 py-0.5 text-[9px] text-olive">
            {dayBadge}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {procedures.map((p) => (
          <DeviceProcedureCard key={p.deviceSlug} procedure={p} isDone={doneToday} />
        ))}
      </div>
    </div>
  );
}
