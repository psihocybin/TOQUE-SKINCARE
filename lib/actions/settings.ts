"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  type NotificationSettings,
} from "@/lib/supabase/database.types";

export type NotificationUpdate = {
  remindersEnabled?: boolean;
  tipsEnabled?: boolean;
  weeklyReportEnabled?: boolean;
};

export async function updateNotificationSettings(
  update: NotificationUpdate,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("notification_settings")
    .eq("id", user.id)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const current: NotificationSettings =
    profile?.notification_settings ?? DEFAULT_NOTIFICATION_SETTINGS;

  const next: NotificationSettings = {
    reminders:
      update.remindersEnabled !== undefined
        ? update.remindersEnabled
        : current.reminders,
    tips:
      update.tipsEnabled !== undefined ? update.tipsEnabled : current.tips,
    weekly_report:
      update.weeklyReportEnabled !== undefined
        ? update.weeklyReportEnabled
        : current.weekly_report,
  };

  const { error } = await supabase
    .from("profiles")
    .update({ notification_settings: next })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/settings");
  return { ok: true };
}

export type ProgramUpdate = {
  preferredTime?: "morning" | "evening" | "flexible";
  frequency?: "low" | "medium" | "daily";
};

export async function updateProgramSettings(
  update: ProgramUpdate,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("[updateProgramSettings] auth error", authError);
    return { ok: false, error: "Не авторизован" };
  }

  const patch: {
    preferred_time?: "morning" | "evening" | "flexible";
    frequency?: "low" | "medium" | "daily";
  } = {};
  if (update.preferredTime !== undefined) {
    patch.preferred_time = update.preferredTime;
  }
  if (update.frequency !== undefined) {
    patch.frequency = update.frequency;
  }
  if (Object.keys(patch).length === 0) {
    return { ok: true };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id)
    .select("preferred_time, frequency")
    .single();

  if (error) {
    console.error("[updateProgramSettings] update error", error);
    return { ok: false, error: error.message };
  }
  if (!data) {
    console.error("[updateProgramSettings] no rows updated for", user.id);
    return { ok: false, error: "Запись не найдена" };
  }

  // Time-picker возвращает пользователя на /settings, поэтому пересчитываем
  // оба маршрута, чтобы не получить кэш на любом из них.
  revalidatePath("/settings");
  revalidatePath("/settings/time");
  revalidatePath("/settings/frequency");
  return { ok: true };
}
