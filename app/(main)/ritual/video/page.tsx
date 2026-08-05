import { getProfileWithStats } from "@/lib/queries/profile";
import {
  getCurrentDayNumber,
  getLatestProcedure,
  getTodayProgramItem,
} from "@/lib/program/utils";
import { deviceEnumToSlug } from "@/lib/content/devices";
import { getModeForDevice } from "@/lib/program/utils";
import { VideoPlayerClient } from "./video-player-client";

export default async function VideoPage({
  searchParams,
}: {
  searchParams: { device?: string };
}) {
  const { profile } = await getProfileWithStats();
  const today = getTodayProgramItem(profile.activated_at);
  const currentDay = getCurrentDayNumber(profile.activated_at);

  const isExtra = today.type !== "procedure" || !today.procedure;
  const item = isExtra ? getLatestProcedure(currentDay) : today;
  const proc = item.procedure!;

  // «Устройство дня» — та же ротация, что и на /home и /ritual; ?device=
  // (переход с /ritual при переключённом устройстве) приоритетнее ротации.
  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];
  const deviceOfDaySlug =
    ownedSlugs.length > 0
      ? ownedSlugs[(currentDay - 1) % ownedSlugs.length]
      : null;
  const activeDevice = searchParams.device ?? deviceOfDaySlug ?? primarySlug;

  const currentMode = activeDevice
    ? getModeForDevice(activeDevice, item.day)
    : null;
  const modeTitle = currentMode
    ? (currentMode.displayName ?? currentMode.name)
    : proc.title;
  const stepLabels = currentMode?.steps.map((s) => s.text) ?? [];

  return (
    <VideoPlayerClient
      title={modeTitle}
      durationSeconds={proc.durationMinutes * 60}
      stepLabels={stepLabels}
      isExtra={isExtra}
    />
  );
}
