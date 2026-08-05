import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

// Префиксы, доступные только авторизованным.
const PROTECTED_PREFIXES = [
  "/home",
  "/ritual",
  "/ritual-home",
  "/ritual-builder",
  "/tutorials",
  "/achievements",
  "/journal",
  "/progress",
  "/profile",
  "/settings",
  "/support",
  "/ecosystem",
  "/referrals",
  "/warranty",
  "/my-program",
  "/my-devices",
  "/about",
];

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // До настройки .env.local пропускаем всё мимо — auth-защита включается, когда ключи появятся.
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Единственная защита: незалогиненный не может попасть в (main)/*.
  // /login, /welcome, /splash, /quiz/* — открыты для всех, включая залогиненных
  // (чтобы можно было перепройти квиз без петли). Куда идти после логина —
  // определяют /auth/callback и /home сами.
  if (!user && matches(pathname, PROTECTED_PREFIXES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
