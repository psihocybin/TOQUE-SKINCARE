import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 11 — Квиз: Время и ритм"
      backHref="/quiz/experience"
      links={[{ href: "/quiz/done", label: "→ /quiz/done" }, { href: "/quiz/experience", label: "← /quiz/experience" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
