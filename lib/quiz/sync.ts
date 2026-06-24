import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProfileUpdate } from "@/lib/supabase/database.types";
import type { QuizAnswers } from "./quiz-context";

export function isQuizStarted(answers: QuizAnswers): boolean {
  return Boolean(
    answers.device ||
      answers.name.trim() ||
      answers.ageGroup ||
      answers.goal ||
      answers.skinType ||
      answers.experience ||
      answers.preferredTime ||
      answers.frequency,
  );
}

export function mapQuizToProfileUpdate(answers: QuizAnswers): ProfileUpdate {
  const update: ProfileUpdate = {
    is_gift: answers.isGift,
  };

  const name = answers.name.trim();
  if (name) update.name = name;
  if (answers.device) update.device = answers.device;
  if (answers.ageGroup) update.age_group = answers.ageGroup;
  if (answers.goal) update.goal = answers.goal;
  if (answers.skinType) update.skin_type = answers.skinType;
  if (answers.experience) update.experience = answers.experience;
  if (answers.preferredTime) update.preferred_time = answers.preferredTime;
  if (answers.frequency) update.frequency = answers.frequency;

  return update;
}

export async function syncQuizToProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  answers: QuizAnswers,
) {
  const update = mapQuizToProfileUpdate(answers);
  return supabase
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select()
    .single();
}
