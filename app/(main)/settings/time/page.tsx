import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 24 — Выбор времени напоминаний"
      backHref="/settings"
      links={[{ href: "/settings", label: "← /settings" }]}
      note="Заглушка. Реализация на ступени 9."
    />
  );
}
