import { PhoneFrame } from "@/components/shared/phone-frame";

export default function ModalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
