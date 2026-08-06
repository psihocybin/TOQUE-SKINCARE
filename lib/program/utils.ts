import { DRIP_CAMPAIGN, type ProgramDay } from "@/lib/content/drip-campaign";
import {
  getProtocolBySlug,
  type DeviceProtocol,
  type ProcedureMode,
} from "@/lib/content/protocols";
import { deviceEnumToSlug } from "@/lib/content/devices";
import type { Profile } from "@/lib/supabase/database.types";

const PROGRAM_LENGTH = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function toMidnight(date: Date): Date {
  const out = new Date(date);
  out.setHours(0, 0, 0, 0);
  return out;
}

// Некэпнутый номер дня программы — общий для getCurrentDayNumber (кэпает
// на [1, 30] для всего, что индексирует drip-campaign) и getProgramStatus
// (которому важно значение И ПОСЛЕ 30, чтобы отличить день 31 от дня 45).
// Midnight-нормализация обязательна: без неё две функции с разными формулами
// могли бы разойтись на 1 день у полуночной границы.
function getRawDayNumber(activatedAt: Date | string): number {
  const start = toMidnight(new Date(activatedAt));
  const today = toMidnight(new Date());
  const diffDays = Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY);
  // День активации = День 1, поэтому +1.
  return diffDays + 1;
}

export function getCurrentDayNumber(activatedAt: Date | string): number {
  return Math.max(1, Math.min(PROGRAM_LENGTH, getRawDayNumber(activatedAt)));
}

export type ProgramStatus = {
  currentDay: number;
  isCompleted: boolean;
  daysPastCompletion: number;
};

// isCompleted — единственный корректный сигнал «прошло больше 30 дней».
// currentDay (из getCurrentDayNumber) для этого не подходит: он всегда
// кэпнут на 30, поэтому currentDay <= 30 истинно ВСЕГДА, даже на 45-й день.
export function getProgramStatus(activatedAt: string | Date): ProgramStatus {
  const rawDay = getRawDayNumber(activatedAt);
  const isCompleted = rawDay > PROGRAM_LENGTH;
  return {
    currentDay: Math.max(1, Math.min(PROGRAM_LENGTH, rawDay)),
    isCompleted,
    daysPastCompletion: isCompleted ? rawDay - PROGRAM_LENGTH : 0,
  };
}

export function getTodayProgramItem(activatedAt: Date | string): ProgramDay {
  const day = getCurrentDayNumber(activatedAt);
  const item = DRIP_CAMPAIGN[day - 1];
  if (!item) {
    throw new Error(
      `Drip-кампания не содержит день ${day}. Проверьте lib/content/drip-campaign.ts.`,
    );
  }
  return item;
}

export type Greeting = "Доброе утро" | "Добрый день" | "Добрый вечер";

export function greetingByTime(now: Date = new Date()): Greeting {
  const hour = now.getHours();
  if (hour < 12) return "Доброе утро";
  if (hour < 17) return "Добрый день";
  return "Добрый вечер";
}

export type SessionTimeSlot = "morning" | "day" | "evening";

// Возвращает только семантический слот — подписи (УТРО/ДЕНЬ/ВЕЧЕР) и иконки
// (Sun/CloudSun/Moon) собираются в компоненте: этот файл — чистая логика,
// без импортов lucide-react.
export function resolveSessionTimeSlot(
  preferredTime: Profile["preferred_time"],
  now: Date = new Date(),
): SessionTimeSlot {
  if (preferredTime === "morning") return "morning";
  if (preferredTime === "evening") return "evening";
  const hour = now.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "day";
  return "evening";
}

// Ищет назад от текущего дня ближайшую процедуру (для внеплановой сессии
// в день отдыха). Если ничего не нашлось — берём первую процедуру программы.
export function getLatestProcedure(currentDay: number): ProgramDay {
  for (let d = currentDay; d >= 1; d--) {
    const item = DRIP_CAMPAIGN[d - 1];
    if (item?.type === "procedure" && item.procedure) return item;
  }
  const first = DRIP_CAMPAIGN.find(
    (i) => i.type === "procedure" && i.procedure,
  );
  if (!first) {
    throw new Error("В drip-campaign нет ни одной процедуры.");
  }
  return first;
}

// drip-campaign задаёт КОГДА делать процедуру и СКОЛЬКО она длится — но не
// название режима, оно зависит от устройства. Режимы протокола устройства
// чередуются по кругу по номеру процедуры (не считая дни отдыха), поэтому
// у каждого устройства свой набор названий на одни и те же дни программы.
export function getModeForDevice(
  deviceSlug: string,
  dayNumber: number,
): ProcedureMode | null {
  const protocol = getProtocolBySlug(deviceSlug);
  if (!protocol || protocol.modes.length === 0) return null;

  const procedureDays = DRIP_CAMPAIGN.filter((d) => d.type === "procedure").map(
    (d) => d.day,
  );
  const procedureIndex = procedureDays.indexOf(dayNumber);
  if (procedureIndex === -1) return null;

  const modeIndex = procedureIndex % protocol.modes.length;
  return protocol.modes[modeIndex] ?? null;
}

