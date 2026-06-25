"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitNps(data: {
  score: number;
  comment?: string;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (data.score < 0 || data.score > 10) {
    throw new Error("NPS score должен быть в диапазоне 0–10");
  }

  const trimmedComment = data.comment?.trim();
  const { error } = await supabase.from("surveys").insert({
    profile_id: user.id,
    survey_type: "nps_d30",
    score: data.score,
    comment: trimmedComment ? trimmedComment : null,
  });
  if (error) throw new Error(error.message);

  redirect("/home");
}

export async function postponeNps(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("surveys").insert({
    profile_id: user.id,
    survey_type: "nps_d30_postponed",
  });
  if (error) throw new Error(error.message);

  redirect("/home");
}

export async function submitJcs(data: {
  answer: "solved" | "partial" | "no_change" | "worse";
  comment?: string;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const trimmedComment = data.comment?.trim();
  const { error } = await supabase.from("surveys").insert({
    profile_id: user.id,
    survey_type: "jcs_d60",
    answer: data.answer,
    comment: trimmedComment ? trimmedComment : null,
  });
  if (error) throw new Error(error.message);

  redirect("/home");
}
