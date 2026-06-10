import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 16 — Настройки"
      backHref="/profile"
      links={[{ href: "/settings/time", label: "→ /settings/time" }, { href: "/profile", label: "← /profile" }]}
      note="Заглушка. Реализация на ступени 9."
    />
  );
}
