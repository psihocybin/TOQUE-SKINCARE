import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 23 — Моя программа (30 дней)"
      backHref="/profile"
      links={[{ href: "/profile", label: "← /profile" }]}
      note="Заглушка. Реализация на ступени 8."
    />
  );
}
