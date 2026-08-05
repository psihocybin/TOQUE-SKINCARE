import "server-only";

import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import type { PushSubscription } from "@/lib/supabase/database.types";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

let vapidConfigured = false;

function ensureVapidConfigured(): boolean {
  if (vapidConfigured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_CONTACT_EMAIL;
  if (!publicKey || !privateKey || !email) {
    console.error(
      "[push] VAPID-ключи не заданы. Нужны NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT_EMAIL.",
    );
    return false;
  }
  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
  vapidConfigured = true;
  return true;
}

export type SendResult = {
  endpoint: string;
  ok: boolean;
  status?: number;
  error?: string;
};

export async function sendPushToSubscription(
  sub: Pick<PushSubscription, "endpoint" | "p256dh" | "auth">,
  payload: PushPayload,
): Promise<SendResult> {
  if (!ensureVapidConfigured()) {
    return { endpoint: sub.endpoint, ok: false, error: "VAPID не настроен" };
  }
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload),
      { TTL: 60 * 60 * 24 }, // сутки — push service подержит сообщение, если устройство offline
    );
    return { endpoint: sub.endpoint, ok: true };
  } catch (e) {
    const status =
      e && typeof e === "object" && "statusCode" in e
        ? (e as { statusCode?: number }).statusCode
        : undefined;
    const message = e instanceof Error ? e.message : String(e);
    return { endpoint: sub.endpoint, ok: false, status, error: message };
  }
}

// Удаляет «битые» подписки: 404 (endpoint больше не зарегистрирован) и
// 410 Gone (отписался). Остальные ошибки (5xx, сеть) — оставляем.
async function pruneDeadSubscriptions(
  results: ReadonlyArray<SendResult>,
): Promise<void> {
  const dead = results
    .filter((r) => !r.ok && (r.status === 404 || r.status === 410))
    .map((r) => r.endpoint);
  if (dead.length === 0) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .in("endpoint", dead);
  if (error) {
    console.error("[push] не удалось удалить мёртвые подписки", error);
  }
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<SendResult[]> {
  const supabase = createClient();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("profile_id", userId);
  if (error) {
    console.error("[push] чтение подписок упало", error);
    return [];
  }
  if (!subs || subs.length === 0) return [];

  const results = await Promise.all(
    subs.map((s) => sendPushToSubscription(s, payload)),
  );
  await pruneDeadSubscriptions(results);
  return results;
}
