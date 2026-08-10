import Link from "next/link";

// См. комментарий в app/(auth)/privacy/page.tsx — тот же принцип: честная
// заглушка вместо 404, реальный юридический текст не сочиняется в коде.
export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col px-6 py-8">
      <Link href="/login" className="text-[12px] text-text-muted">
        ← Назад
      </Link>

      <h1 className="mt-6 text-[18px] font-bold text-text">
        Условия использования
      </h1>
      <p className="mt-3 text-[13px] leading-relaxed text-text-muted">
        Страница ещё не заполнена — окончательный текст условий
        использования готовит команда TOQUE. Актуальную версию можно
        запросить в поддержке:{" "}
        <a
          href="https://t.me/Toque_team"
          className="text-olive underline underline-offset-4"
        >
          t.me/Toque_team
        </a>
        .
      </p>
    </main>
  );
}
