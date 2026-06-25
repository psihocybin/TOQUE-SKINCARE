import { createClient } from "@/lib/supabase/server";
import type { Procedure } from "@/lib/supabase/database.types";

export type WeeklyStat = { week: number; count: number };

export async function getProcedures(profileId: string): Promise<Procedure[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("procedures")
    .select("*")
    .eq("profile_id", profileId)
    .order("completed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Группировка по неделям программы: 1-7, 8-14, 15-21, 22-30.
export function computeWeeklyStats(procedures: Procedure[]): WeeklyStat[] {
  const counts: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const p of procedures) {
    if (p.day_number <= 7) counts[1]++;
    else if (p.day_number <= 14) counts[2]++;
    else if (p.day_number <= 21) counts[3]++;
    else counts[4]++;
  }
  return [1, 2, 3, 4].map((week) => ({
    week,
    count: counts[week as 1 | 2 | 3 | 4],
  }));
}

export async function getWeeklyStats(profileId: string): Promise<WeeklyStat[]> {
  const procedures = await getProcedures(profileId);
  return computeWeeklyStats(procedures);
}
