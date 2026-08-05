"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CustomSchedule } from "@/lib/ritual-builder/types";

export async function saveCustomSchedule(
  schedule: CustomSchedule,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase
    .from("profiles")
    .update({ custom_schedule: schedule })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/ritual-home");
  revalidatePath("/ritual-builder");
  return { ok: true };
}
