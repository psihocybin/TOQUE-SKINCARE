import Link from "next/link";
import { DeviceImage } from "@/components/shared/device-image";
import { FavoriteHeart } from "@/components/tutorials/favorite-heart";
import type { Tutorial } from "@/lib/content/tutorials";

type Props = { items: Tutorial[] };

// Длительность у нас — реальное время процедуры из протокола устройства
// (минуты), а не длина видеоролика (видео ещё не снято) — поэтому формат
// "N мин", а не таймкод "5:30" как в референсе GESKE.
export function TutorialsScroll({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {items.map((t) => (
        <Link
          key={t.id}
          href={`/tutorials/${t.id}`}
          className="flex h-[200px] w-[160px] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)]"
        >
          <div className="h-[120px] shrink-0">
            <DeviceImage slug={t.deviceSlug} fill className="rounded-none" />
          </div>
          <div className="relative flex-1 p-3">
            <div className="flex items-center gap-1.5 pr-5">
              <DeviceImage slug={t.deviceSlug} size={20} className="shrink-0" />
              <p className="min-w-0 truncate text-[12px] font-semibold text-text">
                {t.title}
              </p>
            </div>
            <p className="mt-1.5 text-[10px] text-text-muted">
              {t.durationMinutes} мин
            </p>
            <FavoriteHeart
              tutorialId={t.id}
              size={16}
              className="absolute bottom-3 right-3"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
