import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 1 — Welcome"
      backHref="/splash"
      links={[{ href: "/quiz/name", label: "→ /quiz/name" }, { href: "/gift-welcome", label: "→ /gift-welcome" }]}
      note="Заглушка. Реализация на ступени 4."
    />
  );
}
