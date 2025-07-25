import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/users",
  "/admin",
  "/tickets",
  "/teams",
  "/departments",
  "/calendar",
  "/protected",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/users/:path*",
    "/admin/:path*",
    "/tickets/:path*",
    "/teams/:path*",
    "/departments/:path*",
    "/calendar/:path*",
    "/protected/:path*",
  ],
};
