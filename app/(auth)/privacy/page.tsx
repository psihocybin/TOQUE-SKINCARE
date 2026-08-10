import Link from "next/link";

// Реальный текст политики конфиденциальности должна предоставить команда
// TOQUE (юридический документ, не то, что можно сочинить в коде) — здесь
// честная заглушка вместо 404, на которую ссылается экран логина.
export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col px-6 py-8">
      <Link href="/login" className="text-[12px] text-text-muted">
        ← Назад
      </Link>

      <h1 className="mt-6 text-[18px] font-bold text-text">
        Политика конфиденциальности
      </h1>
      <p className="mt-3 text-[13px] leading-relaxed text-text-muted">
        Страница ещё не заполнена — окончательный текст политики
        конфиденциальности готовит команда TOQUE. Актуальную версию можно
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
