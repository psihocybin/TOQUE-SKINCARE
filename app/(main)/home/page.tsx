import Link from "next/link";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/shared/fade-in";
import { ProgressRing } from "@/components/home/progress-ring";
import { Button } from "@/components/ui/button";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getTodayProgramItem, greetingByTime } from "@/lib/program/utils";
import { QuizSyncOnMount } from "./quiz-sync";

export default async function HomePage() {
  const { profile, currentDay } = await getProfileWithStats();

  if (!profile.name.trim()) {
    redirect("/quiz/device");
  }

  const today = getTodayProgramItem(profile.activated_at);
  const greeting = greetingByTime();
  const isProcedureDay = today.type === "procedure" && Boolean(today.procedure);

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-6">
      <QuizSyncOnMount profileFilled={Boolean(profile.device)} />

      <FadeIn duration={0.4}>
        <p className="text-[11px] text-text-muted">{greeting},</p>
        <h1 className="text-[17px] leading-tight text-text">{profile.name}</h1>
      </FadeIn>

      <div className="mt-7">
        <ProgressRing currentDay={currentDay} totalDays={30} />
      </div>

      <FadeIn delay={0.15} className="mt-10">
        {isProcedureDay && today.procedure ? (
          <div className="rounded-lg border border-black/8 bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
                  Сегодня
                </p>
                <p className="mt-2 text-[13px] text-text">
                  {today.procedure.title}
                </p>
                <p className="mt-1 text-[10px] text-text-muted">
                  {today.procedure.durationMinutes} минут · режим{" "}
                  {today.procedure.mode}
                </p>
              </div>
              <Button
                asChild
                className="h-7 shrink-0 px-4 text-[11px]"
              >
                <Link href="/ritual">Начать</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-black/8 bg-white px-4 py-4">
            <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
              Сегодня — день отдыха
            </p>
            <p className="mt-2 text-[13px] text-text">
              Кожа работает, пока вы отдыхаете.
            </p>
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.3} className="mt-5">
        <div className="rounded-lg border border-black/8 bg-white px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Совет дня
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-text">
            {today.insightText}
          </p>
        </div>
      </FadeIn>
    </main>
  );
}
