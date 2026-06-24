"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_KEY, type QuizAnswers } from "@/lib/quiz/quiz-context";
import { isQuizStarted, syncQuizToProfile } from "@/lib/quiz/sync";

type Props = {
  profileFilled: boolean;
};

function readQuizFromStorage(): QuizAnswers | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizAnswers;
  } catch {
    return null;
  }
}

export function QuizSyncOnMount({ profileFilled }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (profileFilled) return;

    const answers = readQuizFromStorage();
    if (!answers || !isQuizStarted(answers)) return;

    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { error } = await syncQuizToProfile(supabase, user.id, answers);
      if (cancelled || error) return;

      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [profileFilled, router]);

  return null;
}
