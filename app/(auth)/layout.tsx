import { PhoneFrame } from "@/components/shared/phone-frame";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
