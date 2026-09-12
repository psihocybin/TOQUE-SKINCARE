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
          className="flex w-[160px] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)]"
        >
          <div className="relative h-[130px] shrink-0">
            <DeviceImage slug={t.deviceSlug} fill className="rounded-none" />
            <FavoriteHeart
              tutorialId={t.id}
              size={14}
              className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="px-3 py-2">
            <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-text">
              {t.title}
            </p>
            <p className="mt-1 text-[10px] text-text-muted">
              {t.durationMinutes} мин
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
