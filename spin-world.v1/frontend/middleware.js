import { NextResponse } from "next/server";
import { getTokenFromLocalStorage } from "./app/utils/api";

export function middleware(req) {
  const token = getTokenFromLocalStorage;

  // Protect routes under `/dashboard`
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
