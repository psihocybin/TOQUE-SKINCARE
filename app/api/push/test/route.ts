import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUser } from "@/lib/push/send";

// POST /api/push/test
// Отправляет одно тестовое уведомление текущему пользователю на все его подписки.
// Полезно во время разработки: убедиться что весь канал «БД → web-push → устройство»
// работает, до того как подключать cron + drip-кампанию.
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await sendPushToUser(user.id, {
    title: "TOQUE Ритуал",
    body: "Это тестовое уведомление.",
    url: "/home",
  });

  if (results.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Нет активных подписок. Сначала разрешите уведомления." },
      { status: 404 },
    );
  }

  const sent = results.filter((r) => r.ok).length;
  return NextResponse.json({
    ok: sent > 0,
    sent,
    total: results.length,
    failures: results
      .filter((r) => !r.ok)
      .map((r) => ({ endpoint: r.endpoint.slice(-40), status: r.status, error: r.error })),
  });
}
