import { BackButton } from "@/components/shared/back-button";
import { RitualBuilderForm } from "@/components/ritual-builder/ritual-builder-form";
import { getProfileWithStats } from "@/lib/queries/profile";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";
import type { CustomSchedule } from "@/lib/ritual-builder/types";

export default async function RitualBuilderPage() {
  const { profile } = await getProfileWithStats();

  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];
  const ownedDevices = ownedSlugs
    .map((slug) => getDeviceBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({ slug: d.slug, name: d.name }));

  const initialSchedule = (profile.custom_schedule as CustomSchedule | null) ?? null;

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/ritual-home" />
        </div>
        <p className="text-[14px] text-text">Конструктор ритуала</p>
      </header>

      <div className="mt-6">
        <RitualBuilderForm
          ownedDevices={ownedDevices}
          initialSchedule={initialSchedule}
        />
      </div>
    </main>
  );
}
