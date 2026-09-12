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

// Фоновые фото для карточки дня отдыха — см. docs/ADDING_DEVICE_PHOTOS.md
// для той же логики применительно к устройствам. Файлы кладутся в
// public/backgrounds/rest-day-day.jpg и rest-day-evening.jpg; отсутствующий
// файл просто не подгружается (CSS background-image, не <img>), карточка
// остаётся на сплошном тёмном фоне без ошибок.
const REST_DAY_BACKGROUND: Record<"day" | "evening", string> = {
  day: "/backgrounds/rest-day-day.jpg",
  evening: "/backgrounds/rest-day-evening.jpg",
};

function currentRestDayBackgroundSlot(): "day" | "evening" {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "evening" : "day";
}

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
    const bgSlot = currentRestDayBackgroundSlot();
    return (
      <div
        className="relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-[#2C2C2A] bg-cover bg-center p-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.1)]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url(${REST_DAY_BACKGROUND[bgSlot]})`,
        }}
      >
        <Moon className="mx-auto h-6 w-6 text-cream" strokeWidth={1.5} aria-hidden />
        <p className="mt-2 text-[14px] font-semibold text-cream">Сегодня отдых</p>
        {nextScheduledLabel ? (
          <p className="mt-1 text-[12px] text-cream/80">
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
