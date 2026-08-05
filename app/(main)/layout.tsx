import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/components/shared/bottom-nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Единственная проверка на уровне layout — авторизация. Не проверяем
  // заполненность профиля здесь, иначе получаем петлю /home ↔ /quiz/device.
  // Логика «прошёл ли квиз» живёт только на /home.
  if (!user) {
    redirect("/login");
  }

  return (
    <PhoneFrame>
      {children}
      <BottomNav />
    </PhoneFrame>
  );
}
