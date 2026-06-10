import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 14 — Журнал процедур"
      links={[{ href: "/ritual", label: "→ /ritual" }, { href: "/progress", label: "→ /progress" }]}
      note="Заглушка. Реализация на ступени 8."
    />
  );
}
