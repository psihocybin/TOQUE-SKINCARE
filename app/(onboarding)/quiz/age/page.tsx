import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 7 — Квиз: Возраст"
      backHref="/quiz/name"
      links={[{ href: "/quiz/goal", label: "→ /quiz/goal" }, { href: "/quiz/name", label: "← /quiz/name" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
