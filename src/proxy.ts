import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/marketplace/:path*",
    "/course/:path*",
    "/dashboard/:path*",
    "/account/:path*",
  ],
};
