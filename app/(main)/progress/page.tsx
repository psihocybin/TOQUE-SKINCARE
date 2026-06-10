import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 4 — Прогресс"
      links={[{ href: "/journal", label: "→ /journal" }, { href: "/profile", label: "→ /profile" }]}
      note="Заглушка. Реализация на ступени 8."
    />
  );
}
