import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 13 — Видеоплеер"
      backHref="/ritual"
      links={[{ href: "/ritual", label: "← /ritual" }]}
      note="Заглушка. Реализация на ступени 7."
    />
  );
}
