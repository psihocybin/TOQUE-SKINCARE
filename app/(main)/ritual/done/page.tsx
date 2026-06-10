import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 17 — Завершение процедуры"
      backHref="/ritual"
      links={[{ href: "/home", label: "→ /home" }, { href: "/support", label: "→ /support" }]}
      note="Заглушка. Реализация на ступени 7."
    />
  );
}
