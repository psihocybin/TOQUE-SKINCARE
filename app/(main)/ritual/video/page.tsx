import { redirect } from "next/navigation";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getTodayProgramItem } from "@/lib/program/utils";
import { VideoPlayerClient } from "./video-player-client";

export default async function VideoPage() {
  const { profile } = await getProfileWithStats();
  const today = getTodayProgramItem(profile.activated_at);

  if (today.type !== "procedure" || !today.procedure) {
    redirect("/home");
  }

  return (
    <VideoPlayerClient
      title={today.procedure.title}
      durationSeconds={today.procedure.durationMinutes * 60}
      stepLabels={today.procedure.steps}
    />
  );
}
