import { PhotoCaptureClient } from "@/components/photo/photo-capture-client";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getBaselinePhoto } from "@/lib/queries/photos";

export default async function PhotoCapturePage() {
  const { profile, currentDay } = await getProfileWithStats();
  const baseline = await getBaselinePhoto(profile.id);
  const isBaseline = !baseline;

  return (
    <PhotoCaptureClient
      dayNumber={isBaseline ? 0 : currentDay}
      isBaseline={isBaseline}
    />
  );
}
