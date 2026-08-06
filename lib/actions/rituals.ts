"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Ritual } from "@/lib/supabase/database.types";
import type { Weekday } from "@/lib/ritual-builder/types";

const MAX_RITUALS = 5;

export type ModeSchedule = {
  modeName: string;
  displayName: string;
  sessionTime: "morning" | "evening" | "flexible";
  days: Weekday[];
};

export type DeviceRitualConfig = {
  deviceSlug: string;
  color: string;
  modes: ModeSchedule[];
};

export type RitualSchedule = DeviceRitualConfig[];

export async function getRituals(): Promise<Ritual[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("rituals")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getActiveRitual(): Promise<Ritual | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("rituals")
    .select("*")
    .eq("profile_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return data;
}

export async function saveRitual(params: {
  id?: string; // если есть — обновляем, нет — создаём
  name: string;
  schedule: RitualSchedule;
  applyNow: boolean; // сразу сделать активным
}): Promise<{ ok: boolean; error?: string; ritualId?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  if (!params.id) {
    const { count } = await supabase
      .from("rituals")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id);

    if ((count ?? 0) >= MAX_RITUALS) {
      return {
        ok: false,
        error: `Достигнут лимит ритуалов (${MAX_RITUALS}). Удалите один, чтобы создать новый.`,
      };
    }
  }

  let ritualId = params.id;

  if (params.id) {
    const { error } = await supabase
      .from("rituals")
      .update({
        name: params.name,
        schedule: params.schedule,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("profile_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data: newRitual, error } = await supabase
      .from("rituals")
      .insert({
        profile_id: user.id,
        name: params.name,
        schedule: params.schedule,
        is_active: false,
      })
      .select()
      .single();
    if (error || !newRitual) return { ok: false, error: error?.message ?? "Не удалось создать ритуал" };
    ritualId = newRitual.id;
  }

  if (params.applyNow && ritualId) {
    await supabase.from("rituals").update({ is_active: false }).eq("profile_id", user.id);
    await supabase.from("rituals").update({ is_active: true }).eq("id", ritualId);
  }

  revalidatePath("/ritual-home");
  revalidatePath("/home");
  revalidatePath("/my-rituals");

  return { ok: true, ritualId };
}

export async function activateRitual(ritualId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  await supabase.from("rituals").update({ is_active: false }).eq("profile_id", user.id);
  const { error } = await supabase
    .from("rituals")
    .update({ is_active: true })
    .eq("id", ritualId)
    .eq("profile_id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/ritual-home");
  revalidatePath("/home");
  revalidatePath("/my-rituals");
  return { ok: true };
}

export async function deleteRitual(ritualId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase
    .from("rituals")
    .delete()
    .eq("id", ritualId)
    .eq("profile_id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/my-rituals");
  revalidatePath("/ritual-home");
  revalidatePath("/home");
  return { ok: true };
}
