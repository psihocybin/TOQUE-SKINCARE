import { StubScreen } from "@/components/shared/stub-screen";

export default function Page() {
  return (
    <StubScreen
      title="Экран — Авторизация (magic link)"
      backHref="/splash"
      links={[{ href: "/home", label: "→ /home" }]}
      note="Заглушка. Реализация на ступени 6."
    />
  );
}
