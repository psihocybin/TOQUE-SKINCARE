import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 9 — Квиз: Тип кожи"
      backHref="/quiz/goal"
      links={[{ href: "/quiz/experience", label: "→ /quiz/experience" }, { href: "/quiz/goal", label: "← /quiz/goal" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
