import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран 25 — Регистрация гарантии"
      backHref="/profile"
      links={[{ href: "/profile", label: "← /profile" }]}
      note="Заглушка. Реализация на ступени 9."
    />
  );
}
