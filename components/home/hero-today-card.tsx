import Link from "next/link";
import { DeviceImage } from "@/components/shared/device-image";

type Props = {
  deviceSlug: string;
};

// Показывается, когда 30-дневная программа завершена, а активного ритуала
// ещё нет — единственное оставшееся назначение этой карточки. Пока ритуал
// не создан, CTA ведёт в конструктор; как только ритуал есть и активен,
// вместо этой карточки на /home показывается RitualHeroCard.
export function HeroTodayCard({ deviceSlug }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative flex h-[140px] items-center justify-center bg-cream-dark">
        {deviceSlug ? <DeviceImage slug={deviceSlug} size={80} /> : null}
        <span className="absolute right-3 top-3 rounded-full bg-rose/20 px-2 py-0.5 text-[10px] text-rose/80">
          Поддерживающий режим
        </span>
      </div>

      <div className="p-4">
        <p className="text-[16px] font-semibold text-text">Программа завершена</p>
        <p className="mt-1 text-[12px] text-text-muted">Настройте свой ритуал</p>
        <Link
          href="/ritual-builder"
          className="mt-3 flex h-10 w-full items-center justify-center rounded-full bg-olive text-[13px] text-cream"
        >
          Создать ритуал
        </Link>
      </div>
    </div>
  );
}
