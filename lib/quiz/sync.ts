import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProfileInsert } from "@/lib/supabase/database.types";
import { deviceEnumToSlug } from "@/lib/content/devices";
import type { QuizAnswers } from "./quiz-context";

export function isQuizStarted(answers: QuizAnswers): boolean {
  return Boolean(
    answers.devices.length > 0 ||
      answers.name.trim() ||
      answers.ageGroup ||
      answers.goal ||
      answers.skinType ||
      answers.experience ||
      answers.preferredTime ||
      answers.frequency,
  );
}

// Строим ProfileInsert с обязательным id — годится и для upsert (создаст запись,
// если триггер handle_new_user не отработал), и для update существующей.
export function mapQuizToProfileUpsert(
  userId: string,
  answers: QuizAnswers,
): ProfileInsert {
  const insert: ProfileInsert = {
    id: userId,
    is_gift: answers.isGift,
  };

  const name = answers.name.trim();
  if (name) insert.name = name;
  // device (legacy, singular enum) — primary-устройство, для всех
  // существующих одиночных экранов (экосистема, пуши и т.д.).
  if (answers.primaryDevice) insert.device = answers.primaryDevice;
  // devices (новое, массив slug) — для мультиустройственных фич
  // (ротация на Home, комбо-протоколы, «Мои устройства»).
  if (answers.devices.length > 0) {
    insert.devices = answers.devices.map(deviceEnumToSlug);
  }
  if (answers.ageGroup) insert.age_group = answers.ageGroup;
  if (answers.goal) insert.goal = answers.goal;
  if (answers.skinType) insert.skin_type = answers.skinType;
  if (answers.experience) insert.experience = answers.experience;
  if (answers.preferredTime) insert.preferred_time = answers.preferredTime;
  if (answers.frequency) insert.frequency = answers.frequency;

  return insert;
}

export async function syncQuizToProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  answers: QuizAnswers,
) {
  const payload = mapQuizToProfileUpsert(userId, answers);
  return supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
}
