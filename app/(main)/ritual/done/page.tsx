import { getProfileWithStats } from "@/lib/queries/profile";
import {
  getLatestProcedure,
  getNextProcedureInfo,
  getTodayProgramItem,
} from "@/lib/program/utils";
import { DoneClient } from "./done-client";

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

function formatDate(d: Date): string {
  const month = MONTHS_RU[d.getMonth()] ?? "";
  return `${d.getDate()} ${month}`;
}

export default async function RitualDonePage({
  searchParams,
}: {
  searchParams: { extra?: string };
}) {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();

  const today = getTodayProgramItem(profile.activated_at);
  // Флаг extra принимаем и из query (?extra=1), и из today.type — тот, что
  // ближе к правде в этот момент времени. Query нужен, если пользователь
  // перешёл на /ritual/done вручную в день процедуры, но с флагом.
  const isExtraFromToday = today.type !== "procedure" || !today.procedure;
  const isExtra = isExtraFromToday || searchParams.extra === "1";

  const item = isExtra ? getLatestProcedure(currentDay) : today;
  const proc = item.procedure!;

  const nextInfo = isExtra ? getNextProcedureInfo(profile.activated_at, currentDay) : null;
  const nextProcedureDateLabel = nextInfo ? formatDate(nextInfo.date) : null;

  return (
    <DoneClient
      name={profile.name}
      dayNumber={currentDay}
      procedureOrdinal={completedProcedures + 1}
      mode={proc.mode}
      durationSeconds={proc.durationMinutes * 60}
      isExtra={isExtra}
      nextProcedureDateLabel={nextProcedureDateLabel}
    />
  );
}
