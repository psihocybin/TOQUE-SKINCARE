import Link from "next/link";
import { CloudSun, Moon, Sun, type LucideIcon } from "lucide-react";
import { DeviceImage } from "@/components/shared/device-image";
import { getProtocolBySlug } from "@/lib/content/protocols";
import type { SessionTimeSlot } from "@/lib/program/utils";
import {
  resolveRitualSessionGroup,
  type RitualTodayItem,
} from "@/lib/ritual-builder/ritual-utils";
import { cn } from "@/lib/utils";

const SLOT_ICON: Record<SessionTimeSlot, LucideIcon> = {
  morning: Sun,
  day: CloudSun,
  evening: Moon,
};

type Props = {
  items: RitualTodayItem[];
  nextScheduledLabel: string | null;
};

// Хero-карточка активного ритуала на /home — показывает ПЕРВУЮ процедуру
// сегодня (а не весь список: детальный список по времени суток — уже на
// /ritual-home, здесь нужен только быстрый CTA «начать»). Работает с
// "сырыми" RitualTodayItem (не TodayProcedure): modeName в них — технический
// ключ режима, нужный для /ritual?mode=, а не отображаемое имя.
export function RitualHeroCard({ items, nextScheduledLabel }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <Moon className="mx-auto h-6 w-6 text-text-muted" strokeWidth={1.5} aria-hidden />
        <p className="mt-2 text-[14px] font-semibold text-text">Сегодня отдых</p>
        {nextScheduledLabel ? (
          <p className="mt-1 text-[12px] text-text-muted">
            Следующая процедура: {nextScheduledLabel}
          </p>
        ) : null}
      </div>
    );
  }

  const [first, ...rest] = items;
  const item = first!;
  const Icon = SLOT_ICON[resolveRitualSessionGroup(item)];
  const durationMinutes = getProtocolBySlug(item.deviceSlug)?.modes.find(
    (m) => m.name === item.modeName,
  )?.durationMinutes;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <DeviceImage slug={item.deviceSlug} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-olive" strokeWidth={1.75} aria-hidden />
            <p className="truncate text-[14px] font-semibold text-text">
              {item.displayName} · {item.deviceSlug.toUpperCase()}
            </p>
          </div>
          {durationMinutes ? (
            <p className="mt-0.5 text-[11px] text-text-muted">{durationMinutes} мин</p>
          ) : null}
        </div>
      </div>
      <div className={cn("px-4 pb-4", rest.length > 0 && "flex items-center gap-3")}>
        <Link
          href={`/ritual?device=${item.deviceSlug}&mode=${encodeURIComponent(item.modeName)}`}
          className="flex h-10 flex-1 items-center justify-center rounded-full bg-olive text-[13px] text-cream"
        >
          Начать
        </Link>
        {rest.length > 0 ? (
          <Link href="/ritual-home" className="shrink-0 text-[11px] text-olive">
            +{rest.length} ещё →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
