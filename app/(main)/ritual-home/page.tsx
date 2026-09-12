import Link from "next/link";
import { CheckCircle, Menu, Moon } from "lucide-react";
import { RingProgress } from "@/components/shared/ring-progress";
import { WeeklyCalendar, type WeekCell } from "@/components/ritual-home/weekly-calendar";
import { TodaySessionSection } from "@/components/home/today-session-section";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getProcedures } from "@/lib/queries/procedures";
import { getActiveRitual } from "@/lib/actions/rituals";
import {
  getAllTodayProcedures,
  getProceduresForDay,
  getProgramStatus,
  type SessionTimeSlot,
  type TodayProcedure,
} from "@/lib/program/utils";
import { deviceEnumToSlug } from "@/lib/content/devices";
import { abbreviateMode } from "@/lib/content/device-colors";
import {
  asRitualSchedule,
  buildRitualWeekCells,
  getNextScheduledRitualDayLabel,
  getTodayFromRitual,
  resolveRitualProcedures,
} from "@/lib/ritual-builder/ritual-utils";
import { WEEKDAYS } from "@/lib/ritual-builder/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const SLOT_ORDER: SessionTimeSlot[] = ["morning", "day", "evening"];

// Дни программы (drip-campaign) не размечены по устройству — календарь для
// этого пути строится через getProceduresForDay на каждый день недели,
// то же, чем считается «сегодня» без активного ритуала.
function buildDripWeekCells(ownedSlugs: string[], activatedAt: string): WeekCell[] {
  const activated = new Date(activatedAt);
  activated.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(monday.getDate() + (dow === 0 ? -6 : 1 - dow));

  return WEEKDAYS.map((wd, i) => {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    const programDay = Math.floor((date.getTime() - activated.getTime()) / MS_PER_DAY) + 1;

    if (programDay < 1 || programDay > 30) return { weekday: wd, tags: [] };

    const procedures = getProceduresForDay(ownedSlugs, programDay).filter((p) => !p.isRestDay);
    return {
      weekday: wd,
      tags: procedures.map((p) => ({ label: abbreviateMode(p.modeName), deviceSlug: p.deviceSlug })),
    };
  });
}

function groupBySlot(procedures: TodayProcedure[]) {
  return SLOT_ORDER.map((slot) => ({
    slot,
    procedures: procedures.filter((p) => p.sessionTime === slot),
  })).filter((g) => g.procedures.length > 0);
}

export default async function RitualHomePage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const { profile, currentDay } = await getProfileWithStats();
  // currentDay уже кэпнут на [1,30] — им нельзя отличить день 31 от дня 45.
  // isCompleted из getProgramStatus — единственный корректный сигнал.
  const status = getProgramStatus(profile.activated_at);
  const activeRitual = await getActiveRitual();

  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];

  const procedures = await getProcedures(profile.id);
  const completedDays = new Set(procedures.map((p) => p.day_number)).size;
  // procedures не хранит, с каким устройством связана запись — поэтому
  // «сделано сегодня» относится к дню в целом, не к конкретному прибору.
  const doneToday = procedures.some((p) => p.day_number === currentDay);

  const ritualSchedule = activeRitual ? asRitualSchedule(activeRitual.schedule) : null;

  let weekCells: WeekCell[];
  let sessionGroups: ReturnType<typeof groupBySlot>;
  let nextScheduledLabel: string | null = null;

  if (ritualSchedule) {
    const todayProcedures = resolveRitualProcedures(getTodayFromRitual(ritualSchedule));
    sessionGroups = groupBySlot(todayProcedures);
    weekCells = buildRitualWeekCells(ritualSchedule, abbreviateMode);
    nextScheduledLabel = getNextScheduledRitualDayLabel(ritualSchedule);
  } else {
    const todayProcedures = getAllTodayProcedures(profile).filter((p) => !p.isRestDay);
    sessionGroups = groupBySlot(todayProcedures);
    weekCells = buildDripWeekCells(ownedSlugs, profile.activated_at);
  }

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-6">
      <div className="rounded-2xl border border-olive/20 bg-white/60 px-4 pb-5 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-md">
        {activeRitual ? (
          <div className="flex items-center justify-between">
            <span className="w-4" aria-hidden />
            <p className="truncate text-[14px] font-bold text-text">{activeRitual.name}</p>
            <Link href="/my-rituals" aria-label="Мои ритуалы" className="text-text-muted">
              <Menu className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        ) : (
          <p className="text-center text-[9px] uppercase tracking-[2px] text-text-muted">
            Моя программа
          </p>
        )}

        <div className="mt-3 flex justify-center">
          <RingProgress
            value={status.isCompleted ? 30 : completedDays}
            max={30}
            size={80}
            strokeWidth={6}
          >
            {status.isCompleted ? (
              <CheckCircle className="h-7 w-7 text-olive" strokeWidth={1.75} aria-hidden />
            ) : (
              <>
                <span className="text-[20px] leading-none text-text">{completedDays}</span>
                <span className="text-[10px] text-text-muted">из 30</span>
              </>
            )}
          </RingProgress>
        </div>
        {status.isCompleted ? (
          <p className="mt-2 text-center text-[11px] text-text-muted">
            Программа завершена · день {status.daysPastCompletion + 30}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {searchParams.saved === "1" ? (
          <p className="rounded-xl border border-olive/20 bg-white/60 px-4 py-2.5 text-center text-[12px] text-olive-dark backdrop-blur-md">
            ✓ Ритуал сохранён
          </p>
        ) : null}

        {status.isCompleted && !activeRitual ? (
          <div className="rounded-xl border border-olive/20 bg-white/60 p-4 backdrop-blur-md">
            <p className="text-[14px] font-semibold text-text">Онбординг завершён</p>
            <p className="mt-1 text-[12px] text-text-muted">
              Теперь вы работаете в поддерживающем режиме.
            </p>
            <Link
              href="/ritual-builder"
              className="mt-3 inline-flex h-9 items-center justify-center rounded-full bg-olive px-4 text-[12px] text-cream"
            >
              Открыть конструктор
            </Link>
          </div>
        ) : sessionGroups.length === 0 ? (
          <div className="rounded-2xl bg-cream-dark p-4 text-center">
            <Moon className="mx-auto h-6 w-6 text-text-muted" strokeWidth={1.5} aria-hidden />
            {activeRitual ? (
              <>
                <p className="mt-2 text-[13px] text-text">Сегодня в ритуале нет процедур</p>
                {nextScheduledLabel ? (
                  <p className="mt-1 text-[11px] text-text-muted">
                    Ближайшая — {nextScheduledLabel}. Расписание — ниже, в календаре.
                  </p>
                ) : null}
              </>
            ) : ownedSlugs.length === 0 ? (
              <>
                <p className="mt-2 text-[13px] text-text">Пока нет активных устройств</p>
                <Link
                  href="/my-devices"
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-full border border-olive/40 px-4 text-[12px] text-olive"
                >
                  Добавить устройство
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-[13px] text-text">Сегодня — день отдыха</p>
                <p className="mt-1 text-[11px] text-text-muted">
                  Кожа работает, пока вы отдыхаете
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessionGroups.map((g) => (
              <TodaySessionSection
                key={g.slot}
                slot={g.slot}
                procedures={g.procedures}
                doneToday={doneToday}
              />
            ))}
          </div>
        )}

        <WeeklyCalendar cells={weekCells} />

        {!activeRitual ? (
          <Link
            href="/ritual-builder"
            className="text-center text-[12px] text-olive underline underline-offset-2"
          >
            + Создать ритуал
          </Link>
        ) : null}
      </div>
    </main>
  );
}
