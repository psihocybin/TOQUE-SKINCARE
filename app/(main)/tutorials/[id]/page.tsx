import { notFound } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { DeviceImage } from "@/components/shared/device-image";
import { FavoriteHeart } from "@/components/tutorials/favorite-heart";
import { getDeviceBySlug } from "@/lib/content/devices";
import {
  getTutorialById,
  getTutorialsByDevice,
  tutorialDeviceLabel,
} from "@/lib/content/tutorials";
import { cn } from "@/lib/utils";

export default function TutorialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tutorial = getTutorialById(params.id);
  if (!tutorial) notFound();

  const device = getDeviceBySlug(tutorial.deviceSlug);
  const deviceLabel = tutorialDeviceLabel(
    tutorial.deviceSlug,
    device?.name ?? tutorial.deviceSlug.toUpperCase(),
  );
  const otherTutorials = getTutorialsByDevice(tutorial.deviceSlug).filter(
    (t) => t.id !== tutorial.id,
  );
  const compatibleDevices = (device?.pairsWith ?? [])
    .map((slug) => getDeviceBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <main className="flex min-h-screen flex-col pb-24 pt-4">
      <header className="relative flex items-center justify-center px-4">
        <div className="absolute left-2 top-0">
          <BackButton href="/tutorials" />
        </div>
        <p className="max-w-[220px] truncate text-[14px] text-text">
          {tutorial.title}
        </p>
      </header>

      <div className="mx-4 mt-4 flex aspect-video items-center justify-center rounded-xl bg-black">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
          <Play className="h-6 w-6 translate-x-[1px] text-white" fill="currentColor" strokeWidth={0} />
        </span>
      </div>

      {tutorial.steps.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {tutorial.steps.map((_, i) => (
            <span
              key={i}
              className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-olive" : "bg-black/15")}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-2 px-4">
        <DeviceImage slug={tutorial.deviceSlug} size={28} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-text">{deviceLabel}</p>
          <p className="text-[10px] text-text-muted">{tutorial.durationMinutes} мин</p>
        </div>
        <FavoriteHeart tutorialId={tutorial.id} size={20} />
      </div>
      <p className="mt-2 px-4 text-[12px] leading-relaxed text-text-muted">
        {tutorial.description}
      </p>

      {tutorial.steps.length > 0 ? (
        <section className="mt-6">
          <p className="px-4 text-[9px] uppercase tracking-[2px] text-text-muted">
            Как использовать
          </p>
          <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
            {tutorial.steps.map((step, i) => (
              <div
                key={i}
                className="relative flex aspect-[4/3] w-[240px] shrink-0 snap-center flex-col justify-end rounded-xl bg-cream-dark p-4"
              >
                <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-[9px] text-text">
                  Шаг {i + 1}
                </span>
                {step.isImportant ? (
                  <span className="absolute right-3 top-3 rounded-full bg-rose/15 px-2 py-0.5 text-[9px] text-rose">
                    Важно
                  </span>
                ) : null}
                <p className="text-[16px] font-bold leading-snug text-text">
                  {step.title}
                </p>
                {step.description ? (
                  <p className="mt-1 text-[13px] text-text-muted">
                    {step.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="mx-4 mt-6 rounded-xl bg-cream-dark px-4 py-3 text-[12px] text-text-muted">
          Пошаговый протокол уточняется — появится после проверки у специалиста.
        </p>
      )}

      {otherTutorials.length > 0 ? (
        <section className="mt-6">
          <p className="px-4 text-[9px] uppercase tracking-[2px] text-text-muted">
            Другие туториалы {deviceLabel}
          </p>
          <div className="mt-3 flex flex-col gap-2 px-4">
            {otherTutorials.map((t) => (
              <Link
                key={t.id}
                href={`/tutorials/${t.id}`}
                className="flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm"
              >
                <div
                  className={cn(
                    "flex h-[64px] w-[80px] shrink-0 items-center justify-center rounded-lg",
                    t.thumbnailPlaceholder,
                  )}
                >
                  <DeviceImage slug={t.deviceSlug} size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-text">{t.title}</p>
                  <p className="text-[10px] text-text-muted">{t.durationMinutes} мин</p>
                </div>
                <FavoriteHeart tutorialId={t.id} size={16} className="mr-1 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {compatibleDevices.length > 0 ? (
        <section className="mt-6 px-4">
          <p className="text-[9px] uppercase tracking-[2px] text-text-muted">
            Подходящие устройства
          </p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {compatibleDevices.map((d) => (
              <div
                key={d.slug}
                className="flex w-[110px] shrink-0 flex-col items-center rounded-xl bg-white p-3 text-center shadow-sm"
              >
                <DeviceImage slug={d.slug} size={44} />
                <p className="mt-2 text-[11px] font-semibold text-text">{d.name}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {device ? (
        <div className="mx-4 mt-6">
          <a
            href={device.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full items-center justify-center rounded-full bg-olive text-[13px] text-cream"
          >
            Перейти к покупке
          </a>
        </div>
      ) : null}
    </main>
  );
}
