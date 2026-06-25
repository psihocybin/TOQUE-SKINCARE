"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MIN_SERIAL = 6;
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024; // 5 MB

export type WarrantyResult =
  | { ok: true }
  | { ok: false; error: string };

// Server Action принимает FormData — это единственный надёжный способ передать
// File с клиента (RSC сериализация не поддерживает File напрямую).
export async function registerWarranty(
  formData: FormData,
): Promise<WarrantyResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const rawSerial = formData.get("serialNumber");
  const serialNumber =
    typeof rawSerial === "string" ? rawSerial.trim() : "";
  if (serialNumber.length < MIN_SERIAL) {
    return {
      ok: false,
      error: `Серийный номер должен быть минимум ${MIN_SERIAL} символов.`,
    };
  }

  // Дата активации устройства приходит в формате ДД/ММ/ГГГГ из клиентской маски.
  // Конвертим в ISO-дату (YYYY-MM-DD) для колонки date.
  const rawActivation = formData.get("activationDate");
  const activationStr =
    typeof rawActivation === "string" ? rawActivation.trim() : "";
  const dateMatch = activationStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!dateMatch) {
    return {
      ok: false,
      error: "Введите дату активации в формате ДД/ММ/ГГГГ.",
    };
  }
  const [, ddStr, mmStr, yyyyStr] = dateMatch;
  const dd = Number(ddStr);
  const mm = Number(mmStr);
  const yyyy = Number(yyyyStr);
  const parsed = new Date(Date.UTC(yyyy, mm - 1, dd));
  const isValidDate =
    parsed.getUTCFullYear() === yyyy &&
    parsed.getUTCMonth() === mm - 1 &&
    parsed.getUTCDate() === dd;
  if (!isValidDate) {
    return { ok: false, error: "Такой даты не существует. Проверьте ввод." };
  }
  if (parsed.getTime() > Date.now()) {
    return { ok: false, error: "Дата активации не может быть в будущем." };
  }
  const activationDateIso = `${yyyyStr}-${mmStr}-${ddStr}`;

  const receipt = formData.get("receiptPhoto");
  let receiptUrl: string | null = null;

  if (receipt instanceof File && receipt.size > 0) {
    if (receipt.size > MAX_RECEIPT_BYTES) {
      return {
        ok: false,
        error: "Файл больше 5 МБ. Попробуйте другой.",
      };
    }

    const extMatch = receipt.name.match(/\.[a-z0-9]+$/i);
    const ext = extMatch ? extMatch[0].toLowerCase() : ".bin";
    const path = `${user.id}/${Date.now()}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("warranties")
      .upload(path, receipt, {
        contentType: receipt.type || "application/octet-stream",
        upsert: false,
      });
    if (uploadError) {
      return { ok: false, error: `Загрузка не удалась: ${uploadError.message}` };
    }
    receiptUrl = path;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      warranty_serial: serialNumber,
      warranty_receipt_url: receiptUrl,
      warranty_registered_at: new Date().toISOString(),
      activation_date: activationDateIso,
    })
    .eq("id", user.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  redirect("/profile?warranty=success");
}
