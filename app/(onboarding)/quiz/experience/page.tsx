import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 10 — Квиз: Опыт"
      backHref="/quiz/skin"
      links={[{ href: "/quiz/schedule", label: "→ /quiz/schedule" }, { href: "/quiz/skin", label: "← /quiz/skin" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
