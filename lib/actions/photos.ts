"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB

export type CapturePhotoResult =
  | { ok: true }
  | { ok: false; error: string };

// Server Action принимает FormData — единственный надёжный способ передать
// File с клиента (RSC сериализация не поддерживает File напрямую).
export async function capturePhoto(
  formData: FormData,
): Promise<CapturePhotoResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return { ok: false, error: "Файл не выбран." };
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return { ok: false, error: "Файл больше 8 МБ. Попробуйте другой." };
  }

  const rawDay = formData.get("dayNumber");
  const dayNumber = typeof rawDay === "string" ? Number(rawDay) : NaN;
  if (!Number.isInteger(dayNumber) || dayNumber < 0) {
    return { ok: false, error: "Некорректный день программы." };
  }

  const extMatch = photo.name.match(/\.[a-z0-9]+$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : ".jpg";
  const path = `${user.id}/${dayNumber}-${Date.now()}${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, photo, {
      contentType: photo.type || "image/jpeg",
      upsert: false,
    });
  if (uploadError) {
    return { ok: false, error: `Загрузка не удалась: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase.from("photos").insert({
    profile_id: user.id,
    storage_path: path,
    day_number: dayNumber,
  });
  if (insertError) {
    await supabase.storage.from("photos").remove([path]);
    return { ok: false, error: insertError.message };
  }

  redirect("/progress?photo=success");
}
