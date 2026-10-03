import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/auth/signup
// Регистрация по email+паролю без подтверждения почты: пользователь создаётся
// сразу подтверждённым, после чего клиент делает обычный signInWithPassword.
// Если аккаунт уже есть, но остался неподтверждённым (зарегистрирован раньше,
// когда подтверждение было обязательным), и пароль введён верно — подтверждаем его.
export async function POST(req: NextRequest) {
  let email: string;
  let password: string;
  try {
    const body = (await req.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (!email || password.length < 6) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (!createError) return NextResponse.json({ ok: true });

  if (createError.code !== "email_exists" && !/already/i.test(createError.message)) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const confirmed = await confirmIfPasswordMatches(email, password);
  if (confirmed) return NextResponse.json({ ok: true });

  return NextResponse.json({ error: "already_registered" }, { status: 409 });
}

// Подтверждает существующего неподтверждённого пользователя, но только если
// пароль верный: GoTrue проверяет пароль раньше, чем статус подтверждения,
// поэтому ответ email_not_confirmed означает, что пароль совпал.
async function confirmIfPasswordMatches(email: string, password: string) {
  const anon = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await anon.auth.signInWithPassword({ email, password });
  if (data.session) {
    await anon.auth.signOut();
    return true;
  }
  if (error?.code !== "email_not_confirmed") return false;

  const admin = createAdminClient();
  for (let page = 1; ; page++) {
    const { data: list, error: listError } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (listError || list.users.length === 0) return false;
    const user = list.users.find((u) => u.email?.toLowerCase() === email);
    if (user) {
      const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });
      return !updateError;
    }
    if (list.users.length < 1000) return false;
  }
}
