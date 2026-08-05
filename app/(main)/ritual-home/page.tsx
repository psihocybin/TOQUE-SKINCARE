import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { RingProgress } from "@/components/shared/ring-progress";
import { WeeklyCalendar, type WeekCell } from "@/components/ritual-home/weekly-calendar";
import { TaskCard } from "@/components/ritual-home/task-card";
import { RitualBuilderForm } from "@/components/ritual-builder/ritual-builder-form";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getProcedures } from "@/lib/queries/procedures";
import { getModeForDevice, getTodayProgramItem } from "@/lib/program/utils";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";
import { DRIP_CAMPAIGN } from "@/lib/content/drip-campaign";
import { WEEKDAYS, type CustomSchedule } from "@/lib/ritual-builder/types";
import { cn } from "@/lib/utils";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}

function buildWeekCells(activatedAt: string): WeekCell[] {
  const activated = new Date(activatedAt);
  activated.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = mondayOf(today);

  return WEEKDAYS.map((wd, i) => {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    const programDay = Math.floor((date.getTime() - activated.getTime()) / MS_PER_DAY) + 1;
    const entry = programDay >= 1 && programDay <= 30 ? DRIP_CAMPAIGN[programDay - 1] : undefined;
    return { weekday: wd, isToday: date.getTime() === today.getTime(), entry };
  });
}

export default async function RitualHomePage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const { profile, currentDay } = await getProfileWithStats();
  const isOnboarding = currentDay <= 30;
  const activeTab =
    searchParams.tab === "constructor" || searchParams.tab === "my-program"
      ? searchParams.tab
      : isOnboarding
        ? "my-program"
        : "constructor";

  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];
  const deviceOfDaySlug =
    ownedSlugs.length > 0 ? ownedSlugs[(currentDay - 1) % ownedSlugs.length] : null;
  const activeSlug = deviceOfDaySlug ?? primarySlug ?? "";

  const ownedDevices = ownedSlugs
    .map((slug) => getDeviceBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({ slug: d.slug, name: d.name }));

  const procedures = await getProcedures(profile.id);
  const completedDays = new Set(procedures.map((p) => p.day_number)).size;
  const doneToday = procedures.some((p) => p.day_number === currentDay);

  const today = getTodayProgramItem(profile.activated_at);
  const isRestDay = today.type !== "procedure" || !today.procedure;
  const mode = !isRestDay && activeSlug ? getModeForDevice(activeSlug, currentDay) : null;

  const weekCells = buildWeekCells(profile.activated_at);
  const initialSchedule = (profile.custom_schedule as CustomSchedule | null) ?? null;

  const showMorning = profile.preferred_time === "morning";
  const showEvening =
    profile.preferred_time === "evening" ||
    profile.preferred_time === "flexible" ||
    !profile.preferred_time;

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-6">
      <p className="text-center text-[9px] uppercase tracking-[2px] text-text-muted">
        Моя программа
      </p>

      <div className="mt-3 flex justify-center">
        <RingProgress value={completedDays} max={30} size={80} strokeWidth={6}>
          <span className="text-[20px] leading-none text-text">{completedDays}</span>
          <span className="text-[10px] text-text-muted">из 30</span>
        </RingProgress>
      </div>

      <div className="mx-auto mt-5 flex rounded-full bg-black/[0.04] p-1">
        <Link
          href="/ritual-home?tab=my-program"
          className={cn(
            "rounded-full px-4 py-1.5 text-[12px] transition-colors",
            activeTab === "my-program" ? "bg-olive text-cream" : "text-text-muted",
          )}
        >
          Моя программа
        </Link>
        <Link
          href="/ritual-home?tab=constructor"
          className={cn(
            "rounded-full px-4 py-1.5 text-[12px] transition-colors",
            activeTab === "constructor" ? "bg-olive text-cream" : "text-text-muted",
          )}
        >
          Конструктор
        </Link>
      </div>

      {activeTab === "my-program" ? (
        <div className="mt-6 flex flex-col gap-5">
          {isRestDay ? (
            <div className="rounded-2xl bg-cream-dark p-4 text-center">
              <Moon className="mx-auto h-6 w-6 text-text-muted" strokeWidth={1.5} aria-hidden />
              <p className="mt-2 text-[13px] text-text">Кожа отдыхает</p>
              <Link
                href="/ritual"
                className="mt-3 inline-flex h-9 items-center justify-center rounded-full border border-olive/40 px-4 text-[12px] text-olive"
              >
                Сделать всё равно
              </Link>
            </div>
          ) : (
            <>
              {showMorning ? (
                <section>
                  <div className="mb-2 flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-olive" strokeWidth={1.75} aria-hidden />
                    <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
                      Утро · 1 процедура
                    </p>
                  </div>
                  <TaskCard
                    deviceSlug={activeSlug}
                    mode={mode}
                    fallbackTitle={today.procedure?.title ?? "Процедура"}
                    fallbackDuration={today.procedure?.durationMinutes ?? 0}
                    isDone={doneToday}
                  />
                </section>
              ) : null}

              {showEvening ? (
                <section>
                  <div className="mb-2 flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-olive" strokeWidth={1.75} aria-hidden />
                    <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
                      Вечер · 1 процедура
                    </p>
                  </div>
                  <TaskCard
                    deviceSlug={activeSlug}
                    mode={mode}
                    fallbackTitle={today.procedure?.title ?? "Процедура"}
                    fallbackDuration={today.procedure?.durationMinutes ?? 0}
                    isDone={doneToday}
                  />
                </section>
              ) : null}
            </>
          )}

          <WeeklyCalendar cells={weekCells} />
        </div>
      ) : (
        <div className="mt-6">
          {!isOnboarding ? (
            <div className="mb-4 rounded-xl bg-olive/8 px-4 py-3">
              <p className="text-[9px] uppercase tracking-[1.5px] text-olive">
                Рекомендация TOQUE
              </p>
              <p className="mt-1 text-[12px] text-text">
                Программа онбординга завершена — соберите ритуал под себя.
              </p>
            </div>
          ) : null}
          <RitualBuilderForm
            ownedDevices={ownedDevices}
            initialSchedule={initialSchedule}
          />
        </div>
      )}
    </main>
  );
}
