import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 12 — Финал квиза"
      backHref="/quiz/schedule"
      links={[{ href: "/home", label: "→ /home" }]}
      note="Заглушка. Реализация на ступени 5."
    />
  );
}
