import { NextResponse, type NextRequest } from "next/server";
import { normalizeLang } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const queryLanguage = normalizeLang(request.nextUrl.searchParams.get("lang"));
  const cookieLanguage = normalizeLang(request.cookies.get("daner-language")?.value);
  const lang = queryLanguage ?? cookieLanguage ?? "ro";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-daner-language", lang);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (queryLanguage && queryLanguage !== cookieLanguage) {
    response.cookies.set("daner-language", queryLanguage, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
