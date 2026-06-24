import Link from "next/link";
import { redirect } from "next/navigation";
import { Play } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getTodayProgramItem } from "@/lib/program/utils";

export default async function RitualPage() {
  const { profile } = await getProfileWithStats();
  const today = getTodayProgramItem(profile.activated_at);

  if (today.type !== "procedure" || !today.procedure) {
    redirect("/home");
  }

  const proc = today.procedure;
  const totalSeconds = proc.durationMinutes * 60;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <main className="flex min-h-screen flex-col pb-28">
      <header className="relative flex items-center justify-center px-4 pt-4">
        <div className="absolute left-2 top-2">
          <BackButton href="/home" />
        </div>
        <div className="text-center">
          <p className="text-[13px] text-text">{proc.title}</p>
          <p className="mt-0.5 text-[9px] text-text-muted">
            {proc.durationMinutes} минут
          </p>
        </div>
      </header>

      <FadeIn duration={0.4} className="mt-4 px-4">
        <Link
          href="/ritual/video"
          aria-label="Открыть видеогид"
          className="relative block aspect-video w-full overflow-hidden rounded-lg bg-text"
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <Play
              className="h-8 w-8 text-cream"
              fill="currentColor"
              strokeWidth={0}
              aria-hidden
            />
          </span>
        </Link>
      </FadeIn>

      <div className="mt-6 text-center">
        <p className="text-[26px] tracking-[2px] text-text">{timerLabel}</p>
        <p className="mt-1 text-[9px] text-text-muted">осталось</p>
      </div>

      <section className="mt-10 px-4">
        <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
          Шаги
        </p>
        <ol className="mt-4 flex flex-col gap-2">
          {proc.steps.map((step, i) => (
            <li
              key={`${i}-${step}`}
              className="flex gap-2 text-[11px] text-text"
            >
              <span className="w-5 shrink-0 text-text-muted">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-cream pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <div className="mx-auto w-full max-w-app px-4">
          <Button asChild className="h-12 w-full">
            <Link href="/ritual/done">Завершить процедуру</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
