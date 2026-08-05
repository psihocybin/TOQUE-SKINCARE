import Link from "next/link";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { getProfileWithStats } from "@/lib/queries/profile";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";
import { findComboProtocol } from "@/lib/content/combo-protocols";

export default async function RitualComboPage() {
  const { profile } = await getProfileWithStats();

  const currentSlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const deviceSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : currentSlug
        ? [currentSlug]
        : [];

  const combo = findComboProtocol(deviceSlugs);
  if (!combo) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative flex items-center justify-center px-4 pt-4">
        <div className="absolute left-2 top-0">
          <BackButton href="/home" />
        </div>
        <div className="text-center">
          <p className="text-[13px] text-text">{combo.name}</p>
          <p className="mt-0.5 text-[9px] text-text-muted">
            {combo.totalMinutes} минут · комбо-сеанс
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <FadeIn delay={0.1} className="mt-6 flex flex-col gap-3">
          {combo.sequence.map((step, i) => {
            const device = getDeviceBySlug(step.deviceSlug);
            return (
              <div
                key={`${step.deviceSlug}-${step.modeName}-${i}`}
                className="rounded-lg border border-black/8 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-pill bg-olive/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.5px] text-olive">
                    {device?.name ?? step.deviceSlug}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {step.durationMinutes} мин
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-text">{step.modeName}</p>
                <p className="mt-1 text-[10px] text-text-muted">{step.note}</p>
              </div>
            );
          })}
        </FadeIn>
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button asChild className="h-12 w-full">
          <Link href="/home">Завершить сеанс</Link>
        </Button>
      </div>
    </div>
  );
}
