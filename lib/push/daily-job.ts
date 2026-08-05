import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { DRIP_CAMPAIGN } from "@/lib/content/drip-campaign";
import { getCurrentDayNumber } from "@/lib/program/utils";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  type NotificationSettings,
} from "@/lib/supabase/database.types";
import { sendPushToSubscription, type SendResult } from "./send";

export type DailySlot = "morning" | "evening";

export type DailyJobResult = {
  slot: DailySlot;
  totalProfiles: number;
  pushed: number;
  skippedRemindersOff: number;
  skippedProgramEnded: number;
  skippedNoSubscriptions: number;
  failedSends: number;
};

// Слот «morning» включает всех у кого preferred_time не задано или 'flexible'.
function buildPreferredTimeFilter(slot: DailySlot): string {
  return slot === "morning"
    ? "preferred_time.is.null,preferred_time.in.(morning,flexible)"
    : "preferred_time.eq.evening";
}

export async function sendDailyPushes(
  slot: DailySlot,
): Promise<DailyJobResult> {
  const supabase = createAdminClient();

  let query = supabase
    .from("profiles")
    .select("id, activated_at, notification_settings");
  query = query.or(buildPreferredTimeFilter(slot));
  const { data: profiles, error } = await query;

  const result: DailyJobResult = {
    slot,
    totalProfiles: 0,
    pushed: 0,
    skippedRemindersOff: 0,
    skippedProgramEnded: 0,
    skippedNoSubscriptions: 0,
    failedSends: 0,
  };

  if (error || !profiles) {
    console.error("[daily-job] не удалось прочитать профили", error);
    return result;
  }

  result.totalProfiles = profiles.length;

  const allDeadEndpoints: string[] = [];

  for (const profile of profiles) {
    const settings: NotificationSettings =
      (profile.notification_settings as NotificationSettings | null) ??
      DEFAULT_NOTIFICATION_SETTINGS;

    if (!settings.reminders) {
      result.skippedRemindersOff++;
      continue;
    }

    const day = getCurrentDayNumber(profile.activated_at);
    const item = DRIP_CAMPAIGN[day - 1];
    if (!item) {
      result.skippedProgramEnded++;
      continue;
    }

    const { data: subs, error: subsError } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("profile_id", profile.id);
    if (subsError) {
      console.error(
        `[daily-job] не удалось прочитать подписки для ${profile.id}`,
        subsError,
      );
      result.failedSends++;
      continue;
    }
    if (!subs || subs.length === 0) {
      result.skippedNoSubscriptions++;
      continue;
    }

    const sends: SendResult[] = await Promise.all(
      subs.map((s) =>
        sendPushToSubscription(s, {
          title: item.pushTitle,
          body: item.pushBody,
          url: "/home",
        }),
      ),
    );

    const ok = sends.filter((s) => s.ok).length;
    if (ok > 0) result.pushed++;
    else result.failedSends++;

    for (const r of sends) {
      if (!r.ok && (r.status === 404 || r.status === 410)) {
        allDeadEndpoints.push(r.endpoint);
      }
    }
  }

  if (allDeadEndpoints.length > 0) {
    const { error: deleteError } = await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", allDeadEndpoints);
    if (deleteError) {
      console.error(
        "[daily-job] не удалось удалить мёртвые подписки",
        deleteError,
      );
    }
  }

  return result;
}
