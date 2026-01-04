import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Если нет accessToken
  if (!accessToken) {
    if (refreshToken) {
      try {
        await checkServerSession(); // проверяем сессию и обновляем токены
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next(); // публичные и остальные маршруты доступны
  }

  // Пользователь авторизован
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url)); // редиректим на главную
  }

  // Приватные маршруты или любые остальные
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // добавили главную страницу
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
