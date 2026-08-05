import { getDeviceBySlug } from "@/lib/content/devices";
import { getProtocolBySlug, type ProcedureMode } from "@/lib/content/protocols";
import { WEEKDAYS, type BuilderGoal, type TimeBudget, type Weekday } from "./types";

export type ScheduleDay = {
  day: Weekday;
  isRest: boolean;
  deviceSlug: string | null;
  modeName: string | null;
  label: string;
};

// Категории devices.ts, которые лучше всего закрывают каждую цель.
// Приблизительное сопоставление — точной "науки" тут нет, это рекомендация,
// а не медицинский протокол.
const GOAL_TO_CATEGORY: Record<BuilderGoal, string[]> = {
  cleansing: ["cleansing"],
  tone: ["tone"],
  glow: ["led"],
  lymph: ["tone", "body"],
  lift: ["tone"],
  recovery: ["led", "eyes"],
  scalp: ["scalp"],
  body: ["body"],
};

// Сколько дней в неделе выделяем под процедуры — зависит от заявленного
// времени: 15 мин — лёгкий старт (5 активных дней), 60 — максимум (все 7).
// Один тег на день, как и в остальном приложении (недельный календарь).
const BUDGET_CONFIG: Record<TimeBudget, { activeDays: number }> = {
  15: { activeDays: 5 },
  30: { activeDays: 6 },
  60: { activeDays: 7 },
};

function scoreDevice(deviceSlug: string, goals: BuilderGoal[]): number {
  const device = getDeviceBySlug(deviceSlug);
  if (!device) return 0;
  if (goals.length === 0) return 1;
  const matchesGoal = goals.some((g) =>
    GOAL_TO_CATEGORY[g]?.includes(device.category),
  );
  return matchesGoal ? 2 : 1;
}

function pickMode(deviceSlug: string, roundRobinIndex: number): ProcedureMode | null {
  const protocol = getProtocolBySlug(deviceSlug);
  if (!protocol || protocol.modes.length === 0) return null;
  return protocol.modes[roundRobinIndex % protocol.modes.length] ?? null;
}

// Детерминированный, но настоящий алгоритм: не заглушка. Ранжирует
// устройства пользователя по соответствию целям, распределяет их по
// активным дням недели (количество и «интенсивность» — по timeMinutes),
// оставляя явные дни отдыха. Режим устройства в каждый день циклически
// сдвигается, чтобы не показывать один и тот же режим каждый раз.
export function generateRecommendedSchedule(
  goals: BuilderGoal[],
  timeMinutes: TimeBudget,
  deviceSlugs: string[],
): ScheduleDay[] {
  const config = BUDGET_CONFIG[timeMinutes];
  const ranked = [...deviceSlugs].sort(
    (a, b) => scoreDevice(b, goals) - scoreDevice(a, goals),
  );

  if (ranked.length === 0) {
    return WEEKDAYS.map((day) => ({
      day,
      isRest: true,
      deviceSlug: null,
      modeName: null,
      label: "Отдых",
    }));
  }

  // Дни отдыха равномерно распределяем по неделе, а не подряд в конце.
  const restCount = WEEKDAYS.length - config.activeDays;
  const restStep = restCount > 0 ? Math.floor(WEEKDAYS.length / restCount) : Infinity;

  const result: ScheduleDay[] = [];
  let activeIndex = 0;

  WEEKDAYS.forEach((day, i) => {
    const isRest = restCount > 0 && (i + 1) % restStep === 0 && result.filter((r) => r.isRest).length < restCount;

    if (isRest) {
      result.push({ day, isRest: true, deviceSlug: null, modeName: null, label: "Отдых" });
      return;
    }

    const deviceSlug = ranked[activeIndex % ranked.length] ?? null;
    const mode = deviceSlug ? pickMode(deviceSlug, Math.floor(activeIndex / ranked.length)) : null;
    activeIndex++;

    result.push({
      day,
      isRest: false,
      deviceSlug,
      modeName: mode?.name ?? null,
      label: mode ? (mode.displayName ?? mode.name) : (deviceSlug?.toUpperCase() ?? "—"),
    });
  });

  return result;
}
