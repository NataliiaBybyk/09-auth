

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value; // Получаем refreshToken, проверяем его существование

  const { pathname } = req.nextUrl;
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Если нет accessToken
  if (!accessToken) {
    // Проверяем, существует ли refreshToken
    if (refreshToken) {
      try {
        // Проверяем сессию с помощью refreshToken
        const res = await checkServerSession(); // Теперь res содержит и данные, и заголовки
        const setCookie = res.headers["set-cookie"]; // Получаем заголовки из ответа

        if (setCookie) {
          const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          // Разбираем и устанавливаем cookies
          for (const cookieStr of cookiesArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed["Max-Age"]),
            };

            // Устанавливаем cookies для accessToken и refreshToken
            if (parsed.accessToken) cookieStore.set("accessToken", parsed.accessToken, options);
            if (parsed.refreshToken) cookieStore.set("refreshToken", parsed.refreshToken, options);
          }

          // Если текущий маршрут публичный, редиректим на профиль
          if (isPublicRoute) {
            return NextResponse.redirect(new URL("/profile", req.url), {
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }

          // Если текущий маршрут приватный, продолжаем выполнение
          if (isPrivateRoute) {
            return NextResponse.next({
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
        }
      } catch (error) {
        console.error("Error during session validation:", error);
      }
    }

    // Если нет refreshToken
    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Если пользователь уже авторизован, не даем зайти на публичные страницы
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Если текущий маршрут приватный и пользователь авторизован, пропускаем
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};