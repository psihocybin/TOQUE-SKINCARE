import Link from "next/link";
import { DeviceImage } from "@/components/shared/device-image";
import { getModeForDevice } from "@/lib/program/utils";
import type { ProgramDay } from "@/lib/content/drip-campaign";

type Props = {
  deviceSlug: string;
  deviceName: string;
  currentDay: number;
  todayItem: ProgramDay;
};

// Серверный компонент — новый, упрощённый hero по образцу Medicube/GESKE:
// без переключателя устройств и блока «Что нанести» (это теперь на /ritual
// и в карточке процедуры /ritual-home). Режим дня по-прежнему берётся из
// протокола устройства через getModeForDevice — drip-campaign задаёт только
// когда и сколько.
export function HeroTodayCard({
  deviceSlug,
  deviceName,
  currentDay,
  todayItem,
}: Props) {
  const isOnboarding = currentDay <= 30;
  const proc = todayItem.procedure;
  const isRestDay = todayItem.type !== "procedure" || !proc;
  const mode =
    !isRestDay && deviceSlug ? getModeForDevice(deviceSlug, currentDay) : null;

  const badge = isOnboarding ? `День ${currentDay} из 30` : "Поддерживающий режим";
  const ritualHref = deviceSlug ? `/ritual?device=${deviceSlug}` : "/ritual";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative flex h-[140px] items-center justify-center bg-cream-dark">
        {deviceSlug ? <DeviceImage slug={deviceSlug} size={80} /> : null}
        <span className="absolute right-3 top-3 rounded-full bg-olive px-2 py-0.5 text-[10px] text-cream">
          {badge}
        </span>
      </div>

      <div className="p-4">
        {isRestDay ? (
          <>
            <p className="text-[16px] font-semibold text-text">
              Сегодня — день отдыха
            </p>
            <p className="mt-1 text-[12px] text-text-muted">
              Кожа работает, пока вы отдыхаете
            </p>
            <Link
              href={ritualHref}
              className="mt-3 flex h-10 w-full items-center justify-center rounded-full border border-olive/40 text-[13px] text-olive"
            >
              Сделать процедуру всё равно
            </Link>
          </>
        ) : !isOnboarding ? (
          <>
            <p className="text-[16px] font-semibold text-text">
              Выберите процедуру на сегодня
            </p>
            <p className="mt-1 text-[12px] text-text-muted">{deviceName}</p>
            <Link
              href="/ritual-home"
              className="mt-3 flex h-10 w-full items-center justify-center rounded-full bg-olive text-[13px] text-cream"
            >
              Открыть ритуал
            </Link>
          </>
        ) : (
          <>
            <p className="text-[16px] font-semibold text-text">
              {mode ? (mode.displayName ?? mode.name) : (proc?.title ?? "Процедура")}
            </p>
            <p className="mt-1 text-[12px] text-text-muted">
              {proc?.durationMinutes ?? mode?.durationMinutes ?? 0} мин ·{" "}
              {deviceName}
            </p>
            <Link
              href={ritualHref}
              className="mt-3 flex h-10 w-full items-center justify-center rounded-full bg-olive text-[13px] text-cream"
            >
              Начать ритуал
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
