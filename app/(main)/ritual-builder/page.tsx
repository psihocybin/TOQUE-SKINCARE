import { RitualConstructor } from "@/components/ritual-builder/ritual-constructor";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getRituals } from "@/lib/actions/rituals";
import { asRitualSchedule } from "@/lib/ritual-builder/ritual-utils";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";

export default async function RitualBuilderPage({
  searchParams,
}: {
  searchParams: { editId?: string };
}) {
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

  let ritualId: string | undefined;
  let initialName = "Мой ритуал";
  let initialSchedule = asRitualSchedule([]);

  if (searchParams.editId) {
    const rituals = await getRituals();
    const editing = rituals.find((r) => r.id === searchParams.editId);
    if (editing) {
      ritualId = editing.id;
      initialName = editing.name;
      initialSchedule = asRitualSchedule(editing.schedule);
    }
  }

  return (
    <RitualConstructor
      ritualId={ritualId}
      initialName={initialName}
      ownedDevices={ownedDevices}
      initialSchedule={initialSchedule}
    />
  );
}
