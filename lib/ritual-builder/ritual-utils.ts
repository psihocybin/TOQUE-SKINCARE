import type { DeviceRitualConfig, RitualSchedule } from "@/lib/actions/rituals";
import { getProtocolBySlug } from "@/lib/content/protocols";
import {
  resolveSessionTimeSlot,
  type SessionTimeSlot,
  type TodayProcedure,
} from "@/lib/program/utils";
import type { Json, Profile } from "@/lib/supabase/database.types";
import { WEEKDAYS, type Weekday } from "./types";

export function todayWeekday(date: Date = new Date()): Weekday {
  const jsDay = date.getDay(); // 0=вс...6=сб
  return WEEKDAYS[jsDay === 0 ? 6 : jsDay - 1] ?? "mon";
}

// rituals.schedule приходит из БД как Json (jsonb, без схемы) — защищаемся
// от записей неожиданной формы тем же способом, что и раньше custom_schedule.
export function asRitualSchedule(schedule: Json): RitualSchedule {
  return Array.isArray(schedule) ? (schedule as unknown as RitualSchedule) : [];
}

export type RitualTodayItem = {
  deviceSlug: string;
  modeName: string;
  displayName: string;
  sessionTime: Profile["preferred_time"];
  color: string;
};

export function getTodayFromRitual(
  schedule: RitualSchedule,
  date: Date = new Date(),
): RitualTodayItem[] {
  const today = todayWeekday(date);

  const result: RitualTodayItem[] = [];
  for (const deviceConfig of schedule) {
    for (const mode of deviceConfig.modes) {
      if (mode.days.includes(today)) {
        result.push({
          deviceSlug: deviceConfig.deviceSlug,
          modeName: mode.modeName,
          displayName: mode.displayName,
          sessionTime: mode.sessionTime,
          color: deviceConfig.color,
        });
      }
    }
  }
  return result;
}

// Группа времени суток переиспользует resolveSessionTimeSlot: сигнатура
// ModeSchedule.sessionTime ("morning"|"evening"|"flexible") совпадает с
// Profile["preferred_time"] — "flexible" бакетится по текущему часу так же,
// как это уже делает Home для drip-кампании.
export function resolveRitualSessionGroup(
  item: RitualTodayItem,
  now: Date = new Date(),
): SessionTimeSlot {
  return resolveSessionTimeSlot(item.sessionTime, now);
}

const WEEKDAY_ADVERBIAL: Record<Weekday, string> = {
  mon: "в понедельник",
  tue: "во вторник",
  wed: "в среду",
  thu: "в четверг",
  fri: "в пятницу",
  sat: "в субботу",
  sun: "в воскресенье",
};

export function getNextScheduledRitualDayLabel(schedule: RitualSchedule): string | null {
  const scheduledDays = new Set<Weekday>(
    schedule.flatMap((c) => c.modes.flatMap((m) => m.days)),
  );
  if (scheduledDays.size === 0) return null;

  const todayIndex = WEEKDAYS.indexOf(todayWeekday());
  for (let offset = 1; offset <= 7; offset++) {
    const day = WEEKDAYS[(todayIndex + offset) % 7];
    if (day && scheduledDays.has(day)) return WEEKDAY_ADVERBIAL[day];
  }
  return null;
}

export type RitualWeekTag = { label: string; deviceSlug: string };
export type RitualWeekCell = { weekday: Weekday; tags: RitualWeekTag[] };

// Недельная сетка тегов для мини-календаря (конструктор, экран "сохранён",
// карточка в списке ритуалов, /ritual-home) — один и тот же билдер для всех,
// т.к. везде нужен один и тот же разбор schedule по дням недели. Цвет тега
// не кладём сюда — компонент-рендерер сам берёт его по deviceSlug из
// lib/content/device-colors.ts (единый источник, не расходится с
// device.color, сохранённым в schedule на момент создания ритуала).
export function buildRitualWeekCells(
  schedule: RitualSchedule,
  abbreviateMode: (displayName: string) => string,
): RitualWeekCell[] {
  return WEEKDAYS.map((weekday) => {
    const tags: RitualWeekTag[] = [];
    for (const deviceConfig of schedule) {
      for (const mode of deviceConfig.modes) {
        if (mode.days.includes(weekday)) {
          tags.push({
            label: abbreviateMode(mode.displayName),
            deviceSlug: deviceConfig.deviceSlug,
          });
        }
      }
    }
    return { weekday, tags };
  });
}

export type RitualSequenceStep = {
  deviceSlug: string;
  modeName: string;
  displayName: string;
};

// "Последовательность" на экране "Ритуал сохранён" — не порядок процедур
// внутри одного дня (разные режимы могут стоять на разных днях, как в
// примере из мокапа: Очищение пн/ср/пт + Лифтинг вт/чт), а обзорный список
// всех настроенных пар устройство+режим в порядке их добавления в ритуал.
export function buildRitualSequence(schedule: RitualSchedule): RitualSequenceStep[] {
  const steps: RitualSequenceStep[] = [];
  for (const deviceConfig of schedule) {
    for (const mode of deviceConfig.modes) {
      if (mode.days.length === 0) continue;
      steps.push({
        deviceSlug: deviceConfig.deviceSlug,
        modeName: mode.modeName,
        displayName: mode.displayName,
      });
    }
  }
  return steps;
}

export function countConfiguredDevices(schedule: RitualSchedule): number {
  return schedule.filter((c) => c.modes.some((m) => m.days.length > 0)).length;
}

export function countProceduresPerWeek(schedule: RitualSchedule): number {
  return schedule.reduce(
    (sum, c) => sum + c.modes.reduce((s, m) => s + m.days.length, 0),
    0,
  );
}

export function isDeviceConfigured(deviceConfig: DeviceRitualConfig | undefined): boolean {
  return Boolean(deviceConfig?.modes.some((m) => m.days.length > 0));
}

// Приводит сегодняшние пункты ритуала к TodayProcedure — тому же типу, что
// и у drip-campaign пути (getAllTodayProcedures в program/utils.ts). Даёт
// переиспользовать DeviceProcedureCard/TodaySessionSection без изменений
// для обеих систем.
export function resolveRitualProcedures(items: RitualTodayItem[]): TodayProcedure[] {
  const results: TodayProcedure[] = [];
  for (const item of items) {
    const protocol = getProtocolBySlug(item.deviceSlug);
    const mode = protocol?.modes.find((m) => m.name === item.modeName);
    if (!protocol || !mode) continue;
    results.push({
      deviceSlug: item.deviceSlug,
      modeName: mode.displayName ?? mode.name,
      durationMinutes: mode.durationMinutes,
      medium: mode.medium,
      hasElectricCurrent: mode.hasElectricCurrent,
      isRestDay: false,
      sessionTime: resolveRitualSessionGroup(item),
    });
  }
  return results;
}
