import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 21 — Подарок-Welcome"
      backHref="/welcome"
      links={[{ href: "/quiz/name", label: "→ /quiz/name" }, { href: "/welcome", label: "→ /welcome" }]}
      note="Заглушка. Реализация на ступени 4."
    />
  );
}
