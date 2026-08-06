import { redirect } from "next/navigation";
import { Check, CheckCircle } from "lucide-react";
import { CompletionChoice } from "@/components/program/completion-choice";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getMaxStreak } from "@/lib/queries/attendance";
import { getProgramStatus } from "@/lib/program/utils";
import { deviceEnumToSlug } from "@/lib/content/devices";

export default async function ProgramCompletePage() {
  const { profile, completedProcedures } = await getProfileWithStats();
  const status = getProgramStatus(profile.activated_at);

  // Экран одноразовый: если ещё не 30+ дней, или уже отметили просмотр —
  // сюда попадать незачем (прямая навигация по URL, повторный визит и т.д.).
  if (!status.isCompleted || profile.completion_celebrated) {
    redirect("/home");
  }

  const maxStreak = await getMaxStreak(profile.id);
  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const devicesCount =
    profile.devices && profile.devices.length > 0
      ? profile.devices.length
      : primarySlug
        ? 1
        : 0;

  const name = profile.name.trim();

  const summary = [
    { count: completedProcedures, label: "процедур выполнено" },
    { count: maxStreak, label: "максимальная серия" },
    { count: devicesCount, label: "устройств в работе" },
  ];

  return (
    <div
      className="flex min-h-screen flex-col items-center px-6 pb-10 pt-16 text-center"
      style={{
        background: "radial-gradient(circle at 50% 30%, #F1EFE8 0%, #FAFAF7 100%)",
      }}
    >
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-olive/15">
        <CheckCircle className="h-9 w-9 text-olive" strokeWidth={1.75} aria-hidden />
      </div>

      <h1 className="mt-6 text-[22px] font-bold text-text">30 дней позади.</h1>
      <p className="mt-2 text-[15px] text-text-muted">
        {name ? `${name}, вы прошли полный курс.` : "Вы прошли полный курс."}
      </p>

      <div className="mt-7 flex w-full flex-col gap-2">
        {summary.map((item) => (
          <div key={item.label} className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-olive" strokeWidth={2.5} aria-hidden />
            <p className="text-[13px] text-text">
              {item.count} {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 h-px w-full bg-black/8" aria-hidden />

      <p className="mt-7 text-[13px] uppercase tracking-[1.5px] text-text-muted">
        Что дальше?
      </p>

      <div className="mt-4 w-full">
        <CompletionChoice />
      </div>
    </div>
  );
}
