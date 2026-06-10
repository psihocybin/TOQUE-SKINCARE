import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 27 — JCS-опрос (день 60)"
      backHref="/home"
      links={[{ href: "/home", label: "→ /home" }]}
      note="Заглушка. Реализация на ступени 9."
    />
  );
}
