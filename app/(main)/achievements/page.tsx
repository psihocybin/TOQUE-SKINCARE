import Link from "next/link";
import { CalendarCheck, Flame, Layers, Lock, Sparkles } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { DeviceImage } from "@/components/shared/device-image";
import { RingProgress } from "@/components/shared/ring-progress";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getAttendance } from "@/lib/queries/attendance";
import { deviceEnumToSlug, devices } from "@/lib/content/devices";
import { computeMilestones, type MilestoneType } from "@/lib/content/milestones";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<MilestoneType, typeof Sparkles> = {
  procedures: Sparkles,
  streak: Flame,
  days_program: CalendarCheck,
  devices: Layers,
};

export default async function AchievementsPage() {
  const { profile, currentDay, completedProcedures } = await getProfileWithStats();
  const { streak } = await getAttendance(profile.id);

  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];

  const milestones = computeMilestones({
    completedProcedures,
    streak,
    currentDay,
    devicesCount: ownedSlugs.length,
  });
  const earnedCount = milestones.filter((m) => m.earned).length;

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Достижения</p>
      </header>

      <div className="mt-4 flex flex-col items-center rounded-2xl bg-text py-8">
        <RingProgress
          value={earnedCount}
          max={milestones.length}
          size={160}
          strokeWidth={10}
          trackColor="rgba(255,255,255,0.15)"
          progressColor="#7A8A4F"
        >
          <span className="text-[28px] text-white">
            {earnedCount} / {milestones.length}
          </span>
          <span className="mt-1 text-[12px] text-white/60">
            Достижений получено
          </span>
        </RingProgress>
      </div>

      <section className="mt-6">
        <p className="text-[9px] uppercase tracking-[2px] text-text-muted">
          Устройства ({ownedSlugs.length})
        </p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {devices.map((d) => {
            const isOwned = ownedSlugs.includes(d.slug);
            return (
              <Link
                key={d.slug}
                href="/my-devices"
                className={cn(
                  "flex w-[90px] shrink-0 flex-col items-center rounded-xl p-2 text-center",
                  isOwned ? "bg-white shadow-sm" : "opacity-50",
                )}
              >
                <DeviceImage slug={d.slug} size={44} />
                <p className="mt-1.5 truncate text-[10px] text-text">{d.name}</p>
                <p
                  className={cn(
                    "text-[9px]",
                    isOwned ? "text-olive" : "text-text-muted",
                  )}
                >
                  {isOwned ? "Добавлено" : "Добавить →"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <p className="text-[9px] uppercase tracking-[2px] text-text-muted">
          Вехи ({milestones.length})
        </p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {milestones.map((m) => {
            const Icon = TYPE_ICON[m.type];
            return (
              <div
                key={m.id}
                className={cn(
                  "relative flex h-[100px] w-[80px] shrink-0 flex-col items-center justify-center rounded-xl border p-2 text-center",
                  m.earned
                    ? "border-olive bg-white"
                    : "border-black/8 bg-white opacity-40",
                )}
                title={m.description}
              >
                {!m.earned ? (
                  <Lock
                    className="absolute right-1.5 top-1.5 h-3 w-3 text-text-muted"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className={cn("h-5 w-5", m.earned ? "text-olive" : "text-text-muted")}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="mt-1.5 text-[13px] font-bold text-text">
                  {m.requiredCount}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[9px] leading-tight text-text-muted">
                  {m.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
