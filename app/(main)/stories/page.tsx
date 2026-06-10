import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 31 — Истории клиентов (UGC)"
      backHref="/profile"
      links={[{ href: "/profile", label: "← /profile" }]}
      note="Заглушка. Реализация на ступени 11."
    />
  );
}
