import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JcsForm } from "@/components/surveys/jcs-form";

export default async function JcsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col pt-8">
      <JcsForm />
    </main>
  );
}
