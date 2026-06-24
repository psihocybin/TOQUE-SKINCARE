import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentDayNumber } from "@/lib/program/utils";
import type { Profile } from "@/lib/supabase/database.types";

export type ProfileWithStats = {
  profile: Profile;
  currentDay: number;
  completedProcedures: number;
};

export async function getProfileWithStats(): Promise<ProfileWithStats> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Профиль ещё не создан триггером — отправляем на онбординг.
    redirect("/quiz/device");
  }

  const { count } = await supabase
    .from("procedures")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  return {
    profile,
    currentDay: getCurrentDayNumber(profile.activated_at),
    completedProcedures: count ?? 0,
  };
}
