import { DRIP_CAMPAIGN, type ProgramDay } from "@/lib/content/drip-campaign";

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
