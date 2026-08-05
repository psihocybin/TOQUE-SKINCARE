"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addDevice(
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("devices")
    .eq("id", user.id)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const current = profile?.devices ?? [];
  if (current.includes(slug)) return { ok: true }; // уже есть

  const { error } = await supabase
    .from("profiles")
    .update({ devices: [...current, slug] })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/my-devices");
  revalidatePath("/home");
  return { ok: true };
}

export async function removeDevice(
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("devices")
    .eq("id", user.id)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const current = profile?.devices ?? [];
  if (current.length <= 1) {
    return { ok: false, error: "Нельзя убрать последнее устройство" };
  }

  const updated = current.filter((d) => d !== slug);
  const { error } = await supabase
    .from("profiles")
    .update({ devices: updated })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/my-devices");
  revalidatePath("/home");
  return { ok: true };
}
