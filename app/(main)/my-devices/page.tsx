import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { MyDevicesList } from "@/components/devices/my-devices-list";
import { AddDeviceDialog } from "@/components/devices/add-device-dialog";
import { getProfileWithStats } from "@/lib/queries/profile";
import { deviceEnumToSlug, devices, getDeviceBySlug } from "@/lib/content/devices";

export default async function MyDevicesPage() {
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
    .map((d) => ({ slug: d.slug, name: d.name, subtitle: d.subtitle }));

  const addableOptions = devices
    .filter((d) => !ownedSlugs.includes(d.slug))
    .map((d) => ({ slug: d.slug, name: d.name, subtitle: d.subtitle }));

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Мои устройства</p>
      </header>

      <FadeIn className="mt-8">
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Уже есть
        </p>
        <div className="mt-3">
          {ownedDevices.length > 0 ? (
            <MyDevicesList devices={ownedDevices} />
          ) : (
            <p className="text-[11px] text-text-muted">
              Пока нет добавленных устройств
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-8">
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Добавить устройство
        </p>
        <div className="mt-3">
          <AddDeviceDialog options={addableOptions} />
        </div>
      </FadeIn>
    </main>
  );
}
