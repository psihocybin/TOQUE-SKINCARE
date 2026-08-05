import Link from "next/link";
import { Camera, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { RingProgress } from "@/components/shared/ring-progress";
import { HeroTodayCard } from "@/components/home/hero-today-card";
import { AttendanceCard } from "@/components/home/attendance-card";
import { TutorialsScroll } from "@/components/home/tutorials-scroll";
import { RecommendedDevicesScroll } from "@/components/home/recommended-devices-scroll";
import { PushPermission } from "@/components/pwa/push-permission";
import { IosInstallHint } from "@/components/pwa/ios-install-hint";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getAttendance } from "@/lib/queries/attendance";
import { getTodayProgramItem, greetingByTime } from "@/lib/program/utils";
import { DRIP_CAMPAIGN } from "@/lib/content/drip-campaign";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";
import { tutorials } from "@/lib/content/tutorials";
import { QuizSyncOnMount } from "./quiz-sync";

const TOTAL_PROCEDURE_DAYS = DRIP_CAMPAIGN.filter(
  (d) => d.type === "procedure",
).length;

export default async function HomePage() {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();

  // Раньше незаполненный профиль (например, вошли через Google/Apple без
  // прохождения квиза) редиректило на /quiz/device автоматически. Теперь
  // квиз идёт ДО регистрации, поэтому попадание сюда с пустым именем — это
  // либо OAuth-вход в обход квиза, либо квиз ещё не досинхронизировался
  // (см. QuizSyncOnMount ниже). Вместо петли редиректов — баннер.
  const isSetupIncomplete = !profile.name.trim();

  const today = getTodayProgramItem(profile.activated_at);
  const greeting = greetingByTime();

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
        <HeroTodayCard
          deviceSlug={activeSlug}
          deviceName={activeDevice?.name ?? activeSlug.toUpperCase()}
          currentDay={currentDay}
          todayItem={today}
        />
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

      <PushPermission />
      <IosInstallHint />
    </main>
  );
}
