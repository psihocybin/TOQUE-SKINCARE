import { redirect } from "next/navigation";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getTodayProgramItem } from "@/lib/program/utils";
import { DoneClient } from "./done-client";

export default async function RitualDonePage() {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();

  const today = getTodayProgramItem(profile.activated_at);
  if (today.type !== "procedure" || !today.procedure) {
    redirect("/home");
  }

  return (
    <DoneClient
      name={profile.name}
      dayNumber={currentDay}
      // Что покажем после записи: текущее количество +1 (мы вот-вот добавим).
      procedureOrdinal={completedProcedures + 1}
      mode={today.procedure.mode}
      durationSeconds={today.procedure.durationMinutes * 60}
    />
  );
}
