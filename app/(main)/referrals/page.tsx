import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import {
  CopyCodeButton,
  ShareButton,
} from "@/components/referrals/referral-actions";
import { createClient } from "@/lib/supabase/server";
import { getProfileWithStats } from "@/lib/queries/profile";
import { generateReferralCode } from "@/lib/actions/referrals";

type InvitedRow = {
  id: string;
  name: string;
  created_at: string;
};

export default async function ReferralsPage() {
  const { profile } = await getProfileWithStats();

  // Если кода ещё нет — генерируем через server action (он сам сохранит).
  const code = profile.referral_code ?? (await generateReferralCode()) ?? "";

  // Получаем приглашённых: профили с referred_by = profile.id.
  const supabase = createClient();
  const { data: invitedRaw } = await supabase
    .from("profiles")
    .select("id, name, created_at")
    .eq("referred_by", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const invited: InvitedRow[] = (invitedRaw ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    created_at: row.created_at,
  }));
  const invitedTotal = invited.length;

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Пригласить подругу</p>
      </header>

      <FadeIn className="mt-10 flex justify-center">
        <svg width="100" height="48" viewBox="0 0 100 48" aria-hidden>
          <circle
            cx="38"
            cy="24"
            r="22"
            fill="rgba(196,144,138,0.20)"
            stroke="rgba(196,144,138,0.50)"
            strokeWidth="1"
          />
          <circle
            cx="62"
            cy="24"
            r="22"
            fill="rgba(122,138,79,0.20)"
            stroke="rgba(122,138,79,0.50)"
            strokeWidth="1"
          />
        </svg>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-7 text-center">
        <p className="text-[15px] leading-snug text-text">
          Поделитесь TOQUE —
          <br />
          обе получите подарок
        </p>
        <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
          Подруга: промокод TOQUERITUAL15 — скидка 15%
        </p>
        <p className="text-[11px] leading-relaxed text-text-muted">
          Вы: промокод на 1 000 ₽ при следующей покупке
        </p>
      </FadeIn>

      <FadeIn delay={0.3} className="mt-7">
        <div className="rounded-xl border border-olive/30 bg-olive/[0.06] px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
            Ваш код
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-mono text-[15px] tracking-[2px] text-text">
              {code || "—"}
            </p>
            {code ? <CopyCodeButton code={code} /> : null}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4} className="mt-5">
        {code ? <ShareButton code={code} /> : null}
      </FadeIn>

      <FadeIn delay={0.5} className="mt-8">
        <div className="grid grid-cols-2 gap-3">
          <StatCard value={invitedTotal} label="приглашена" />
          <StatCard value={0} label="купили" />
        </div>
      </FadeIn>

      {invited.length > 0 ? (
        <FadeIn delay={0.6} className="mt-6 flex flex-col gap-2">
          {invited.map((row) => {
            const initial = (row.name.trim()[0] ?? "?").toUpperCase();
            return (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-lg border border-black/8 bg-white px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-rose/20">
                    <span className="text-[12px] text-rose">{initial}</span>
                  </div>
                  <p className="text-[12px] text-text">
                    {row.name || "Без имени"}
                  </p>
                </div>
                <span className="rounded-pill bg-black/[0.04] px-2 py-1 text-[9px] text-text-muted">
                  в процессе
                </span>
              </div>
            );
          })}
        </FadeIn>
      ) : null}
    </main>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-black/8 bg-white px-4 py-4 text-center">
      <p className="text-[20px] leading-none text-text">{value}</p>
      <p className="mt-1 text-[9px] text-text-muted">{label}</p>
    </div>
  );
}
