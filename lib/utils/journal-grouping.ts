import type { Procedure } from "@/lib/supabase/database.types";

const MONTHS_RU = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
] as const;

const MS_PER_DAY = 86_400_000;

export type JournalGroup = {
  label: string;
  items: Procedure[];
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function groupByWeek(procedures: Procedure[]): JournalGroup[] {
  const todayMid = startOfDay(new Date());
  const week1: Procedure[] = [];
  const week2: Procedure[] = [];
  const earlier: Procedure[] = [];

  for (const p of procedures) {
    const completedMid = startOfDay(new Date(p.completed_at));
    const diffDays = Math.floor(
      (todayMid.getTime() - completedMid.getTime()) / MS_PER_DAY,
    );
    if (diffDays < 7) week1.push(p);
    else if (diffDays < 14) week2.push(p);
    else earlier.push(p);
  }

  const out: JournalGroup[] = [];
  if (week1.length) out.push({ label: "ЭТА НЕДЕЛЯ", items: week1 });
  if (week2.length) out.push({ label: "ПРОШЛАЯ НЕДЕЛЯ", items: week2 });
  if (earlier.length) out.push({ label: "РАНЕЕ", items: earlier });
  return out;
}

export function formatProcedureDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const todayMid = startOfDay(new Date());
  const yesterdayMid = new Date(todayMid.getTime() - MS_PER_DAY);
  const dMid = startOfDay(d);

  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const time = `${hh}:${mm}`;

  if (dMid.getTime() === todayMid.getTime()) return `СЕГОДНЯ, ${time}`;
  if (dMid.getTime() === yesterdayMid.getTime()) return `ВЧЕРА, ${time}`;

  const month = MONTHS_RU[d.getMonth()] ?? "";
  return `${d.getDate()} ${month.toUpperCase()}, ${time}`;
}
