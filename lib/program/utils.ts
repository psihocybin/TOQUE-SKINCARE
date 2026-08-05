import { DRIP_CAMPAIGN, type ProgramDay } from "@/lib/content/drip-campaign";
import { getProtocolBySlug, type ProcedureMode } from "@/lib/content/protocols";

const PROGRAM_LENGTH = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function toMidnight(date: Date): Date {
  const out = new Date(date);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function getCurrentDayNumber(activatedAt: Date | string): number {
  const start = toMidnight(new Date(activatedAt));
  const today = toMidnight(new Date());
  const diffDays = Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY);
  // День активации = День 1, поэтому +1. Кэп сверху на длину программы.
  return Math.max(1, Math.min(PROGRAM_LENGTH, diffDays + 1));
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
