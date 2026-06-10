import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 2 — Главная (Dashboard)"
      links={[{ href: "/ritual", label: "→ /ritual" }, { href: "/journal", label: "→ /journal" }, { href: "/progress", label: "→ /progress" }, { href: "/profile", label: "→ /profile" }]}
      note="Заглушка. Реализация на ступени 7."
    />
  );
}
