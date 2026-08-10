import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, ChevronRight, Moon } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { RingProgress } from "@/components/shared/ring-progress";
import { HeroTodayCard } from "@/components/home/hero-today-card";
import { RitualHeroCard } from "@/components/home/ritual-hero-card";
import { TodaySessionSection } from "@/components/home/today-session-section";
import { AttendanceCard } from "@/components/home/attendance-card";
import { TutorialsScroll } from "@/components/home/tutorials-scroll";
import { ArticlesScroll } from "@/components/home/articles-scroll";
import { RecommendedDevicesScroll } from "@/components/home/recommended-devices-scroll";
import { PushPermission } from "@/components/pwa/push-permission";
import { IosInstallHint } from "@/components/pwa/ios-install-hint";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getProcedures } from "@/lib/queries/procedures";
import { getAttendance } from "@/lib/queries/attendance";
import {
  getAllTodayProcedures,
  getProgramStatus,
  greetingByTime,
  type SessionTimeSlot,
} from "@/lib/program/utils";
import { DRIP_CAMPAIGN } from "@/lib/content/drip-campaign";
import { getDailyTip } from "@/lib/content/daily-tips";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";
import { tutorials } from "@/lib/content/tutorials";
import { articles } from "@/lib/content/articles";
import { getActiveRitual } from "@/lib/actions/rituals";
import {
  asRitualSchedule,
  getNextScheduledRitualDayLabel,
  getTodayFromRitual,
} from "@/lib/ritual-builder/ritual-utils";
import { QuizSyncOnMount } from "./quiz-sync";

const SLOT_ORDER: SessionTimeSlot[] = ["morning", "day", "evening"];

const TOTAL_PROCEDURE_DAYS = DRIP_CAMPAIGN.filter(
  (d) => d.type === "procedure",
).length;

