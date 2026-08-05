import { BackButton } from "@/components/shared/back-button";
import { getProfileWithStats } from "@/lib/queries/profile";
import { TimePickerClient } from "./time-picker-client";

export default async function SettingsTimePage() {
  const { profile } = await getProfileWithStats();
  const initial = profile.preferred_time ?? "morning";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative flex items-center justify-center px-4 pt-4">
        <div className="absolute left-2 top-0">
          <BackButton href="/settings" />
        </div>
        <p className="text-[14px] text-text">Время процедур</p>
      </header>

      <p className="mt-2 px-4 text-center text-[11px] text-text-muted">
        в это время будут напоминания
      </p>

      <TimePickerClient initialPreferred={initial} />
    </div>
  );
}
