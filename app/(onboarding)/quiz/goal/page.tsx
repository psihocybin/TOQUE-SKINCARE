import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 8 — Квиз: Главная задача"
      backHref="/quiz/age"
      links={[{ href: "/quiz/skin", label: "→ /quiz/skin" }, { href: "/quiz/age", label: "← /quiz/age" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