export default async function HomePage() {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();

  const status = getProgramStatus(profile.activated_at);

  // Показываем экран поздравления один раз, сразу как онбординг завершён.
  if (status.isCompleted && !profile.completion_celebrated) {
    redirect("/program-complete");
  }

  // Раньше незаполненный профиль (например, вошли через Google/Apple без
  // прохождения квиза) редиректило на /quiz/device автоматически. Теперь
  // квиз идёт ДО регистрации, поэтому попадание сюда с пустым именем — это
  // либо OAuth-вход в обход квиза, либо квиз ещё не досинхронизировался
  // (см. QuizSyncOnMount ниже). Вместо петли редиректов — баннер.
  const isSetupIncomplete = !profile.name.trim();

  const greeting = greetingByTime();
  // Совет дня продолжает ротацию и после завершения 30-дневной программы —
  // currentDay капается на 30, поэтому берём "сырой" день из daysPastCompletion.
  const rawDayForTip = status.isCompleted
    ? 30 + status.daysPastCompletion
    : currentDay;
  const dailyTip = getDailyTip(rawDayForTip);

  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];
  const deviceOfDaySlug =
    ownedSlugs.length > 0
      ? ownedSlugs[(currentDay - 1) % ownedSlugs.length]
      : null;
  const activeSlug = deviceOfDaySlug ?? primarySlug ?? "";
  const activeDevice = activeSlug ? getDeviceBySlug(activeSlug) : undefined;

  const recommendedDevices = (activeDevice?.pairsWith ?? [])
    .map((slug) => getDeviceBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const todaysTutorials = activeSlug
    ? tutorials.filter((t) => t.deviceSlug === activeSlug)
    : [];
  const tutorialsToShow =
    todaysTutorials.length > 0 ? todaysTutorials : tutorials.slice(0, 5);

  const attendance = await getAttendance(profile.id);

  const procedures = await getProcedures(profile.id);
  const doneToday = procedures.some((p) => p.day_number === currentDay);

  const activeRitual = await getActiveRitual();
  const ritualSchedule = activeRitual ? asRitualSchedule(activeRitual.schedule) : null;
  const ritualTodayItems = ritualSchedule ? getTodayFromRitual(ritualSchedule) : [];
  const ritualNextScheduledLabel = ritualSchedule
    ? getNextScheduledRitualDayLabel(ritualSchedule)
    : null;

  // Drip-campaign путь — только когда нет активного ритуала и программа
  // ещё не завершена. Разные устройства в drip-пути всегда на одном общем
  // времени суток, поэтому там всегда ровно одна секция.
  const activeToday =
    !ritualSchedule && !status.isCompleted
      ? getAllTodayProcedures(profile).filter((p) => !p.isRestDay)
      : [];
  const sessionGroups = SLOT_ORDER.map((slot) => ({
    slot,
    procedures: activeToday.filter((p) => p.sessionTime === slot),
  })).filter((g) => g.procedures.length > 0);

  const dayBadge = `День ${currentDay} из 30`;

  const trimmedName = profile.name.trim();
  const initial = (trimmedName[0] ?? "?").toUpperCase();

  return (
    <main className="flex min-h-screen flex-col pb-24 pt-6">
      <QuizSyncOnMount profileFilled={Boolean(profile.device)} />

      <FadeIn className="flex items-center justify-between px-4">
        <div>
          <p className="text-[12px] text-text-muted">{greeting},</p>
          <h1 className="text-[22px] font-bold text-text">
            {trimmedName || "Гостья"}
          </h1>
        </div>
        <Link
          href="/profile"
          aria-label="Профиль"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive/15"
        >
          <span className="text-[14px] text-olive">{initial}</span>
        </Link>
      </FadeIn>

      {isSetupIncomplete ? (
        <FadeIn delay={0.1} className="mx-4 mt-4">
          <Link
            href="/quiz/device"
            className="flex items-center justify-between rounded-lg border border-olive/30 bg-olive/[0.06] px-4 py-4 transition-colors hover:bg-olive/[0.1]"
          >
            <div>
              <p className="text-[9px] uppercase tracking-[1.5px] text-olive">
                Завершите настройку
              </p>
              <p className="mt-1 text-[12px] text-text">
                Пройдите квиз — получите персональную программу
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-olive" aria-hidden />
          </Link>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.1} className="mx-4 mt-4">
        {ritualSchedule ? (
          <RitualHeroCard
            items={ritualTodayItems}
            nextScheduledLabel={ritualNextScheduledLabel}
          />
        ) : status.isCompleted ? (
          <HeroTodayCard deviceSlug={activeSlug} />
        ) : activeToday.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <Moon
              className="mx-auto h-6 w-6 text-text-muted"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="mt-2 text-[14px] font-semibold text-text">
              Сегодня — день отдыха
            </p>
            <p className="mt-1 text-[12px] text-text-muted">
              Кожа работает, пока вы отдыхаете
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessionGroups.map((g, i) => (
              <TodaySessionSection
                key={g.slot}
                slot={g.slot}
                procedures={g.procedures}
                doneToday={doneToday}
                dayBadge={i === 0 ? dayBadge : undefined}
              />
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.15} className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <Link
          href="/ritual-home"
          className="flex aspect-[1.3] flex-col rounded-2xl bg-olive/8 p-4"
        >
          <p className="text-[11px] text-text-muted">Персональный уход</p>
          <p className="mt-1 text-[16px] font-bold text-text">Мой ритуал</p>
          <div className="mt-auto flex justify-end">
            <RingProgress
              value={completedProcedures}
              max={TOTAL_PROCEDURE_DAYS}
              size={40}
              strokeWidth={4}
            />
          </div>
        </Link>
        <Link
          href="/progress"
          className="flex aspect-[1.3] flex-col rounded-2xl bg-rose/8 p-4"
        >
          <p className="text-[11px] text-text-muted">До и после</p>
          <p className="mt-1 text-[16px] font-bold text-text">Фото прогресс</p>
          <div className="mt-auto flex justify-end">
            <Camera className="h-7 w-7 text-rose" strokeWidth={1.5} aria-hidden />
          </div>
        </Link>
      </FadeIn>

      <FadeIn delay={0.2} className="mx-4 mt-4">
        <AttendanceCard
          last7Days={attendance.last7Days}
          streak={attendance.streak}
        />
      </FadeIn>

      {tutorialsToShow.length > 0 ? (
        <FadeIn delay={0.25} className="mt-4">
          <div className="mb-3 flex items-center justify-between px-4">
            <p className="text-[16px] font-bold text-text">Туториалы</p>
            <Link href="/tutorials" className="text-[12px] text-olive">
              Все →
            </Link>
          </div>
          <div className="px-4">
            <TutorialsScroll items={tutorialsToShow} />
          </div>
        </FadeIn>
      ) : null}

      {recommendedDevices.length > 0 ? (
        <FadeIn delay={0.3} className="mt-4">
          <p className="mb-3 px-4 text-[16px] font-bold text-text">
            Может вам понравится
          </p>
          <div className="px-4">
            <RecommendedDevicesScroll devices={recommendedDevices} />
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.35} className="mx-4 mt-4">
        <div className="rounded-lg border border-black/8 bg-white px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Совет дня
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-text">
            {dailyTip}
          </p>
        </div>
      </FadeIn>

      {articles.length > 0 ? (
        <FadeIn delay={0.4} className="mt-4">
          <div className="mb-3 flex items-center justify-between px-4">
            <p className="text-[16px] font-bold text-text">Статьи</p>
            <Link href="/articles" className="text-[12px] text-olive">
              Все →
            </Link>
          </div>
          <div className="px-4">
            <ArticlesScroll items={articles} />
          </div>
        </FadeIn>
      ) : null}

      <PushPermission />
      <IosInstallHint />
    </main>
  );
}
