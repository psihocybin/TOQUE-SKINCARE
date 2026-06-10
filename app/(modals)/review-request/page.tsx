import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 32 — Запрос отзыва на МП (день 90)"
      backHref="/home"
      links={[{ href: "/home", label: "→ /home" }]}
      note="Заглушка. Реализация на ступени 11."
    />
  );
}
