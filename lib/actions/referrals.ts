"use server";

import { createClient } from "@/lib/supabase/server";

const CYRILLIC_UPPERCASE = /[^A-ZА-ЯЁ]/g;

// Берём первые 3 символа имени, оставляем только латиницу/кириллицу в верхнем регистре.
// Если имя пустое или короткое — заполняем X.
function buildNamePart(name: string): string {
  const upper = name.trim().toUpperCase();
  const clean = upper.replace(CYRILLIC_UPPERCASE, "");
  const padded = (clean + "XXX").slice(0, 3);
  return padded;
}

function buildRandomPart(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function buildYearPart(): string {
  return new Date().getFullYear().toString().slice(-1);
}

export async function generateReferralCode(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("name, referral_code")
    .eq("id", user.id)
    .maybeSingle();
  if (readError || !profile) {
    console.error("[referrals] read profile failed", readError);
    return null;
  }

  if (profile.referral_code) return profile.referral_code;

  const code = `${buildNamePart(profile.name)}-${buildRandomPart()}-${buildYearPart()}`;

  const { error: writeError } = await supabase
    .from("profiles")
    .update({ referral_code: code })
    .eq("id", user.id);
  if (writeError) {
    console.error("[referrals] write code failed", writeError);
    return null;
  }

  return code;
}
