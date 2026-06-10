import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 28 — Экосистема TOQUE"
      backHref="/profile"
      links={[{ href: "/ecosystem/elara", label: "→ /ecosystem/elara" }, { href: "/ecosystem/lumera", label: "→ /ecosystem/lumera" }, { href: "/profile", label: "← /profile" }]}
      note="Заглушка. Реализация на ступени 11."
    />
  );
}
