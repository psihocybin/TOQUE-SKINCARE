import { BackButton } from "@/components/shared/back-button";
import { getProfileWithStats } from "@/lib/queries/profile";
import { FrequencyPickerClient } from "./frequency-picker-client";

export default async function SettingsFrequencyPage() {
  const { profile } = await getProfileWithStats();

  return (
    <main className="flex min-h-screen flex-col px-4 pb-12 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/settings" />
        </div>
        <p className="text-[14px] text-text">Частота процедур</p>
      </header>

      <h1 className="mt-8 text-[15px] leading-snug text-text">
        Сколько процедур в неделю вам комфортно?
      </h1>

      <FrequencyPickerClient initial={profile.frequency ?? null} />
    </main>
  );
}
