import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран — Обработка magic link"
      backHref="/login"
      body="Проверяем ссылку…"
      note="Заглушка. Реализация на ступени 6."
    />
  );
}
