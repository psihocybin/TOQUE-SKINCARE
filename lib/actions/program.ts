"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Возвращает { ok, error? } вместо void из ТЗ: вызывающий клиентский код
// делает router.push('/home') сразу после вызова — если бы запись в БД
// молча упала, completion_celebrated остался бы false, и /home тут же
// отправил бы обратно на /program-complete (redirect-петля). С { ok }
// компонент переходит на /home только после подтверждённого успеха.
export async function markCompletionCelebrated(): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase
    .from("profiles")
    .update({ completion_celebrated: true })
    .eq("id", user.id);
  if (error) {
    console.error("[markCompletionCelebrated] error:", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/home");
  revalidatePath("/program-complete");
  return { ok: true };
}