export type NextProcedureInfo = {
  day: number;
  date: Date;
};

// Ищет ближайший день с процедурой ПОСЛЕ fromDay. Возвращает null, если
// программа закончилась.
export function getNextProcedureInfo(
  activatedAt: Date | string,
  fromDay: number,
): NextProcedureInfo | null {
  for (let d = fromDay + 1; d <= PROGRAM_LENGTH; d++) {
    const item = DRIP_CAMPAIGN[d - 1];
    if (item?.type === "procedure" && item.procedure) {
      const start = toMidnight(new Date(activatedAt));
      const date = new Date(start.getTime() + (d - 1) * MS_PER_DAY);
      return { day: d, date };
    }
  }
  return null;
}

export type TodayProcedure = {
  deviceSlug: string;
  modeName: string;
  durationMinutes: number;
  medium: string;
  hasElectricCurrent: boolean;
  isRestDay: boolean;
  sessionTime: SessionTimeSlot;
};

// Режим устройства на конкретный день — циклически по protocol.modes,
// НЕ завязано на drip-campaign.procedureDays (в отличие от getModeForDevice
// выше). getModeForDevice возвращает null примерно на половине дней
// программы (дни без процедуры в drip-campaign) — для одного фиксированного
// устройства это нормально (в такие дни показывается день отдыха), но для
// мультиустройственного списка это означало бы, что ПОЛОВИНУ дней недели
// «Моя программа» была бы пустой для ВСЕХ устройств сразу, хотя у каждого
// устройства своя частота использования. Поэтому режим здесь крутится
// по своему индексу, а «делать сегодня или нет» решает shouldScheduleToday.
function pickModeForDay(protocol: DeviceProtocol, dayNumber: number): ProcedureMode | null {
  if (protocol.modes.length === 0) return null;
  const index = (dayNumber - 1) % protocol.modes.length;
  return protocol.modes[index] ?? null;
}

// Должно ли устройство использоваться в этот день программы — по частоте
// из его протокола. Для 2-3 раз/нед чередуем чётность дня по первой букве
// slug'а устройства, чтобы разные редко используемые устройства не всегда
// падали на одни и те же дни.
function shouldScheduleToday(
  freq: DeviceProtocol["frequency"],
  dayNumber: number,
  slug: string,
): boolean {
  if (freq.timesPerWeek === "daily") return true;
  if (freq.timesPerWeek <= 3) {
    return dayNumber % 2 === slug.charCodeAt(0) % 2;
  }
  // 4-5 раз в неделю — пропускаем только воскресенье.
  const dayOfWeek = (dayNumber - 1) % 7; // 0=пн ... 6=вс
  return dayOfWeek !== 6;
}

// Процедуры на произвольный день программы для набора устройств — общая
// логика для getAllTodayProcedures (день = сегодня) и недельного календаря
// на /ritual-home (день = любой день недели, для показа тегов на 7 дней
// вперёд/назад независимо от того, наступил ли он).
export function getProceduresForDay(
  deviceSlugs: string[],
  dayNumber: number,
  sessionTime: SessionTimeSlot = "day",
): TodayProcedure[] {
  const results: TodayProcedure[] = [];

  for (const deviceSlug of deviceSlugs) {
    const protocol = getProtocolBySlug(deviceSlug);
    if (!protocol) continue;

    const mode = pickModeForDay(protocol, dayNumber);
    if (!mode) continue;

    const shouldDoToday = shouldScheduleToday(protocol.frequency, dayNumber, deviceSlug);

    results.push({
      deviceSlug,
      modeName: mode.displayName ?? mode.name,
      durationMinutes: mode.durationMinutes,
      medium: mode.medium,
      hasElectricCurrent: mode.hasElectricCurrent,
      isRestDay: !shouldDoToday,
      sessionTime,
    });
  }

  return results;
}

// Профиль хранит либо массив устройств (devices), либо только легаси
// одиночное поле (device, uppercase-enum) — приводим к тому же набору
// slug'ов, что используется везде в приложении (Home, /ritual, и т.д.).
// Буквальная реализация из ТЗ (`profile.devices ?? [profile.device]`)
// ломается в двух местах: пустой массив devices не покрывается `??`
// (не nullish), а profile.device — это uppercase-enum ("NUO"), не slug
// ("nuo"), которого getProtocolBySlug просто не найдёт.
export function getAllTodayProcedures(profile: Profile): TodayProcedure[] {
  const currentDay = getCurrentDayNumber(profile.activated_at);
  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];

  return getProceduresForDay(
    ownedSlugs,
    currentDay,
    resolveSessionTimeSlot(profile.preferred_time),
  );
}
