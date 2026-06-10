import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 26 — NPS-опрос (день 30)"
      backHref="/home"
      links={[{ href: "/home", label: "→ /home" }]}
      note="Заглушка. Реализация на ступени 9."
    />
  );
}
