import Link from "next/link";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { WeeklyBars } from "@/components/progress/weekly-bars";
import { getProfileWithStats } from "@/lib/queries/profile";
import {
  computeWeeklyStats,
  getProcedures,
} from "@/lib/queries/procedures";
import {
  createSignedPhotoUrl,
  getBaselinePhoto,
  getPhotos,
} from "@/lib/queries/photos";
import { PLURAL_DAYS, pluralRu } from "@/lib/utils/format";

export default async function ProgressPage() {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();

  const procedures = await getProcedures(profile.id);
  const photos = await getPhotos(profile.id);
  const baseline = await getBaselinePhoto(profile.id);

  const weeklyStats = computeWeeklyStats(procedures);
  const currentWeek = Math.min(4, Math.max(1, Math.ceil(currentDay / 7)));

  const latestPhoto =
    photos.filter((p) => p.day_number > 0).at(-1) ?? null;

  const [baselineUrl, latestUrl] = await Promise.all([
    baseline ? createSignedPhotoUrl(baseline.storage_path) : Promise.resolve(null),
    latestPhoto
      ? createSignedPhotoUrl(latestPhoto.storage_path)
      : Promise.resolve(null),
  ]);

  const hasAnyPhoto = Boolean(baseline || latestPhoto);

  return (
    <main className="flex min-h-screen flex-col px-5 pb-24 pt-6">
      <FadeIn>
        <h1 className="text-[17px] text-text">Прогресс</h1>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-6">
        <div className="rounded-lg border border-black/8 bg-white px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Процедур выполнено
          </p>
          <div className="mt-3 flex items-end justify-between">
            <p className="leading-none">
              <span className="text-[30px] text-text">
                {completedProcedures}
              </span>
              <span className="ml-1 text-[13px] text-text-muted">
                / {currentDay}
              </span>
            </p>
            <p className="text-[9px] text-text-muted">
              за {currentDay} {pluralRu(currentDay, PLURAL_DAYS)}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.3} className="mt-8">
        <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
          Фото-сравнение
        </p>
        <div className="mt-3 flex gap-2">
          <PhotoSquare
            url={baselineUrl}
            dayLabel="День 1"
            alt="Фото первого дня программы"
          />
          <PhotoSquare
            url={latestUrl}
            dayLabel={
              latestPhoto ? `День ${latestPhoto.day_number}` : "—"
            }
            alt="Последнее фото"
          />
        </div>
        {!hasAnyPhoto ? (
          <Button
            asChild
            variant="outline"
            className="mt-4 h-10 w-full text-[11px]"
          >
            <Link href="/photo/capture">Сделать фото</Link>
          </Button>
        ) : null}
      </FadeIn>

      <FadeIn delay={0.45} className="mt-8">
        <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
          По неделям
        </p>
        <WeeklyBars stats={weeklyStats} currentWeek={currentWeek} />
      </FadeIn>
    </main>
  );
}

type PhotoSquareProps = {
  url: string | null;
  dayLabel: string;
  alt: string;
};

function PhotoSquare({ url, dayLabel, alt }: PhotoSquareProps) {
  return (
    <div className="flex-1">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className="h-[115px] w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-[115px] w-full items-center justify-center rounded-lg bg-rose/[0.12]">
          <span className="text-[9px] text-text-muted">фото</span>
        </div>
      )}
      <p className="mt-1.5 text-center text-[9px] text-text-muted">
        {dayLabel}
      </p>
    </div>
  );
}
