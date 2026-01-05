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

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  /**
   * 1. Немає accessToken
   */
  if (!accessToken) {
    /**
     * Є refreshToken → пробуємо оновити сесію
     */
    if (refreshToken) {
      try {
        const res = await checkServerSession();

        const setCookie = res.headers["set-cookie"];

        if (setCookie) {
          const response = NextResponse.next();

          const cookiesArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookiesArray) {
            const parsed = parse(cookieStr);

            response.cookies.set({
              name: parsed.accessToken ? "accessToken" : "refreshToken",
              value: parsed.accessToken ?? parsed.refreshToken ?? "",
              httpOnly: true,
              path: "/",
              maxAge: parsed["Max-Age"]
                ? Number(parsed["Max-Age"])
                : undefined,
            });
          }

          // якщо після оновлення користувач на auth-сторінці → на головну
          if (isPublicRoute) {
            return NextResponse.redirect(new URL("/", req.url));
          }

          return response;
        }
      } catch {
        /**
         * refreshToken невалідний
         */
        if (isPrivateRoute) {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      }
    }

    /**
     * Немає accessToken і немає/невалідний refreshToken
     */
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
  }

  /**
   * 2. Користувач авторизований
   */
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};


