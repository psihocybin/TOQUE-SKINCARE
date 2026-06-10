import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 6 — Квиз: Имя"
      backHref="/welcome"
      links={[{ href: "/quiz/age", label: "→ /quiz/age" }, { href: "/welcome", label: "← /welcome" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
