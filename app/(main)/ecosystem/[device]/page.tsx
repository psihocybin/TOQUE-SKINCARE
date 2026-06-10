import { StubScreen } from "@/components/shared/stub-screen";

export default function DevicePage({
  params,
}: {
  params: { device: string };
}) {
  return (
    <StubScreen
      title={`Экран 29 — ${params.device}`}
      backHref="/ecosystem"
      links={[{ href: "/ecosystem", label: "← /ecosystem" }]}
      note="Заглушка. Реализация на ступени 11."
    />
  );
}
