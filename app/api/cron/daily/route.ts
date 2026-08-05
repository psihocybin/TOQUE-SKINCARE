import { NextResponse, type NextRequest } from "next/server";
import { sendDailyPushes, type DailySlot } from "@/lib/push/daily-job";

// Cron триггерится через Vercel Cron Jobs (GET по расписанию из vercel.json).
// Vercel автоматически добавляет header `Authorization: Bearer ${CRON_SECRET}`.
// Для локального теста — curl с тем же заголовком.
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "CRON_SECRET не задан в env" },
      { status: 500 },
    );
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slotParam = req.nextUrl.searchParams.get("slot");
  if (slotParam !== "morning" && slotParam !== "evening") {
    return NextResponse.json(
      { error: "slot должен быть 'morning' или 'evening'" },
      { status: 400 },
    );
  }
  const slot: DailySlot = slotParam;

  const startedAt = Date.now();
  const result = await sendDailyPushes(slot);
  const durationMs = Date.now() - startedAt;

  console.log("[cron/daily]", { ...result, durationMs });
  return NextResponse.json({ ok: true, durationMs, ...result });
}
