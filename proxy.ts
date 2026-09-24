import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/") {
    const locale =
      request.cookies.get("ys-locale")?.value === "fa" ? "fa" : "en";
    return NextResponse.redirect(new URL("/" + locale, request.url));
  }
  const locale = path.startsWith("/fa") ? "fa" : "en";
  const h = new Headers(request.headers);
  h.set("x-portfolio-locale", locale);
  return NextResponse.next({ request: { headers: h } });
}
export const config = {
  matcher: ["/((?!api|_next|media|fonts|og.png|robots.txt|sitemap.xml|cv).*)"],
};
