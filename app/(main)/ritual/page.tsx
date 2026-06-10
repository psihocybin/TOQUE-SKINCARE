import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 3 — Сегодняшний ритуал"
      backHref="/home"
      links={[{ href: "/ritual/video", label: "→ /ritual/video" }, { href: "/ritual/done", label: "→ /ritual/done" }, { href: "/home", label: "← /home" }]}
      note="Заглушка. Реализация на ступени 7."
    />
  );
}
