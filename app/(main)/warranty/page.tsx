import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { WarrantyShield } from "@/components/warranty/warranty-shield";
import { WarrantyForm } from "@/components/warranty/warranty-form";
import { getProfileWithStats } from "@/lib/queries/profile";

const WARRANTY_YEARS = 2;
const MONTHS_RU = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
] as const;

function formatExpiryFromActivation(activationIso: string): string | null {
  // activationIso из колонки `date`: "YYYY-MM-DD".
  const [yyyy, mm, dd] = activationIso.split("-");
  if (!yyyy || !mm || !dd) return null;
  const year = Number(yyyy) + WARRANTY_YEARS;
  const monthIdx = Number(mm) - 1;
  const month = MONTHS_RU[monthIdx] ?? mm;
  return `${Number(dd)} ${month} ${year}`;
}

function formatActivation(isoDate: string): string {
  // isoDate из колонки `date`: "YYYY-MM-DD".
  const [yyyy, mm, dd] = isoDate.split("-");
  if (!yyyy || !mm || !dd) return isoDate;
  const monthIdx = Number(mm) - 1;
  const month = MONTHS_RU[monthIdx] ?? mm;
  return `${Number(dd)} ${month} ${yyyy}`;
}

export default async function WarrantyPage() {
  const { profile } = await getProfileWithStats();
  const isActive = Boolean(profile.warranty_serial);

  return (
    <main className="flex min-h-screen flex-col pb-12 pt-4">
      <header className="relative flex items-center justify-center px-4">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Гарантия</p>
      </header>

      <FadeIn className="mt-8 flex justify-center">
        <WarrantyShield emphasized={isActive} />
      </FadeIn>

      {isActive ? (
        <FadeIn delay={0.15} className="mt-6 px-5 text-center">
          <h1 className="text-[15px] text-text">Гарантия зарегистрирована</h1>
          <p className="mt-3 font-mono text-[11px] text-text-muted">
            Серийный номер: {profile.warranty_serial}
          </p>
          {profile.activation_date ? (
            <>
              <p className="mt-1 text-[11px] text-text-muted">
                Активировано: {formatActivation(profile.activation_date)}
              </p>
              {(() => {
                const expiry = formatExpiryFromActivation(profile.activation_date);
                return expiry ? (
                  <p className="mt-1 text-[11px] text-text-muted">
                    Действует до {expiry}
                  </p>
                ) : null;
              })()}
            </>
          ) : null}
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.15} className="mt-6 text-center">
            <h1 className="text-[15px] text-text">
              2 года защиты устройства
            </h1>
            <p className="mt-2 text-[11px] text-text-muted">
              Минута сейчас — спокойствие потом.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-10">
            <WarrantyForm />
          </FadeIn>
        </>
      )}
    </main>
  );
}
