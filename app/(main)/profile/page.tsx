import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 15 — Профиль"
      links={[{ href: "/settings", label: "→ /settings" }, { href: "/support", label: "→ /support" }, { href: "/ecosystem", label: "→ /ecosystem" }, { href: "/warranty", label: "→ /warranty" }, { href: "/my-program", label: "→ /my-program" }, { href: "/referrals", label: "→ /referrals" }]}
      note="Заглушка. Реализация на ступени 8."
    />
  );
}
